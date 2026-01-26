const mockData = {
    countryStores: {
        DK: [
            { id: "rema", name: "REMA 1000", priceFactor: 0.94 },
            { id: "netto", name: "Netto", priceFactor: 0.96 },
            { id: "lidl", name: "Lidl", priceFactor: 0.92 },
            { id: "superbrugsen", name: "SuperBrugsen", priceFactor: 1.05 }
        ],
        PL: [
            { id: "biedronka", name: "Biedronka", priceFactor: 0.85 },
            { id: "lidl_pl", name: "Lidl PL", priceFactor: 0.88 }
        ],
        // ... (DE, GB, LT butikker her)
    },
    products: [
        { name: "Arla Sødmælk", category: "Mælk", price: 13.50, amount: "1L" },
        { name: "Mælk", category: "Mælk", price: 11.00, amount: "1L" },
        { name: "Kærgården Smørbar", category: "Smør", price: 24.95, amount: "200g" },
        { name: "Smørbart", category: "Smør", price: 19.00, amount: "250g" },
        { name: "Æg", category: "Æg", price: 28.00, amount: "10 stk" },
        { name: "Øko Æg", category: "Æg", price: 34.00, amount: "8 stk" },
        { name: "Brød", category: "Brød", price: 15.00, amount: "500g" }
    ],
    cities: ["Hillerød", "Helsingør", "Roskilde", "København", "Warszawa", "Berlin", "London", "Vilnius"]
};
