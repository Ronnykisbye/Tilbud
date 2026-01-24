const mockData = {
    // Liste over byer til manuel søgning
    cities: [
        "København", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Kolding", "Horsens", "Vejle", "Roskilde", "Hillerød",
        "Warszawa", "Kraków", "Łódź", "Berlin", "Hamburg", "München", "London", "Manchester", "Vilnius", "Kaunas"
    ],

    // Produkter med basispriser (bruges til at simulere tilbud)
    products: [
        { name: "Mælk", price: 12.50 },
        { name: "Milk", price: 12.50 },
        { name: "Mleko", price: 12.50 },
        { name: "Rugbrød", price: 15.00 },
        { name: "Bread", price: 15.00 },
        { name: "Chleb", price: 15.00 },
        { name: "Smør", price: 22.00 },
        { name: "Butter", price: 22.00 },
        { name: "Masło", price: 22.00 },
        { name: "Æg", price: 28.00 },
        { name: "Eggs", price: 28.00 },
        { name: "Jajka", price: 28.00 },
        { name: "Kaffe", price: 45.00 },
        { name: "Coffee", price: 45.00 },
        { name: "Kawa", price: 45.00 },
        { name: "Olie", price: 18.00 },
        { name: "Oil", price: 18.00 },
        { name: "Olej", price: 18.00 }
    ],

    // Butikker der findes i systemet
    stores: [
        { id: "rema", name: "REMA 1000", priceFactor: 0.95 },
        { id: "netto", name: "Netto", priceFactor: 1.00 },
        { id: "lidl", name: "Lidl", priceFactor: 0.92 },
        { id: "fotex", name: "Føtex", priceFactor: 1.10 },
        { id: "bilka", name: "Bilka", priceFactor: 1.05 },
        { id: "biedronka", name: "Biedronka", priceFactor: 0.85 }
    ]
};
