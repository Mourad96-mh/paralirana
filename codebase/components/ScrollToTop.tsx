"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// App Router's built-in scroll-to-top on navigation is unreliable here: pages are
// wrapped in async providers (catalog/categories) and Suspense boundaries
// (CategoryView, FeaturedProducts) that stream content in after the route commits,
// which can leave the new page scrolled where the previous one was (e.g. clicking a
// footer link lands you at the bottom of the next page). Forcing the window to the
// top whenever the pathname changes guarantees every navigation starts at the top.
//
// Keyed on pathname only (not search params), so in-page filter changes like
// /visage?sub=serums don't yank the user back to the top.
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
