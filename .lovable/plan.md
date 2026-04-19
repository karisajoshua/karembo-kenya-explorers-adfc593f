
## Plan: Day Trips flip cards + Safari packages mosaic layout

### 1. Day Trips section (Home.tsx)
- Show **4 cards visible at once** on desktop (`basis-1/4`), 2 on tablet, 1.2 on mobile (peek)
- **Auto-scroll left** continuously using `embla-carousel-autoplay` plugin (already a peer of shadcn carousel) — install if missing, else use a simple `setInterval` calling `api.scrollNext()` with `loop: true` and slow speed
- **Flip on hover**: each card becomes a 3D flip container
  - Front: current image + title + price overlay
  - Back: sage-green background, title, short description, "View Details" link
  - CSS: `perspective` on parent, `transform-style: preserve-3d`, `rotate-y-180` on hover, `backface-visibility: hidden` on faces
  - Add small utility classes inline via Tailwind arbitrary values (`[transform-style:preserve-3d]`, `[backface-visibility:hidden]`, `group-hover:[transform:rotateY(180deg)]`)

### 2. Popular Safari Packages — mosaic layout (matches reference)
Replace the current alternating split with a **2-column asymmetric grid** (using first 3 packages):

```text
┌──────────────────┬──────────────────┐
│ Card 1           │                  │
│ [text | image ]  │                  │
│ horizontal       │   Card 3         │
├──────────────────┤   vertical       │
│ Card 2           │   [image top]    │
│ [image | text]   │   [text below]   │
│ horizontal       │                  │
└──────────────────┴──────────────────┘
```

- **Left column** (`lg:col-span-1`, stacked): 2 horizontal cards
  - Card 1: text-left / image-right (50/50 split inside card)
  - Card 2: image-left / text-right (alternating)
- **Right column** (`lg:col-span-1`, full height): 1 vertical card — large image on top (~55% height), text panel below
- All cards: white bg, subtle border, title, amber divider, calendar+duration, description (clamped), outlined "Discover More" button
- Grid: `lg:grid-cols-2 gap-6`, right card uses `lg:row-span-2` so it spans both rows
- Below grid: centered green "Explore More Packages" button (keep)

### Files to edit
- `src/pages/Home.tsx` — rewrite Day Trips carousel (flip + autoplay) and Safari Packages section (mosaic grid)
- `package.json` — add `embla-carousel-autoplay` if not present (otherwise use manual interval)

### Out of scope
- Touching other pages or the mega menu
- Changing tour data
