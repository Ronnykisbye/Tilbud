/* Afsnit 01: API Konfigurationer */
const API_CONFIG = {
    openFoodFacts: "https://world.openfoodfacts.org/cgi/search.pl",
    fuelPrices: "https://api.kfst.dk/fuel/v1", // Hypotetisk 2026 API
    localCacheKey: "neon_spar_data"
};

/* Afsnit 02: Intelligent Pris-Logik */
const storeData = [
    { id: 'rema', name: 'REMA 1000', lat: 56.1, lng: 10.2, logo: '🏢' },
    { id: 'netto', name: 'Netto', lat: 56.11, lng: 10.22, logo: '🐶' },
    { id: 'lidl', name: 'Lidl', lat: 56.09, lng: 10.21, logo: '💛' }
];

// Funktion til at hente data fra Open Food Facts (Gratis API)
async function fetchProductInfo(barcode) {
    const resp = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    return await resp.json();
}
