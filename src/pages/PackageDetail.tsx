import { Link, Navigate, useParams } from "react-router-dom";
import { Check, Clock, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { Seo } from "@/components/Seo";
import { findTour } from "@/data/tours";

const PackageDetail = () => {
  const { slug = "" } = useParams();
  const tour = findTour(slug);
  if (!tour) return <Navigate to="/safaris" replace />;

  return (
    <>
      <Seo
        title={`${tour.title} (${tour.duration}) | Karembo Tours`}
        description={tour.shortDescription}
        path={`/packages/${tour.slug}`}
        image={tour.image}
        type="article"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: tour.title,
            description: tour.shortDescription,
            image: tour.image.startsWith("http") ? tour.image : `https://karembotours.co.ke${tour.image}`,
            touristType: ["Wildlife", "Adventure", "Cultural"],
            provider: { "@type": "TravelAgency", name: "Karembo Tours and Safaris", url: "https://karembotours.co.ke" },
            itinerary: tour.itinerary.map((d, i) => ({ "@type": "ItemList", position: i + 1, name: d.title, description: d.details })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://karembotours.co.ke/" },
              { "@type": "ListItem", position: 2, name: "Packages", item: "https://karembotours.co.ke/safaris" },
              { "@type": "ListItem", position: 3, name: tour.title, item: `https://karembotours.co.ke/packages/${tour.slug}` },
            ],
          },
        ]}
      />
      <PageHero
        image={tour.image}
        eyebrow={tour.duration}
        title={tour.title}
        subtitle={tour.shortDescription}
      >
        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          <Link to={`/contact?package=${tour.slug}`}>Request this Tour</Link>
        </Button>
      </PageHero>

      <section className="py-16">
        <div className="container-edge grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="font-serif text-3xl text-primary mb-4">Highlights</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {tour.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-foreground/80">
                    <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" /> {h}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-3xl text-primary mb-6">Day-by-day itinerary</h2>
              <div className="space-y-5">
                {tour.itinerary.map((d, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-sand rounded-lg">
                    <div className="shrink-0 h-12 w-12 rounded-full bg-secondary text-secondary-foreground font-serif text-lg flex items-center justify-center">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-accent font-bold">{d.day}</div>
                      <h3 className="font-serif text-xl text-primary mb-1">{d.title}</h3>
                      <p className="text-muted-foreground">{d.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-sand rounded-lg">
                <h3 className="font-serif text-xl text-primary mb-4">Included</h3>
                <ul className="space-y-2 text-sm">
                  {tour.included.map((i) => (
                    <li key={i} className="flex gap-2"><Check className="h-4 w-4 text-secondary mt-0.5" /> {i}</li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-sand rounded-lg">
                <h3 className="font-serif text-xl text-primary mb-4">Not included</h3>
                <ul className="space-y-2 text-sm">
                  {tour.excluded.map((i) => (
                    <li key={i} className="flex gap-2"><X className="h-4 w-4 text-destructive mt-0.5" /> {i}</li>
                  ))}
                </ul>
              </div>
            </div>

            {tour.gallery.length > 1 && (
              <div>
                <h2 className="font-serif text-3xl text-primary mb-6">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {tour.gallery.map((g, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden">
                      <img src={g} alt="" className="h-full w-full object-cover hover:scale-110 transition-transform duration-700" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-card rounded-xl shadow-card p-6 border border-border">
              <div className="text-sm text-muted-foreground">Starting from</div>
              <div className="font-serif text-4xl text-primary mb-1">${tour.priceFrom}</div>
              <div className="text-xs text-muted-foreground mb-5">per person sharing</div>
              <div className="flex items-center gap-2 text-sm text-foreground/80 mb-5">
                <Clock className="h-4 w-4 text-accent" /> {tour.duration}
              </div>
              <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold mb-3">
                <Link to={`/contact?package=${tour.slug}`}>Request this Tour</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href={`https://wa.me/254722736130?text=Hi%20Karembo%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(tour.title)}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp Enquiry
                </a>
              </Button>
            </div>
            <Link to="/safaris" className="mt-6 inline-flex items-center gap-2 text-sm text-secondary hover:text-accent">
              <ArrowLeft className="h-4 w-4" /> Back to all packages
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
};

export default PackageDetail;
