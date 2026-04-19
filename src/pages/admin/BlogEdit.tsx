import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { toast } from "sonner";

const empty = { slug: "", title: "", excerpt: "", content: "", cover_image: "", author: "Karembo Tours", published: true };

const BlogEdit = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = id === "new";
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
      if (error || !data) return toast.error("Not found");
      setF({
        slug: data.slug, title: data.title, excerpt: data.excerpt || "",
        content: data.content, cover_image: data.cover_image || "",
        author: data.author || "Karembo Tours", published: data.published,
      });
    })();
  }, [id, isNew]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const op = isNew
      ? supabase.from("blog_posts").insert(f)
      : supabase.from("blog_posts").update(f).eq("id", id);
    const { error } = await op;
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    nav("/admin/blog");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl text-primary mb-6">{isNew ? "New Post" : "Edit Post"}</h1>
      <form onSubmit={save} className="bg-card rounded-xl shadow-card p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Title</Label>
            <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required maxLength={200} />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} required maxLength={120} />
          </div>
        </div>
        <div>
          <Label>Cover image</Label>
          <ImageUploader value={f.cover_image} onChange={(url) => setF({ ...f, cover_image: url })} folder="blog" />
        </div>
        <div>
          <Label>Excerpt</Label>
          <Textarea rows={2} value={f.excerpt} onChange={(e) => setF({ ...f, excerpt: e.target.value })} maxLength={300} />
        </div>
        <div>
          <Label>Content (Markdown supported with ## for headings, ** for bold)</Label>
          <Textarea rows={14} value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} required />
        </div>
        <div>
          <Label>Author</Label>
          <Input value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} maxLength={120} />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={f.published} onCheckedChange={(v) => setF({ ...f, published: v })} />
          <Label>Published</Label>
        </div>
        <div className="flex gap-3 pt-3 border-t border-border">
          <Button type="submit" disabled={busy} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {busy ? "Saving…" : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={() => nav("/admin/blog")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default BlogEdit;
