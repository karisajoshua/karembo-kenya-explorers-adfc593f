import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Booking, BookingStatus, STATUS_LABELS, money, statusClass } from "@/lib/bookings";
import { BookingForm } from "@/components/admin/BookingForm";

const Bookings = () => {
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | BookingStatus>("");
  const [formOpen, setFormOpen] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    supabase.from("bookings").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (error) toast.error(error.message);
      setRows(data ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => rows.filter((r) => {
    if (status && r.status !== status) return false;
    const s = q.toLowerCase();
    return !s || [r.booking_ref, r.customer_name, r.customer_email, r.package_title].some((v) => v?.toLowerCase().includes(s));
  }), [rows, q, status]);

  const outstanding = rows.filter((r) => r.status !== "cancelled").reduce((a, r) => a + Number(r.balance ?? 0), 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h1 className="font-serif text-3xl text-primary">Bookings</h1>
        <Button onClick={() => setFormOpen(true)}><Plus className="h-4 w-4 mr-1" /> New booking</Button>
      </div>
      <p className="text-muted-foreground mb-6">{rows.length} bookings · Outstanding balance {money(outstanding)}</p>

      <div className="flex flex-wrap gap-3 mb-4">
        <Input placeholder="Search name, ref, email, tour…" value={q} onChange={(e) => setQ(e.target.value)} className="w-full sm:max-w-xs bg-card" />
        <select className="h-10 rounded-md border border-input bg-card px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value as BookingStatus | "")}>
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="grid gap-3 md:hidden">
        {loading ? <p className="p-5 text-muted-foreground">Loading…</p> : filtered.length === 0 ? <p className="p-5 text-muted-foreground">No bookings found.</p> : filtered.map((r) => (
          <Link key={r.id} to={`/admin/bookings/${r.id}`} className="block rounded-xl bg-card p-4 shadow-card space-y-3">
            <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-xs text-muted-foreground font-mono">{r.booking_ref}</p><h2 className="font-semibold text-primary break-words">{r.customer_name}</h2></div><Badge className={statusClass(r.status)}>{STATUS_LABELS[r.status]}</Badge></div>
            <p className="text-sm text-muted-foreground break-words">{r.package_title || "No tour selected"}</p>
            <div className="grid grid-cols-2 gap-2 text-sm"><div><p className="text-xs text-muted-foreground">Travel</p>{r.travel_date ? format(new Date(r.travel_date), "dd MMM yyyy") : "—"}</div><div><p className="text-xs text-muted-foreground">Total</p>{money(r.total_amount, r.currency)}</div><div><p className="text-xs text-muted-foreground">Paid</p>{money(r.amount_paid, r.currency)}</div><div><p className="text-xs text-muted-foreground">Balance</p><strong>{money(r.balance, r.currency)}</strong></div></div>
            <p className="text-sm font-semibold text-primary">View booking →</p>
          </Link>
        ))}
      </div>
      <div className="hidden md:block bg-card rounded-xl shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-sand text-primary">
            <tr>
              {["Ref", "Customer", "Tour", "Travel", "Total", "Paid", "Balance", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center p-6 text-muted-foreground">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center p-6 text-muted-foreground">No bookings found.</td></tr>
            ) : filtered.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-sand/50 cursor-pointer" onClick={() => nav(`/admin/bookings/${r.id}`)}>
                <td className="px-4 py-3 font-mono text-xs"><Link to={`/admin/bookings/${r.id}`} className="hover:text-accent">{r.booking_ref}</Link></td>
                <td className="px-4 py-3 font-medium">{r.customer_name}</td>
                <td className="px-4 py-3 max-w-[200px] truncate">{r.package_title || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.travel_date ? format(new Date(r.travel_date), "dd MMM yyyy") : "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap">{money(r.total_amount, r.currency)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{money(r.amount_paid, r.currency)}</td>
                <td className="px-4 py-3 whitespace-nowrap font-semibold">{money(r.balance, r.currency)}</td>
                <td className="px-4 py-3"><Badge className={statusClass(r.status)}>{STATUS_LABELS[r.status]}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BookingForm open={formOpen} onOpenChange={setFormOpen} onSaved={(b) => nav(`/admin/bookings/${b.id}`)} />
    </div>
  );
};

export default Bookings;
