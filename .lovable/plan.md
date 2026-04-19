

The user uploaded 10 safari/wildlife photos and wants them:
1. Used in convenient sections across the site
2. To **replace** the existing gallery images

Plan:

## 1. Copy uploaded images to project
Copy all 10 images to `src/assets/uploads/` with descriptive names:
- `elephant-crossing.jpg` (elephant + safari vehicles)
- `elephant-tusks.jpg` (close-up tusked elephant)
- `safari-binoculars.jpg` (man with binoculars + zebras)
- `zebra-portrait.jpg`
- `wildebeest-crossing.jpg` (river crossing — Great Migration)
- `elephant-grass.jpg`
- `rhinos-pair.jpg`
- `lion-male.jpg`
- `rhino-waterhole.jpg`
- `lioness-resting.jpg`

Also copy to `public/gallery/` so they get stable public URLs that can be stored in the `gallery_images` DB table.

## 2. Replace gallery DB content
Run a migration that:
- `DELETE FROM gallery_images` (clears existing seeded Unsplash images)
- `INSERT` 10 new rows pointing to `/gallery/<filename>.jpg` with appropriate captions and categories (Wildlife / Landscapes), in sort order matching the list above

## 3. Use images in convenient site sections
- **Home hero / featured strip** — use `wildebeest-crossing.jpg` (Great Migration) as a strong hero or feature image
- **Home "Why Karembo" / experiences band** — pair `safari-binoculars.jpg` and `elephant-crossing.jpg`
- **About page story image** — use `lion-male.jpg` or `lioness-resting.jpg`
- **Safaris page hero** — `elephant-tusks.jpg`
- **Day Trips hero** — keep current (these are wild-park shots, better suited to Safaris)

Implementation approach: update the hardcoded `HERO`/section image URLs in `Home.tsx`, `About.tsx`, `Safaris.tsx` to import from `@/assets/uploads/`.

## 4. Files to change
- `supabase/migrations/<new>.sql` — clear + reseed `gallery_images`
- `src/pages/Home.tsx` — swap 2 section images
- `src/pages/About.tsx` — swap story image
- `src/pages/Safaris.tsx` — swap hero image
- New copied assets under `src/assets/uploads/` and `public/gallery/`

## Out of scope
- Re-cropping or compressing images (used as-is)
- Touching admin Site Images (admin can still override via dashboard later)
- Adding more uploads (user said they'll add more later)

