
## Plan: Sales-focused UX, richer detail pages, lead capture, smart suggestions

### 1. Expand package detail pages (more flesh)
Enrich every package in the DB so detail pages feel substantial. For each of the ~15 packages, expand:
- `summary` → 2-3 paragraph compelling overview
- `highlights` → 6-8 specific bullet items (animals, landscapes, experiences)
- `itinerary` → full day-by-day with times, activities, meals, accommodation
- `inclusions` / `exclusions` → comprehensive lists

Add new sections to `PackageDetail.tsx`:
- "Why book this trip" trust block (3 icons: expert guides, small groups, no hidden fees)
- "What to pack" collapsible
- "FAQ" accordion (5 common Qs per trip)
- "You might also like" — 3 related packages from same category
- Sticky mobile CTA bar (Request Quote / WhatsApp) at bottom on mobile
- Multiple in-page CTAs (after highlights, after itinerary, sidebar)

### 2. Lead capture system

**a) New DB table `leads`** (separate from `quote_requests` which is for full quote forms):
```
id, name, email, phone, source (exit_intent | category_suggest | popup_timer),
interested_category, interested_package, page_path, created_at, contacted (bool)
```
RLS: anon INSERT allowed; only admins SELECT/UPDATE.

**b) Exit-intent popup** (`<LeadCapturePopup />`)
- Triggers when mouse leaves through top of viewport (desktop) OR after 45s + scroll-up (mobile fallback)
- Shows once per session (sessionStorage flag)
- 2-column layout: **left** = image pulled from `site_images` table (key `lead_popup`) with fallback to a gallery image; **right** = form (name, email, phone, optional message)
- Contextual headline based on current route (e.g. on `/safaris` → "Get our Masai Mara insider guide")
- On submit → insert into `leads` with `source='exit_intent'` + page context

**c) Smart category suggestion popup**
- Track page visits in `sessionStorage`: `{safari: 3, dayTrip: 1, ...}`
- When a user views 3+ pages of the same category without converting, show a smaller bottom-right slide-in: "Loving our [Safaris]? Get 3 hand-picked itineraries"
- Same form structure, `source='category_suggest'`, `interested_category` filled
- Dismissible, shows once per session

### 3. Admin dashboard — Leads page
- New route `/admin/leads` (`src/pages/admin/Leads.tsx`)
- Table: name, email, phone, source, interested category/package, page, date, contacted toggle
- Filter by source + contacted status
- CSV export button
- Add nav link in `AdminLayout`
- Add lead count card on `Dashboard.tsx`

### 4. "Powered By Texcortech Systems" footer credit
- Add line in `Footer.tsx` bottom bar: `Powered by Texcortech Systems` (small, centered, links to `https://texcortech.com` in new tab — placeholder URL, user can confirm)
- Renders on every public page (Footer is in shared `Layout`)
- Also add to `AdminLayout` so admin pages show it too

### 5. Files to create / change
**Create:**
- `src/components/LeadCapturePopup.tsx` (exit-intent + form)
- `src/components/CategorySuggestPopup.tsx` (smart slide-in)
- `src/hooks/useExitIntent.ts`
- `src/hooks/useCategoryTracker.ts`
- `src/pages/admin/Leads.tsx`
- DB migration: `leads` table + RLS

**Edit:**
- DB inserts: bulk-update all `packages` rows with richer content
- `src/pages/PackageDetail.tsx` — new sections (FAQ, related, why-book, sticky CTA, pack list)
- `src/components/layout/Layout.tsx` — mount popups
- `src/components/layout/Footer.tsx` — Texcortech credit
- `src/pages/admin/Layout.tsx` — Leads nav link + credit
- `src/pages/admin/Dashboard.tsx` — leads count card
- `src/App.tsx` — add `/admin/leads` route

### Out of scope
- Email notifications when a lead arrives (can be added later via edge function + Resend)
- A/B testing variants of the popup
- Full analytics dashboard

### Notes / assumptions
- Texcortech URL: I'll use `https://texcortech.com` — tell me if it's different
- Exit-intent only fires on desktop (mouseleave top); mobile uses a 45s + scroll-up heuristic
- "Smart suggestions" = client-side sessionStorage heuristic, no ML — simple and privacy-friendly
- Popups respect a "dismissed" flag for the session to avoid annoying repeat visitors
