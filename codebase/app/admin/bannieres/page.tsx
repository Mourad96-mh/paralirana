"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/adminApi";

type AdminBanner = {
  _id: string;
  image: string;
  imageMobile?: string;
  link?: string;
  tag?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  showCta?: boolean;
  order?: number;
  active?: boolean;
};

type FormState = {
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  showCta: boolean;
  link: string;
  image: string;
  imageMobile: string;
  order: string;
  active: boolean;
};

const empty: FormState = {
  tag: "",
  title: "",
  subtitle: "",
  ctaText: "",
  showCta: true,
  link: "",
  image: "",
  imageMobile: "",
  order: "",
  active: true,
};

function toForm(b: AdminBanner): FormState {
  return {
    tag: b.tag ?? "",
    title: b.title ?? "",
    subtitle: b.subtitle ?? "",
    ctaText: b.ctaText ?? "",
    showCta: b.showCta !== false,
    link: b.link ?? "",
    image: b.image ?? "",
    imageMobile: b.imageMobile ?? "",
    order: b.order != null ? String(b.order) : "",
    active: b.active !== false,
  };
}

function toPayload(f: FormState) {
  return {
    tag: f.tag.trim(),
    title: f.title.trim(),
    subtitle: f.subtitle.trim(),
    ctaText: f.ctaText.trim(),
    showCta: f.showCta,
    link: f.link.trim() || "/",
    image: f.image.trim(),
    imageMobile: f.imageMobile.trim(),
    order: f.order ? Number(f.order) : 0,
    active: f.active,
  };
}

// Quel champ image est en cours de téléversement (les deux widgets partagent la page).
type UploadingField = "" | "image" | "imageMobile";

