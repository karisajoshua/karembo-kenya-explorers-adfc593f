import { PageHero } from "@/components/PageHero";
import { PackageCard } from "@/components/PackageCard";
import { byCategory } from "@/data/tours";

const HERO = "https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=2000&q=80";

const Combo = () => {
  const tours = byCategory("combo");
  return (
    <>
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
