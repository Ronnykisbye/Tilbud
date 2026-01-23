/* Afsnit 01: Optimizer Algoritme */
function optimizeBasket(userItems, storesInRange) {
    let results = {
        oneStoreSolution: { store: null, total: Infinity },
        splitSolution: { stores: [], total: 0 }
    };

    // 1. Find billigste butik samlet (til dem der kun vil ét sted hen)
    storesInRange.forEach(store => {
        let storeTotal = calculateTotalForStore(userItems, store.id);
        if (storeTotal < results.oneStoreSolution.total) {
            results.oneStoreSolution = { store: store.name, total: storeTotal };
        }
    });

    // 2. Split-løsning: Køb varen der hvor den er billigst
    userItems.forEach(item => {
        let bestItemPrice = findCheapestPrice(item);
        results.splitSolution.total += bestItemPrice.price;
        results.splitSolution.stores.push(bestItemPrice.store);
    });

    return results;
}

/* Afsnit 02: GPS & Ruteberegning */
function getLiveLocation() {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(pos => {
            resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
    });
}