export default function BannersAdmin() {
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null); // null = closed, "new" = create
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<UploadingField>("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await adminApi.listBanners();
      setBanners(data || []);
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

  function openEdit(b: AdminBanner) {
    setForm(toForm(b));
    setEditingId(b._id);
    setError("");
  }

  function close() {
    setEditingId(null);
    setError("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.image.trim()) {
      setError("L'image desktop est requise.");
      return;
    }
    setSaving(true);
    try {
      if (editingId === "new") {
        await adminApi.createBanner(toPayload(form));
      } else {
        await adminApi.updateBanner(editingId!, toPayload(form));
      }
      close();
      await load();
    } catch (err) {
      setError((err as Error).message || "Échec de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  async function remove(b: AdminBanner) {
    if (!confirm(`Supprimer la bannière « ${b.title || b.link || b._id} » ?`)) return;
    setError("");
    try {
      await adminApi.deleteBanner(b._id);
      await load();
    } catch (err) {
      setError((err as Error).message || "Échec de la suppression");
    }
  }

  return (
    <AdminShell title="Bannières">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted">
          Gérez les diapositives du hero d&apos;accueil. L&apos;image sert de
          fond (~1600×600 px desktop, carrée ~800×800 px mobile optionnelle) —
          le texte est superposé par le site, inutile de l&apos;écrire dans
          l&apos;image. Les bannières actives apparaissent aussitôt sur le
          site ; le HTML statique est re-baké au prochain déploiement.
        </p>
        <button
          onClick={openNew}
          className="shrink-0 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-white hover:bg-gold-dark"
        >
          + Nouvelle bannière
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
                <th className="px-4 py-3 font-medium">Bannière</th>
                <th className="px-4 py-3 font-medium">Lien</th>
                <th className="px-4 py-3 font-medium">Ordre</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b._id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={b.image}
                        alt=""
                        className="h-10 w-24 rounded-lg border border-black/5 bg-cream object-cover"
                      />
                      <div className="font-medium text-green">
                        {b.title || "—"}
                      </div>
                    </div>
                  </td>
                  <td className="max-w-[16rem] truncate px-4 py-3 font-mono text-xs text-muted">
                    {b.link || "/"}
                  </td>
                  <td className="px-4 py-3 text-muted">{b.order ?? 0}</td>
                  <td className="px-4 py-3">
                    {b.active !== false ? (
                      <span className="rounded-full bg-green/10 px-2.5 py-0.5 text-xs font-medium text-green">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-medium text-muted">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(b)}
                      className="text-sm font-medium text-green hover:text-gold-dark"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => remove(b)}
                      className="ml-3 text-sm text-muted hover:text-red-500"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    Aucune bannière. La page d&apos;accueil affiche le diaporama
                    produits par défaut.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editingId && (
        <BannerForm
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

function BannerForm({
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
  uploading: UploadingField;
  setUploading: React.Dispatch<React.SetStateAction<UploadingField>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}) {
  const set =
    (k: "tag" | "title" | "subtitle" | "ctaText" | "link" | "image" | "imageMobile" | "order") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
    };

  const input =
    "w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none";

  const onUpload =
    (field: "image" | "imageMobile") =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(field);
      setError("");
      try {
        const data = await adminApi.upload(file, "paralirana/banners");
        setForm((f) => ({ ...f, [field]: data.url }));
      } catch (err) {
        setError(
          (err as Error).message || "Téléversement impossible — collez une URL d'image."
        );
      } finally {
        setUploading("");
        e.target.value = "";
      }
    };

  function imageField(
    field: "image" | "imageMobile",
    label: string,
    hint?: string
  ) {
    return (
      <div>
        <label className="mb-1 block text-sm font-medium text-green">{label}</label>
        <input
          value={form[field]}
          onChange={set(field)}
          className={input}
          placeholder="URL de l'image (ou téléversez ci-dessous)"
        />
        <div className="mt-2 flex items-center gap-3">
          <label className="cursor-pointer rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-green hover:bg-cream">
            {uploading === field ? "Téléversement…" : "Téléverser une image"}
            <input
              type="file"
              accept="image/*"
              onChange={onUpload(field)}
              className="hidden"
              disabled={uploading !== ""}
            />
          </label>
          {form[field] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form[field]}
              alt=""
              className="h-12 w-28 rounded-lg border border-black/5 bg-white object-cover"
            />
          )}
        </div>
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-green">
            {isNew ? "Nouvelle bannière" : "Modifier la bannière"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-green">
            ✕
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-green">
              Accroche (tag)
            </label>
            <input
              value={form.tag}
              onChange={set("tag")}
              className={input}
              placeholder="Offre de l'été"
            />
            <p className="mt-1 text-xs text-muted">
              Petit libellé affiché au-dessus du titre.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-green">Titre</label>
            <input
              value={form.title}
              onChange={set("title")}
              className={input}
              placeholder="Protection solaire à prix discount"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-green">
              Sous-titre
            </label>
            <textarea
              value={form.subtitle}
              onChange={set("subtitle")}
              rows={2}
              className={input}
              placeholder="Écrans SPF 50+ des marques dermatologiques de référence."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-green">
              Lien de destination
            </label>
            <input
              value={form.link}
              onChange={set("link")}
              className={input}
              placeholder="/solaire ou https://…"
            />
            <p className="mt-1 text-xs text-muted">
              Toute la bannière est cliquable vers ce lien.
            </p>
          </div>

          <div className="grid grid-cols-2 items-end gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-green">
                Texte du bouton
              </label>
              <input
                value={form.ctaText}
                onChange={set("ctaText")}
                className={input}
                placeholder="Découvrir"
              />
            </div>
            <label className="flex items-center gap-2 pb-2 text-sm font-medium text-green">
              <input
                type="checkbox"
                checked={form.showCta}
                onChange={(e) =>
                  setForm((f) => ({ ...f, showCta: e.target.checked }))
                }
                className="h-4 w-4 accent-gold"
              />
              Afficher le bouton
            </label>
          </div>

          {imageField(
            "image",
            "Image de fond desktop * (~1600×600 px)",
            "Sert de fond sous le texte — évitez le texte dans l'image. Privilégiez une image compressée (< 300 Ko)."
          )}

          {imageField(
            "imageMobile",
            "Image mobile (optionnelle, carrée ~800×800 px)",
            "À défaut, l'image desktop est utilisée sur mobile."
          )}

          <div className="grid grid-cols-2 items-end gap-3">
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
            <label className="flex items-center gap-2 pb-2 text-sm font-medium text-green">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm((f) => ({ ...f, active: e.target.checked }))
                }
                className="h-4 w-4 accent-gold"
              />
              Active
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
