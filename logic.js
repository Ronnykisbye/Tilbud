const i18n = {
    da: { titles: ["Find Butikker", "Vælg Varer", "Vælg Butikker", "Bedste Tilbud"], next: "NÆSTE", reset: "NY SØGNING", basket: "Din Kurv:", searching: "Scanner tilbudsaviser...", gps_status: "Finder din by...", hint: "Hvad søger du efter?" },
    pl: { titles: ["Znajdź Sklepy", "Produkty", "Sklepy", "Najlepsze Oferty"], next: "DALEJ", reset: "OD NOWA", basket: "Twój Koszyk:", searching: "Szukanie ofert...", gps_status: "Lokalizacja...", hint: "Czego potrzebujesz?" },
    de: { titles: ["Läden finden", "Artikel", "Läden", "Beste Angebote"], next: "WEITER", reset: "NEUE SUCHE", basket: "Warenkorb:", searching: "Suche Angebote...", gps_status: "Suche Stadt...", hint: "Was suchen Sie?" },
    en: { titles: ["Find Stores", "Add Items", "Stores", "Best Deals"], next: "NEXT", reset: "NEW SEARCH", basket: "Your Basket:", searching: "Searching offers...", gps_status: "Locating...", hint: "What are you looking for?" },
    lt: { titles: ["Parduotuvės", "Prekės", "Parduotuvės", "Geriausi Pasiūlymai"], next: "TOLIAU", reset: "NAUJA PAIEŠKA", basket: "Krepšelis:", searching: "Ieškoma pasiūlymų...", gps_status: "Ieškoma miesto...", hint: "Ko ieškote?" }
};

let currentStep = 1;
let currentLang = 'da';
let currentCountry = 'DK';
let selectedStoreIds = new Set();

function switchLanguage(lang) {
    currentLang = lang;
    updateUI();
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
}

function updateUI() {
    const t = i18n[currentLang];
    document.getElementById('title').innerText = t.titles[currentStep - 1];
    document.getElementById('next-btn').innerText = (currentStep === 4) ? t.reset : t.next;
    const hint = document.getElementById('hint-text');
    if (hint) hint.innerText = t.hint;
}

function handleNextAction() {
    if (currentStep === 4) location.reload();
    else changeStep(1);
}

function changeStep(dir) {
    const nextStep = currentStep + dir;
    if (nextStep < 1 || nextStep > 4) return;
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${nextStep}`).classList.add('active');
    currentStep = nextStep;
    document.getElementById('step-num').innerText = currentStep;
    document.getElementById('back-btn').style.display = (currentStep > 1) ? 'flex' : 'none';
    updateUI();
    if (currentStep === 3) renderStores();
    if (currentStep === 4) renderFinalResults();
}

async function getGPS() {
    const display = document.getElementById('location-display');
    display.innerText = i18n[currentLang].gps_status;
    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=${currentLang}`);
            const data = await res.json();
            currentCountry = data.countryCode || 'DK';
            document.getElementById('location-display').innerText = "📍 " + (data.city || data.locality || "OK");
        } catch (e) { display.innerText = "📍 Position fundet!"; }
    }, () => display.innerText = "GPS fejl");
}

function handleCityInput(val) {
    const box = document.getElementById('city-suggestions');
    if (val.length < 2) { box.style.display = 'none'; return; }
    const matches = mockData.cities.filter(c => c.toLowerCase().includes(val.toLowerCase()));
    box.innerHTML = matches.map(m => `<div class="suggestion-item" onclick="selectCity('${m}')">${m}</div>`).join('');
    box.style.display = matches.length > 0 ? 'block' : 'none';
}

function selectCity(city) {
    document.getElementById('city-search').value = city;
    document.getElementById('location-display').innerText = "📍 " + city;
    document.getElementById('city-suggestions').style.display = 'none';
}

function handleProductInput(input) {
    const box = document.getElementById('product-suggestions');
    const val = input.value.toLowerCase();
    if (val.length < 1) { box.style.display = 'none'; return; }
    
    // Smart søgning: Matcher både navn og kategori
    const matches = mockData.products.filter(p => 
        p.name.toLowerCase().includes(val) || 
        (p.category && p.category.toLowerCase().includes(val))
    );
    
    box.innerHTML = matches.map(m => `<div class="suggestion-item" onclick="selectProduct('${m.name}')"><b>${m.name}</b> <small>(${m.category})</small></div>`).join('');
    box.style.display = matches.length > 0 ? 'block' : 'none';
}

function selectProduct(name) {
    const inputs = document.querySelectorAll('.item-input');
    for (let input of inputs) {
        if (input.value === "") { input.value = name; break; }
    }
    document.getElementById('product-suggestions').style.display = 'none';
}

function renderStores() {
    const container = document.getElementById('store-list');
    const stores = mockData.countryStores[currentCountry] || mockData.countryStores['DK'];
    container.innerHTML = stores.map(s => `
        <div class="store-item ${selectedStoreIds.has(s.id) ? 'selected' : ''}" onclick="toggleStore('${s.id}')">
            <span>${s.name}</span>
            <span class="check-box">${selectedStoreIds.has(s.id) ? '✔' : ''}</span>
        </div>
    `).join('');
}

function toggleStore(id) {
    if (selectedStoreIds.has(id)) selectedStoreIds.delete(id);
    else selectedStoreIds.add(id);
    renderStores();
}

function selectAllStores() {
    const stores = mockData.countryStores[currentCountry] || mockData.countryStores['DK'];
    stores.forEach(s => selectedStoreIds.add(s.id));
    renderStores();
}

function renderFinalResults() {
    const resultArea = document.getElementById('result-area');
    const list = document.getElementById('final-basket-list');
    const items = Array.from(document.querySelectorAll('.item-input')).map(i => i.value).filter(v => v !== "");
    list.innerHTML = items.map(item => `<li>🛒 ${item}</li>`).join('');

    const stores = mockData.countryStores[currentCountry] || mockData.countryStores['DK'];
    let storeScores = Array.from(selectedStoreIds).map(storeId => {
        const store = stores.find(s => s.id === storeId);
        let total = 0;
        let details = items.map(itemName => {
            // Fuzzy matching til priser
            const product = mockData.products.find(p => 
                itemName.toLowerCase().includes(p.name.toLowerCase()) ||
                (p.category && itemName.toLowerCase().includes(p.category.toLowerCase()))
            );
            const price = product ? (product.price * store.priceFactor) : 0;
            const amount = product ? product.amount : "";
            total += price;
            return { name: itemName, price: price.toFixed(2), amount: amount };
        });
        return { name: store.name, total, details };
    }).sort((a, b) => a.total - b.total);

    resultArea.innerHTML = storeScores.map((s, idx) => `
        <div class="result-store-card ${idx === 0 ? 'cheapest' : ''}">
            <div class="store-header">
                <h4>${s.name}</h4>
                ${idx === 0 ? '<span class="badge">BILLIGST</span>' : ''}
            </div>
            <div class="price-details">
                ${s.details.map(d => `<div class="price-row"><span>${d.name} <small>${d.amount}</small></span><span>${d.price} kr</span></div>`).join('')}
            </div>
            <div class="total-row">Total: ${s.total.toFixed(2)} kr</div>
        </div>
    `).join('');
}
