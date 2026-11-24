import { Link } from "react-router-dom";
import { ArrowRight, Compass, HandHeart, Users } from "lucide-react";
import { PackageCard } from "@/components/PackageCard";
import { usePackagesByCategory } from "@/hooks/usePackages";
import { Seo } from "@/components/Seo";

const HERO = "/gallery/lioness-resting.jpg";
const SITE_URL = "https://karembotours.co.ke";

const Cultural = () => {
  const { items: tours } = usePackagesByCategory("cultural");

  const tourItems = tours.map((tour, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: tour.title,
    url: `${SITE_URL}/packages/${tour.slug}`,
  }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Kenya Cultural Tours & Experiences",
      description:
        "Explore cultural tours and experiences in Kenya with Karembo Tours.",
      url: `${SITE_URL}/cultural`,
      image: `${SITE_URL}${HERO}`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: tourItems,
      },
    },
    {
      "@context": "https://schema.org",
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
          name: "Cultural Experiences",
          item: `${SITE_URL}/cultural`,
        },
      ],
    },
  ];

  return (
    <>
      <Seo
        title="Kenya Cultural Tours & Experiences | Karembo Tours"
        description="Discover Maasai village visits, Bomas of Kenya and Samburu cultural experiences. Explore Kenya's diverse communities with Karembo Tours."
        path="/cultural"
        image={HERO}
        type="website"
        jsonLd={jsonLd}
      />

      <main className="overflow-hidden bg-[#f7f5ef] text-[#183c32]">
        {/* Cinematic page hero */}
        <section className="relative isolate flex min-h-[590px] items-end bg-[#102b24] md:min-h-[680px]">
          <img
            src={HERO}
            alt="A lioness resting in the Kenyan wilderness"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            fetchPriority="high"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b211c]/90 via-[#102b24]/55 to-[#102b24]/10" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#102b24]/75 via-transparent to-[#102b24]/10" />

          <div className="container-edge w-full pb-20 pt-36 md:pb-28">
            <div className="max-w-3xl">
              <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#d6bd7b]">
                <span className="h-px w-10 bg-[#d6bd7b]" />
                Heart of Kenya
              </div>
              <h1 className="font-serif text-5xl font-medium leading-[1.04] tracking-tight text-[#fffdf7] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                Meet the people
                <br />
                <span className="italic text-[#d6bd7b]">behind the place.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
                Walk with the Maasai, learn from elders, and feel the rhythm of
                community life. Discover Kenya through experiences that bring
                its living cultures into focus.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#cultural-tours"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#d6bd7b] px-7 py-3 text-sm font-semibold text-[#183c32] transition hover:bg-[#e6d39e]"
                >
                  Explore experiences <ArrowRight size={17} />
                </a>
                <Link
                  to="/quote"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/45 px-7 py-3 text-sm font-semibold text-white transition hover:border-[#d6bd7b] hover:bg-white/10"
                >
                  Plan a cultural journey
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 hidden w-[31%] border-l border-t border-white/20 bg-[#183c32]/80 p-7 backdrop-blur-md lg:block">
            <p className="font-serif text-2xl italic text-[#f7f5ef]">
              “Travel is richer when we take time to listen.”
            </p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d6bd7b]">
              Discover Kenya with Karembo
            </p>
          </div>
        </section>

        {/* Editorial introduction */}
        <section className="container-edge grid gap-10 py-20 md:grid-cols-[0.8fr_1.2fr] md:items-end md:py-28">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#a17e3e]">
              Beyond the landscape
            </p>
            <h2 className="max-w-md font-serif text-4xl leading-tight text-[#183c32] md:text-5xl">
              Kenya is a story told by many voices.
            </h2>
          </div>
          <div className="max-w-2xl md:justify-self-end">
            <p className="text-base leading-8 text-[#53645b] md:text-lg">
              From the traditions of Maasai communities to the performances
              and heritage displays at Bomas of Kenya, cultural experiences
              offer another way to understand the country. Take a thoughtful
              journey into the people, traditions and stories that make each
              region distinct.
            </p>
          </div>
        </section>

        {/* Experience themes */}
        <section className="border-y border-[#e4e0d5] bg-[#eeece3]">
          <div className="container-edge grid divide-y divide-[#dcd7c9] py-2 md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="flex gap-5 py-8 md:px-8 md:first:pl-0">
              <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#183c32] text-[#d6bd7b]">
                <Users size={20} />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#183c32]">People & heritage</h3>
                <p className="mt-2 text-sm leading-6 text-[#657269]">
                  Learn about the communities and traditions that shape Kenya.
                </p>
              </div>
            </div>
            <div className="flex gap-5 py-8 md:px-8">
              <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#183c32] text-[#d6bd7b]">
                <Compass size={20} />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#183c32]">A wider perspective</h3>
                <p className="mt-2 text-sm leading-6 text-[#657269]">
                  Add cultural discovery to a safari or a wider Kenya itinerary.
                </p>
              </div>
            </div>
            <div className="flex gap-5 py-8 md:px-8 md:pr-0">
              <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#183c32] text-[#d6bd7b]">
                <HandHeart size={20} />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#183c32]">Travel thoughtfully</h3>
                <p className="mt-2 text-sm leading-6 text-[#657269]">
                  Approach every visit with curiosity, respect and an open mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic cultural tour collection */}
        <section id="cultural-tours" className="container-edge scroll-mt-28 py-20 md:py-28">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#a17e3e]">
                Curated cultural journeys
              </p>
              <h2 className="font-serif text-4xl leading-tight text-[#183c32] md:text-5xl">
                Experiences that stay with you.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#657269]">
                Explore our available cultural tours and choose an experience
                that brings you closer to the stories and heritage of Kenya.
              </p>
            </div>
            <span className="text-sm font-medium text-[#758078]">
              {tours.length} {tours.length === 1 ? "experience" : "experiences"}
            </span>
          </div>

          {tours.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour) => (
                <PackageCard key={tour.slug} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#e2ddcf] bg-white/70 px-6 py-16 text-center">
              <p className="font-serif text-2xl text-[#183c32]">
                New cultural journeys are on the way.
              </p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#68766e]">
                Our team can help you explore a cultural experience as part of
                a tailor-made Kenya itinerary.
              </p>
              <Link
                to="/quote"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#183c32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#285446]"
              >
                Enquire with our team <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>

        {/* Closing call to action */}
        <section className="relative isolate overflow-hidden bg-[#183c32] py-20 text-[#fffdf7] md:py-24">
          <div className="absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -right-10 -top-16 -z-10 h-64 w-64 rounded-full border border-[#d6bd7b]/20" />
          <div className="container-edge flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#d6bd7b]">
                Make it meaningful
              </p>
              <h2 className="font-serif text-4xl leading-tight md:text-5xl">
                Let Kenya’s stories shape your journey.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-white/70">
                Tell us what you would like to discover. We can help you plan a
                cultural experience or weave one into a wider trip.
              </p>
            </div>
            <Link
              to="/quote"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-[#d6bd7b] px-7 py-3 text-sm font-semibold text-[#183c32] transition hover:bg-[#e6d39e]"
            >
              Start planning <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default Cultural;
