const i18n = {
    da: { titles: ["Find Butikker", "Vælg Varer", "Vælg Butikker", "Priser"], next: "NÆSTE", reset: "NY SØGNING", basket: "Din Kurv:", searching: "Scanner tilbudsaviser...", gps_status: "Finder by...", hint: "Hvad skal du bruge?", empty_stores: "Ingen butikker valgt" },
    pl: { titles: ["Znajdź Sklepy", "Produkty", "Sklepy", "Ceny"], next: "DALEJ", reset: "OD NOWA", basket: "Twój Koszyk:", searching: "Szukanie ofert...", gps_status: "Lokalizacja...", hint: "Czego potrzebujesz?", empty_stores: "Nie wybrano sklepów" },
    de: { titles: ["Läden finden", "Artikel", "Läden", "Preise"], next: "WEITER", reset: "NEUE SUCHE", basket: "Warenkorb:", searching: "Suche Angebote...", gps_status: "Suche Stadt...", hint: "Was brauchen Sie?", empty_stores: "Keine Läden gewählt" },
    en: { titles: ["Find Stores", "Add Items", "Stores", "Prices"], next: "NEXT", reset: "NEW SEARCH", basket: "Your Basket:", searching: "Searching offers...", gps_status: "Locating...", hint: "What do you need?", empty_stores: "No stores selected" },
    lt: { titles: ["Rasti Parduotuves", "Prekės", "Parduotuvės", "Kainos"], next: "TOLIAU", reset: "NAUJA PAIEŠKA", basket: "Jūsų krepšelis:", searching: "Ieškoma pasiūlymų...", gps_status: "Ieškoma miesto...", hint: "Ko jums reikia?", empty_stores: "Nepasirinkta parduotuvių" }
};

let currentStep = 1;
let currentLang = 'da';
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
    const elements = {
        title: document.getElementById('title'),
        nextBtn: document.getElementById('next-btn'),
        hint: document.getElementById('hint-text'),
        basketTitle: document.getElementById('basket-title')
    };
    if (elements.title) elements.title.innerText = t.titles[currentStep - 1];
    if (elements.nextBtn) elements.nextBtn.innerText = (currentStep === 4) ? t.reset : t.next;
    if (elements.hint) elements.hint.innerText = t.hint;
    if (elements.basketTitle) elements.basketTitle.innerText = t.basket;
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

function handleCityInput(val) {
    const box = document.getElementById('city-suggestions');
    if (!box) return;
    if (val.length < 2) { box.style.display = 'none'; return; }
    const matches = mockData.cities.filter(c => c.toLowerCase().includes(val.toLowerCase()));
    box.innerHTML = matches.map(m => `<div class="suggestion-item" onclick="selectCity('${m}')">${m}</div>`).join('');
    box.style.display = matches.length > 0 ? 'block' : 'none';
}

function selectCity(city) {
    document.getElementById('city-search').value = city;
    document.getElementById('city-suggestions').style.display = 'none';
    document.getElementById('location-display').innerText = "📍 " + city;
}

async function getGPS() {
    const display = document.getElementById('location-display');
    display.innerText = i18n[currentLang].gps_status;
    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=${currentLang}`);
            const data = await res.json();
            selectCity(data.city || data.locality || "OK");
        } catch (e) { display.innerText = "📍 Fundet!"; }
    }, () => display.innerText = "GPS fejl");
}

function handleProductInput(input) {
    const box = document.getElementById('product-suggestions');
    const val = input.value.toLowerCase();
    if (val.length < 2) { box.style.display = 'none'; return; }
    const matches = mockData.products.filter(p => p.name.toLowerCase().includes(val));
    box.innerHTML = matches.map(m => `<div class="suggestion-item" onclick="selectProduct('${m.name}')">${m.name}</div>`).join('');
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
    container.innerHTML = mockData.stores.map(s => `
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
    mockData.stores.forEach(s => selectedStoreIds.add(s.id));
    renderStores();
}

function renderFinalResults() {
    const list = document.getElementById('final-basket-list');
    const resultArea = document.getElementById('result-area');
    const items = Array.from(document.querySelectorAll('.item-input')).map(i => i.value).filter(v => v !== "");
    list.innerHTML = items.map(item => `<li>🛒 ${item}</li>`).join('');

    let storeScores = Array.from(selectedStoreIds).map(storeId => {
        const store = mockData.stores.find(s => s.id === storeId);
        let total = 0;
        let details = items.map(itemName => {
            const product = mockData.products.find(p => p.name.toLowerCase() === itemName.toLowerCase());
            const price = product ? (product.price * store.priceFactor) : 0;
            total += price;
            return { name: itemName, price: price.toFixed(2) };
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
                ${s.details.map(d => `<div class="price-row"><span>${d.name}</span><span>${d.price} kr</span></div>`).join('')}
            </div>
            <div class="total-row">Total: ${s.total.toFixed(2)} kr</div>
        </div>
    `).join('');
}
