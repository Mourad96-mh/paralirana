import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OrderModel from "@/models/Order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/orders — most recent first.
export async function GET() {
  try {
    await connectDB();
    const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("[admin/orders GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
