import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  BadgeCheck,
  Check,
  ChevronDown,
  Clock,
  MessageCircle,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PackageCard, type PackageCardItem } from "@/components/PackageCard";
import { ParkFeesTable } from "@/components/ParkFeesTable";
import { supabase } from "@/integrations/supabase/client";

type ItineraryDay = {
  day?: string;
  title?: string;
  details?: string;
};

type PackageRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  price_from: number;
  price_private: number | null;
  min_guests: number | null;
  image: string;
  summary: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
};

const SITE_URL = "https://karembotours.co.ke";

const DEFAULT_FAQ = [
  {
    q: "Is this trip suitable for families with children?",
    a: "Yes — we welcome families. Children under 12 receive a discounted rate, and our guides tailor activities to keep younger guests engaged. Please tell us their ages when booking.",
  },
  {
    q: "What's the best time of year to go?",
    a: "Kenya is a year-round destination. The Great Migration peaks in the Mara from July to October. January–March offers excellent game viewing with fewer crowds. We help you choose dates that match your priorities.",
  },
  {
    q: "Are park fees and government taxes included?",
    a: "Yes — all park entry fees, conservancy fees and government taxes for the listed itinerary are included. There are no hidden surcharges on arrival.",
  },
  {
    q: "How safe is travel in Kenya?",
    a: "Kenya is a safe and welcoming destination for travellers. We use experienced licensed driver-guides, well-maintained 4x4 vehicles, and only partner with vetted accommodations.",
  },
  {
    q: "Can the itinerary be customised?",
    a: "Absolutely. This is a starting point — extend nights, add a beach extension or swap accommodations to suit your style and budget. Just ask.",
  },
];

const DEFAULT_PACK = [
  "Lightweight neutral-coloured clothing (avoid bright white & dark blue)",
  "Warm fleece or jacket for early-morning game drives",
  "Comfortable closed walking shoes",
  "Wide-brim hat, sunglasses and high-SPF sunscreen",
  "Insect repellent (DEET-based recommended)",
  "Camera with zoom lens & spare batteries",
  "Reusable water bottle",
  "Personal medication & basic first-aid",
  "Travel adapter (Type G — UK style)",
  "Passport with 6+ months validity & yellow-fever certificate",
];

const absoluteUrl = (value?: string) => {
  if (!value) return `${SITE_URL}/`;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
};

const cleanDescription = (value?: string) => {
  const text = (value ?? "").replace(/\s+/g, " ").trim();
  if (!text) {
    return "Discover this Kenya travel experience with Karembo Tours. Explore the itinerary, highlights and details, then request a personalised quote.";
  }
  if (text.length <= 155) return text;
  return `${text.slice(0, 152).replace(/\s+\S*$/, "")}...`;
};

