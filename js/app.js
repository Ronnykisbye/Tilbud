// AFSNIT 01 – Imports
import { APP_CONFIG } from "./config.js";
import { loadAppData } from "./data.js";
import { findLocation } from "./geo.js";
import { findOffers } from "./search.js";
import { initTheme } from "./theme.js";
import { readStorage, writeStorage } from "./storage.js";
import { initPwaInstall } from "./pwa.js";
import { renderOffers, renderChips, updateMetrics } from "./ui.js";

// AFSNIT 02 – App-state
const state = {
  data: null,
  lastSearch: null,
  currentOffers: [],
  favorites: readStorage(APP_CONFIG.storageKeys.favorites, []),
  history: readStorage(APP_CONFIG.storageKeys.history, [])
};

// AFSNIT 03 – DOM-referencer
const dom = {
  form: document.querySelector("#searchForm"),
  productInput: document.querySelector("#productInput"),
  locationInput: document.querySelector("#locationInput"),
  locationSuggestions: document.querySelector("#locationSuggestions"),
  sortSelect: document.querySelector("#sortSelect"),
  gpsBtn: document.querySelector("#gpsBtn"),
  messageBox: document.querySelector("#messageBox"),
  resultsGrid: document.querySelector("#resultsGrid"),
  template: document.querySelector("#offerTemplate"),
  favoritesList: document.querySelector("#favoritesList"),
  historyList: document.querySelector("#historyList"),
  metricOffers: document.querySelector("#metricOffers"),
  metricStores: document.querySelector("#metricStores"),
  metricBest: document.querySelector("#metricBest"),
  metricSaved: document.querySelector("#metricSaved"),
  themeToggle: document.querySelector("#themeToggle"),
  installBtn: document.querySelector("#installBtn")
};

// AFSNIT 04 – Start app
initTheme(dom.themeToggle);
initPwaInstall(dom.installBtn);
boot();

async function boot() {
  try {
    state.data = await loadAppData();
    fillLocationSuggestions();
    bindEvents();
    renderSavedLists();
    updateMetrics({ offers: [], ...dom });
    runSearch(APP_CONFIG.defaultLocation, "kaffe", APP_CONFIG.defaultRadiusKm);
  } catch (error) {
    console.error(error);
    showMessage("Appen kunne ikke indlæse data. Tjek at alle filer ligger korrekt på GitHub Pages.");
  }
}

// AFSNIT 05 – Events
function bindEvents() {
  dom.form.addEventListener("submit", event => {
    event.preventDefault();
    const product = dom.productInput.value.trim();
    const location = dom.locationInput.value.trim();
    const radius = getSelectedRadius();
    runSearch(location, product, radius);
  });

  dom.sortSelect.addEventListener("change", () => {
    if (!state.lastSearch) return;
    runSearch(state.lastSearch.locationName, state.lastSearch.product, state.lastSearch.radiusKm, false);
  });

  document.querySelectorAll(".quick-products button").forEach(button => {
    button.addEventListener("click", () => {
      dom.productInput.value = button.dataset.product;
      runSearch(dom.locationInput.value, button.dataset.product, getSelectedRadius());
    });
  });

  dom.gpsBtn.addEventListener("click", useGpsLocation);
}

// AFSNIT 06 – Søgning
function runSearch(locationName, product, radiusKm, saveHistory = true) {
  const location = findLocation(locationName, state.data.locations);
  if (!location) {
    showMessage(`Jeg kan ikke finde området "${locationName}" i demo-listen endnu. Prøv fx Helsingør, Hillerød eller København.`);
    return;
  }

  dom.locationInput.value = location.name;
  const offers = findOffers({
    product,
    location,
    radiusKm: Number(radiusKm),
    offers: state.data.offers,
    stores: state.data.stores,
    sortMode: dom.sortSelect.value
  });

  state.currentOffers = offers;
  state.lastSearch = { locationName: location.name, product, radiusKm: Number(radiusKm) };

  if (saveHistory) addHistory(product);
  drawResults(offers);
}

function drawResults(offers) {
  const visible = offers.slice(0, APP_CONFIG.maxVisibleOffers);
  renderOffers({
    offers: visible,
    container: dom.resultsGrid,
    template: dom.template,
    favorites: state.favorites,
    onToggleFavorite: toggleFavorite
  });

  updateMetrics({ offers, ...dom });

  if (!offers.length) {
    showMessage("Ingen tilbud fundet i den valgte radius. Prøv større radius eller en anden vare.");
    return;
  }

  showMessage(`Fundet ${offers.length} relevante tilbud. Viser de ${visible.length} bedste.`);
}

// AFSNIT 07 – Favoritter og historik
function toggleFavorite(product) {
  const exists = state.favorites.includes(product);
  state.favorites = exists
    ? state.favorites.filter(item => item !== product)
    : [product, ...state.favorites].slice(0, 12);
  writeStorage(APP_CONFIG.storageKeys.favorites, state.favorites);
  renderSavedLists();
  drawResults(state.currentOffers);
}

function addHistory(product) {
  const clean = product.trim();
  if (!clean) return;
  state.history = [clean, ...state.history.filter(item => item.toLowerCase() !== clean.toLowerCase())].slice(0, 10);
  writeStorage(APP_CONFIG.storageKeys.history, state.history);
  renderSavedLists();
}

function renderSavedLists() {
  renderChips(dom.favoritesList, state.favorites, value => {
    dom.productInput.value = value;
    runSearch(dom.locationInput.value, value, getSelectedRadius());
  });
  renderChips(dom.historyList, state.history, value => {
    dom.productInput.value = value;
    runSearch(dom.locationInput.value, value, getSelectedRadius(), false);
  });
}

// AFSNIT 08 – GPS og radius
function getSelectedRadius() {
  return Number(new FormData(dom.form).get("radius") || APP_CONFIG.defaultRadiusKm);
}

function useGpsLocation() {
  if (!navigator.geolocation) {
    showMessage("Din browser understøtter ikke GPS-position.");
    return;
  }

  showMessage("Finder din position …");
  navigator.geolocation.getCurrentPosition(
    position => {
      const current = { name: "Min GPS-position", lat: position.coords.latitude, lng: position.coords.longitude };
      state.data.locations = [current, ...state.data.locations.filter(location => location.name !== current.name)];
      dom.locationInput.value = current.name;
      fillLocationSuggestions();
      runSearch(current.name, dom.productInput.value || "kaffe", getSelectedRadius());
    },
    () => showMessage("GPS blev ikke tilladt. Du kan stadig skrive by eller område manuelt."),
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
  );
}

// AFSNIT 09 – Hjælpere
function fillLocationSuggestions() {
  dom.locationSuggestions.innerHTML = "";
  state.data.locations.forEach(location => {
    const option = document.createElement("option");
    option.value = location.name;
    dom.locationSuggestions.appendChild(option);
  });
}

function showMessage(text) {
  dom.messageBox.textContent = text;
}
