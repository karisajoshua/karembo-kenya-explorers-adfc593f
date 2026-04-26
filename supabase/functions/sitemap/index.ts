import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE = "https://karembotours.co.ke";

const STATIC: Array<{ loc: string; priority: string; changefreq: string }> = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/safaris", priority: "0.9", changefreq: "weekly" },
  { loc: "/day-trips", priority: "0.9", changefreq: "weekly" },
  { loc: "/combo", priority: "0.9", changefreq: "weekly" },
  { loc: "/cultural", priority: "0.8", changefreq: "weekly" },
  { loc: "/gallery", priority: "0.7", changefreq: "weekly" },
  { loc: "/blog", priority: "0.8", changefreq: "weekly" },
  { loc: "/about", priority: "0.6", changefreq: "monthly" },
  { loc: "/contact", priority: "0.7", changefreq: "monthly" },
];

const xmlEscape = (s: string) => s.replace(/[<>&'"]/g, (c) =>
  ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c] as string));

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const [pkgsRes, blogsRes] = await Promise.all([
    supabase.from("packages").select("slug, updated_at").eq("published", true),
    supabase.from("blog_posts").select("slug, updated_at").eq("published", true),
  ]);

  const urls: string[] = [];
  const today = new Date().toISOString().slice(0, 10);

  for (const u of STATIC) {
    urls.push(
      `<url><loc>${SITE}${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
    );
  }

  for (const p of pkgsRes.data ?? []) {
    const lm = (p as any).updated_at ? new Date((p as any).updated_at).toISOString().slice(0, 10) : today;
    urls.push(
      `<url><loc>${SITE}/packages/${xmlEscape((p as any).slug)}</loc><lastmod>${lm}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    );
  }

  for (const b of blogsRes.data ?? []) {
    const lm = (b as any).updated_at ? new Date((b as any).updated_at).toISOString().slice(0, 10) : today;
    urls.push(
      `<url><loc>${SITE}/blog/${xmlEscape((b as any).slug)}</loc><lastmod>${lm}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
      "access-control-allow-origin": "*",
    },
  });
});
