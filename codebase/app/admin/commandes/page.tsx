"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { formatMAD } from "@/lib/format";

const STATUSES = ["nouvelle", "confirmée", "livrée", "annulée"] as const;
type Status = (typeof STATUSES)[number];

type OrderItem = {
  name: string;
  brand?: string;
  image?: string;
  price: number;
  qty: number;
};

type Order = {
  _id: string;
  customer: { name: string; phone: string; city?: string };
  items: OrderItem[];
  total: number;
  status: Status;
  createdAt: string;
};

const STATUS_STYLE: Record<Status, string> = {
  nouvelle: "bg-gold/15 text-gold-dark",
  confirmée: "bg-sky-50 text-sky-700",
  livrée: "bg-emerald-50 text-emerald-700",
  annulée: "bg-red-50 text-red-600",
};

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<Status | "toutes">("toutes");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: Status) {
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status } : o))
    );
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  const shown =
    filter === "toutes" ? orders : orders.filter((o) => o.status === filter);

  return (
    <AdminShell title="Commandes">
      <div className="mb-4 flex flex-wrap gap-2">
        {(["toutes", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition ${
              filter === s
                ? "bg-green text-white"
                : "bg-white text-muted hover:text-green"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted">Chargement…</p>
      ) : shown.length === 0 ? (
        <div className="rounded-xl border border-black/5 bg-white p-8 text-center text-muted">
          Aucune commande.
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((o) => (
            <div
              key={o._id}
              className="rounded-xl border border-black/5 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-green">
                    {o.customer.name}{" "}
                    <span className="font-normal text-muted">
                      · {o.customer.phone}
                    </span>
                  </p>
                  <p className="text-xs text-muted">
                    {o.customer.city ? `${o.customer.city} · ` : ""}
                    {new Date(o.createdAt).toLocaleString("fr-MA")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-green">
                    {formatMAD(o.total)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLE[o.status]}`}
                  >
                    {o.status}
                  </span>
                  <select
                    value={o.status}
                    onChange={(e) =>
                      updateStatus(o._id, e.target.value as Status)
                    }
                    className="rounded-lg border border-black/10 px-2 py-1 text-sm focus:border-gold focus:outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      setExpanded((e) => (e === o._id ? null : o._id))
                    }
                    className="text-sm text-muted hover:text-green"
                  >
                    {expanded === o._id ? "Masquer" : "Détails"}
                  </button>
                </div>
              </div>

              {expanded === o._id && (
                <ul className="mt-3 space-y-2 border-t border-black/5 pt-3 text-sm text-ink/80">
                  {o.items.map((i, idx) => (
                    <li key={idx} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-3">
                        {i.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={i.image}
                            alt={i.name}
                            className="h-10 w-10 shrink-0 rounded-lg border border-black/5 bg-white object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-black/10 bg-cream text-[10px] text-muted">
                            N/A
                          </div>
                        )}
                        <span>
                          {i.qty} × {i.brand ? `${i.brand} — ` : ""}
                          {i.name}
                        </span>
                      </span>
                      <span className="shrink-0 text-muted">
                        {formatMAD(i.price * i.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
