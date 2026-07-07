// Synchronise le catalogue depuis l'API (Express/Render) vers lib/catalog.data.json,
// baké dans le HTML statique. Lancé automatiquement avant chaque build ("prebuild").
// En cas d'échec (API injoignable), on garde le dernier snapshot : le build réussit.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.resolve(__dirname, "../lib/catalog.data.json");

// Charge .env.local (ce script tourne hors de Next, qui sinon lirait le fichier lui-même).
function loadEnvLocal() {
  try {
    const file = path.resolve(__dirname, "../.env.local");
    for (const line of fs.readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* pas de .env.local — on continue */
  }
}
loadEnvLocal();

const API = process.env.CONTENT_API_URL || process.env.NEXT_PUBLIC_API_URL;

async function main() {
  if (!API) {
    console.warn("[sync] CONTENT_API_URL non défini — conservation de lib/catalog.data.json");
    return;
  }
  try {
    const res = await fetch(`${API}/api/products`);
    if (!res.ok) throw new Error(`${API}/api/products → HTTP ${res.status}`);
    const products = await res.json();
    if (!Array.isArray(products)) throw new Error("réponse inattendue (pas un tableau)");
    fs.writeFileSync(outFile, JSON.stringify(products, null, 2));
    console.log(`[sync] ${products.length} produits synchronisés depuis ${API}`);
  } catch (e) {
    console.warn("[sync] échec — conservation du snapshot existant :", e.message);
  }
}

main();
