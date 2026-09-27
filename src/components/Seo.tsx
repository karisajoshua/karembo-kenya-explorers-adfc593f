import { Helmet } from "react-helmet-async";

const SITE_URL = "https://karembotours.co.ke";
const DEFAULT_OG = "https://karembotours.co.ke/gallery/wildebeest-crossing.jpg";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: object | object[];
  noindex?: boolean;
};

export const Seo = ({ title, description, path = "/", image, type = "website", jsonLd, noindex }: SeoProps) => {
  const url = `${SITE_URL}${path}`;
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`
    : DEFAULT_OG;
  const fullTitle = title.length > 60 ? title.slice(0, 57).trimEnd() + "…" : title;
  const desc = description.length > 155 ? description.slice(0, 152).trimEnd() + "…" : description;

  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Karembo Tours and Safaris" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
};

export const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Karembo Tours and Safaris",
  url: SITE_URL,
  logo: `${SITE_URL}/gallery/lion-male.jpg`,
  image: DEFAULT_OG,
  description:
    "Trusted Nairobi-based Kenyan tour company offering Masai Mara safaris, Big Five tours, Nairobi day trips, beach combos and cultural experiences at competitive rates.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  areaServed: "Kenya",
  sameAs: [],
};

export const SITE = SITE_URL;
