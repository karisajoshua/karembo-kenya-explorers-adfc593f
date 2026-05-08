import jsPDF from "jspdf";
import logoUrl from "@/assets/karembo-logo.png";

export const BRAND = {
  primary: [59, 36, 23] as [number, number, number],
  accent:  [200, 160, 60] as [number, number, number],
  cream:   [250, 246, 238] as [number, number, number],
  ink:     [38, 30, 24] as [number, number, number],
  muted:   [120, 110, 100] as [number, number, number],
  hair:    [225, 215, 200] as [number, number, number],
  white:   [255, 255, 255] as [number, number, number],
  red:     [217, 64, 51] as [number, number, number],
  green:   [54, 140, 76] as [number, number, number],
};

export const setFill = (doc: jsPDF, c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
export const setText = (doc: jsPDF, c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
export const setDraw = (doc: jsPDF, c: [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);

export const loadLogo = async (): Promise<{ dataUrl: string; w: number; h: number }> => {
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

export const M = 48;

/** Draws header (logo + right meta). Returns y position below header. */
export const drawHeader = async (
  doc: jsPDF,
  opts: { rightLabel: string; rightValue: string; rightSub?: string; rightSub2?: string }
) => {
  const W = doc.internal.pageSize.getWidth();
  const HEADER_H = 150;
  setFill(doc, BRAND.accent);
  doc.rect(0, HEADER_H, W, 4, "F");
  try {
    const { dataUrl, w, h } = await loadLogo();
    const targetW = 190;
    const targetH = (h / w) * targetW;
    const logoY = (HEADER_H - targetH) / 2;
    doc.addImage(dataUrl, "PNG", M, logoY, targetW, targetH, "karembo-logo", "SLOW");
  } catch (e) { console.error("Logo load failed", e); }

  setText(doc, BRAND.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(opts.rightLabel, W - M, 50, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  setText(doc, BRAND.primary);
  doc.text(opts.rightValue, W - M, 68, { align: "right" });
  setText(doc, BRAND.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  if (opts.rightSub) doc.text(opts.rightSub, W - M, 86, { align: "right" });
  if (opts.rightSub2) doc.text(opts.rightSub2, W - M, 100, { align: "right" });
  setText(doc, BRAND.accent);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("www.karembotours.co.ke", W - M, 122, { align: "right" });
  return HEADER_H;
};

export const drawFooter = (doc: jsPDF, ref: string, refLabel = "Ref") => {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const FOOT_H = 110;
  const fy = H - FOOT_H;
  setFill(doc, BRAND.primary);
  doc.rect(0, fy, W, FOOT_H, "F");
  setFill(doc, BRAND.accent);
  doc.rect(0, fy, W, 3, "F");
  setText(doc, BRAND.white);
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
  doc.text("www.karembotours.co.ke", W - M, fy + 66, { align: "right" });
  setText(doc, BRAND.accent);
  doc.setFontSize(8);
  doc.text(`${refLabel}: ${ref}`, W - M, fy + 80, { align: "right" });
  setText(doc, [200, 190, 175]);
  doc.text("Thank you for choosing Karembo Tours & Safaris.", W - M, fy + 94, { align: "right" });
};
