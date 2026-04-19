
## Plan: Image integration, blog expansion, full SEO/AI optimization

### 1. Map gallery images to packages and blogs
- Pull all image URLs from `gallery_images` (already in storage)
- Update `packages.image` for every Unsplash placeholder → matched safari/wildlife shot from gallery (e.g. Mara packages → wildebeest/lion shots; Amboseli → elephant-tusks; cultural → Maasai shots)
- Update `blog_posts.cover_image` for each post → topical match from gallery
- Inject 2-3 inline images into each blog post body (markdown `![alt](url)`)

### 2. Expand all blog posts
- Rewrite each post to ~1,200-1,800 words (currently most are <500)
- Structure: intro → H2 sections → practical tips → FAQ block → CTA
- Keyword-rich, natural prose targeting "Kenya safari", "Masai Mara tour", "Big Five", "wildebeest migration", etc.
- Add `excerpt` (155 chars, meta-description ready) where missing
- Done via SQL UPDATE on `blog_posts`

### 3. SEO foundation (technical)
- **react-helmet-async** for per-page `<title>`, meta description, canonical, OG, Twitter cards
- Wrap `App.tsx` in `<HelmetProvider>`
- Create `<Seo>` component used by every public page (Home, About, Safaris, DayTrips, Combo, Cultural, Gallery, Blog, BlogPost, PackageDetail, Contact)
- Update `index.html`: improve default title, description, lang, theme-color, favicon meta, preconnect

### 4. Structured data (JSON-LD) — critical for AI/Google
Per-page schema injected via Helmet:
- **Home**: `TravelAgency` + `Organization` + `WebSite` (with SearchAction)
- **PackageDetail**: `TouristTrip` / `Product` with `offers`, `image`, `itinerary`
- **BlogPost**: `BlogPosting` with author, datePublished, image, wordCount
- **About**: `AboutPage` + `Organization`
- **Contact**: `ContactPage` + `LocalBusiness` (Nairobi address, geo, phone, hours)
- **Breadcrumbs** on detail pages

### 5. Sitemap + robots
- Generate `public/sitemap.xml` listing all static routes + every published package slug + blog slug (build-time script `scripts/generate-sitemap.mjs` run via `prebuild`, fetching slugs from Supabase using anon key)
- Update `public/robots.txt` → add `Sitemap:` line, allow all good bots, explicitly allow `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot` (AI discoverability)

### 6. Image SEO
- All `<img>` get descriptive `alt` (already partially there — extend to packages/blog covers)
- `loading="lazy"` + `decoding="async"` on non-hero images
- Width/height where known to reduce CLS

### 7. Performance + crawlability
- Add `<link rel="preconnect">` for Supabase storage in `index.html`
- Ensure all internal links use `<Link>` (already true)
- Add `og:image` per page (use the new gallery covers)

### 8. AI-platform discoverability (`public/llms.txt`)
- New file `public/llms.txt` (emerging standard) summarizing the site for LLMs: company, services, key URLs, contact
- Verbose alt text + semantic HTML already supports AI parsing

### Files to add/change
**New**
- `src/components/Seo.tsx`
- `scripts/generate-sitemap.mjs`
- `public/llms.txt`
- `public/sitemap.xml` (generated)

**Edit**
- `index.html` (meta, preconnect, lang)
- `public/robots.txt` (sitemap + AI bots)
- `package.json` (add `react-helmet-async`, `prebuild` script)
- `src/App.tsx` (HelmetProvider)
- All public page files → add `<Seo>` + JSON-LD
- DB: bulk UPDATE `packages.image`, `blog_posts.cover_image`, `blog_posts.content`, `blog_posts.excerpt`

### Out of scope
- Multilingual SEO
- Paid analytics / Search Console verification (user must add their own GSC token later — I'll leave a placeholder meta tag)
- Image compression/CDN resizing
