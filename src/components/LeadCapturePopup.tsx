import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useExitIntent } from "@/hooks/useExitIntent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const FALLBACK_IMG = "/day-trips/hells-gate.jpg";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(500).optional().or(z.literal("")),
});

const headlineFor = (path: string) => {
  if (path.startsWith("/safaris")) return { eyebrow: "Insider tip", title: "Plan the Mara safari of a lifetime", sub: "Get our hand-picked itineraries and best-season pricing." };
  if (path.startsWith("/day-trips")) return { eyebrow: "Before you go", title: "Discover Nairobi like a local", sub: "We'll send our top day-trip combos and pricing." };
  if (path.startsWith("/combo")) return { eyebrow: "Save more", title: "Combo packages — bundled & discounted", sub: "Mara + coast or city + park, tailored for you." };
  if (path.startsWith("/cultural")) return { eyebrow: "Authentic Kenya", title: "Meet the Maasai. Live the culture.", sub: "Get our cultural immersion options & prices." };
  return { eyebrow: "Wait — before you leave", title: "Get a free Kenya trip plan", sub: "Tell us what you love and we'll send tailored itineraries within 24 hrs." };
};

export const LeadCapturePopup = () => {
  const { triggered, dismiss } = useExitIntent();
  const location = useLocation();
  const [imageUrl, setImageUrl] = useState<string>(FALLBACK_IMG);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!triggered) return;
    (async () => {
      const { data } = await supabase
        .from("site_images")
        .select("image_url")
        .eq("key", "lead_popup")
        .maybeSingle();
      if (data?.image_url) {
        setImageUrl(data.image_url);
        return;
      }
      const { data: gallery } = await supabase
        .from("gallery_images")
        .select("image_url")
        .order("sort_order")
        .limit(1)
        .maybeSingle();
      if (gallery?.image_url) setImageUrl(gallery.image_url);
    })();
  }, [triggered]);

  const headline = headlineFor(location.pathname);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { if (i.path[0]) errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message || null,
      source: "exit_intent",
      page_path: location.pathname,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Thank you!", description: "We'll be in touch within 24 hours." });
    dismiss();
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <Dialog open={triggered} onOpenChange={(o) => !o && dismiss()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0 grid md:grid-cols-2">
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-1.5 hover:bg-background"
        >
          <X className="h-4 w-4" />
        </button>
        <div
          className="hidden md:block bg-cover bg-center min-h-[420px]"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden="true"
        />
        <div className="p-6 sm:p-8">
          <div className="text-xs uppercase tracking-wider text-accent font-bold mb-1">{headline.eyebrow}</div>
          <h2 className="font-serif text-2xl text-primary mb-2">{headline.title}</h2>
          <p className="text-sm text-muted-foreground mb-5">{headline.sub}</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="lp-name">Name</Label>
              <Input id="lp-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="lp-email">Email</Label>
              <Input id="lp-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="lp-phone">Phone (optional)</Label>
              <Input id="lp-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="lp-msg">What are you interested in? (optional)</Label>
              <Textarea id="lp-msg" rows={2} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <Button type="submit" disabled={submitting} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              {submitting ? "Sending…" : "Send me my trip plan"}
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">No spam — just one tailored reply within 24 hrs.</p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
