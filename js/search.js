// AFSNIT 01 – Match, filtrering og sortering
import { distanceKm } from "./geo.js";

const SYNONYMS = {
  kaffe: ["kaffe", "gevalia", "merrild", "bki", "nescafe", "hele bønner", "formal"],
  mælk: ["mælk", "letmælk", "sødmælk", "minimælk"],
  smør: ["smør", "lurpak", "kærgården", "smørbar"],
  kylling: ["kylling", "kyllingebryst", "kyllingeinderfilet"],
  cola: ["cola", "coca", "pepsi"],
  rugbrød: ["rugbrød", "brød"],
  ost: ["ost", "skiveost", "danbo"],
  pasta: ["pasta", "spaghetti"]
};

export function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9æøå\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function productMatches(offer, productInput) {
  const q = normalize(productInput);
  if (!q) return true;

  const haystack = normalize([
    offer.title,
    offer.brand,
    offer.category,
    offer.storeName,
    offer.description
  ].filter(Boolean).join(" "));

  if (haystack.includes(q)) return true;

  const words = q.split(" ").filter(Boolean);
  if (words.length && words.every(w => haystack.includes(w))) return true;

  for (const [key, values] of Object.entries(SYNONYMS)) {
    const all = [key, ...values].map(normalize);
    const queryHitsGroup = all.some(word => q.includes(word));
    const offerHitsGroup = all.some(word => haystack.includes(word));
    if (queryHitsGroup && offerHitsGroup) return true;
  }

  return false;
}

export function enrichOffers(offers, stores, origin) {
  return offers.map(offer => {
    const store = stores.find(s => s.id === offer.storeId) || {
      id: offer.storeId || offer.storeName || "ukendt",
      name: offer.storeName || "Ukendt butik",
      lat: origin.lat,
      lng: origin.lng,
      address: ""
    };
    const distance = distanceKm(origin, store);
    return {
      ...offer,
      storeName: offer.storeName || store.name,
      storeAddress: offer.storeAddress || store.address,
      store,
      distanceKm: distance,
      saving: calcSaving(offer)
    };
  });
}

export function filterBySearch(offers, options) {
  const radius = Number(options.radiusKm || 3);
  return offers
    .filter(offer => productMatches(offer, options.product))
    .filter(offer => Number.isFinite(offer.distanceKm) ? offer.distanceKm <= radius : true);
}

export function sortOffers(offers, sortMode = "smart") {
  const copy = [...offers];

  if (sortMode === "price") return copy.sort((a,b) => priceValue(a) - priceValue(b));
  if (sortMode === "distance") return copy.sort((a,b) => (a.distanceKm || 999) - (b.distanceKm || 999));
  if (sortMode === "saving") return copy.sort((a,b) => (b.saving || 0) - (a.saving || 0));

  return copy.sort((a,b) => {
    const scoreA = priceValue(a) + (a.distanceKm || 0) * 1.7 - (a.saving || 0) * 0.18;
    const scoreB = priceValue(b) + (b.distanceKm || 0) * 1.7 - (b.saving || 0) * 0.18;
    return scoreA - scoreB;
  });
}

export function priceValue(offer) {
  return Number(offer.price || 999999);
}

function calcSaving(offer) {
  const normal = Number(offer.normalPrice || 0);
  const price = Number(offer.price || 0);
  return normal > price ? Number((normal - price).toFixed(2)) : Number(offer.saving || 0);
}
