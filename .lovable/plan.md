
## Karembo Tours — Kenya Safari Website

A full clone of the Next Stop Tanzania structure, rebranded for **Karembo Tour Safaris** (leopard logo, Kenya focus: Nairobi & Masai Mara).

### Brand & Design
- **Logo**: Karembo leopard mark in the header
- **Palette**: Deep brown (#3B2418) + safari green (#4A5D3A) + warm sand (#F5EFE6) + amber accent (#D89B3D) — pulled from the logo
- **Typography**: Bold serif for headlines (Playfair-style) + clean sans for body, matching the logo's editorial feel
- **Imagery**: Authentic Unsplash photography of Masai Mara wildlife, Nairobi landmarks, Maasai culture

### Pages

**1. Home (`/`)**
- Sticky header with logo + nav (Safaris, Day Trips, Combo, Cultural, About, Contact) + "Request a Quote" CTA
- Hero: full-bleed Mara savanna image, headline "The heart of tailor-made safaris in Kenya", CTAs (Plan Your Safari / Browse Packages)
- Three pillars: Local Expertise · Flexibility · Customization
- Unforgettable Day Trips carousel (Nairobi National Park, Giraffe Centre, Elephant Orphanage, Karen Blixen, Bomas of Kenya)
- Popular Safari Packages grid (3-day Mara Classic, 5-day Great Migration, 7-day Mara + Nairobi Combo, etc.)
- Cultural Experience section (Maasai village immersion)
- "Talk to our safari experts" banner with WhatsApp + quote CTAs
- Testimonials carousel
- Affiliates strip (KATO, Magical Kenya, Ecotourism Kenya — placeholder logos)
- Footer: quick links, contact info, social

**2. Masai Mara Safaris (`/safaris`)**
- Hero + intro
- Grid of ~6 multi-day Mara packages with duration, price-from, image, "Discover More"

**3. Nairobi Day Trips (`/day-trips`)**
- Grid of ~6 day excursions in/around Nairobi

**4. Combo Safaris (`/combo`)**
- Mara + Nairobi multi-day combined itineraries

**5. Cultural Experiences (`/cultural`)**
- Maasai village, Bomas of Kenya, community visits

**6. Package Detail (`/packages/:slug`)**
- Hero image, overview, day-by-day itinerary, what's included/excluded, pricing, gallery, "Request this Tour" CTA

**7. About (`/about`)**
- Story, why choose us, team values, affiliations

**8. Contact / Request a Quote (`/contact`)**
- Contact details (Nairobi office, phone, email, WhatsApp)
- Quote form: name, email, phone, country, travel dates, group size, package interest, budget, message

### Backend (Lovable Cloud)
- `quote_requests` table storing all form submissions (RLS: public can insert; only authenticated admins can read)
- Zod-validated form with toast confirmation on submit

### Reusable Components
- `Header` (sticky, mobile hamburger), `Footer`, `PackageCard`, `DayTripCard`, `Section`, `Hero`, `TestimonialCarousel`, `WhatsAppFloat` (floating WhatsApp chat button)

### Out of Scope (v1)
- Real payment / booking checkout
- Multi-language switcher
- Admin dashboard for viewing quotes (data accessible via Cloud DB UI)
