import { PageHero } from "@/components/PageHero";
import { PackageCard } from "@/components/PackageCard";
import { usePackagesByCategory } from "@/hooks/usePackages";
import { Seo } from "@/components/Seo";

const HERO = "/gallery/elephant-closeup-vehicle.jpg";

const DayTrips = () => {
  const { items: tours } = usePackagesByCategory("day-trip");
  return (
    <>
      <Seo
        title="Nairobi Day Trips & Excursions | Karembo Tours"
        description="Discover Nairobi National Park, Giraffe Centre, elephant orphanage and nearby adventures. Explore Nairobi day trips with Karembo Tours."
        path="/day-trips"
        image="/gallery/elephant-closeup-vehicle.jpg"
      />
      <PageHero
        image={HERO}
        eyebrow="Nairobi"
        title="Day Trips & Excursions"
        subtitle="Half-day and full-day adventures in and around Kenya's vibrant capital."
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

export default DayTrips;
