"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearToken, isAuthed } from "@/lib/adminApi";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: "📊" },
  { href: "/admin/produits", label: "Produits", icon: "🧴" },
  { href: "/admin/categories", label: "Catégories", icon: "🗂️" },
  { href: "/admin/commandes", label: "Commandes", icon: "🧾" },
];

export default function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [ready, setReady] = useState(false);

  // Auth guard (middleware is gone in the static export): redirect to login if
  // there's no token. Runs client-side once mounted.
  useEffect(() => {
    if (!isAuthed()) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [router]);

  function logout() {
    setLoggingOut(true);
    clearToken();
    router.replace("/admin/login");
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Chargement…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col bg-green text-white sm:flex">
        <div className="border-b border-white/10 px-5 py-4">
          <Link href="/admin" className="flex items-baseline gap-1">
            <span className="font-display text-xl font-bold">Para</span>
            <span className="font-display text-xl font-bold text-gold">
              Lirana
            </span>
          </Link>
          <p className="mt-0.5 text-[11px] uppercase tracking-wide text-white/50">
            Administration
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-gold text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className="mb-1 block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10"
          >
            ↗ Voir le site
          </Link>
          <button
            onClick={logout}
            disabled={loggingOut}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10 disabled:opacity-50"
          >
            {loggingOut ? "Déconnexion…" : "Déconnexion"}
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-black/5 bg-white px-6 py-4">
          <h1 className="font-display text-xl font-bold text-green">{title}</h1>
          <button
            onClick={logout}
            className="text-sm text-muted hover:text-green sm:hidden"
          >
            Déconnexion
          </button>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
