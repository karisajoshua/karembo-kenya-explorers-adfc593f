## 1. Generate Sarah Montgomery's invoice now (one-off, downloadable PDF)

Run a Node script that uses the same branding as the existing quote PDF (`src/lib/quotePdf.ts` palette + logo) to produce:

**File:** `/mnt/documents/Karembo-Invoice-Sarah-Montgomery.pdf`

Contents:
- Header: Karembo logo (white background, gold underline) + "INVOICE" label, invoice no. `KT-INV-{timestamp}`, issue date (today), status **UNPAID**.
- Bill To: Sarah Montgomery.
- Tour: "Nairobi National Park, Elephant Orphanage & Giraffe Centre — Day Trip".
- Line items table:
  | Description | Pax | Rate | Amount |
  | Day trip package (transport + Giraffe Centre entry) | 6 | USD 51.67 | USD 310.00 |
- Subtotal / Total: **USD 310.00**.
- Inclusions box: Transport, Giraffe Centre entry fee.
- Exclusions box: Nairobi National Park entry fee, Elephant Orphanage entry fee (payable directly at the gate).
- Payment details placeholder + footer matching the quote PDF (address, phone, email, www).

Delivered as a `<lov-artifact>` so the user can download immediately.

## 2. Self-service Quote Builder on the website

### New page `/quote` (calculator + PDF)

Linked from the header CTA "Get a Quote" and from each package card.

**Form fields**
- Full name, email, phone (optional), country (optional).
- Package (select from `packages` table where `published = true`, plus "Custom itinerary").
- Number of adults, number of children (children priced at 70% of adult rate).
- Travel start date (shadcn date picker).
- Number of days (defaults to package duration; editable for custom).
- Optional add-ons checkboxes: Airport transfer (+USD 40), Park fees included (toggle, no auto price — shown as "to be quoted"), Single-room supplement (+15%).
- Notes textarea.

**Live total panel (sticky on desktop)**
```
Base:        price_from × adults + price_from × 0.7 × children
Add-ons:     sum of selected add-ons
Total (USD): formatted, updates as user types
```
Disclaimer: "Estimate based on standard package rates. Final quote confirmed by our team within 24 hours."

**On submit**
1. Validate with zod (same patterns as Contact.tsx).
2. Insert into `quote_requests` (existing table — reuse, store the computed estimate inside `message`).
3. Generate branded **Quote PDF** (new `src/lib/clientQuotePdf.ts`, same palette/header/footer as `quotePdf.ts` but with proper line-item table, subtotal, total, validity 14 days, T&Cs).
4. Trigger browser download + success toast.

### Shared PDF helpers
Refactor brand constants (palette, header renderer, footer renderer, logo loader) from `quotePdf.ts` into `src/lib/pdfBrand.ts` so both the existing acknowledgement PDF and the new client quote PDF reuse them. No visual change to existing PDF.

### Routing / nav
- Add route `{ path: "/quote", element: <Quote /> }` in `src/App.tsx`.
- Header: add "Get a Quote" button (accent style) next to Contact.
- `PackageCard`: add secondary button "Build Quote" linking to `/quote?package={slug}` (pre-selects).

### SEO
`<Seo title="Build Your Kenya Safari Quote — Karembo Tours" description="..." path="/quote" />` plus `Service` JSON-LD.

## 3. Files touched

**New**
- `src/pages/Quote.tsx`
- `src/lib/pdfBrand.ts`
- `src/lib/clientQuotePdf.ts`
- `/mnt/documents/Karembo-Invoice-Sarah-Montgomery.pdf` (generated artifact)

**Edited**
- `src/App.tsx` — add `/quote` route.
- `src/components/layout/Header.tsx` — add "Get a Quote" CTA.
- `src/components/PackageCard.tsx` — add "Build Quote" link.
- `src/lib/quotePdf.ts` — refactor to import shared brand helpers (no visual change).

No database schema changes (reusing existing `packages` and `quote_requests`).

## Out of scope
- Storing generated quotes/invoices in the database.
- Online payment of invoices.
- Admin invoice generator UI (can be a follow-up).
