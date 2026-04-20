import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import logo from "@/assets/karembo-logo.png";
import skyline from "@/assets/nairobi-skyline.png";

export const Footer = () => (
  <footer className="relative bg-sand text-foreground mt-24 overflow-hidden">
    <div className="container-edge py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 relative z-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <img src={logo} alt="Karembo Tour Safaris" className="h-20 w-auto" />
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
          <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> 11th Street Kangawa, Ngong Road, Nairobi, Kenya</li>
          <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> <span>+254 722 736 130<br/>+254 757 223 301</span></li>
          <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> <span>info@karembotours.co.ke<br/>reservations@karembotours.co.ke</span></li>
          <li className="flex gap-2"><span className="text-accent shrink-0">🌐</span> <a href="https://www.karembotours.co.ke" className="hover:text-accent">www.karembotours.co.ke</a></li>
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

    {/* Nairobi skyline silhouette — recolored via CSS mask */}
    <div
      aria-hidden="true"
      className="pointer-events-none select-none w-full block relative z-0 h-24 md:h-32"
      style={{
        backgroundColor: "#3b2417",
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

    <div className="border-t border-foreground/10 bg-sand relative z-10">
      <div className="container-edge py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-foreground/60">
        <p>© {new Date().getFullYear()} Karembo Tour Safaris. All rights reserved.</p>
        <p>
          Powered by{" "}
          <a href="https://texcortech.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent font-medium">
            Texcortech Systems
          </a>
        </p>
      </div>
    </div>
  </footer>
);
