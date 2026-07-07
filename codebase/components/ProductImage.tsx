// Product image. If `src` is provided it is shown; otherwise we fall back to a
// branded gradient tile with the brand initials.
//
// Optimizable sources (local `/products/*` paths and Cloudinary uploads) go
// through next/image for AVIF/WebP, responsive sizing and lazy loading. Any
// other external URL (e.g. an admin-pasted link from an unconfigured host)
// falls back to a plain <img> so it never crashes on remotePatterns.

import Image from "next/image";

// Matches next.config.mjs images.remotePatterns.
function isOptimizable(src: string): boolean {
  return src.startsWith("/") || src.includes("res.cloudinary.com");
}

const GRADIENTS = [
  "from-amber-100 to-amber-200",
  "from-rose-100 to-rose-200",
  "from-sky-100 to-sky-200",
  "from-emerald-100 to-emerald-200",
  "from-violet-100 to-violet-200",
  "from-orange-100 to-orange-200",
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function ProductImage({
  brand,
  name,
  src,
  className = "",
}: {
  brand: string;
  name: string;
  src?: string;
  className?: string;
}) {
  if (src && isOptimizable(src)) {
    return (
      <div className={`relative overflow-hidden bg-white ${className}`}>
        <Image
          src={src}
          alt={`${brand} — ${name}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-3"
        />
      </div>
    );
  }

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${brand} — ${name}`}
        loading="lazy"
        className={`bg-white object-contain p-3 ${className}`}
      />
    );
  }

  const gradient = GRADIENTS[hash(brand) % GRADIENTS.length];
  const initials = brand
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <div
      className={`relative flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
      role="img"
      aria-label={`${brand} — ${name}`}
    >
      <span className="font-display text-3xl font-bold text-green/70">
        {initials}
      </span>
      <span className="absolute bottom-2 left-2 right-2 truncate text-center text-[10px] uppercase tracking-wide text-green/50">
        {brand}
      </span>
    </div>
  );
}
