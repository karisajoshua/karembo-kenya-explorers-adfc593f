import { useState } from "react";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategoryTracker } from "@/hooks/useCategoryTracker";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().trim().email().max(160),
  name: z.string().trim().min(2).max(80),
});

export const CategorySuggestPopup = () => {
  const { suggest, dismiss } = useCategoryTracker();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  if (!suggest) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Check your details", description: "Please enter a valid name and email.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      source: "category_suggest",
      interested_category: suggest.category,
      page_path: location.pathname,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not send", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "On its way!", description: `We'll send 3 hand-picked ${suggest.label.toLowerCase()}.` });
    dismiss();
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[calc(100vw-2rem)] sm:w-96 bg-card rounded-xl shadow-elegant border border-border p-5 animate-in slide-in-from-bottom-4">
      <button onClick={dismiss} aria-label="Dismiss" className="absolute top-2 right-2 p-1 rounded hover:bg-muted">
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-4 w-4 text-accent" />
        <span className="text-xs uppercase tracking-wider text-accent font-bold">For you</span>
      </div>
      <h3 className="font-serif text-lg text-primary mb-1">Loving our {suggest.label}?</h3>
      <p className="text-xs text-muted-foreground mb-3">Get 3 hand-picked itineraries with best-season pricing.</p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Button type="submit" disabled={submitting} size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          {submitting ? "Sending…" : "Send my picks"}
        </Button>
      </form>
    </div>
  );
};
