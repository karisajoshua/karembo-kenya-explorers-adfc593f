import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { LeadCapturePopup } from "@/components/LeadCapturePopup";
import { CategorySuggestPopup } from "@/components/CategorySuggestPopup";

export const Layout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppFloat />
    <LeadCapturePopup />
    <CategorySuggestPopup />
    <ScrollRestoration />
  </div>
);
