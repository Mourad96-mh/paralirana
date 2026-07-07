// One-off: fetch REAL product photos from Open Beauty / Food Facts (openly
// licensed), forcing the EXACT product via a required keyword so we never grab
// the wrong variant. Downloads best passing candidate per product for review.
import fs from "node:fs";
import { execSync } from "node:child_process";

const OUT = process.argv[2] || "C:/Users/MOURAD/AppData/Local/Temp/claude/C--Users-MOURAD-OneDrive-Bureau-para-d-or/8b6541a0-71d5-4b4b-bf54-377d312e0229/scratchpad/imgs";
fs.mkdirSync(OUT, { recursive: true });

const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// slug, search query, and the substring(s) the matched product name MUST contain.
const ITEMS = [
  ["la-roche-posay-effaclar-gel-moussant", "la roche posay effaclar gel moussant purifiant", ["moussant"]],
  ["cerave-creme-hydratante-visage", "cerave creme hydratante visage moisturising", ["hydrat", "moisturis"]],
  ["bioderma-sensibio-h2o-eau-micellaire", "bioderma sensibio h2o eau micellaire", ["sensibio"]],
  ["the-ordinary-niacinamide-10-zinc", "the ordinary niacinamide 10 zinc", ["niacinamide"]],
  ["avene-cold-cream-corps", "avene cold cream lait corps nourrissant", ["corps"]],
  ["eucerin-ph5-baume-lavant", "eucerin ph5 baume lavant wash lotion", ["lavant", "wash", "dusch", "shower"]],
  ["klorane-shampoing-ortie", "klorane shampooing ortie seboregulateur", ["ortie", "ortiga", "nettle"]],
  ["les-secrets-de-loly-leave-in", "les secrets de loly kalia leave in", ["kalia", "leave"]],
  ["phyto-phytophanere-complement-cheveux", "phyto phytophanere cheveux ongles", ["phytophan"]],
  ["la-roche-posay-anthelios-spf50", "la roche posay anthelios uvmune 400 fluide spf50", ["anthelios"]],
  ["avene-spray-solaire-spf50-corps", "avene spray solaire spf 50 corps", ["solaire", "solar", "sun"]],
  ["vichy-dermablend-fond-de-teint", "vichy dermablend fond de teint correcteur", ["dermablend"]],
  ["embryolisse-bb-cream", "embryolisse lait creme concentre", ["concentre"]],
  ["mustela-liniment-bebe", "mustela liniment change bebe", ["liniment"]],
  ["mustela-creme-vergetures-maman", "mustela creme prevention vergetures maternite", ["vergetures", "stretch"]],
  ["biocyte-collagene-marin", "biocyte collagene marin anti age", ["collagen"]],
  ["nutergia-ergymag-magnesium", "nutergia ergymag magnesium", ["ergymag"]],
  ["vitavea-vitamine-d3", "vitavea vitamine d3 1000", ["d3", "d 3"]],
  ["saforelle-soin-lavant-doux", "saforelle soin lavant doux intime", ["lavant"]],
  ["cattier-dentifrice-bio", "cattier dentifrice blancheur bio", ["dentifrice", "toothpaste", "zahn"]],
];

function search(term, host) {
  const url = `https://${host}/cgi/search.pl?search_terms=${encodeURIComponent(term)}&json=1&page_size=20&fields=code,product_name,brands,image_front_url`;
  try {
    const raw = execSync(`curl -s -H "User-Agent: ParaLirana/1.0 (mourad.mhani96@gmail.com)" "${url}"`, { maxBuffer: 20 * 1024 * 1024 }).toString();
    return JSON.parse(raw).products || [];
  } catch { return []; }
}

const manifest = [];
for (const [slug, q, must] of ITEMS) {
  let picked = null;
  for (const host of ["world.openbeautyfacts.org", "world.openfoodfacts.org"]) {
    const cands = search(q, host).filter((c) => c.image_front_url && c.product_name);
    picked = cands.find((c) => must.some((m) => norm(c.product_name).includes(norm(m))));
    if (picked) break;
  }
  const row = { slug, matched: picked?.product_name || null, img: picked?.image_front_url || null };
  if (picked) {
    try { execSync(`curl -s -o "${OUT}/${slug}.jpg" "${picked.image_front_url}"`); } catch {}
  } else {
    try { fs.rmSync(`${OUT}/${slug}.jpg`); } catch {}
  }
  manifest.push(row);
  console.log(`${picked ? "✓" : "✗"} ${slug}  <-  ${row.matched || "NO MATCH"}`);
}
fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));
console.log(`\nMatched ${manifest.filter((m) => m.img).length}/${ITEMS.length}. Manifest: ${OUT}/manifest.json`);