const PackageDetail = () => {
  const { slug = "" } = useParams();
  const [pkg, setPkg] = useState<PackageRow | null>(null);
  const [related, setRelated] = useState<PackageCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    const loadPackage = async () => {
      setLoading(true);
      setNotFound(false);
      setPkg(null);
      setRelated([]);

      const { data, error } = await supabase
        .from("packages")
        .select(
          "id,slug,title,category,duration,price_from,price_private,min_guests,image,summary,highlights,inclusions,exclusions,itinerary",
        )
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (!active) return;

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const row = data as unknown as PackageRow;
      setPkg(row);

      const { data: relatedData } = await supabase
        .from("packages")
        .select("slug,title,image,duration,price_from,price_private,min_guests,summary")
        .eq("category", row.category)
        .eq("published", true)
        .neq("slug", row.slug)
        .order("sort_order")
        .limit(3);

      if (!active) return;
      setRelated((relatedData as PackageCardItem[]) ?? []);
      setLoading(false);
    };

    loadPackage();

    return () => {
      active = false;
    };
  }, [slug]);

  const itinerary = useMemo(
    () => (Array.isArray(pkg?.itinerary) ? pkg.itinerary : []),
    [pkg?.itinerary],
  );

  if (notFound) return <Navigate to="/safaris" replace />;

  if (loading || !pkg) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f5f1e8] px-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#d6a85f] border-t-transparent" />
          <p className="mt-5 font-serif text-2xl text-[#26372a]">
            Preparing your journey…
          </p>
          <p className="mt-2 text-sm text-[#697064]">
            Just a moment while we load the trip details.
          </p>
        </div>
      </main>
    );
  }

  const categoryBackHref =
    pkg.category === "safari"
      ? "/safaris"
      : pkg.category === "day-trip"
        ? "/day-trips"
        : pkg.category === "combo"
          ? "/combo"
          : "/cultural";

  const categoryLabel =
    pkg.category === "day-trip"
      ? "Kenya day trip"
      : pkg.category === "safari"
        ? "Kenya safari"
        : pkg.category === "combo"
          ? "Safari & beach experience"
          : "Cultural experience";

  const waMsg = encodeURIComponent(
    `Hi Karembo, I'm interested in the ${pkg.title}. Could you share more details?`,
  );
  const pagePath = `/packages/${pkg.slug}`;
  const pageDescription = cleanDescription(pkg.summary);
  const pageImage = absoluteUrl(pkg.image);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}${pagePath}#webpage`,
        url: `${SITE_URL}${pagePath}`,
        name: `${pkg.title} | Karembo Tours`,
        description: pageDescription,
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: pageImage,
        },
        breadcrumb: {
          "@id": `${SITE_URL}${pagePath}#breadcrumb`,
        },
        mainEntity: {
          "@id": `${SITE_URL}${pagePath}#trip`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}${pagePath}#breadcrumb`,
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
            name: categoryLabel,
            item: `${SITE_URL}${categoryBackHref}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: pkg.title,
            item: `${SITE_URL}${pagePath}`,
          },
        ],
      },
      {
        "@type": "TouristTrip",
        "@id": `${SITE_URL}${pagePath}#trip`,
        name: pkg.title,
        description: pageDescription,
        image: pageImage,
        touristType:
          pkg.category === "safari"
            ? "Wildlife tourism"
            : pkg.category === "cultural"
              ? "Cultural tourism"
              : "Leisure tourism",
        provider: {
          "@type": "TravelAgency",
          name: "Karembo Tours",
          url: SITE_URL,
        },
        offers: {
          "@type": "Offer",
          price: pkg.price_from,
          priceCurrency: "USD",
          url: `${SITE_URL}${pagePath}`,
          availability: "https://schema.org/InStock",
        },
        itinerary: {
          "@type": "ItemList",
          itemListElement: itinerary.map((day, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: day.title || day.day || `Day ${index + 1}`,
            description: day.details,
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}${pagePath}#faq`,
        mainEntity: DEFAULT_FAQ.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <Seo
        title={`${pkg.title} | ${categoryLabel} | Karembo Tours`}
        description={pageDescription}
        path={pagePath}
        image={pageImage}
        type="website"
        jsonLd={structuredData}
      />

      <main className="bg-[#f5f1e8] text-[#20291f]">
        {/* Cinematic package hero */}
        <section className="relative isolate min-h-[570px] overflow-hidden bg-[#17251d] text-white md:min-h-[650px]">
          <img
            src={pkg.image}
            alt={`${pkg.title} – ${categoryLabel} with Karembo Tours in Kenya`}
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            fetchPriority="high"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101b16]/90 via-[#142219]/65 to-[#142219]/20" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#101b16]/80 via-transparent to-black/10" />

          <div className="container-edge flex min-h-[570px] items-end py-16 md:min-h-[650px] md:items-center md:py-24">
            <div className="max-w-4xl">
              <Link
                to={categoryBackHref}
                className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 transition hover:text-[#e6c58a]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to {categoryLabel.toLowerCase()}s
              </Link>

              <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.27em] text-[#e6c58a]">
                <span className="h-px w-10 bg-[#e6c58a]" />
                {categoryLabel} · {pkg.duration}
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1.04] tracking-[-0.035em] sm:text-6xl md:text-7xl">
                {pkg.title}
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                {pkg.summary?.split("\n").filter(Boolean)[0]}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={`/contact?package=${pkg.slug}`}
                  className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#d6a85f] px-7 text-sm font-bold uppercase tracking-[0.13em] text-[#1c281f] transition hover:bg-[#e7c58d]"
                >
                  Request this tour <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`https://wa.me/254722736130?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-3 border border-white/55 px-7 text-sm font-semibold uppercase tracking-[0.13em] text-white transition hover:border-white hover:bg-white/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp enquiry
                </a>
              </div>

              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/20 pt-6 text-xs font-semibold uppercase tracking-[0.15em] text-white/75">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#e6c58a]" />
                  {pkg.duration}
                </span>
                {pkg.min_guests ? (
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#e6c58a]" />
                    Minimum {pkg.min_guests} guests
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#e6c58a]" />
                  Personalised booking support
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Main content and booking panel */}
        <section className="py-16 md:py-24">
          <div className="container-edge grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
            <div className="min-w-0 space-y-16 md:space-y-20">
              {/* Overview */}
              <section>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b713b]">
                  The experience
                </p>
                <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight tracking-tight text-[#26372a] sm:text-5xl">
                  A closer look at your journey
                </h2>
                <div className="mt-7 max-w-3xl space-y-4">
                  {pkg.summary
                    ?.split("\n")
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-base leading-8 text-[#586056]"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </section>

              {/* Trust points */}
              <section className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Experienced local guides",
                    desc: "Explore with knowledgeable guides familiar with Kenya.",
                  },
                  {
                    icon: Users,
                    title: "Thoughtful experiences",
                    desc: "A trip planned around your group and travel interests.",
                  },
                  {
                    icon: BadgeCheck,
                    title: "Clear trip details",
                    desc: "Understand what is included before you confirm.",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <article
                    key={title}
                    className="border-t-2 border-[#c99b56] bg-[#ebe5da] p-5"
                  >
                    <Icon className="h-7 w-7 text-[#9b713b]" strokeWidth={1.5} />
                    <h3 className="mt-5 font-serif text-xl text-[#26372a]">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#697064]">
                      {desc}
                    </p>
                  </article>
                ))}
              </section>

              {/* Highlights */}
              {pkg.highlights?.length > 0 && (
                <section>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b713b]">
                    The best of this trip
                  </p>
                  <h2 className="mt-3 font-serif text-3xl text-[#26372a] sm:text-4xl">
                    Experience highlights
                  </h2>
                  <ul className="mt-7 grid gap-4 sm:grid-cols-2">
                    {pkg.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-3 border-b border-[#dcd4c6] pb-4 text-sm leading-7 text-[#586056]"
                      >
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d9c39e] text-[#26372a]">
                          <Check className="h-3 w-3" />
                        </span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Itinerary */}
              {itinerary.length > 0 && (
                <section>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b713b]">
                    Your time in Kenya
                  </p>
                  <h2 className="mt-3 font-serif text-3xl text-[#26372a] sm:text-4xl">
                    Day-by-day itinerary
                  </h2>
                  <p className="mt-4 max-w-2xl leading-7 text-[#697064]">
                    Here’s how your journey is planned. Your final arrangements
                    can be discussed with the Karembo team.
                  </p>
                  <div className="relative mt-9 space-y-5 before:absolute before:bottom-8 before:left-6 before:top-8 before:w-px before:bg-[#d5c6ad]">
                    {itinerary.map((day, index) => (
                      <article
                        key={`${day.day ?? index}-${day.title ?? "day"}`}
                        className="relative flex gap-5 bg-[#ebe5da] p-5 sm:gap-7 sm:p-7"
                      >
                        <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-[#f5f1e8] bg-[#26372a] font-serif text-lg text-[#f3d49e]">
                          {index + 1}
                        </div>
                        <div className="min-w-0 pt-1">
                          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9b713b]">
                            {day.day ?? `Day ${index + 1}`}
                          </p>
                          {day.title && (
                            <h3 className="mt-2 font-serif text-2xl text-[#26372a]">
                              {day.title}
                            </h3>
                          )}
                          {day.details && (
                            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#62675e]">
                              {day.details}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Inclusions and exclusions */}
              <section>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b713b]">
                  Know before you go
                </p>
                <h2 className="mt-3 font-serif text-3xl text-[#26372a] sm:text-4xl">
                  What’s included in your trip
                </h2>
                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  <div className="border border-[#d8d0c2] bg-[#ebe5da] p-6 sm:p-7">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d7e0d3] text-[#35533b]">
                        <Check className="h-5 w-5" />
                      </span>
                      <h3 className="font-serif text-2xl text-[#26372a]">
                        Included
                      </h3>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {pkg.inclusions?.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm leading-6 text-[#586056]"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#56734e]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border border-[#d8d0c2] bg-[#ebe5da] p-6 sm:p-7">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ead8d1] text-[#914d3c]">
                        <X className="h-5 w-5" />
                      </span>
                      <h3 className="font-serif text-2xl text-[#26372a]">
                        Not included
                      </h3>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {pkg.exclusions?.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm leading-6 text-[#586056]"
                        >
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-[#a65f4c]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Park fees */}
              <section>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b713b]">
                  Plan with confidence
                </p>
                <h2 className="mt-3 font-serif text-3xl text-[#26372a] sm:text-4xl">
                  Kenya park fees
                </h2>
                <p className="mt-4 max-w-2xl leading-7 text-[#697064]">
                  Review relevant park and conservancy fee information for this
                  journey.
                </p>
                <div className="mt-6 overflow-hidden border border-[#d8d0c2] bg-white">
                  <ParkFeesTable
                    context={[
                      pkg.title,
                      pkg.summary,
                      ...(pkg.highlights ?? []),
                    ]}
                  />
                </div>
              </section>

              {/* Packing list */}
              <section>
                <Collapsible>
                  <div className="border-y border-[#d8d0c2] py-5">
                    <CollapsibleTrigger className="group flex w-full items-center justify-between gap-4 text-left">
                      <span className="flex items-center gap-4">
                        <span className="flex h-11 w-11 items-center justify-center bg-[#e8dfd0] text-[#9b713b]">
                          <Backpack className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#9b713b]">
                            Get ready
                          </span>
                          <span className="mt-1 block font-serif text-2xl text-[#26372a]">
                            What to pack
                          </span>
                        </span>
                      </span>
                      <ChevronDown className="h-5 w-5 shrink-0 text-[#9b713b] transition group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                        {DEFAULT_PACK.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-sm leading-6 text-[#586056]"
                          >
                            <Check className="mt-1 h-4 w-4 shrink-0 text-[#9b713b]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </section>

              {/* FAQs */}
              <section>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b713b]">
                  Helpful details
                </p>
                <h2 className="mt-3 font-serif text-3xl text-[#26372a] sm:text-4xl">
                  Frequently asked questions
                </h2>
                <Accordion
                  type="single"
                  collapsible
                  className="mt-7 border-y border-[#d8d0c2]"
                >
                  {DEFAULT_FAQ.map((faq, index) => (
                    <AccordionItem
                      key={faq.q}
                      value={`faq-${index}`}
                      className="border-[#d8d0c2]"
                    >
                      <AccordionTrigger className="py-5 text-left font-serif text-lg text-[#26372a] hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="max-w-3xl pb-6 text-sm leading-7 text-[#62675e]">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            </div>

            {/* Booking sidebar */}
            <aside className="lg:sticky lg:top-28">
              <div className="overflow-hidden border border-[#d8d0c2] bg-[#fffdf8] shadow-[0_20px_60px_-35px_rgba(25,38,27,0.35)]">
                <div className="bg-[#26372a] px-7 py-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e6c58a]">
                    Your journey awaits
                  </p>
                  <p className="mt-2 font-serif text-2xl">Let’s plan your trip</p>
                </div>

                <div className="p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#7b7e72]">
                    Starting from
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-serif text-5xl tracking-tight text-[#26372a]">
                      ${pkg.price_from}
                    </span>
                    <span className="text-xs text-[#7b7e72]">USD</span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-[#777b70]">
                    {pkg.min_guests
                      ? `Per person sharing · minimum ${pkg.min_guests} guests`
                      : pkg.price_private
                        ? "Per vehicle · private tour"
                        : "Per person sharing"}
                  </p>

                  {pkg.min_guests && pkg.price_private ? (
                    <div className="mt-5 space-y-2 border-y border-[#e3dccf] py-4 text-sm">
                      <p className="flex justify-between gap-3 text-[#62675e]">
                        Shared tour
                        <span className="font-semibold text-[#26372a]">
                          ${pkg.price_from} / person
                        </span>
                      </p>
                      <p className="flex justify-between gap-3 text-[#62675e]">
                        Private tour
                        <span className="font-semibold text-[#26372a]">
                          ${pkg.price_private} / vehicle
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="my-5 border-t border-[#e3dccf]" />
                  )}

                  <div className="flex items-center gap-3 text-sm text-[#62675e]">
                    <Clock className="h-4 w-4 text-[#9b713b]" />
                    {pkg.duration}
                  </div>

                  <Button
                    asChild
                    className="mt-6 h-12 w-full rounded-none bg-[#d6a85f] font-bold uppercase tracking-[0.1em] text-[#1c281f] hover:bg-[#e7c58d]"
                  >
                    <Link to={`/contact?package=${pkg.slug}`}>
                      Request this tour
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="mt-3 h-12 w-full rounded-none border-[#bdb4a5] font-semibold uppercase tracking-[0.1em] text-[#26372a] hover:bg-[#f1ece2]"
                  >
                    <a
                      href={`https://wa.me/254722736130?text=${waMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp enquiry
                    </a>
                  </Button>

                  <div className="mt-7 space-y-3 border-t border-[#e3dccf] pt-6 text-xs text-[#697064]">
                    <p className="flex items-center gap-3">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-[#9b713b]" />
                      Secure and flexible booking
                    </p>
                    <p className="flex items-center gap-3">
                      <BadgeCheck className="h-4 w-4 shrink-0 text-[#9b713b]" />
                      Clear trip information
                    </p>
                    <p className="flex items-center gap-3">
                      <Users className="h-4 w-4 shrink-0 text-[#9b713b]" />
                      Personalised trip support
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to={categoryBackHref}
                className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#6c715f] transition hover:text-[#9b713b]"
              >
                <ArrowLeft className="h-4 w-4" />
                Browse more experiences
              </Link>
            </aside>
          </div>
        </section>

        {/* Related packages */}
        {related.length > 0 && (
          <section className="bg-[#e9e3d7] py-20 md:py-24">
            <div className="container-edge">
              <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b713b]">
                    Keep exploring
                  </p>
                  <h2 className="mt-3 font-serif text-3xl text-[#26372a] sm:text-4xl">
                    You might also like
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#697064]">
                    More {pkg.category.replace("-", " ")} experiences to
                    inspire your next journey.
                  </p>
                </div>
                <Link
                  to={categoryBackHref}
                  className="inline-flex w-fit items-center gap-3 border-b border-[#9b713b] pb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#344536] transition hover:gap-5"
                >
                  Explore all packages <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {related.map((tour) => (
                  <PackageCard key={tour.slug} tour={tour} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Mobile booking bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#d8d0c2] bg-[#fffdf8]/95 p-3 shadow-[0_-10px_30px_-20px_rgba(0,0,0,0.35)] backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#777b70]">
                From
              </p>
              <p className="font-serif text-2xl leading-none text-[#26372a]">
                ${pkg.price_from}
                <span className="ml-1 text-[10px] font-sans text-[#777b70]">
                  USD
                </span>
              </p>
            </div>
            <Button
              asChild
              className="h-12 rounded-none bg-[#d6a85f] px-5 text-xs font-bold uppercase tracking-[0.08em] text-[#1c281f] hover:bg-[#e7c58d]"
            >
              <Link to={`/contact?package=${pkg.slug}`}>
                Request quote
              </Link>
            </Button>
            <a
              href={`https://wa.me/254722736130?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Send a WhatsApp enquiry"
              className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#c8bdab] text-[#26372a]"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Mobile sticky bar breathing room */}
        <div className="h-20 md:hidden" aria-hidden="true" />
      </main>
    </>
  );
};

export default PackageDetail;
