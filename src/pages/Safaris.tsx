import { PageHero } from "@/components/PageHero";
import { PackageCard } from "@/components/PackageCard";
import { usePackagesByCategory } from "@/hooks/usePackages";
import { Seo } from "@/components/Seo";

import HERO from "@/assets/uploads/elephant-tusks.jpg";

const Safaris = () => {
  const { items: tours } = usePackagesByCategory("safari");
  return (
    <>
      <Seo
        title="Masai Mara Safari Packages from Nairobi | Karembo Tours"
        description="Multi-day Masai Mara safaris, Big Five tours and Great Migration trips with a trusted Kenyan tour operator. Tailor-made itineraries from 3 to 8 days."
        path="/safaris"
        image="/gallery/elephant-tusks.jpg"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Kenya Safari Packages",
          itemListElement: tours.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://karembotours.co.ke/packages/${t.slug}`,
            name: t.title,
          })),
        }}
      />
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
