import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Mail, Package, FileText, ImageIcon, Images, LogOut, UserPlus, CalendarCheck, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const items = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/bookings", icon: CalendarCheck, label: "Bookings" },
  { to: "/admin/quotes", icon: Mail, label: "Quote Requests" },
  { to: "/admin/leads", icon: UserPlus, label: "Leads" },
  { to: "/admin/packages", icon: Package, label: "Packages" },
  { to: "/admin/blog", icon: FileText, label: "Blog Posts" },
  { to: "/admin/gallery", icon: Images, label: "Gallery" },
  { to: "/admin/site-images", icon: ImageIcon, label: "Site Images" },
];

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-sand lg:flex">
      <header className="sticky top-0 z-40 flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground lg:hidden">
        <Link to="/admin" className="font-serif text-lg font-semibold">Karembo Admin</Link>
        <button type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="admin-navigation" onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">{menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
      </header>
      {menuOpen && <button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} className="fixed inset-0 top-[60px] z-40 bg-black/50 lg:hidden" />}
      <aside id="admin-navigation" className={cn("fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-primary text-primary-foreground flex flex-col transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:translate-x-0", menuOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-5 border-b border-primary-foreground/15">
          <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="float-right rounded p-1 lg:hidden"><X className="h-5 w-5" /></button>
          <Link to="/" className="font-serif text-lg block hover:text-accent transition">Karembo Admin</Link>
          <p className="text-xs text-primary-foreground/60 truncate mt-1">{user?.email}</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Admin navigation">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition",
                  isActive ? "bg-accent text-accent-foreground" : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                )
              }
            >
              <it.icon className="h-4 w-4" /> {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-primary-foreground/15">
          <Button variant="ghost" onClick={() => { setMenuOpen(false); signOut(); }} className="w-full justify-start text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 flex flex-col">
        <div className="px-4 py-6 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full flex-1 min-w-0">
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
