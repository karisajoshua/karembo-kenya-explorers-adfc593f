import jsPDF from "jspdf";
import logoUrl from "@/assets/karembo-logo.png";

/** Load the logo as a high-resolution PNG dataURL so jsPDF embeds it crisply. */
const loadLogo = async (): Promise<{ dataUrl: string; w: number; h: number }> => {
  const res = await fetch(logoUrl);
  const blob = await res.blob();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
  const dims = await new Promise<{ w: number; h: number }>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = reject;
    img.src = dataUrl;
  });
  return { dataUrl, ...dims };
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

// Brand palette (RGB)
const BRAND = {
  primary: [59, 36, 23] as [number, number, number],      // deep brown
  accent:  [200, 160, 60] as [number, number, number],    // gold
  cream:   [250, 246, 238] as [number, number, number],
  ink:     [38, 30, 24] as [number, number, number],
  muted:   [120, 110, 100] as [number, number, number],
  hair:    [225, 215, 200] as [number, number, number],
};

const setFill = (doc: jsPDF, c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
const setText = (doc: jsPDF, c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
const setDraw = (doc: jsPDF, c: [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);

export const generateQuotePdf = async (q: QuoteData) => {
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;

  // ─── HEADER BAND ────────────────────────────────────────────────────────────
  const HEADER_H = 150;
  setFill(doc, BRAND.primary);
  doc.rect(0, 0, W, HEADER_H, "F");

  // Gold underline accent
  setFill(doc, BRAND.accent);
  doc.rect(0, HEADER_H, W, 4, "F");

  // Logo — preserve aspect ratio, render at high fidelity
  let logoBottom = M + 80;
  try {
    const { dataUrl, w, h } = await loadLogo();
    const targetW = 170;
    const targetH = (h / w) * targetW;
    const logoY = (HEADER_H - targetH) / 2;
    // SLOW = better quality; explicit aliasing off via PNG
    doc.addImage(dataUrl, "PNG", M, logoY, targetW, targetH, "karembo-logo", "SLOW");
    logoBottom = logoY + targetH;
  } catch (e) {
    console.error("Logo load failed", e);
  }

  // Right-side header meta (date + ref)
  const ref = `KT-${Date.now().toString().slice(-8)}`;
  const dateStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  setText(doc, [255, 255, 255]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("QUOTE REFERENCE", W - M, 50, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  setText(doc, BRAND.accent);
  doc.text(ref, W - M, 68, { align: "right" });
  setText(doc, [255, 255, 255]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(dateStr, W - M, 86, { align: "right" });
  doc.setFontSize(8);
  doc.setTextColor(220, 210, 195);
  doc.text("www.karembotours.co.ke", W - M, 110, { align: "right" });

  // ─── TITLE ──────────────────────────────────────────────────────────────────
  let y = HEADER_H + 50;
  setText(doc, BRAND.primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("Your Safari Quote Request", M, y);

  y += 8;
  setDraw(doc, BRAND.accent);
  doc.setLineWidth(3);
  doc.line(M, y, M + 60, y);

  y += 28;
  setText(doc, BRAND.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const intro = `Hi ${q.name.split(" ")[0]}, thank you for choosing Karembo Tours & Safaris. Below is a summary of the details you shared. Our travel designers will craft a personalised itinerary and reply within 24 hours.`;
  const introLines = doc.splitTextToSize(intro, W - M * 2);
  doc.text(introLines, M, y);
  y += introLines.length * 14 + 18;

  // ─── DETAILS CARD ───────────────────────────────────────────────────────────
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

  const cardX = M;
  const cardW = W - M * 2;
  const rowH = 26;
  const cardHeaderH = 32;
  const cardH = cardHeaderH + rows.length * rowH + 12;

  // Card shadow + body
  setFill(doc, BRAND.cream);
  doc.roundedRect(cardX, y, cardW, cardH, 6, 6, "F");

  // Card header strip
  setFill(doc, BRAND.primary);
  doc.roundedRect(cardX, y, cardW, cardHeaderH, 6, 6, "F");
  // Mask bottom corners of header so only top is rounded
  setFill(doc, BRAND.primary);
  doc.rect(cardX, y + cardHeaderH - 8, cardW, 8, "F");

  setText(doc, [255, 255, 255]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("YOUR TRIP DETAILS", cardX + 16, y + 21);

  let ry = y + cardHeaderH + 8;
  rows.forEach(([k, v], i) => {
    if (i % 2 === 1) {
      doc.setFillColor(244, 238, 226);
      doc.rect(cardX + 1, ry - 14, cardW - 2, rowH, "F");
    }
    setText(doc, BRAND.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(k.toUpperCase(), cardX + 16, ry);
    setText(doc, BRAND.ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const valLines = doc.splitTextToSize(String(v), cardW - 200);
    doc.text(valLines[0] ?? "—", cardX + 180, ry);
    ry += rowH;
  });

  y += cardH + 22;

  // ─── MESSAGE BLOCK ──────────────────────────────────────────────────────────
  if (q.message) {
    setText(doc, BRAND.primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("YOUR MESSAGE", M, y);
    y += 14;

    const msgLines = doc.splitTextToSize(q.message, W - M * 2 - 24);
    const msgH = msgLines.length * 14 + 22;
    setFill(doc, BRAND.cream);
    doc.roundedRect(M, y, W - M * 2, msgH, 6, 6, "F");
    // Left accent bar
    setFill(doc, BRAND.accent);
    doc.rect(M, y, 4, msgH, "F");

    setText(doc, BRAND.ink);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.text(msgLines, M + 16, y + 16);
    y += msgH + 22;
  }

  // ─── WHAT HAPPENS NEXT ──────────────────────────────────────────────────────
  const stepsH = 110;
  if (y + stepsH > H - 140) {
    doc.addPage();
    y = 60;
  }
  setText(doc, BRAND.primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("What Happens Next", M, y);
  y += 6;
  setDraw(doc, BRAND.accent);
  doc.setLineWidth(2);
  doc.line(M, y, M + 40, y);
  y += 18;

  const steps = [
    ["1", "Review", "Our team reviews your request within a few hours."],
    ["2", "Design", "We craft a tailored itinerary with options & pricing."],
    ["3", "Reply", "You receive a detailed quote within 24 hours by email."],
  ];
  const stepW = (W - M * 2 - 24) / 3;
  steps.forEach(([n, title, body], i) => {
    const x = M + i * (stepW + 12);
    setFill(doc, BRAND.cream);
    doc.roundedRect(x, y, stepW, 78, 6, 6, "F");
    // Number badge
    setFill(doc, BRAND.accent);
    doc.circle(x + 18, y + 22, 11, "F");
    setText(doc, [255, 255, 255]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(n, x + 18, y + 26, { align: "center" });
    // Title + body
    setText(doc, BRAND.primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title, x + 38, y + 26);
    setText(doc, BRAND.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const bl = doc.splitTextToSize(body, stepW - 20);
    doc.text(bl, x + 12, y + 48);
  });

  // ─── FOOTER ─────────────────────────────────────────────────────────────────
  const FOOT_H = 110;
  const fy = H - FOOT_H;
  setFill(doc, BRAND.primary);
  doc.rect(0, fy, W, FOOT_H, "F");
  setFill(doc, BRAND.accent);
  doc.rect(0, fy, W, 3, "F");

  setText(doc, [255, 255, 255]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("KAREMBO TOURS & SAFARIS", M, fy + 30);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setText(doc, BRAND.accent);
  doc.text("Dream Your Next Trip — Safari Experiences Designed Around You", M, fy + 44);

  setText(doc, [235, 225, 210]);
  doc.setFontSize(9);
  doc.text("11th Street Kangawa, Ngong Road, Nairobi, Kenya", M, fy + 66);
  doc.text("+254 722 736 130   |   +254 757 223 301", M, fy + 80);
  doc.text("info@karembotours.co.ke   |   reservations@karembotours.co.ke", M, fy + 94);

  // Right column in footer
  setText(doc, [235, 225, 210]);
  doc.setFontSize(9);
  doc.text("www.karembotours.co.ke", W - M, fy + 66, { align: "right" });
  setText(doc, BRAND.accent);
  doc.setFontSize(8);
  doc.text(`Quote Ref: ${ref}`, W - M, fy + 80, { align: "right" });
  setText(doc, [200, 190, 175]);
  doc.text("This is a quote request acknowledgement, not a booking confirmation.", W - M, fy + 94, { align: "right" });

  doc.save(`Karembo-Quote-${q.name.replace(/\s+/g, "-")}.pdf`);
};
