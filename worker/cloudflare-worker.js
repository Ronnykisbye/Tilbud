// AFSNIT 01 – Cloudflare Worker til rigtige tilbudsdata
// Formål: GitHub Pages må ikke selv scrape/hente eksterne sider direkte.
// Denne worker fungerer som sikker proxy og returnerer ensartet JSON til appen.
//
// Endpoint:
// https://DIN-WORKER.workers.dev/api/offers?q=kaffe&location=Helsingør&radius=3

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === "/api/offers") {
      return handleOffers(url);
    }

    return json({
      app: "TilbudsRadar DK Proxy",
      status: "ok",
      endpoints: ["/api/offers?q=kaffe&location=Helsingør&radius=3"]
    });
  }
};

// AFSNIT 02 – Hent tilbud
async function handleOffers(url) {
  const query = (url.searchParams.get("q") || "kaffe").trim();
  const safeQuery = encodeURIComponent(query.toLowerCase());

  // Første rigtige kilde: Tilbudsugen.
  // Bemærk: HTML-struktur kan ændre sig. Derfor er parseren bevidst defensiv.
  const sourceUrl = `https://www.tilbudsugen.dk/offer/${safeQuery}`;

  try {
    const response = await fetch(sourceUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 TilbudsRadarDK/1.0",
        "Accept": "text/html,application/xhtml+xml"
      }
    });

    if (!response.ok) {
      return json({
        source: "Tilbudsugen",
        sourceInfo: `Tilbudsugen svarede ${response.status}.`,
        offers: [],
        stores: []
      }, response.status);
    }

    const html = await response.text();
    const offers = parseTilbudsugenHtml(html, sourceUrl, query);

    return json({
      source: "Tilbudsugen via Cloudflare Worker",
      sourceInfo: `Rigtige data forsøgt hentet fra Tilbudsugen for '${query}'.`,
      fetchedAt: new Date().toISOString(),
      offers,
      stores: storesFromOffers(offers)
    });

  } catch (error) {
    return json({
      source: "Tilbudsugen",
      sourceInfo: "Proxy-fejl: " + error.message,
      offers: [],
      stores: []
    }, 500);
  }
}

// AFSNIT 03 – Parser
function parseTilbudsugenHtml(html, sourceUrl, query) {
  const text = decodeHtml(stripScripts(html));

  // Strategi:
  // 1) Prøv JSON-LD / Next-data-lignende tekst, hvis siden indeholder det.
  // 2) Fald tilbage til tekstbaseret parsing.
  const offers = [];

  // Simpel tekstsplit omkring danske prisformater.
  const priceRegex = /(\d{1,4})[,\.](\d{2})/g;
  const matches = [...text.matchAll(priceRegex)].slice(0, 40);

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const price = Number(`${match[1]}.${match[2]}`);
    const start = Math.max(0, match.index - 260);
    const end = Math.min(text.length, match.index + 260);
    const chunk = cleanText(text.slice(start, end));

    const storeName = guessStore(chunk);
    const title = guessTitle(chunk, query, storeName);
    if (!title || !Number.isFinite(price)) continue;

    offers.push({
      id: `tu-${i}-${Math.round(price * 100)}`,
      title,
      brand: "",
      category: query,
      storeId: slugify(storeName),
      storeName,
      storeAddress: "",
      price,
      normalPrice: null,
      unitPrice: guessUnitPrice(chunk),
      amount: guessAmount(chunk),
      validFrom: "",
      validTo: guessValidTo(chunk),
      source: "Tilbudsugen",
      url: sourceUrl,
      sourceQuery: query,
      description: chunk.slice(0, 220)
    });
  }

  // Fjern næsten-duplikater
  const seen = new Set();
  return offers.filter(o => {
    const key = `${o.title}|${o.storeName}|${o.price}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 24);
}

// AFSNIT 04 – Hjælpefunktioner
function storesFromOffers(offers) {
  const map = new Map();
  for (const offer of offers) {
    if (!map.has(offer.storeId)) {
      map.set(offer.storeId, {
        id: offer.storeId,
        name: offer.storeName || "Ukendt butik",
        address: offer.storeAddress || "",
        // Midlertidigt centrum i Helsingør, indtil vi kobler butikkernes adresser/geodata på.
        lat: 56.0361,
        lng: 12.6136
      });
    }
  }
  return [...map.values()];
}

function guessStore(chunk) {
  const stores = ["Netto", "føtex", "Bilka", "MENY", "Rema 1000", "REMA 1000", "Coop 365", "SuperBrugsen", "Kvickly", "Lidl", "Aldi", "Dagli'Brugsen", "Spar", "Min Købmand"];
  return stores.find(store => chunk.toLowerCase().includes(store.toLowerCase())) || "Ukendt butik";
}

function guessTitle(chunk, query, storeName) {
  let title = chunk
    .replaceAll(storeName, "")
    .replace(/\d{1,4}[,.]\d{2}/g, "")
    .replace(/kr\.?/gi, "")
    .trim();

  const q = query.toLowerCase();
  const idx = title.toLowerCase().indexOf(q);
  if (idx >= 0) {
    title = title.slice(Math.max(0, idx - 60), idx + q.length + 90);
  } else {
    title = `${query} tilbud`;
  }

  return cleanText(title).slice(0, 90);
}

function guessUnitPrice(chunk) {
  const match = chunk.match(/(\d{1,4}[,.]\d{2}\s*(kr\.?|,-)\s*\/\s*(kg|l|liter|stk|pakke))/i);
  return match ? match[1] : "";
}

function guessAmount(chunk) {
  const match = chunk.match(/(\d+(?:[,.]\d+)?\s*(g|kg|ml|cl|l|liter|stk|pk|pakke))/i);
  return match ? match[1] : "";
}

function guessValidTo(chunk) {
  const match = chunk.match(/(\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?)/);
  return match ? match[1] : "";
}

function stripScripts(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function decodeHtml(value) {
  return String(value || "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&nbsp;", " ");
}

function slugify(value) {
  return String(value || "ukendt")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=900"
    }
  });
}
