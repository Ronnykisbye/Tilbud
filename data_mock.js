const mockData = {
    // Landespecifikke butikker
    countryStores: {
        DK: [
            { id: "rema", name: "REMA 1000", priceFactor: 0.94 },
            { id: "netto", name: "Netto", priceFactor: 0.96 },
            { id: "lidl", name: "Lidl", priceFactor: 0.92 },
            { id: "superbrugsen", name: "SuperBrugsen", priceFactor: 1.05 }
        ],
        PL: [
            { id: "biedronka", name: "Biedronka", priceFactor: 0.85 },
            { id: "zabka", name: "Żabka", priceFactor: 1.10 },
            { id: "leclerc", name: "E.Leclerc", priceFactor: 0.90 }
        ],
        DE: [
            { id: "aldi", name: "ALDI Nord", priceFactor: 0.90 },
            { id: "rewe", name: "REWE", priceFactor: 1.05 },
            { id: "edeka", name: "EDEKA", priceFactor: 1.08 }
        ],
        GB: [
            { id: "tesco", name: "Tesco", priceFactor: 1.00 },
            { id: "asda", name: "Asda", priceFactor: 0.92 },
            { id: "sainsburys", name: "Sainsbury's", priceFactor: 1.05 }
        ],
        LT: [
            { id: "maxima", name: "Maxima", priceFactor: 0.90 },
            { id: "iki", name: "IKI", priceFactor: 0.95 },
            { id: "rimi", name: "Rimi", priceFactor: 1.02 }
        ]
    },
    // Fælles vareliste med priser i en basisvaluta (omregnes i logic)
    products: [
        { name: "Mælk", price: 12.50 }, { name: "Milk", price: 12.50 }, { name: "Mleko", price: 12.50 },
        { name: "Smør", price: 24.95 }, { name: "Butter", price: 24.95 }, { name: "Masło", price: 24.95 },
        { name: "Brød", price: 18.00 }, { name: "Bread", price: 18.00 }, { name: "Chleb", price: 18.00 },
        { name: "Æg", price: 29.95 }, { name: "Eggs", price: 29.95 }, { name: "Jajka", price: 29.95 }
    ],
    cities: ["Helsingør", "Hillerød", "Warszawa", "Berlin", "London", "Vilnius", "København", "Aarhus"]
};
