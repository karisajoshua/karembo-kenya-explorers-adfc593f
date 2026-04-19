import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { toast } from "sonner";
import { Trash2, Plus, Upload } from "lucide-react";

type Img = { id: string; image_url: string; caption: string | null; category: string | null; sort_order: number };

const CATEGORIES = ["Wildlife", "Landscapes", "Culture", "People"];

const Gallery = () => {
  const [rows, setRows] = useState<Img[]>([]);
  const [adding, setAdding] = useState(false);
  const [newImg, setNewImg] = useState({ image_url: "", caption: "", category: "Wildlife" });
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });
  const [bulkCategory, setBulkCategory] = useState("Wildlife");
  const bulkInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order");
    if (error) toast.error(error.message);
    setRows((data as Img[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!newImg.image_url) return toast.error("Image required");
    const { error } = await supabase.from("gallery_images").insert({ ...newImg, sort_order: rows.length + 1 });
    if (error) return toast.error(error.message);
    toast.success("Added");
    setAdding(false); setNewImg({ image_url: "", caption: "", category: "Wildlife" });
    load();
  };

  const handleBulkUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    const oversized = list.filter((f) => f.size > 5 * 1024 * 1024);
    if (oversized.length) {
      toast.error(`${oversized.length} file(s) exceed 5MB and will be skipped`);
    }
    const valid = list.filter((f) => f.size <= 5 * 1024 * 1024);
    if (!valid.length) {
      if (bulkInputRef.current) bulkInputRef.current.value = "";
      return;
    }

    setBulkBusy(true);
    setBulkProgress({ done: 0, total: valid.length });
    let baseOrder = rows.length;
    let success = 0;
    let failed = 0;

    for (const file of valid) {
      const ext = file.name.split(".").pop();
      const path = `gallery/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("site-assets").upload(path, file, { upsert: false });
      if (upErr) {
        failed++;
        setBulkProgress((p) => ({ ...p, done: p.done + 1 }));
        continue;
      }
      const { data: pub } = supabase.storage.from("site-assets").getPublicUrl(path);
      const caption = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      const { error: insErr } = await supabase.from("gallery_images").insert({
        image_url: pub.publicUrl,
        caption,
        category: bulkCategory,
        sort_order: ++baseOrder,
      });
      if (insErr) failed++; else success++;
      setBulkProgress((p) => ({ ...p, done: p.done + 1 }));
    }

    setBulkBusy(false);
    if (bulkInputRef.current) bulkInputRef.current.value = "";
    if (success) toast.success(`Uploaded ${success} image${success > 1 ? "s" : ""}`);
    if (failed) toast.error(`${failed} failed to upload`);
    load();
  };

  const update = async (id: string, patch: Partial<Img>) => {
    const { error } = await supabase.from("gallery_images").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary mb-1">Gallery</h1>
          <p className="text-muted-foreground">{rows.length} images</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={bulkCategory}
            onChange={(e) => setBulkCategory(e.target.value)}
            disabled={bulkBusy}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Bulk upload category"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input
            ref={bulkInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleBulkUpload(e.target.files)}
          />
          <Button
            variant="outline"
            disabled={bulkBusy}
            onClick={() => bulkInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-1" />
            {bulkBusy ? `Uploading ${bulkProgress.done}/${bulkProgress.total}…` : "Bulk Upload"}
          </Button>
          <Button onClick={() => setAdding((a) => !a)} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-1" /> Add Image
          </Button>
        </div>
      </div>

      {bulkBusy && (
        <div className="mb-6 rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
          Uploading {bulkProgress.done} of {bulkProgress.total}… please keep this tab open.
        </div>
      )}

      {adding && (
        <div className="bg-card rounded-xl shadow-card p-5 mb-6 space-y-4">
          <ImageUploader value={newImg.image_url} onChange={(url) => setNewImg({ ...newImg, image_url: url })} folder="gallery" />
          <Input placeholder="Caption" value={newImg.caption} onChange={(e) => setNewImg({ ...newImg, caption: e.target.value })} />
          <select value={newImg.category} onChange={(e) => setNewImg({ ...newImg, category: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className="flex gap-2">
            <Button onClick={add} className="bg-accent text-accent-foreground hover:bg-accent/90">Save</Button>
            <Button variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {rows.map((r) => (
          <div key={r.id} className="bg-card rounded-xl overflow-hidden shadow-card">
            <img src={r.image_url} alt={r.caption || ""} className="aspect-square w-full object-cover" />
            <div className="p-3 space-y-2">
              <Input value={r.caption || ""} onChange={(e) => setRows((rs) => rs.map((x) => x.id === r.id ? { ...x, caption: e.target.value } : x))} onBlur={(e) => update(r.id, { caption: e.target.value })} placeholder="Caption" />
              <select value={r.category || "Wildlife"} onChange={(e) => update(r.id, { category: e.target.value })} className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <Button variant="outline" size="sm" onClick={() => remove(r.id)} className="w-full">
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
