import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Booking, BookingStatus, STATUS_LABELS } from "@/lib/bookings";

type Props = { open: boolean; onOpenChange: (o: boolean) => void; booking?: Booking | null; onSaved: (b: Booking) => void };

const empty = {
  customer_name: "", customer_email: "", customer_phone: "", customer_country: "",
  package_id: "", package_title: "", travel_date: "", end_date: "",
  adults: 1, children: 0, currency: "USD", total_amount: 0, status: "pending" as BookingStatus, notes: "",
};

export const BookingForm = ({ open, onOpenChange, booking, onSaved }: Props) => {
  const [f, setF] = useState(empty);
  const [pkgs, setPkgs] = useState<{ id: string; title: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("packages").select("id,title").order("sort_order").then(({ data }) => setPkgs(data ?? []));
  }, []);

  useEffect(() => {
    if (!open) return;
    setF(booking ? {
      customer_name: booking.customer_name, customer_email: booking.customer_email ?? "",
      customer_phone: booking.customer_phone ?? "", customer_country: booking.customer_country ?? "",
      package_id: booking.package_id ?? "", package_title: booking.package_title ?? "",
      travel_date: booking.travel_date ?? "", end_date: booking.end_date ?? "",
      adults: booking.adults, children: booking.children, currency: booking.currency,
      total_amount: Number(booking.total_amount), status: booking.status, notes: booking.notes ?? "",
    } : empty);
  }, [open, booking]);

  const set = (k: keyof typeof empty, v: string | number) => setF((s) => ({ ...s, [k]: v }));

  const save = async () => {
    if (!f.customer_name.trim()) return toast.error("Customer name is required");
    if (f.end_date && f.travel_date && f.end_date < f.travel_date) return toast.error("End date is before travel date");
    setSaving(true);
    const payload = {
      customer_name: f.customer_name.trim(),
      customer_email: f.customer_email.trim() || null,
      customer_phone: f.customer_phone.trim() || null,
      customer_country: f.customer_country.trim() || null,
      package_id: f.package_id || null,
      package_title: f.package_title.trim() || pkgs.find((p) => p.id === f.package_id)?.title || null,
      travel_date: f.travel_date || null,
      end_date: f.end_date || null,
      adults: Number(f.adults) || 0,
      children: Number(f.children) || 0,
      currency: f.currency.trim().toUpperCase() || "USD",
      total_amount: Number(f.total_amount) || 0,
      status: f.status,
      notes: f.notes.trim() || null,
    };
    const q = booking
      ? supabase.from("bookings").update(payload).eq("id", booking.id).select().single()
      : supabase.from("bookings").insert(payload).select().single();
    const { data, error } = await q;
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(booking ? "Booking updated" : `Booking ${data.booking_ref} created`);
    onSaved(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif text-2xl text-primary">{booking ? `Edit ${booking.booking_ref}` : "New booking"}</DialogTitle></DialogHeader>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><Label>Customer name *</Label><Input value={f.customer_name} onChange={(e) => set("customer_name", e.target.value)} /></div>
          <div><Label>Email</Label><Input type="email" value={f.customer_email} onChange={(e) => set("customer_email", e.target.value)} /></div>
          <div><Label>Phone</Label><Input value={f.customer_phone} onChange={(e) => set("customer_phone", e.target.value)} /></div>
          <div><Label>Country</Label><Input value={f.customer_country} onChange={(e) => set("customer_country", e.target.value)} /></div>
          <div>
            <Label>Tour package</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={f.package_id} onChange={(e) => set("package_id", e.target.value)}>
              <option value="">— Custom / none —</option>
              {pkgs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2"><Label>Tour description (optional, overrides package name)</Label><Input value={f.package_title} onChange={(e) => set("package_title", e.target.value)} placeholder="e.g. Nairobi NP + Giraffe Centre + Elephant Orphanage" /></div>
          <div><Label>Travel date</Label><Input type="date" value={f.travel_date} onChange={(e) => set("travel_date", e.target.value)} /></div>
          <div><Label>End date</Label><Input type="date" value={f.end_date} onChange={(e) => set("end_date", e.target.value)} /></div>
          <div><Label>Adults</Label><Input type="number" min={0} value={f.adults} onChange={(e) => set("adults", e.target.value)} /></div>
          <div><Label>Children</Label><Input type="number" min={0} value={f.children} onChange={(e) => set("children", e.target.value)} /></div>
          <div><Label>Currency</Label><Input value={f.currency} maxLength={3} onChange={(e) => set("currency", e.target.value)} /></div>
          <div><Label>Total amount</Label><Input type="number" min={0} step="0.01" value={f.total_amount} onChange={(e) => set("total_amount", e.target.value)} /></div>
          <div>
            <Label>Status</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={f.status} onChange={(e) => set("status", e.target.value)}>
              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <p className="text-xs text-muted-foreground mt-1">Payment status updates automatically as payments are recorded.</p>
          </div>
          <div className="sm:col-span-2"><Label>Notes</Label><Textarea rows={3} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save booking"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
