"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Banner } from "@/lib/products";
import { useBanners } from "@/lib/banners";
import HeroCarousel from "@/components/HeroCarousel";

// Homepage hero: full-width clickable banner carousel (slides managed from the
// admin, /admin/bannieres). Loop + autoplay + arrows + dots + touch swipe,
// hand-rolled (no carousel dependency). When no banner is active, falls back
// to the product-photo crossfade (HeroCarousel) in the same aspect box so the
// layout doesn't jump when live banners arrive.
export default function BannerHero() {
  const { banners } = useBanners();

  if (!banners.length) {
    return (
      <section
        className="relative aspect-square overflow-hidden bg-green md:aspect-[3/1]"
        aria-hidden
      >
        <HeroCarousel />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(18,32,9,0.45) 0%, rgba(43,74,17,0.10) 100%)",
          }}
        />
      </section>
    );
  }

  return <BannerCarousel banners={banners} />;
}

const AUTOPLAY_MS = 4500;
const TRANSITION = "transform 450ms ease";

function SlideImage({ banner, eager }: { banner: Banner; eager: boolean }) {
  return (
    <picture>
      {/* Art direction : image large sur desktop, carrée (si fournie) sur mobile */}
      <source media="(min-width: 768px)" srcSet={banner.image} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.imageMobile || banner.image}
        alt={banner.title}
        draggable={false}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        className="h-full w-full object-cover"
      />
    </picture>
  );
}

function BannerCarousel({ banners }: { banners: Banner[] }) {
  const n = banners.length;
  // Clones aux extrémités pour une boucle sans couture : [dernier, ...réels, premier].
  // `index` pointe dans ce tableau étendu ; 1 = première vraie bannière.
  const slides = n > 1 ? [banners[n - 1], ...banners, banners[0]] : banners;
  const [index, setIndex] = useState(n > 1 ? 1 : 0);
  const [noTransition, setNoTransition] = useState(false);

  // Glisser (souris + tactile) via pointer events.
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const didDragRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  const [hovering, setHovering] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const next = useCallback(() => {
    // Ne pas dépasser le clone : le saut de rebouclage se fait à transitionend.
    setIndex((i) => Math.min(i + 1, n + 1));
  }, [n]);
  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  // Défilement automatique — coupé au survol, pendant un glisser, et sous
  // prefers-reduced-motion. Recréé à chaque changement d'index pour repartir
  // du délai complet après une navigation manuelle.
  useEffect(() => {
    if (n <= 1 || reducedMotion || hovering || dragging) return;
    const t = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [n, reducedMotion, hovering, dragging, index, next]);

  // Rebouclage : arrivé sur un clone, sauter sans transition sur la vraie
  // diapositive, puis réactiver la transition à la frame suivante.
  function onTransitionEnd() {
    if (index === 0 || index === n + 1) {
      setNoTransition(true);
      setIndex(index === 0 ? n : 1);
    }
  }
  useEffect(() => {
    if (!noTransition) return;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setNoTransition(false))
    );
    return () => cancelAnimationFrame(raf);
  }, [noTransition]);

  function onPointerDown(e: React.PointerEvent) {
    if (n <= 1) return;
    startXRef.current = e.clientX;
    didDragRef.current = false;
    setDragging(true);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const dx = e.clientX - startXRef.current;
    // Ne capturer le pointeur qu'une fois le glisser avéré : capturer dès le
    // pointerdown re-ciblerait le `click` vers la piste et casserait les clics
    // normaux sur les liens des diapositives.
    if (Math.abs(dx) > 10 && !didDragRef.current) {
      didDragRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    setDragPx(dx);
  }
  function onPointerEnd() {
    if (!dragging) return;
    const width = sectionRef.current?.offsetWidth ?? 0;
    const threshold = Math.min(80, width * 0.2);
    if (dragPx < -threshold) next();
    else if (dragPx > threshold) prev();
    setDragging(false);
    setDragPx(0);
  }
  // Un glisser ne doit pas déclencher la navigation du lien au relâchement.
  function suppressClickAfterDrag(e: React.MouseEvent) {
    if (didDragRef.current) {
      e.preventDefault();
      e.stopPropagation();
      didDragRef.current = false;
    }
  }

  const activeDot = n > 1 ? (index - 1 + n) % n : 0;
  const control =
    "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/70 p-2 text-green shadow-sm transition hover:bg-white";

  return (
    <section
      ref={sectionRef}
      aria-label="Promotions"
      className="relative aspect-square w-full select-none overflow-hidden bg-cream md:aspect-[3/1]"
      style={{ touchAction: "pan-y" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className="flex h-full"
        style={{
          transform: `translateX(calc(-${index * 100}% + ${dragPx}px))`,
          transition: dragging || noTransition ? "none" : TRANSITION,
        }}
        onTransitionEnd={onTransitionEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        {slides.map((b, i) => {
          const isFirstReal = i === (n > 1 ? 1 : 0);
          const slide = <SlideImage banner={b} eager={isFirstReal} />;
          return (
            <div key={`${b.id}-${i}`} className="h-full w-full shrink-0">
              {b.link.startsWith("/") ? (
                <Link
                  href={b.link}
                  className="block h-full w-full"
                  onClickCapture={suppressClickAfterDrag}
                  tabIndex={isFirstReal ? 0 : -1}
                >
                  {slide}
                </Link>
              ) : (
                <a
                  href={b.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full w-full"
                  onClickCapture={suppressClickAfterDrag}
                  tabIndex={isFirstReal ? 0 : -1}
                >
                  {slide}
                </a>
              )}
            </div>
          );
        })}
      </div>

      {n > 1 && (
        <>
          <button
            type="button"
            aria-label="Bannière précédente"
            onClick={prev}
            className={`${control} left-3`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Bannière suivante"
            onClick={next}
            className={`${control} right-3`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                aria-label={`Aller à la bannière ${i + 1}`}
                aria-current={i === activeDot}
                onClick={() => setIndex(i + 1)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === activeDot ? "bg-gold" : "bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
