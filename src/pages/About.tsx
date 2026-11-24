
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Compass,
  Globe,
  Heart,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo, orgJsonLd } from "@/components/Seo";

import HERO from "@/assets/uploads/lioness-resting.jpg";
import STORY_IMG from "@/assets/uploads/lion-male.jpg";

const SITE_URL = "https://karembotours.co.ke";

const values = [
  {
    icon: Award,
    number: "01",
    title: "Authentic Expertise",
    body: "Our focus is on creating thoughtfully planned journeys that bring you closer to Kenya's remarkable wildlife, landscapes and destinations.",
  },
  {
    icon: Users,
    number: "02",
    title: "Personal Service",
    body: "From your first inquiry to the details of your journey, we aim to make planning your Kenyan adventure personal and straightforward.",
  },
  {
    icon: Leaf,
    number: "03",
    title: "Responsible Travel",
    body: "We value travel experiences that respect Kenya's natural heritage, wildlife and the communities that make each destination special.",
  },
  {
    icon: Globe,
    number: "04",
    title: "Tailor-made Journeys",
    body: "Whether it is a short excursion or an extended safari, we offer flexible travel options shaped around your interests.",
  },
];

const experiences = [
  {
    icon: Compass,
    title: "Wildlife Safaris",
    body: "Discover Kenya's remarkable wildlife through guided safari experiences in its iconic natural landscapes.",
    link: "/safaris",
    linkText: "Explore safaris",
  },
  {
    icon: MapPin,
    title: "Day Trips & Excursions",
    body: "Experience more of Kenya with shorter adventures, city excursions and visits to remarkable destinations.",
    link: "/day-trips",
    linkText: "Discover day trips",
  },
  {
    icon: Heart,
    title: "Cultural Experiences",
    body: "Explore the heritage, traditions and stories that make Kenya such a fascinating destination.",
    link: "/cultural",
    linkText: "Explore experiences",
  },
];

