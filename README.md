# TilbudsRadar DK v1.3

GitHub Pages-klar app til at finde lokale tilbud efter vare, område og radius.

## Hvad er nyt i v1.3?

- Provider-system til rigtige datakilder
- Cloudflare Worker-skabelon til Tilbudsugen
- Appen prøver live-data, hvis `API_PROXY_URL` er sat
- Appen falder automatisk tilbage til demo-data
- Søgning sker kun, når man trykker på **Søg**
- Dag/nat-mode
- Favoritter og historik
- PWA-installation

## Upload til GitHub Pages

1. Slet gamle app-filer i repoet, så apps ikke blandes.
2. Upload alle filer fra denne ZIP.
3. Sørg for at `index.html` ligger direkte i roden.
4. Vent på GitHub Pages.
5. Test med:
   - Vare: `kaffe`
   - Område: `Helsingør`
   - Radius: `3 km`

## Rigtige data

Frontend kan ikke hente tilbudsaviser sikkert direkte fra mange hjemmesider. Derfor ligger der en Worker i:

```text
worker/cloudflare-worker.js
```

Når workeren er oprettet, indsætter du URL'en i:

```text
js/config.js
```

Eksempel:

```js
API_PROXY_URL: "https://tilbudsradar-proxy.ditnavn.workers.dev"
```

## Vigtigt

Tilbudsugen-parseren er første tekniske forsøg. Hvis Tilbudsugen ændrer HTML, skal parseren justeres. Den professionelle løsning er senere at få adgang til officielle API'er som Tilbudsdata.dk eller Salling Group API.
