import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Booking, Payment, PaymentAudit, PaymentMethod, METHOD_LABELS, STATUS_LABELS, money, statusClass,
} from "@/lib/bookings";
import { BookingForm } from "@/components/admin/BookingForm";

const today = () => new Date().toISOString().slice(0, 10);

const BookingDetail = () => {
  const { id } = useParams();
  const [b, setB] = useState<Booking | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [audit, setAudit] = useState<PaymentAudit[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [pf, setPf] = useState({ amount: "", method: "mpesa" as PaymentMethod, reference: "", paid_at: today(), notes: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    const [bk, py, au] = await Promise.all([
      supabase.from("bookings").select("*").eq("id", id).maybeSingle(),
      supabase.from("payments").select("*").eq("booking_id", id).order("paid_at", { ascending: false }),
      supabase.from("payment_audit").select("*").eq("booking_id", id).order("changed_at", { ascending: false }),
    ]);
    if (bk.error) toast.error(bk.error.message);
    setB(bk.data);
    setPayments(py.data ?? []);
    setAudit(au.data ?? []);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const addPayment = async () => {
    if (!b) return;
    const amount = Number(pf.amount);
    if (!(amount > 0)) return toast.error("Enter an amount greater than 0");
    if (pf.method !== "cash" && !pf.reference.trim()) return toast.error("A transaction reference is required for non-cash payments");
    if (amount > Number(b.balance) + 0.001 && !confirm(`This exceeds the outstanding balance of ${money(b.balance, b.currency)}. Record anyway?`)) return;
    setSaving(true);
    const { error } = await supabase.from("payments").insert({
      booking_id: b.id, amount, currency: b.currency, method: pf.method,
      reference: pf.reference.trim() || null, paid_at: pf.paid_at, notes: pf.notes.trim() || null,
    });
    setSaving(false);
    if (error) {
      if (error.code === "23505") return toast.error("This transaction reference has already been recorded.");
      return toast.error(error.message);
    }
    toast.success("Payment recorded");
    setPayOpen(false);
    setPf({ amount: "", method: "mpesa", reference: "", paid_at: today(), notes: "" });
    load();
  };

  const removePayment = async (p: Payment) => {
    if (!confirm(`Delete payment of ${money(p.amount, p.currency)}? This is kept in the audit log.`)) return;
    const { error } = await supabase.from("payments").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Payment removed");
    load();
  };

  if (!b) return <p className="text-muted-foreground">Loading…</p>;

  const info: [string, string][] = [
    ["Email", b.customer_email || "—"],
    ["Phone", b.customer_phone || "—"],
    ["Country", b.customer_country || "—"],
    ["Tour", b.package_title || "—"],
    ["Travel dates", [b.travel_date, b.end_date].filter(Boolean).map((d) => format(new Date(d!), "dd MMM yyyy")).join(" → ") || "—"],
    ["Guests", `${b.adults} adult${b.adults === 1 ? "" : "s"}, ${b.children} child${b.children === 1 ? "" : "ren"}`],
    ["Created", format(new Date(b.created_at), "PPp")],
  ];

  return (
    <div>
      <Link to="/admin/bookings" className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-4"><ArrowLeft className="h-4 w-4 mr-1" /> All bookings</Link>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{b.booking_ref}</p>
          <h1 className="font-serif text-3xl text-primary">{b.customer_name}</h1>
          <Badge className={`${statusClass(b.status)} mt-2`}>{STATUS_LABELS[b.status]}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}><Pencil className="h-4 w-4 mr-1" /> Edit</Button>
          <Button onClick={() => setPayOpen(true)} disabled={b.status === "cancelled"}><Plus className="h-4 w-4 mr-1" /> Record payment</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[["Total", b.total_amount], ["Paid", b.amount_paid], ["Outstanding", b.balance]].map(([k, v]) => (
          <div key={k as string} className="bg-card rounded-xl p-5 shadow-card">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{k}</p>
            <p className="text-2xl font-bold text-primary mt-1">{money(v as number, b.currency)}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl p-6 shadow-card text-sm">
          <h2 className="font-serif text-xl text-primary mb-3">Customer & trip</h2>
          {info.map(([k, v]) => (
            <div key={k} className="grid grid-cols-3 gap-2 py-1.5 border-b border-border/60">
              <span className="font-semibold text-muted-foreground">{k}</span><span className="col-span-2">{v}</span>
            </div>
          ))}
          {b.notes && <p className="mt-3 whitespace-pre-line bg-sand p-3 rounded-md">{b.notes}</p>}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card rounded-xl shadow-card overflow-x-auto">
            <h2 className="font-serif text-xl text-primary p-4 pb-2">Payments</h2>
            <table className="w-full text-sm">
              <thead className="bg-sand text-primary"><tr>
                {["Date", "Amount", "Method", "Reference", ""].map((h) => <th key={h} className="text-left px-4 py-2 font-semibold">{h}</th>)}
              </tr></thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><td colSpan={5} className="text-center p-5 text-muted-foreground">No payments yet.</td></tr>
                ) : payments.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-2 whitespace-nowrap">{format(new Date(p.paid_at), "dd MMM yyyy")}</td>
                    <td className="px-4 py-2 whitespace-nowrap font-medium">{money(p.amount, p.currency)}</td>
                    <td className="px-4 py-2">{METHOD_LABELS[p.method]}</td>
                    <td className="px-4 py-2 font-mono text-xs">{p.reference || "—"}</td>
                    <td className="px-4 py-2 text-right">
                      <Button size="icon" variant="ghost" onClick={() => removePayment(p)} aria-label="Delete payment"><Trash2 className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-card rounded-xl shadow-card p-4 text-sm">
            <h2 className="font-serif text-xl text-primary mb-2">Payment audit log</h2>
            {audit.length === 0 ? <p className="text-muted-foreground">No activity yet.</p> : (
              <ul className="space-y-2">
                {audit.map((a) => {
                  const d = (a.new_data ?? a.old_data) as { amount?: number; currency?: string; reference?: string | null; method?: PaymentMethod } | null;
                  return (
                    <li key={a.id} className="flex flex-wrap gap-x-3 border-b border-border/60 pb-2">
                      <span className="text-muted-foreground whitespace-nowrap">{format(new Date(a.changed_at), "dd MMM yyyy HH:mm")}</span>
                      <Badge variant="outline">{a.action === "INSERT" ? "Recorded" : a.action === "DELETE" ? "Deleted" : "Edited"}</Badge>
                      <span>{money(d?.amount, d?.currency)} · {d?.method ? METHOD_LABELS[d.method] : ""}{d?.reference ? ` · ${d.reference}` : ""}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      <BookingForm open={editOpen} onOpenChange={setEditOpen} booking={b} onSaved={() => load()} />

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif text-2xl text-primary">Record payment</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Outstanding: {money(b.balance, b.currency)}</p>
          <div className="grid gap-3">
            <div><Label>Amount ({b.currency})</Label><Input type="number" min={0} step="0.01" value={pf.amount} onChange={(e) => setPf({ ...pf, amount: e.target.value })} /></div>
            <div>
              <Label>Payment method</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={pf.method} onChange={(e) => setPf({ ...pf, method: e.target.value as PaymentMethod })}>
                {Object.entries(METHOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><Label>Transaction reference{pf.method === "cash" ? " (optional)" : " *"}</Label><Input value={pf.reference} onChange={(e) => setPf({ ...pf, reference: e.target.value })} placeholder="e.g. M-Pesa code or bank ref" /></div>
            <div><Label>Payment date</Label><Input type="date" value={pf.paid_at} onChange={(e) => setPf({ ...pf, paid_at: e.target.value })} /></div>
            <div><Label>Notes</Label><Input value={pf.notes} onChange={(e) => setPf({ ...pf, notes: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setPayOpen(false)}>Cancel</Button>
            <Button onClick={addPayment} disabled={saving}>{saving ? "Saving…" : "Save payment"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingDetail;
