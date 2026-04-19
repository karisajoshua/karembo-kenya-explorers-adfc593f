import { Link } from "react-router-dom";
import { Compass, HeartHandshake, Sparkles, Quote, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { PackageCard } from "@/components/PackageCard";
import { byCategory } from "@/data/tours";

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
  const dayTrips = byCategory("day-trip").slice(0, 4);

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
      <section className="py-20 bg-sand">
        <div className="container-edge">
          <SectionHeader
            eyebrow="Why Karembo"
            title="Crafted by locals, designed for you"
            subtitle="Three promises that shape every journey we create."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title} className="text-center p-8 rounded-xl bg-background shadow-card">
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-amber flex items-center justify-center mb-5">
                  <p.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-serif text-2xl text-primary mb-3">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Day trips */}
      <section className="py-20">
        <div className="container-edge">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-3">Unforgettable</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary">Nairobi Day Trips</h2>
              <p className="mt-3 text-muted-foreground">Half-day and full-day escapes to start or end your Kenyan adventure.</p>
            </div>
            <Link to="/day-trips" className="text-secondary font-semibold hover:text-accent">
              View all day trips →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dayTrips.map((t) => <PackageCard key={t.slug} tour={t} />)}
          </div>
        </div>
      </section>

      {/* Popular safaris */}
      <section className="py-20 bg-sand">
        <div className="container-edge">
          <SectionHeader
            eyebrow="Most loved"
            title="Popular Safari Packages"
            subtitle="Our travellers' favourite multi-day journeys deep into the Masai Mara."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {safaris.map((t) => <PackageCard key={t.slug} tour={t} />)}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/safaris">See all safaris</Link>
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
