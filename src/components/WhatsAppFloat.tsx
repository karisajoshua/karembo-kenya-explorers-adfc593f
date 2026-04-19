import { MessageCircle } from "lucide-react";

export const WhatsAppFloat = () => (
  <a
    href="https://wa.me/254722736130?text=Hello%20Karembo%20Tours%2C%20I%27d%20like%20to%20enquire%20about%20a%20safari."
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(142_70%_40%)] text-white shadow-elegant hover:scale-110 transition-transform"
  >
    <MessageCircle className="h-7 w-7" />
  </a>
);