const About = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...orgJsonLd,
      },
      {
        "@type": "AboutPage",
        "@id": `${SITE_URL}/about#aboutpage`,
        url: `${SITE_URL}/about`,
        name: "About Karembo Tours and Safaris",
        description:
          "Learn about Karembo Tours and Safaris, a Nairobi-based Kenyan tour company offering wildlife safaris, cultural experiences and personalised tours.",
        isPartOf: {
          "@type": "WebSite",
          name: "Karembo Tours",
          url: SITE_URL,
        },
        about: {
          "@type": "Organization",
          name: "Karembo Tours and Safaris",
        },
      },
    ],
  };

  return (
    <>
      <Seo
        title="About Karembo Tours | Kenyan Safari & Travel Specialists"
        description="Get to know Karembo Tours and Safaris, a Nairobi-based Kenyan tour company creating personalised wildlife safaris, cultural tours and memorable Kenya travel experiences."
        path="/about"
        image="/gallery/lion-male.jpg"
        type="website"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="relative min-h-[75vh] overflow-hidden bg-[#10271e] text-white">
        <div className="absolute inset-0">
          <img
            src={HERO}
            alt="A lioness resting in the African wilderness in Kenya"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#091b14]/90 via-[#10271e]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10271e]/70 via-transparent to-black/10" />
        </div>

        <div className="container-edge relative z-10 flex min-h-[75vh] items-end pb-20 pt-36 md:pb-28">
          <div className="max-w-3xl">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-[#c6a66b]" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e3c995]">
                The Karembo story
              </span>
            </div>

            <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              Rooted in Kenya.
              <br />
              <span className="italic text-[#d6bd8e]">
                Inspired by discovery.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-white/80 md:text-lg">
              We believe the best journeys go beyond the destination. They
              connect you with the wildlife, landscapes and experiences that
              make Kenya unforgettable.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a
                href="#our-story"
                className="inline-flex items-center gap-3 bg-[#c6a66b] px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[#14251d] transition hover:bg-[#ddc18a]"
              >
                Discover our story
                <ArrowRight size={16} />
              </a>

              <span className="flex items-center gap-2 text-sm text-white/70">
                <MapPin size={16} />
                Nairobi, Kenya
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section
        id="our-story"
        className="scroll-mt-20 bg-[#f7f5ef] py-20 md:py-28"
      >
        <div className="container-edge">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-28 w-28 border-l border-t border-[#b7975d] md:-left-7 md:-top-7 md:h-40 md:w-40" />

              <div className="relative aspect-[4/5] overflow-hidden bg-[#dedbd1]">
                <img
                  src={STORY_IMG}
                  alt="A male lion in its natural habitat on a Kenyan safari"
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
                />
              </div>

              <div className="absolute -bottom-7 right-0 max-w-[240px] bg-[#18372a] p-6 text-white md:-right-7 md:max-w-[270px] md:p-8">
                <Sparkles className="mb-4 text-[#d2b77e]" size={24} />
                <p className="font-serif text-xl leading-snug md:text-2xl">
                  Every journey should feel like your own.
                </p>
              </div>
            </div>

            <div className="pt-6 lg:pt-0">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-9 bg-[#b7975d]" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d754d]">
                  Who we are
                </span>
              </div>

              <h2 className="font-serif text-4xl leading-tight text-[#18372a] md:text-5xl lg:text-6xl">
                A Kenyan journey,
                <br />
                <span className="italic text-[#a78a59]">
                  made meaningful.
                </span>
              </h2>

              <div className="mt-8 space-y-5 text-[15px] leading-8 text-[#657168]">
                <p>
                  Based in Nairobi, Karembo Tours and Safaris is a Kenyan tour
                  company creating meaningful wildlife and cultural travel
                  experiences for visitors from around the world.
                </p>

                <p>
                  We specialise in thoughtfully planned safaris and tours
                  that showcase Kenya's natural beauty, rich heritage and
                  remarkable wildlife. From the open plains of the Maasai
                  Mara to cultural destinations and experiences around the
                  country, there is always something new to discover.
                </p>

                <p>
                  Whether you are visiting Kenya for the first time or
                  returning to explore more, our goal is simple: to help you
                  experience the country in a way that feels authentic,
                  comfortable and memorable.
                </p>

                <p>
                  We offer flexible travel options for solo travellers,
                  couples, families and groups, including short excursions,
                  private safaris and multi-day adventures.
                </p>
              </div>

              <div className="mt-9 border-t border-[#dedbd1] pt-7">
                <div className="flex items-center gap-3 text-sm font-semibold text-[#18372a]">
                  <ShieldCheck size={20} className="text-[#a78a59]" />
                  Thoughtfully planned Kenyan travel experiences
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience categories */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-edge">
          <div className="mb-14 max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9 bg-[#b7975d]" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d754d]">
                What we do
              </span>
            </div>

            <h2 className="font-serif text-4xl leading-tight text-[#18372a] md:text-5xl">
              Discover Kenya
              <br />
              <span className="italic text-[#a78a59]">
                your way.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#788078]">
              Every traveller has a different reason for exploring Kenya.
              Our experiences offer different ways to discover the country.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {experiences.map((experience, index) => (
              <article
                key={experience.title}
                className="group flex flex-col border border-[#e8e5dc] bg-[#f7f5ef] p-8 transition duration-500 hover:-translate-y-2 hover:border-[#c6a66b] hover:shadow-xl md:p-9"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#18372a] text-[#d6bd8e] transition group-hover:bg-[#c6a66b] group-hover:text-[#18372a]">
                    <experience.icon size={22} />
                  </div>

                  <span className="font-serif text-3xl text-[#d7d2c5]">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-9 font-serif text-2xl text-[#18372a]">
                  {experience.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-7 text-[#788078]">
                  {experience.body}
                </p>

                <Link
                  to={experience.link}
                  className="mt-8 inline-flex items-center gap-3 border-t border-[#dedbd1] pt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#18372a] transition group-hover:text-[#a18453]"
                >
                  {experience.linkText}
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#18372a] py-20 text-white md:py-28">
        <div className="container-edge">
          <div className="mb-14 max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9 bg-[#c6a66b]" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d2b77e]">
                What guides us
              </span>
            </div>

            <h2 className="font-serif text-4xl leading-tight md:text-5xl">
              The principles behind
              <br />
              <span className="italic text-[#d2b77e]">
                every journey.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-8 text-white/60 md:text-base">
              The way we plan and approach travel matters. These values shape
              the experiences we want every traveller to enjoy.
            </p>
          </div>

          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article
                key={value.title}
                className="border-t border-white/15 pt-7"
              >
                <div className="flex items-center justify-between">
                  <value.icon
                    size={27}
                    strokeWidth={1.4}
                    className="text-[#d2b77e]"
                  />
                  <span className="text-xs font-medium tracking-widest text-white/35">
                    {value.number}
                  </span>
                </div>

                <h3 className="mt-7 font-serif text-2xl text-white">
                  {value.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/60">
                  {value.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-[#f7f5ef] py-24 md:py-32">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border border-[#d8d2c4]" />
        <div className="absolute -right-8 -top-12 h-56 w-56 rounded-full border border-[#d8d2c4]" />

        <div className="container-edge relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a18453]">
              Your adventure awaits
            </span>

            <h2 className="mt-6 font-serif text-4xl leading-tight text-[#18372a] md:text-6xl">
              Ready to write
              <br />
              <span className="italic text-[#a78a59]">
                your Kenya story?
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#788078] md:text-base">
              Tell us what inspires you. Let's start planning a Kenyan
              journey shaped around your interests, travel style and sense
              of adventure.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-auto rounded-none bg-[#18372a] px-8 py-5 text-xs font-bold uppercase tracking-[0.15em] text-white hover:bg-[#294b39]"
              >
                <Link to="/contact">
                  Plan your journey
                  <ArrowRight className="ml-3" size={16} />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-auto rounded-none border-[#18372a]/25 px-8 py-5 text-xs font-bold uppercase tracking-[0.15em] text-[#18372a] hover:bg-[#18372a] hover:text-white"
              >
                <Link to="/safaris">Explore safaris</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
