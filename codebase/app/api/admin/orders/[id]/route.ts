import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OrderModel, { ORDER_STATUSES } from "@/models/Order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

// PATCH /api/admin/orders/[id] — update the order status.
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { status } = await req.json();
    if (!ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }
    await connectDB();
    const order = await OrderModel.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    ).lean();
    if (!order) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (err) {
    console.error("[admin/orders PATCH]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
