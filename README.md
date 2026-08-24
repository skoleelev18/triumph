# 🎮 PrøveSpill

Et lite nettbasert spill for å øve til prøver, eksamen og presentasjoner.
Du lager egne "temaer" med spørsmål (manuelt, eller via en KI-hjelper), og
øver på dem gjennom Flappy Bird-spillet.

Ren HTML/CSS/JavaScript — ingen byggeverktøy, ingen backend. Alt lagres
lokalt i nettleseren din (`localStorage`).

## Kom i gang

Ingen installasjon nødvendig. Bare åpne `index.html` i en nettleser
(dobbeltklikk på filen, eller høyreklikk → Åpne med → nettleser).

Vil du kjøre den via en lokal webserver i stedet (valgfritt):

```bash
npx http-server .
```

## Slik bruker du det

1. **Lag et tema** på hjemmesiden (f.eks. «Andre verdenskrig», «Fotosyntese»).
2. **Legg til spørsmål**:
   - Manuelt via skjemaet, eller
   - Med KI-hjelperen: fyll inn emne/antall/vanskelighetsgrad → trykk
     «Lag prompt» → kopier prompten inn i ChatGPT, Claude, Gemini eller
     tilsvarende → lim KI-ens svar tilbake inn i importfeltet → «Importer
     spørsmål».

   > Spillet er ikke koblet direkte til en KI via API. En statisk side
   > (som GitHub Pages) kan ikke skjule en API-nøkkel trygt, så i stedet
   > bygger appen en ferdig prompt du limer inn i en KI-chat selv.
   > Vil du automatisere dette helt, må du sette opp en liten
   > server-funksjon (f.eks. Cloudflare Worker eller Vercel-funksjon) som
   > holder API-nøkkelen skjult og kaller KI-en for deg — det er neste
   > steg om du ønsker det.

3. **Spill!** Trykk «▶ Spill Flappy Quiz» på et tema. Hver gang du får
   poeng i Flappy Bird, dukker det opp et spørsmål fra temaet ditt.
   Svarer du feil, er det game over.

## Publisere til GitHub Pages

```bash
git init
git add .
git commit -m "Første versjon av PrøveSpill"
git branch -M main
git remote add origin https://github.com/<brukernavn>/<repo>.git
git push -u origin main
```

Deretter: gå til repoet på GitHub → **Settings → Pages** → under
"Build and deployment", velg **Deploy from a branch** → velg `main` og
mappen `/ (root)` → Save. Siden blir tilgjengelig på
`https://<brukernavn>.github.io/<repo>/` etter et par minutter.

## Prosjektstruktur

```
quizspill/
├── index.html        Hjemmeside: temaer, legg til spørsmål, KI-hjelper
├── flappy.html        Flappy Bird-spillmodus
├── style.css           Delt styling
├── flappy.css          Styling spesifikk for spillet
└── js/
    ├── storage.js       Lagring av temaer/spørsmål i localStorage
    ├── ai-helper.js     Bygger KI-prompt + tolker JSON-svar
    ├── main.js          Logikk for hjemmesiden
    └── flappy.js        Spillmotor for Flappy Bird
```

## Veikart

- [x] Flappy Bird-modus med spørsmål ved hvert poeng
- [ ] Blackjack-modus: tap gir 3–5 spørsmål, vinn gir 1–3 spørsmål,
      riktige svar gir virtuelle penger til neste hånd
- [ ] Eventuelt: egen server-funksjon for direkte KI-integrasjon
