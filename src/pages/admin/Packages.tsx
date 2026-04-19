import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Pkg = { id: string; slug: string; title: string; category: string; price_from: number; published: boolean };

const Packages = () => {
  const [rows, setRows] = useState<Pkg[]>([]);

  const load = async () => {
    const { data, error } = await supabase
      .from("packages")
      .select("id, slug, title, category, price_from, published")
      .order("sort_order");
    if (error) toast.error(error.message);
    setRows((data as Pkg[]) ?? []);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this package? This cannot be undone.")) return;
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary mb-1">Packages</h1>
          <p className="text-muted-foreground">{rows.length} packages</p>
        </div>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link to="/admin/packages/new"><Plus className="h-4 w-4 mr-1" /> New Package</Link>
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sand text-primary">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Title</th>
              <th className="text-left px-4 py-3 font-semibold">Category</th>
              <th className="text-left px-4 py-3 font-semibold">Price</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-right px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-sand/40">
                <td className="px-4 py-3 font-medium">{r.title}</td>
                <td className="px-4 py-3 capitalize">{r.category}</td>
                <td className="px-4 py-3">${r.price_from}</td>
                <td className="px-4 py-3">
                  {r.published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
                </td>
                <td className="px-4 py-3 text-right space-x-1">
                  <Button asChild variant="outline" size="sm"><Link to={`/admin/packages/${r.id}`}><Pencil className="h-3.5 w-3.5" /></Link></Button>
                  <Button variant="outline" size="sm" onClick={() => remove(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Packages;
