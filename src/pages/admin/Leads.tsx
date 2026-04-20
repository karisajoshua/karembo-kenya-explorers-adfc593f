import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Mail, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  source: string;
  interested_category: string | null;
  interested_package: string | null;
  page_path: string | null;
  contacted: boolean;
  created_at: string;
};

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) toast({ title: "Failed to load leads", description: error.message, variant: "destructive" });
      setLeads((data as Lead[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
      if (statusFilter === "new" && l.contacted) return false;
      if (statusFilter === "done" && !l.contacted) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!l.name.toLowerCase().includes(q) && !l.email.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [leads, search, sourceFilter, statusFilter]);

  const toggleContacted = async (id: string, value: boolean) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, contacted: value } : l)));
    const { error } = await supabase.from("leads").update({ contacted: value }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, contacted: !value } : l)));
    }
  };

  const exportCsv = () => {
    const headers = ["Name", "Email", "Phone", "Source", "Category", "Package", "Page", "Message", "Contacted", "Created"];
    const rows = filtered.map((l) => [
      l.name, l.email, l.phone ?? "", l.source, l.interested_category ?? "",
      l.interested_package ?? "", l.page_path ?? "", (l.message ?? "").replace(/"/g, '""'),
      l.contacted ? "Yes" : "No", new Date(l.created_at).toISOString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const sourceLabel: Record<string, string> = {
    exit_intent: "Exit intent",
    category_suggest: "Category suggest",
    popup_timer: "Popup timer",
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-primary">Leads</h1>
          <p className="text-muted-foreground">{leads.length} total · {leads.filter((l) => !l.contacted).length} new</p>
        </div>
        <Button onClick={exportCsv} variant="outline"><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <Input placeholder="Search name or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Source" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            <SelectItem value="exit_intent">Exit intent</SelectItem>
            <SelectItem value="category_suggest">Category suggest</SelectItem>
            <SelectItem value="popup_timer">Popup timer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="done">Contacted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">No leads match your filters.</div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((l) => (
              <div key={l.id} className="p-5 flex flex-wrap gap-4 items-start">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-primary">{l.name}</span>
                    {!l.contacted && <Badge className="bg-accent text-accent-foreground">New</Badge>}
                    <Badge variant="outline" className="text-xs">{sourceLabel[l.source] ?? l.source}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <a href={`mailto:${l.email}`} className="flex items-center gap-1 hover:text-accent"><Mail className="h-3.5 w-3.5" /> {l.email}</a>
                    {l.phone && <a href={`tel:${l.phone}`} className="flex items-center gap-1 hover:text-accent"><Phone className="h-3.5 w-3.5" /> {l.phone}</a>}
                  </div>
                  {l.message && <p className="text-sm mt-2 text-foreground/80 italic">"{l.message}"</p>}
                  <div className="text-xs text-muted-foreground mt-2">
                    {l.interested_category && <span>Interest: {l.interested_category} · </span>}
                    {l.page_path && <span>From: {l.page_path} · </span>}
                    {new Date(l.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Contacted</span>
                  <Switch checked={l.contacted} onCheckedChange={(v) => toggleContacted(l.id, v)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;
