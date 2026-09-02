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

const empty = {
  slug: "", title: "", category: "safari", duration: "", price_from: 0, price_private: "", min_guests: "",
  image: "", summary: "", highlights: "", inclusions: "", exclusions: "",
  published: true, sort_order: 0,
};

const PackageEdit = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = id === "new";
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase.from("packages").select("*").eq("id", id).maybeSingle();
      if (error || !data) { toast.error("Not found"); return; }
      setF({
        slug: data.slug, title: data.title, category: data.category, duration: data.duration,
        price_from: Number(data.price_from),
        price_private: data.price_private == null ? "" : String(data.price_private),
        min_guests: data.min_guests == null ? "" : String(data.min_guests),
        image: data.image, summary: data.summary,
        highlights: (data.highlights || []).join("\n"),
        inclusions: (data.inclusions || []).join("\n"),
        exclusions: (data.exclusions || []).join("\n"),
        published: data.published, sort_order: data.sort_order,
      });
    })();
  }, [id, isNew]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      slug: f.slug, title: f.title, category: f.category, duration: f.duration,
      price_from: Number(f.price_from),
      price_private: f.price_private === "" ? null : Number(f.price_private),
      min_guests: f.min_guests === "" ? null : Number(f.min_guests),
      image: f.image, summary: f.summary,
      highlights: f.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      inclusions: f.inclusions.split("\n").map((s) => s.trim()).filter(Boolean),
      exclusions: f.exclusions.split("\n").map((s) => s.trim()).filter(Boolean),
      published: f.published, sort_order: Number(f.sort_order),
      itinerary: [],
    };
    const op = isNew
      ? supabase.from("packages").insert(payload)
      : supabase.from("packages").update(payload).eq("id", id);
    const { error } = await op;
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    nav("/admin/packages");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl text-primary mb-6">{isNew ? "New Package" : "Edit Package"}</h1>
      <form onSubmit={save} className="bg-card rounded-xl shadow-card p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Title</Label>
            <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required maxLength={200} />
          </div>
          <div>
            <Label>Slug (URL)</Label>
            <Input value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} required maxLength={120} />
          </div>
          <div>
            <Label>Category</Label>
            <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="safari">Safari</option>
              <option value="day-trip">Day Trip</option>
              <option value="combo">Combo</option>
              <option value="cultural">Cultural</option>
            </select>
          </div>
          <div>
            <Label>Duration</Label>
            <Input value={f.duration} onChange={(e) => setF({ ...f, duration: e.target.value })} required maxLength={60} />
          </div>
          <div>
            <Label>Price from (USD)</Label>
            <Input type="number" min={0} value={f.price_from} onChange={(e) => setF({ ...f, price_from: Number(e.target.value) })} required />
          </div>
          <div>
            <Label>Private price per vehicle (USD, optional)</Label>
            <Input type="number" min={0} value={f.price_private} onChange={(e) => setF({ ...f, price_private: e.target.value })} />
          </div>
          <div>
            <Label>Minimum guests for shared rate (optional)</Label>
            <Input type="number" min={0} value={f.min_guests} onChange={(e) => setF({ ...f, min_guests: e.target.value })} />
          </div>
          <div>
            <Label>Sort order</Label>
            <Input type="number" value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) })} />
          </div>
        </div>
        <div>
          <Label>Cover image</Label>
          <ImageUploader value={f.image} onChange={(url) => setF({ ...f, image: url })} folder="packages" />
        </div>
        <div>
          <Label>Summary</Label>
          <Textarea rows={3} value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} required maxLength={500} />
        </div>
        <div>
          <Label>Highlights (one per line)</Label>
          <Textarea rows={4} value={f.highlights} onChange={(e) => setF({ ...f, highlights: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Inclusions (one per line)</Label>
            <Textarea rows={4} value={f.inclusions} onChange={(e) => setF({ ...f, inclusions: e.target.value })} />
          </div>
          <div>
            <Label>Exclusions (one per line)</Label>
            <Textarea rows={4} value={f.exclusions} onChange={(e) => setF({ ...f, exclusions: e.target.value })} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={f.published} onCheckedChange={(v) => setF({ ...f, published: v })} />
          <Label>Published</Label>
        </div>
        <div className="flex gap-3 pt-3 border-t border-border">
          <Button type="submit" disabled={busy} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {busy ? "Saving…" : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={() => nav("/admin/packages")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default PackageEdit;
