import { Link } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  MapPin,
  Waves,
  PawPrint,
  Sparkles,
  Sun,
} from "lucide-react";

import { PackageCard } from "@/components/PackageCard";
import { usePackagesByCategory } from "@/hooks/usePackages";
import { Seo } from "@/components/Seo";

const HERO = "/gallery/zebra-portrait.jpg";
const SITE_URL = "https://karembotours.co.ke";

const Combo = () => {
  const { items: tours } = usePackagesByCategory("combo");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/combo#webpage`,
        url: `${SITE_URL}/combo`,
        name: "Kenya Safari & Beach Holiday Packages | Karembo Tours",
        description:
          "Explore Kenya safari and beach holiday packages combining wildlife, culture and coastal escapes with Karembo Tours.",
        isPartOf: {
          "@type": "WebSite",
          name: "Karembo Tours",
          url: SITE_URL,
        },
        mainEntity: {
          "@type": "ItemList",
          name: "Kenya Safari and Beach Holiday Packages",
          numberOfItems: tours.length,
          itemListElement: tours.map((tour, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: tour.title,
            url: `${SITE_URL}/packages/${tour.slug}`,
          })),
        },
      },
      {
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
            name: "Safari & Beach Combos",
            item: `${SITE_URL}/combo`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Seo
        title="Kenya Safari & Beach Holiday Packages | Karembo Tours"
        description="Combine Kenya wildlife safaris with coastal escapes. Explore safari and beach holiday packages with Karembo Tours and plan a journey that brings together the best of Kenya."
        path="/combo"
        image={HERO}
        jsonLd={jsonLd}
      />

      <main className="bg-[#f5f1e8] text-[#20291f]">
        {/* Cinematic hero */}
        <section className="relative isolate flex min-h-[590px] items-end overflow-hidden bg-[#17251d] text-white md:min-h-[660px] md:items-center">
          <img
            src={HERO}
            alt="Zebra in the Kenyan wilderness, representing the wildlife experiences in Karembo safari and beach holidays"
            fetchPriority="high"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101b16]/90 via-[#142219]/60 to-[#142219]/15" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#101b16]/70 via-transparent to-black/10" />

          <div className="container-edge w-full py-20 md:py-28">
            <div className="max-w-4xl">
              <Link
                to="/"
                className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75 transition hover:text-[#e6c58a]"
              >
                <Compass className="h-4 w-4" />
                Discover the best of Kenya
              </Link>

              <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-[#e6c58a]">
                <span className="h-px w-10 bg-[#e6c58a]" />
                Wildlife to coastline
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1.04] tracking-[-0.04em] sm:text-6xl md:text-7xl">
                Two sides of Kenya.
                <br />
                One unforgettable journey.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                Bring together the thrill of the wild and the calm of the
                coast. Explore journeys that pair Kenya’s safari experiences
                with time to discover its culture and unwind by the Indian
                Ocean.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#combo-collection"
                  className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#d6a85f] px-7 text-sm font-bold uppercase tracking-[0.13em] text-[#1c281f] transition hover:bg-[#e7c58d]"
                >
                  Explore combo packages <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex min-h-14 items-center justify-center border border-white/55 px-7 text-sm font-semibold uppercase tracking-[0.13em] text-white transition hover:border-white hover:bg-white/10"
                >
                  Create a tailored journey
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/20 pt-6 text-xs font-semibold uppercase tracking-[0.15em] text-white/75">
                <span className="inline-flex items-center gap-2">
                  <PawPrint className="h-4 w-4 text-[#e6c58a]" />
                  Wildlife encounters
                </span>
                <span className="inline-flex items-center gap-2">
                  <Waves className="h-4 w-4 text-[#e6c58a]" />
                  Indian Ocean coast
                </span>
                <span className="inline-flex items-center gap-2">
                  <Sun className="h-4 w-4 text-[#e6c58a]" />
                  One connected holiday
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial introduction */}
        <section className="py-20 md:py-28">
          <div className="container-edge grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-end md:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b713b]">
                From the savannah to the sea
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-[#26372a] sm:text-5xl">
                Experience more of Kenya in one trip.
              </h2>
            </div>
            <div className="max-w-2xl">
              <p className="text-base leading-8 text-[#586056]">
                A safari and beach holiday lets you experience contrasting
                sides of Kenya in one itinerary. Spend time discovering the
                country's wildlife and landscapes, then enjoy a change of pace
                along the coast. Browse the available combinations below and
                speak with our team about shaping the journey around your
                dates and interests.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 border border-[#d8d0c2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#53604f]">
                  <PawPrint className="h-4 w-4 text-[#9b713b]" />
                  Safari
                </span>
                <span className="inline-flex items-center gap-2 border border-[#d8d0c2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#53604f]">
                  <Waves className="h-4 w-4 text-[#9b713b]" />
                  Coast
                </span>
                <span className="inline-flex items-center gap-2 border border-[#d8d0c2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#53604f]">
                  <Sparkles className="h-4 w-4 text-[#9b713b]" />
                  Culture
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Three-part story */}
        <section className="bg-[#ebe5da] py-16 md:py-20">
          <div className="container-edge">
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b713b]">
                A holiday of contrasts
              </p>
              <h2 className="mt-3 font-serif text-3xl text-[#26372a] sm:text-4xl">
                Let every part of the journey tell a story.
              </h2>
            </div>

            <div className="grid gap-px bg-[#d5cbb9] md:grid-cols-3">
              {[
                {
                  icon: PawPrint,
                  number: "01",
                  title: "The wild",
                  text: "Discover Kenya’s remarkable wildlife and open landscapes on safari.",
                },
                {
                  icon: Compass,
                  number: "02",
                  title: "The culture",
                  text: "Make room for local places, traditions and experiences along the way.",
                },
                {
                  icon: Waves,
                  number: "03",
                  title: "The coast",
                  text: "Slow the pace and enjoy time by the Indian Ocean.",
                },
              ].map(({ icon: Icon, number, title, text }) => (
                <article key={number} className="bg-[#ebe5da] p-7 sm:p-9">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl text-[#b8894d]">
                      {number}
                    </span>
                    <Icon className="h-7 w-7 text-[#9b713b]" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-8 font-serif text-2xl text-[#26372a]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#697064]">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Package collection */}
        <section
          id="combo-collection"
          className="scroll-mt-24 py-20 md:py-28"
        >
          <div className="container-edge">
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b713b]">
                  Find your perfect combination
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-tight text-[#26372a] sm:text-5xl">
                  Safari & beach packages
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-[#697064]">
                  Explore the available combo holidays and discover a Kenya
                  itinerary that brings together more than one kind of escape.
                </p>
              </div>
              {tours.length > 0 && (
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#777b70]">
                  {tours.length} {tours.length === 1 ? "journey" : "journeys"}
                </p>
              )}
            </div>

            {tours.length > 0 ? (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {tours.map((tour) => (
                  <PackageCard key={tour.slug} tour={tour} />
                ))}
              </div>
            ) : (
              <div className="border border-[#d8d0c2] bg-[#ebe5da] px-6 py-16 text-center sm:px-12">
                <Compass className="mx-auto h-9 w-9 text-[#a77d45]" />
                <h3 className="mt-5 font-serif text-2xl text-[#26372a]">
                  Your next great combination is taking shape
                </h3>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#697064]">
                  Our combo package collection is being updated. Contact the
                  Karembo team to discuss combining a wildlife safari with
                  time on Kenya’s coast.
                </p>
                <Link
                  to="/contact"
                  className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 bg-[#26372a] px-6 text-xs font-bold uppercase tracking-[0.13em] text-white transition hover:bg-[#3b5540]"
                >
                  Discuss your holiday <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="relative isolate overflow-hidden bg-[#26372a] py-20 text-white md:py-24">
          <div className="absolute -right-20 -top-28 -z-10 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -right-5 -top-14 -z-10 h-64 w-64 rounded-full border border-[#d6a85f]/20" />
          <div className="container-edge grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#e6c58a]">
                Make it your Kenya
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Your kind of adventure, from wild to wonderful.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                Share your travel dates, interests and preferred pace with our
                team. We’ll help you explore the possibilities for a connected
                safari and coast holiday.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#d6a85f] px-7 text-sm font-bold uppercase tracking-[0.13em] text-[#1c281f] transition hover:bg-[#e7c58d]"
            >
              Plan your combo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default Combo;
