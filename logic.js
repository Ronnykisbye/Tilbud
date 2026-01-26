let currentStep = 1;
let currentLang = localStorage.getItem('appLang') || 'da';
let selectedStoreIds = new Set();

function initApp() {
    document.body.classList.toggle('light-mode', localStorage.getItem('theme') === 'light');
    document.getElementById('lang-select').value = currentLang;
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
    if (currentStep === 4) renderResults();
}

function handleNextAction() {
    if (currentStep === 4) location.reload();
    else changeStep(1);
}

// Kald init når siden indlæses
window.onload = initApp;
