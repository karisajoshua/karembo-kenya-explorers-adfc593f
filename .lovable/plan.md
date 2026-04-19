

## Plan: Update contacts everywhere + competitive pricing + brand copy

### 1. Replace fake contact info globally with real details
Real contacts to use everywhere:
- **Phones**: +254 722 736 130, +254 757 223 301
- **Email**: info@karembotours.co.ke (general), reservations@karembotours.co.ke (bookings)
- **Address**: 11th Street Kangawa, Ngong Road, Nairobi, Kenya
- **Website**: www.karembotours.co.ke
- **WhatsApp**: 254722736130 (use first phone)

Files to update:
- `src/components/layout/Footer.tsx` — replace address, phone (show both), email (info@)
- `src/pages/Contact.tsx` — replace all 4 contact cards (Office, Phone shows both, Email shows both, WhatsApp uses real number)
- `src/components/WhatsAppFloat.tsx` — change `wa.me/254700123456` → `wa.me/254722736130`
- `src/pages/PackageDetail.tsx` — update WhatsApp link to real number
- `src/pages/Home.tsx` — update "WhatsApp Us" CTA link

### 2. Make pricing more competitive
Researched market: budget Mara 3-day starts ~$397, mid-range ~$745, 7-day Mara/Amboseli mid-range ~$2,000, Nairobi NP half-day ~$95–$120/pp.

Adjust `src/data/tours.ts` `priceFrom` to undercut/match market while staying realistic:

| Package | Old | New |
|---|---|---|
| 3-Day Masai Mara Classic | $720 | **$485** |
| 5-Day Great Migration | $1,480 | **$1,150** |
| 7-Day Mara & Amboseli | $2,150 | **$1,790** |
| 4-Day Luxury Mara Tented | $1,890 | **$1,650** |
| 6-Day Mara, Nakuru & Naivasha | $1,650 | **$1,390** |
| 8-Day Honeymoon Kenya | $3,450 | **$2,950** |
| Nairobi National Park Day Trip | $95 | **$85** |
| Giraffe Centre & Elephant Orphanage | $75 | **$60** |
| Karen Blixen & Kazuri | $65 | **$55** |
| Bomas of Kenya | $55 | **$45** |
| Nairobi City Tour | $110 | **$95** |
| Mt. Longonot Day Hike | $90 | **$75** |
| 5-Day Nairobi & Mara Combo | $1,320 | **$1,090** |
| 7-Day Nairobi/Mara/Amboseli Combo | $2,280 | **$1,890** |
| 9-Day Mara & Diani | $2,890 | **$2,490** |
| Maasai Village Immersion | $380 | **$320** |
| Bomas Deep Dive | $95 | **$80** |
| Samburu Cultural Extension | $720 | **$640** |

### 3. Add the new brand story copy to About page
Update `src/pages/About.tsx` story section with provided copy:
- Tagline: "Dream Your Next Trip — Safari Experiences Designed Around You"
- Replace the 3 story paragraphs with the new "Based in Nairobi… trusted Kenyan tour company…" intro and the "flexible travel options suited to solo travellers, couples, families, and groups" paragraph.
- Add a 3-bullet list under values or as a sub-section: guided game drives, day trips & excursions, flexible travel styles.

### 4. Add SEO/meta + footer website link
- `index.html` — update `<title>` and meta description to mention Karembo Tours and Safaris and karembotours.co.ke
- `Footer.tsx` — add website URL line under contact

### Out of scope
- No new pages, no design changes, no new images
- Tour itineraries/highlights stay the same — only `priceFrom` changes

