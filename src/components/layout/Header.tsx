import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, LogIn, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MegaMenu } from "@/components/MegaMenu";
import { cn } from "@/lib/utils";
import logo from "@/assets/karembo-logo.png";

const nav = [
  { to: "/safaris", label: "Safaris" },
  { to: "/day-trips", label: "Day Trips" },
  { to: "/combo", label: "Combo Tours" },
  { to: "/cultural", label: "Cultural" },
  { to: "/blog", label: "Journal" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile navigation whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent the mobile menu from remaining open after pressing Escape.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 shadow-sm backdrop-blur-xl">
      <div className="container-edge flex h-20 items-center justify-between gap-5">
        {/* Brand */}
        <Link
          to="/"
          aria-label="Karembo Tours and Safaris — home"
          className="flex shrink-0 items-center"
          onClick={() => setOpen(false)}
        >
          <img
            src={logo}
            alt="Karembo Tours and Safaris"
            className="h-14 w-auto object-contain md:h-[4.5rem]"
          />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main navigation" className="hidden flex-1 justify-center lg:flex">
          <MegaMenu />
        </nav>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <Button
            asChild
            variant="ghost"
            className="font-semibold text-foreground hover:bg-sand hover:text-primary"
          >
            <Link to="/admin/login">
              <LogIn className="mr-2 h-4 w-4" />
              Sign in
            </Link>
          </Button>

          <Button
            asChild
            className="bg-accent font-semibold text-accent-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-accent/90"
          >
            <Link to="/quote">
              Get a quote
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile navigation panel */}
      <div
        id="mobile-navigation"
        className={cn(
          "grid overflow-hidden border-t border-border bg-background transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden",
          open
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="min-h-0 overflow-hidden">
          <nav
            aria-label="Mobile navigation"
            className="container-edge flex flex-col gap-1 py-4"
          >
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-sand text-primary"
                      : "text-foreground hover:bg-sand hover:text-primary",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-4">
              <Button
                asChild
                variant="outline"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                <Link to="/admin/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </Link>
              </Button>

              <Button
                asChild
                className="w-full bg-accent font-semibold text-accent-foreground hover:bg-accent/90"
                onClick={() => setOpen(false)}
              >
                <Link to="/quote">Get a quote</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
