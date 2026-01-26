// SBS: Én samlet sprogpakke for at undgå SyntaxError
const i18n = {
    da: { titles: ["Find Butikker", "Vælg Varer", "Vælg Butikker", "Bedste Tilbud"], next: "NÆSTE", reset: "NY SØGNING", basket: "Din Kurv:", searching: "Scanner...", gps_status: "Finder by...", hint: "Hvad søger du?" },
    pl: { titles: ["Znajdź Sklepy", "Produkty", "Sklepy", "Ceny"], next: "DALEJ", reset: "OD NOWA", basket: "Twój Koszyk:", searching: "Szukanie...", gps_status: "Lokalizacja...", hint: "Czego potrzebujesz?" },
    de: { titles: ["Läden", "Artikel", "Läden", "Preise"], next: "WEITER", reset: "NEUE SUCHE", basket: "Warenkorb:", searching: "Suche...", gps_status: "Stadt...", hint: "Was suchen Sie?" },
    en: { titles: ["Find Stores", "Add Items", "Stores", "Prices"], next: "NEXT", reset: "NEW SEARCH", basket: "Your Basket:", searching: "Searching...", gps_status: "Locating...", hint: "What do you need?" },
    lt: { titles: ["Parduotuvės", "Prekės", "Parduotuvės", "Kainos"], next: "TOLIAU", reset: "NAUJA PAIEŠKA", basket: "Krepšelis:", searching: "Ieškoma...", gps_status: "Miestas...", hint: "Ko reikia?" }
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
    const title = document.getElementById('title');
    const nextBtn = document.getElementById('next-btn');
    if (title) title.innerText = t.titles[currentStep - 1];
    if (nextBtn) nextBtn.innerText = (currentStep === 4) ? t.reset : t.next;
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
    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.style.display = (currentStep > 1) ? 'flex' : 'none';
    updateUI();
    if (currentStep === 3) renderStores();
    if (currentStep === 4) renderFinalResults();
}

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

function renderFinalResults() {
    const resultArea = document.getElementById('result-area');
    const items = Array.from(document.querySelectorAll('.item-input')).map(i => i.value).filter(v => v !== "");
    const stores = mockData.countryStores[currentCountry] || mockData.countryStores['DK'];
    
    let results = Array.from(selectedStoreIds).map(id => {
        const store = stores.find(s => s.id === id);
        let total = 0;
        let details = items.map(itemName => {
            // Smart Matching: søger efter delvise navne for at undgå 0.00 kr fejl
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

    resultArea.innerHTML = results.map((r, i) => `
        <div class="result-card ${i === 0 ? 'cheapest' : ''}">
            <h4>${r.name} ${i === 0 ? '🏆 BILLIGST' : ''}</h4>
            ${r.details.map(d => `<div class="p-row"><span>${d.name}</span><span>${d.price} kr</span></div>`).join('')}
            <div class="total">Total: ${r.total.toFixed(2)} kr</div>
        </div>
    `).join('');
}
