/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export → produces an `out/` folder of crawlable HTML, hosted on Hostinger.
  // Dynamic behaviour (catalog data, orders, admin) lives in the Express API on Render;
  // the storefront reads a build-time snapshot (lib/catalog.data.json) baked by
  // scripts/sync-content.mjs, and can refresh live from the API on the client.
  output: "export",
  // Each route → `route/index.html` (not `route.html`), so Apache/LiteSpeed on
  // Hostinger serves clean URLs (/visage/, /produit/<slug>/) natively without rewrites.
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    // No image optimizer server in a static export → serve images as-is.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
