// AFSNIT 01 – App-konfiguration
export const CONFIG = {
  appName: "TilbudsRadar DK",
  appVersion: "1.3.0",

  // AFSNIT 02 – Rigtig data via proxy/backend
  // Når Cloudflare Worker er oprettet, skal URL'en indsættes her.
  // Eksempel: "https://tilbudsradar-proxy.ditnavn.workers.dev"
  API_PROXY_URL: "",

  // AFSNIT 03 – Datakildevalg
  // "auto" = prøver rigtig proxy først og falder tilbage til demo-data.
  // "demo" = bruger kun demo-data.
  dataMode: "auto",

  maxResults: 4,
  defaultLocation: "Helsingør",
  defaultProduct: "",
  defaultRadiusKm: 3
};
