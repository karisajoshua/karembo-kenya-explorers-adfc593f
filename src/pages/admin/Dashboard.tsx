import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Package, FileText, Images } from "lucide-react";

const Dashboard = () => {
  const [counts, setCounts] = useState({ quotes: 0, unread: 0, packages: 0, posts: 0, images: 0 });

  useEffect(() => {
    (async () => {
      const [q, qu, p, b, g] = await Promise.all([
        supabase.from("quote_requests").select("id", { count: "exact", head: true }),
        supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("read", false),
        supabase.from("packages").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        quotes: q.count ?? 0,
        unread: qu.count ?? 0,
        packages: p.count ?? 0,
        posts: b.count ?? 0,
        images: g.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { to: "/admin/quotes", icon: Mail, label: "Quote Requests", value: counts.quotes, sub: `${counts.unread} unread` },
    { to: "/admin/packages", icon: Package, label: "Packages", value: counts.packages, sub: "Tour packages" },
    { to: "/admin/blog", icon: FileText, label: "Blog Posts", value: counts.posts, sub: "Articles" },
    { to: "/admin/gallery", icon: Images, label: "Gallery Photos", value: counts.images, sub: "Images" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome back. Here's what's happening on your site.</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="bg-card rounded-xl p-6 shadow-card hover:shadow-elegant transition group">
            <div className="flex items-center justify-between mb-3">
              <c.icon className="h-6 w-6 text-secondary" />
              <span className="text-3xl font-bold text-primary">{c.value}</span>
            </div>
            <h3 className="font-semibold text-primary group-hover:text-accent transition">{c.label}</h3>
            <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
