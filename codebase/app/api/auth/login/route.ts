import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import AdminModel from "@/models/Admin";
import { signToken, AUTH_COOKIE, COOKIE_OPTIONS } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email et mot de passe requis" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const admin = await AdminModel.findOne({ email });
    const ok = admin && (await bcrypt.compare(password, admin.passwordHash));
    if (!ok) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    const token = await signToken({ sub: String(admin._id), email });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(AUTH_COOKIE, token, COOKIE_OPTIONS);
    return res;
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
