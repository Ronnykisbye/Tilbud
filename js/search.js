// AFSNIT 01 – Søgning og scoring
import { distanceKm, normalize } from "./geo.js";

export function findOffers({ product, location, radiusKm, offers, stores, sortMode }) {
  const productQuery = normalize(product);
  const storeMap = new Map(stores.map(store => [store.id, store]));

  const enriched = offers
    .map(offer => {
      const store = storeMap.get(offer.storeId);
      if (!store) return null;
      const distance = distanceKm(location, store);
      const saving = Math.max(0, Number(offer.normalPrice || offer.price) - Number(offer.price));
      const matchScore = scoreOffer(offer, productQuery);
      return { ...offer, store, distance, saving, matchScore };
    })
    .filter(Boolean)
    .filter(offer => offer.distance <= radiusKm)
    .filter(offer => offer.matchScore > 0);

  return sortOffers(enriched, sortMode);
}

function scoreOffer(offer, query) {
  const haystack = normalize([offer.product, ...(offer.keywords || [])].join(" "));
  if (!query) return 1;
  if (haystack === query) return 100;
  if (haystack.includes(query)) return 80;
  const parts = query.split(/\s+/).filter(Boolean);
  return parts.reduce((score, part) => score + (haystack.includes(part) ? 12 : 0), 0);
}

export function sortOffers(offers, sortMode = "smart") {
  const copy = [...offers];
  copy.sort((a, b) => {
    if (sortMode === "price") return a.price - b.price;
    if (sortMode === "distance") return a.distance - b.distance;
    if (sortMode === "saving") return b.saving - a.saving;
    const scoreA = smartScore(a);
    const scoreB = smartScore(b);
    return scoreB - scoreA;
  });
  return copy;
}

function smartScore(offer) {
  return (offer.matchScore * 10) - (offer.price * 1.8) - (offer.distance * 7) + (offer.saving * 4);
}
