// AFSNIT 01 – Afstandsberegning
export function distanceKm(a, b) {
  const earthRadius = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function toRadians(value) {
  return value * Math.PI / 180;
}

// AFSNIT 02 – Find område med by, postnummer og alias
export function findLocation(query, locations) {
  const normalized = normalize(query);
  if (!normalized) return null;

  return locations.find(location => locationTokens(location).includes(normalized))
    || locations.find(location => locationTokens(location).some(token => token.includes(normalized) || normalized.includes(token)))
    || null;
}

function locationTokens(location) {
  return [location.name, location.postcode, ...(location.aliases || [])]
    .filter(Boolean)
    .map(normalize);
}

export function normalize(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ø/g, "o")
    .replace(/æ/g, "ae")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
