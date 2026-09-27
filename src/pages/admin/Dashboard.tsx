import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, ArrowRight, FileText, Images, Mail, Package, RefreshCw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Recent = { id: string; name: string; created_at: string; detail?: string | null };
type Counts = { quotes: number; unread: number; packages: number; posts: number; images: number; leads: number; leadsNew: number };
const initial: Counts = { quotes: 0, unread: 0, packages: 0, posts: 0, images: 0, leads: 0, leadsNew: 0 };
const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts>(initial);
  const [quotes, setQuotes] = useState<Recent[]>([]);
  const [leads, setLeads] = useState<Recent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    const results = await Promise.all([
      supabase.from("quote_requests").select("id", { count: "exact", head: true }),
      supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("read", false),
      supabase.from("packages").select("id", { count: "exact", head: true }),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("gallery_images").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("contacted", false),
      supabase.from("quote_requests").select("id,name,created_at,package_interest").order("created_at", { ascending: false }).limit(5),
      supabase.from("leads").select("id,name,created_at,interested_package").order("created_at", { ascending: false }).limit(5),
    ]);
    const failed = results.filter((result) => result.error);
    if (failed.length) {
      setError("Some dashboard data could not be loaded. Check your connection and admin permissions.");
    }
    setCounts({
      quotes: results[0].count ?? 0, unread: results[1].count ?? 0,
      packages: results[2].count ?? 0, posts: results[3].count ?? 0,
      images: results[4].count ?? 0, leads: results[5].count ?? 0,
      leadsNew: results[6].count ?? 0,
    });
    setQuotes((results[7].data ?? []).map((item) => ({
      id: item.id, name: item.name, created_at: item.created_at, detail: item.package_interest,
    })));
    setLeads((results[8].data ?? []).map((item) => ({
      id: item.id, name: item.name, created_at: item.created_at, detail: item.interested_package,
    })));
    setLoading(false);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const cards = [
    { to: "/admin/quotes", icon: Mail, label: "Quote requests", value: counts.quotes, sub: counts.unread + " unread" },
    { to: "/admin/leads", icon: UserPlus, label: "Customer leads", value: counts.leads, sub: counts.leadsNew + " awaiting follow-up" },
    { to: "/admin/packages", icon: Package, label: "Tour packages", value: counts.packages, sub: "Manage packages and pricing" },
    { to: "/admin/blog", icon: FileText, label: "Blog articles", value: counts.posts, sub: "Manage website content" },
    { to: "/admin/gallery", icon: Images, label: "Gallery photos", value: counts.images, sub: "Manage visual content" },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-accent font-semibold">Operations overview</p>
          <h1 className="font-serif text-3xl text-primary mt-1">Karembo command centre</h1>
          <p className="text-muted-foreground mt-2">Manage enquiries, customers, tours and website content in one place.</p>
        </div>
        <Button variant="outline" onClick={() => void refresh()} disabled={loading}>
          <RefreshCw className={"h-4 w-4 mr-2 " + (loading ? "animate-spin" : "")} /> Refresh
        </Button>
      </header>
      {error && <div role="alert" className="flex gap-2 items-center rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
      <section aria-label="Business metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="bg-card rounded-xl p-5 shadow-card border border-border/50 hover:shadow-elegant transition group">
            <div className="flex items-center justify-between"><card.icon className="h-6 w-6 text-accent" /><ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent" /></div>
            <p className="text-3xl font-semibold text-primary mt-4">{loading ? "…" : card.value}</p>
            <h2 className="font-semibold mt-1">{card.label}</h2>
            <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
          </Link>
        ))}
      </section>
      <section className="grid lg:grid-cols-2 gap-5" aria-label="Recent customer activity">
        {[
          { title: "Recent quote requests", items: quotes, to: "/admin/quotes", empty: "No quote requests yet." },
          { title: "Recent leads", items: leads, to: "/admin/leads", empty: "No leads yet." },
        ].map((section) => (
          <div key={section.title} className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-serif text-xl text-primary">{section.title}</h2>
              <Link to={section.to} className="text-sm font-medium text-accent hover:underline">View all</Link>
            </div>
            {loading ? <p className="p-5 text-sm text-muted-foreground">Loading…</p> :
              section.items.length === 0 ? <p className="p-5 text-sm text-muted-foreground">{section.empty}</p> :
              <ul className="divide-y divide-border">
                {section.items.map((item) => <li key={item.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0"><p className="font-medium truncate">{item.name}</p><p className="text-xs text-muted-foreground truncate">{item.detail || "General enquiry"}</p></div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(item.created_at)}</span>
                </li>)}
              </ul>}
          </div>
        ))}
      </section>
      <section className="bg-card border border-border/50 rounded-xl p-5">
        <h2 className="font-serif text-xl text-primary mb-4">Quick management</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline"><Link to="/admin/packages">Edit tour packages</Link></Button>
          <Button asChild variant="outline"><Link to="/admin/blog">Publish blog content</Link></Button>
          <Button asChild variant="outline"><Link to="/admin/gallery">Manage gallery</Link></Button>
          <Button asChild variant="outline"><Link to="/admin/site-images">Update site images</Link></Button>
          <Button asChild variant="outline"><Link to="/" target="_blank" rel="noopener noreferrer">View website</Link></Button>
        </div>
      </section>
    </div>
  );
}
