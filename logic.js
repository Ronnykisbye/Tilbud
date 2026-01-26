// SBS: Én samlet sprogpakke for at undgå SyntaxError
const i18n = {
    da: { titles: ["Find Butikker", "Vælg Varer", "Vælg Butikker", "Priser"], next: "NÆSTE", reset: "NY SØGNING", basket: "Din Kurv:", searching: "Scanner...", gps_status: "Finder by...", hint: "Hvad skal du bruge?" },
    pl: { titles: ["Znajdź Sklepy", "Produkty", "Sklepy", "Ceny"], next: "DALEJ", reset: "OD NOWA", basket: "Twój Koszyk:", searching: "Szukanie...", gps_status: "Lokalizacja...", hint: "Czego potrzebujesz?" },
    de: { titles: ["Läden finden", "Artikel", "Läden", "Preise"], next: "WEITER", reset: "NEUE SUCHE", basket: "Warenkorb:", searching: "Suche...", gps_status: "Suche Stadt...", hint: "Was brauchen Sie?" },
    en: { titles: ["Find Stores", "Add Items", "Stores", "Prices"], next: "NEXT", reset: "NEW SEARCH", basket: "Your Basket:", searching: "Searching offers...", gps_status: "Locating...", hint: "What do you need?" },
    lt: { titles: ["Parduotuvės", "Prekės", "Parduotuvės", "Kainos"], next: "TOLIAU", reset: "NAUJA PAIEŠKA", basket: "Krepšelis:", searching: "Ieškoma...", gps_status: "Ieškoma miesto...", hint: "Ko jums reikia?" }
};

let currentStep = 1;
let currentLang = 'da';
let currentCountry = 'DK';
let selectedStoreIds = new Set();

// 1. UI & TEMA FUNKTIONER
function switchLanguage(lang) {
    currentLang = lang;
    updateUI();
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
}

function updateUI() {
    const t = i18n[currentLang];
    const title = document.getElementById('title');
    const nextBtn = document.getElementById('next-btn');
    if (title) title.innerText = t.titles[currentStep - 1];
    if (nextBtn) nextBtn.innerText = (currentStep === 4) ? t.reset : t.next;
    const hint = document.getElementById('hint-text');
    if (hint) hint.innerText = t.hint;
}

// 2. NAVIGATION
function handleNextAction() {
    if (currentStep === 4) { location.reload(); } 
    else { changeStep(1); }
}

function changeStep(dir) {
    const nextStep = currentStep + dir;
    if (nextStep < 1 || nextStep > 4) return;

    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${nextStep}`).classList.add('active');
    currentStep = nextStep;
    
    const stepNum = document.getElementById('step-num');
    const backBtn = document.getElementById('back-btn');
    if (stepNum) stepNum.innerText = currentStep;
    if (backBtn) backBtn.style.display = (currentStep > 1) ? 'flex' : 'none';
    
    updateUI();
    if (currentStep === 3) renderStores();
    if (currentStep === 4) renderFinalResults();
}

// 3. LOKATION & BY
async function getGPS() {
    const display = document.getElementById('location-display');
    if (display) display.innerText = i18n[currentLang].gps_status;
    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=${currentLang}`);
            const data = await res.json();
            currentCountry = data.countryCode || 'DK';
            selectCity(data.city || data.locality || "OK");
        } catch (e) { if (display) display.innerText = "📍 Fundet!"; }
    });
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
    const input = document.getElementById('city-search');
    const display = document.getElementById('location-display');
    if (input) input.value = city;
    if (display) display.innerText = "📍 " + city;
    const box = document.getElementById('city-suggestions');
    if (box) box.style.display = 'none';
}

// 4. VARE-SØGNING (SMART MATCHING)
function handleProductInput(input) {
    const box = document.getElementById('product-suggestions');
    if (!box) return;
    const val = input.value.toLowerCase();
    if (val.length < 2) { box.style.display = 'none'; return; }
    
    const matches = mockData.products.filter(p => 
        p.name.toLowerCase().includes(val) || 
        (p.category && p.category.toLowerCase().includes(val))
    );
    
    box.innerHTML = matches.map(m => `<div class="suggestion-item" onclick="selectProduct('${m.name}')"><b>${m.name}</b> <small>${m.amount || ""}</small></div>`).join('');
    box.style.display = matches.length > 0 ? 'block' : 'none';
}

function selectProduct(name) {
    const inputs = document.querySelectorAll('.item-input');
    for (let input of inputs) {
        if (input.value === "") { input.value = name; break; }
    }
    const box = document.getElementById('product-suggestions');
    if (box) box.style.display = 'none';
}

// 5. BUTIKKER & RESULTATER
function renderStores() {
    const container = document.getElementById('store-list');
    if (!container) return;
    const stores = mockData.countryStores[currentCountry] || mockData.countryStores['DK'];
    container.innerHTML = stores.map(s => `
        <div class="store-item ${selectedStoreIds.has(s.id) ? 'selected' : ''}" onclick="toggleStore('${s.id}')">
            <span>${s.name}</span>
            <span class="v-mark">${selectedStoreIds.has(s.id) ? '✔' : ''}</span>
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
    if (list) list.innerHTML = items.map(item => `<li>🛒 ${item}</li>`).join('');

    const stores = mockData.countryStores[currentCountry] || mockData.countryStores['DK'];
    let results = Array.from(selectedStoreIds).map(id => {
        const store = stores.find(s => s.id === id);
        let total = 0;
        let details = items.map(itemName => {
            const prod = mockData.products.find(p => 
                itemName.toLowerCase().includes(p.name.toLowerCase()) || 
                p.name.toLowerCase().includes(itemName.toLowerCase())
            );
            const price = prod ? (prod.price * store.priceFactor) : 0;
            total += price;
            return { name: itemName, price: price.toFixed(2) };
        });
        return { name: store.name, total, details };
    }).sort((a, b) => a.total - b.total);

    if (resultArea) {
        resultArea.innerHTML = results.map((r, i) => `
            <div class="result-card ${i === 0 ? 'cheapest' : ''}">
                <div class="store-header">
                    <h4>${r.name}</h4>
                    ${i === 0 ? '<span class="badge">BILLIGST</span>' : ''}
                </div>
                ${r.details.map(d => `<div class="p-row"><span>${d.name}</span><span>${d.price} kr</span></div>`).join('')}
                <div class="total">Total: ${r.total.toFixed(2)} kr</div>
            </div>
        `).join('');
    }
}
