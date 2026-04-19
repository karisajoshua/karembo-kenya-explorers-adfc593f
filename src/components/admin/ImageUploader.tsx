import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
};

export const ImageUploader = ({ value, onChange, folder = "uploads" }: Props) => {
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    setBusy(true);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: false });
    if (error) {
      toast.error(error.message);
      setBusy(false);
      return;
    }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    onChange(data.publicUrl);
    setBusy(false);
    toast.success("Image uploaded");
  };

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="" className="h-32 w-48 object-cover rounded-md border border-border" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:scale-110 transition"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <label className="inline-flex">
          <Button type="button" variant="outline" disabled={busy} asChild>
            <span className="cursor-pointer">
              <Upload className="h-4 w-4 mr-1" /> {busy ? "Uploading…" : "Upload"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </span>
          </Button>
        </label>
      </div>
      <Input
        placeholder="…or paste an image URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
