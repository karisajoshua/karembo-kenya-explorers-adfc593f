## 1. Re-generate Sarah Montgomery's Quote PDF (match original branding)

The previous Python-generated quote drifted from the brand used in `Karembo-Invoice-Sarah-Montgomery_v2.pdf` (the version Sarah approved). Regenerate as **`Karembo-Quote-Sarah-Montgomery_v2.pdf`** using a one-off Python (reportlab) script that mirrors the v2 invoice layout exactly:

- Same header (logo left, right-aligned QUOTE NUMBER / Issued / Valid / website link)
- Same gold accent rule under the "QUOTE" title
- Same brown footer block with full contact details
- Same "PREPARED FOR" / "TRIP" two-column meta
- Same dark-brown line-items header bar
- Same green/red side-bar Inclusions / Exclusions cards
- Document title pill: **"QUOTE"** (not Invoice)
- Filename starts with **Karembo-Quote-…**

**Content (single line item, no rate column):**

| Description | Pax | Amount (USD) |
|---|---|---|
| Nairobi National Park, Elephant Orphanage & Giraffe Centre — Day Trip (Transport + Giraffe Centre entry) | 6 | 310.00 |

**Total: USD 310.00**

**Inclusions:** Transport, Giraffe Centre entry, English-speaking driver-guide, bottled water
**Exclusions:** Nairobi National Park entry fee, Elephant Orphanage entry fee, personal expenses, travel insurance, tips

No reference rate block, no extra add-on lines — clean and matching the prior invoice's typography.

## 2. Make the Quote page support fully custom trips

`src/pages/Quote.tsx` currently forces a package selection. Update so users can either pick a package OR build a custom trip from scratch.

**Changes:**

- **Package field becomes optional.** Label changes from "Package *" to "Package (optional)". First option: "— Build a custom trip —". Remove the "Please choose a package" guard in `onSubmit`.
- **New "Custom destinations / activities" section** below park entries. Lets the user add any place we don't have in the parks list, with manual pricing:
  - Free-text **Place / activity name**
  - **Pricing mode** toggle: `Per person` or `Flat fee`
  - **Adult rate** + **Child rate** (when per-person), or **Flat amount** (when flat)
  - **Adults** + **Children** counts (default to top-level group size, editable)
  - Live subtotal, remove (X) button
- **New "Custom transport" section** (separate block, since user called it out): same shape as custom destinations but pre-labelled "Transport — <route>", with `Per person` or `Flat (per vehicle)` modes. This handles destinations whose transport rate isn't in the standard add-ons.
- **Totals + line items** include both new sections. Each custom row appears in the generated PDF as its own line item with the entered description.
- **Submit guard:** require either a package OR at least one custom destination/transport row, plus ≥1 adult.
- The supabase `quote_requests.message` summary serializes the custom rows so admin sees them.

**Technical notes:**
- New state: `customItems: { id; label; mode: "perPerson"|"flat"; adult: number; child: number; flat: number; adults: number; children: number; kind: "destination"|"transport" }[]`
- Reuse existing `QuoteLine` type — custom rows convert to one or two lines (adult/child) or single flat line.
- No DB schema change; no changes to `clientQuotePdf.ts` (line items already render arbitrary descriptions).

## Files

**New**
- `/mnt/documents/Karembo-Quote-Sarah-Montgomery_v2.pdf`
- `/tmp/gen_quote_sarah_v2.py`

**Edited**
- `src/pages/Quote.tsx` — optional package, custom destinations + custom transport sections, totals/lines/submit updates

## Out of scope
- Changing `clientQuotePdf.ts` branding (already correct)
- Admin-side custom quote editor
- Persisting custom items in a structured DB column
