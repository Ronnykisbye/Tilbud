// Hele appen styres herfra
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('dark-mode')) {
        body.classList.replace('dark-mode', 'light-mode');
    } else {
        body.classList.replace('light-mode', 'dark-mode');
    }
}

// Finder bynavn i stedet for kun GPS koordinater
async function getGPS() {
    const display = document.getElementById('location-display');
    display.innerText = "Finder din by...";

    navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
            // Bruger en gratis tjeneste (BigDataCloud) til at finde bynavnet
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=da`);
            const data = await response.json();
            const cityName = data.city || data.locality || "Ukendt by";
            
            display.innerText = `📍 Du er i: ${cityName}`;
            display.style.color = "var(--neon-cyan)";
            
            // Gem i state og gå videre
            setTimeout(() => changeStep(1), 1000);
        } catch (error) {
            display.innerText = `📍 Position fundet (${lat.toFixed(2)})`;
        }
    });
}

// Håndterer produkt-autosuggest (Retter ReferenceError)
function handleProductInput(inputElement) {
    const query = inputElement.value.toLowerCase();
    const suggestionBox = document.getElementById('product-suggestions');
    
    if (query.length < 2) {
        suggestionBox.style.display = 'none';
        return;
    }

    // Tjekker om mockData findes før brug (Kvalitetssikring)
    if (typeof mockData !== 'undefined') {
        const matches = mockData.products.filter(p => p.name.toLowerCase().includes(query));
        renderSuggestions(matches, inputElement);
    }
}

function renderSuggestions(matches, targetInput) {
    const box = document.getElementById('product-suggestions');
    box.style.display = 'block';
    box.innerHTML = matches.map(m => `
        <div class="suggestion-item" onclick="selectProduct('${m.name}', '${targetInput.id}')">
            ${m.name}
        </div>
    `).join('');
}
