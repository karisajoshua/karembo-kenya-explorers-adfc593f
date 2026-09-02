import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

export type PackageCardItem = {
  slug: string;
  title: string;
  image: string;
  duration: string;
  price_from: number;
  summary: string;
  price_private?: number | null;
  min_guests?: number | null;
};


export const PackageCard = ({ tour }: { tour: PackageCardItem }) => (
  <Link
    to={`/packages/${tour.slug}`}
    className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
  >
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={tour.image}
        alt={tour.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
        From ${tour.price_from}
      </div>
    </div>
    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <Clock className="h-3.5 w-3.5" />
        <span>{tour.duration}</span>
      </div>
      <h3 className="font-serif text-xl text-primary leading-snug mb-2 group-hover:text-accent transition-colors">
        {tour.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
        {tour.summary}
      </p>
      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-secondary group-hover:gap-3 transition-all">
        Discover more <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  </Link>
);
