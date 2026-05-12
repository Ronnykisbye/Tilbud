// AFSNIT 01 – Provider manager
import { CONFIG } from "../config.js";
import { getDemoOffers } from "./demoProvider.js";
import { getTilbudsugenOffers } from "./tilbudsugenProvider.js";

export async function getOffersFromBestSource(searchOptions) {
  if (CONFIG.dataMode === "demo") {
    return getDemoOffers(searchOptions);
  }

  if (CONFIG.API_PROXY_URL) {
    try {
      const live = await getTilbudsugenOffers(searchOptions);
      if (live.offers.length > 0) return live;
    } catch (error) {
      console.warn("Live provider fejlede. Bruger demo-data.", error);
    }
  }

  return getDemoOffers(searchOptions);
}
