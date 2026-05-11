# TilbudsRadar DK – version 1

En GitHub Pages-klar demo-app til lokale tilbud.

## Hvad appen kan nu

- Søge efter vare, fx kaffe, mælk, smør, kylling, rugbrød og ost.
- Søge i område, fx Helsingør, Snekkersten, Hillerød og København.
- Vælge radius: 1, 3, 5 eller 7 km.
- Vise de 4 bedste tilbud med pris, afstand, butik og mulig besparelse.
- Sortere efter smart valg, laveste pris, korteste afstand eller største besparelse.
- Gemme favoritter og søgehistorik i browseren.
- Skifte mellem dagmode og natmode.
- Installere som PWA på mobil/desktop, når browseren tillader det.

## Vigtig note om data

Version 1 bruger demo-data i `data/offers.json`, så appen virker direkte på GitHub Pages uden API-nøgler.

For rigtige live-priser skal næste version bruge en lille backend/proxy, så API-nøgler ikke ligger åbent i GitHub Pages.

## Filstruktur

```text
tilbudsradar-dk-v1/
├── index.html
├── manifest.webmanifest
├── service-worker.js
├── css/
│   ├── theme.css
│   ├── layout.css
│   └── components.css
├── js/
│   ├── app.js
│   ├── config.js
│   ├── data.js
│   ├── geo.js
│   ├── search.js
│   ├── storage.js
│   ├── theme.js
│   ├── ui.js
│   ├── pwa.js
│   └── providers/
│       ├── providerNotes.js
│       └── sallingProvider.js
├── data/
│   ├── offers.json
│   ├── stores.json
│   ├── locations.json
│   └── categories.json
└── assets/icons/icon.svg
```

## Sådan lægger du den på GitHub Pages

1. Opret et nyt repository på GitHub, fx `tilbudsradar-dk`.
2. Upload alle filer og mapper fra ZIP-filen.
3. Gå til **Settings → Pages**.
4. Vælg **Deploy from branch**.
5. Vælg branch **main** og folder **root**.
6. Gem.
7. Vent til GitHub viser Pages-linket.

## Næste gode trin

- Tilføj flere butikker i `data/stores.json`.
- Tilføj flere tilbud i `data/offers.json`.
- Lav backend/proxy til rigtige tilbuds-API’er.
- Tilføj kortvisning.
- Tilføj prisalarm.
