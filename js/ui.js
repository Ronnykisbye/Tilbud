// AFSNIT 01 – Formatering
export function formatPrice(value) {
  return new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK" }).format(Number(value || 0));
}

export function formatDistance(value) {
  return `${Number(value).toFixed(value < 1 ? 2 : 1).replace(".", ",")} km`;
}

// AFSNIT 02 – Resultatkort
export function renderOffers({ offers, container, template, favorites, onToggleFavorite }) {
  container.innerHTML = "";
  offers.forEach((offer, index) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector(".store-logo").textContent = initials(offer.store.chain);
    node.querySelector("h3").textContent = offer.store.name;
    node.querySelector(".store-meta").textContent = `${formatDistance(offer.distance)} · ${offer.store.address}`;
    node.querySelector(".offer-product").textContent = offer.product;
    node.querySelector(".price").textContent = formatPrice(offer.price);
    node.querySelector(".unit-price").textContent = offer.unit || "";
    node.querySelector(".valid-to").textContent = `Gyldig til ${formatDate(offer.validTo)}`;

    const tags = node.querySelector(".offer-tags");
    if (index === 0) tags.appendChild(createTag("Bedste valg", "best"));
    if (offer.saving > 0) tags.appendChild(createTag(`Spar ${formatPrice(offer.saving)}`));
    if (offer.distance <= 1) tags.appendChild(createTag("Tæt på"));
    tags.appendChild(createTag(offer.store.chain));

    const favBtn = node.querySelector(".favorite-btn");
    const isSaved = favorites.includes(offer.product);
    favBtn.textContent = isSaved ? "Gemt" : "Gem";
    favBtn.classList.toggle("saved", isSaved);
    favBtn.addEventListener("click", () => onToggleFavorite(offer.product));

    container.appendChild(node);
  });
}

function createTag(text, extraClass = "") {
  const tag = document.createElement("span");
  tag.className = `tag ${extraClass}`.trim();
  tag.textContent = text;
  return tag;
}

function initials(text) {
  return String(text || "?")
    .split(/\s+/)
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date) {
  if (!date) return "ukendt";
  return new Intl.DateTimeFormat("da-DK", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

// AFSNIT 03 – Chips og status
export function renderChips(container, values, onClick) {
  container.innerHTML = "";
  container.classList.toggle("empty", values.length === 0);
  if (!values.length) {
    container.textContent = container.id === "favoritesList" ? "Ingen favoritter endnu." : "Ingen søgninger endnu.";
    return;
  }
  values.forEach(value => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = value;
    button.addEventListener("click", () => onClick(value));
    container.appendChild(button);
  });
}

export function updateMetrics({ offers, metricOffers, metricStores, metricBest, metricSaved }) {
  const stores = new Set(offers.map(offer => offer.storeId));
  const best = offers.length ? Math.min(...offers.map(offer => offer.price)) : null;
  const saved = offers.length ? Math.max(...offers.map(offer => offer.saving)) : null;
  metricOffers.textContent = offers.length;
  metricStores.textContent = stores.size;
  metricBest.textContent = best === null ? "–" : formatPrice(best);
  metricSaved.textContent = saved === null ? "–" : formatPrice(saved);
}
