import { Link } from "react-router-dom";
import { Award, Users, Leaf, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { Seo, orgJsonLd } from "@/components/Seo";

import HERO from "@/assets/uploads/lioness-resting.jpg";
import STORY_IMG from "@/assets/uploads/lion-male.jpg";

const values = [
  { icon: Award, title: "Authentic Expertise", body: "Decades of combined safari experience across Kenya." },
  { icon: Users, title: "Personal Service", body: "One trusted contact from inquiry to homecoming." },
  { icon: Leaf, title: "Responsible Travel", body: "We support conservancies and community-owned camps." },
  { icon: Globe, title: "Tailor-made", body: "No two Karembo journeys are ever the same." },
];

const About = () => (
  <>
    <Seo
      title="About Karembo Tours and Safaris — Kenyan Safari Specialists"
      description="Karembo Tours is a trusted Nairobi-based Kenyan tour operator. Local guides, responsible travel and tailor-made safaris across the Masai Mara, Amboseli and beyond."
      path="/about"
      image="/gallery/lion-male.jpg"
      jsonLd={[orgJsonLd, { "@context": "https://schema.org", "@type": "AboutPage", url: "https://karembotours.co.ke/about", name: "About Karembo Tours" }]}
    />
    <PageHero
      image={HERO}
      eyebrow="Dream Your Next Trip"
      title="Safari Experiences Designed Around You"
      subtitle="Karembo Tours and Safaris — a trusted Kenyan tour company creating meaningful wildlife and cultural travel experiences."
    />

    <section className="py-20">
      <div className="container-edge grid lg:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/5] overflow-hidden shadow-elegant">
          <img src={STORY_IMG} alt="Karembo team in the Mara" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-3">The Karembo story</p>
          <h2 className="font-serif text-3xl md:text-4xl text-primary mb-5">Based in Nairobi, born for Kenya</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Based in Nairobi, Karembo Tours and Safaris is a trusted Kenyan tour company creating
              meaningful wildlife and cultural travel experiences for visitors from around the world.
              We specialize in thoughtfully planned safaris and tours that showcase Kenya's natural
              beauty, rich heritage, and unforgettable wildlife.
            </p>
            <p>
              Whether you're visiting Kenya for the first time or returning to explore more, our goal
              is simple: to help you experience the country in a way that feels authentic, comfortable,
              and memorable.
            </p>
            <p>
              We offer flexible travel options suited to solo travellers, couples, families, and groups —
              from short city-based excursions to multi-day safaris across Kenya's most iconic destinations.
            </p>
            <ul className="space-y-2 pl-5 list-disc marker:text-accent">
              <li>Guided game drives where you may encounter lions, elephants, giraffes, buffalo and more in their natural habitats.</li>
              <li>Day trips and excursions to nearby national parks, conservation centres, and cultural sites.</li>
              <li>Travel styles from day tours and weekend getaways to private safaris and group packages.</li>
            </ul>
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
