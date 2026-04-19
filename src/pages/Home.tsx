import { useRef } from "react";
import { Link } from "react-router-dom";
import { Compass, HeartHandshake, Sparkles, Quote, MessageCircle, Phone, Calendar, ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { PackageCard } from "@/components/PackageCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { byCategory } from "@/data/tours";
import { cn } from "@/lib/utils";

const HERO = "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2000&q=80";
const CULTURAL_IMG = "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1400&q=80";
const BANNER_IMG = "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2000&q=80";

const pillars = [
  {
    icon: Compass,
    title: "Local Expertise",
    body: "Born and raised in Kenya. Our guides know the Mara plains and Nairobi backstreets like home.",
  },
  {
    icon: HeartHandshake,
    title: "Flexibility",
    body: "Every itinerary is built around your pace, your interests, and the rhythm of the wild.",
  },
  {
    icon: Sparkles,
    title: "Customization",
    body: "From honeymoon hideaways to family adventures — your safari, exactly the way you want it.",
  },
];

const testimonials = [
  { name: "Sarah & James, UK", text: "Karembo gave us the safari of our dreams. Our guide spotted a leopard on the very first morning — pure magic." },
  { name: "Maria, Spain", text: "From the Nairobi day tour to four nights in the Mara, every detail was thoughtfully planned. We'll be back." },
  { name: "Daniel, Germany", text: "Authentic, warm and professional. The Maasai village visit was a highlight I'll never forget." },
];

const Home = () => {
  const safaris = byCategory("safari").slice(0, 3);
  const dayTrips = byCategory("day-trip").slice(0, 8);
  const autoplay = useRef(Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true }));

  return (
    <>
      <PageHero
        image={HERO}
        size="tall"
        eyebrow="Karembo Tour Safaris"
        title="The heart of tailor-made safaris in Kenya"
        subtitle="From the wild expanse of the Masai Mara to the cultural soul of Nairobi — we craft journeys that move you."
      >
        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          <Link to="/contact">Plan Your Safari</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
          <Link to="/safaris">Browse Packages</Link>
        </Button>
      </PageHero>

      {/* Pillars */}
      <section className="py-20 bg-background">
        <div className="container-edge">
          <div className="grid gap-12 md:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title} className="flex gap-5">
                <div className="flex-shrink-0 h-16 w-16 rounded-full bg-secondary/15 flex items-center justify-center">
                  <p.icon className="h-7 w-7 text-secondary" />
                </div>
                <div>
                  <h3 className="font-serif text-xl uppercase tracking-wider text-primary mb-3 font-semibold">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Day trips carousel */}
      <section className="py-20 bg-sand">
        <div className="container-edge">
          <h2 className="font-serif text-3xl md:text-4xl text-primary text-center uppercase tracking-wide mb-12">
            Unforgettable Day Trips
          </h2>
          <Carousel
            opts={{ align: "start", loop: true, dragFree: true }}
            plugins={[autoplay.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {dayTrips.map((t) => (
                <CarouselItem key={t.slug} className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/4">
                  <div className="group relative aspect-[3/4] [perspective:1200px]">
                    <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                      {/* Front */}
                      <div className="absolute inset-0 overflow-hidden rounded-xl [backface-visibility:hidden]">
                        <img
                          src={t.image}
                          alt={t.title}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                          <h3 className="font-serif text-xl mb-1 leading-tight">{t.title}</h3>
                          <p className="text-xs text-primary-foreground/85">
                            From <span className="font-semibold text-accent">${t.priceFrom} pp</span>
                          </p>
                        </div>
                      </div>
                      {/* Back */}
                      <div className="absolute inset-0 rounded-xl bg-secondary text-secondary-foreground p-6 flex flex-col justify-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <h3 className="font-serif text-xl mb-3 leading-tight">{t.title}</h3>
                        <p className="text-sm leading-relaxed mb-5 line-clamp-5 opacity-90">
                          {t.shortDescription}
                        </p>
                        <Link
                          to={`/packages/${t.slug}`}
                          className="inline-flex items-center justify-center gap-2 mx-auto text-sm font-semibold uppercase tracking-wider border-b-2 border-accent pb-1 hover:text-accent transition-colors"
                        >
                          View Details <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4" />
            <CarouselNext className="hidden md:flex -right-4" />
          </Carousel>
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/day-trips">Explore More Day Trips</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular safaris — mosaic */}
      <section className="py-20 bg-background">
        <div className="container-edge">
          <h2 className="font-serif text-3xl md:text-4xl text-primary text-center uppercase tracking-wide mb-16">
            Our Popular Safari Packages
          </h2>
          {safaris.length >= 3 && (
            <div className="grid gap-6 lg:grid-cols-2 lg:auto-rows-fr">
              {/* Left column — 2 stacked horizontal cards */}
              {[safaris[0], safaris[1]].map((t, i) => {
                const imageRight = i === 0;
                return (
                  <div
                    key={t.slug}
                    className="group grid grid-cols-1 sm:grid-cols-2 overflow-hidden rounded-xl border border-border bg-background shadow-card"
                  >
                    <div className={cn("aspect-[4/3] sm:aspect-auto overflow-hidden", imageRight ? "sm:order-2" : "sm:order-1")}>
                      <img src={t.image} alt={t.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className={cn("p-6 flex flex-col justify-center", imageRight ? "sm:order-1" : "sm:order-2")}>
                      <h3 className="font-serif text-xl text-primary mb-2 leading-tight">{t.title}</h3>
                      <div className="h-1 w-12 bg-accent mb-3" />
                      <div className="flex items-center gap-2 text-xs text-secondary font-semibold uppercase tracking-wider mb-3">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{t.duration}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{t.shortDescription}</p>
                      <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground self-start">
                        <Link to={`/packages/${t.slug}`}>
                          Discover More <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}

              {/* Right column — vertical card spanning both rows */}
              <div className="group lg:row-span-2 flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-card">
                <div className="aspect-[4/3] lg:aspect-auto lg:h-[55%] overflow-hidden">
                  <img src={safaris[2].image} alt={safaris[2].title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-8 flex flex-col justify-center flex-1">
                  <h3 className="font-serif text-2xl md:text-3xl text-primary mb-3 leading-tight">{safaris[2].title}</h3>
                  <div className="h-1 w-16 bg-accent mb-4" />
                  <div className="flex items-center gap-2 text-sm text-secondary font-semibold uppercase tracking-wider mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>{safaris[2].duration}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">{safaris[2].shortDescription}</p>
                  <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground self-start">
                    <Link to={`/packages/${safaris[2].slug}`}>
                      Discover More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="text-center mt-16">
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to="/safaris">Explore More Packages</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Cultural */}
      <section className="py-20">
        <div className="container-edge grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-elegant">
            <img src={CULTURAL_IMG} alt="Maasai cultural experience" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-3">Cultural Kenya</p>
            <h2 className="font-serif text-3xl md:text-5xl text-primary mb-5">Beyond the wildlife — meet the people</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Kenya is more than its animals. Spend a night in a Maasai manyatta, learn beadwork from women elders,
              dance with warriors at sundown, and discover what makes this land truly home.
            </p>
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to="/cultural">Explore Cultural Tours</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative py-24 my-12 overflow-hidden">
        <img src={BANNER_IMG} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative container-edge text-center text-primary-foreground">
          <h2 className="font-serif text-3xl md:text-5xl mb-4 text-balance">Talk to our safari experts</h2>
          <p className="max-w-2xl mx-auto text-lg text-primary-foreground/90 mb-8">
            Tell us your travel dates, your dreams, your budget — we'll handcraft an itinerary just for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              <Link to="/contact"><Phone className="h-4 w-4" /> Request a Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <a href="https://wa.me/254700123456" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-sand">
        <div className="container-edge">
          <SectionHeader eyebrow="Travellers' stories" title="What our guests say" />
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-background p-8 rounded-xl shadow-card relative">
                <Quote className="h-10 w-10 text-accent/30 absolute top-6 right-6" />
                <p className="text-foreground/90 italic leading-relaxed mb-5">"{t.text}"</p>
                <p className="font-semibold text-primary">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliates */}
      <section className="py-12 border-t border-border">
        <div className="container-edge">
          <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-8">
            Proud Members & Partners
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-primary/60">
            {["KATO", "Magical Kenya", "Ecotourism Kenya", "Kenya Tourism Federation", "TripAdvisor"].map((a) => (
              <div key={a} className="font-serif text-lg md:text-xl font-semibold tracking-wide">
                {a}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
