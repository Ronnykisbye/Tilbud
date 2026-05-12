# Kvalitetssikring v1.3

## Testet struktur

- `index.html` ligger i roden.
- CSS er opdelt i:
  - `theme.css`
  - `layout.css`
  - `components.css`
- JavaScript er opdelt i:
  - app-logik
  - søgning
  - geografi
  - tema
  - storage
  - UI
  - providers
- Appen kan køre uden backend via demo-data.
- Appen er forberedt til live-data via Cloudflare Worker.

## Manuel test efter upload

1. Åbn appen.
2. Skriv `kaffe`.
3. Skriv `Helsingør`.
4. Vælg `3 km`.
5. Tryk på **Søg**.
6. Der skal vises tilbudskort.
7. Skift til lys tilstand.
8. Tryk på en hurtigvare.
9. Der må ikke søges automatisk.
10. Tryk på **Søg** igen.

## Kendt begrænsning

Cloudflare Worker-parseren for Tilbudsugen er en defensiv HTML-parser. Den skal muligvis justeres, når vi har testet den rigtige response fra Worker i browseren.
