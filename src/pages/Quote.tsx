
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Download,
  MapPin,
  Minus,
  Plus,
  Sparkles,
  Users,
  X,
  Plane,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Seo } from "@/components/Seo";

import { supabase } from "@/integrations/supabase/client";
import {
  generateClientQuotePdf,
  type QuoteLine,
} from "@/lib/clientQuotePdf";
import {
  PARK_FEES,
  RESIDENCY_LABELS,
  type Residency,
} from "@/data/parkFees";
import { cn } from "@/lib/utils";

const HERO = "/gallery/wildebeest-crossing.jpg";
const SITE_URL = "https://karembotours.co.ke";

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
  | {
      id: string;
      label: string;
      kind: "adultChild";
      adult: number;
      child: number;
    };

const ADDONS: Addon[] = [
  {
    id: "joining_transport",
    label: "Joining Nairobi tours transport",
    kind: "perPerson",
    price: 40,
  },
  {
    id: "private_transport",
    label: "Private tour transport (per vehicle)",
    kind: "flat",
    price: 200,
  },
  {
    id: "elephant_orphanage",
    label: "Elephant Orphanage entry",
    kind: "adultChild",
    adult: 20,
    child: 10,
  },
  {
    id: "airport_transfer",
    label: "Airport transfer (one way)",
    kind: "perPerson",
    price: 40,
  },
  {
    id: "single_supp",
    label: "Single-room supplement (+15% on base)",
    kind: "percent",
    percent: 0.15,
  },
];

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
});

type ParkSel = {
  name: string;
  adults: number;
  children: number;
};

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
const newCid = () => `custom-${Date.now()}-${++cidSeq}`;

