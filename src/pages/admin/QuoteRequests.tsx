import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { generateQuotePdf } from "@/lib/quotePdf";
import { FileDown, Mail } from "lucide-react";

type Quote = {
  id: string; name: string; email: string; phone: string | null;
  country: string | null; travel_dates: string | null; group_size: string | null;
  package_interest: string | null; budget: string | null; message: string | null;
  read: boolean; created_at: string;
};

const QuoteRequests = () => {
  const [rows, setRows] = useState<Quote[]>([]);
  const [open, setOpen] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as Quote[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string, read: boolean) => {
    const { error } = await supabase.from("quote_requests").update({ read }).eq("id", id);
    if (error) return toast.error(error.message);
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, read } : r)));
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary mb-2">Quote Requests</h1>
      <p className="text-muted-foreground mb-6">{rows.filter((r) => !r.read).length} unread of {rows.length} total</p>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sand text-primary">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-left px-4 py-3 font-semibold">Name</th>
              <th className="text-left px-4 py-3 font-semibold">Email</th>
              <th className="text-left px-4 py-3 font-semibold">Package</th>
              <th className="text-left px-4 py-3 font-semibold">Date</th>
              <th className="text-right px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center p-6 text-muted-foreground">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="text-center p-6 text-muted-foreground">No quote requests yet.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-sand/50">
                  <td className="px-4 py-3">
                    {r.read ? <Badge variant="outline">Read</Badge> : <Badge className="bg-accent text-accent-foreground">New</Badge>}
                  </td>
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                  <td className="px-4 py-3">{r.package_interest || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{format(new Date(r.created_at), "dd MMM yyyy")}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => { setOpen(r); if (!r.read) markRead(r.id, true); }}>View</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-primary">{open.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                {[
                  ["Email", open.email],
                  ["Phone", open.phone || "—"],
                  ["Country", open.country || "—"],
                  ["Travel dates", open.travel_dates || "—"],
                  ["Group size", open.group_size || "—"],
                  ["Package interest", open.package_interest || "—"],
                  ["Budget", open.budget || "—"],
                  ["Submitted", format(new Date(open.created_at), "PPpp")],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 gap-3 py-1.5 border-b border-border/60">
                    <span className="font-semibold text-muted-foreground">{k}</span>
                    <span className="col-span-2 text-foreground">{v}</span>
                  </div>
                ))}
                {open.message && (
                  <div className="pt-3">
                    <p className="font-semibold text-muted-foreground mb-1">Message</p>
                    <p className="text-foreground whitespace-pre-line bg-sand p-3 rounded-md">{open.message}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                <Button onClick={() => generateQuotePdf(open)} variant="outline">
                  <FileDown className="h-4 w-4 mr-1" /> Download PDF
                </Button>
                <Button asChild variant="outline">
                  <a href={`mailto:${open.email}?subject=Re: Your Karembo safari enquiry`}>
                    <Mail className="h-4 w-4 mr-1" /> Reply by email
                  </a>
                </Button>
                <Button variant="outline" onClick={() => markRead(open.id, !open.read)}>
                  Mark as {open.read ? "unread" : "read"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuoteRequests;
