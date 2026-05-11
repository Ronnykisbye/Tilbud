// AFSNIT 01 – App-konfiguration
export const APP_CONFIG = {
  appName: "TilbudsRadar DK",
  defaultTheme: "dark",
  defaultLocation: "Helsingør",
  defaultRadiusKm: 5,
  maxVisibleOffers: 4,
  dataPaths: {
    offers: "data/offers.json",
    stores: "data/stores.json",
    locations: "data/locations.json",
    categories: "data/categories.json"
  },
  storageKeys: {
    theme: "trdk_theme",
    favorites: "trdk_favorites",
    history: "trdk_history"
  }
};
