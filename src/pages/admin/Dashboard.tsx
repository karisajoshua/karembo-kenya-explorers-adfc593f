import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, ArrowRight, FileText, Images, Mail, Package, RefreshCw, UserPlus, CalendarDays, Users, Wallet, Zap, ImageIcon, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

type Recent = { id: string; name: string; created_at: string; detail?: string | null };
type Counts = { quotes: number; unread: number; packages: number; posts: number; images: number; leads: number; leadsNew: number };
const initial: Counts = { quotes: 0, unread: 0, packages: 0, posts: 0, images: 0, leads: 0, leadsNew: 0 };
const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts>(initial);
  const [quotes, setQuotes] = useState<Recent[]>([]);
  const [leads, setLeads] = useState<Recent[]>([]);
  const [trend, setTrend] = useState<{ month: string; quotes: number; leads: number }[]>([]);
  const [banner, setBanner] = useState<string | null>(null);
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
      supabase.from("packages").select("image").eq("published", true).limit(1),
      supabase.from("quote_requests").select("created_at").gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth() - 7, 1).toISOString()),
      supabase.from("leads").select("created_at").gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth() - 7, 1).toISOString()),
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
    setBanner(results[9].data?.[0]?.image ?? null);
    const months = Array.from({ length: 8 }, (_, i) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - 7 + i); return { key: d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"), month: d.toLocaleDateString(undefined, { month: "short" }), quotes: 0, leads: 0 }; });
    for (const [index, field] of [[10, "quotes"], [11, "leads"]] as const) { for (const record of results[index].data ?? []) { const key = record.created_at.slice(0, 7); const target = months.find(month => month.key === key); if (target) target[field]++; } }
    setTrend(months.map(({ month, quotes, leads }) => ({ month, quotes, leads })));
    setLoading(false);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const cards = [
    { to: "/admin/quotes", icon: CalendarDays, label: "Quote requests", value: counts.quotes, sub: counts.unread + " unread", color: "bg-emerald-700" },
    { to: "/admin/leads", icon: Mail, label: "Enquiries & leads", value: counts.leads, sub: counts.leadsNew + " awaiting follow-up", color: "bg-amber-500" },
    { to: "/admin/packages", icon: Package, label: "Tour packages", value: counts.packages, sub: "Manage published tours", color: "bg-amber-800" },
    { to: "/admin/leads", icon: Users, label: "Customer leads", value: counts.leads, sub: "Recorded enquiries", color: "bg-indigo-600" },
    { to: "/admin/bookings", icon: Wallet, label: "Manual payments", value: "—", sub: "Record and verify offline", color: "bg-emerald-800" },
  ];
  const actions = [
    { to: "/admin/packages/new", icon: Package, label: "Add tour package", color: "bg-emerald-800" },
    { to: "/admin/bookings", icon: CalendarDays, label: "New booking / payments", color: "bg-[#a78036]" },
    { to: "/admin/leads", icon: Mail, label: "View customer leads", color: "bg-[#ad5532]" },
    { to: "/admin/gallery", icon: ImageIcon, label: "Upload images", color: "bg-blue-800" },
    { to: "/admin/blog/new", icon: FileText, label: "Write blog post", color: "bg-violet-800" },
    { to: "/admin/site-images", icon: Images, label: "Manage banners", color: "bg-pink-700" },
  ];
  return (
    <div className="space-y-4 lg:space-y-5 text-slate-900">
      <header className="flex flex-wrap justify-between items-center gap-3">
        <div><h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Welcome back, Admin! 👋</h1><p className="text-sm text-slate-600">Manage your tours, enquiries, customers and website all in one place.</p></div>
        <div className="flex items-center gap-3 text-sm"><span className="hidden sm:inline rounded-xl bg-white px-4 py-2">{new Date().toLocaleString(undefined, { dateStyle: "medium" })}</span><Button variant="outline" aria-label="Refresh dashboard" onClick={() => void refresh()} disabled={loading}><RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} /></Button><span aria-label={counts.unread + " unread enquiries"} className="relative rounded-full bg-white p-3"><Bell className="h-4 w-4" />{counts.unread > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full px-1">{counts.unread}</span>}</span></div>
      </header>
      <section className="relative rounded-xl overflow-hidden min-h-40 lg:min-h-44 flex items-center bg-gradient-to-r from-[#223b2f] to-[#9a733e] text-white" style={banner ? { backgroundImage: `linear-gradient(90deg, rgba(15,36,29,.92), rgba(15,36,29,.08)), url("${banner.replace(/"/g, "%22")}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
        <div className="relative p-6 lg:p-10"><h2 className="font-serif text-3xl lg:text-4xl">Karembo Kenya Explorers</h2><p className="mt-2 text-white/90">Showcasing the best of Kenya to the world</p></div>
      </section>
      {error && <div role="alert" className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {cards.map(card => <Link key={card.label} to={card.to} className="rounded-xl bg-white p-4 shadow-sm flex gap-3 items-start hover:shadow-md transition">
          <span className={`rounded-xl p-3 text-white ${card.color}`}><card.icon className="h-5 w-5" /></span>
          <span className="min-w-0"><span className="text-sm text-slate-600 block">{card.label}</span><strong className="text-2xl block mt-1">{loading ? "…" : card.value}</strong><span className="text-xs text-emerald-800">{card.sub}</span></span>
        </Link>)}
      </section>
      <section className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex justify-between items-center"><h2 className="font-bold flex gap-2 items-center"><CalendarDays className="h-5 w-5" /> Enquiries overview</h2><span className="text-xs text-slate-500">Current records</span></div>
          <div className="mt-6 h-64" role="img" aria-label="Monthly quote requests and leads for the past eight months">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 5, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="#e9edf1" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="quotes" name="Quote requests" stroke="#076747" strokeWidth={2} />
                <Line type="monotone" dataKey="leads" name="Leads" stroke="#d99315" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm"><h2 className="font-bold flex items-center gap-2"><Zap className="h-5 w-5" />Quick actions</h2><div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">{actions.map(action => <Link key={action.label} to={action.to} className={`${action.color} min-h-24 rounded-lg text-white flex flex-col justify-center items-center text-center gap-2 p-3 hover:brightness-110 transition`}><action.icon className="h-6 w-6" /><span className="text-xs font-semibold">{action.label}</span></Link>)}</div></div>
      </section>
      <section className="grid lg:grid-cols-3 gap-4">
        {[
          { title: "Recent enquiries", to: "/admin/quotes", items: quotes, empty: "No quote requests yet." },
          { title: "Recent customer leads", to: "/admin/leads", items: leads, empty: "No customer leads yet." },
        ].map(section => <div key={section.title} className="bg-white rounded-xl shadow-sm p-4"><div className="flex justify-between items-center border-b pb-3"><h2 className="font-bold text-sm">{section.title}</h2><Link to={section.to} className="text-xs text-blue-700">View all</Link></div>{section.items.length ? <ul className="divide-y">{section.items.map(item => <li key={item.id} className="flex justify-between gap-2 py-3"><span className="min-w-0"><span className="font-semibold text-sm block truncate">{item.name}</span><span className="text-xs text-slate-500 block truncate">{item.detail || "General enquiry"}</span></span><span className="text-xs text-slate-500 whitespace-nowrap">{formatDate(item.created_at)}</span></li>)}</ul> : <p className="text-sm text-slate-500 py-5">{loading ? "Loading…" : section.empty}</p>}</div>)}
        <div className="bg-white rounded-xl shadow-sm p-4"><div className="flex justify-between items-center border-b pb-3"><h2 className="font-bold text-sm">Website content</h2><Link to="/admin/site-images" className="text-xs text-blue-700">Manage</Link></div><div className="divide-y text-sm">{[{ to: "/admin/packages", title: "Tour packages", count: counts.packages }, { to: "/admin/blog", title: "Blog articles", count: counts.posts }, { to: "/admin/gallery", title: "Gallery images", count: counts.images }, { to: "/admin/site-images", title: "Hero banners and site images", count: null }].map(item => <Link key={item.to} to={item.to} className="flex justify-between items-center py-4 hover:text-emerald-800"><span>{item.title}</span><span className="text-xs text-slate-500">{item.count ?? "Manage"} <ArrowRight className="inline h-3 w-3" /></span></Link>)}</div></div>
      </section>
    </div>
  );
}
