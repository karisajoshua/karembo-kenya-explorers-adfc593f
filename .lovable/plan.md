## Diagnosis: why people outside Kenya can't view the site

I tested the live domain. Two real problems — neither is Lovable blocking anyone by country:

**1. `karembotours.co.ke` is NOT pointed at Lovable.**
- `dig karembotours.co.ke` → `185.158.133.1` (a **Kenya Web Experts shared-hosting** IP)
- Nameservers: `ns387.kenyawebexperts.com` / `ns388.kenyawebexperts.com`
- A Lovable-hosted site should resolve to a Lovable / Cloudflare IP. Right now your apex points at a Kenyan shared host, which:
  - serves whatever that host has (likely an old site, parking page, or cached snapshot)
  - is hosted physically in Kenya with no global CDN — so visitors from Europe / US / Asia get extreme latency, frequent timeouts, or "site can't be reached"
  - has no `www` record at all (`www.karembotours.co.ke` returns nothing)

**2. The Lovable-published URL redirects to the broken domain.**
- `https://karembo-kenya-explorers.lovable.app/` → **302 redirect to `https://karembotours.co.ke/`**
- So even people who try the Lovable URL get bounced to the misconfigured apex. Nobody can reliably reach the real app from outside Kenya.

### Fix (you do this in Lovable + your registrar — I cannot touch DNS from code)

**Step A — Reconnect the custom domain in Lovable**
1. Open **Project Settings → Domains** in Lovable.
2. Remove `karembotours.co.ke` if it's listed.
3. Re-add it. Lovable will show you the exact DNS records to set (an A record for the apex + a CNAME for `www`, both pointing to Lovable's Cloudflare-backed edge).

**Step B — Update DNS at your registrar (Kenya Web Experts / KENIC)**
1. Log in to the Kenya Web Experts control panel (or wherever your `.co.ke` is managed).
2. Either:
   - **Easier:** keep the existing nameservers, delete the current A record `185.158.133.1`, and add the new A + CNAME records Lovable gave you in Step A; **or**
   - **Cleaner:** change nameservers to Cloudflare's and let Lovable manage everything.
3. Add a `www` CNAME → apex (so `www.karembotours.co.ke` also works).
4. Wait 15 min – 24 h for DNS to propagate globally.

**Step C — Verify**
- I'll re-run `dig` from the sandbox after you update DNS to confirm the new IPs are Lovable's edge, and `curl` from a few angles to confirm the real site loads worldwide.

> Until Steps A & B are done, no code change can fix global access — the problem is purely DNS.

---

## SEO audit — what's good, what's missing

### Already in place ✅
- React Helmet `<Seo>` component on every page with title, description, canonical, OG, Twitter Card
- `orgJsonLd` (TravelAgency) on Home + WebSite SearchAction
- `public/sitemap.xml` (35 URLs)
- `public/robots.txt` explicitly allowing GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Applebot-Extended (excellent for AI discoverability)
- `public/llms.txt` (modern AI signal)
- Preconnect / dns-prefetch to Supabase
- Theme color, viewport, lang="en"

### Gaps to fix
1. **Sitemap is stale** — it's a hand-edited file listing slugs. New packages (e.g. `nairobi-park-giraffe`) and any new blog posts you add via admin won't appear. Replace with a **dynamically generated** sitemap that pulls from the `packages` and `blog_posts` tables at build time (or via an edge function `/sitemap.xml`).
2. **No per-package / per-blog JSON-LD** — package detail pages should emit `Product` / `TouristTrip` / `Offer` schema, blog posts should emit `BlogPosting` with author, datePublished, image. This is what gets you Google rich results (price, rating, breadcrumbs).
3. **No `BreadcrumbList` schema** on inner pages.
4. **`<html lang>` is fine but missing `hreflang`** — add `<link rel="alternate" hreflang="en" href="..." />` and `hreflang="x-default"`.
5. **OG image is JPG path on the same host** — once DNS is fixed this works; today it's broken because the apex isn't Lovable.
6. **Search Console verification meta is commented out** — needs to be activated with your real token (you'll provide after verifying the site in Search Console / Bing Webmaster Tools).
7. **`llms.txt` is minimal** — I'll expand it with structured links to all package categories, key blog posts, and a one-paragraph "About Karembo" so AI models cite you accurately.
8. **No FAQ schema** on Home / package pages — high-value for Google AI Overviews.
9. **Image alt audit** — most are good, but hero carousels and gallery thumbnails need keyword-rich alts (e.g. "Wildebeest crossing Mara River — Great Migration safari").
10. **No `structured` Performance/CWV improvements** — preload hero image (LCP), add `width`/`height` to images to prevent CLS.

### What I'll change in code (after you approve)

**Files to edit:**
- `index.html` — add Search Console verification placeholder note, hreflang link, preload hero
- `src/components/Seo.tsx` — add `BreadcrumbList` + `hreflang` support
- `src/pages/PackageDetail.tsx` — emit `TouristTrip` + `Offer` JSON-LD using DB fields (price_from, duration, image, summary)
- `src/pages/BlogPost.tsx` — emit `BlogPosting` JSON-LD
- `src/pages/Home.tsx` — add `FAQPage` JSON-LD (5 common questions: best time, cost, visa, safety, packing)
- `src/pages/Safaris.tsx`, `DayTrips.tsx`, `Combo.tsx`, `Cultural.tsx`, `Blog.tsx` — add `BreadcrumbList` + `ItemList` JSON-LD
- `public/llms.txt` — rewrite with structured sections (Company, Tour categories, Top packages, Blog topics, Contact)

**Files to create:**
- `supabase/functions/sitemap/index.ts` — edge function that queries `packages` + `blog_posts` and returns a fresh `sitemap.xml`. Then either:
  - point `karembotours.co.ke/sitemap.xml` to it via a redirect, or
  - replace static `public/sitemap.xml` with a small build script that regenerates it on each deploy
- `public/_headers` (if Lovable hosting respects it) — long cache for static assets, no-cache for HTML

### Out of scope (future)
- Lighthouse / Core Web Vitals deep optimisation (image compression pipeline, code-splitting tweaks)
- Backlink strategy / outreach (off-page SEO)
- Translating site for hreflang `fr`, `de`, `es` markets (many of your testimonials are EU — worth considering)
- Submitting sitemap to Google Search Console + Bing Webmaster Tools (you do this once verified)

---

## Suggested order
1. **You:** do Steps A+B in Lovable + your registrar (DNS) — unblocks global access. Tell me when done so I can verify with `dig`/`curl`.
2. **Me:** implement the SEO code changes + dynamic sitemap edge function in one batch.
3. **You:** verify domain in Google Search Console + Bing Webmaster Tools, paste the verification token to me, I add it to `index.html`. Submit sitemap.
4. **Optional:** Cloudflare in front for global CDN + DDoS (free tier is plenty).

Approving this plan = I'll proceed with step 2 (the code changes). Step 1 is in your hands and is the *real* fix for "people outside Kenya can't view it".