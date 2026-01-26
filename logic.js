let currentStep = 1;
let currentLang = 'da';
let currentCountry = 'DK'; // Automatisk detektering via GPS
let selectedStoreIds = new Set();

const i18n = {
    da: { titles: ["Find Butikker", "Vælg Varer", "Vælg Butikker", "Priser"], next: "NÆSTE", reset: "NY SØGNING", basket: "Din Kurv:", searching: "Scanner...", gps_status: "Finder by...", hint: "Hvad skal du bruge?" },
    pl: { titles: ["Znajdź Sklepy", "Produkty", "Sklepy", "Ceny"], next: "DALEJ", reset: "OD NOWA", basket: "Twój Koszyk:", searching: "Szukanie...", gps_status: "Lokalizacja...", hint: "Czego potrzebujesz?" },
    de: { titles: ["Läden", "Artikel", "Läden", "Preise"], next: "WEITER", reset: "NEUE SUCHE", basket: "Warenkorb:", searching: "Suche...", gps_status: "Stadt...", hint: "Was brauchen Sie?" },
    en: { titles: ["Find Stores", "Add Items", "Stores", "Prices"], next: "NEXT", reset: "NEW SEARCH", basket: "Your Basket:", searching: "Searching...", gps_status: "Locating...", hint: "What do you need?" },
    lt: { titles: ["Parduotuvės", "Prekės", "Parduotuvės", "Kainos"], next: "TOLIAU", reset: "NAUJA PAIEŠKA", basket: "Krepšelis:", searching: "Ieškoma...", gps_status: "Miestas...", hint: "Ko reikia?" }
};

function switchLanguage(lang) {
    currentLang = lang;
    updateUI();
}

function updateUI() {
    const t = i18n[currentLang];
    document.getElementById('title').innerText = t.titles[currentStep - 1];
    document.getElementById('next-btn').innerText = (currentStep === 4) ? t.reset : t.next;
    const hint = document.getElementById('hint-text');
    if (hint) hint.innerText = t.hint;
}

function changeStep(dir) {
    const nextStep = currentStep + dir;
    if (nextStep < 1 || nextStep > 4) return;
    
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${nextStep}`).classList.add('active');
    currentStep = nextStep;
    
    document.getElementById('step-num').innerText = currentStep;
    document.getElementById('back-btn').style.display = (currentStep > 1) ? 'block' : 'none';
    
    updateUI();
    if (currentStep === 3) renderStores();
    if (currentStep === 4) renderResults();
}

async function getGPS() {
    const display = document.getElementById('location-display');
    display.innerText = i18n[currentLang].gps_status;
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=da`);
        const data = await res.json();
        currentCountry = data.countryCode; // Finder landet (DK, PL, osv.)
        selectCity(data.city || data.locality);
    });
}

function selectCity(city) {
    document.getElementById('city-search').value = city;
    document.getElementById('location-display').innerText = "📍 " + city;
    document.getElementById('city-suggestions').style.display = 'none';
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

function renderResults() {
    const resultArea = document.getElementById('result-area');
    const items = Array.from(document.querySelectorAll('.item-input')).map(i => i.value).filter(v => v !== "");
    const stores = mockData.countryStores[currentCountry] || mockData.countryStores['DK'];
    
    let results = Array.from(selectedStoreIds).map(id => {
        const store = stores.find(s => s.id === id);
        let total = 0;
        let details = items.map(itemName => {
            const prod = mockData.products.find(p => p.name.toLowerCase() === itemName.toLowerCase());
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

function handleNextAction() {
    if (currentStep === 4) location.reload();
    else changeStep(1);
}
