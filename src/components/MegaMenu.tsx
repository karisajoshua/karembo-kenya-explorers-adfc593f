import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { byCategory, type Tour } from "@/data/tours";
import { cn } from "@/lib/utils";

const groups: { label: string; to: string; category: Tour["category"] }[] = [
  { label: "Safaris", to: "/safaris", category: "safari" },
  { label: "Day Trips", to: "/day-trips", category: "day-trip" },
  { label: "Combo", to: "/combo", category: "combo" },
  { label: "Cultural", to: "/cultural", category: "cultural" },
];

const MegaPanel = ({ to, category }: { to: string; category: Tour["category"] }) => {
  const items = byCategory(category).slice(0, 4);
  return (
    <div className="w-[720px] p-6">
      <div className="grid grid-cols-4 gap-4">
        {items.map((t) => (
          <Link
            key={t.slug}
            to={`/packages/${t.slug}`}
            className="group block"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-lg mb-2">
              <img
                src={t.image}
                alt={t.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <p className="text-sm font-semibold text-primary leading-tight line-clamp-2 group-hover:text-accent transition-colors">
              {t.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t.duration} · From ${t.priceFrom}
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-border flex justify-end">
        <Link to={to} className="text-sm font-semibold text-accent hover:underline">
          View all →
        </Link>
      </div>
    </div>
  );
};

export const MegaMenu = () => (
  <NavigationMenu>
    <NavigationMenuList className="gap-2">
      {groups.map((g) => (
        <NavigationMenuItem key={g.to}>
          <NavigationMenuTrigger className="bg-transparent text-sm font-medium text-foreground/80 hover:text-accent data-[state=open]:text-accent">
            {g.label}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <MegaPanel to={g.to} category={g.category} />
          </NavigationMenuContent>
        </NavigationMenuItem>
      ))}
      {[
        { to: "/blog", label: "Blog" },
        { to: "/gallery", label: "Gallery" },
        { to: "/about", label: "About" },
        { to: "/contact", label: "Contact" },
      ].map((l) => (
        <NavigationMenuItem key={l.to}>
          <NavigationMenuLink asChild>
            <Link to={l.to} className={cn("inline-flex items-center px-3 py-2 text-sm font-medium text-foreground/80 hover:text-accent")}>
              {l.label}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);
