import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import logo from "@/assets/karembo-logo.png";

export const Footer = () => (
  <footer className="bg-primary text-primary-foreground mt-24">
    <div className="container-edge py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <img src={logo} alt="Karembo Tour Safaris" className="h-14 w-auto bg-background/10 rounded p-1" />
          <div className="leading-tight">
            <div className="font-serif text-xl font-bold">Karembo</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/70">Tour Safaris</div>
          </div>
        </div>
        <p className="text-sm text-primary-foreground/80 leading-relaxed">
          Tailor-made Kenyan safaris specializing in the Masai Mara and Nairobi. Crafted by locals, designed for you.
        </p>
        <div className="flex gap-3 mt-5">
          {[Facebook, Instagram, Twitter].map((Icon, i) => (
            <a key={i} href="#" aria-label="social" className="p-2 rounded-full bg-background/10 hover:bg-accent hover:text-accent-foreground transition-colors">
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-serif text-lg mb-4">Explore</h4>
        <ul className="space-y-2 text-sm text-primary-foreground/80">
          <li><Link to="/safaris" className="hover:text-accent">Masai Mara Safaris</Link></li>
          <li><Link to="/day-trips" className="hover:text-accent">Nairobi Day Trips</Link></li>
          <li><Link to="/combo" className="hover:text-accent">Combo Safaris</Link></li>
          <li><Link to="/cultural" className="hover:text-accent">Cultural Experiences</Link></li>
          <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-serif text-lg mb-4">Contact</h4>
        <ul className="space-y-3 text-sm text-primary-foreground/80">
          <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> Karen Plains Rd, Nairobi, Kenya</li>
          <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> +254 700 123 456</li>
          <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> hello@karembotours.com</li>
        </ul>
      </div>

      <div>
        <h4 className="font-serif text-lg mb-4">Affiliations</h4>
        <ul className="space-y-2 text-sm text-primary-foreground/80">
          <li>Kenya Association of Tour Operators</li>
          <li>Magical Kenya</li>
          <li>Ecotourism Kenya</li>
          <li>Kenya Tourism Federation</li>
        </ul>
      </div>
    </div>

    <div className="border-t border-primary-foreground/10">
      <div className="container-edge py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/60">
        <p>© {new Date().getFullYear()} Karembo Tour Safaris. All rights reserved.</p>
        <p>Crafted with love in Nairobi.</p>
      </div>
    </div>
  </footer>
);
