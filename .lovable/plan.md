

## Plan: Add new day-trip packages + switch pages to live DB data

### Findings
1. **Day Trips page (and Safaris/Combo/Cultural/Home) still read from static `src/data/tours.ts`** — not the database. That's why earlier image/content updates didn't show on the front-end. The MegaMenu was switched to DB but the listing pages weren't.
2. **Existing packages** already cover most of the screenshots, but with different naming/scope. Comparing screenshots → DB:

| Screenshot package | Status in DB |
|---|---|
| Hells Gate NP + Lake Naivasha boat ride | **MISSING** — add |
| Fairview Coffee Farm Tour | **MISSING** — add |
| Nairobi NP + Elephant Orphanage + Giraffe Centre | **MISSING** as combined trio — add (have separate ones) |
| Nairobi NP + Elephant Orphanage | **MISSING** as pair — add |
| Day Tour Nairobi National Park | exists as `nairobi-national-park` — keep |

### What I'll do

**1. Add 4 new day-trip packages to DB** with researched competitive Kenya market pricing (per person, small group):

| Slug | Title | Duration | Price (USD) | Image (from gallery) |
|---|---|---|---|---|
| `hells-gate-naivasha-boat` | Hell's Gate NP & Lake Naivasha Boat Ride | 1 Day | 180 | rhino-waterhole.jpg |
| `fairview-coffee-farm` | Fairview Coffee Farm Tour | 1 Day | 120 | elephant-grass.jpg (closest fit; or upload coffee shot later) |
| `nairobi-park-orphanage-giraffe` | Nairobi NP, Elephant Orphanage & Giraffe Centre | 7 Hours | 195 | elephant-closeup-vehicle.jpg |
| `nairobi-park-orphanage` | Nairobi NP & Elephant Orphanage | 5 Hours | 150 | wildebeest-herd-mara.jpg → switch to a buffalo/park shot from gallery |

Each gets: full summary, highlights, inclusions, exclusions, sort_order. Pricing benchmarked against Viator, Gracepatt ($225), Kenya Wild Parks ($150), Kitano, Powertraveller ($90) — set just under competitor average for competitiveness.

**2. Switch all listing pages from static `tours.ts` → live `packages` table**
- Refactor `Safaris.tsx`, `DayTrips.tsx`, `Combo.tsx`, `Cultural.tsx`, `Home.tsx` to fetch from Supabase (same pattern already used by `MegaMenu.tsx`)
- Update `PackageCard.tsx` to accept the DB shape (`price_from`, `image`, `summary` instead of `priceFrom`, `shortDescription`)
- `PackageDetail.tsx` already fetches from DB — no change needed
- Keep `tours.ts` for fallback typing only (or delete usage)

**3. Day Trips image mapping** — ensure each card uses the gallery image whose subject matches the destination (Nairobi park trips → buffalo/rhino shots, Naivasha → hippo/water shots, etc.). Done via the `image` column already set per row.

### Out of scope
- Uploading new coffee/giraffe-specific images (will reuse closest gallery match; user can swap via admin later)
- Redesigning the card UI — the existing PackageCard styling stays

### Files to change
- DB: insert 4 rows into `packages`
- Edit: `src/pages/Safaris.tsx`, `DayTrips.tsx`, `Combo.tsx`, `Cultural.tsx`, `Home.tsx`, `src/components/PackageCard.tsx`

