// AFSNIT 01 – UI rendering
export function renderOffers(offers) {
  const list = document.querySelector("#resultsList");
  list.innerHTML = "";

  if (!offers.length) {
    list.innerHTML = "";
    return;
  }

  const bestPrice = Math.min(...offers.map(o => Number(o.price || Infinity)));

  for (const offer of offers) {
    const card = document.createElement("article");
    card.className = "offer-card";

    const letter = (offer.storeName || "?").slice(0, 1).toUpperCase();
    const isBest = Number(offer.price) === bestPrice;
    const valid = formatValid(offer);

    card.innerHTML = `
      <div class="offer-top">
        <div class="store-logo">${escapeHtml(letter)}</div>
        <div>
          <p class="offer-title">${escapeHtml(offer.storeName || "Ukendt butik")}</p>
          <div class="offer-meta">${escapeHtml(formatDistance(offer.distanceKm))} · ${escapeHtml(offer.storeAddress || "")}</div>
        </div>
      </div>

      <div class="offer-meta" style="margin-top:14px">${escapeHtml(offer.title || "Tilbud")}</div>
      <div class="price">${formatPrice(offer.price)}</div>
      <div class="unit">${escapeHtml(offer.unitPrice || offer.amount || "")}</div>

      <div class="badges">
        ${isBest ? `<span class="badge best">Bedste pris</span>` : ""}
        ${offer.saving ? `<span class="badge">Spar ${formatPrice(offer.saving)}</span>` : ""}
        ${offer.source ? `<span class="badge">${escapeHtml(offer.source)}</span>` : ""}
        ${offer.sourceQuery ? `<span class="badge">Søgning: ${escapeHtml(offer.sourceQuery)}</span>` : ""}
        ${valid ? `<span class="badge">${escapeHtml(valid)}</span>` : ""}
      </div>

      <div class="offer-actions">
        <button type="button" data-fav="${escapeHtmlAttr(offer.title || "")}">Gem</button>
        ${offer.url ? `<a href="${escapeHtmlAttr(offer.url)}" target="_blank" rel="noopener">Åbn søgning</a>` : ""}
      </div>
    `;

    list.appendChild(card);
  }
}

export function updateStats(offers) {
  const found = offers.length;
  const stores = new Set(offers.map(o => o.storeName)).size;
  const prices = offers.map(o => Number(o.price)).filter(Number.isFinite);
  const savings = offers.map(o => Number(o.saving)).filter(Number.isFinite);

  text("#foundCount", found);
  text("#storeCount", stores);
  text("#bestPrice", prices.length ? formatPrice(Math.min(...prices)) : "–");
  text("#bestSaving", savings.length ? formatPrice(Math.max(...savings)) : "–");
}

export function setStatus(message) {
  text("#statusBox", message);
}

export function updateSourceBox(title, info) {
  text("#sourceTitle", title || "Datakilde");
  text("#sourceInfo", info || "");
}

export function renderChips(selector, items, fallback) {
  const el = document.querySelector(selector);
  if (!el) return;
  if (!items.length) {
    el.className = "chips muted";
    el.textContent = fallback;
    return;
  }

  el.className = "chips";
  el.innerHTML = items.map(item => `<button class="chip" type="button" data-chip="${escapeHtmlAttr(item)}">${escapeHtml(item)}</button>`).join("");
}

function text(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = String(value);
}

function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "–";
  return number.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " kr.";
}

function formatDistance(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "ukendt afstand";
  if (number < 1) return `${Math.round(number * 1000)} m`;
  return `${number.toFixed(1).replace(".", ",")} km`;
}

function formatValid(offer) {
  if (offer.validTo) return `Gyldig til ${offer.validTo}`;
  if (offer.validFrom) return `Fra ${offer.validFrom}`;
  return "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeHtmlAttr(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}
