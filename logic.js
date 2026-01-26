let currentStep = 1;
let currentLang = localStorage.getItem('appLang') || 'da';
let selectedStoreIds = new Set();
let currentCountry = 'DK';

function initApp() {
    // Sætter tema fra hukommelse
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }
    // Sætter sprogvalg i dropdown
    const langSelect = document.getElementById('lang-select');
    if (langSelect) langSelect.value = currentLang;
    updateUI();
}

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('appLang', lang);
    updateUI();
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

function updateUI() {
    const t = i18n[currentLang];
    document.getElementById('title').innerText = t.titles[currentStep - 1];
    document.getElementById('next-btn').innerText = (currentStep === 4) ? t.reset : t.next;
    const hint = document.getElementById('hint-text');
    if (hint) hint.innerText = t.hint;
}

function changeStep(dir) {
    const next = currentStep + dir;
    if (next < 1 || next > 4) return;
    
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${next}`).classList.add('active');
    
    currentStep = next;
    document.getElementById('step-num').innerText = currentStep;
    document.getElementById('back-btn').style.display = (currentStep > 1) ? 'flex' : 'none';
    
    updateUI();
    if (currentStep === 3) renderStores();
    if (currentStep === 4) renderFinalResults();
}

function handleNextAction() {
    if (currentStep === 4) location.reload();
    else changeStep(1);
}

// Kald init når siden indlæses
window.onload = initApp;
