// AFSNIT 01 – Demo-provider
import { loadJson } from "../data.js";

export async function getDemoOffers() {
  const [offers, stores] = await Promise.all([
    loadJson("./data/offers.json"),
    loadJson("./data/stores.json")
  ]);

  return {
    source: "Demo-data",
    sourceInfo: "Demo-data bruges, fordi rigtig proxy/API ikke er tilkoblet endnu.",
    offers,
    stores
  };
}
