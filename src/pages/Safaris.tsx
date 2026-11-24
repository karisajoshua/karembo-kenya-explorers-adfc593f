import { Link } from "react-router-dom";
import { ArrowRight, Compass, MapPinned, PawPrint } from "lucide-react";
import { PackageCard } from "@/components/PackageCard";
import { usePackagesByCategory } from "@/hooks/usePackages";
import { Seo } from "@/components/Seo";

import HERO from "@/assets/uploads/elephant-tusks.jpg";

const SITE_URL = "https://karembotours.co.ke";

const Safaris = () => {
  const { items: tours } = usePackagesByCategory("safari");

  const safariItems = tours.map((tour, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: tour.title,
    url: `${SITE_URL}/packages/${tour.slug}`,
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/safaris#webpage`,
        url: `${SITE_URL}/safaris`,
        name: "Kenya Safari Packages | Karembo Tours",
        description:
          "Discover Kenya safari packages, from Masai Mara wildlife adventures to tailor-made journeys across Kenya's iconic landscapes.",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${SITE_URL}/safaris#breadcrumb` },
        mainEntity: { "@id": `${SITE_URL}/safaris#packages` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/safaris#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Safaris", item: `${SITE_URL}/safaris` },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/safaris#packages`,
        name: "Kenya Safari Packages",
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: safariItems.length,
        itemListElement: safariItems,
      },
    ],
  };

  return (
    <>
      <Seo
        title="Kenya Safari Packages & Masai Mara Tours | Karembo Tours"
        description="Explore Kenya safari packages with Karembo Tours. Discover Masai Mara wildlife, Big Five game drives and tailor-made journeys through Kenya's iconic wilderness."
        path="/safaris"
        image={HERO}
        jsonLd={structuredData}
      />

      <main className="bg-[#f5f1e8] text-[#20291f]">
        {/* Immersive editorial hero */}
        <section className="relative isolate min-h-[620px] overflow-hidden bg-[#17251d] text-white md:min-h-[700px]">
          <img
            src={HERO}
            alt="Elephants moving through the Kenyan wilderness on safari"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            fetchPriority="high"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101b16]/95 via-[#142219]/75 to-[#142219]/20" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#101b16]/75 via-transparent to-black/10" />

          <div className="container-edge flex min-h-[620px] items-end py-20 md:min-h-[700px] md:items-center md:py-24">
            <div className="max-w-3xl">
              <div className="mb-7 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#e6c58a]">
                <span className="h-px w-10 bg-[#e6c58a]" />
                The wild heart of Kenya
              </div>

              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.04] tracking-[-0.035em] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                Find your wild.
                <span className="mt-2 block italic text-[#e6c58a]">
                  Discover Kenya.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
                From the open plains of the Masai Mara to unforgettable encounters
                with Kenya’s wildlife, discover journeys shaped around the way you
                want to experience Africa.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#safari-packages"
                  className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#d6a85f] px-7 text-sm font-bold uppercase tracking-[0.13em] text-[#1c281f] transition hover:bg-[#e7c58d]"
                >
                  Explore safari packages <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/quote"
                  className="inline-flex min-h-14 items-center justify-center border border-white/50 px-7 text-sm font-semibold uppercase tracking-[0.13em] text-white transition hover:border-white hover:bg-white/10"
                >
                  Plan a tailor-made safari
                </Link>
              </div>

              <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/20 pt-6 text-xs font-medium uppercase tracking-[0.16em] text-white/70">
                <span className="inline-flex items-center gap-2"><PawPrint className="h-4 w-4 text-[#e6c58a]" /> Wildlife encounters</span>
                <span className="inline-flex items-center gap-2"><MapPinned className="h-4 w-4 text-[#e6c58a]" /> Kenya, your way</span>
                <span className="inline-flex items-center gap-2"><Compass className="h-4 w-4 text-[#e6c58a]" /> Locally crafted journeys</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 hidden w-[28%] border-l border-t border-white/20 bg-[#1c2a21]/70 px-8 py-6 backdrop-blur-sm lg:block">
            <p className="font-serif text-2xl italic text-[#e6c58a]">Karibu Kenya</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/65">
              Your safari begins here
            </p>
          </div>
        </section>

        {/* Introductory editorial section */}
        <section className="container-edge grid gap-8 py-20 md:grid-cols-[0.8fr_1.2fr] md:items-end md:py-28">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9b713b]">
              Beyond the ordinary
            </p>
            <h2 className="mt-5 max-w-md font-serif text-4xl leading-tight tracking-tight text-[#26372a] sm:text-5xl">
              Africa is not just a place you visit.
              <span className="block italic text-[#9b713b]">It’s a feeling.</span>
            </h2>
          </div>
          <div className="max-w-2xl md:justify-self-end">
            <p className="text-base leading-8 text-[#586056]">
              Every safari has its own rhythm. Early mornings on the plains,
              the quiet anticipation of a game drive, and the wonder of seeing
              wildlife in its natural home. Explore our Kenya safari packages
              and find a journey that feels like yours.
            </p>
            <p className="mt-4 text-base leading-8 text-[#586056]">
              Whether you are dreaming of the Masai Mara or looking to discover
              more of Kenya, our team can help you shape an experience around
              your interests, pace and travel plans.
            </p>
          </div>
        </section>

        {/* Package collection */}
        <section id="safari-packages" className="scroll-mt-24 bg-[#e9e3d7] py-20 md:py-28">
          <div className="container-edge">
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9b713b]">
                  Choose your adventure
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-[#26372a] sm:text-5xl">
                  Kenya safari packages
                </h2>
                <p className="mt-4 max-w-xl leading-7 text-[#62675e]">
                  Explore our available safari journeys and find the experience
                  that speaks to you.
                </p>
              </div>
              <Link
                to="/quote"
                className="inline-flex w-fit items-center gap-3 border-b border-[#9b713b] pb-2 text-sm font-bold uppercase tracking-[0.12em] text-[#344536] transition hover:gap-5"
              >
                Need something bespoke? <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {tours.length > 0 ? (
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {tours.map((tour) => (
                  <PackageCard key={tour.slug} tour={tour} />
                ))}
              </div>
            ) : (
              <div className="border border-[#d3c8b6] bg-[#f5f1e8] px-6 py-16 text-center md:px-12">
                <p className="font-serif text-3xl text-[#26372a]">
                  Your next adventure is taking shape.
                </p>
                <p className="mx-auto mt-4 max-w-lg leading-7 text-[#62675e]">
                  Our safari collection is being updated. Get in touch and we’ll
                  help you plan a journey through Kenya.
                </p>
                <Link
                  to="/quote"
                  className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 bg-[#26372a] px-6 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#3b5140]"
                >
                  Enquire about a safari <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Closing conversion section */}
        <section className="relative overflow-hidden bg-[#1d2b21] py-20 text-white md:py-28">
          <div className="container-edge relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e6c58a]">
                Let’s make it unforgettable
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Your Kenya story starts with a journey.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-white/70">
                Tell us what you would love to experience. We’ll help you take
                the first step towards your safari.
              </p>
            </div>
            <Link
              to="/quote"
              className="inline-flex min-h-14 shrink-0 items-center justify-center gap-3 bg-[#d6a85f] px-8 text-sm font-bold uppercase tracking-[0.13em] text-[#1c281f] transition hover:bg-[#e7c58d]"
            >
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

export default Safaris;
