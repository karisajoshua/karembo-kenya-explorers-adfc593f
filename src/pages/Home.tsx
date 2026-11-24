import { Link } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  HeartHandshake,
  MapPinned,
  PawPrint,
  Sparkles,
} from "lucide-react";
import { PackageCard } from "@/components/PackageCard";
import { usePackagesByCategory } from "@/hooks/usePackages";
import { Seo } from "@/components/Seo";

import HERO from "@/assets/uploads/wildebeest-crossing.jpg";
import MARA from "@/assets/uploads/elephant-tusks.jpg";
import WILDLIFE from "@/assets/uploads/lion-male.jpg";
import LANDSCAPE from "@/assets/uploads/elephant-crossing.jpg";
import EXPERIENCE from "@/assets/uploads/safari-binoculars.jpg";

const SITE_URL = "https://karembotours.co.ke";

const Home = () => {
  const { items: safariPackages } = usePackagesByCategory("safari");
  const { items: dayTripPackages } = usePackagesByCategory("day-trip");

  const featuredSafaris = safariPackages.slice(0, 3);
  const featuredDayTrips = dayTripPackages.slice(0, 3);

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Karembo Tours",
        description:
          "Locally crafted Kenya safaris, wildlife adventures and tailor-made travel experiences.",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Karembo Tours",
        url: SITE_URL,
        logo: `${SITE_URL}/gallery/karembo-logo.png`,
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: "Karembo Tours | Discover Kenya, Your Way",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  const pillars = [
    {
      icon: Compass,
      title: "Journeys with meaning",
      text: "Thoughtfully planned experiences that make room for the places, people and moments that make Kenya unforgettable.",
    },
    {
      icon: HeartHandshake,
      title: "Local knowledge",
      text: "Discover Kenya with a team that understands its landscapes and brings a local perspective to every journey.",
    },
    {
      icon: Sparkles,
      title: "Made around you",
      text: "From a short escape to a multi-day adventure, your travel plans and interests help shape the experience.",
    },
  ];

  return (
    <>
      <Seo
        title="Karembo Tours | Kenya Safaris, Masai Mara & Day Trips"
        description="Discover Kenya with Karembo Tours. Explore Masai Mara safari packages, Nairobi day trips, wildlife encounters and tailor-made Kenyan travel experiences."
        path="/"
        image={HERO}
        jsonLd={homeSchema}
      />

      <main className="bg-[#f5f1e8] text-[#20291f]">
        {/* Immersive homepage hero */}
        <section className="relative isolate min-h-[680px] overflow-hidden bg-[#17251d] text-white md:min-h-[790px]">
          <img
            src={HERO}
            alt="Wildebeest crossing the river during the Great Migration in Kenya"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            fetchPriority="high"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101b16]/90 via-[#142219]/55 to-[#142219]/10" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#101b16]/75 via-transparent to-black/10" />

          <div className="container-edge flex min-h-[680px] items-end py-20 md:min-h-[790px] md:items-center md:py-24">
            <div className="max-w-4xl">
              <p className="mb-7 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#e6c58a]">
                <span className="h-px w-10 bg-[#e6c58a]" />
                Karembo Tours · Kenya, Africa
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[6.4rem]">
                Discover Kenya.
                <span className="mt-2 block italic text-[#e6c58a]">
                  Feel the wild.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                From the sweeping plains of the Masai Mara to the vibrant spirit
                of Nairobi, experience Kenya through journeys crafted with local
                insight and a genuine love for the wild.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/safaris"
                  className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#d6a85f] px-8 text-sm font-bold uppercase tracking-[0.13em] text-[#1c281f] transition hover:bg-[#e7c58d]"
                >
                  Explore our safaris <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/quote"
                  className="inline-flex min-h-14 items-center justify-center border border-white/55 px-8 text-sm font-semibold uppercase tracking-[0.13em] text-white transition hover:border-white hover:bg-white/10"
                >
                  Create your journey
                </Link>
              </div>

              <div className="mt-16 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/20 pt-6 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                <span className="inline-flex items-center gap-2"><PawPrint className="h-4 w-4 text-[#e6c58a]" /> Wildlife experiences</span>
                <span className="inline-flex items-center gap-2"><MapPinned className="h-4 w-4 text-[#e6c58a]" /> Kenya destinations</span>
                <span className="inline-flex items-center gap-2"><HeartHandshake className="h-4 w-4 text-[#e6c58a]" /> Local expertise</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 hidden w-[26%] border-l border-t border-white/20 bg-[#1c2a21]/75 px-8 py-7 backdrop-blur-sm lg:block">
            <p className="font-serif text-3xl italic text-[#e6c58a]">Karibu Kenya</p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">
              The adventure is yours
            </p>
          </div>
        </section>

        {/* Brand introduction */}
        <section className="container-edge grid gap-12 py-20 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-28">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9b713b]">
              Welcome to Karembo
            </p>
            <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[1.12] tracking-tight text-[#26372a] sm:text-5xl">
              Not just a destination.
              <span className="block italic text-[#9b713b]">A feeling that stays.</span>
            </h2>
          </div>
          <div className="max-w-2xl md:justify-self-end">
            <p className="text-base leading-8 text-[#586056]">
              Kenya has a way of staying with you: the golden light across the
              savannah, the anticipation of a game drive, the warmth of its
              people and the wonder of seeing wildlife where it belongs.
            </p>
            <p className="mt-4 text-base leading-8 text-[#586056]">
              At Karembo Tours, we help you experience those moments through
              safari adventures, Nairobi day trips and journeys shaped around
              what you want to discover.
            </p>
            <Link
              to="/about"
              className="mt-7 inline-flex items-center gap-3 border-b border-[#9b713b] pb-2 text-sm font-bold uppercase tracking-[0.12em] text-[#344536] transition hover:gap-5"
            >
              Get to know us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Brand pillars */}
        <section className="bg-[#26372a] py-16 text-white md:py-20">
          <div className="container-edge">
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e6c58a]">
                The Karembo difference
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
                Thoughtful travel. Unforgettable Kenya.
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {pillars.map(({ icon: Icon, title, text }, index) => (
                <article
                  key={title}
                  className="border-t border-white/20 pt-7"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-7 w-7 text-[#e6c58a]" strokeWidth={1.5} />
                    <span className="font-serif text-2xl italic text-white/35">0{index + 1}</span>
                  </div>
                  <h3 className="mt-7 font-serif text-2xl">{title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-white/65">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Featured safari packages */}
        <section className="py-20 md:py-28">
          <div className="container-edge">
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9b713b]">
                  Into the wild
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-tight text-[#26372a] sm:text-5xl">
                  Safari journeys to remember
                </h2>
                <p className="mt-4 max-w-xl leading-7 text-[#62675e]">
                  Discover our Kenya safari experiences and find the journey
                  that brings you closer to the wild.
                </p>
              </div>
              <Link
                to="/safaris"
                className="inline-flex w-fit items-center gap-3 border-b border-[#9b713b] pb-2 text-sm font-bold uppercase tracking-[0.12em] text-[#344536] transition hover:gap-5"
              >
                View all safaris <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {featuredSafaris.length > 0 ? (
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {featuredSafaris.map((tour) => (
                  <PackageCard key={tour.slug} tour={tour} />
                ))}
              </div>
            ) : (
              <div className="border border-[#d3c8b6] bg-white/50 px-6 py-12 text-center">
                <p className="font-serif text-2xl text-[#26372a]">Safari experiences are being updated.</p>
                <p className="mt-3 text-sm leading-7 text-[#62675e]">Contact our team and we’ll help you plan your Kenya adventure.</p>
                <Link to="/quote" className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#8d6736]">Plan a safari <ArrowRight className="h-4 w-4" /></Link>
              </div>
            )}
          </div>
        </section>

        {/* Day trips feature band */}
        <section className="grid bg-[#e9e3d7] lg:grid-cols-2">
          <div className="relative min-h-[420px] overflow-hidden lg:min-h-[620px]">
            <img src={MARA} alt="Elephants in the Kenyan wilderness" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101b16]/55 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white md:bottom-12 md:left-12">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f0d5a6]">Make every moment count</p>
              <p className="mt-3 font-serif text-3xl italic md:text-4xl">The beauty is closer than you think.</p>
            </div>
          </div>
          <div className="flex items-center py-16 md:py-20">
            <div className="container-edge max-w-2xl lg:px-14">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9b713b]">Short escapes, big memories</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-[#26372a] sm:text-5xl">Discover Nairobi & beyond</h2>
              <p className="mt-5 leading-8 text-[#62675e]">
                You don’t need weeks away to experience something extraordinary.
                Explore day trips and discover the wildlife, landscapes and
                culture waiting just beyond the city.
              </p>
              <Link to="/day-trips" className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#26372a] px-6 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#3b5140]">
                Explore day trips <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Day trip package collection */}
        {featuredDayTrips.length > 0 && (
          <section className="bg-[#e9e3d7] pb-20 md:pb-28"><br /><br /><br />
            <div className="container-edge">
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {featuredDayTrips.map((tour) => (
                  <PackageCard key={tour.slug} tour={tour} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Cultural / experience feature */}
        <section className="relative isolate overflow-hidden bg-[#17251d] py-20 text-white md:py-28">
          <img src={EXPERIENCE} alt="A safari experience in Kenya" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35" loading="lazy" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#142219] via-[#142219]/90 to-[#142219]/55" />
          <div className="container-edge grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e6c58a]">More than a game drive</p>
              <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
                Meet the culture.
                <span className="block italic text-[#e6c58a]">Feel the connection.</span>
              </h2>
            </div>
            <div>
              <p className="text-base leading-8 text-white/75">
                A memorable journey is about more than the places on a map.
                Discover the traditions, stories and local experiences that
                make Kenya unique.
              </p>
              <Link to="/cultural" className="mt-8 inline-flex min-h-12 items-center gap-3 border border-white/50 px-6 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:border-[#e6c58a] hover:bg-white/10">
                Explore cultural experiences <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Secondary visual storytelling strip */}
        <section className="container-edge grid gap-5 py-20 md:grid-cols-2 md:items-center md:py-24">
          <div className="grid grid-cols-2 gap-4">
            <img src={WILDLIFE} alt="Lion in the Kenyan savannah" className="mt-10 aspect-[3/4] w-full object-cover" loading="lazy" />
            <img src={LANDSCAPE} alt="Elephants crossing the open landscape" className="aspect-[3/4] w-full object-cover" loading="lazy" />
          </div>
          <div className="md:pl-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9b713b]">Your story, your pace</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#26372a] sm:text-5xl">
              The moments you’ll talk about for years.
            </h2>
            <p className="mt-5 leading-8 text-[#62675e]">
              Whether it’s your first safari or a return to a place you love,
              we believe the best journeys leave space for discovery. Tell us
              what inspires you and let’s start planning.
            </p>
            <Link to="/quote" className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#d6a85f] px-6 text-sm font-bold uppercase tracking-[0.12em] text-[#1c281f] transition hover:bg-[#e7c58d]">
              Plan your trip <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Final conversion section */}
        <section className="relative overflow-hidden bg-[#26372a] py-20 text-white md:py-28">
          <div className="container-edge relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e6c58a]">Your Kenya adventure awaits</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Let’s make your journey unforgettable.</h2>
              <p className="mt-5 max-w-xl leading-7 text-white/70">
                Share your travel ideas with us. We’ll help you turn them into
                a Kenya experience worth remembering.
              </p>
            </div>
            <Link to="/quote" className="inline-flex min-h-14 shrink-0 items-center justify-center gap-3 bg-[#d6a85f] px-8 text-sm font-bold uppercase tracking-[0.13em] text-[#1c281f] transition hover:bg-[#e7c58d]">
              Start planning <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-20 h-72 w-72 rounded-full border border-white/10" />
        </section>
      </main>
    </>
  );
};

export default Home;
