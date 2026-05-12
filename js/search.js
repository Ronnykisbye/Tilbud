// AFSNIT 01 – Søgning, synonymer og scoring
import { distanceKm, normalize } from "./geo.js";

const PRODUCT_SYNONYMS = {
  kaffe: ["kaffe", "bønner", "bonner", "hele bønner", "formalede", "merrild", "gevalia", "bki", "peter larsen", "lavazza", "barissimo"],
  mælk: ["mælk", "maelk", "letmælk", "minimælk", "skummetmælk", "sødmælk", "arla"],
  smør: ["smør", "smor", "lurpak", "kærgården", "kaergarden", "smørbar", "smoerbar"],
  kylling: ["kylling", "kyllingebryst", "inderfilet", "kyllingelår", "kyllingelar", "fersk kylling"],
  brød: ["brød", "brod", "rugbrød", "rugbrod", "toast", "boller"],
  ost: ["ost", "danbo", "skæreost", "skaereost", "revet ost"],
  cola: ["cola", "coca cola", "pepsi", "sodavand", "zero"],
  æg: ["æg", "aeg", "økologiske æg", "okologiske aeg", "frilandsæg"],
  pasta: ["pasta", "spaghetti", "penne", "lasagne"],
  ris: ["ris", "jasminris", "basmati", "parboiled"]
};

// AFSNIT 02 – Hovedfunktion
export function findOffers({ product, location, radiusKm, offers, stores, sortMode }) {
  const productQuery = normalize(product);
  const expandedQuery = expandQuery(productQuery);
  const storeMap = new Map(stores.map(store => [store.id, store]));

  const enriched = offers
    .map(offer => buildOffer(offer, storeMap, location, productQuery, expandedQuery))
    .filter(Boolean)
    .filter(offer => offer.distance <= radiusKm)
    .filter(offer => offer.matchScore > 0);

  return sortOffers(enriched, sortMode);
}

function buildOffer(offer, storeMap, location, productQuery, expandedQuery) {
  const store = storeMap.get(offer.storeId);
  if (!store) return null;
  const distance = distanceKm(location, store);
  const saving = Math.max(0, Number(offer.normalPrice || offer.price) - Number(offer.price));
  const matchScore = scoreOffer(offer, productQuery, expandedQuery);
  return { ...offer, store, distance, saving, matchScore };
}

// AFSNIT 03 – Bedre match på danske søgeord
function scoreOffer(offer, query, expandedQuery) {
  const haystack = normalize([
    offer.product,
    offer.brand,
    offer.category,
    ...(offer.keywords || [])
  ].join(" "));

  if (!query) return 1;
  if (haystack === query) return 120;
  if (haystack.includes(query)) return 100;

  const queryParts = query.split(/\s+/).filter(Boolean);
  const expandedParts = expandedQuery.split(/\s+/).filter(Boolean);
  const allParts = [...new Set([...queryParts, ...expandedParts])].filter(part => part.length > 1);

  let score = 0;
  allParts.forEach(part => {
    if (haystack.includes(part)) score += queryParts.includes(part) ? 22 : 12;
    else if (isNearWordMatch(part, haystack)) score += 8;
  });

  // Brand-match skal tælle højt, fordi brugeren ofte skriver fx Gevalia, Merrild eller BKI.
  if (offer.brand && queryParts.includes(normalize(offer.brand))) score += 35;

  // Kategori-match gør søgninger som "hele bønner" og "formalede" brugbare.
  if (offer.category && expandedParts.includes(normalize(offer.category))) score += 26;

  return score;
}

function expandQuery(query) {
  const matches = [];
  Object.entries(PRODUCT_SYNONYMS).forEach(([category, words]) => {
    const normalizedWords = words.map(normalize);
    const hit = normalizedWords.some(word => query.includes(word) || word.includes(query));
    if (hit) matches.push(category, ...normalizedWords);
  });
  return [...new Set([query, ...matches])].join(" ");
}

function isNearWordMatch(part, haystack) {
  const words = haystack.split(/\s+/).filter(Boolean);
  return words.some(word => {
    if (word.length < 4 || part.length < 4) return false;
    return levenshtein(part, word) <= 1 || word.startsWith(part.slice(0, 4));
  });
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

// AFSNIT 04 – Sortering
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
  return (offer.matchScore * 10) - (offer.price * 1.6) - (offer.distance * 6) + (offer.saving * 4);
}
