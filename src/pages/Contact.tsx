import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/PageHero";
import { Seo } from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { tours } from "@/data/tours";
import { generateQuotePdf } from "@/lib/quotePdf";

const HERO = "/gallery/elephant-crossing.jpg";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  travel_dates: z.string().trim().max(100).optional().or(z.literal("")),
  group_size: z.string().trim().max(40).optional().or(z.literal("")),
  package_interest: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

const initial = {
  name: "", email: "", phone: "", country: "",
  travel_dates: "", group_size: "", package_interest: "", budget: "", message: "",
};

const Contact = () => {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  const update = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    const payload = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      country: parsed.data.country || null,
      travel_dates: parsed.data.travel_dates || null,
      group_size: parsed.data.group_size || null,
      package_interest: parsed.data.package_interest || null,
      budget: parsed.data.budget || null,
      message: parsed.data.message || null,
    };
    const { error } = await supabase.from("quote_requests").insert([payload]);
    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    // Generate and download a branded PDF summary for the client
    try {
      generateQuotePdf(payload);
    } catch (err) {
      console.error("PDF generation failed", err);
    }
    toast.success("Thank you! Your quote summary PDF is downloading. We'll be in touch within 24 hours.");
    setForm(initial);
  };

  return (
    <>
      <PageHero
        image={HERO}
        eyebrow="Let's plan it"
        title="Request a Quote"
        subtitle="Tell us about your dream Kenyan adventure and we'll craft a personalized itinerary within 24 hours."
      />

      <section className="py-20">
        <div className="container-edge grid lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <div className="space-y-6 lg:col-span-1">
            <div>
              <h2 className="font-serif text-2xl text-primary mb-2">Get in touch</h2>
              <p className="text-muted-foreground text-sm">Our team is based in Nairobi and replies fast.</p>
            </div>
            {[
              { icon: MapPin, title: "Office", body: "11th Street Kangawa\nNgong Road, Nairobi, Kenya" },
              { icon: Phone, title: "Phone", body: "+254 722 736 130\n+254 757 223 301" },
              { icon: Mail, title: "Email", body: "info@karembotours.co.ke\nreservations@karembotours.co.ke" },
              { icon: MessageCircle, title: "WhatsApp", body: "+254 722 736 130" },
            ].map((c) => (
              <div key={c.title} className="flex gap-4">
                <div className="h-11 w-11 rounded-lg bg-sand flex items-center justify-center shrink-0">
                  <c.icon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <div className="font-semibold text-primary">{c.title}</div>
                  <div className="text-muted-foreground text-sm whitespace-pre-line">{c.body}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="lg:col-span-2 bg-card rounded-xl shadow-card p-6 md:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" required value={form.name} onChange={update("name")} maxLength={100} />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" required value={form.email} onChange={update("email")} maxLength={255} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={update("phone")} maxLength={40} />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={form.country} onChange={update("country")} maxLength={80} />
              </div>
              <div>
                <Label htmlFor="travel_dates">Preferred travel dates</Label>
                <Input id="travel_dates" placeholder="e.g. June 2026" value={form.travel_dates} onChange={update("travel_dates")} maxLength={100} />
              </div>
              <div>
                <Label htmlFor="group_size">Group size</Label>
                <Input id="group_size" placeholder="e.g. 2 adults" value={form.group_size} onChange={update("group_size")} maxLength={40} />
              </div>
              <div>
                <Label htmlFor="package_interest">Package of interest</Label>
                <select
                  id="package_interest"
                  value={form.package_interest}
                  onChange={update("package_interest")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">— Choose one —</option>
                  <option value="Custom itinerary">Custom itinerary</option>
                  {tours.map((t) => (
                    <option key={t.slug} value={t.title}>{t.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="budget">Budget per person (USD)</Label>
                <select
                  id="budget"
                  value={form.budget}
                  onChange={update("budget")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">— Select —</option>
                  <option>Under $1,000</option>
                  <option>$1,000 – $2,500</option>
                  <option>$2,500 – $5,000</option>
                  <option>$5,000+</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="message">Tell us about your dream trip</Label>
              <Textarea id="message" rows={5} value={form.message} onChange={update("message")} maxLength={2000} />
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full sm:w-auto">
              {submitting ? "Sending..." : "Send Request"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;
