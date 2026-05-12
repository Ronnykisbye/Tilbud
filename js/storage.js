// AFSNIT 01 – LocalStorage helpers
const KEYS = {
  favorites: "tilbudsradar:favorites",
  history: "tilbudsradar:history",
  theme: "tilbudsradar:theme"
};

export function getFavorites() {
  return JSON.parse(localStorage.getItem(KEYS.favorites) || "[]");
}

export function saveFavorite(value) {
  const clean = String(value || "").trim();
  if (!clean) return;
  const items = getFavorites().filter(x => x.toLowerCase() !== clean.toLowerCase());
  items.unshift(clean);
  localStorage.setItem(KEYS.favorites, JSON.stringify(items.slice(0, 12)));
}

export function getHistory() {
  return JSON.parse(localStorage.getItem(KEYS.history) || "[]");
}

export function saveHistory(product, location) {
  const label = [product, location].filter(Boolean).join(" · ");
  if (!label.trim()) return;
  const items = getHistory().filter(x => x.toLowerCase() !== label.toLowerCase());
  items.unshift(label);
  localStorage.setItem(KEYS.history, JSON.stringify(items.slice(0, 10)));
}

export function getTheme() {
  return localStorage.getItem(KEYS.theme) || "dark";
}

export function setTheme(theme) {
  localStorage.setItem(KEYS.theme, theme);
}
