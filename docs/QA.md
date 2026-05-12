# QA – TilbudsRadar DK v1.1

## Rettelser i denne version
- De 4 hero-knapper/badges er fjernet, fordi de ikke havde funktion.
- Appen laver ikke længere automatisk søgning ved opstart.
- Hurtigvarer, favoritter og historik udfylder nu kun søgefeltet.
- Appen søger først, når brugeren trykker på knappen **Søg**.
- GPS-knappen vælger kun positionen og starter ikke søgning automatisk.
- Sortering virker først efter en gennemført søgning.

## Manuel test
1. Åbn `index.html` via lokal server eller GitHub Pages.
2. Kontroller at de 4 hero-knapper ikke vises.
3. Kontroller at resultatfeltet er tomt ved start.
4. Skriv fx `kaffe` og `Helsingør`, vælg radius og tryk **Søg**.
5. Kontroller at resultater, metrics, historik og favoritter opdateres.
6. Klik på en hurtigvare og kontroller, at den ikke søger automatisk.
7. Klik på en historik-chip og kontroller, at den ikke søger automatisk.
8. Skift dag/nat-mode og kontroller kontrast.

## Kendt begrænsning
Version 1.1 bruger stadig demo-data. Rigtige priser kræver senere API/backend.


## QA – Version 1.2 søgefix

Testet med følgende søgninger i Helsingør:

- `Gevalia hele bønner` giver resultater.
- `gevalia` giver resultater.
- `hele bønner` giver kafferesultater.
- `kaffe`, `mælk`, `smør`, `kylling`, `cola`, `æg` og `pasta` giver resultater i demo-data.
- `3000` finder Helsingør som område.
- Appen søger stadig først, når brugeren trykker på knappen Søg.
