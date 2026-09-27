import { PageHero } from "@/components/PageHero";
import { PackageCard } from "@/components/PackageCard";
import { usePackagesByCategory } from "@/hooks/usePackages";
import { Seo } from "@/components/Seo";

const HERO = "/gallery/lioness-resting.jpg";

const Cultural = () => {
  const { items: tours } = usePackagesByCategory("cultural");
  return (
    <>
      <Seo
        title="Kenya Cultural Tours & Experiences | Karembo Tours"
        description="Discover Maasai village visits, Bomas of Kenya and Samburu cultural experiences. Explore Kenya's communities with Karembo Tours."
        path="/cultural"
        image="/gallery/lioness-resting.jpg"
      />
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
