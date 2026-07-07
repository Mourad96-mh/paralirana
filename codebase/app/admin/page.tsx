"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { formatMAD } from "@/lib/format";

type Stats = {
  products: number;
  outOfStock: number;
  orders: number;
  newOrders: number;
  revenue: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [pRes, oRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/orders"),
        ]);
        const { products = [] } = await pRes.json();
        const { orders = [] } = await oRes.json();
        setStats({
          products: products.length,
          outOfStock: products.filter((p: { inStock: boolean }) => !p.inStock)
            .length,
          orders: orders.length,
          newOrders: orders.filter(
            (o: { status: string }) => o.status === "nouvelle"
          ).length,
          revenue: orders
            .filter((o: { status: string }) => o.status !== "annulée")
            .reduce((s: number, o: { total: number }) => s + (o.total || 0), 0),
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    { label: "Produits", value: stats?.products ?? "—", href: "/admin/produits" },
    {
      label: "En rupture",
      value: stats?.outOfStock ?? "—",
      href: "/admin/produits",
    },
    {
      label: "Commandes",
      value: stats?.orders ?? "—",
      href: "/admin/commandes",
    },
    {
      label: "Nouvelles commandes",
      value: stats?.newOrders ?? "—",
      href: "/admin/commandes",
      highlight: true,
    },
  ];

  return (
    <AdminShell title="Tableau de bord">
      {loading ? (
        <p className="text-muted">Chargement…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className={`rounded-xl border bg-white p-5 transition hover:shadow-md ${
                  c.highlight && Number(c.value) > 0
                    ? "border-gold"
                    : "border-black/5"
                }`}
              >
                <p className="text-sm text-muted">{c.label}</p>
                <p className="mt-1 text-3xl font-bold text-green">{c.value}</p>
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-black/5 bg-white p-5">
            <p className="text-sm text-muted">Chiffre d&apos;affaires (hors annulées)</p>
            <p className="mt-1 text-3xl font-bold text-green">
              {stats ? formatMAD(stats.revenue) : "—"}
            </p>
          </div>
        </>
      )}
    </AdminShell>
  );
}
