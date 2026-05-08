import jsPDF from "jspdf";
import { BRAND, M, drawHeader, drawFooter, setFill, setText, setDraw } from "./pdfBrand";

export type QuoteLine = { description: string; pax: number; rate: number };

export type ClientQuoteData = {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  packageTitle: string;
  travelDate?: string;
  days?: number;
  adults: number;
  children: number;
  lines: QuoteLine[];     // already computed
  notes?: string;
  inclusions?: string[];
  exclusions?: string[];
};

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const generateClientQuotePdf = async (q: ClientQuoteData) => {
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  const ref = `KT-Q-${Date.now().toString().slice(-8)}`;
  const today = new Date();
  const valid = new Date(today.getTime() + 14 * 86400000);
  const dateStr = today.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const validStr = valid.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  const HEADER_H = await drawHeader(doc, {
    rightLabel: "QUOTE NUMBER",
    rightValue: ref,
    rightSub: `Issued: ${dateStr}`,
    rightSub2: `Valid until: ${validStr}`,
  });

  let y = HEADER_H + 50;
  setText(doc, BRAND.primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("QUOTE", M, y);

  // Estimate pill
  const pillW = 110, pillH = 24;
  setFill(doc, BRAND.accent);
  doc.roundedRect(W - M - pillW, y - 18, pillW, pillH, 12, 12, "F");
  setText(doc, BRAND.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ESTIMATE", W - M - pillW / 2, y - 2, { align: "center" });

  y += 8;
  setDraw(doc, BRAND.accent);
  doc.setLineWidth(3);
  doc.line(M, y, M + 60, y);

  // Client + Trip
  y += 28;
  setText(doc, BRAND.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("PREPARED FOR", M, y);
  doc.text("TRIP", W / 2 + 10, y);
  y += 16;
  setText(doc, BRAND.primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(q.name, M, y);
  const titleLines = doc.splitTextToSize(q.packageTitle, W / 2 - 30);
  doc.setFontSize(11);
  let ty = y;
  (titleLines as string[]).forEach((line) => { doc.text(line, W / 2 + 10, ty); ty += 14; });
  setText(doc, BRAND.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  let by = y + 14;
  if (q.email) { doc.text(q.email, M, by); by += 12; }
  if (q.phone) { doc.text(q.phone, M, by); by += 12; }
  if (q.country) { doc.text(q.country, M, by); by += 12; }
  const meta = [
    q.travelDate ? `Travel: ${q.travelDate}` : "",
    q.days ? `${q.days} day${q.days > 1 ? "s" : ""}` : "",
    `${q.adults} adult${q.adults !== 1 ? "s" : ""}${q.children > 0 ? ` + ${q.children} child${q.children > 1 ? "ren" : ""}` : ""}`,
  ].filter(Boolean).join("  ·  ");
  doc.text(meta, W / 2 + 10, ty);

  y = Math.max(by, ty + 14) + 16;

  // Line items table
  const colW = W - M * 2;
  setFill(doc, BRAND.primary);
  doc.rect(M, y, colW, 26, "F");
  setText(doc, BRAND.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("DESCRIPTION", M + 12, y + 17);
  doc.text("PAX", M + 300, y + 17);
  doc.text("RATE", M + 360, y + 17);
  doc.text("AMOUNT (USD)", W - M - 12, y + 17, { align: "right" });
  y += 26;

  let subtotal = 0;
  q.lines.forEach((ln, i) => {
    const amount = ln.pax * ln.rate;
    subtotal += amount;
    const rowH = 32;
    if (i % 2 === 0) {
      setFill(doc, BRAND.cream);
      doc.rect(M, y, colW, rowH, "F");
    }
    setText(doc, BRAND.ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    const descLines = doc.splitTextToSize(ln.description, 270);
    doc.text(descLines[0] ?? "", M + 12, y + 19);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(String(ln.pax), M + 300, y + 19);
    doc.text(fmt(ln.rate), M + 360, y + 19);
    doc.setFont("helvetica", "bold");
    doc.text(fmt(amount), W - M - 12, y + 19, { align: "right" });
    y += rowH;
  });

  y += 16;
  setText(doc, BRAND.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Subtotal", W - M - 110, y);
  setText(doc, BRAND.ink);
  doc.text(`USD ${fmt(subtotal)}`, W - M - 12, y, { align: "right" });
  y += 14;

  // Total bar
  setFill(doc, BRAND.primary);
  doc.rect(W - M - 240, y, 240, 34, "F");
  setText(doc, BRAND.accent);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TOTAL ESTIMATE", W - M - 230, y + 22);
  setText(doc, BRAND.white);
  doc.setFontSize(16);
  doc.text(`USD ${fmt(subtotal)}`, W - M - 12, y + 23, { align: "right" });
  y += 50;

  // Inclusions / exclusions
  if ((q.inclusions && q.inclusions.length) || (q.exclusions && q.exclusions.length)) {
    const boxW = (colW - 16) / 2;
    const lineH = 14;
    const incH = 24 + (q.inclusions?.length ?? 0) * lineH + 14;
    const excH = 24 + (q.exclusions?.length ?? 0) * lineH + 14;
    const boxH = Math.max(incH, excH, 70);
    if (q.inclusions?.length) {
      setFill(doc, BRAND.cream);
      doc.roundedRect(M, y, boxW, boxH, 6, 6, "F");
      setFill(doc, BRAND.green);
      doc.rect(M, y, 4, boxH, "F");
      setText(doc, BRAND.primary);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("INCLUSIONS", M + 14, y + 18);
      setText(doc, BRAND.ink);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      let iy = y + 36;
      q.inclusions.forEach((it) => { doc.text(`•  ${it}`, M + 14, iy); iy += lineH; });
    }
    if (q.exclusions?.length) {
      const x2 = M + boxW + 16;
      setFill(doc, BRAND.cream);
      doc.roundedRect(x2, y, boxW, boxH, 6, 6, "F");
      setFill(doc, BRAND.red);
      doc.rect(x2, y, 4, boxH, "F");
      setText(doc, BRAND.primary);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("EXCLUSIONS", x2 + 14, y + 18);
      setText(doc, BRAND.ink);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      let iy = y + 36;
      q.exclusions.forEach((it) => { doc.text(`•  ${it}`, x2 + 14, iy); iy += lineH; });
    }
    y += boxH + 18;
  }

  // Notes
  if (q.notes) {
    if (y + 80 > H - 160) { doc.addPage(); y = 60; }
    setText(doc, BRAND.primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("YOUR NOTES", M, y);
    y += 14;
    const noteLines = doc.splitTextToSize(q.notes, colW - 24);
    const nh = noteLines.length * 14 + 22;
    setFill(doc, BRAND.cream);
    doc.roundedRect(M, y, colW, nh, 6, 6, "F");
    setFill(doc, BRAND.accent);
    doc.rect(M, y, 4, nh, "F");
    setText(doc, BRAND.ink);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.text(noteLines, M + 16, y + 16);
    y += nh + 16;
  }

  // Disclaimer
  if (y > H - 200) { doc.addPage(); y = 60; }
  setText(doc, BRAND.muted);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  const disc = doc.splitTextToSize(
    "This is an automated estimate based on standard package rates. A Karembo travel designer will personally confirm availability, exact pricing, and tailor your itinerary within 24 hours. Prices are per person, USD, valid for 14 days. Park entry fees may apply where not listed.",
    colW
  );
  doc.text(disc, M, y);

  drawFooter(doc, ref, "Quote");
  doc.save(`Karembo-Quote-${q.name.replace(/\s+/g, "-")}.pdf`);
};
