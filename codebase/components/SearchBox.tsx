"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCatalog } from "@/lib/catalog";
import { useCategories } from "@/lib/categories";
import { featuredBrands } from "@/lib/brands";
import { searchIn } from "@/lib/data/products";
import { formatMAD } from "@/lib/format";
import type { Product } from "@/lib/products";

// Recherche instantanée façon FiboSearch (le plugin du concurrent) : dès
// 2 caractères, un panneau sous le champ propose catégories, marques et
// produits (vignette + nom + prix), avec « Voir tous les résultats » vers
// /recherche. Tout est calculé côté client sur le catalogue live — aucun
// appel réseau par frappe.

const MIN_CHARS = 2;
const MAX_PRODUCTS = 6;
const MAX_TAXONOMIES = 3;

// Normalisation accents/casse — même logique que searchIn (lib/data/products).
const normalize = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// Met en gras la partie du libellé qui correspond à la requête (comme
// FiboSearch). La normalisation caractère par caractère garde les index
// alignés avec la chaîne d'origine.
function Highlight({ text, query }: { text: string; query: string }) {
  const chars = Array.from(text);
  const normChars = chars.map((c) => normalize(c) || c);
  const start = normChars.join("").indexOf(normalize(query));
  if (start < 0 || !query) return <>{text}</>;

  // Repère les bornes dans la chaîne d'origine (1 caractère normalisé peut
  // provenir d'exactement 1 caractère d'origine ici).
  let i = 0;
  let from = 0;
  for (let c = 0; c < chars.length; c++) {
    if (i === start) {
      from = c;
      break;
    }
    i += normChars[c].length;
    from = c + 1;
  }
  const len = normalize(query).length;
  let taken = 0;
  let to = from;
  while (to < chars.length && taken < len) {
    taken += normChars[to].length;
    to++;
  }

  return (
    <>
      {chars.slice(0, from).join("")}
      <strong className="font-semibold text-green">
        {chars.slice(from, to).join("")}
      </strong>
      {chars.slice(to).join("")}
    </>
  );
}

type Suggestion =
  | { kind: "category"; label: string; href: string }
  | { kind: "brand"; label: string; href: string }
  | { kind: "product"; product: Product; href: string }
  | { kind: "all"; label: string; href: string };

