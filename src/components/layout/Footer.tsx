import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/karembo-logo.png";
import skyline from "@/assets/nairobi-skyline.png";

const exploreLinks = [
  { to: "/safaris", label: "Masai Mara Safaris" },
  { to: "/day-trips", label: "Nairobi Day Trips" },
  { to: "/combo", label: "Combo Safaris" },
  { to: "/cultural", label: "Cultural Experiences" },
  { to: "/about", label: "About Us" },
  { to: "/gallery", label: "Gallery" },
];

const affiliations = [
  "Magical Kenya",
  "Ecotourism Kenya",
  "Kenya Tourism Federation",
];

export const Footer = () => (
  <footer className="relative mt-24 overflow-hidden bg-[#6e5a4a] text-white">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c49a62]/70 to-transparent" />

    <div className="container-edge relative z-10 grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1.2fr_0.8fr] lg:gap-10 lg:py-20">
      {/* Brand */}
      <div className="max-w-sm">
        <Link
          to="/"
          aria-label="Karembo Tour Safaris home"
          className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5ad78] focus-visible:ring-offset-4 focus-visible:ring-offset-[#211b16]"
        >
          <img
            src={logo}
            alt="Karembo Tour Safaris"
            className="h-20 w-auto object-contain"
          />
        </Link>

        <p className="mt-5 max-w-xs text-sm leading-7 text-white/65">
          Tailor-made Kenyan safaris specializing in the Masai Mara and Nairobi.
          Crafted by locals, designed for you.
        </p>

        <Link
          to="/quote"
          className="group mt-7 inline-flex items-center gap-2 border-b border-[#c49a62]/70 pb-2 text-sm font-semibold text-[#e2bd8c] transition-colors hover:border-[#f0d5b0] hover:text-[#f0d5b0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5ad78]"
        >
          Start planning your safari
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Explore */}
      <nav aria-label="Footer navigation">
        <h2 className="font-serif text-lg text-[#e2bd8c]">Explore</h2>
        <ul className="mt-5 space-y-3">
          {exploreLinks.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="text-sm text-white/65 transition-colors hover:text-[#f0d5b0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5ad78]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Contact */}
      <div>
        <h2 className="font-serif text-lg text-[#e2bd8c]">Get in touch</h2>
        <ul className="mt-5 space-y-5 text-sm text-white/65">
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c49a62]" />
            <span>11th Street Kangawa, Ngong Road, Nairobi, Kenya</span>
          </li>
          <li className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#c49a62]" />
            <span className="flex flex-col gap-1">
              <a className="transition-colors hover:text-[#f0d5b0]" href="tel:+254722736130">
                +254 722 736 130
              </a>
              <a className="transition-colors hover:text-[#f0d5b0]" href="tel:+254757223301">
                +254 757 223 301
              </a>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#c49a62]" />
            <span className="flex flex-col gap-1 break-all">
              <a className="transition-colors hover:text-[#f0d5b0]" href="mailto:info@karembotours.co.ke">
                info@karembotours.co.ke
              </a>
              <a className="transition-colors hover:text-[#f0d5b0]" href="mailto:reservations@karembotours.co.ke">
                reservations@karembotours.co.ke
              </a>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[#c49a62]" />
            <a
              href="https://www.karembotours.co.ke"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all transition-colors hover:text-[#f0d5b0]"
            >
              www.karembotours.co.ke
            </a>
          </li>
        </ul>
      </div>

      {/* Affiliations */}
      <div>
        <h2 className="font-serif text-lg text-[#e2bd8c]">Affiliations</h2>
        <ul className="mt-5 space-y-3">
          {affiliations.map((name) => (
            <li key={name} className="text-sm text-white/65">
              {name}
            </li>
          ))}
        </ul>
        <p className="mt-7 max-w-[16rem] text-xs leading-6 text-white/40">
          Discover Kenya through thoughtfully planned local experiences.
        </p>
      </div>
    </div>

    {/* Nairobi skyline silhouette */}
    <div
      aria-hidden="true"
      className="pointer-events-none relative z-0 h-20 w-full opacity-80 md:h-28"
      style={{
        backgroundColor: "#0e0c0a",
        WebkitMaskImage: `url(${skyline})`,
        maskImage: `url(${skyline})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskPosition: "bottom",
        maskPosition: "bottom",
      }}
    />

    <div className="relative z-10 border-t border-white/10 bg-[#17130f]">
      <div className="container-edge flex flex-col items-center justify-between gap-3 py-6 text-center text-xs text-white/45 sm:flex-row sm:text-left">
        <p>
          © {new Date().getFullYear()} Karembo Tour Safaris. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);
