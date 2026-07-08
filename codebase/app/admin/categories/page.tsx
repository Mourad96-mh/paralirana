"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/adminApi";
import { slugify } from "@/lib/slug";

type AdminSubcategory = { slug: string; name: string };

type AdminCategory = {
  _id: string;
  slug: string;
  name: string;
  tagline?: string;
  icon?: string;
  image?: string;
  order?: number;
  subcategories?: AdminSubcategory[];
};

type FormState = {
  name: string;
  tagline: string;
  icon: string;
  image: string;
  order: string;
  subcategories: string; // one "Nom" per line
};

const empty: FormState = {
  name: "",
  tagline: "",
  icon: "",
  image: "",
  order: "",
  subcategories: "",
};

function toForm(c: AdminCategory): FormState {
  return {
    name: c.name,
    tagline: c.tagline ?? "",
    icon: c.icon ?? "",
    image: c.image ?? "",
    order: c.order != null ? String(c.order) : "",
    subcategories: (c.subcategories ?? []).map((s) => s.name).join("\n"),
  };
}

function toPayload(f: FormState) {
  return {
    name: f.name.trim(),
    tagline: f.tagline.trim(),
    icon: f.icon.trim(),
    image: f.image.trim() || undefined,
    order: f.order ? Number(f.order) : 0,
    subcategories: f.subcategories
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({ name, slug: slugify(name) })),
  };
}

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null); // null = closed, "new" = create
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await adminApi.listCategories();
      setCategories(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setForm(empty);
    setEditingId("new");
    setError("");
  }

  function openEdit(c: AdminCategory) {
    setForm(toForm(c));
    setEditingId(c._id);
    setError("");
  }

  function close() {
    setEditingId(null);
    setError("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Le nom de la catégorie est requis.");
      return;
    }
    setSaving(true);
    try {
      if (editingId === "new") {
        await adminApi.createCategory(toPayload(form));
      } else {
        await adminApi.updateCategory(editingId!, toPayload(form));
      }
      close();
      await load();
    } catch (err) {
      setError((err as Error).message || "Échec de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  async function remove(c: AdminCategory) {
    if (!confirm(`Supprimer la catégorie « ${c.name} » ?`)) return;
    setError("");
    try {
      await adminApi.deleteCategory(c._id);
      await load();
    } catch (err) {
      setError((err as Error).message || "Échec de la suppression");
    }
  }

  return (
    <AdminShell title="Catégories">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted">
          Gérez les catégories du catalogue. Elles apparaissent aussitôt dans le
          menu et le formulaire produit ; la page dédiée d&apos;une nouvelle
          catégorie (<span className="font-mono">/slug</span>) est générée au
          prochain déploiement du site.
        </p>
        <button
          onClick={openNew}
          className="shrink-0 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-white hover:bg-gold-dark"
        >
          + Nouvelle catégorie
        </button>
      </div>

      {error && !editingId && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-muted">Chargement…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-muted">
                <th className="px-4 py-3 font-medium">Catégorie</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Sous-catégories</th>
                <th className="px-4 py-3 font-medium">Ordre</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{c.icon || "🏷️"}</span>
                      <div>
                        <div className="font-medium text-green">{c.name}</div>
                        {c.tagline ? (
                          <div className="text-xs text-muted">{c.tagline}</div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    /{c.slug}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {c.subcategories?.length
                      ? c.subcategories.map((s) => s.name).join(", ")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">{c.order ?? 0}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(c)}
                      className="text-sm font-medium text-green hover:text-gold-dark"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => remove(c)}
                      className="ml-3 text-sm text-muted hover:text-red-500"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    Aucune catégorie.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editingId && (
        <CategoryForm
          isNew={editingId === "new"}
          form={form}
          setForm={setForm}
          saving={saving}
          uploading={uploading}
          setUploading={setUploading}
          error={error}
          setError={setError}
          onSave={save}
          onClose={close}
        />
      )}
    </AdminShell>
  );
}

function CategoryForm({
  isNew,
  form,
  setForm,
  saving,
  uploading,
  setUploading,
  error,
  setError,
  onSave,
  onClose,
}: {
  isNew: boolean;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  saving: boolean;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}) {
  const set =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
    };

  const input =
    "w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none";

  const previewSlug = slugify(form.name);

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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-green">
            {isNew ? "Nouvelle catégorie" : "Modifier la catégorie"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-green">
            ✕
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-green">Nom *</label>
            <input value={form.name} onChange={set("name")} className={input} />
            {form.name.trim() && (
              <p className="mt-1 text-xs text-muted">
                URL : <span className="font-mono">/{previewSlug || "—"}</span>
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-green">
              Accroche (tagline)
            </label>
            <input
              value={form.tagline}
              onChange={set("tagline")}
              className={input}
              placeholder="Soins du visage, nettoyants et anti-âge"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-green">
                Icône (emoji)
              </label>
              <input
                value={form.icon}
                onChange={set("icon")}
                className={input}
                placeholder="🧴"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-green">
                Ordre d&apos;affichage
              </label>
              <input
                type="number"
                value={form.order}
                onChange={set("order")}
                className={input}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-green">
              Image (tuile de catégorie)
            </label>
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
              Sous-catégories (une par ligne)
            </label>
            <textarea
              value={form.subcategories}
              onChange={set("subcategories")}
              rows={5}
              className={input}
              placeholder={"Nettoyants & Démaquillants\nHydratants\nSérums & Traitements"}
            />
            <p className="mt-1 text-xs text-muted">
              Le slug de chaque sous-catégorie est généré automatiquement à partir
              du nom.
            </p>
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
