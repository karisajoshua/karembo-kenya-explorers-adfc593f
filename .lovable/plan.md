
## Plan: Wire uploaded images to Day Trips & add Partners section

### 1. Day Trips images (first 4 uploads → matching packages)
Upload to `public/day-trips/` and assign via DB UPDATE to the matching package's `image` column:

| Upload | Package slug | New image path |
|---|---|---|
| `hells_gate.jpg` | `hells-gate-naivasha-boat` | `/day-trips/hells-gate.jpg` |
| `coffer_farm.jpg` | `fairview-coffee-farm` | `/day-trips/coffee-farm.jpg` |
| `giraffe_centre.jpg` | `nairobi-park-orphanage-giraffe` | `/day-trips/giraffe-centre.jpg` |
| `karen_Blixen.jpg` | (Karen Blixen day trip — find existing slug, else attach to `nairobi-park-orphanage`) | `/day-trips/karen-blixen.jpg` |

Will first query `packages` where `category='day-trip'` to confirm slugs and decide best mapping for the Karen Blixen image (likely an existing `karen-blixen` package).

### 2. New "Proud Members & Partners" section (uploads 5-8)
Copy logos to `public/partners/`:
- `KATO_lOGO.png` → KATO (Kenya Association of Tour Operators)
- `Magical_Kenya.jpg` → Magical Kenya / Kenya Tourism Board
- `Tourism_regulatory.png` → Tourism Regulatory Authority
- `trip_advisor.png` → TripAdvisor

Add a new section to `src/pages/Home.tsx` (placed above Footer, below existing content):
- Heading: "Proud Members & Partners"
- Subtitle: short trust line
- Responsive grid (4 cols desktop, 2 mobile) with grayscale → color hover, white card background, consistent logo height (~64px), proper alt text

### 3. Files
- DB: `UPDATE packages SET image=... WHERE slug=...` (4 rows)
- Copy: 4 day-trip JPGs → `public/day-trips/`, 4 logos → `public/partners/`
- Edit: `src/pages/Home.tsx` (add Partners section)

### Note
Your message ends with "then" — looks cut off. I'll proceed with the two clear asks above; if there was a third part, send it and I'll add it.
