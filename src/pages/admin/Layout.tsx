import * as React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Mail, Package, FileText, ImageIcon, Images, LogOut, UserPlus, Menu, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const items = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/quotes", icon: Mail, label: "Quote Requests" },
  { to: "/admin/leads", icon: UserPlus, label: "Leads" },
  { to: "/admin/packages", icon: Package, label: "Packages" },
  { to: "/admin/blog", icon: FileText, label: "Blog Posts" },
  { to: "/admin/gallery", icon: Images, label: "Gallery" },
  { to: "/admin/site-images", icon: ImageIcon, label: "Site Images" },
];

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <div className="min-h-screen flex bg-[#f5f7fc]">
      <aside className={`${menuOpen ? "flex" : "hidden"} lg:flex fixed lg:sticky z-40 top-0 left-0 h-screen w-64 shrink-0 bg-[#102e2a] text-white flex-col`}>
        <div className="p-6 border-b border-primary-foreground/15">
          <Link to="/admin" className="font-serif text-lg block text-white hover:text-[#d9ac5c] transition">KAREMBO</Link><p className="text-[10px] tracking-[.25em] text-[#d9ac5c]">KENYA EXPLORERS</p>
          <p className="text-xs text-primary-foreground/60 truncate mt-1">{user?.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((it) => (
            <NavLink
              onClick={() => setMenuOpen(false)}
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition",
                  isActive ? "bg-[#a78036] text-white" : "text-white/80 hover:bg-white/10"
                )
              }
            >
              <it.icon className="h-4 w-4" /> {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-primary-foreground/15">
          <Button variant="ghost" onClick={signOut} className="w-full justify-start text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-auto flex flex-col"><div className="lg:hidden flex justify-between items-center p-3 bg-[#102e2a] text-white"><span className="font-serif">KAREMBO</span><Button aria-label="Toggle menu" variant="ghost" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></div>
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full flex-1">
          <Outlet />
        </div>
        <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border">
          Powered by{" "}
          <a href="https://texcortech.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent font-medium">
            Texcortech Systems
          </a>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;
