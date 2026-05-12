// AFSNIT 01 – Tilbudsugen-provider via egen proxy
import { CONFIG } from "../config.js";

export async function getTilbudsugenOffers({ product, location, radiusKm }) {
  if (!CONFIG.API_PROXY_URL) {
    throw new Error("API_PROXY_URL mangler i js/config.js");
  }

  const url = new URL(CONFIG.API_PROXY_URL.replace(/\/$/, "") + "/api/offers");
  url.searchParams.set("q", product || "");
  url.searchParams.set("location", location || "");
  url.searchParams.set("radius", String(radiusKm || 3));

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Proxy svarede ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data.offers)) {
    throw new Error("Proxy returnerede ikke tilbudsliste.");
  }

  return {
    source: data.source || "Tilbudsugen via proxy",
    sourceInfo: data.sourceInfo || "Rigtige tilbud hentet via egen proxy.",
    offers: data.offers,
    stores: data.stores || []
  };
}
