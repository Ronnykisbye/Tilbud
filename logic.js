let currentStep = 1;

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
}

function updateRad(val) {
    document.getElementById('rad-val').innerText = val;
}

function changeStep(dir) {
    const next = currentStep + dir;
    if (next >= 1 && next <= 4) {
        document.getElementById(`step-${currentStep}`).style.display = 'none';
        currentStep = next;
        document.getElementById(`step-${currentStep}`).style.display = 'block';
        document.getElementById('step-num').innerText = currentStep;
        
        const titles = ["Find Butikker", "Vælg Varer", "Vælg Butikker", "Bedste Priser"];
        document.getElementById('title').innerText = titles[currentStep - 1];
        
        if (currentStep === 3) renderStores();
    }
}

async function getGPS() {
    const display = document.getElementById('location-display');
    display.innerText = "Søger din by...";
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
            const resp = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=da`);
            const data = await resp.json();
            display.innerText = `📍 Du er i: ${data.city || data.locality || "Din by"}`;
            display.style.color = "var(--neon-cyan)";
            setTimeout(() => changeStep(1), 1500);
        } catch (e) {
            display.innerText = "📍 Position fundet!";
        }
    }, () => {
        display.innerText = "GPS adgang nægtet.";
    });
}

function handleProductInput(input) {
    const query = input.value.toLowerCase();
    const suggestions = document.getElementById('product-suggestions');
    if (query.length < 2) { suggestions.style.display = 'none'; return; }
    
    if (typeof mockData !== 'undefined') {
        const matches = mockData.products.filter(p => p.name.toLowerCase().includes(query));
        suggestions.style.display = 'block';
        suggestions.innerHTML = matches.map(m => `
            <div class="suggestion-item" onclick="this.parentElement.style.display='none';">${m.name}</div>
        `).join('');
    }
}
