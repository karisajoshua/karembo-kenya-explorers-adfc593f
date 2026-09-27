import { PageHero } from "@/components/PageHero";
import { PackageCard } from "@/components/PackageCard";
import { usePackagesByCategory } from "@/hooks/usePackages";
import { Seo } from "@/components/Seo";

const HERO = "/gallery/zebra-portrait.jpg";

const Combo = () => {
  const { items: tours } = usePackagesByCategory("combo");
  return (
    <>
      <Seo
        title="Kenya Safari & Beach Holiday Packages | Karembo Tours"
        description="Combine Masai Mara safaris, Nairobi attractions and Kenya's coast. Explore customizable safari and beach holiday packages with Karembo Tours."
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
