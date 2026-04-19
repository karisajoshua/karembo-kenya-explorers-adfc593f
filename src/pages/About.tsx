import { Link } from "react-router-dom";
import { Award, Users, Leaf, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";

const HERO = "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2000&q=80";
const STORY_IMG = "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80";

const values = [
  { icon: Award, title: "Authentic Expertise", body: "Decades of combined safari experience across Kenya." },
  { icon: Users, title: "Personal Service", body: "One trusted contact from inquiry to homecoming." },
  { icon: Leaf, title: "Responsible Travel", body: "We support conservancies and community-owned camps." },
  { icon: Globe, title: "Tailor-made", body: "No two Karembo journeys are ever the same." },
];

const About = () => (
  <>
    <PageHero
      image={HERO}
      eyebrow="Our Story"
      title="About Karembo Tours"
      subtitle="A small Nairobi-based team with a big love for Kenya's wild places and warm people."
    />

    <section className="py-20">
      <div className="container-edge grid lg:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-elegant">
          <img src={STORY_IMG} alt="Karembo team in the Mara" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-3">The Karembo story</p>
          <h2 className="font-serif text-3xl md:text-4xl text-primary mb-5">Born of the Mara, raised in Nairobi</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Karembo Tour Safaris was founded by a small group of Kenyan guides and travel-lovers
              who grew up between the bustle of Nairobi and the silence of the Mara plains.
            </p>
            <p>
              Karembo means "beautiful" in Swahili — a name that captures both the land we
              call home and the experiences we work to create for every traveller who joins us.
            </p>
            <p>
              We don't sell shelf-package tours. Every itinerary is built by hand, in
              conversation with you, by people who actually live where you're going.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="py-20 bg-sand">
      <div className="container-edge">
        <SectionHeader eyebrow="Our values" title="What we stand for" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="bg-background rounded-xl p-7 shadow-card">
              <div className="h-12 w-12 rounded-lg bg-gradient-amber flex items-center justify-center mb-4">
                <v.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-primary mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container-edge text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">Ready to begin your story?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Let's design a Kenya journey shaped around you.</p>
        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          <Link to="/contact">Request a Quote</Link>
        </Button>
      </div>
    </section>
  </>
);

export default About;
