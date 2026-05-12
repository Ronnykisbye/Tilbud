// AFSNIT 01 – Imports
import { CONFIG } from "./config.js";
import { initTheme } from "./theme.js";
import { initPwa } from "./pwa.js";
import { resolveLocation, useBrowserGps } from "./geo.js";
import { getOffersFromBestSource } from "./providers/providerManager.js";
import { enrichOffers, filterBySearch, sortOffers } from "./search.js";
import { getFavorites, saveFavorite, getHistory, saveHistory } from "./storage.js";
import { renderOffers, updateStats, setStatus, renderChips, updateSourceBox } from "./ui.js";

// AFSNIT 02 – App-state
const state = {
  origin: null,
  allOffers: [],
  filteredOffers: [],
  stores: [],
  lastSearch: null
};

// AFSNIT 03 – Start
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initPwa();
  bindEvents();
  renderSidebars();

  document.querySelector("#locationInput").value = CONFIG.defaultLocation;
  document.querySelector("#productInput").value = CONFIG.defaultProduct;
  setStatus("Indtast vare og område, og tryk på Søg.");
});

// AFSNIT 04 – Events
function bindEvents() {
  document.querySelector("#searchForm")?.addEventListener("submit", event => {
    event.preventDefault();
    runSearch();
  });

  document.querySelector("#sortSelect")?.addEventListener("change", () => {
    applyFilterAndRender();
  });

  document.querySelector("#gpsBtn")?.addEventListener("click", async () => {
    try {
      setStatus("Henter GPS-position …");
      state.origin = await useBrowserGps();
      document.querySelector("#locationInput").value = "Min GPS-position";
      setStatus("GPS-position er valgt. Tryk på Søg for at finde tilbud.");
    } catch (error) {
      setStatus(error.message);
    }
  });

  document.querySelectorAll("[data-quick]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector("#productInput").value = btn.dataset.quick || "";
      setStatus("Varen er valgt. Tryk på Søg for at finde tilbud.");
    });
  });

  document.body.addEventListener("click", event => {
    const fav = event.target.closest("[data-fav]");
    if (fav) {
      saveFavorite(fav.dataset.fav || "");
      renderSidebars();
      setStatus("Varen er gemt som favorit.");
    }

    const chip = event.target.closest("[data-chip]");
    if (chip) {
      const value = chip.dataset.chip || "";
      const product = value.split("·")[0].trim();
      document.querySelector("#productInput").value = product;
      setStatus("Varen er valgt fra historik/favorit. Tryk på Søg.");
    }
  });
}

// AFSNIT 05 – Søgning
async function runSearch() {
  const product = document.querySelector("#productInput").value.trim();
  const locationText = document.querySelector("#locationInput").value.trim() || CONFIG.defaultLocation;
  const radiusKm = Number(document.querySelector("input[name='radius']:checked")?.value || CONFIG.defaultRadiusKm);

  if (!product) {
    setStatus("Skriv først hvilken vare du leder efter.");
    return;
  }

  setStatus("Søger efter tilbud …");

  try {
    const origin = state.origin?.name === "Min GPS-position"
      ? state.origin
      : await resolveLocation(locationText);

    state.origin = origin;
    state.lastSearch = { product, location: locationText, radiusKm };
    saveHistory(product, locationText);
    renderSidebars();

    const providerData = await getOffersFromBestSource({ product, location: locationText, radiusKm });
    state.stores = providerData.stores || [];
    state.allOffers = enrichOffers(providerData.offers || [], state.stores, origin);

    updateSourceBox(providerData.source, providerData.sourceInfo);
    applyFilterAndRender();

  } catch (error) {
    console.error(error);
    setStatus("Der opstod en fejl: " + error.message);
    renderOffers([]);
    updateStats([]);
  }
}

// AFSNIT 06 – Filtrering/rendering
function applyFilterAndRender() {
  if (!state.lastSearch) return;

  const sortMode = document.querySelector("#sortSelect").value;
  let offers = filterBySearch(state.allOffers, state.lastSearch);

  // Hvis radius er for snæver, udvides kun én gang til 7 km.
  if (!offers.length && state.lastSearch.radiusKm < 7) {
    offers = filterBySearch(state.allOffers, { ...state.lastSearch, radiusKm: 7 });
    if (offers.length) {
      setStatus(`Ingen fund i ${state.lastSearch.radiusKm} km. Viser i stedet resultater indenfor 7 km.`);
    }
  } else {
    setStatus(offers.length
      ? `Fundet ${offers.length} relevante tilbud. Viser de ${Math.min(CONFIG.maxResults, offers.length)} bedste.`
      : "Ingen tilbud fundet. Prøv et bredere søgeord eller større radius.");
  }

  state.filteredOffers = sortOffers(offers, sortMode).slice(0, CONFIG.maxResults);
  renderOffers(state.filteredOffers);
  updateStats(state.filteredOffers);
}

// AFSNIT 07 – Sidepaneler
function renderSidebars() {
  renderChips("#favoritesList", getFavorites(), "Ingen favoritter endnu.");
  renderChips("#historyList", getHistory(), "Ingen søgninger endnu.");
}
