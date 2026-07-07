// Strip Unicode combining diacritical marks (U+0300–U+036F) after NFD decompose.
const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(DIACRITICS, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
