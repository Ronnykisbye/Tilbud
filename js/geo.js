// AFSNIT 01 – Afstand og geokodning
import { loadJson } from "./data.js";

let locationsCache = null;

export async function getLocations() {
  if (!locationsCache) {
    locationsCache = await loadJson("./data/locations.json");
  }
  return locationsCache;
}

export async function resolveLocation(input) {
  const locations = await getLocations();
  const query = String(input || "").trim().toLowerCase();
  if (!query) return locations.find(x => x.name.toLowerCase() === "helsingør");

  return locations.find(x =>
    x.name.toLowerCase() === query ||
    String(x.postalCode) === query
  ) || locations.find(x =>
    x.name.toLowerCase().includes(query) ||
    query.includes(x.name.toLowerCase())
  ) || locations[0];
}

export function distanceKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function toRad(value) {
  return value * Math.PI / 180;
}

export function useBrowserGps() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("GPS understøttes ikke i denne browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, name: "Min GPS-position" }),
      err => reject(new Error(err.message || "Kunne ikke hente GPS-position.")),
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 300000 }
    );
  });
}
