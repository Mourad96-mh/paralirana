import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OrderModel from "@/models/Order";
import ProductModel from "@/models/Product";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type IncomingItem = {
  id?: string;
  slug?: string;
  name: string;
  brand?: string;
  qty: number;
};

// POST /api/orders — public: persist a WhatsApp order from the cart.
// Prices/total are recomputed from the DB so a tampered client payload can't
// change what gets recorded.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, items } = body as {
      customer?: { name?: string; phone?: string; city?: string };
      items?: IncomingItem[];
    };

    if (!customer?.name?.trim() || !customer?.phone?.trim()) {
      return NextResponse.json(
        { error: "Nom et téléphone requis" },
        { status: 400 }
      );
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    await connectDB();

    // Resolve authoritative prices from the DB by slug.
    const slugs = items.map((i) => i.slug).filter(Boolean) as string[];
    const dbProducts = await ProductModel.find({ slug: { $in: slugs } })
      .select("slug name brand price image")
      .lean<
        { slug: string; name: string; brand: string; price: number; image?: string }[]
      >();
    const bySlug = new Map(dbProducts.map((p) => [p.slug, p]));

    const resolved = items.map((i) => {
      const match = i.slug ? bySlug.get(i.slug) : undefined;
      const qty = Math.max(1, Math.floor(Number(i.qty) || 1));
      return {
        productId: i.id,
        slug: i.slug,
        name: match?.name ?? i.name,
        brand: match?.brand ?? i.brand ?? "",
        image: match?.image ?? "",
        price: match?.price ?? 0,
        qty,
      };
    });

    const total = resolved.reduce((s, i) => s + i.price * i.qty, 0);

    const order = await OrderModel.create({
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        city: customer.city?.trim() ?? "",
      },
      items: resolved,
      total,
    });

    return NextResponse.json({ ok: true, id: String(order._id) }, { status: 201 });
  } catch (err) {
    console.error("[orders POST]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
