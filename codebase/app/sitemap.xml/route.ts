import { categories } from "@/lib/products";
import { getProducts } from "@/lib/data/products";
import { cities } from "@/lib/cities";
import { featuredBrands } from "@/lib/brands";
import { SITE_URL } from "@/lib/format";

// Plain Route Handler instead of the `sitemap.ts` metadata convention — the
// metadata-route loader crashes on this project's folder path. Rebuilt hourly.
export const revalidate = 3600;

type Entry = { path: string; priority: number };

export async function GET() {
  const now = new Date().toISOString();
  const products = await getProducts();

  const entries: Entry[] = [
    { path: "", priority: 1 },
    { path: "/contact", priority: 0.5 },
    ...categories.map((c) => ({ path: `/${c.slug}`, priority: 0.8 })),
    ...featuredBrands.map((b) => ({ path: `/marque/${b.slug}`, priority: 0.8 })),
    ...cities.map((c) => ({
      path: `/parapharmacie/${c.slug}`,
      priority: 0.8,
    })),
    ...products.map((p) => ({ path: `/produit/${p.slug}`, priority: 0.7 })),
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries
      .map(
        (e) =>
          `  <url><loc>${SITE_URL}${e.path}</loc><lastmod>${now}</lastmod>` +
          `<changefreq>weekly</changefreq><priority>${e.priority}</priority></url>`
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
}
