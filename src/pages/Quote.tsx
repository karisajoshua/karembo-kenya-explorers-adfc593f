import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, Download, Sparkles, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PageHero } from "@/components/PageHero";
import { Seo } from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { generateClientQuotePdf, type QuoteLine } from "@/lib/clientQuotePdf";
import { PARK_FEES, RESIDENCY_LABELS, type Residency } from "@/data/parkFees";
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

type Addon =
  | { id: string; label: string; kind: "perPerson"; price: number }
  | { id: string; label: string; kind: "flat"; price: number }
  | { id: string; label: string; kind: "percent"; percent: number }
  | { id: string; label: string; kind: "adultChild"; adult: number; child: number };

const ADDONS: Addon[] = [
  { id: "joining_transport", label: "Joining Nairobi tours transport", kind: "perPerson", price: 40 },
  { id: "private_transport", label: "Private tour transport (per vehicle)", kind: "flat", price: 200 },
  { id: "elephant_orphanage", label: "Elephant Orphanage entry", kind: "adultChild", adult: 20, child: 10 },
  { id: "airport_transfer", label: "Airport transfer (one way)", kind: "perPerson", price: 40 },
  { id: "single_supp", label: "Single-room supplement (+15% on base)", kind: "percent", percent: 0.15 },
];

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
});

type ParkSel = { name: string; adults: number; children: number };

type CustomItem = {
  id: string;
  kind: "destination" | "transport";
  label: string;
  mode: "perPerson" | "flat";
  adult: number;
  child: number;
  flat: number;
  adults: number;
  children: number;
};

let cidSeq = 0;
const newCid = () => `c${Date.now()}_${++cidSeq}`;

