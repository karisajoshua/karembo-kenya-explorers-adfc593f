
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Home,
  Search,
} from "lucide-react";

import { Seo } from "@/components/Seo";

const HERO = "/gallery/wildebeest-crossing.jpg";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Seo
        title="Page Not Found | Karembo Tours and Safaris"
        description="The page you're looking for may have moved or no longer exists. Explore Kenya safari packages and experiences with Karembo Tours."
        path={location.pathname}
        noindex
      />

      <main className="relative flex min-h-[85vh] items-center overflow-hidden bg-[#102d25]">
        {/* Background photography */}
        <div className="absolute inset-0">
          <img
            src={HERO}
            alt="Wildebeest crossing the Mara River in Kenya"
            className="h-full w-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10271f] via-[#10271f]/90 to-[#10271f]/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10271f]/70 via-transparent to-[#10271f]/30" />
        </div>

        {/* Decorative detail */}
        <div className="pointer-events-none absolute -right-28 top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-[#d5b979]/10 lg:block" />
        <div className="pointer-events-none absolute -right-12 top-1/2 hidden h-[380px] w-[380px] -translate-y-1/2 rounded-full border border-[#d5b979]/15 lg:block" />

        <div className="container-edge relative z-10 w-full py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d5b979]/30 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Compass className="h-4 w-4 text-[#d5b979]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e3c98f]">
                Off the beaten path
              </span>
            </div>

            <p className="font-serif text-[clamp(6rem,17vw,11rem)] leading-[0.8] tracking-tight text-[#d5b979]">
              404
            </p>

            <h1 className="mt-8 font-serif text-3xl leading-tight text-[#fffdf7] md:text-5xl">
              Looks like you've
              <br />
              <span className="italic text-[#dfc58d]">
                wandered off trail.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/70 md:text-base">
              The page you're looking for isn't where we expected it to be.
              It may have moved, or the address might be incorrect.
              Let's get your journey back on track.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#d5b979] px-7 text-sm font-semibold text-[#173d32] transition duration-300 hover:bg-[#e4cb94]"
              >
                <Home className="h-4 w-4" />
                Return home
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>

              <Link
                to="/safaris"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/30 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur-sm transition duration-300 hover:border-[#d5b979] hover:bg-white/10"
              >
                Explore safaris
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 border-t border-white/15 pt-6">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Find your way around
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {[
                  { label: "Day Trips", to: "/day-trips" },
                  { label: "Combo Safaris", to: "/combo" },
                  { label: "Cultural Experiences", to: "/cultural" },
                  { label: "Contact Us", to: "/contact" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group inline-flex items-center gap-1.5 text-xs text-white/65 transition hover:text-[#dfc58d]"
                  >
                    {item.label}
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 right-0 hidden p-10 text-right lg:block">
          <p className="font-serif text-2xl italic text-white/20">
            Discover the extraordinary.
          </p>
          <p className="mt-2 text-[9px] uppercase tracking-[0.25em] text-white/25">
            Karembo Tours and Safaris
          </p>
        </div>
      </main>
    </>
  );
};

export default NotFound;
