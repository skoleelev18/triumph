# 🕹️ Triumph

Et lite nettbasert spill for å øve til prøver, eksamen og presentasjoner.
Du lager egne "temaer" med spørsmål (manuelt, eller via en KI-hjelper), og
øver på dem gjennom fire spillmoduser: Flappy Quiz, Quiz Blackjack,
Flashcards og Sant/Usant. Tilgjengelig på norsk og engelsk, med
tastaturstøtte og skjermleser-vennlige spillmoduser.

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

   > **Vet du ikke helt hva du skal øve på?** Bruk 📚 LK20-velgeren
   > over KI-skjemaet: velg trinn (ungdomsskole eller videregående
   > studiespesialiserende), fag og tema fra læreplanen — hentet fra
   > udir.no sine offisielle kjerneelementer — og trykk "Bruk dette
   > temaet" for å fylle inn feltene automatisk.

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
   - **❓ Sant/Usant** — 10 raske runder der du får et spørsmål og ett
     svaralternativ (riktig eller feil), og svarer Sant/Usant.
4. **Tjen mynter** 🪙 for hvert riktige svar i alle modusene, og bruk dem
   i **🎨 Design-butikken** til å låse opp nye fargetemaer for hele
   siden — fra gratis "Standard" til det legendariske toppnivået.
5. **Se fremgangen din** på 📊 Fremgang-siden — hvilke spørsmål du
   fortsatt bommer på, samlet på tvers av alle modusene.
6. **Del et tema** med andre via "🔗 Del" (kopierer en lenke) eller
   "📁 Importer fra fil".
7. **Bytt språk** når som helst med språkvelgeren øverst på hver side —
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
├── truefalse.html      Sant/Usant-spillmodus
├── shop.html           Design-butikk (kjøpbare fargetemaer)
├── progress.html       Fremgang: treffsikkerhet per spørsmål
├── style.css           Delt styling (inkl. arkade-forside og temaer)
├── flappy.css          Styling delt av alle spillmoduser (topbar, overlays)
├── blackjack.css       Styling spesifikk for Blackjack (bord, kort, sjetonger)
├── flashcards.css      Styling spesifikk for Flashcards (kortvending)
├── truefalse.css       Styling spesifikk for Sant/Usant
├── shop.css            Styling spesifikk for design-butikken
├── progress.css        Styling spesifikk for fremgangssiden
└── js/
    ├── i18n.js          Oversettelser (norsk/engelsk) + språkvelger
    ├── storage.js       Lagring av temaer/spørsmål/chips/statistikk
    ├── coins.js         Global myntøkonomi, tjent på tvers av modusene
    ├── theme.js         De 10 kjøpbare fargetemaene + hvilket som er aktivt
    ├── share.js         Koder/dekoder temaer til delbare lenker
    ├── lk20.js          Kjerneelementer fra LK20 (kilde: udir.no), for temavelgeren
    ├── ai-helper.js     Bygger KI-prompt + tolker JSON-svar
    ├── main.js          Logikk for hjemmesiden
    ├── flappy.js        Spillmotor for Flappy Quiz
    ├── blackjack.js     Spillmotor for Quiz Blackjack
    ├── flashcards.js    Spillmotor for Flashcards
    ├── truefalse.js     Spillmotor for Sant/Usant
    ├── shop.js          Logikk for design-butikken
    └── progress.js      Logikk for fremgangssiden
```

## Veikart

- [x] Flappy Quiz-modus med spørsmål ved hvert poeng
- [x] Blackjack-modus: quiz avgjør startsjetonger, ny quiz når du går tom
- [x] Flashcards-modus
- [x] Sant/Usant-modus
- [x] Fremgangsside som sporer riktig/feil per spørsmål på tvers av moduser
- [x] Global myntøkonomi + design-butikk med 10 fargetemaer
- [x] Del tema via lenke eller fil
- [x] Tastaturstøtte og skjermleser-vennlighet (aria-live, ikke bare farge)
- [x] Flerspråksstøtte (norsk/engelsk), lett å utvide med flere språk
- [x] LK20-temavelger (trinn → fag → tema fra ekte kjerneelementer, kilde udir.no)
- [ ] Flere LK20-fag/utdanningslinjer (f.eks. yrkesfag, egne matematikkfag)
- [ ] Eventuelt: egen server-funksjon for direkte KI-integrasjon

---
🕹️ Triumph — by skoleelev18
