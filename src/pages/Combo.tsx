import { PageHero } from "@/components/PageHero";
import { PackageCard } from "@/components/PackageCard";
import { byCategory } from "@/data/tours";
import { Seo } from "@/components/Seo";

const HERO = "/gallery/zebra-portrait.jpg";

const Combo = () => {
  const tours = byCategory("combo");
  return (
    <>
      <Seo
        title="Bush & Beach Combo Safaris in Kenya | Karembo Tours"
        description="Combine Masai Mara wildlife with Nairobi culture and Indian Ocean beaches in one seamless Kenya tour package, from 5 to 9 days."
        path="/combo"
        image="/gallery/zebra-portrait.jpg"
      />
      <PageHero
        image={HERO}
        eyebrow="Best of Kenya"
        title="Combo Safaris"
        subtitle="Mara wildlife meets Nairobi culture — and even Indian Ocean beaches — in one seamless journey."
      />
      <section className="py-20">
        <div className="container-edge">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tours.map((t) => <PackageCard key={t.slug} tour={t} />)}
          </div>
        </div>
      </section>
    </>
  );
};

export default Combo;
