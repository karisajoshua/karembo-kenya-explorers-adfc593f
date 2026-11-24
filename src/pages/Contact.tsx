
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Seo } from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { tours } from "@/data/tours";
import { generateQuotePdf } from "@/lib/quotePdf";

const SITE_URL = "https://karembotours.co.ke";
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
  name: "",
  email: "",
  phone: "",
  country: "",
  travel_dates: "",
  group_size: "",
  package_interest: "",
  budget: "",
  message: "",
};

const inputClass =
  "h-12 rounded-none border-[#dedbd1] bg-white px-4 text-sm text-[#18372a] placeholder:text-[#a3a69e] transition focus-visible:border-[#a18453] focus-visible:ring-1 focus-visible:ring-[#a18453]";

const selectClass =
  "h-12 w-full rounded-none border border-[#dedbd1] bg-white px-4 text-sm text-[#18372a] outline-none transition focus:border-[#a18453] focus:ring-1 focus:ring-[#a18453]";

const Contact = () => {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  const update =
    (key: keyof typeof initial) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((current) => ({
        ...current,
        [key]: event.target.value,
      }));
    };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) return;

    const parsed = schema.safeParse(form);

    if (!parsed.success) {
      toast.error(
        parsed.error.issues[0]?.message ?? "Please check the form"
      );
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

    try {
      const { error } = await supabase
        .from("quote_requests")
        .insert([payload]);

      if (error) {
        console.error("Quote request submission failed:", error);
        toast.error("Something went wrong. Please try again.");
        return;
      }

      // Generate and download a branded PDF summary for the client.
      try {
        generateQuotePdf(payload);
      } catch (pdfError) {
        console.error("PDF generation failed:", pdfError);
        toast.success(
          "Your request has been received! We'll be in touch within 24 hours."
        );
        setForm(initial);
        return;
      }

      toast.success(
        "Thank you! Your quote summary PDF is downloading. We'll be in touch within 24 hours."
      );

      setForm(initial);
    } catch (error) {
      console.error("Unexpected quote submission error:", error);
      toast.error("Unable to send your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const contactDetails = [
    {
      icon: MapPin,
      title: "Visit our office",
      lines: ["11th Street Kangawa", "Ngong Road, Nairobi, Kenya"],
      href: null,
    },
    {
      icon: Phone,
      title: "Call our team",
      lines: ["+254 722 736 130", "+254 757 223 301"],
      href: "tel:+254722736130",
    },
    {
      icon: Mail,
      title: "Send us an email",
      lines: ["info@karembotours.co.ke", "reservations@karembotours.co.ke"],
      href: "mailto:info@karembotours.co.ke",
    },
    {
      icon: MessageCircle,
      title: "Chat on WhatsApp",
      lines: ["+254 722 736 130", "Speak with our team directly"],
      href: "https://wa.me/254722736130",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${SITE_URL}/contact#contactpage`,
        name: "Contact Karembo Tours and Safaris",
        url: `${SITE_URL}/contact`,
        description:
          "Contact Karembo Tours and Safaris to plan a Kenya safari, day trip or personalised cultural travel experience.",
        isPartOf: {
          "@type": "WebSite",
          name: "Karembo Tours",
          url: SITE_URL,
        },
        about: {
          "@type": "LocalBusiness",
          name: "Karembo Tours and Safaris",
          url: SITE_URL,
          telephone: "+254722736130",
          email: "info@karembotours.co.ke",
          image: `${SITE_URL}/gallery/wildebeest-crossing.jpg`,
          address: {
            "@type": "PostalAddress",
            streetAddress: "11th Street Kangawa, Ngong Road",
            addressLocality: "Nairobi",
            addressCountry: "KE",
          },
          areaServed: {
            "@type": "Country",
            name: "Kenya",
          },
        },
      },
    ],
  };

  return (
    <>
      <Seo
        title="Contact Karembo Tours | Request a Kenya Safari Quote"
        description="Plan your Kenya safari with Karembo Tours. Request a personalised quote for wildlife safaris, Nairobi day trips, cultural experiences and tailor-made holidays."
        path="/contact"
        image={HERO}
        type="website"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="relative min-h-[68vh] overflow-hidden bg-[#10271e] text-white">
        <div className="absolute inset-0">
          <img
            src={HERO}
            alt="Elephants crossing the African wilderness on a Kenyan safari"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#091b14]/90 via-[#10271e]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10271e]/75 via-transparent to-black/10" />
        </div>

        <div className="container-edge relative z-10 flex min-h-[68vh] items-end pb-20 pt-36 md:pb-28">
          <div className="max-w-3xl">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-[#c6a66b]" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e3c995]">
                Your journey begins here
              </span>
            </div>

            <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              Let's make
              <br />
              <span className="italic text-[#d6bd8e]">
                Kenya yours.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-white/80 md:text-lg">
              Tell us what you've been dreaming about. We'll help turn your
              ideas into a thoughtfully planned Kenyan adventure.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/75">
              <span className="flex items-center gap-2">
                <MessageCircle size={17} className="text-[#d6bd8e]" />
                Personal assistance
              </span>
              <span className="flex items-center gap-2">
                <Clock3 size={17} className="text-[#d6bd8e]" />
                Response within 24 hours
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact introduction */}
      <section className="bg-[#f7f5ef] py-16 md:py-20">
        <div className="container-edge">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.5fr] lg:gap-20">
            {/* Contact information */}
            <aside>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-9 bg-[#b7975d]" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d754d]">
                  Get in touch
                </span>
              </div>

              <h2 className="font-serif text-4xl leading-tight text-[#18372a] md:text-5xl">
                We're here
                <br />
                <span className="italic text-[#a78a59]">
                  to help.
                </span>
              </h2>

              <p className="mt-5 text-sm leading-8 text-[#788078]">
                Have a question, an idea or a destination in mind? Our team
                is based in Nairobi and ready to help you plan your next
                Kenyan adventure.
              </p>

              <div className="mt-10 space-y-7">
                {contactDetails.map((contact) => {
                  const Icon = contact.icon;

                  const content = (
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#eae6da] text-[#987b4d] transition group-hover:bg-[#18372a] group-hover:text-[#d6bd8e]">
                        <Icon size={20} strokeWidth={1.6} />
                      </div>

                      <div className="min-w-0 pt-1">
                        <h3 className="text-sm font-semibold text-[#18372a]">
                          {contact.title}
                        </h3>

                        {contact.lines.map((line) => (
                          <p
                            key={line}
                            className="mt-1 break-words text-sm leading-relaxed text-[#788078]"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  );

                  return contact.href ? (
                    <a
                      key={contact.title}
                      href={contact.href}
                      target={
                        contact.href.startsWith("https") ? "_blank" : undefined
                      }
                      rel={
                        contact.href.startsWith("https")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="group block"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={contact.title}>{content}</div>
                  );
                })}
              </div>

              <div className="mt-10 border-t border-[#dedbd1] pt-7">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#a18453]">
                  <Sparkles size={15} />
                  Let's plan something memorable
                </div>
              </div>
            </aside>

            {/* Quote form */}
            <div className="relative">
              <div className="absolute -right-3 -top-3 hidden h-24 w-24 border-r border-t border-[#b7975d] md:block" />

              <div className="relative border border-[#e6e2d7] bg-white p-6 shadow-[0_20px_70px_rgba(24,55,42,0.07)] md:p-10 lg:p-12">
                <div className="mb-9 border-b border-[#eae7de] pb-7">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#a18453]">
                    Personalise your adventure
                  </p>

                  <h2 className="font-serif text-3xl text-[#18372a] md:text-4xl">
                    Request your quote
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#788078]">
                    Share a few details about your plans. The more we know,
                    the better we can tailor your experience.
                  </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-8">
                  {/* Personal details */}
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center bg-[#18372a] text-xs font-semibold text-[#d6bd8e]">
                        01
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#18372a]">
                        Your details
                      </h3>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-xs font-semibold text-[#526157]"
                        >
                          Full name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          autoComplete="name"
                          required
                          value={form.name}
                          onChange={update("name")}
                          maxLength={100}
                          placeholder="Your full name"
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-xs font-semibold text-[#526157]"
                        >
                          Email address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={form.email}
                          onChange={update("email")}
                          maxLength={255}
                          placeholder="you@example.com"
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-xs font-semibold text-[#526157]"
                        >
                          Phone number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={update("phone")}
                          maxLength={40}
                          placeholder="+254 ..."
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="country"
                          className="text-xs font-semibold text-[#526157]"
                        >
                          Country of residence
                        </Label>
                        <Input
                          id="country"
                          name="country"
                          autoComplete="country-name"
                          value={form.country}
                          onChange={update("country")}
                          maxLength={80}
                          placeholder="e.g. United Kingdom"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Travel preferences */}
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center bg-[#18372a] text-xs font-semibold text-[#d6bd8e]">
                        02
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#18372a]">
                        Your travel plans
                      </h3>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="travel_dates"
                          className="text-xs font-semibold text-[#526157]"
                        >
                          Preferred travel dates
                        </Label>
                        <Input
                          id="travel_dates"
                          name="travel_dates"
                          value={form.travel_dates}
                          onChange={update("travel_dates")}
                          maxLength={100}
                          placeholder="e.g. June 2027"
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="group_size"
                          className="text-xs font-semibold text-[#526157]"
                        >
                          Number of travellers
                        </Label>
                        <Input
                          id="group_size"
                          name="group_size"
                          value={form.group_size}
                          onChange={update("group_size")}
                          maxLength={40}
                          placeholder="e.g. 2 adults, 1 child"
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="package_interest"
                          className="text-xs font-semibold text-[#526157]"
                        >
                          Package of interest
                        </Label>
                        <select
                          id="package_interest"
                          name="package_interest"
                          value={form.package_interest}
                          onChange={update("package_interest")}
                          className={selectClass}
                        >
                          <option value="">Choose an experience</option>
                          <option value="Custom itinerary">
                            Custom itinerary
                          </option>

                          {tours.map((tour) => (
                            <option key={tour.slug} value={tour.title}>
                              {tour.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="budget"
                          className="text-xs font-semibold text-[#526157]"
                        >
                          Budget per person (USD)
                        </Label>
                        <select
                          id="budget"
                          name="budget"
                          value={form.budget}
                          onChange={update("budget")}
                          className={selectClass}
                        >
                          <option value="">Select your budget</option>
                          <option value="Under $1,000">Under $1,000</option>
                          <option value="$1,000 – $2,500">
                            $1,000 – $2,500
                          </option>
                          <option value="$2,500 – $5,000">
                            $2,500 – $5,000
                          </option>
                          <option value="$5,000+">$5,000+</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Additional information */}
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center bg-[#18372a] text-xs font-semibold text-[#d6bd8e]">
                        03
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#18372a]">
                        Tell us more
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="text-xs font-semibold text-[#526157]"
                      >
                        Describe your dream trip
                      </Label>

                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={update("message")}
                        maxLength={2000}
                        placeholder="Destinations you'd love to visit, experiences you're interested in, accommodation preferences or anything else we should know..."
                        className="min-h-[140px] resize-y rounded-none border-[#dedbd1] bg-white p-4 text-sm leading-7 text-[#18372a] placeholder:text-[#a3a69e] focus-visible:border-[#a18453] focus-visible:ring-1 focus-visible:ring-[#a18453]"
                      />

                      <p className="text-right text-[11px] text-[#a3a69e]">
                        {form.message.length}/2000 characters
                      </p>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="border-t border-[#eae7de] pt-7">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitting}
                      className="h-auto w-full rounded-none bg-[#18372a] px-8 py-5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#294b39] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {submitting ? (
                        <>
                          Sending your request...
                          <span className="ml-3 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        </>
                      ) : (
                        <>
                          Send quote request
                          <Send size={15} className="ml-3" />
                        </>
                      )}
                    </Button>

                    <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-[#899087]">
                      <CheckCircle2
                        size={15}
                        className="mt-0.5 shrink-0 text-[#a18453]"
                      />
                      Your details will be used to respond to your travel
                      inquiry. We aim to get back to you within 24 hours.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-[#18372a] py-20 text-white md:py-24">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-8 -top-12 h-56 w-56 rounded-full border border-white/10" />

        <div className="container-edge relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d2b77e]">
              The adventure is waiting
            </span>

            <h2 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
              Not sure where to start?
              <br />
              <span className="italic text-[#d2b77e]">
                Let's talk.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-white/65">
              You don't need to have every detail figured out. Tell us what
              interests you and we'll help you explore the possibilities.
            </p>

            <a
              href="https://wa.me/254722736130"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 bg-[#c6a66b] px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[#14251d] transition hover:bg-[#ddc18a]"
            >
              <MessageCircle size={17} />
              Chat with us on WhatsApp
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
