"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/adminApi";
import type { Category } from "@/lib/products";
import { categories } from "@/lib/products";
import { useLiveCategories } from "@/lib/categories";
import { formatMAD } from "@/lib/format";
import { slugify } from "@/lib/slug";

// Valeur sentinelle du menu déroulant catégorie : « saisir une nouvelle catégorie ».
const NEW_CATEGORY = "__new__";

type AdminProduct = {
  _id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  image?: string;
  shortDescription?: string;
  description?: string;
  conseils?: string;
  composition?: string;
  features?: string[];
  rating?: number;
  reviews?: number;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
};

type FormState = {
  name: string;
  brand: string;
  category: string;
  newCategory: string; // nom saisi quand category === NEW_CATEGORY
  price: string;
  oldPrice: string;
  image: string;
  shortDescription: string;
  description: string;
  conseils: string;
  composition: string;
  features: string; // one per line
  rating: string;
  reviews: string;
  inStock: boolean;
  isNew: boolean;
  isBestseller: boolean;
};

const empty: FormState = {
  name: "",
  brand: "",
  category: categories[0].slug,
  newCategory: "",
  price: "",
  oldPrice: "",
  image: "",
  shortDescription: "",
  description: "",
  conseils: "",
  composition: "",
  features: "",
  rating: "",
  reviews: "",
  inStock: true,
  isNew: false,
  isBestseller: false,
};

function toForm(p: AdminProduct): FormState {
  return {
    name: p.name,
    brand: p.brand,
    category: p.category,
    newCategory: "",
    price: String(p.price ?? ""),
    oldPrice: p.oldPrice != null ? String(p.oldPrice) : "",
    image: p.image ?? "",
    shortDescription: p.shortDescription ?? "",
    description: p.description ?? "",
    conseils: p.conseils ?? "",
    composition: p.composition ?? "",
    features: (p.features ?? []).join("\n"),
    rating: p.rating != null ? String(p.rating) : "",
    reviews: p.reviews != null ? String(p.reviews) : "",
    inStock: p.inStock,
    isNew: !!p.isNew,
    isBestseller: !!p.isBestseller,
  };
}

function toPayload(f: FormState) {
  return {
    name: f.name.trim(),
    brand: f.brand.trim(),
    category: f.category,
    price: Number(f.price) || 0,
    oldPrice: f.oldPrice ? Number(f.oldPrice) : undefined,
    image: f.image.trim() || undefined,
    shortDescription: f.shortDescription.trim(),
    description: f.description.trim(),
    conseils: f.conseils.trim(),
    composition: f.composition.trim(),
    features: f.features
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    rating: f.rating ? Number(f.rating) : 0,
    reviews: f.reviews ? Number(f.reviews) : 0,
    inStock: f.inStock,
    isNew: f.isNew,
    isBestseller: f.isBestseller,
  };
}

