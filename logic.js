let currentStep = 1;
let selectedStores = [];

// Skift Tema
function toggleTheme() {
    document.body.classList.toggle('light-mode');
}

// Opdater Radius
function updateRad(val) {
    document.getElementById('rad-val').innerText = val;
}

// Navigation (Retter din fejl fra billedet)
function changeStep(direction) {
    const next = currentStep + direction;
    const currentView = document.getElementById(`step-${currentStep}`);
    const nextView = document.getElementById(`step-${next}`);

    if (nextView) {
        currentView.style.display = 'none';
        nextView.style.display = 'block';
        currentStep = next;
        document.getElementById('step-num').innerText = currentStep;
        
        const titles = ["Find Butikker", "Vælg Varer", "Vælg Butikker", "Bedste Priser"];
        document.getElementById('title').innerText = titles[currentStep - 1];

        if(currentStep === 3) renderStores();
    }
}

// GPS med tekst-feedback
async function getGPS() {
    const status = document.getElementById('location-display');
    status.innerText = "Søger din position...";
    
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            status.innerText = `📍 Du er i nærheden af: Lat ${pos.coords.latitude.toFixed(2)}, Lon ${pos.coords.longitude.toFixed(2)}`;
            status.style.color = "var(--neon-cyan)";
            setTimeout(() => changeStep(1), 1500);
        },
        () => {
            status.innerText = "Kunne ikke finde position. Prøv manuelt.";
            status.style.color = "red";
        }
    );
}

// Autosuggest Byer
function suggestCity(input) {
    const list = document.getElementById('city-suggestions');
    if(input.length < 2) { list.innerHTML = ""; return; }
    
    const matches = mockData.cities.filter(c => c.toLowerCase().includes(input.toLowerCase()));
    list.innerHTML = matches.map(m => `<div class="suggestion-item" onclick="selectCity('${m}')">${m}</div>`).join('');
}

function selectCity(city) {
    document.getElementById('city-search').value = city;
    document.getElementById('city-suggestions').innerHTML = "";
}

// Butiksliste
function renderStores() {
    const container = document.getElementById('store-list');
    container.innerHTML = mockData.stores.map(s => `
        <div class="store-item" onclick="this.classList.toggle('selected')">
            <span>${s.name}</span>
            <input type="checkbox" checked>
        </div>
    `).join('');
}
