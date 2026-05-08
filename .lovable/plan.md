# Plan

## 1. Replace `src/data/parkFees.ts` with the full KWS rate sheet

Rebuild the dataset to cover all parks supplied, with 4 residency categories × adult/child each. New shape:

```ts
export type Residency = "ea_citizen" | "resident" | "non_resident" | "african_citizen";
export type ParkFee = {
  name: string;
  keywords: string[];
  rates: Record<Residency, { adult: number; child: number }>; // USD
  note?: string;
};
```

Populate with all 38 parks from the user's table (Amboseli, Lake Nakuru, Nairobi NP, Tsavo East/West, Meru, Kora, Aberdare, Mt Kenya, Hell's Gate, Longonot, Mt Elgon, Ol Donyo Sabuk, Lake Elementaita, Shimba Hills, Kakamega, Mwea, Ruma, Saiwa Swamp, S. Turkana, Sibiloi, Central/South/Ndere Island, Malka Mari, Chyulu, Marsabit, Tana River, Nairobi Animal Orphanage, Nairobi Safari Walk, Kisumu Impala, Kisite Mpunguti, Watamu, Mombasa, Malindi, Kiunga, Diani Chale marine parks).

Update `ParkFeesTable.tsx` to render the four residency columns (USD values, formatted as `$X.XX`).

## 2. Quote builder (`src/pages/Quote.tsx`) — residency + park fees

Add to the form, below pax inputs:

- **Residency** radio: EA Citizen · Resident · Non-Resident · African Citizen (default Non-Resident).
- **Park entries** multi-select chips listing all parks from `parkFees.ts`, each with:
  - Adults count (defaults to total adults, editable)
  - Children count (defaults to total children, editable)
  - Per-park subtotal preview using selected residency rate.

Live total panel additions:
```
Package base:   price_from × adults + 0.7 × price_from × children
Park fees:      Σ(park.rate[residency].adult × adultsAtPark + child × childrenAtPark)
Add-ons:        unchanged
Total (USD):    sum
```

Generated client PDF gains a "Park entry fees" line-item block (description = park name + "(EA Citizen / Non-Resident / …)", pax = adults+children, amount = computed). Residency shown in trip meta line.

## 3. Regenerate Sarah Montgomery's invoice (no rate column)

New file: `/mnt/documents/Karembo-Invoice-Sarah-Montgomery_v2.pdf` via a one-off Python (reportlab) script, brand-matched to existing PDF.

Changes vs v1:
- Line-items table columns: **Description · Pax · Amount (USD)** — rate column removed.
- Single line: "Nairobi National Park, Elephant Orphanage & Giraffe Centre — Day Trip (Transport + Giraffe Centre entry)" · Pax 6 · USD 310.00.
- Total USD 310.00, status UNPAID, today's date.
- Inclusions / Exclusions blocks unchanged.

Delivered as `<lov-artifact>`.

## 4. Update invoice PDF helper for future reuse

Refactor the line-item rendering in `src/lib/clientQuotePdf.ts` (and the future invoice generator) so the **rate column is optional**: when `showRate=false`, render Description · Pax · Amount only. This keeps quote PDFs detailed but lets invoices hide rates.

## Files

**New**
- `/mnt/documents/Karembo-Invoice-Sarah-Montgomery_v2.pdf`
- `/tmp/gen_invoice_v2.py` (one-off)

**Edited**
- `src/data/parkFees.ts` — full dataset, new structure
- `src/components/ParkFeesTable.tsx` — 4-column residency layout
- `src/pages/Quote.tsx` — residency selector + park-fees picker + totals
- `src/lib/clientQuotePdf.ts` — optional rate column, park-fee line items
- `src/components/PackageDetail` consumers if any rely on old `rows` shape

## Out of scope
- Storing residency/park-fee selections in DB schema (still serialized into `quote_requests.message`).
- Admin invoice generator UI.
- Currency switching.
