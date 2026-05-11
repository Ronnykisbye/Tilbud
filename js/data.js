// AFSNIT 01 – Indlæs JSON-data
import { APP_CONFIG } from "./config.js";

export async function loadAppData() {
  const [offers, stores, locations, categories] = await Promise.all([
    loadJson(APP_CONFIG.dataPaths.offers),
    loadJson(APP_CONFIG.dataPaths.stores),
    loadJson(APP_CONFIG.dataPaths.locations),
    loadJson(APP_CONFIG.dataPaths.categories)
  ]);

  return { offers, stores, locations, categories };
}

async function loadJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Kunne ikke hente ${path}`);
  }
  return response.json();
}
