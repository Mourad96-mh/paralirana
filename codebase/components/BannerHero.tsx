"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Banner } from "@/lib/products";
import { useBanners } from "@/lib/banners";
import HeroCarousel from "@/components/HeroCarousel";

// Hero de la page d'accueil, même comportement que le projet pour-bebe :
// images de fond en fondu-enchaîné + texte de la diapositive en HTML par-dessus
// (tag, titre, sous-titre, bouton — gérés depuis /admin/bannieres), toute la
// bannière cliquable via un lien invisible plein écran, flèches quand il y a
// plusieurs diapositives, défilement auto toutes les 5 s.
// Sans bannière active : retombe sur le hero d'origine (diaporama produits +
// texte statique).

const AUTOPLAY_MS = 5000;

// Le texte statique d'origine, réutilisé quand aucune bannière n'est active.
function StaticHeroText() {
  return (
    <>
      <p className="mb-3 inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-light">
        Parapharmacie en ligne · Maroc
      </p>
      <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
        Parapharmacie en ligne au Maroc,
        <br />
        <span className="text-gold">à prix discount</span>
      </h1>
      <p className="mt-4 max-w-md text-white/85">
        Soins visage, capillaire, solaire, bébé et compléments alimentaires.
        Produits 100% authentiques, commande facile sur WhatsApp et livraison
        partout au Maroc.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/visage"
          className="rounded-lg bg-gold px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-gold-dark"
        >
          Découvrir la boutique
        </Link>
        <Link
          href="/complements-alimentaires"
          className="rounded-lg border border-white/40 px-5 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
        >
          Compléments alimentaires
        </Link>
      </div>
    </>
  );
}

export default function BannerHero() {
  const { banners } = useBanners();

  if (!banners.length) {
    return (
      <section className="relative overflow-hidden bg-green text-white">
        <HeroCarousel />
        <div className="container relative py-20 lg:py-28">
          <div className="max-w-xl">
            <StaticHeroText />
          </div>
        </div>
      </section>
    );
  }

  return <HeroSlides banners={banners} />;
}

// Lien plein écran ou bouton CTA : chemin interne → <Link>, sinon <a> externe.
function SlideLink({
  link,
  className,
  ariaLabel,
  tabIndex,
  children,
}: {
  link: string;
  className: string;
  ariaLabel?: string;
  tabIndex?: number;
  children?: React.ReactNode;
}) {
  if (link.startsWith("/")) {
    return (
      <Link href={link} className={className} aria-label={ariaLabel} tabIndex={tabIndex}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
    >
      {children}
    </a>
  );
}

function HeroSlides({ banners }: { banners: Banner[] }) {
  const n = banners.length;
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const next = useCallback(() => setActive((a) => (a + 1) % n), [n]);
  const prev = useCallback(() => setActive((a) => (a - 1 + n) % n), [n]);

  // Repartir de la première diapositive si la liste change (rafraîchissement live).
  useEffect(() => {
    setActive(0);
  }, [n]);

  useEffect(() => {
    if (n <= 1 || reducedMotion) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [n, reducedMotion, next]);

  const slide = banners[active] ?? banners[0];

  return (
    <section className="relative overflow-hidden bg-green text-white">
      {/* Images de fond en fondu-enchaîné (le texte est en HTML → alt vide) */}
      {banners.map((b, i) => (
        <picture key={b.id}>
          <source media="(min-width: 768px)" srcSet={b.image} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={b.imageMobile || b.image}
            alt=""
            aria-hidden
            draggable={false}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : undefined}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        </picture>
      ))}

      {/* Toute la bannière est cliquable */}
      {slide.link && (
        <SlideLink
          link={slide.link}
          className="absolute inset-0 z-[1] cursor-pointer"
          ariaLabel={slide.title || "Voir la sélection"}
          tabIndex={-1}
        />
      )}

      {/* Contenu — pointer-events désactivés sauf sur le bouton */}
      <div className="container pointer-events-none relative z-[2] py-20 lg:py-28">
        <div className="max-w-xl">
          {slide.tag && (
            <p className="mb-3 inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-light">
              {slide.tag}
            </p>
          )}
          {slide.title && (
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              {slide.title}
            </h1>
          )}
          {slide.subtitle && (
            <p className="mt-4 max-w-md text-white/85">{slide.subtitle}</p>
          )}
          {slide.showCta && slide.ctaText && slide.link && (
            <div className="mt-6">
              <SlideLink
                link={slide.link}
                className="pointer-events-auto inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-gold-dark"
              >
                {slide.ctaText}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </SlideLink>
            </div>
          )}
        </div>
      </div>

      {/* Flèches précédent / suivant */}
      {n > 1 && (
        <>
          <button
            type="button"
            aria-label="Diapositive précédente"
            onClick={prev}
            className="absolute left-3 top-1/2 z-[3] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/75 text-green transition hover:bg-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Diapositive suivante"
            onClick={next}
            className="absolute right-3 top-1/2 z-[3] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/75 text-green transition hover:bg-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}
