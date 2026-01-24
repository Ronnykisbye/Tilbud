let currentStep = 1;
let selectedCity = null;
let currentProducts = ["", "", "", ""]; // Holder styr på de 4 varer
let currentStores = []; // Liste over fundne butikker

// Funktion til at skifte mellem lys og mørk tilstand
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
}

// Opdaterer radius-værdien, når slideren bevæges
function updateRad(val) {
    document.getElementById('rad-val').innerText = val;
}

// Navigationsfunktion mellem trin
function changeStep(direction) {
    const currentView = document.querySelector(`#step-${currentStep}`);
    const nextStep = currentStep + direction;
    const nextView = document.querySelector(`#step-${nextStep}`);

    // Validerer at vi er inden for gyldige trin
    if (nextView && nextStep >= 1 && nextStep <= 4) {
        currentView.classList.remove('active'); // Skjuler nuværende trin
        nextView.classList.add('active');       // Viser næste trin
        currentStep = nextStep;
        document.getElementById('step-num').innerText = currentStep;

        const titles = ["Find Butikker", "Vælg Varer", "Vælg Butikker", "Bedste Priser"];
        document.getElementById('title').innerText = titles[currentStep - 1];

        // Skjuler Retur-knap på Trin 1
        document.getElementById('back-btn').style.display = (currentStep === 1) ? 'none' : 'flex';

        // Specifikke handlinger for hvert trin
        if (currentStep === 3) {
            renderStores(); // Viser butikker, når vi kommer til trin 3
        } else if (currentStep === 4) {
            calculateBestPrices(); // Beregner priser i trin 4
        }
    }
}

// Henter GPS-position og oversætter til bynavn
async function getGPS() {
    const display = document.getElementById('location-display');
    display.innerText = "Søger din by...";
    display.style.color = 'var(--text-secondary)'; // Nulstil farve

    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
            const resp = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=da`);
            const data = await resp.json();
            selectedCity = data.city || data.locality || "Ukendt by";
            display.innerText = `📍 Du er i: ${selectedCity}`;
            display.style.color = 'var(--neon-cyan)';
            setTimeout(() => changeStep(1), 1500); // Gå videre efter kort forsinkelse
        } catch (e) {
            display.innerText = "Kunne ikke finde bynavn.";
            display.style.color = 'var(--neon-violet)';
        }
    }, (err) => {
        display.innerText = "GPS adgang nægtet eller fejl.";
        display.style.color = 'var(--neon-violet)';
    });
}

// Forslår byer baseret på input (autocomplete)
function suggestCity(input) {
    const suggestionsBox = document.getElementById('city-suggestions');
    if (input.length < 2) { suggestionsBox.style.display = 'none'; return; }

    const matches = mockData.cities.filter(c => c.toLowerCase().includes(input.toLowerCase()));
    renderSuggestions(matches, suggestionsBox, (city) => {
        document.getElementById('city-search').value = city;
        selectedCity = city;
        suggestionsBox.style.display = 'none';
    });
}

// Håndterer input og forslag for produkter
function suggestProduct(inputElement, index) {
    const query = inputElement.value.toLowerCase();
    currentProducts[index] = query; // Opdaterer varens værdi
    const suggestionsBox = document.querySelector(`#product-suggestions-${index}`);

    if (query.length < 2) { suggestionsBox.style.display = 'none'; return; }

    const matches = mockData.products.filter(p => p.name.toLowerCase().includes(query));
    renderSuggestions(matches.map(p => p.name), suggestionsBox, (productName) => {
        inputElement.value = productName;
        currentProducts[index] = productName;
        suggestionsBox.style.display = 'none';
    });
}

// Generel funktion til at vise forslag
function renderSuggestions(matches, suggestionsBox, onClickAction) {
    if (matches.length > 0) {
        suggestionsBox.innerHTML = matches.map(m => `
            <div class="suggestion-item" onclick="(${onClickAction.toString()})('${m}')">${m}</div>
        `).join('');
        suggestionsBox.style.display = 'block';
    } else {
        suggestionsBox.innerHTML = '';
        suggestionsBox.style.display = 'none';
    }
}

