# 🕹️ Triumph

Et lite nettbasert spill for å øve til prøver, eksamen og presentasjoner.
Du lager egne "temaer" med spørsmål (manuelt, eller via en KI-hjelper), og
øver på dem gjennom tre spillmoduser: Flappy Quiz, Quiz Blackjack og
Flashcards. Tilgjengelig på norsk og engelsk.

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

3. **Spill!** Velg en spillmodus på et tema:
   - **▶ Flappy Quiz** — hver gang du får poeng, dukker det opp et
     spørsmål fra temaet ditt. Svarer du feil, er det game over.
   - **🃏 Quiz Blackjack** — en rask quiz (5 spørsmål) kommer *før* du
     spiller. Antall riktige svar bestemmer hvor mange sjetonger du får
     å spille med i selve blackjack-hånden (Hit / Stand / Double). Går
     du tom for sjetonger underveis, dukker det automatisk opp en ny
     quiz så du kan tjene flere.
   - **🗂️ Flashcards** — bla gjennom spørsmålene som kort. Trykk for å
     snu kortet og se svaret, og merk om du kunne det eller ikke. Kort
     du ikke kunne kan du øve på igjen etterpå.
4. **Bytt språk** når som helst med språkvelgeren øverst på hver side —
   valget lagres og gjelder på alle sidene.

## Publisere til GitHub Pages

```bash
git init
git add .
git commit -m "Første versjon av Triumph"
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
├── index.html          Hjemmeside: temaer, legg til spørsmål, KI-hjelper
├── flappy.html         Flappy Quiz-spillmodus
├── blackjack.html      Quiz Blackjack-spillmodus
├── flashcards.html     Flashcards-spillmodus
├── style.css           Delt styling (inkl. arkade-forside)
├── flappy.css          Styling delt av alle spillmoduser (topbar, overlays)
├── blackjack.css       Styling spesifikk for Blackjack (bord, kort, sjetonger)
├── flashcards.css      Styling spesifikk for Flashcards (kortvending)
└── js/
    ├── i18n.js          Oversettelser (norsk/engelsk) + språkvelger
    ├── storage.js       Lagring av temaer/spørsmål/chips i localStorage
    ├── ai-helper.js     Bygger KI-prompt + tolker JSON-svar
    ├── main.js          Logikk for hjemmesiden
    ├── flappy.js        Spillmotor for Flappy Quiz
    ├── blackjack.js     Spillmotor for Quiz Blackjack
    └── flashcards.js    Spillmotor for Flashcards
```

## Veikart

- [x] Flappy Quiz-modus med spørsmål ved hvert poeng
- [x] Blackjack-modus: quiz avgjør startsjetonger, ny quiz når du går tom
- [x] Flashcards-modus
- [x] Flerspråksstøtte (norsk/engelsk), lett å utvide med flere språk
- [ ] Eventuelt: egen server-funksjon for direkte KI-integrasjon

---
🕹️ Triumph — by skoleelev18
