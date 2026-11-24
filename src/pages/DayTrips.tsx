import { Link } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  MapPin,
  Sun,
  Clock3,
  Sparkles,
} from "lucide-react";

import { PackageCard } from "@/components/PackageCard";
import { usePackagesByCategory } from "@/hooks/usePackages";
import { Seo } from "@/components/Seo";

const HERO = "/gallery/elephant-closeup-vehicle.jpg";
const SITE_URL = "https://karembotours.co.ke";

const DayTrips = () => {
  const { items: tours } = usePackagesByCategory("day-trip");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/day-trips#webpage`,
        url: `${SITE_URL}/day-trips`,
        name: "Nairobi Day Trips & Excursions | Karembo Tours",
        description:
          "Discover Nairobi day trips, wildlife encounters and excursions around Kenya's capital with Karembo Tours.",
        isPartOf: {
          "@type": "WebSite",
          name: "Karembo Tours",
          url: SITE_URL,
        },
        mainEntity: {
          "@type": "ItemList",
          name: "Nairobi and Kenya Day Trips",
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
            name: "Day Trips & Excursions",
            item: `${SITE_URL}/day-trips`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Seo
        title="Nairobi Day Trips & Excursions | Karembo Tours"
        description="Discover Nairobi day trips, wildlife encounters and excursions around Kenya's capital. Explore Nairobi National Park and more with Karembo Tours."
        path="/day-trips"
        image={HERO}
        jsonLd={jsonLd}
      />

      <main className="bg-[#f5f1e8] text-[#20291f]">
        {/* Cinematic hero */}
        <section className="relative isolate flex min-h-[590px] items-end overflow-hidden bg-[#17251d] text-white md:min-h-[660px] md:items-center">
          <img
            src={HERO}
            alt="Close-up view of an elephant beside a safari vehicle on a Kenya wildlife experience"
            fetchPriority="high"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101b16]/90 via-[#142219]/60 to-[#142219]/15" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#101b16]/65 via-transparent to-black/10" />

          <div className="container-edge w-full py-20 md:py-28">
            <div className="max-w-4xl">
              <Link
                to="/"
                className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75 transition hover:text-[#e6c58a]"
              >
                <Compass className="h-4 w-4" />
                Explore Kenya with Karembo
              </Link>

              <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-[#e6c58a]">
                <span className="h-px w-10 bg-[#e6c58a]" />
                Nairobi and beyond
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1.04] tracking-[-0.04em] sm:text-6xl md:text-7xl">
                A day out.
                <br />
                A world of discovery.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                Make more of your time in Kenya with memorable half-day and
                full-day excursions in and around the capital — from wildlife
                encounters to places rich in culture and character.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#day-trip-collection"
                  className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#d6a85f] px-7 text-sm font-bold uppercase tracking-[0.13em] text-[#1c281f] transition hover:bg-[#e7c58d]"
                >
                  Explore day trips <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex min-h-14 items-center justify-center border border-white/55 px-7 text-sm font-semibold uppercase tracking-[0.13em] text-white transition hover:border-white hover:bg-white/10"
                >
                  Plan a private experience
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/20 pt-6 text-xs font-semibold uppercase tracking-[0.15em] text-white/75">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#e6c58a]" />
                  Nairobi and nearby
                </span>
                <span className="inline-flex items-center gap-2">
                  <Sun className="h-4 w-4 text-[#e6c58a]" />
                  Half-day and full-day
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-[#e6c58a]" />
                  Make every day count
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial introduction */}
        <section className="py-20 md:py-28">
          <div className="container-edge grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end md:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b713b]">
                Short on time? Go further.
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-[#26372a] sm:text-5xl">
                Kenya has a way of making one day unforgettable.
              </h2>
            </div>
            <div className="max-w-2xl">
              <p className="text-base leading-8 text-[#586056]">
                You don't need a long itinerary to experience the spirit of
                Kenya. Our day-trip collection brings together excursions
                designed to help you discover more while keeping your plans
                flexible. Find an experience that fits your schedule, then
                speak with our team about the details.
              </p>
              <div className="mt-7 flex items-center gap-3 text-sm font-semibold text-[#344536]">
                <Sparkles className="h-5 w-5 text-[#b8894d]" />
                Thoughtful experiences, planned around your day
              </div>
            </div>
          </div>
        </section>

        {/* Small feature strip */}
        <section className="border-y border-[#ded6c8] bg-[#ebe5da] py-8">
          <div className="container-edge grid gap-7 sm:grid-cols-3">
            {[
              {
                number: "01",
                title: "Choose your pace",
                text: "Browse excursions suited to a shorter travel window.",
              },
              {
                number: "02",
                title: "Discover more",
                text: "Explore wildlife, culture and places around Nairobi.",
              },
              {
                number: "03",
                title: "Make it yours",
                text: "Contact the team to discuss your preferred experience.",
              },
            ].map((item) => (
              <div key={item.number} className="flex gap-4">
                <span className="font-serif text-2xl text-[#b8894d]">
                  {item.number}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-[#26372a]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#697064]">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Day trip package collection */}
        <section
          id="day-trip-collection"
          className="scroll-mt-24 py-20 md:py-28"
        >
          <div className="container-edge">
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b713b]">
                  Find your next experience
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-tight text-[#26372a] sm:text-5xl">
                  Day trips & excursions
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-[#697064]">
                  Explore the available experiences and choose the day out
                  that speaks to you.
                </p>
              </div>
              {tours.length > 0 && (
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#777b70]">
                  {tours.length} {tours.length === 1 ? "experience" : "experiences"}
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
                  New experiences are on the way
                </h3>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#697064]">
                  We’re preparing the next collection of day trips. Get in
                  touch with our team and we’ll help you explore the options
                  available for your visit.
                </p>
                <Link
                  to="/contact"
                  className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 bg-[#26372a] px-6 text-xs font-bold uppercase tracking-[0.13em] text-white transition hover:bg-[#3b5540]"
                >
                  Talk to our team <ArrowRight className="h-4 w-4" />
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
                Your day, your discovery
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Have a little time? Make a big memory.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                Tell us when you’ll be in Kenya and what you’d love to
                experience. The Karembo team can help you explore the right
                options for your schedule.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#d6a85f] px-7 text-sm font-bold uppercase tracking-[0.13em] text-[#1c281f] transition hover:bg-[#e7c58d]"
            >
              Start planning <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default DayTrips;
