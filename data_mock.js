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
            { id: "zabka", name: "Żabka", priceFactor: 1.10 }
        ]
    },
    products: [
        { name: "Arla Sødmælk", category: "Mælk", price: 13.50, amount: "1L" },
        { name: "Sødmælk", category: "Mælk", price: 12.00, amount: "1L" },
        { name: "Mælk", category: "Mælk", price: 11.50, amount: "1L" },
        { name: "Kærgården Smørbar", category: "Smør", price: 22.00, amount: "200g" },
        { name: "Smør", category: "Smør", price: 24.95, amount: "250g" },
        { name: "Æg", category: "Æg", price: 27.55, amount: "10 stk" },
        { name: "Bakke Æg", category: "Æg", price: 29.95, amount: "12 stk" }
    ],
    cities: ["Helsingør", "Hillerød", "Roskilde", "København", "Odense", "Aarhus", "Warszawa"]
};
