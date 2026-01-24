let currentLang = 'da'; // Kan nemt ændres til 'en'
let currentStep = 1;
let basketItems = [];

/* Afsnit 01: Viral Delings-funktion */
async function shareSavings(total) {
    const shareData = {
        title: 'Neon-Spar 2026',
        text: `Jeg har lige sparet penge på mine dagligvarer med Neon-Spar! Min kurv kostede kun ${total} kr.`,
        url: window.location.href
    };
    try {
        await navigator.share(shareData);
    } catch (err) {
        console.log("Deling ikke understøttet på denne browser");
    }
}

/* Afsnit 02: Dynamisk Oversættelse */
function updateUIStrings() {
    const strings = i18n[currentLang];
    document.getElementById('next-btn').innerText = (currentStep === 4) ? strings.reset : strings.next;
    // ... opdaterer alle titler automatisk
}

/* Afsnit 03: Forbedret Tilbuds-API Logik */
async function searchOffers() {
    const resultArea = document.getElementById('result-area');
    resultArea.innerHTML = `<div class="loader"></div><p>Searching international databases...</p>`;

    // Simulering af internationalt API kald
    setTimeout(() => {
        let totalSavings = 0;
        let html = `<h3>${i18n[currentLang].title4}</h3>`;
        
        basketItems.forEach(item => {
            const deal = mockData.products.find(p => p.name.toLowerCase() === item.toLowerCase());
            if(deal) {
                totalSavings += (deal.price * 0.2); // Antag 20% besparelse
                html += `<div class="store-item">✅ <b>${deal.name}</b>: Billigst i dag!</div>`;
            }
        });

        html += `<button class="btn-3d" style="background:var(--neon-gold)" onclick="shareSavings(${totalSavings})">DEL BESPARELSE 🚀</button>`;
        resultArea.innerHTML = html;
    }, 1500);
}

/* Afsnit 04: Reset & Navigation */
function handleNextAction() {
    if (currentStep === 4) {
        location.reload(); // Den sikreste måde at lave en helt ren "Ny søgning"
    } else {
        changeStep(1);
    }
}
