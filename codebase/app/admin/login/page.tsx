"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminApi, setToken } from "@/lib/adminApi";

export default function LoginPage() {
  // useSearchParams must be inside a Suspense boundary or `next build` fails.
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await adminApi.login(email, password);
      setToken(data.token);
      const from = params.get("from") || "/admin";
      router.replace(from);
    } catch (err) {
      setError((err as Error).message || "Connexion échouée");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="font-display text-2xl font-bold text-green">Para</span>
          <span className="font-display text-2xl font-bold text-gold">
            {" "}
            Lirana
          </span>
          <p className="mt-1 text-sm text-muted">Espace administration</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-green">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-green">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green px-4 py-2.5 font-semibold text-white hover:bg-green/90 disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
