
## Plan: Refresh Home sections + Jost font + Mega menu

### 1. Typography — switch to Jost
- Add Google Fonts `Jost` link to `index.html` (replace Inter/Playfair imports)
- Update `tailwind.config.ts`: set both `sans` and `serif` font families to `['Jost', 'sans-serif']` so existing `font-serif` classes on headings still work but render in Jost (matching reference's clean single-font look)

### 2. Home page — rebuild 3 sections to match reference screenshots

**Pillars section** (replace current card-style):
- Clean white background, no cards/shadows
- 3 columns: light sage-green circle icon (left) + heading + body text
- LOCAL EXPERTISE / FLEXIBILITY / CUSTOMIZATION — Kenya-focused copy (Masai Mara, Nairobi, Maasai culture)

**Unforgettable Day Trips** (replace current grid):
- Centered title only (no eyebrow/subtitle)
- Horizontal carousel using existing shadcn `carousel` component, peek-edge effect (next/prev images partially visible)
- Tall portrait cards (aspect ~3/4), image with dark gradient overlay, title + "Budget Starts From: $X per person" overlaid at bottom
- Outlined "Explore More Day Trips" button centered below

**Popular Safari Packages** (replace current 3-card grid):
- Centered title "OUR POPULAR SAFARI PACKAGES" (uppercase, tracked)
- Alternating split layout: 2-col rows where image and text-panel swap sides per row
- Text panel: title, amber underline divider, calendar-icon "X DAYS | Y NIGHTS", description, outlined "Discover More" button
- Show 4 packages in this layout
- Solid green "Explore More Packages" button centered below

### 3. Mega menu in header
- Desktop only: "Safaris", "Day Trips", "Combo", "Cultural" each open a full-width mega panel on hover
- Panel contains: 3-4 featured tour cards (image thumb + title + duration + price-from) pulled from `byCategory()` in `tours.ts`, plus a "View all" link
- Built with shadcn `navigation-menu` component (already in project)
- Mobile: keep existing simple dropdown list (no change)
- "About" and "Contact" remain plain links

### Files to edit
- `index.html` — Jost font link
- `tailwind.config.ts` — font family
- `src/pages/Home.tsx` — rewrite 3 sections
- `src/components/layout/Header.tsx` — replace desktop nav with mega menu

### Out of scope
- Mobile mega menu (stays as simple list)
- Re-styling other pages (Safaris, About, etc.) — only Home sections change now
