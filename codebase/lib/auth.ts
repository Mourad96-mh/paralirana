// ---------------------------------------------------------------------------
// Admin session helpers — JWT via `jose` (edge-compatible, so middleware works).
// ---------------------------------------------------------------------------

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const AUTH_COOKIE = "admin_token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set (see .env.example).");
  return new TextEncoder().encode(secret);
}

export type Session = { sub: string; email: string };

export async function signToken(payload: Session): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifyToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return { sub: String(payload.sub), email: String(payload.email) };
  } catch {
    return null;
  }
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};

// Server-side session read (for Route Handlers / Server Components).
export async function getSession(): Promise<Session | null> {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
