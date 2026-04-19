
Switch the gallery from uniform square tiles to a Pinterest-style masonry layout that preserves each image's natural aspect ratio.

## Approach

Use a CSS multi-column layout (the simplest, most reliable masonry technique — no extra library needed):

- Container: `columns-2 md:columns-3 lg:columns-4` with `gap-4`
- Each item: `break-inside-avoid mb-4` so images don't split across columns
- Image: `w-full h-auto` — natural aspect ratio preserved (portrait stays tall, landscape stays wide)

## Changes to `src/pages/Gallery.tsx`

1. Replace the current grid:
   ```
   grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3
   ```
   with a CSS columns container:
   ```
   columns-2 md:columns-3 lg:columns-4 gap-4
   ```

2. Replace each tile:
   - Remove `aspect-square` and `object-cover`
   - Wrap in `mb-4 break-inside-avoid` so spacing works in column flow
   - Image becomes `w-full h-auto` — keeps the original shape (portrait, landscape, square)

3. Hover overlay: keep the caption-on-hover gradient, but adapt it to fit the natural image shape (absolute inset-0 still works).

4. Filter pills + lightbox: unchanged.

## Out of scope
- No new library (avoid `react-masonry-css` — Tailwind columns is enough)
- No image cropping or resizing
- Admin gallery grid stays as-is (admin needs uniform tiles for editing)

## Files to edit
- `src/pages/Gallery.tsx` — swap grid → columns, adjust tile classes
