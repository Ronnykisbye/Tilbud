let currentStep = 1;
let currentLang = localStorage.getItem('appLang') || 'da';
let selectedStoreIds = new Set();
let currentCountry = 'DK';

function initApp() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') document.body.classList.add('light-mode');
    
    const langSelect = document.getElementById('lang-select');
    if (langSelect) langSelect.value = currentLang;
    updateUI();
}

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('appLang', lang);
    updateUI();
}

function updateUI() {
    const t = i18n[currentLang];
    const title = document.getElementById('title');
    const nextBtn = document.getElementById('next-btn');
    const hint = document.getElementById('hint-text');
    
    if (title) title.innerText = t.titles[currentStep - 1];
    if (nextBtn) nextBtn.innerText = (currentStep === 4) ? t.reset : t.next;
    if (hint) hint.innerText = t.hint;
}

function changeStep(dir) {
    const next = currentStep + dir;
    if (next < 1 || next > 4) return;
    
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${next}`).classList.add('active');
    
    currentStep = next;
    const stepNum = document.getElementById('step-num');
    if (stepNum) stepNum.innerText = currentStep;
    
    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.style.display = (currentStep > 1) ? 'flex' : 'none';
    
    updateUI();
    if (currentStep === 3) renderStores();
    if (currentStep === 4) renderFinalResults();
}

function handleNextAction() {
    if (currentStep === 4) location.reload();
    else changeStep(1);
}

// LOKATION & SØGNING
async function getGPS() {
    const display = document.getElementById('location-display');
    if (display) display.innerText = i18n[currentLang].gps || "Finder...";
    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=${currentLang}`);
            const data = await res.json();
            currentCountry = data.countryCode || 'DK';
            const city = data.city || data.locality || "OK";
            if (display) display.innerText = "📍 " + city;
        } catch (e) { if (display) display.innerText = "📍 Fundet!"; }
    });
}

function handleProductInput(input) {
    const box = document.getElementById('product-suggestions');
    const val = input.value.toLowerCase();
    if (!box || val.length < 1) { if(box) box.style.display = 'none'; return; }
    
    const matches = mockData.products.filter(p => p.name.toLowerCase().includes(val));
    box.innerHTML = matches.map(m => `<div class="suggestion-item" onclick="selectProduct('${m.name}')">${m.name}</div>`).join('');
    box.style.display = matches.length > 0 ? 'block' : 'none';
}

function selectProduct(name) {
    const inputs = document.querySelectorAll('.item-input');
    for (let input of inputs) {
        if (input.value === "" || input.placeholder.includes("Vare")) {
            input.value = name;
            break;
        }
    }
    document.getElementById('product-suggestions').style.display = 'none';
}

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
    const items = Array.from(document.querySelectorAll('.item-input')).map(i => i.value).filter(v => v !== "");
    const stores = mockData.countryStores[currentCountry] || mockData.countryStores['DK'];
    
    let results = Array.from(selectedStoreIds).map(id => {
        const store = stores.find(s => s.id === id);
        let total = 0;
        let details = items.map(itemName => {
            const prod = mockData.products.find(p => itemName.toLowerCase().includes(p.name.toLowerCase()));
            const price = prod ? (prod.price * store.priceFactor) : 0;
            total += price;
            return { name: itemName, price: price.toFixed(2) };
        });
        return { name: store.name, total, details };
    }).sort((a, b) => a.total - b.total);

    resultArea.innerHTML = results.map((r, i) => `
        <div class="result-store-card ${i === 0 ? 'cheapest' : ''}">
            <h4>${r.name} ${i === 0 ? '🏆' : ''}</h4>
            ${r.details.map(d => `<div class="price-row"><span>${d.name}</span><span>${d.price} kr</span></div>`).join('')}
            <div class="total-row">Total: ${r.total.toFixed(2)} kr</div>
        </div>
    `).join('');
}

window.onload = initApp;
