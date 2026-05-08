import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PageHero } from "@/components/PageHero";
import { Seo } from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { generateClientQuotePdf, type QuoteLine } from "@/lib/clientQuotePdf";
import { cn } from "@/lib/utils";

const HERO = "/gallery/wildebeest-crossing.jpg";

type PkgRow = {
  slug: string;
  title: string;
  price_from: number;
  duration: string;
  inclusions: string[] | null;
  exclusions: string[] | null;
};

const ADDONS = [
  { id: "airport_transfer", label: "Airport transfer (one way)", price: 40 },
  { id: "single_supp", label: "Single-room supplement (+15% on base)", price: 0, percent: 0.15 },
] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
});

const Quote = () => {
  const [params] = useSearchParams();
  const preselect = params.get("package") ?? "";

  const [packages, setPackages] = useState<PkgRow[]>([]);
  const [pkgSlug, setPkgSlug] = useState(preselect);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [travelDate, setTravelDate] = useState<Date | undefined>();
  const [days, setDays] = useState<number | "">("");
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from("packages")
      .select("slug,title,price_from,duration,inclusions,exclusions")
      .eq("published", true)
      .order("sort_order")
      .then(({ data }) => setPackages((data as PkgRow[]) ?? []));
  }, []);

  const selectedPkg = useMemo(() => packages.find((p) => p.slug === pkgSlug), [packages, pkgSlug]);

  const computation = useMemo(() => {
    const baseRate = selectedPkg?.price_from ?? 0;
    const adultsTotal = baseRate * adults;
    const childrenTotal = baseRate * 0.7 * children;
    const lines: QuoteLine[] = [];
    if (selectedPkg) {
      if (adults > 0) lines.push({ description: `${selectedPkg.title} — Adult`, pax: adults, rate: baseRate });
      if (children > 0) lines.push({ description: `${selectedPkg.title} — Child (under 12, 30% off)`, pax: children, rate: +(baseRate * 0.7).toFixed(2) });
    }
    let addonsTotal = 0;
    ADDONS.forEach((a) => {
      if (!addons[a.id]) return;
      if ("percent" in a && a.percent) {
        const amt = +(adultsTotal * a.percent).toFixed(2);
        addonsTotal += amt;
        lines.push({ description: a.label, pax: 1, rate: amt });
      } else if (a.price) {
        const amt = a.price * Math.max(adults + children, 1);
        addonsTotal += amt;
        lines.push({ description: `${a.label} (per person)`, pax: adults + children, rate: a.price });
      }
    });
    const total = adultsTotal + childrenTotal + addonsTotal;
    return { lines, total };
  }, [selectedPkg, adults, children, addons]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.errors[0]?.message ?? "Check the form"); return; }
    if (!selectedPkg) { toast.error("Please choose a package"); return; }
    if (adults < 1) { toast.error("At least 1 adult required"); return; }

    setSubmitting(true);
    const travelStr = travelDate ? format(travelDate, "PPP") : undefined;
    const summary = `Self-quote estimate: USD ${computation.total.toFixed(2)} | ${selectedPkg.title} | ${adults} adults${children ? ` + ${children} children` : ""}${days ? ` | ${days} days` : ""}${form.notes ? ` | Notes: ${form.notes}` : ""}`;

    await supabase.from("quote_requests").insert([{
      name: form.name, email: form.email,
      phone: form.phone || null, country: form.country || null,
      travel_dates: travelStr ?? null,
      group_size: `${adults} adults${children ? ` + ${children} children` : ""}`,
      package_interest: selectedPkg.title,
      budget: `USD ${computation.total.toFixed(2)} (estimate)`,
      message: summary,
    }]);

    try {
      await generateClientQuotePdf({
        name: form.name,
        email: form.email,
        phone: form.phone,
        country: form.country,
        packageTitle: selectedPkg.title,
        travelDate: travelStr,
        days: typeof days === "number" ? days : undefined,
        adults, children,
        lines: computation.lines,
        notes: form.notes,
        inclusions: selectedPkg.inclusions ?? [],
        exclusions: selectedPkg.exclusions ?? [],
      });
      toast.success("Your quote PDF is downloading. Our team will follow up within 24 hours.");
    } catch (err) {
      console.error(err);
      toast.error("Could not generate PDF. We've still received your request.");
    }
    setSubmitting(false);
  };

  return (
    <>
      <Seo
        title="Build Your Kenya Safari Quote — Karembo Tours"
        description="Get an instant Kenya safari quote. Pick a package, choose dates and group size, and download a branded PDF quote in seconds."
        path="/quote"
      />
      <PageHero
        image={HERO}
        eyebrow="Instant pricing"
        title="Build Your Quote"
        subtitle="Choose a package, tell us your group size, and download a branded quote PDF instantly."
      />

      <section className="py-16">
        <div className="container-edge grid lg:grid-cols-3 gap-8">
          <form onSubmit={onSubmit} className="lg:col-span-2 bg-card rounded-xl shadow-card p-6 md:p-8 space-y-6">
            {/* Package */}
            <div>
              <Label htmlFor="package">Package *</Label>
              <select
                id="package"
                value={pkgSlug}
                onChange={(e) => setPkgSlug(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">— Choose a package —</option>
                {packages.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.title} — from ${p.price_from}</option>
                ))}
              </select>
              {selectedPkg && (
                <p className="text-xs text-muted-foreground mt-2">{selectedPkg.duration} · From ${selectedPkg.price_from} per adult</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="adults">Adults *</Label>
                <Input id="adults" type="number" min={1} max={30} value={adults}
                  onChange={(e) => setAdults(Math.max(1, Math.min(30, Number(e.target.value) || 1)))} />
              </div>
              <div>
                <Label htmlFor="children">Children (under 12)</Label>
                <Input id="children" type="number" min={0} max={20} value={children}
                  onChange={(e) => setChildren(Math.max(0, Math.min(20, Number(e.target.value) || 0)))} />
              </div>
              <div>
                <Label>Travel start date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" className={cn("w-full justify-start text-left font-normal", !travelDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {travelDate ? format(travelDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={travelDate} onSelect={setTravelDate}
                      disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                      initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="days">Number of days</Label>
                <Input id="days" type="number" min={1} max={30} value={days}
                  placeholder="Leave blank for package default"
                  onChange={(e) => setDays(e.target.value === "" ? "" : Math.max(1, Math.min(30, Number(e.target.value))))} />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Optional add-ons</Label>
              <div className="space-y-2">
                {ADDONS.map((a) => (
                  <label key={a.id} className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-sand cursor-pointer">
                    <Checkbox checked={!!addons[a.id]} onCheckedChange={(v) => setAddons((s) => ({ ...s, [a.id]: !!v }))} />
                    <span className="text-sm flex-1">{a.label}</span>
                    <span className="text-sm font-semibold text-secondary">
                      {"percent" in a && a.percent ? `+${Math.round(a.percent * 100)}%` : `+$${a.price}/pp`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="name">Full name *</Label>
                <Input id="name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} maxLength={100} />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} maxLength={255} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} maxLength={40} />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} maxLength={80} />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes / special requests</Label>
              <Textarea id="notes" rows={4} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} maxLength={1500} />
            </div>

            <Button type="submit" size="lg" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full sm:w-auto">
              <Download className="mr-2 h-5 w-5" />
              {submitting ? "Preparing PDF..." : "Generate & Download Quote PDF"}
            </Button>
          </form>

          {/* Sticky total */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-primary text-primary-foreground rounded-xl shadow-elegant p-6 space-y-4">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Live estimate</span>
              </div>

              {selectedPkg ? (
                <>
                  <p className="font-serif text-lg leading-snug">{selectedPkg.title}</p>
                  <div className="space-y-2 text-sm border-y border-white/15 py-3">
                    {computation.lines.map((l, i) => (
                      <div key={i} className="flex justify-between gap-3">
                        <span className="text-white/80 truncate">{l.description}</span>
                        <span className="font-semibold whitespace-nowrap">${(l.pax * l.rate).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-white/70">Total estimate</span>
                    <span className="font-serif text-3xl text-accent">USD {computation.total.toFixed(0)}</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-white/80">Pick a package to see your live estimate.</p>
              )}

              <p className="text-[11px] text-white/60 leading-relaxed">
                Estimate based on standard package rates. Park entry fees may apply where not listed. A travel designer will confirm exact pricing within 24 hours.
              </p>

              <Link to="/contact" className="block text-center text-xs text-accent hover:underline">
                Prefer to chat? Contact us instead →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default Quote;
