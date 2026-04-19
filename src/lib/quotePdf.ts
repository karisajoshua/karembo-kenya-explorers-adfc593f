import jsPDF from "jspdf";
import logoUrl from "@/assets/karembo-logo.png";

const loadLogoDataUrl = async (): Promise<string> => {
  const res = await fetch(logoUrl);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
};

export type QuoteData = {
  name: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  travel_dates?: string | null;
  group_size?: string | null;
  package_interest?: string | null;
  budget?: string | null;
  message?: string | null;
};

export const generateQuotePdf = async (q: QuoteData) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  const BAND_H = 110;

  // Brand band
  doc.setFillColor(59, 36, 23); // #3b2417
  doc.rect(0, 0, W, BAND_H, "F");

  // Logo
  try {
    const dataUrl = await loadLogoDataUrl();
    const logoH = 80;
    const logoW = 80;
    doc.addImage(dataUrl, "PNG", M, (BAND_H - logoH) / 2, logoW, logoH);
  } catch (e) {
    console.error("Logo load failed", e);
  }

  const textX = M + 100;
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("KAREMBO TOURS & SAFARIS", textX, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Dream Your Next Trip — Safari Experiences Designed Around You", textX, 70);
  doc.text("www.karembotours.co.ke", textX, 86);

  let y = 150;
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Quote Request Summary", M, y);
  y += 8;
  doc.setDrawColor(200, 160, 60);
  doc.setLineWidth(2);
  doc.line(M, y, M + 80, y);
  y += 28;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110, 110, 110);
  doc.text(`Submitted: ${new Date().toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}`, M, y);
  y += 24;

  // Client section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(59, 36, 23);
  doc.text("YOUR DETAILS", M, y);
  y += 18;

  const rows: [string, string][] = [
    ["Full name", q.name],
    ["Email", q.email],
    ["Phone", q.phone || "—"],
    ["Country", q.country || "—"],
    ["Travel dates", q.travel_dates || "—"],
    ["Group size", q.group_size || "—"],
    ["Package of interest", q.package_interest || "Custom itinerary"],
    ["Budget per person", q.budget || "—"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  rows.forEach(([k, v]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(110, 110, 110);
    doc.text(`${k}:`, M, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    doc.text(String(v), M + 140, y);
    y += 18;
  });

  if (q.message) {
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 36, 23);
    doc.text("YOUR MESSAGE", M, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(q.message, W - M * 2);
    doc.text(lines, M, y);
    y += lines.length * 14;
  }

  // What's next
  y += 24;
  doc.setFillColor(248, 244, 232);
  doc.rect(M, y - 6, W - M * 2, 70, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(59, 36, 23);
  doc.setFontSize(12);
  doc.text("WHAT HAPPENS NEXT", M + 14, y + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text("Our team will review your request and reply within 24 hours with a", M + 14, y + 32);
  doc.text("personalized itinerary, pricing breakdown, and answers to your questions.", M + 14, y + 46);

  // Footer
  const fy = doc.internal.pageSize.getHeight() - 90;
  doc.setFillColor(59, 36, 23);
  doc.rect(0, fy, W, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CONTACT US", M, fy + 24);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Phone: +254 722 736 130  |  +254 757 223 301", M, fy + 42);
  doc.text("Email: info@karembotours.co.ke  |  reservations@karembotours.co.ke", M, fy + 56);
  doc.text("11th Street Kangawa, Ngong Road, Nairobi, Kenya", M, fy + 70);

  doc.save(`Karembo-Quote-${q.name.replace(/\s+/g, "-")}.pdf`);
};
