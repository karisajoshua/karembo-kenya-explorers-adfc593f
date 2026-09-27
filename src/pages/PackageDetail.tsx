import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Check, Clock, X, ArrowLeft, ShieldCheck, Users, BadgeCheck, Backpack, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { Seo } from "@/components/Seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PackageCard, type PackageCardItem } from "@/components/PackageCard";
import { ParkFeesTable } from "@/components/ParkFeesTable";
import { supabase } from "@/integrations/supabase/client";

type ItineraryDay = { day?: string; title?: string; details?: string };

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

const DEFAULT_FAQ = [
  { q: "Is this trip suitable for families with children?", a: "Yes — we welcome families. Children under 12 receive a discounted rate, and our guides tailor activities to keep younger guests engaged. Please tell us their ages when booking." },
  { q: "What's the best time of year to go?", a: "Kenya is a year-round destination. The Great Migration peaks in the Mara from July to October. January–March offers excellent game viewing with fewer crowds. We help you choose dates that match your priorities." },
  { q: "Are park fees and government taxes included?", a: "Yes — all park entry fees, conservancy fees and government taxes for the listed itinerary are included. There are no hidden surcharges on arrival." },
  { q: "How safe is travel in Kenya?", a: "Kenya is a safe and welcoming destination for travellers. We use experienced licensed driver-guides, well-maintained 4x4 vehicles, and only partner with vetted accommodations." },
  { q: "Can the itinerary be customised?", a: "Absolutely. This is a starting point — extend nights, add a beach extension or swap accommodations to suit your style and budget. Just ask." },
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

const PackageDetail = () => {
  const { slug = "" } = useParams();
  const [pkg, setPkg] = useState<PackageRow | null>(null);
  const [related, setRelated] = useState<PackageCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("packages")
        .select("id,slug,title,category,duration,price_from,price_private,min_guests,image,summary,highlights,inclusions,exclusions,itinerary")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (!active) return;
      if (error || !data) { setNotFound(true); setLoading(false); return; }
      const row = data as unknown as PackageRow;
      setPkg(row);

      const { data: rel } = await supabase
        .from("packages")
        .select("slug,title,image,duration,price_from,price_private,min_guests,summary")
        .eq("category", row.category)
        .eq("published", true)
        .neq("slug", row.slug)
        .order("sort_order")
        .limit(3);
      if (active) setRelated((rel as PackageCardItem[]) ?? []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [slug]);

  if (notFound) return <Navigate to="/safaris" replace />;
  if (loading || !pkg) {
    return <div className="container-edge py-32 text-center text-muted-foreground">Loading package…</div>;
  }

  const categoryBackHref = pkg.category === "safari" ? "/safaris" : pkg.category === "day-trip" ? "/day-trips" : pkg.category === "combo" ? "/combo" : "/cultural";
  const itinerary = Array.isArray(pkg.itinerary) ? pkg.itinerary : [];
  const waMsg = encodeURIComponent(`Hi Karembo, I'm interested in the ${pkg.title}. Could you share more details?`);

  return (
    <>
      <Seo
        title={`${pkg.title} | Karembo Tours`}
        description={pkg.summary?.replace(/\s+/g, " ").slice(0, 150) || `Explore ${pkg.title} with Karembo Tours.`}
        path={`/packages/${pkg.slug}`}
        image={pkg.image}
        type="website"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: pkg.title,
            description: pkg.summary,
            image: pkg.image?.startsWith("http") ? pkg.image : `https://karembotours.co.ke${pkg.image}`,
            touristType: pkg.category === "safari" ? "Wildlife" : pkg.category === "cultural" ? "Cultural" : "Leisure",
            offers: { "@type": "Offer", price: pkg.price_from, priceCurrency: "USD" },
            provider: { "@type": "TravelAgency", name: "Karembo Tours and Safaris", url: "https://karembotours.co.ke" },
            itinerary: itinerary.map((d, i) => ({ "@type": "ItemList", position: i + 1, name: d.title, description: d.details })),
          },
        ]}
      />
      <PageHero image={pkg.image} eyebrow={pkg.duration} title={pkg.title} subtitle={pkg.summary?.split("\n")[0]}>
        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          <Link to={`/contact?package=${pkg.slug}`}>Request this Tour</Link>
        </Button>
      </PageHero>

      <section className="py-16 pb-32 md:pb-16">
        <div className="container-edge grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <div className="prose prose-stone max-w-none">
              <h2 className="font-serif text-3xl text-primary mb-4">Overview</h2>
              {pkg.summary?.split("\n").filter(Boolean).map((p, i) => (
                <p key={i} className="text-foreground/80 leading-relaxed mb-3">{p}</p>
              ))}
            </div>

            {/* Why book */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: ShieldCheck, title: "Expert local guides", desc: "Licensed driver-guides born and raised in Kenya." },
                { icon: Users, title: "Small group sizes", desc: "Window seats guaranteed in our 4x4 land cruisers." },
                { icon: BadgeCheck, title: "No hidden fees", desc: "Park fees, taxes & transfers all included." },
              ].map((b) => (
                <div key={b.title} className="p-5 bg-sand rounded-lg text-center">
                  <b.icon className="h-7 w-7 text-accent mx-auto mb-2" />
                  <div className="font-semibold text-primary mb-1">{b.title}</div>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>

            {/* Highlights */}
            {pkg.highlights?.length > 0 && (
              <div>
                <h2 className="font-serif text-3xl text-primary mb-4">Highlights</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-foreground/80">
                      <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" /> {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mid-page CTA */}
            <div className="bg-primary text-primary-foreground rounded-xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-serif text-xl">Ready to plan your trip?</div>
                <p className="text-primary-foreground/80 text-sm">Get a free, personalised quote within 24 hours.</p>
              </div>
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                <Link to={`/contact?package=${pkg.slug}`}>Get my free quote</Link>
              </Button>
            </div>

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <div>
                <h2 className="font-serif text-3xl text-primary mb-6">Day-by-day itinerary</h2>
                <div className="space-y-5">
                  {itinerary.map((d, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-sand rounded-lg">
                      <div className="shrink-0 h-12 w-12 rounded-full bg-secondary text-secondary-foreground font-serif text-lg flex items-center justify-center">
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-accent font-bold">{d.day ?? `Day ${i + 1}`}</div>
                        <h3 className="font-serif text-xl text-primary mb-1">{d.title}</h3>
                        <p className="text-muted-foreground whitespace-pre-line">{d.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions / exclusions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-sand rounded-lg">
                <h3 className="font-serif text-xl text-primary mb-4">Included</h3>
                <ul className="space-y-2 text-sm">
                  {pkg.inclusions?.map((i) => (
                    <li key={i} className="flex gap-2"><Check className="h-4 w-4 text-secondary mt-0.5" /> {i}</li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-sand rounded-lg">
                <h3 className="font-serif text-xl text-primary mb-4">Not included</h3>
                <ul className="space-y-2 text-sm">
                  {pkg.exclusions?.map((i) => (
                    <li key={i} className="flex gap-2"><X className="h-4 w-4 text-destructive mt-0.5" /> {i}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Park fees */}
            <ParkFeesTable context={[pkg.title, pkg.summary, ...(pkg.highlights ?? [])]} />

            {/* What to pack */}
            <Collapsible>
              <CollapsibleTrigger className="w-full flex items-center justify-between p-5 bg-sand rounded-lg hover:bg-sand/70 transition">
                <span className="flex items-center gap-2 font-serif text-lg text-primary">
                  <Backpack className="h-5 w-5 text-accent" /> What to pack
                </span>
                <span className="text-sm text-accent">Show list</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="grid sm:grid-cols-2 gap-2 mt-4 p-5 bg-card rounded-lg border border-border">
                  {DEFAULT_PACK.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" /> {p}
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>

            {/* FAQ */}
            <div>
              <h2 className="font-serif text-3xl text-primary mb-4">Frequently asked questions</h2>
              <Accordion type="single" collapsible className="bg-card rounded-lg border border-border px-5">
                {DEFAULT_FAQ.map((f, i) => (
                  <AccordionItem key={i} value={`q${i}`}>
                    <AccordionTrigger className="text-left font-medium text-primary">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-foreground/80">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-card rounded-xl shadow-card p-6 border border-border">
              <div className="text-sm text-muted-foreground">Starting from</div>
              <div className="font-serif text-4xl text-primary mb-1">${pkg.price_from}</div>
              <div className="text-xs text-muted-foreground mb-5">
                {pkg.min_guests
                  ? `per person sharing · minimum ${pkg.min_guests} guests`
                  : pkg.price_private
                    ? "per vehicle · private tour"
                    : "per person sharing"}
              </div>
              {pkg.min_guests && pkg.price_private ? (
                <div className="mb-5 rounded-lg bg-muted/60 p-3 text-sm space-y-1">
                  <p className="text-foreground/80">
                    Shared tour: <span className="font-semibold">${pkg.price_from} per person</span>
                  </p>
                  <p className="text-foreground/80">
                    Private tour: <span className="font-semibold">${pkg.price_private} per vehicle</span>
                  </p>
                </div>
              ) : null}

              <div className="flex items-center gap-2 text-sm text-foreground/80 mb-5">
                <Clock className="h-4 w-4 text-accent" /> {pkg.duration}
              </div>
              <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold mb-3">
                <Link to={`/contact?package=${pkg.slug}`}>Request this Tour</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href={`https://wa.me/254722736130?text=${waMsg}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp Enquiry
                </a>
              </Button>
              <div className="mt-5 pt-5 border-t border-border text-xs text-muted-foreground space-y-2">
                <div className="flex gap-2"><ShieldCheck className="h-4 w-4 text-accent shrink-0" /> Secure & flexible booking</div>
                <div className="flex gap-2"><BadgeCheck className="h-4 w-4 text-accent shrink-0" /> No hidden fees</div>
                <div className="flex gap-2"><Users className="h-4 w-4 text-accent shrink-0" /> 24/7 trip support</div>
              </div>
            </div>
            <Link to={categoryBackHref} className="mt-6 inline-flex items-center gap-2 text-sm text-secondary hover:text-accent">
              <ArrowLeft className="h-4 w-4" /> Back to all packages
            </Link>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 bg-sand">
          <div className="container-edge">
            <h2 className="font-serif text-3xl text-primary mb-2">You might also like</h2>
            <p className="text-muted-foreground mb-8">More handpicked {pkg.category.replace("-", " ")} experiences.</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => <PackageCard key={r.slug} tour={r} />)}
            </div>
          </div>
        </section>
      )}

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-card border-t border-border p-3 flex gap-2 shadow-elegant">
        <Button asChild className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          <Link to={`/contact?package=${pkg.slug}`}>Request quote</Link>
        </Button>
        <Button asChild variant="outline" size="icon">
          <a href={`https://wa.me/254722736130?text=${waMsg}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <MessageCircle className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </>
  );
};

export default PackageDetail;
