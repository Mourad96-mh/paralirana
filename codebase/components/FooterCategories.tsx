"use client";

import Link from "next/link";
import { useCategories } from "@/lib/categories";

// Footer category list — live from the API (same hybrid pattern as the Navbar),
// so a category created in the admin appears here without a rebuild. Falls back
// to the baked snapshot when the API is unreachable.
//
// Note: a brand-NEW category's own page (/slug) is only generated at the next
// build + upload, so its footer link 404s until the next deploy — same caveat
// as the live Navbar menu.
export default function FooterCategories() {
  const { categories } = useCategories();

  return (
    <ul className="space-y-1.5 text-sm">
      {categories.map((c) => (
        <li key={c.slug}>
          <Link href={`/${c.slug}`} className="hover:text-gold-light">
            {c.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
