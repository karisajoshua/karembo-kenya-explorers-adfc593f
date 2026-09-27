import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/karembo-logo.png";
import { cn } from "@/lib/utils";
import { MegaMenu } from "@/components/MegaMenu";

const nav = [
  { to: "/safaris", label: "Safaris" },
  { to: "/day-trips", label: "Day Trips" },
  { to: "/combo", label: "Combo" },
  { to: "/cultural", label: "Cultural" },
  { to: "/blog", label: "Blog" },
  { to: "/gallery", label: "Gallery" },
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
      <div className="container-edge flex h-24 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" aria-label="Karembo Tours home">
          <img src={logo} alt="Karembo Tour Safaris logo" className="h-20 md:h-24 w-auto" />
        </Link>

        <div className="hidden lg:block">
          <MegaMenu />
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Button asChild variant="outline" className="font-semibold"><Link to="/admin/login"><LogIn className="h-4 w-4 mr-2" />Admin Sign In</Link></Button>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            <Link to="/quote">Get a Quote</Link>
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
            <Button asChild variant="outline" className="mt-3"><Link to="/admin/login" onClick={() => setOpen(false)}><LogIn className="h-4 w-4 mr-2" />Admin Sign In</Link></Button>
            <Button asChild className="mt-3 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/quote" onClick={() => setOpen(false)}>Get a Quote</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
