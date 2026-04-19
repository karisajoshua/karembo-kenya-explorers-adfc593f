import { PageHero } from "@/components/PageHero";
import { PackageCard } from "@/components/PackageCard";
import { byCategory } from "@/data/tours";

const HERO = "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=2000&q=80";

const Cultural = () => {
  const tours = byCategory("cultural");
  return (
    <>
      <PageHero
        image={HERO}
        eyebrow="Heart of Kenya"
        title="Cultural Experiences"
        subtitle="Walk with the Maasai, learn from elders, and feel the rhythm of community-led travel."
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

export default Cultural;
