/* Afsnit 01: OpenStreetMap / Overpass API Integration */
async function findStoresNearby(lat, lon, radiusKm) {
    const radiusMeters = radiusKm * 1000;
    const query = `[out:json];node["shop"~"supermarket|convenience"](around:${radiusMeters},${lat},${lon});out;`;
    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.elements; // Returnerer alle Netto, Rema, Lidl etc. i nærheden
}

/* Afsnit 02: Open Food Facts (Produkt validering) */
async function searchProduct(query) {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=5`;
    const res = await fetch(url);
    const data = await res.json();
    return data.products;
}
