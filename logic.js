// SPROGPAKKER - Defineres kun én gang for at undgå SyntaxError
const i18n = {
    da: { titles: ["Find Butikker", "Vælg Varer", "Vælg Butikker", "Priser"], next: "NÆSTE", reset: "NY SØGNING", basket: "Din Kurv:", searching: "Scanner tilbudsaviser...", gps_status: "Finder by...", hint: "Hvad skal du bruge?" },
    pl: { titles: ["Znajdź Sklepy", "Produkty", "Sklepy", "Ceny"], next: "DALEJ", reset: "OD NOWA", basket: "Twój Koszyk:", searching: "Szukanie ofert...", gps_status: "Lokalizacja...", hint: "Czego potrzebujesz?" },
    de: { titles: ["Läden finden", "Artikel", "Läden", "Preise"], next: "WEITER", reset: "NEUE SUCHE", basket: "Warenkorb:", searching: "Suche Angebote...", gps_status: "Suche Stadt...", hint: "Was brauchen Sie?" },
    en: { titles: ["Find Stores", "Add Items", "Stores", "Prices"], next: "NEXT", reset: "NEW SEARCH", basket: "Your Basket:", searching: "Searching offers...", gps_status: "Locating...", hint: "What do you need?" },
    lt: { titles: ["Rasti Parduotuves", "Prekės", "Parduotuvės", "Kainos"], next: "TOLIAU", reset: "NAUJA PAIEŠKA", basket: "Jūsų krepšelis:", searching: "Ieškoma pasiūlymų...", gps_status: "Ieškoma miesto...", hint: "Ko jums reikia?" }
};

let currentStep = 1;
let currentLang = 'da';

// FUNKTIONER TIL INTERFACE
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
    const hintElem = document.getElementById('hint-text');
    if (hintElem) hintElem.innerText = t.hint;
}

function handleNextAction() {
    if (currentStep === 4) { location.reload(); } 
    else { changeStep(1); }
}

function changeStep(dir) {
    const currentView = document.getElementById(`step-${currentStep}`);
    const nextStep = currentStep + dir;
    const nextView = document.getElementById(`step-${nextStep}`);

    if (nextView) {
        currentView.classList.remove('active');
        nextView.classList.add('active');
        currentStep = nextStep;
        document.getElementById('step-num').innerText = currentStep;
        document.getElementById('back-btn').style.display = (currentStep > 1) ? 'block' : 'none';
        updateUI();
        if (currentStep === 3) renderStores();
        if (currentStep === 4) renderFinalBasket();
    }
}

// LOKATION OG SØGNING
function handleCityInput(val) {
    const box = document.getElementById('city-suggestions');
    if (val.length < 2) { box.style.display = 'none'; return; }
    const matches = mockData.cities.filter(c => c.toLowerCase().includes(val.toLowerCase()));
    if (matches.length > 0) {
        box.style.display = 'block';
        box.innerHTML = matches.map(m => `<div class="suggestion-item" onclick="selectCity('${m}')">${m}</div>`).join('');
    }
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
            const city = data.city || data.locality || "OK";
            selectCity(city);
        } catch (e) { display.innerText = "📍 Fundet!"; }
    }, () => { display.innerText = "GPS fejl"; });
}

// VAREHÅNDTERING
function handleProductInput(input) {
    const box = document.getElementById('product-suggestions');
    const val = input.value.toLowerCase();
    if (val.length < 2) { box.style.display = 'none'; return; }
    const matches = mockData.products.filter(p => p.name.toLowerCase().includes(val));
    if (matches.length > 0) {
        box.style.display = 'block';
        box.innerHTML = matches.map(m => `
            <div class="suggestion-item" onclick="selectProduct('${m.name}')">${m.name}</div>
        `).join('');
    }
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
    if (container) {
        container.innerHTML = mockData.stores.map(s => `
            <div class="store-item" onclick="this.classList.toggle('selected')">
                <span>${s.name}</span>
            </div>
        `).join('');
    }
}

function renderFinalBasket() {
    const list = document.getElementById('final-basket-list');
    const items = Array.from(document.querySelectorAll('.item-input')).map(i => i.value).filter(v => v !== "");
    if (list) list.innerHTML = items.map(item => `<li>🛒 ${item}</li>`).join('');
}
