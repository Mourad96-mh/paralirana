"use client";

// HTTP client for the admin dashboard → talks to the Express API (server/ on Render).
// Reads the API URL from NEXT_PUBLIC_API_URL and attaches the JWT stored in localStorage.

const API = process.env.NEXT_PUBLIC_API_URL || "";
const TOKEN_KEY = "paralirana_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string) {
  if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, t);
}
export function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
}
export function isAuthed(): boolean {
  return !!getToken();
}

type Options = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  isForm?: boolean;
};

async function request(path: string, { method = "GET", body, auth = false, isForm = false }: Options = {}) {
  const headers: Record<string, string> = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: isForm ? (body as BodyInit) : body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    // Session expirée/invalide : on purge le token et on renvoie vers la connexion.
    if (res.status === 401 && auth) {
      clearToken();
      if (typeof window !== "undefined" && !window.location.pathname.endsWith("/admin/login")) {
        window.location.assign("/admin/login");
      }
    }
    const err = new Error((data && data.error) || `Erreur ${res.status}`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return data;
}

export const adminApi = {
  login: (email: string, password: string) =>
    request("/api/auth/login", { method: "POST", body: { email, password } }),

  listProducts: () => request("/api/products"),
  createProduct: (b: unknown) => request("/api/products", { method: "POST", body: b, auth: true }),
  updateProduct: (id: string, b: unknown) =>
    request(`/api/products/${id}`, { method: "PUT", body: b, auth: true }),
  deleteProduct: (id: string) => request(`/api/products/${id}`, { method: "DELETE", auth: true }),

  listCategories: () => request("/api/categories"),
  createCategory: (b: unknown) => request("/api/categories", { method: "POST", body: b, auth: true }),
  updateCategory: (id: string, b: unknown) =>
    request(`/api/categories/${id}`, { method: "PUT", body: b, auth: true }),
  deleteCategory: (id: string) => request(`/api/categories/${id}`, { method: "DELETE", auth: true }),

  listOrders: () => request("/api/orders", { auth: true }),
  updateOrderStatus: (id: string, status: string) =>
    request(`/api/orders/${id}`, { method: "PATCH", body: { status }, auth: true }),

  async upload(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    return request("/api/uploads", { method: "POST", body: fd, auth: true, isForm: true });
  },
};
