import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { toast } from "sonner";

type SiteImg = { id: string; key: string; image_url: string; alt: string | null };

const SiteImages = () => {
  const [rows, setRows] = useState<SiteImg[]>([]);
  const load = async () => {
    const { data, error } = await supabase.from("site_images").select("*").order("key");
    if (error) toast.error(error.message);
    setRows((data as SiteImg[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async (r: SiteImg) => {
    const { error } = await supabase.from("site_images").update({ image_url: r.image_url, alt: r.alt }).eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary mb-2">Site Images</h1>
      <p className="text-muted-foreground mb-6">Update key images that appear across the site.</p>

      <div className="space-y-5">
        {rows.map((r, i) => (
          <div key={r.id} className="bg-card rounded-xl shadow-card p-5 grid md:grid-cols-2 gap-5">
            <div>
              <Label className="font-mono text-xs">{r.key}</Label>
              <ImageUploader value={r.image_url} onChange={(url) => setRows((rs) => rs.map((x, idx) => idx === i ? { ...x, image_url: url } : x))} folder="site" />
            </div>
            <div className="space-y-3">
              <div>
                <Label>Alt text</Label>
                <Input value={r.alt || ""} onChange={(e) => setRows((rs) => rs.map((x, idx) => idx === i ? { ...x, alt: e.target.value } : x))} />
              </div>
              <Button onClick={() => save(r)} className="bg-accent text-accent-foreground hover:bg-accent/90">Save</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteImages;
