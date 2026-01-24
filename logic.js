let currentStep = 1;
let currentLang = 'da';
let basketItems = [];
let selectedStores = [];

// 1. SPROGPAKKER (Inklusive Polsk)
const i18n = {
    da: {
        titles: ["Find Butikker", "Vælg Varer", "Vælg Butikker", "Bedste Priser"],
        next: "NÆSTE",
        reset: "NY SØGNING",
        hint: "Hvad skal du bruge?",
        selectAll: "✅ VÆLG ALLE BUTIKKER",
        basket: "Din Kurv:",
        searching: "Søger i tilbudsaviser...",
        gps_status: "Finder din by..."
    },
    en: {
        titles: ["Find Stores", "Choose Items", "Select Stores", "Best Prices"],
        next: "NEXT",
        reset: "NEW SEARCH",
        hint: "What do you need?",
        selectAll: "✅ SELECT ALL STORES",
        basket: "Your Basket:",
        searching: "Searching catalogues...",
        gps_status: "Locating city..."
    },
    pl: { // POLSK TILFØJET HER
        titles: ["Znajdź Sklepy", "Wybierz Produkty", "Wybierz Sklepy", "Najlepsze Ceny"],
        next: "DALEJ",
        reset: "NOWE WYSZUKIWANIE",
        hint: "Czego potrzebujesz?",
        selectAll: "✅ WYBIERZ WSZYSTKIE SKLEPY",
        basket: "Twój Koszyk:",
        searching: "Przeszukiwanie gazetek...",
        gps_status: "Lokalizowanie miasta..."
    }
};

// 2. SKIFT SPROG FUNKTION
function switchLanguage(lang) {
    currentLang = lang;
    updateUI();
}

function updateUI() {
    const texts = i18n[currentLang];
    
    // Opdater Titel og Knapper
    document.getElementById('title').innerText = texts.titles[currentStep - 1];
    document.getElementById('hint-text').innerText = texts.hint;
    document.getElementById('select-all-btn').innerText = texts.selectAll;
    document.getElementById('basket-title').innerText = texts.basket;
    
    const nextBtn = document.getElementById('next-btn');
    nextBtn.innerText = (currentStep === 4) ? texts.reset : texts.next;
}

// 3. NAVIGATION (LÅST DESIGN)
function changeStep(direction) {
    const next = currentStep + direction;
    if (next >= 1 && next <= 4) {
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        currentStep = next;
        document.getElementById(`step-${currentStep}`).classList.add('active');
        document.getElementById('step-num').innerText = currentStep;

        // Vis/skjul returknap
        document.getElementById('back-btn').style.display = (currentStep > 1) ? 'block' : 'none';
        
        updateUI();

        if (currentStep === 3) renderStores();
        if (currentStep === 4) {
            renderFinalBasket();
            searchOffers();
        }
    }
}

function handleNextAction() {
    if (currentStep === 4) {
        location.reload(); // Genstart app (Ny søgning)
    } else {
        changeStep(1);
    }
}

// 4. GPS & BY-NAVN
async function getGPS() {
    const display = document.getElementById('location-display');
    display.innerText = i18n[currentLang].gps_status;

    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=${currentLang}`);
            const data = await res.json();
            display.innerText = "📍 " + (data.city || data.locality || "OK");
            display.style.color = "var(--neon-cyan)";
        } catch (e) {
            display.innerText = "📍 Fundet!";
        }
    });
}

// 5. AUTOSUGGEST (RETTET FEJL)
function handleProductInput(input) {
    const suggestions = document.getElementById('product-suggestions');
    const query = input.value.toLowerCase();
    
    if (query.length < 2) {
        suggestions.style.display = 'none';
        return;
    }

    // Filtrer produkter fra mockData
    const matches = mockData.products.filter(p => p.name.toLowerCase().includes(query));
    
    if (matches.length > 0) {
        suggestions.style.display = 'block';
        suggestions.innerHTML = matches.map(m => `
            <div class="suggestion-item" onclick="selectProduct('${m.name}')">${m.name}</div>
        `).join('');
    }
}

function selectProduct(name) {
    // Find det tomme felt eller det felt der sidst var i fokus
    const inputs = document.querySelectorAll('.item-input');
    for (let input of inputs) {
        if (input.value === "" || name.toLowerCase().includes(input.value.toLowerCase())) {
            input.value = name;
            break;
        }
    }
    document.getElementById('product-suggestions').style.display = 'none';
}

// 6. RESULTATER & KURV
function renderFinalBasket() {
    const list = document.getElementById('final-basket-list');
    const inputs = document.querySelectorAll('.item-input');
    basketItems = Array.from(inputs).map(i => i.value).filter(v => v !== "");
    list.innerHTML = basketItems.map(item => `<li>🛒 ${item}</li>`).join('');
}

async function searchOffers() {
    const resultArea = document.getElementById('result-area');
    resultArea.innerHTML = `<p>${i18n[currentLang].searching}</p>`;
    
    // Simulering af API-søgning
    setTimeout(() => {
        let html = "";
        basketItems.forEach(item => {
            html += `<div class="store-item" style="border-left:4px solid var(--neon-cyan)">
                        <b>${item}</b> - 12.50 PLN <br>
                        <small>Biedronka / Lidl</small>
                     </div>`;
        });
        resultArea.innerHTML = html;
    }, 1200);
}
