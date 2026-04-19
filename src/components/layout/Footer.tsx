import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import logo from "@/assets/karembo-logo.png";
import skyline from "@/assets/nairobi-skyline.png";

export const Footer = () => (
  <footer className="relative bg-sand text-foreground mt-24 overflow-hidden">
    <div className="container-edge py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 relative z-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <img src={logo} alt="Karembo Tour Safaris" className="h-16 w-auto" />
          <div className="leading-tight">
            <div className="font-serif text-xl font-bold text-primary">Karembo</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/60">Tour Safaris</div>
          </div>
        </div>
        <p className="text-sm text-foreground/75 leading-relaxed">
          Tailor-made Kenyan safaris specializing in the Masai Mara and Nairobi. Crafted by locals, designed for you.
        </p>
        <div className="flex gap-3 mt-5">
          {[Facebook, Instagram, Twitter].map((Icon, i) => (
            <a key={i} href="#" aria-label="social" className="p-2 rounded-full bg-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors">
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-serif text-lg mb-4 text-primary">Explore</h4>
        <ul className="space-y-2 text-sm text-foreground/75">
          <li><Link to="/safaris" className="hover:text-accent">Masai Mara Safaris</Link></li>
          <li><Link to="/day-trips" className="hover:text-accent">Nairobi Day Trips</Link></li>
          <li><Link to="/combo" className="hover:text-accent">Combo Safaris</Link></li>
          <li><Link to="/cultural" className="hover:text-accent">Cultural Experiences</Link></li>
          <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-serif text-lg mb-4 text-primary">Contact</h4>
        <ul className="space-y-3 text-sm text-foreground/75">
          <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> Karen Plains Rd, Nairobi, Kenya</li>
          <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> +254 700 123 456</li>
          <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> hello@karembotours.com</li>
        </ul>
      </div>

      <div>
        <h4 className="font-serif text-lg mb-4 text-primary">Affiliations</h4>
        <ul className="space-y-2 text-sm text-foreground/75">
          <li>Kenya Association of Tour Operators</li>
          <li>Magical Kenya</li>
          <li>Ecotourism Kenya</li>
          <li>Kenya Tourism Federation</li>
        </ul>
      </div>
    </div>

    {/* Nairobi skyline silhouette */}
    <img
      src={skyline}
      alt="Nairobi skyline"
      aria-hidden="true"
      className="pointer-events-none select-none w-full h-auto block relative z-0"
    />

    <div className="border-t border-foreground/10 bg-sand relative z-10">
      <div className="container-edge py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-foreground/60">
        <p>© {new Date().getFullYear()} Karembo Tour Safaris. All rights reserved.</p>
        <p>Crafted with love in Nairobi.</p>
      </div>
    </div>
  </footer>
);
