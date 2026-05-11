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

// AFSNIT 02 – Find område
export function findLocation(query, locations) {
  const normalized = normalize(query);
  return locations.find(location => normalize(location.name) === normalized)
    || locations.find(location => normalize(location.name).includes(normalized))
    || null;
}

export function normalize(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
