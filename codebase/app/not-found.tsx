import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="font-display text-5xl font-bold text-green">404</h1>
      <p className="text-muted">Cette page n&apos;existe pas ou a été déplacée.</p>
      <Link
        href="/"
        className="rounded-lg bg-gold px-5 py-2.5 font-semibold text-white hover:bg-gold-dark"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
