/* Afsnit 01: Sprog-pakker */
const i18n = {
    da: {
        title1: "Find Butikker",
        title2: "Vælg Varer",
        title3: "Vælg Butikker",
        title4: "Bedste Priser",
        next: "NÆSTE",
        reset: "NY SØGNING",
        gps_searching: "Finder din by...",
        gps_found: "📍 Du er i: "
    },
    en: {
        title1: "Find Stores",
        title2: "Select Items",
        title3: "Select Stores",
        title4: "Best Prices",
        next: "NEXT",
        reset: "NEW SEARCH",
        gps_searching: "Locating city...",
        gps_found: "📍 You are in: "
    }
};

/* Afsnit 02: Globalt MockData */
const mockData = {
    products: [
        { name: "Mælk", price: 12 },
        { name: "Milk", price: 1.5 },
        { name: "Smør", price: 25 },
        { name: "Butter", price: 3 }
    ],
    stores: [
        { id: 'rema', name: 'REMA 1000', dist: 1.2 },
        { id: 'lidl', name: 'Lidl', dist: 0.8 },
        { id: 'aldi', name: 'Aldi', dist: 2.5 }
    ]
};
