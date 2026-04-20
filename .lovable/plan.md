
## Plan: New logo + price updates + Nairobi-first ordering

### 1. Replace the logo everywhere
Copy the uploaded leopard logo to `src/assets/karembo-logo.png` (overwrites the existing import used across the site). Every component already imports from this path, so the swap is automatic in:
- Header (`src/components/layout/Header.tsx`)
- Footer (`src/components/layout/Footer.tsx`)
- Quote PDF (`src/lib/quotePdf.ts`)
- Admin Layout / Login

Also overwrite `public/karembo-logo.png` (used in favicon / OG meta) so the browser tab and social shares update too.

Since the new logo is wider (landscape) than the previous square mark, I'll bump the header logo width from ~h-12 to a wider aspect (`h-12 w-auto` already auto-scales) and verify alignment in Header + Footer + PDF (PDF needs `logoW` widened from 100 → 180 to match the new aspect).

### 2. Update day-trip package prices (DB updates)

| Slug | New `price_from` (USD, non-resident adult) |
|---|---|
| `nairobi-national-park` | 120 |
| `nairobi-park-orphanage` | 140 |
| `nairobi-park-orphanage-giraffe` | 155 |
| `nairobi-park-giraffe` (NEW — create) | 135 |
| `hells-gate-naivasha-boat` | keep (Hell's Gate gate fee $37 + boat — package price stays competitive) |

Plus: append a structured **"Park Fees"** block to the `summary` (or a new bottom section in `PackageDetail.tsx`) for each Nairobi-area / safari package, so visitors see the full Non-Resident / Citizen / Resident / Child breakdown for the parks visited.

### 3. New package: "Nairobi NP + Giraffe Centre"
Doesn't exist yet — insert into `packages`:
- Slug: `nairobi-park-giraffe`
- Category: `day-trip`
- Duration: 6 Hours
- Price: $135 adult / $80 child
- Image: reuse `/day-trips/giraffe-centre.jpg`
- Full summary, highlights, itinerary, inclusions, exclusions

### 4. Park fees reference table on detail pages
Add a new component `<ParkFeesTable />` rendered on `PackageDetail.tsx` for safari/day-trip packages. Data lives in a small TypeScript file `src/data/parkFees.ts` keyed by park name (Nairobi NP, Mt Longonot, Hell's Gate, Amboseli, Tsavo East). Each package's row in DB gets a new optional `parks: string[]` mapping — but to avoid a schema change, I'll instead match by keywords in the title/highlights (simpler, no migration). Shows a clean 3-column table: Non-Resident / Citizen / Resident, with Adult/Child rows.

### 5. Nairobi-first ordering on Home → "Our Popular Safari Packages"
Currently `Home.tsx` shows the Safaris section ordered by `sort_order`. Update the DB `sort_order` so the 4 Nairobi day-trip packages surface first **on the home featured strip**, OR (cleaner) change the Home query to fetch a **mixed featured list** that prioritises the Nairobi day-trips, then fills remaining slots with top safaris.

Approach: bump `sort_order` of the 4 Nairobi packages to 1-4 within their category, AND change the Home "Popular Safari Packages" section to pull from BOTH `category=day-trip` (Nairobi ones first) and `category=safari`, capped at 6 cards, Nairobi first.

### 6. Files
**Edit:**
- `src/assets/karembo-logo.png` (replace)
- `public/karembo-logo.png` (replace)
- `src/lib/quotePdf.ts` (widen logo dimensions)
- `src/components/layout/Header.tsx` (verify width)
- `src/pages/Home.tsx` (mixed featured query, Nairobi-first)
- `src/pages/PackageDetail.tsx` (mount `<ParkFeesTable />`)

**Create:**
- `src/data/parkFees.ts` (structured fee data)
- `src/components/ParkFeesTable.tsx`

**DB:**
- UPDATE prices on 3 existing Nairobi packages
- INSERT new `nairobi-park-giraffe` package
- UPDATE `sort_order` to put Nairobi packages first

### Out of scope
- Currency switcher (USD ↔ KES) — can add later
- Resident verification flow — front-end shows fees as reference only
- Updating every existing summary text body (only price + park fee table get touched)

### Notes
- Card price badge will continue to show "From $X" using the new `price_from` (non-resident adult). Child pricing & resident pricing live in the new park-fees table on the detail page.
- Hell's Gate package keeps its current $180 (it's a full-day combo with boat ride + transport, not just gate fees).