// Viser butikker i Trin 3
function renderStores() {
    const container = document.getElementById('store-list');
    if (mockData.stores && mockData.stores.length > 0) {
        container.innerHTML = mockData.stores.map(s => `
            <div class="store-item" data-store-id="${s.id}" onclick="toggleStoreSelection(this, '${s.id}')">
                <span>${s.name} (${s.dist.toFixed(1)} km)</span>
                <input type="checkbox" ${currentStores.includes(s.id) ? 'checked' : ''} readonly>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="status-text">Ingen butikker fundet i nærheden.</p>';
    }
}

// Tilføj/fjern butik fra udvalg
function toggleStoreSelection(element, storeId) {
    element.classList.toggle('selected');
    const checkbox = element.querySelector('input[type="checkbox"]');
    if (checkbox) checkbox.checked = !checkbox.checked;

    if (currentStores.includes(storeId)) {
        currentStores = currentStores.filter(id => id !== storeId);
    } else {
        currentStores.push(storeId);
    }
}

// Vælg alle butikker
function selectAllStores() {
    currentStores = mockData.stores.map(s => s.id);
    document.querySelectorAll('.store-item').forEach(item => item.classList.add('selected'));
    document.querySelectorAll('.store-item input[type="checkbox"]').forEach(cb => cb.checked = true);
}

// Mock data for byer, produkter og butikker
const mockData = {
    cities: ["København", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Vejle"],
    products: [
        { name: "Mælk", price: 10.0 },
        { name: "Rugbrød", price: 25.0 },
        { name: "Smør", price: 30.0 },
        { name: "Æg", price: 2.5 },
        { name: "Tomater", price: 5.0 },
        { name: "Agurk", price: 12.0 }
    ],
    stores: [
        { id: 'rema', name: 'REMA 1000', dist: 2.1, priceFactor: 0.95 },
        { id: 'netto', name: 'Netto', dist: 3.5, priceFactor: 0.90 },
        { id: 'lidl', name: 'Lidl', dist: 1.8, priceFactor: 0.92 },
        { id: 'fakta', name: 'Fakta', dist: 4.2, priceFactor: 0.98 }
    ]
};


// Funktion til at beregne de bedste priser (Trin 4)
function calculateBestPrices() {
    const resultArea = document.getElementById('result-area');
    resultArea.innerHTML = '<p class="status-text">Beregner de bedste tilbud...</p>';

    if (currentProducts.filter(p => p !== "").length === 0) {
        resultArea.innerHTML = '<p class="status-text">Tilføj venligst varer i Trin 2.</p>';
        return;
    }
    if (currentStores.length === 0) {
        resultArea.innerHTML = '<p class="status-text">Vælg venligst butikker i Trin 3.</p>';
        return;
    }

    let bestOption = { totalCost: Infinity, storeName: "", details: [] };
    const fuelCostPerKm = 1.5; // Simuleret brændstofpris

    currentStores.forEach(storeId => {
        const store = mockData.stores.find(s => s.id === storeId);
        if (!store) return;

        let currentStoreTotal = 0;
        let storeDetails = [];

        currentProducts.filter(p => p !== "").forEach(productName => {
            const product = mockData.products.find(p => p.name.toLowerCase() === productName.toLowerCase());
            if (product) {
                const price = product.price * store.priceFactor;
                currentStoreTotal += price;
                storeDetails.push(`${productName}: ${price.toFixed(2)} DKK`);
            } else {
                storeDetails.push(`${productName}: Ikke fundet`);
            }
        });

        const totalWithTravel = currentStoreTotal + (store.dist * 2 * fuelCostPerKm);

        if (totalWithTravel < bestOption.totalCost) {
            bestOption.totalCost = totalWithTravel;
            bestOption.storeName = store.name;
            bestOption.details = storeDetails;
        }
    });

    if (bestOption.storeName) {
        resultArea.innerHTML = `
            <div class="result-3d">
                <h3 style="color:var(--neon-gold);">🔥 Bedste Deal Fundet!</h3>
                <p>Din kurv er billigst i: <strong>${bestOption.storeName}</strong></p>
                <p>Totalpris (inkl. kørsel): <strong>${bestOption.totalCost.toFixed(2)} DKK</strong></p>
                <div style="margin-top:15px; border-top:1px solid var(--border-color); padding-top:10px;">
                    <h4>Varedetaljer:</h4>
                    <ul>
                        ${bestOption.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    } else {
        resultArea.innerHTML = '<p class="status-text">Kunne ikke finde en optimal løsning. Tjek dine varer og butikker.</p>';
    }
}
