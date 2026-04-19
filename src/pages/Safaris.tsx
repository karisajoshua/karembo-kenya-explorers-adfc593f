import { PageHero } from "@/components/PageHero";
import { PackageCard } from "@/components/PackageCard";
import { byCategory } from "@/data/tours";

const HERO = "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=2000&q=80";

const Safaris = () => {
  const tours = byCategory("safari");
  return (
    <>
      <PageHero
        image={HERO}
        eyebrow="Masai Mara"
        title="Safari Packages"
        subtitle="Multi-day journeys into Kenya's most iconic wilderness — home of the Big Five and the Great Migration."
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

export default Safaris;
