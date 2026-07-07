import { SITE_URL } from "@/lib/format";

// Plain Route Handler (NOT the `robots.ts` metadata convention): Next's
// metadata-route loader crashes on this project's path (apostrophe/space in
// "para d'or"). A route handler uses the normal loader and works fine.
export const dynamic = "force-static";

export function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /panier",
    "Disallow: /admin",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
