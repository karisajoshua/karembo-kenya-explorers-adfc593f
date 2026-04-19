import { PageHero } from "@/components/PageHero";
import { PackageCard } from "@/components/PackageCard";
import { byCategory } from "@/data/tours";

const HERO = "https://images.unsplash.com/photo-1611348586804-61bf6c080437?auto=format&fit=crop&w=2000&q=80";

const DayTrips = () => {
  const tours = byCategory("day-trip");
  return (
    <>
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