export default function SearchBox({ id }: { id: string }) {
  const router = useRouter();
  const { products } = useCatalog();
  const { categories } = useCategories();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1); // index clavier dans la liste plate
  const rootRef = useRef<HTMLDivElement>(null);
  const q = query.trim();

  // Fermer au clic hors du champ / panneau.
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const { items, matches, productTotal } = useMemo(() => {
    if (q.length < MIN_CHARS) {
      return { items: [] as Suggestion[], matches: false, productTotal: 0 };
    }
    const nq = normalize(q);

    const cats = categories
      .filter((c) => normalize(c.name).includes(nq))
      .slice(0, MAX_TAXONOMIES)
      .map<Suggestion>((c) => ({
        kind: "category",
        label: c.name,
        href: `/${c.slug}`,
      }));

    // Seules les marques « featured » ont une page /marque/… dans l'export statique.
    const brands = featuredBrands
      .filter((b) => normalize(b.name).includes(nq))
      .slice(0, MAX_TAXONOMIES)
      .map<Suggestion>((b) => ({
        kind: "brand",
        label: b.name,
        href: `/marque/${b.slug}`,
      }));

    const found = searchIn(products, q);
    const prods = found.slice(0, MAX_PRODUCTS).map<Suggestion>((p) => ({
      kind: "product",
      product: p,
      href: `/produit/${p.slug}`,
    }));

    const list = [...cats, ...brands, ...prods];
    if (found.length > 0) {
      list.push({
        kind: "all",
        label: `Voir tous les résultats (${found.length})`,
        href: `/recherche?q=${encodeURIComponent(q)}`,
      });
    }
    return { items: list, matches: list.length > 0, productTotal: found.length };
  }, [q, products, categories]);

  // Réinitialiser la sélection clavier quand la liste change.
  useEffect(() => {
    setActive(-1);
  }, [q]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (active >= 0 && items[active]) {
      go(items[active].href);
      return;
    }
    if (!q) return;
    go(`/recherche?q=${encodeURIComponent(q)}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a <= 0 ? items.length - 1 : a - 1));
    }
  }

  const showPanel = open && q.length >= MIN_CHARS;

  // Index plat → rendu groupé avec en-têtes (comme FiboSearch).
  const groups: { heading: string; from: number; to: number }[] = [];
  {
    let i = 0;
    const count = (kind: Suggestion["kind"]) =>
      items.filter((s) => s.kind === kind).length;
    for (const [kind, heading] of [
      ["category", "Catégories"],
      ["brand", "Marques"],
      ["product", "Produits"],
    ] as const) {
      const n = count(kind);
      if (n > 0) {
        groups.push({ heading, from: i, to: i + n });
        i += n;
      }
    }
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <form onSubmit={submit} role="search">
        <div className="relative w-full">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Rechercher un produit, une marque…"
            aria-label="Rechercher"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={`${id}-listbox`}
            aria-autocomplete="list"
            autoComplete="off"
            className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-4 pr-11 text-sm outline-none focus:border-gold"
          />
          <button
            type="submit"
            aria-label="Lancer la recherche"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-green p-2 text-white transition hover:bg-green-dark"
          >
            <SearchIcon />
          </button>
        </div>
      </form>

      {showPanel && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-black/5 bg-white py-2 shadow-lg"
        >
          {!matches ? (
            <p className="px-4 py-3 text-sm text-muted">
              Aucun résultat pour «&nbsp;{q}&nbsp;». Essayez le nom d&apos;une
              marque ou d&apos;un type de soin.
            </p>
          ) : (
            <>
              {groups.map((g) => (
                <div key={g.heading}>
                  <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                    {g.heading}
                  </p>
                  {items.slice(g.from, g.to).map((s, j) => {
                    const idx = g.from + j;
                    const isActive = idx === active;
                    if (s.kind === "product") {
                      const p = s.product;
                      return (
                        <Link
                          key={p.id}
                          href={s.href}
                          role="option"
                          aria-selected={isActive}
                          onClick={() => setOpen(false)}
                          onMouseEnter={() => setActive(idx)}
                          className={`flex items-center gap-3 px-4 py-2 ${
                            isActive ? "bg-cream" : "hover:bg-cream"
                          }`}
                        >
                          {p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.image}
                              alt=""
                              loading="lazy"
                              className="h-10 w-10 shrink-0 rounded-lg border border-black/5 bg-white object-contain p-0.5"
                            />
                          ) : (
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/5 bg-cream font-display text-sm font-bold text-green/60">
                              {p.brand.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm text-ink">
                              <Highlight text={p.name} query={q} />
                            </span>
                            <span className="block text-xs text-muted">
                              {p.brand}
                            </span>
                          </span>
                          <span className="shrink-0 text-right">
                            {p.oldPrice ? (
                              <span className="block text-xs text-muted line-through">
                                {formatMAD(p.oldPrice)}
                              </span>
                            ) : null}
                            <span className="block text-sm font-semibold text-gold-dark">
                              {formatMAD(p.price)}
                            </span>
                          </span>
                        </Link>
                      );
                    }
                    if (s.kind === "all") return null; // rendu en pied de panneau
                    return (
                      <Link
                        key={s.href}
                        href={s.href}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => setOpen(false)}
                        onMouseEnter={() => setActive(idx)}
                        className={`block px-4 py-2 text-sm text-ink ${
                          isActive ? "bg-cream" : "hover:bg-cream"
                        }`}
                      >
                        <Highlight text={s.label} query={q} />
                      </Link>
                    );
                  })}
                </div>
              ))}

              {productTotal > 0 && (
                <Link
                  href={`/recherche?q=${encodeURIComponent(q)}`}
                  role="option"
                  aria-selected={active === items.length - 1}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setActive(items.length - 1)}
                  className={`mt-1 block border-t border-black/5 px-4 pb-1 pt-3 text-center text-sm font-semibold text-green ${
                    active === items.length - 1 ? "bg-cream" : "hover:text-gold-dark"
                  }`}
                >
                  Voir tous les résultats ({productTotal})
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
