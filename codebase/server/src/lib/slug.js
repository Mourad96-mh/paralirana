// Slug stable et sans accent, borné à 80 caractères (identique au front).
const DIACRITICS = /[̀-ͯ]/g;

export function slugify(input) {
  return String(input || '')
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
