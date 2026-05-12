// AFSNIT 01 – Demo-provider
import { loadJson } from "../data.js";

// AFSNIT 02 – Hent demo-data
export async function getDemoOffers(searchOptions = {}) {
  const [offers, stores] = await Promise.all([
    loadJson("./data/offers.json"),
    loadJson("./data/stores.json")
  ]);

  const product = String(searchOptions.product || "").trim();
  const queryForSource = product || "tilbud";

  return {
    source: "Demo-data",
    sourceInfo: product
      ? `Demo-data bruges, fordi rigtig proxy/API ikke er tilkoblet endnu. Kildeknappen søger nu efter hele teksten: '${product}'.`
      : "Demo-data bruges, fordi rigtig proxy/API ikke er tilkoblet endnu.",
    offers: offers.map(offer => ({
      ...offer,
      // Vigtigt: linket må ikke kun gå til en bred kategori som /offer/kaffe.
      // Det skal bruge det, brugeren faktisk søgte på, fx 'gevalia kaffe helebønner'.
      url: buildTilbudsugenSearchUrl(queryForSource),
      sourceQuery: queryForSource
    })),
    stores
  };
}

// AFSNIT 03 – Kildelink
function buildTilbudsugenSearchUrl(query) {
  const safeQuery = encodeURIComponent(String(query || "tilbud").trim().toLowerCase());
  return `https://www.tilbudsugen.dk/offer/${safeQuery}`;
}