const formatMoney = (amount: number) =>
  amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Quote = () => {
  const [params] = useSearchParams();
  const preselect = params.get("package") ?? "";

  const [packages, setPackages] = useState<PkgRow[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [pkgSlug, setPkgSlug] = useState(preselect);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [residency, setResidency] =
    useState<Residency>("non_resident");
  const [parkSel, setParkSel] = useState<ParkSel[]>([]);
  const [parkPicker, setParkPicker] = useState("");
  const [travelDate, setTravelDate] = useState<Date | undefined>();
  const [days, setDays] = useState<number | "">("");
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadPackages = async () => {
      setPackagesLoading(true);

      const { data, error } = await supabase
        .from("packages")
        .select("slug,title,price_from,duration,inclusions,exclusions")
        .eq("published", true)
        .order("sort_order");

      if (!active) return;

      if (error) {
        console.error("Could not load quote packages:", error);
        toast.error("Packages could not be loaded. You can still build a custom trip.");
      } else {
        setPackages((data as PkgRow[]) ?? []);
      }

      setPackagesLoading(false);
    };

    loadPackages();

    return () => {
      active = false;
    };
  }, []);

  const selectedPkg = useMemo(
    () => packages.find((pkg) => pkg.slug === pkgSlug),
    [packages, pkgSlug]
  );

  const addPark = (name: string) => {
    if (!name || parkSel.some((park) => park.name === name)) return;

    setParkSel((current) => [
      ...current,
      { name, adults, children },
    ]);
    setParkPicker("");
  };

  const removePark = (name: string) => {
    setParkSel((current) =>
      current.filter((park) => park.name !== name)
    );
  };

  const updatePark = (
    name: string,
    key: "adults" | "children",
    value: number
  ) => {
    setParkSel((current) =>
      current.map((park) =>
        park.name === name
          ? { ...park, [key]: Math.max(0, value) }
          : park
      )
    );
  };

  const computation = useMemo(() => {
    const baseRate = selectedPkg?.price_from ?? 0;
    const adultsTotal = baseRate * adults;
    const childrenTotal = baseRate * 0.7 * children;
    const lines: QuoteLine[] = [];

    if (selectedPkg) {
      if (adults > 0) {
        lines.push({
          description: `${selectedPkg.title} — Adult`,
          pax: adults,
          rate: baseRate,
        });
      }

      if (children > 0) {
        lines.push({
          description: `${selectedPkg.title} — Child (under 12, 30% off)`,
          pax: children,
          rate: +(baseRate * 0.7).toFixed(2),
        });
      }
    }

    let parkFeesTotal = 0;

    parkSel.forEach((selection) => {
      const fee = PARK_FEES.find(
        (park) => park.name === selection.name
      );

      if (!fee) return;

      const adultRate = fee.rates[residency].adult;
      const childRate = fee.rates[residency].child;

      if (selection.adults > 0) {
        const amount = +(adultRate * selection.adults).toFixed(2);
        parkFeesTotal += amount;

        lines.push({
          description: `${selection.name} — Adult entry (${RESIDENCY_LABELS[residency]})`,
          pax: selection.adults,
          rate: adultRate,
        });
      }

      if (selection.children > 0) {
        const amount = +(childRate * selection.children).toFixed(2);
        parkFeesTotal += amount;

        lines.push({
          description: `${selection.name} — Child entry (${RESIDENCY_LABELS[residency]})`,
          pax: selection.children,
          rate: childRate,
        });
      }
    });

    let addonsTotal = 0;

    ADDONS.forEach((addon) => {
      if (!addons[addon.id]) return;

      if (addon.kind === "percent") {
        const amount = +(adultsTotal * addon.percent).toFixed(2);
        addonsTotal += amount;

        lines.push({
          description: addon.label,
          pax: 1,
          rate: amount,
        });
      } else if (addon.kind === "perPerson") {
        const pax = adults + children;
        if (pax < 1) return;

        addonsTotal += addon.price * pax;

        lines.push({
          description: `${addon.label} (per person)`,
          pax,
          rate: addon.price,
        });
      } else if (addon.kind === "flat") {
        addonsTotal += addon.price;

        lines.push({
          description: addon.label,
          pax: 1,
          rate: addon.price,
        });
      } else if (addon.kind === "adultChild") {
        if (adults > 0) {
          addonsTotal += addon.adult * adults;

          lines.push({
            description: `${addon.label} — Adult`,
            pax: adults,
            rate: addon.adult,
          });
        }

        if (children > 0) {
          addonsTotal += addon.child * children;

          lines.push({
            description: `${addon.label} — Child`,
            pax: children,
            rate: addon.child,
          });
        }
      }
    });

    let customTotal = 0;

    customItems.forEach((item) => {
      const prefix =
        item.kind === "transport" ? "Transport — " : "";
      const label = `${prefix}${
        item.label ||
        (item.kind === "transport"
          ? "Custom transport"
          : "Custom destination")
      }`;

      if (item.mode === "flat") {
        if (item.flat > 0) {
          customTotal += item.flat;

          lines.push({
            description: `${label} (flat)`,
            pax: 1,
            rate: +item.flat.toFixed(2),
          });
        }
      } else {
        if (item.adults > 0 && item.adult > 0) {
          customTotal += item.adult * item.adults;

          lines.push({
            description: `${label} — Adult`,
            pax: item.adults,
            rate: +item.adult.toFixed(2),
          });
        }

        if (item.children > 0 && item.child > 0) {
          customTotal += item.child * item.children;

          lines.push({
            description: `${label} — Child`,
            pax: item.children,
            rate: +item.child.toFixed(2),
          });
        }
      }
    });

    const total =
      adultsTotal +
      childrenTotal +
      parkFeesTotal +
      addonsTotal +
      customTotal;

    return { lines, total, parkFeesTotal };
  }, [
    selectedPkg,
    adults,
    children,
    addons,
    parkSel,
    residency,
    customItems,
  ]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) return;

    const parsed = schema.safeParse(form);

    if (!parsed.success) {
      toast.error(
        parsed.error.errors[0]?.message ?? "Check your details"
      );
      return;
    }

    if (adults < 1) {
      toast.error("At least 1 adult is required");
      return;
    }

    if (!selectedPkg && customItems.length === 0 && parkSel.length === 0) {
      toast.error(
        "Choose a package or add at least one custom destination or transport option."
      );
      return;
    }

    setSubmitting(true);

    try {
      const travelStr = travelDate
        ? format(travelDate, "PPP")
        : undefined;

      const tripTitle = selectedPkg?.title ?? "Custom Kenya Trip";

      const customSummary = customItems.length
        ? ` | Custom: ${customItems
            .map((item) => {
              const label =
                item.label ||
                (item.kind === "transport"
                  ? "Custom transport"
                  : "Custom destination");

              return item.mode === "flat"
                ? `${item.kind}:${label} ($${item.flat} flat)`
                : `${item.kind}:${label} ($${item.adult}A/$${item.child}C × ${item.adults}A/${item.children}C)`;
            })
            .join("; ")}`
        : "";

      const summary = [
        `Self-quote: USD ${computation.total.toFixed(2)}`,
        tripTitle,
        `${adults} adults + ${children} children`,
        `Residency: ${RESIDENCY_LABELS[residency]}`,
        travelStr ? `Travel date: ${travelStr}` : "",
        days !== "" ? `Duration: ${days} days` : "",
        parkSel.length
          ? `Parks: ${parkSel
              .map(
                (park) =>
                  `${park.name} (${park.adults}A/${park.children}C)`
              )
              .join("; ")}`
          : "",
        customSummary,
        form.notes ? `Notes: ${form.notes}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      const { error: insertError } = await supabase
        .from("quote_requests")
        .insert([
          {
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone || null,
            country: parsed.data.country || null,
            travel_dates: travelStr ?? null,
            group_size: `${adults} adults${
              children ? ` + ${children} children` : ""
            } (${RESIDENCY_LABELS[residency]})`,
            package_interest: tripTitle,
            budget: `USD ${computation.total.toFixed(2)} (estimate)`,
            message: summary,
          },
        ]);

      if (insertError) {
        console.error("Quote request submission failed:", insertError);
        toast.error(
          "We couldn't submit your quote request. Please try again."
        );
        return;
      }

      try {
        await generateClientQuotePdf({
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          packageTitle: tripTitle,
          travelDate: travelStr,
          days: typeof days === "number" ? days : undefined,
          adults,
          children,
          residency: RESIDENCY_LABELS[residency],
          lines: computation.lines,
          notes: form.notes,
          inclusions: selectedPkg?.inclusions ?? [],
          exclusions: selectedPkg?.exclusions ?? [],
        });

        toast.success(
          "Your quote PDF is downloading. Our team will follow up within 24 hours."
        );
      } catch (pdfError) {
        console.error("Quote PDF generation failed:", pdfError);
        toast.success(
          "Your request has been received. We couldn't generate the PDF, but our team will follow up."
        );
      }
    } catch (error) {
      console.error("Quote submission error:", error);
      toast.error(
        "Something went wrong while submitting your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const availableParks = PARK_FEES.filter(
    (park) => !parkSel.some((selected) => selected.name === park.name)
  );

  const addCustomItem = (kind: "destination" | "transport") => {
    setCustomItems((current) => [
      ...current,
      {
        id: newCid(),
        kind,
        label: "",
        mode: kind === "transport" ? "flat" : "perPerson",
        adult: 0,
        child: 0,
        flat: 0,
        adults,
        children,
      },
    ]);
  };

  const updateCustomItem = (
    id: string,
    patch: Partial<CustomItem>
  ) => {
    setCustomItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      )
    );
  };

  const removeCustomItem = (id: string) => {
    setCustomItems((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const sectionHeading = (
    number: string,
    title: string,
    description: string
  ) => (
    <div className="mb-6 flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#b89b61]/50 bg-[#f3efe5] font-serif text-lg text-[#8d7444]">
        {number}
      </span>
      <div>
        <h2 className="font-serif text-2xl text-[#173d32] md:text-3xl">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-[#77776e]">
          {description}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Seo
        title="Build Your Kenya Safari Quote | Custom Safari Pricing | Karembo Tours"
        description="Create a personalised Kenya safari quote. Choose a safari package, group size, travel date, park entries and optional experiences, then request your detailed Karembo Tours estimate."
        path="/quote"
        image={HERO}
        type="website"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Build Your Kenya Safari Quote",
            url: `${SITE_URL}/quote`,
            description:
              "Create a personalised estimate for a Kenya safari or custom trip with Karembo Tours.",
            isPartOf: {
              "@type": "WebSite",
              name: "Karembo Tours and Safaris",
              url: SITE_URL,
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: SITE_URL,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Build Your Quote",
                  item: `${SITE_URL}/quote`,
                },
              ],
            },
          },
        ]}
      />

      <main className="bg-[#f8f6f0]">
        {/* Hero */}
        <section className="relative isolate flex min-h-[440px] items-end overflow-hidden bg-[#102d25] md:min-h-[510px]">
          <img
            src={HERO}
            alt="Wildebeest crossing the Mara River during a Kenya safari"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            fetchPriority="high"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#10271f]/95 via-[#10271f]/65 to-[#10271f]/15" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#10271f]/70 via-transparent to-[#10271f]/10" />

          <div className="container-edge w-full pb-16 pt-32 md:pb-20">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d0b477]/40 bg-[#10271f]/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e3c98f] backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Your journey, your way
              </div>

              <h1 className="font-serif text-5xl leading-[1.05] text-[#fffdf7] md:text-7xl">
                Build your
                <br />
                <span className="italic text-[#dfc58d]">
                  Kenya safari.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-white/80 md:text-lg">
                Shape your ideal journey, explore the estimated costs and
                receive a personalised quote from our team.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-xs font-medium text-white/80">
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#dfc58d]" />
                  Tailored trip options
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#dfc58d]" />
                  Live cost estimate
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#dfc58d]" />
                  Downloadable quote
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Intro strip */}
        <section className="border-b border-[#e7e1d5] bg-[#f0ede4]">
          <div className="container-edge grid gap-5 py-7 md:grid-cols-3 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#987b46] shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#173d32]">
                  Choose your experiences
                </p>
                <p className="text-xs text-[#77776e]">
                  Parks, destinations and extras
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#987b46] shadow-sm">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#173d32]">
                  Set your group size
                </p>
                <p className="text-xs text-[#77776e]">
                  Adults, children and residency
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#987b46] shadow-sm">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#173d32]">
                  Get your estimate
                </p>
                <p className="text-xs text-[#77776e]">
                  Submit your details and generate a PDF
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quote builder */}
        <section className="py-14 md:py-20">
          <div className="container-edge">
            <div className="mb-10 max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7e4b]">
                Design your itinerary
              </p>
              <h2 className="font-serif text-3xl leading-tight text-[#173d32] md:text-4xl">
                A safari that starts with your ideas.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#77776e] md:text-base">
                Start with one of our packages or build a custom trip.
                Adjust the details below to see how your estimated
                journey cost changes.
              </p>
            </div>

            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <form
                onSubmit={onSubmit}
                className="min-w-0 space-y-8"
              >
                {/* Package and group */}
                <section className="rounded-2xl border border-[#e8e1d5] bg-white p-5 shadow-[0_12px_40px_rgba(30,45,35,0.04)] md:p-8">
                  {sectionHeading(
                    "01",
                    "Your safari foundation",
                    "Select a package and tell us who is travelling."
                  )}

                  <div className="space-y-5">
                    <div>
                      <Label
                        htmlFor="package"
                        className="mb-2 block text-sm font-semibold text-[#263d32]"
                      >
                        Safari package
                      </Label>
                      <select
                        id="package"
                        value={pkgSlug}
                        onChange={(event) =>
                          setPkgSlug(event.target.value)
                        }
                        className="h-12 w-full rounded-lg border border-[#ded9ce] bg-[#fbfaf7] px-4 text-sm text-[#263d32] outline-none transition focus:border-[#a88b55] focus:ring-2 focus:ring-[#a88b55]/15"
                      >
                        <option value="">
                          Build a custom trip instead
                        </option>
                        {packages.map((pkg) => (
                          <option key={pkg.slug} value={pkg.slug}>
                            {pkg.title} — from ${pkg.price_from}
                          </option>
                        ))}
                      </select>

                      {packagesLoading && (
                        <p className="mt-2 text-xs text-[#88877e]">
                          Loading available packages…
                        </p>
                      )}

                      {selectedPkg && (
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-[#f3f0e8] px-4 py-3 text-xs text-[#5f665d]">
                          <span className="font-semibold text-[#173d32]">
                            {selectedPkg.duration}
                          </span>
                          <span>
                            From ${formatMoney(selectedPkg.price_from)} per
                            adult
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label
                          htmlFor="adults"
                          className="mb-2 block text-sm font-semibold text-[#263d32]"
                        >
                          Adults
                        </Label>
                        <Input
                          id="adults"
                          type="number"
                          min={1}
                          max={30}
                          value={adults}
                          onChange={(event) =>
                            setAdults(
                              Math.max(
                                1,
                                Math.min(
                                  30,
                                  Number(event.target.value) || 1
                                )
                              )
                            )
                          }
                          className="h-12 border-[#ded9ce] bg-[#fbfaf7]"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="children"
                          className="mb-2 block text-sm font-semibold text-[#263d32]"
                        >
                          Children (under 12)
                        </Label>
                        <Input
                          id="children"
                          type="number"
                          min={0}
                          max={20}
                          value={children}
                          onChange={(event) =>
                            setChildren(
                              Math.max(
                                0,
                                Math.min(
                                  20,
                                  Number(event.target.value) || 0
                                )
                              )
                            )
                          }
                          className="h-12 border-[#ded9ce] bg-[#fbfaf7]"
                        />
                      </div>

                      <div>
                        <Label className="mb-2 block text-sm font-semibold text-[#263d32]">
                          Travel start date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "h-12 w-full justify-start border-[#ded9ce] bg-[#fbfaf7] text-left font-normal hover:bg-[#f3f0e8]",
                                !travelDate && "text-[#88877e]"
                              )}
                            >
                              <CalendarDays className="mr-3 h-4 w-4 text-[#9a7e4b]" />
                              {travelDate
                                ? format(travelDate, "PPP")
                                : "Choose your travel date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto border-[#e8e1d5] bg-white p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={travelDate}
                              onSelect={setTravelDate}
                              disabled={(date) =>
                                date <
                                new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label
                          htmlFor="days"
                          className="mb-2 block text-sm font-semibold text-[#263d32]"
                        >
                          Number of days
                        </Label>
                        <Input
                          id="days"
                          type="number"
                          min={1}
                          max={30}
                          value={days}
                          placeholder="Use package default"
                          onChange={(event) =>
                            setDays(
                              event.target.value === ""
                                ? ""
                                : Math.max(
                                    1,
                                    Math.min(
                                      30,
                                      Number(event.target.value)
                                    )
                                  )
                            )
                          }
                          className="h-12 border-[#ded9ce] bg-[#fbfaf7]"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Residency */}
                <section className="rounded-2xl border border-[#e8e1d5] bg-white p-5 shadow-[0_12px_40px_rgba(30,45,35,0.04)] md:p-8">
                  {sectionHeading(
                    "02",
                    "Residency and park entries",
                    "Park fees depend on residency category. Select yours before adding parks."
                  )}

                  <Label className="mb-3 block text-sm font-semibold text-[#263d32]">
                    Residency category
                  </Label>

                  <RadioGroup
                    value={residency}
                    onValueChange={(value) =>
                      setResidency(value as Residency)
                    }
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    {(Object.keys(RESIDENCY_LABELS) as Residency[]).map(
                      (option) => (
                        <label
                          key={option}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition",
                            residency === option
                              ? "border-[#a88b55] bg-[#f4f0e6] ring-1 ring-[#a88b55]/20"
                              : "border-[#e8e1d5] bg-[#fbfaf7] hover:border-[#c9b78e]"
                          )}
                        >
                          <RadioGroupItem value={option} />
                          <span className="text-sm font-medium text-[#263d32]">
                            {RESIDENCY_LABELS[option]}
                          </span>
                        </label>
                      )
                    )}
                  </RadioGroup>

                  <p className="mt-3 text-xs leading-5 text-[#858278]">
                    Park gate fees vary by residency. Identification may be
                    required at the gate to confirm the applicable rate.
                  </p>

                  <div className="my-7 border-t border-[#eee9df]" />

                  <div className="mb-3">
                    <Label
                      htmlFor="park-picker"
                      className="mb-2 block text-sm font-semibold text-[#263d32]"
                    >
                      Add a national park or reserve
                    </Label>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <select
                        id="park-picker"
                        value={parkPicker}
                        onChange={(event) =>
                          setParkPicker(event.target.value)
                        }
                        className="h-12 min-w-0 flex-1 rounded-lg border border-[#ded9ce] bg-[#fbfaf7] px-4 text-sm text-[#263d32] outline-none focus:border-[#a88b55] focus:ring-2 focus:ring-[#a88b55]/15"
                      >
                        <option value="">
                          Select a park or reserve
                        </option>
                        {availableParks.map((park) => (
                          <option key={park.name} value={park.name}>
                            {park.name}
                          </option>
                        ))}
                      </select>

                      <Button
                        type="button"
                        onClick={() => addPark(parkPicker)}
                        disabled={!parkPicker}
                        className="h-12 bg-[#173d32] px-5 text-white hover:bg-[#245544]"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add park
                      </Button>
                    </div>
                  </div>

                  {parkSel.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {parkSel.map((selection) => {
                        const fee = PARK_FEES.find(
                          (park) => park.name === selection.name
                        );

                        if (!fee) return null;

                        const adultRate =
                          fee.rates[residency].adult;
                        const childRate =
                          fee.rates[residency].child;
                        const subtotal =
                          adultRate * selection.adults +
                          childRate * selection.children;

                        return (
                          <div
                            key={selection.name}
                            className="rounded-xl border border-[#e8e1d5] bg-[#fbfaf7] p-4"
                          >
                            <div className="mb-4 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#a88b55]" />
                                <p className="text-sm font-semibold text-[#173d32]">
                                  {selection.name}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removePark(selection.name)
                                }
                                aria-label={`Remove ${selection.name}`}
                                className="rounded-full p-2 text-[#89877e] transition hover:bg-red-50 hover:text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                              <div>
                                <Label className="mb-2 block text-xs text-[#77776e]">
                                  Adults · ${formatMoney(adultRate)} each
                                </Label>
                                <Input
                                  type="number"
                                  min={0}
                                  max={50}
                                  value={selection.adults}
                                  onChange={(event) =>
                                    updatePark(
                                      selection.name,
                                      "adults",
                                      Number(event.target.value) || 0
                                    )
                                  }
                                  className="h-10 border-[#ded9ce] bg-white"
                                />
                              </div>

                              <div>
                                <Label className="mb-2 block text-xs text-[#77776e]">
                                  Children · ${formatMoney(childRate)} each
                                </Label>
                                <Input
                                  type="number"
                                  min={0}
                                  max={50}
                                  value={selection.children}
                                  onChange={(event) =>
                                    updatePark(
                                      selection.name,
                                      "children",
                                      Number(event.target.value) || 0
                                    )
                                  }
                                  className="h-10 border-[#ded9ce] bg-white"
                                />
                              </div>

                              <div className="col-span-2 text-right sm:col-span-1 sm:pb-2">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#88877e]">
                                  Subtotal
                                </p>
                                <p className="font-serif text-xl text-[#987b46]">
                                  ${formatMoney(subtotal)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                {/* Custom additions */}
                <section className="rounded-2xl border border-[#e8e1d5] bg-white p-5 shadow-[0_12px_40px_rgba(30,45,35,0.04)] md:p-8">
                  {sectionHeading(
                    "03",
                    "Make it your own",
                    "Add destinations, activities or transport that are not already included in your selected package."
                  )}

                  <div className="space-y-5">
                    {(["destination", "transport"] as const).map(
                      (kind) => {
                        const items = customItems.filter(
                          (item) => item.kind === kind
                        );

                        const isDestination = kind === "destination";
                        const heading = isDestination
                          ? "Custom destinations and activities"
                          : "Custom transport";

                        const helper = isDestination
                          ? "Add a place or activity and enter your own estimated pricing."
                          : "Add a route and choose a per-person or flat vehicle rate.";

                        return (
                          <div
                            key={kind}
                            className="rounded-xl border border-[#e8e1d5] bg-[#fbfaf7] p-4 md:p-5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <h3 className="text-sm font-semibold text-[#173d32]">
                                  {heading}
                                </h3>
                                <p className="mt-1 text-xs leading-5 text-[#858278]">
                                  {helper}
                                </p>
                              </div>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addCustomItem(kind)}
                                className="border-[#cfc3a9] bg-white text-[#173d32] hover:bg-[#f0ede4]"
                              >
                                <Plus className="mr-1 h-4 w-4" />
                                Add item
                              </Button>
                            </div>

                            {items.length > 0 && (
                              <div className="mt-4 space-y-4">
                                {items.map((item) => {
                                  const subtotal =
                                    item.mode === "flat"
                                      ? item.flat
                                      : item.adult * item.adults +
                                        item.child * item.children;

                                  return (
                                    <div
                                      key={item.id}
                                      className="rounded-lg border border-[#e8e1d5] bg-white p-4"
                                    >
                                      <div className="flex gap-2">
                                        <Input
                                          placeholder={
                                            isDestination
                                              ? "Place or activity name"
                                              : "Route (e.g. Nairobi to Naivasha)"
                                          }
                                          value={item.label}
                                          onChange={(event) =>
                                            updateCustomItem(item.id, {
                                              label: event.target.value,
                                            })
                                          }
                                          maxLength={120}
                                          className="h-11 border-[#ded9ce] bg-[#fbfaf7]"
                                        />

                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeCustomItem(item.id)
                                          }
                                          aria-label={`Remove ${item.label || heading}`}
                                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#89877e] transition hover:bg-red-50 hover:text-red-600"
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                      </div>

                                      <RadioGroup
                                        value={item.mode}
                                        onValueChange={(value) =>
                                          updateCustomItem(item.id, {
                                            mode: value as
                                              | "perPerson"
                                              | "flat",
                                          })
                                        }
                                        className="mt-4 flex flex-wrap gap-5"
                                      >
                                        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#555b52]">
                                          <RadioGroupItem value="perPerson" />
                                          Per person
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#555b52]">
                                          <RadioGroupItem value="flat" />
                                          {isDestination
                                            ? "Flat fee"
                                            : "Flat per vehicle"}
                                        </label>
                                      </RadioGroup>

                                      {item.mode === "flat" ? (
                                        <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-4">
                                          <div>
                                            <Label className="mb-2 block text-xs text-[#77776e]">
                                              Flat amount (USD)
                                            </Label>
                                            <Input
                                              type="number"
                                              min={0}
                                              value={item.flat}
                                              onChange={(event) =>
                                                updateCustomItem(item.id, {
                                                  flat: Math.max(
                                                    0,
                                                    Number(
                                                      event.target.value
                                                    ) || 0
                                                  ),
                                                })
                                              }
                                              className="h-10 border-[#ded9ce] bg-[#fbfaf7]"
                                            />
                                          </div>
                                          <p className="pb-2 font-semibold text-[#987b46]">
                                            ${formatMoney(subtotal)}
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                          {[
                                            {
                                              label: "Adult rate",
                                              value: item.adult,
                                              key: "adult" as const,
                                            },
                                            {
                                              label: "Adults",
                                              value: item.adults,
                                              key: "adults" as const,
                                            },
                                            {
                                              label: "Child rate",
                                              value: item.child,
                                              key: "child" as const,
                                            },
                                            {
                                              label: "Children",
                                              value: item.children,
                                              key: "children" as const,
                                            },
                                          ].map((field) => (
                                            <div key={field.key}>
                                              <Label className="mb-2 block text-xs text-[#77776e]">
                                                {field.label}
                                              </Label>
                                              <Input
                                                type="number"
                                                min={0}
                                                value={field.value}
                                                onChange={(event) =>
                                                  updateCustomItem(item.id, {
                                                    [field.key]: Math.max(
                                                      0,
                                                      Number(
                                                        event.target.value
                                                      ) || 0
                                                    ),
                                                  })
                                                }
                                                className="h-10 border-[#ded9ce] bg-[#fbfaf7]"
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {item.mode === "perPerson" && (
                                        <div className="mt-3 flex justify-end">
                                          <p className="text-sm font-semibold text-[#987b46]">
                                            Item estimate: $
                                            {formatMoney(subtotal)}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </section>

                {/* Add-ons */}
                <section className="rounded-2xl border border-[#e8e1d5] bg-white p-5 shadow-[0_12px_40px_rgba(30,45,35,0.04)] md:p-8">
                  {sectionHeading(
                    "04",
                    "Optional experiences",
                    "Choose any additional services you would like included in your estimate."
                  )}

                  <div className="space-y-3">
                    {ADDONS.map((addon) => {
                      const priceLabel =
                        addon.kind === "percent"
                          ? `+${Math.round(addon.percent * 100)}%`
                          : addon.kind === "perPerson"
                            ? `+$${addon.price} / person`
                            : addon.kind === "flat"
                              ? `+$${addon.price} flat`
                              : `+$${addon.adult} adult / $${addon.child} child`;

                      return (
                        <label
                          key={addon.id}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition",
                            addons[addon.id]
                              ? "border-[#a88b55] bg-[#f4f0e6]"
                              : "border-[#e8e1d5] bg-[#fbfaf7] hover:border-[#c9b78e]"
                          )}
                        >
                          <Checkbox
                            checked={!!addons[addon.id]}
                            onCheckedChange={(checked) =>
                              setAddons((current) => ({
                                ...current,
                                [addon.id]: !!checked,
                              }))
                            }
                          />

                          <span className="min-w-0 flex-1 text-sm text-[#39463b]">
                            {addon.label}
                          </span>

                          <span className="shrink-0 text-xs font-semibold text-[#987b46]">
                            {priceLabel}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </section>

                {/* Contact details */}
                <section className="rounded-2xl border border-[#e8e1d5] bg-white p-5 shadow-[0_12px_40px_rgba(30,45,35,0.04)] md:p-8">
                  {sectionHeading(
                    "05",
                    "Where should we send your quote?",
                    "Add your contact details so our team can receive your request and follow up."
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label
                        htmlFor="name"
                        className="mb-2 block text-sm font-semibold text-[#263d32]"
                      >
                        Full name *
                      </Label>
                      <Input
                        id="name"
                        required
                        value={form.name}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        maxLength={100}
                        autoComplete="name"
                        placeholder="Your full name"
                        className="h-12 border-[#ded9ce] bg-[#fbfaf7]"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-[#263d32]"
                      >
                        Email address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        maxLength={255}
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="h-12 border-[#ded9ce] bg-[#fbfaf7]"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-semibold text-[#263d32]"
                      >
                        Phone number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            phone: event.target.value,
                          }))
                        }
                        maxLength={40}
                        autoComplete="tel"
                        placeholder="+254 ..."
                        className="h-12 border-[#ded9ce] bg-[#fbfaf7]"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="country"
                        className="mb-2 block text-sm font-semibold text-[#263d32]"
                      >
                        Country of residence
                      </Label>
                      <Input
                        id="country"
                        value={form.country}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            country: event.target.value,
                          }))
                        }
                        maxLength={80}
                        autoComplete="country-name"
                        placeholder="Your country"
                        className="h-12 border-[#ded9ce] bg-[#fbfaf7]"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <Label
                      htmlFor="notes"
                      className="mb-2 block text-sm font-semibold text-[#263d32]"
                    >
                      Additional notes or special requests
                    </Label>
                    <Textarea
                      id="notes"
                      rows={5}
                      value={form.notes}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          notes: event.target.value,
                        }))
                      }
                      maxLength={1500}
                      placeholder="Tell us about your preferred experiences, accommodation preferences or anything else we should know..."
                      className="resize-y border-[#ded9ce] bg-[#fbfaf7] leading-6"
                    />
                  </div>

                  <div className="mt-7 flex flex-col gap-4 border-t border-[#eee9df] pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-sm text-xs leading-5 text-[#858278]">
                      Your estimate is based on the selections and rates
                      shown. Our team will confirm the final itinerary and
                      pricing.
                    </p>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitting}
                      className="h-13 shrink-0 bg-[#173d32] px-6 text-white shadow-md shadow-[#173d32]/10 transition hover:bg-[#245544]"
                    >
                      {submitting ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                          Preparing your quote…
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Generate my quote
                        </>
                      )}
                    </Button>
                  </div>
                </section>
              </form>

              {/* Live estimate sidebar */}
              <aside className="lg:sticky lg:top-28">
                <div className="overflow-hidden rounded-2xl bg-[#173d32] text-white shadow-[0_20px_60px_rgba(18,48,37,0.18)]">
                  <div className="border-b border-white/10 bg-[#102e25] px-6 py-5">
                    <div className="flex items-center gap-2 text-[#dfc58d]">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em]">
                        Your trip estimate
                      </span>
                    </div>

                    <h2 className="mt-3 font-serif text-2xl leading-tight">
                      Your journey,
                      <br />
                      taking shape.
                    </h2>

                    <p className="mt-2 text-xs leading-5 text-white/60">
                      Your estimate updates as you customise your trip.
                    </p>
                  </div>

                  <div className="space-y-5 p-6">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-white/60">Travellers</span>
                      <span className="font-medium">
                        {adults} adults · {children} children
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-white/60">Residency</span>
                      <span className="text-right font-medium">
                        {RESIDENCY_LABELS[residency]}
                      </span>
                    </div>

                    {travelDate && (
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-white/60">Travel date</span>
                        <span className="font-medium">
                          {format(travelDate, "dd MMM yyyy")}
                        </span>
                      </div>
                    )}

                    {typeof days === "number" && (
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-white/60">Duration</span>
                        <span className="font-medium">
                          {days} days
                        </span>
                      </div>
                    )}

                    <div className="border-t border-white/15 pt-4">
                      {computation.lines.length > 0 ? (
                        <>
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#dfc58d]">
                              Estimate breakdown
                            </span>
                            <span className="text-[10px] text-white/45">
                              USD
                            </span>
                          </div>

                          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                            {computation.lines.map((line, index) => (
                              <div
                                key={`${line.description}-${index}`}
                                className="flex items-start justify-between gap-3 text-xs"
                              >
                                <span className="min-w-0 leading-5 text-white/70">
                                  {line.description}
                                  {line.pax > 1 && (
                                    <span className="ml-1 text-white/40">
                                      × {line.pax}
                                    </span>
                                  )}
                                </span>
                                <span className="shrink-0 font-medium tabular-nums">
                                  $
                                  {formatMoney(line.pax * line.rate)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="py-5 text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#dfc58d]">
                            <Plane className="h-5 w-5" />
                          </div>
                          <p className="text-sm font-medium">
                            Your adventure starts here
                          </p>
                          <p className="mx-auto mt-2 max-w-[230px] text-xs leading-5 text-white/55">
                            Select a package or add your first destination
                            to see your live estimate.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-white/15 pt-5">
                      <p className="text-xs text-white/60">
                        Estimated total
                      </p>
                      <p className="mt-1 font-serif text-4xl text-[#dfc58d]">
                        ${formatMoney(computation.total)}
                      </p>
                      <p className="mt-1 text-[10px] text-white/45">
                        United States Dollars (USD)
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#dfc58d]" />
                        <p className="text-[11px] leading-5 text-white/65">
                          This is an estimate based on the selected package,
                          park fees and optional extras. Final pricing is
                          confirmed by a Karembo travel designer.
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/contact"
                      className="flex items-center justify-center gap-2 border-t border-white/10 pt-4 text-xs font-medium text-[#dfc58d] transition hover:text-white"
                    >
                      Prefer to speak with our team?
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#e8e1d5] bg-white p-5">
                  <p className="font-serif text-lg text-[#173d32]">
                    Need a little inspiration?
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#77776e]">
                    Explore our safari experiences before building your
                    itinerary.
                  </p>
                  <Link
                    to="/safaris"
                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#987b46] transition hover:text-[#173d32]"
                  >
                    Explore safari packages
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Closing reassurance */}
        <section className="bg-[#eee9dd] py-14 md:py-16">
          <div className="container-edge">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#987b46]">
                Your Kenya story begins here
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-[#173d32] md:text-4xl">
                The best journeys are thoughtfully planned.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#77776e]">
                Share what you have in mind. Your selections give our team
                a starting point for shaping a safari around your travel
                plans.
              </p>
              <Link
                to="/about"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#173d32] transition hover:text-[#987b46]"
              >
                Get to know Karembo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Quote;
