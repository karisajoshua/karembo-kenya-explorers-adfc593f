import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/karembo-logo.png";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/safaris", label: "Safaris" },
  { to: "/day-trips", label: "Day Trips" },
  { to: "/combo", label: "Combo" },
  { to: "/cultural", label: "Cultural" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors",
        "bg-background/90 border-border"
      )}
    >
      <div className="container-edge flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" aria-label="Karembo Tours home">
          <img src={logo} alt="Karembo Tour Safaris logo" className="h-12 w-auto" />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-serif text-lg font-bold text-primary">Karembo</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Tour Safaris</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-accent",
                  isActive ? "text-accent" : "text-foreground/80"
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            <Link to="/contact">Request a Quote</Link>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 -mr-2 text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-edge py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "py-3 px-2 rounded-md text-base font-medium",
                    isActive ? "text-accent bg-sand" : "text-foreground hover:bg-sand"
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Button asChild className="mt-3 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact" onClick={() => setOpen(false)}>Request a Quote</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
