import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

type Post = { id: string; slug: string; title: string; published: boolean; created_at: string };

const BlogPosts = () => {
  const [rows, setRows] = useState<Post[]>([]);
  const load = async () => {
    const { data, error } = await supabase
      .from("blog_posts").select("id, slug, title, published, created_at")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as Post[]) ?? []);
  };
  useEffect(() => { load(); }, []);
  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary mb-1">Blog Posts</h1>
          <p className="text-muted-foreground">{rows.length} posts</p>
        </div>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link to="/admin/blog/new"><Plus className="h-4 w-4 mr-1" /> New Post</Link>
        </Button>
      </div>
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sand text-primary"><tr>
            <th className="text-left px-4 py-3 font-semibold">Title</th>
            <th className="text-left px-4 py-3 font-semibold">Status</th>
            <th className="text-left px-4 py-3 font-semibold">Date</th>
            <th className="text-right px-4 py-3 font-semibold">Actions</th>
          </tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-sand/40">
                <td className="px-4 py-3 font-medium">{r.title}</td>
                <td className="px-4 py-3">{r.published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}</td>
                <td className="px-4 py-3 text-muted-foreground">{format(new Date(r.created_at), "dd MMM yyyy")}</td>
                <td className="px-4 py-3 text-right space-x-1">
                  <Button asChild variant="outline" size="sm"><Link to={`/admin/blog/${r.id}`}><Pencil className="h-3.5 w-3.5" /></Link></Button>
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

export default BlogPosts;