export default function ProductsAdmin() {
  const { categories: liveCategories, reload: reloadCategories } =
    useLiveCategories();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null); // null = closed, "new" = create
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await adminApi.listProducts();
      setProducts(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }, [products, query]);

  function openNew() {
    setForm(empty);
    setEditingId("new");
    setError("");
  }

  function openEdit(p: AdminProduct) {
    setForm(toForm(p));
    setEditingId(p._id);
    setError("");
  }

  function close() {
    setEditingId(null);
    setError("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.brand.trim() || !form.price) {
      setError("Nom, marque et prix sont requis.");
      return;
    }

    // Résoudre la catégorie : soit une existante, soit une nouvelle saisie ici.
    let categorySlug = form.category;
    if (form.category === NEW_CATEGORY) {
      const newName = form.newCategory.trim();
      if (!newName) {
        setError("Entrez le nom de la nouvelle catégorie.");
        return;
      }
      categorySlug = slugify(newName);
      if (!categorySlug) {
        setError("Nom de catégorie invalide.");
        return;
      }
      setSaving(true);
      try {
        await adminApi.createCategory({ name: newName });
        reloadCategories(); // la nouvelle catégorie apparaît dans la liste
      } catch (err) {
        // 409 = la catégorie existe déjà → on la réutilise simplement.
        if ((err as Error & { status?: number }).status !== 409) {
          setSaving(false);
          setError(
            (err as Error).message || "Échec de la création de la catégorie"
          );
          return;
        }
      }
    }

    setSaving(true);
    try {
      const payload = { ...toPayload(form), category: categorySlug };
      if (editingId === "new") {
        await adminApi.createProduct(payload);
      } else {
        await adminApi.updateProduct(editingId!, payload);
      }
      close();
      await load();
    } catch (err) {
      setError((err as Error).message || "Échec de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  async function remove(p: AdminProduct) {
    if (!confirm(`Supprimer « ${p.name} » ? Cette action est irréversible.`))
      return;
    try {
      await adminApi.deleteProduct(p._id);
      await load();
    } catch (err) {
      setError((err as Error).message || "Échec de la suppression");
    }
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = await adminApi.upload(file);
      setForm((f) => ({ ...f, image: data.url }));
    } catch (err) {
      setError(
        (err as Error).message || "Téléversement impossible — collez une URL d'image."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <AdminShell title="Produits">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un produit…"
          className="w-64 rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none"
        />
        <button
          onClick={openNew}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-white hover:bg-gold-dark"
        >
          + Nouveau produit
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Chargement…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-muted">
                <th className="px-4 py-3 font-medium">Produit</th>
                <th className="px-4 py-3 font-medium">Catégorie</th>
                <th className="px-4 py-3 font-medium">Prix</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-12 w-12 shrink-0 rounded-lg border border-black/5 bg-white object-contain p-1"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-black/10 bg-cream text-[10px] text-muted">
                          N/A
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-green">{p.name}</div>
                        <div className="text-xs uppercase tracking-wide text-muted">
                          {p.brand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {liveCategories.find((c) => c.slug === p.category)?.name ||
                      p.category}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-green">
                      {formatMAD(p.price)}
                    </span>
                    {p.oldPrice ? (
                      <span className="ml-1 text-xs text-muted line-through">
                        {formatMAD(p.oldPrice)}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {p.inStock ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        En stock
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                        Rupture
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-sm font-medium text-green hover:text-gold-dark"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => remove(p)}
                      className="ml-3 text-sm text-muted hover:text-red-500"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    Aucun produit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editingId && (
        <ProductForm
          isNew={editingId === "new"}
          form={form}
          setForm={setForm}
          categories={liveCategories}
          saving={saving}
          uploading={uploading}
          error={error}
          onUpload={onUpload}
          onSave={save}
          onClose={close}
        />
      )}
    </AdminShell>
  );
}

function ProductForm({
  isNew,
  form,
  setForm,
  categories,
  saving,
  uploading,
  error,
  onUpload,
  onSave,
  onClose,
}: {
  isNew: boolean;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  categories: Category[];
  saving: boolean;
  uploading: boolean;
  error: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}) {
  const set =
    (k: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const target = e.target;
      const value =
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : target.value;
      setForm((f) => ({ ...f, [k]: value }));
    };

  const input =
    "w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-green">
            {isNew ? "Nouveau produit" : "Modifier le produit"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-green">
            ✕
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-green">Nom *</label>
            <input value={form.name} onChange={set("name")} className={input} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-green">
                Marque *
              </label>
              <input value={form.brand} onChange={set("brand")} className={input} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-green">
                Catégorie *
              </label>
              <select
                value={form.category}
                onChange={set("category")}
                className={input}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
                <option value={NEW_CATEGORY}>➕ Nouvelle catégorie…</option>
              </select>
              {form.category === NEW_CATEGORY && (
                <input
                  value={form.newCategory}
                  onChange={set("newCategory")}
                  className={`${input} mt-2`}
                  placeholder="Nom de la nouvelle catégorie"
                  autoFocus
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-green">
                Prix (MAD) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={set("price")}
                className={input}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-green">
                Ancien prix (MAD)
              </label>
              <input
                type="number"
                value={form.oldPrice}
                onChange={set("oldPrice")}
                className={input}
                placeholder="promo"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-green">Image</label>
            <input
              value={form.image}
              onChange={set("image")}
              className={input}
              placeholder="URL de l'image (ou téléversez ci-dessous)"
            />
            <div className="mt-2 flex items-center gap-3">
              <label className="cursor-pointer rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-green hover:bg-cream">
                {uploading ? "Téléversement…" : "Téléverser une image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={onUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {form.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.image}
                  alt=""
                  className="h-12 w-12 rounded-lg border border-black/5 bg-white object-contain p-1"
                />
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-green">
              Description courte
            </label>
            <input
              value={form.shortDescription}
              onChange={set("shortDescription")}
              className={input}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-green">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={4}
              className={input}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-green">
              Conseil d&apos;utilisation
            </label>
            <textarea
              value={form.conseils}
              onChange={set("conseils")}
              rows={3}
              className={input}
              placeholder="Comment utiliser le produit…"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-green">
              Composition
            </label>
            <textarea
              value={form.composition}
              onChange={set("composition")}
              rows={3}
              className={input}
              placeholder="Ingrédients clés / composition…"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-green">
              Caractéristiques (une par ligne)
            </label>
            <textarea
              value={form.features}
              onChange={set("features")}
              rows={4}
              className={input}
              placeholder={"Peaux sensibles\nSans parfum\n400 ml"}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-green">
                Note (0-5)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.rating}
                onChange={set("rating")}
                className={input}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-green">
                Nombre d&apos;avis
              </label>
              <input
                type="number"
                value={form.reviews}
                onChange={set("reviews")}
                className={input}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm text-green">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={set("inStock")}
              />
              En stock
            </label>
            <label className="flex items-center gap-2 text-sm text-green">
              <input type="checkbox" checked={form.isNew} onChange={set("isNew")} />
              Nouveau
            </label>
            <label className="flex items-center gap-2 text-sm text-green">
              <input
                type="checkbox"
                checked={form.isBestseller}
                onChange={set("isBestseller")}
              />
              Bestseller
            </label>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-green px-4 py-2.5 font-semibold text-white hover:bg-green/90 disabled:opacity-60"
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-black/10 px-4 py-2.5 font-medium text-green hover:bg-cream"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
