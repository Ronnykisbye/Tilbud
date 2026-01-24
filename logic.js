let currentStep = 1;
let selectedStores = [];
let basketItems = [];

// Design & Mode er låst - rører ikke toggleTheme eller CSS

function handleNextAction() {
    if (currentStep === 4) {
        resetApp(); // Går til start hvis vi er på trin 4
    } else {
        changeStep(1);
    }
}

function resetApp() {
    // Nulstil alt data
    currentStep = 1;
    basketItems = [];
    selectedStores = [];
    document.querySelectorAll('.item-input').forEach(input => input.value = "");
    document.getElementById('location-display').innerText = "";
    
    // Gå til startvisning
    document.querySelectorAll('.step-view').forEach(view => view.classList.remove('active'));
    document.getElementById('step-1').classList.add('active');
    document.getElementById('step-num').innerText = "1";
    document.getElementById('title').innerText = "Find Butikker";
    document.getElementById('next-btn').innerText = "NÆSTE";
}

function changeStep(direction) {
    const next = currentStep + direction;
    if (next >= 1 && next <= 4) {
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        currentStep = next;
        document.getElementById(`step-${currentStep}`).classList.add('active');
        document.getElementById('step-num').innerText = currentStep;

        if (currentStep === 3) renderStores();
        if (currentStep === 4) {
            document.getElementById('next-btn').innerText = "NY SØGNING"; // Knappen skifter tekst
            renderFinalBasket();
            searchOffers(); // Søg i "tilbudsaviser"
        } else {
            document.getElementById('next-btn').innerText = "NÆSTE";
        }
    }
}

// Viser hvad der er i kurven i Trin 4
function renderFinalBasket() {
    const list = document.getElementById('final-basket-list');
    const inputs = document.querySelectorAll('.item-input');
    basketItems = Array.from(inputs).map(i => i.value).filter(v => v !== "");
    list.innerHTML = basketItems.map(item => `<li>🛒 ${item}</li>`).join('');
}

// API-Simulering: Søg i tilbudsaviser
async function searchOffers() {
    const resultArea = document.getElementById('result-area');
    resultArea.innerHTML = "<p class='status-text'>Scanner tilbudsaviser for de bedste priser...</p>";

    // Her ville man kalde et rigtigt API (fx Tjek.dk eller Salling Group)
    // Vi bruger mockData til at simulere fundne tilbud
    setTimeout(() => {
        let html = "<h3>Fundne Tilbud:</h3>";
        basketItems.forEach(item => {
            const offer = mockData.products.find(p => p.name.toLowerCase() === item.toLowerCase());
            if (offer) {
                html += `<div class='store-item' style='border-left: 4px solid var(--neon-cyan)'>
                            <b>${offer.name}</b> på tilbud til ${offer.price} kr.<br>
                            <small>Fundet i tilbudsavis hos REMA 1000</small>
                         </div>`;
            } else {
                html += `<div class='store-item'>Ingen aktuelle tilbud på ${item}</div>`;
            }
        });
        resultArea.innerHTML = html;
    }, 1500);
}

// Rettelse af Autosuggest fejl: Sørger for at mockData er klar
function handleProductInput(input) {
    const suggestions = document.getElementById('product-suggestions');
    const query = input.value.toLowerCase();
    
    if (query.length < 2) {
        suggestions.style.display = 'none';
        return;
    }

    const matches = mockData.products.filter(p => p.name.toLowerCase().includes(query));
    if (matches.length > 0) {
        suggestions.style.display = 'block';
        suggestions.innerHTML = matches.map(m => `
            <div class="suggestion-item" onclick="selectProduct('${m.name}', this)">${m.name}</div>
        `).join('');
    }
}

function selectProduct(name, element) {
    // Finder det aktive input felt der skal have værdien
    const activeInput = document.querySelector('.item-input:focus') || document.querySelector('.item-input');
    activeInput.value = name;
    element.parentElement.style.display = 'none';
}
