

## Plan: Blog, Gallery, Admin Dashboard + PDF Quote Delivery

### 1. Authentication & Admin Roles
- Add **email/password auth** (login page only — no public signup; admins are invited)
- Create `profiles` table (id, email, full_name) with auto-create trigger on signup
- Create `app_role` enum (`admin`, `user`) and `user_roles` table
- Add `has_role()` SECURITY DEFINER function (prevents RLS recursion)
- Seed: first admin created manually via SQL after first signup

### 2. Database Schema (new tables)

| Table | Key columns | Purpose |
|---|---|---|
| `profiles` | id, email, full_name | User info |
| `user_roles` | user_id, role | Admin/user roles |
| `blog_posts` | id, slug, title, excerpt, content, cover_image, author, published, created_at | Blog content |
| `gallery_images` | id, image_url, caption, category, sort_order | Gallery |
| `site_images` | id, key (unique, e.g. "home_hero"), image_url, alt | Editable section images |
| `packages` | id, slug, title, category, duration, price_from, image, summary, highlights[], itinerary(jsonb), inclusions[], exclusions[] | Replaces hardcoded `tours.ts` |

RLS: public SELECT on blog/gallery/site_images/packages (where published); admin-only INSERT/UPDATE/DELETE via `has_role(auth.uid(),'admin')`. `quote_requests` already exists — add admin SELECT policy.

### 3. Storage
- Create `site-assets` bucket (public) for blog covers, gallery, section images, package images
- Admin-only write policies; public read

### 4. Public-facing pages (new)
- `/blog` — grid of 8 seeded posts (cards: cover, title, excerpt, date)
- `/blog/:slug` — single post page
- `/gallery` — masonry/grid gallery with category filter
- Add "Blog" and "Gallery" links to header nav + mega menu

### 5. Admin section (`/admin/*`, protected)
- `/admin/login` — login form
- `/admin` — dashboard layout with sidebar:
  - **Quote Requests** — table view of `quote_requests`, mark as read, view detail
  - **Packages** — list / create / edit / delete (image upload, all fields)
  - **Blog Posts** — list / create / edit / delete (cover upload, rich textarea)
  - **Gallery** — upload images, edit captions, reorder, delete
  - **Site Images** — edit hero/section images by key (Home hero, About hero, etc.)
- Route guard: redirect non-admins to `/admin/login`

### 6. Quote → PDF + Email flow
On contact form submit:
1. Insert into `quote_requests` (already works)
2. Call new edge function `send-quote-confirmation`:
   - Generates PDF using **pdf-lib** (Deno-compatible) with: Karembo logo, company contacts (phone/email/address), client's submitted details, package interest, timestamp
   - Sends email to client (with PDF attached) using **Lovable transactional email** (built-in, no API key)
   - Sends notification email to `info@karembotours.co.ke` with the request details
3. Requires email domain setup → use `<lov-open-email-setup>` if not configured

### 7. Migrate hardcoded tours → DB
- Seed `packages` table from current `src/data/tours.ts` (18 packages, current prices)
- Update `Safaris`, `DayTrips`, `Combo`, `Cultural`, `PackageDetail`, `Home`, `Contact` to fetch from `packages` table via supabase

### 8. Seed content
- 8 blog posts (Kenya travel topics: Best time to visit Mara, Big Five guide, Packing list, Cultural etiquette, Honeymoon ideas, Budget safari tips, Nairobi day trips, Conservation stories) — placeholder Unsplash covers
- ~12 gallery images (Unsplash safari/Kenya scenes) across categories: Wildlife, Landscapes, Culture, People

### Files to add/edit
**New pages**: `Blog.tsx`, `BlogPost.tsx`, `Gallery.tsx`, `admin/Login.tsx`, `admin/Layout.tsx`, `admin/Dashboard.tsx`, `admin/QuoteRequests.tsx`, `admin/Packages.tsx`, `admin/PackageEdit.tsx`, `admin/BlogPosts.tsx`, `admin/BlogEdit.tsx`, `admin/Gallery.tsx`, `admin/SiteImages.tsx`
**New components**: `admin/AdminSidebar.tsx`, `admin/ImageUploader.tsx`, `ProtectedAdminRoute.tsx`
**New hooks**: `useAuth.tsx`, `useIsAdmin.tsx`
**Edge function**: `supabase/functions/send-quote-confirmation/index.ts`
**Edits**: `App.tsx` (routes), `Header.tsx` + `MegaMenu.tsx` (nav links), `Contact.tsx` (call edge function), all package-list pages (fetch from DB)
**Migrations**: profiles, roles, blog_posts, gallery_images, site_images, packages tables + RLS + storage bucket + seed data

### Setup required from you
- After first admin signs up, I'll prompt to assign admin role via SQL
- Email domain must be configured for client/admin email delivery (I'll show the setup dialog)

### Out of scope
- Rich text editor (use plain markdown/textarea for blog body)
- Multi-author blog management
- Blog comments
- Image cropping in admin

