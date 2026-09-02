# Update Nairobi & Rift Valley tour pricing

Replace the currently displayed day-trip prices with the new official rate card, and show both the shared (per person) and private (per vehicle) rates.

## New rate card

Shared tours — per person, minimum 4 guests:

| Tour | Duration | Shared pp |
| --- | --- | --- |
| Nairobi National Park Game Drive | 4–5 Hours | USD 40 |
| Nairobi NP + Giraffe Centre | 5–6 Hours | USD 50 |
| Lake Naivasha & Hell's Gate | Full Day (8–9 Hours) | USD 80 |
| Naivasha Boat Ride + Hell's Gate | Full Day (8–9 Hours) | USD 90 |
| Lake Nakuru National Park Safari | Full Day (10–11 Hours) | USD 90 |

Private tours — per vehicle:

| Tour | Duration | Private vehicle |
| --- | --- | --- |
| Nairobi National Park | 4–5 Hours | USD 180 |
| Nairobi NP + Giraffe Centre | 5–6 Hours | USD 220 |
| Lake Naivasha & Hell's Gate | 8–9 Hours | USD 300 |
| Naivasha Boat Ride + Hell's Gate | 8–9 Hours | USD 330 |
| Lake Nakuru National Park | 10–11 Hours | USD 350 |
| Lake Nakuru + Lake Naivasha | 11–12 Hours | USD 400 |

## What changes

1. Existing packages updated with the new price and duration:
   - `nairobi-national-park` → USD 40 pp / USD 180 private, 4–5 Hours
   - `nairobi-park-giraffe` → USD 50 pp / USD 220 private, 5–6 Hours
   - `hells-gate-naivasha-boat` → USD 90 pp / USD 330 private, 8–9 Hours (Naivasha boat ride + Hell's Gate)
2. New packages added (currently missing from the site):
   - Lake Naivasha & Hell's Gate — USD 80 pp / USD 300 private, 8–9 Hours
   - Lake Nakuru National Park Safari — USD 90 pp / USD 350 private, 10–11 Hours
   - Lake Nakuru + Lake Naivasha — private only USD 400, 11–12 Hours
   Each gets a summary, highlights, itinerary, inclusions/exclusions and a matching photo from the gallery.
3. Inclusions standardised on these tours: professional driver-guide, hotel pickup & drop-off within Nairobi, bottled water, Wi-Fi where available, comfortable safari vehicle. Exclusion: park & attraction entrance fees unless stated.
4. Cards and detail pages show `From USD 40 per person (min 4 guests)` plus a `Private: USD 180 per vehicle` line where a private rate exists. Package cards keep their existing look, just with the extra private-rate line.
5. Packages without a new rate (Masai Mara, Amboseli, cultural, combos, Bomas, Karen Blixen, coffee farm, Longonot, orphanage combos) are left untouched.

## Technical notes

- Migration adds two nullable columns to `packages`: `price_private` (numeric) and `min_guests` (integer, default 4 for shared tours), then updates/inserts the rows above.
- Regenerate `src/integrations/supabase/types.ts` after the migration.
- Update `PackageCard`, `PackageDetail`, `MegaMenu` and the admin `PackageEdit` form to read/write the two new fields.
- Sort order adjusted so the Nairobi tours stay first on the homepage, followed by Naivasha/Hell's Gate then Nakuru.
