// Fjern enhver dubleret deklaration af i18n øverst i filen!
const i18n = {
    da: { titles: ["Find Butikker", "Vælg Varer", "Vælg Butikker", "Priser"], next: "NÆSTE", reset: "NY SØGNING", basket: "Din Kurv:", searching: "Scanner tilbudsaviser...", gps_status: "Finder by..." },
    en: { titles: ["Find Stores", "Add Items", "Stores", "Prices"], next: "NEXT", reset: "NEW SEARCH", basket: "Your Basket:", searching: "Searching offers...", gps_status: "Locating..." },
    pl: { titles: ["Znajdź Sklepy", "Produkty", "Sklepy", "Ceny"], next: "DALEJ", reset: "OD NOWA", basket: "Twój Koszyk:", searching: "Szukanie ofert...", gps_status: "Lokalizacja..." },
    lt: { titles: ["Rasti Parduotuves", "Prekės", "Parduotuvės", "Kainos"], next: "TOLIAU", reset: "NAUJA PAIEŠKA", basket: "Jūsų krepšelis:", searching: "Ieškoma pasiūlymų...", gps_status: "Ieškoma miesto..." }
};

let currentStep = 1;
let currentLang = 'da';

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
    document.getElementById('title').innerText = t.titles[currentStep - 1];
    document.getElementById('next-btn').innerText = (currentStep === 4) ? t.reset : t.next;
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
        if (currentStep === 4) searchOffers();
    }
}

// Retter fejlen ved manuel indtastning af by
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
    });
}
// ... Resten af funktionerne (handleProductInput, renderStores osv) skal beholdes fra forrige version.