const Quote = () => {
  const [params] = useSearchParams();
  const preselect = params.get("package") ?? "";

  const [packages, setPackages] = useState<PkgRow[]>([]);
  const [pkgSlug, setPkgSlug] = useState(preselect);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [residency, setResidency] = useState<Residency>("non_resident");
  const [parkSel, setParkSel] = useState<ParkSel[]>([]);
  const [parkPicker, setParkPicker] = useState("");
  const [travelDate, setTravelDate] = useState<Date | undefined>();
  const [days, setDays] = useState<number | "">("");
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
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

  const addPark = (name: string) => {
    if (!name) return;
    if (parkSel.some((p) => p.name === name)) return;
    setParkSel((s) => [...s, { name, adults, children }]);
    setParkPicker("");
  };
  const removePark = (name: string) => setParkSel((s) => s.filter((p) => p.name !== name));
  const updatePark = (name: string, key: "adults" | "children", v: number) =>
    setParkSel((s) => s.map((p) => (p.name === name ? { ...p, [key]: Math.max(0, v) } : p)));

  const computation = useMemo(() => {
    const baseRate = selectedPkg?.price_from ?? 0;
    const adultsTotal = baseRate * adults;
    const childrenTotal = baseRate * 0.7 * children;
    const lines: QuoteLine[] = [];
    if (selectedPkg) {
      if (adults > 0) lines.push({ description: `${selectedPkg.title} — Adult`, pax: adults, rate: baseRate });
      if (children > 0) lines.push({ description: `${selectedPkg.title} — Child (under 12, 30% off)`, pax: children, rate: +(baseRate * 0.7).toFixed(2) });
    }

    // Park fees
    let parkFeesTotal = 0;
    parkSel.forEach((sel) => {
      const fee = PARK_FEES.find((p) => p.name === sel.name);
      if (!fee) return;
      const ar = fee.rates[residency].adult;
      const cr = fee.rates[residency].child;
      if (sel.adults > 0) {
        const amt = +(ar * sel.adults).toFixed(2);
        parkFeesTotal += amt;
        lines.push({ description: `${sel.name} — Adult entry (${RESIDENCY_LABELS[residency]})`, pax: sel.adults, rate: ar });
      }
      if (sel.children > 0) {
        const amt = +(cr * sel.children).toFixed(2);
        parkFeesTotal += amt;
        lines.push({ description: `${sel.name} — Child entry (${RESIDENCY_LABELS[residency]})`, pax: sel.children, rate: cr });
      }
    });

    let addonsTotal = 0;
    ADDONS.forEach((a) => {
      if (!addons[a.id]) return;
      if (a.kind === "percent") {
        const amt = +(adultsTotal * a.percent).toFixed(2);
        addonsTotal += amt;
        lines.push({ description: a.label, pax: 1, rate: amt });
      } else if (a.kind === "perPerson") {
        const pax = adults + children;
        if (pax < 1) return;
        addonsTotal += a.price * pax;
        lines.push({ description: `${a.label} (per person)`, pax, rate: a.price });
      } else if (a.kind === "flat") {
        addonsTotal += a.price;
        lines.push({ description: a.label, pax: 1, rate: a.price });
      } else if (a.kind === "adultChild") {
        if (adults > 0) {
          addonsTotal += a.adult * adults;
          lines.push({ description: `${a.label} — Adult`, pax: adults, rate: a.adult });
        }
        if (children > 0) {
          addonsTotal += a.child * children;
          lines.push({ description: `${a.label} — Child`, pax: children, rate: a.child });
        }
      }
    });

    // Custom destinations + transport
    let customTotal = 0;
    customItems.forEach((ci) => {
      const prefix = ci.kind === "transport" ? "Transport — " : "";
      const label = `${prefix}${ci.label || (ci.kind === "transport" ? "Custom transport" : "Custom destination")}`;
      if (ci.mode === "flat") {
        if (ci.flat > 0) {
          customTotal += ci.flat;
          lines.push({ description: `${label} (flat)`, pax: 1, rate: +ci.flat.toFixed(2) });
        }
      } else {
        if (ci.adults > 0 && ci.adult > 0) {
          customTotal += ci.adult * ci.adults;
          lines.push({ description: `${label} — Adult`, pax: ci.adults, rate: +ci.adult.toFixed(2) });
        }
        if (ci.children > 0 && ci.child > 0) {
          customTotal += ci.child * ci.children;
          lines.push({ description: `${label} — Child`, pax: ci.children, rate: +ci.child.toFixed(2) });
        }
      }
    });

    const total = adultsTotal + childrenTotal + parkFeesTotal + addonsTotal + customTotal;
    return { lines, total, parkFeesTotal };
  }, [selectedPkg, adults, children, addons, parkSel, residency, customItems]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.errors[0]?.message ?? "Check the form"); return; }
    if (adults < 1) { toast.error("At least 1 adult required"); return; }
    if (!selectedPkg && customItems.length === 0 && parkSel.length === 0) {
      toast.error("Pick a package or add at least one custom destination/transport");
      return;
    }

    setSubmitting(true);
    const travelStr = travelDate ? format(travelDate, "PPP") : undefined;
    const tripTitle = selectedPkg?.title ?? "Custom Kenya Trip";
    const customSummary = customItems.length
      ? ` | Custom: ${customItems.map((c) => `${c.kind}:${c.label}(${c.mode === "flat" ? `$${c.flat} flat` : `$${c.adult}A/$${c.child}C × ${c.adults}A/${c.children}C`})`).join("; ")}`
      : "";
    const summary = `Self-quote: USD ${computation.total.toFixed(2)} | ${tripTitle} | ${adults}A+${children}C | Residency: ${RESIDENCY_LABELS[residency]}${parkSel.length ? ` | Parks: ${parkSel.map((p) => `${p.name} (${p.adults}A/${p.children}C)`).join("; ")}` : ""}${customSummary}${form.notes ? ` | Notes: ${form.notes}` : ""}`;

    await supabase.from("quote_requests").insert([{
      name: form.name, email: form.email,
      phone: form.phone || null, country: form.country || null,
      travel_dates: travelStr ?? null,
      group_size: `${adults} adults${children ? ` + ${children} children` : ""} (${RESIDENCY_LABELS[residency]})`,
      package_interest: tripTitle,
      budget: `USD ${computation.total.toFixed(2)} (estimate)`,
      message: summary,
    }]);

    try {
      await generateClientQuotePdf({
        name: form.name,
        email: form.email,
        phone: form.phone,
        country: form.country,
        packageTitle: tripTitle,
        travelDate: travelStr,
        days: typeof days === "number" ? days : undefined,
        adults, children,
        residency: RESIDENCY_LABELS[residency],
        lines: computation.lines,
        notes: form.notes,
        inclusions: selectedPkg?.inclusions ?? [],
        exclusions: selectedPkg?.exclusions ?? [],
      });
      toast.success("Your quote PDF is downloading. Our team will follow up within 24 hours.");
    } catch (err) {
      console.error(err);
      toast.error("Could not generate PDF. We've still received your request.");
    }
    setSubmitting(false);
  };

  const availableParks = PARK_FEES.filter((p) => !parkSel.some((s) => s.name === p.name));

  return (
    <>
      <Seo
        title="Build Your Kenya Safari Quote — Karembo Tours"
        description="Get an instant Kenya safari quote. Pick a package, choose dates, group size and park entry fees, then download a branded PDF quote in seconds."
        path="/quote"
      />
      <PageHero
        image={HERO}
        eyebrow="Instant pricing"
        title="Build Your Quote"
        subtitle="Choose a package, tell us your group size, add park entries — download a branded quote PDF instantly."
      />

      <section className="py-16">
        <div className="container-edge grid lg:grid-cols-3 gap-8">
          <form onSubmit={onSubmit} className="lg:col-span-2 bg-card rounded-xl shadow-card p-6 md:p-8 space-y-6">
            {/* Package */}
            <div>
              <Label htmlFor="package">Package (optional)</Label>
              <select
                id="package"
                value={pkgSlug}
                onChange={(e) => setPkgSlug(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">— Build a custom trip —</option>
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

            {/* Residency */}
            <div>
              <Label className="mb-2 block">Residency *</Label>
              <RadioGroup
                value={residency}
                onValueChange={(v) => setResidency(v as Residency)}
                className="grid sm:grid-cols-2 gap-2"
              >
                {(Object.keys(RESIDENCY_LABELS) as Residency[]).map((r) => (
                  <label key={r} className={cn(
                    "flex items-center gap-3 p-3 rounded-md border cursor-pointer transition",
                    residency === r ? "border-accent bg-sand" : "border-border hover:bg-sand/60"
                  )}>
                    <RadioGroupItem value={r} />
                    <span className="text-sm">{RESIDENCY_LABELS[r]}</span>
                  </label>
                ))}
              </RadioGroup>
              <p className="text-[11px] text-muted-foreground mt-1">Park gate fees vary by residency. ID required at the gate for non Non-Resident rates.</p>
            </div>

            {/* Park entries */}
            <div>
              <Label className="mb-2 block">Park entry fees (optional)</Label>
              <div className="flex gap-2">
                <select
                  value={parkPicker}
                  onChange={(e) => setParkPicker(e.target.value)}
                  className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">— Add a park or reserve —</option>
                  {availableParks.map((p) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <Button type="button" variant="outline" onClick={() => addPark(parkPicker)} disabled={!parkPicker}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              {parkSel.length > 0 && (
                <div className="mt-3 space-y-2">
                  {parkSel.map((sel) => {
                    const fee = PARK_FEES.find((p) => p.name === sel.name)!;
                    const ar = fee.rates[residency].adult;
                    const cr = fee.rates[residency].child;
                    const sub = ar * sel.adults + cr * sel.children;
                    return (
                      <div key={sel.name} className="rounded-md border border-border p-3 bg-sand/40">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="text-sm font-semibold text-primary">{sel.name}</p>
                          <button type="button" onClick={() => removePark(sel.name)} className="text-muted-foreground hover:text-destructive">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-end">
                          <div>
                            <Label className="text-xs">Adults @ ${ar.toFixed(2)}</Label>
                            <Input type="number" min={0} max={50} value={sel.adults}
                              onChange={(e) => updatePark(sel.name, "adults", Number(e.target.value) || 0)} />
                          </div>
                          <div>
                            <Label className="text-xs">Children @ ${cr.toFixed(2)}</Label>
                            <Input type="number" min={0} max={50} value={sel.children}
                              onChange={(e) => updatePark(sel.name, "children", Number(e.target.value) || 0)} />
                          </div>
                          <div className="text-right text-sm font-semibold text-secondary">
                            ${sub.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Custom destinations & transport */}
            {(["destination", "transport"] as const).map((kind) => {
              const items = customItems.filter((c) => c.kind === kind);
              const heading = kind === "destination" ? "Custom destinations / activities" : "Custom transport";
              const helper = kind === "destination"
                ? "Add any place or activity not listed above. Set your own price."
                : "Add transport for routes we don't list. Per-person or flat per vehicle.";
              const addItem = () =>
                setCustomItems((s) => [
                  ...s,
                  { id: newCid(), kind, label: "", mode: kind === "transport" ? "flat" : "perPerson",
                    adult: 0, child: 0, flat: 0, adults, children },
                ]);
              const update = (id: string, patch: Partial<CustomItem>) =>
                setCustomItems((s) => s.map((c) => (c.id === id ? { ...c, ...patch } : c)));
              const remove = (id: string) => setCustomItems((s) => s.filter((c) => c.id !== id));

              return (
                <div key={kind}>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="block">{heading}</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-2">{helper}</p>

                  {items.length > 0 && (
                    <div className="space-y-2">
                      {items.map((ci) => {
                        const sub = ci.mode === "flat"
                          ? ci.flat
                          : ci.adult * ci.adults + ci.child * ci.children;
                        return (
                          <div key={ci.id} className="rounded-md border border-border p-3 bg-sand/40 space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder={kind === "transport" ? "Route (e.g. Nairobi → Naivasha)" : "Place / activity name"}
                                value={ci.label}
                                onChange={(e) => update(ci.id, { label: e.target.value })}
                                maxLength={120}
                              />
                              <button type="button" onClick={() => remove(ci.id)} className="text-muted-foreground hover:text-destructive">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <RadioGroup
                              value={ci.mode}
                              onValueChange={(v) => update(ci.id, { mode: v as "perPerson" | "flat" })}
                              className="flex gap-4"
                            >
                              <label className="flex items-center gap-2 text-xs cursor-pointer">
                                <RadioGroupItem value="perPerson" /> Per person
                              </label>
                              <label className="flex items-center gap-2 text-xs cursor-pointer">
                                <RadioGroupItem value="flat" /> {kind === "transport" ? "Flat (per vehicle)" : "Flat fee"}
                              </label>
                            </RadioGroup>

                            {ci.mode === "flat" ? (
                              <div className="grid grid-cols-2 gap-2 items-end">
                                <div>
                                  <Label className="text-xs">Flat amount (USD)</Label>
                                  <Input type="number" min={0} value={ci.flat}
                                    onChange={(e) => update(ci.id, { flat: Math.max(0, Number(e.target.value) || 0) })} />
                                </div>
                                <div className="text-right text-sm font-semibold text-secondary">${sub.toFixed(2)}</div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-5 gap-2 items-end">
                                <div>
                                  <Label className="text-xs">Adult $</Label>
                                  <Input type="number" min={0} value={ci.adult}
                                    onChange={(e) => update(ci.id, { adult: Math.max(0, Number(e.target.value) || 0) })} />
                                </div>
                                <div>
                                  <Label className="text-xs">Adults</Label>
                                  <Input type="number" min={0} value={ci.adults}
                                    onChange={(e) => update(ci.id, { adults: Math.max(0, Number(e.target.value) || 0) })} />
                                </div>
                                <div>
                                  <Label className="text-xs">Child $</Label>
                                  <Input type="number" min={0} value={ci.child}
                                    onChange={(e) => update(ci.id, { child: Math.max(0, Number(e.target.value) || 0) })} />
                                </div>
                                <div>
                                  <Label className="text-xs">Children</Label>
                                  <Input type="number" min={0} value={ci.children}
                                    onChange={(e) => update(ci.id, { children: Math.max(0, Number(e.target.value) || 0) })} />
                                </div>
                                <div className="text-right text-sm font-semibold text-secondary">${sub.toFixed(2)}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div>
              <Label className="mb-2 block">Optional add-ons</Label>
              <div className="space-y-2">
                {ADDONS.map((a) => (
                  <label key={a.id} className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-sand cursor-pointer">
                    <Checkbox checked={!!addons[a.id]} onCheckedChange={(v) => setAddons((s) => ({ ...s, [a.id]: !!v }))} />
                    <span className="text-sm flex-1">{a.label}</span>
                    <span className="text-sm font-semibold text-secondary">
                      {a.kind === "percent" ? `+${Math.round(a.percent * 100)}%`
                        : a.kind === "perPerson" ? `+$${a.price}/pp`
                        : a.kind === "flat" ? `+$${a.price} flat`
                        : `+$${a.adult} adult / $${a.child} child`}
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
                  <p className="text-xs text-white/60">Residency: {RESIDENCY_LABELS[residency]}</p>
                  <div className="space-y-2 text-sm border-y border-white/15 py-3 max-h-72 overflow-y-auto">
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
                Estimate based on standard package and KWS rates. A travel designer will confirm exact pricing within 24 hours.
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
