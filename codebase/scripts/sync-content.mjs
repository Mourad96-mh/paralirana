// Synchronise le catalogue ET les catégories depuis l'API (Express/Render) vers
// lib/catalog.data.json et lib/categories.data.json, bakés dans le HTML statique.
// Lancé automatiquement avant chaque build ("prebuild"). En cas d'échec (API
// injoignable), on garde le dernier snapshot de chaque fichier : le build réussit.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.resolve(__dirname, "../lib/catalog.data.json");
const categoriesFile = path.resolve(__dirname, "../lib/categories.data.json");

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

async function syncCollection(endpoint, file, label) {
  try {
    const res = await fetch(`${API}${endpoint}`);
    if (!res.ok) throw new Error(`${API}${endpoint} → HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("réponse inattendue (pas un tableau)");
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`[sync] ${data.length} ${label} synchronisé(e)s depuis ${API}`);
  } catch (e) {
    console.warn(`[sync] échec ${label} — conservation du snapshot existant :`, e.message);
  }
}

async function main() {
  if (!API) {
    console.warn("[sync] CONTENT_API_URL non défini — conservation des snapshots existants");
    return;
  }
  await syncCollection("/api/products", outFile, "produits");
  await syncCollection("/api/categories", categoriesFile, "catégories");
}

main();
