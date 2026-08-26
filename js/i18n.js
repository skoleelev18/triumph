// Enkelt oversettelsessystem. Legg til flere språk ved å utvide TRANSLATIONS
// og legge språkkoden til i availableLocales().

window.I18n = (function () {
  const LOCALE_KEY = "quizspill_locale";

  const TRANSLATIONS = {
    nb: {
      appTagline: "Øv til prøver, eksamen og presentasjoner — gjennom spill.",
      langLabel: "Språk",

      decksHeading: "Dine temaer",
      newDeckPlaceholder: "Navn på nytt tema (f.eks. «Andre verdenskrig»)",
      newDeckBtn: "+ Nytt tema",
      noDecksYet: "Ingen temaer ennå. Lag ditt første tema under.",
      deckOptionCreateFirst: "Opprett et tema først",
      deckOptionLabel: "{name} ({count} spørsmål)",
      deckMeta: "{count} spørsmål · Rekord: {score} poeng",
      playFlappy: "▶ Flappy Quiz",
      playBlackjack: "🃏 Quiz Blackjack",
      playFlashcards: "🗂️ Flashcards",
      playProgress: "📊 Fremgang",
      addQuestionsFirstFlappy: "▶ Legg til spørsmål først",
      addQuestionsFirstBlackjack: "🃏 Legg til spørsmål først",
      addQuestionsFirstFlashcards: "🗂️ Legg til spørsmål først",
      addQuestionsFirstProgress: "📊 Legg til spørsmål først",
      showQuestions: "Se spørsmål",
      hideQuestions: "Skjul spørsmål",
      exportBtn: "Eksporter",
      shareBtn: "🔗 Del",
      shareLinkCopied: "✅ Delelenke kopiert!",
      shareLinkTooLong: "Temaet er ganske stort, så lenken ble lang — fungerer fortsatt, men «Eksporter» til fil kan være enklere å dele.",
      shareLinkFallbackPrompt: "Kopier lenken under manuelt:",
      importFromFileBtn: "📁 Importer fra fil",
      importConfirm: "Vil du importere temaet «{name}» med {count} spørsmål?",
      importSuccess: "✅ Importerte temaet «{name}»!",
      importFileError: "Klarte ikke å lese filen. Sjekk at det er en gyldig eksportert fil.",
      importLinkError: "Klarte ikke å lese temaet fra lenken.",

      shopHeading: "🎨 Design-butikk",
      shopHint: "Tjen mynter ved å svare riktig i spillmodusene, og lås opp nye design til hele siden!",
      shopFree: "Gratis",
      shopInUse: "✅ I bruk",
      shopUseBtn: "Bruk",
      shopTooExpensive: "For dyrt",
      shopBuyBtn: "Kjøp",
      playShop: "🎨 Design-butikk",

      lk20Heading: "📚 Vet du ikke helt hva du skal øve på?",
      lk20Hint: "Velg trinn, fag og tema fra læreplanen (LK20) — hentet fra udir.no — så fyller vi inn feltene under for deg.",
      lk20LevelLabel: "Trinn",
      lk20SubjectLabel: "Fag",
      lk20TopicLabel: "Tema fra læreplanen",
      lk20UseBtn: "⬆️ Bruk dette temaet",

      playTrueFalse: "❓ Sant/Usant",
      addQuestionsFirstTrueFalse: "❓ Legg til spørsmål først",
      tfQuestionLabel: "Spørsmål",
      tfStatementLabel: "Er dette svaret riktig?",
      tfTrueBtn: "✅ Sant",
      tfFalseBtn: "❌ Usant",
      tfCorrect: "✅ Riktig!",
      tfWrong: "❌ Feil! Det riktige svaret var {answer}",
      tfProgress: "Runde {index} av {count}",
      tfSummaryTitle: "Ferdig!",
      tfSummaryText: "Du fikk {correct} av {total} riktige og tjente {coins} mynter!",
      deleteDeckBtn: "Slett tema",
      confirmDeleteDeck: "Slette temaet «{name}» og alle spørsmålene i det?",
      noQuestionsInDeck: "Ingen spørsmål i dette temaet ennå.",
      questionListItem: "{question} — Riktig: {answer}",
      deleteBtn: "Slett",

      manualHeading: "Legg til spørsmål manuelt",
      manualDeckLabel: "Tema",
      manualQuestionLabel: "Spørsmål",
      manualQuestionPlaceholder: "F.eks. «Når startet andre verdenskrig?»",
      optionALabel: "Svaralternativ A",
      optionBLabel: "Svaralternativ B",
      optionCLabel: "Svaralternativ C",
      optionDLabel: "Svaralternativ D",
      correctAnswerLegend: "Riktig svar",
      addQuestionBtn: "+ Legg til spørsmål",

      aiHeading: "🤖 Generer spørsmål med KI",
      aiHint:
        "Ingen KI er koblet direkte på spillet ennå (det krever en egen server for å skjule en API-nøkkel trygt). I stedet lager vi en ferdig prompt du limer inn i f.eks. ChatGPT, Claude eller Gemini — og limer svaret rett tilbake inn her.",
      aiTopicLabel: "Tema / emne",
      aiTopicPlaceholder: "F.eks. «Fotosyntese»",
      aiCountLabel: "Antall spørsmål",
      aiLevelLabel: "Vanskelighetsgrad",
      aiLevelEasy: "Lett",
      aiLevelMedium: "Middels",
      aiLevelHard: "Vanskelig",
      aiContextLabel: "Ekstra kontekst (valgfritt)",
      aiContextPlaceholder: "F.eks. pensumtekst, kapittelnummer, stikkord...",
      aiMakePromptBtn: "Lag prompt",
      aiPromptOutputLabel: "Ferdig prompt (kopier og lim inn hos KI-en din)",
      aiCopyBtn: "📋 Kopier prompt",
      aiCopiedBtn: "✅ Kopiert!",
      aiResponseLabel: "Lim inn KI-svaret (JSON) her",
      aiResponsePlaceholder: "Lim inn hele svaret fra KI-en her...",
      aiImportDeckLabel: "Legg spørsmålene til i tema",
      aiImportBtn: "⬇️ Importer spørsmål",
      aiImportNoDeck: "Velg eller opprett et tema først.",
      aiImportNoValid: "Fant ingen gyldige spørsmål i svaret. Sjekk formatet og prøv igjen.",
      aiImportSuccess: "✅ La til {count} spørsmål!",

      footerNote: "Laget for egen læring. Data lagres kun lokalt i din nettleser.",

      backLink: "← Tilbake",
      pointsLabel: "Poeng",
      recordLabel: "Rekord",
      emptyDeckTitle: "Fant ikke temaet",
      emptyDeckText: "Velg et tema med minst ett spørsmål på hjemmesiden.",
      toHomepage: "Til hjemmesiden",

      flappyTitle: "🐦 Flappy Quiz",
      flappyIntro: "Trykk mellomrom, W eller klikk for å flakse.",
      flappyIntro2: "Hver gang du får poeng, dukker det opp et spørsmål. Svar riktig for å fortsette!",
      startGameBtn: "Start spillet",
      gameOverTitle: "Game over!",
      playAgainBtn: "Spill igjen",
      backToDecks: "Tilbake til temaer",
      answerCorrectContinuing: "✅ Riktig! Fortsetter...",
      answerWrongWithAnswer: "❌ Feil! Riktig svar: {answer}",
      newRecordSummary: "Du fikk {score} poeng — ny rekord! 🎉",
      scoreSummary: "Du fikk {score} poeng. Rekord: {record}.",

      dealerLabel: "Dealer",
      playerLabel: "Deg",
      chooseBet: "Velg innsats",
      dealBtn: "Del ut kort",
      hitBtn: "Hit",
      doubleBtn: "Double",
      standBtn: "Stand",
      continueBtn: "Fortsett",
      betLabel: "Innsats: {bet} chips",
      allInLabel: "Alt",
      outcomeBlackjack: "🂡 Blackjack! Du vinner {profit} chips.",
      outcomeWin: "🎉 Du vant! +{profit} chips.",
      outcomePush: "🤝 Uavgjort. Du får innsatsen tilbake.",
      outcomeBust: "💥 Bust! Du tapte {bet} chips.",
      outcomeLose: "😬 Du tapte {bet} chips.",
      quizProgress: "Tjen sjetonger — spørsmål {index} av {count}",
      quizDone: "Du fikk {correct}/{count} riktige — {chips} sjetonger å spille med!",
      answerCorrectChips: "✅ Riktig! +{reward} chips",
      answerWrongTryAgain: "❌ Feil! Prøv igjen om litt.",

      aiPromptText:
        'Lag {count} spørsmål med flervalgssvar om temaet "{topic}", ment som øving til en prøve/eksamen/presentasjon på {level}.\n{contextLine}Krav:\n- Hvert spørsmål skal ha nøyaktig 4 svaralternativer.\n- Bare ett alternativ skal være riktig.\n- Spørsmålene skal være korte nok til å leses raskt midt i et spill.\n- Svar på {languageName}.\n- Svar KUN med gyldig JSON, ingen forklaringstekst før eller etter, i nøyaktig dette formatet:\n\n[\n  {\n    "question": "Spørsmålstekst her?",\n    "options": ["Alternativ A", "Alternativ B", "Alternativ C", "Alternativ D"],\n    "correctIndex": 0\n  }\n]\n\n"correctIndex" er indeksen (0-3) i "options"-listen som er riktig svar.',
      aiPromptLevelEasy: "enkelt/grunnleggende nivå",
      aiPromptLevelMedium: "middels vanskelighetsgrad",
      aiPromptLevelHard: "avansert/vanskelig nivå",
      aiPromptContextLine: "Ekstra kontekst / pensum å ta hensyn til: {context}\n",
      aiPromptFillFirst: "Lim inn KI-svaret først.",
      aiPromptParseError:
        "Klarte ikke å tolke svaret som JSON. Sjekk at du limte inn hele svaret fra KI-en.",
      aiPromptExpectedArray: "Forventet en liste med spørsmål (JSON-array).",
      languageName: "norsk",

      fcProgress: "Kort {index} av {count}",
      fcQuestionLabel: "Spørsmål",
      fcAnswerLabel: "Svar",
      fcTapToFlip: "Trykk for å snu kortet",
      fcShowAnswerBtn: "Vis svar",
      fcDidNotKnowBtn: "😕 Kunne ikke",
      fcKnewItBtn: "😄 Visste det",
      fcSummaryTitle: "Ferdig!",
      fcSummaryText: "Du visste {known} av {total} kort.",
      fcRetryUnknownBtn: "🔁 Øv på de du ikke kunne",
      fcRestartBtn: "🔄 Start på nytt",

      nextQuestionBtn: "Neste spørsmål ➜",
      progressSummary: "{accuracy}% riktig totalt · {attempted} av {total} spørsmål øvd på",
      progressNoData: "Du har ikke øvd på noen spørsmål i dette temaet ennå. Spill en runde i en av modusene for å se fremgangen din her!",
      progressRowStats: "{correct} riktige · {wrong} feil",
      notAttemptedHeading: "Ikke øvd ennå",
      resetStatsBtn: "🔄 Nullstill statistikk",
      confirmResetStats: "Nullstille all statistikk for temaet «{name}»?",
    },

    en: {
      appTagline: "Practice for tests, exams and presentations — through games.",
      langLabel: "Language",

      decksHeading: "Your topics",
      newDeckPlaceholder: "Name of new topic (e.g. «World War II»)",
      newDeckBtn: "+ New topic",
      noDecksYet: "No topics yet. Create your first topic below.",
      deckOptionCreateFirst: "Create a topic first",
      deckOptionLabel: "{name} ({count} questions)",
      deckMeta: "{count} questions · High score: {score} points",
      playFlappy: "▶ Flappy Quiz",
      playBlackjack: "🃏 Quiz Blackjack",
      playFlashcards: "🗂️ Flashcards",
      playProgress: "📊 Progress",
      addQuestionsFirstFlappy: "▶ Add questions first",
      addQuestionsFirstBlackjack: "🃏 Add questions first",
      addQuestionsFirstFlashcards: "🗂️ Add questions first",
      addQuestionsFirstProgress: "📊 Add questions first",
      showQuestions: "Show questions",
      hideQuestions: "Hide questions",
      exportBtn: "Export",
      shareBtn: "🔗 Share",
      shareLinkCopied: "✅ Share link copied!",
      shareLinkTooLong: "This topic is fairly large, so the link got long — it still works, but exporting to a file may be easier to share.",
      shareLinkFallbackPrompt: "Copy the link below manually:",
      importFromFileBtn: "📁 Import from file",
      importConfirm: "Import the topic «{name}» with {count} questions?",
      importSuccess: "✅ Imported the topic «{name}»!",
      importFileError: "Could not read the file. Check that it's a valid exported file.",
      importLinkError: "Could not read the topic from the link.",

      shopHeading: "🎨 Design Shop",
      shopHint: "Earn coins by answering correctly in the game modes, and unlock new looks for the whole site!",
      shopFree: "Free",
      shopInUse: "✅ In use",
      shopUseBtn: "Use",
      shopTooExpensive: "Too expensive",
      shopBuyBtn: "Buy",
      playShop: "🎨 Design Shop",

      lk20Heading: "📚 Not sure what to study?",
      lk20Hint: "Pick a grade level, subject and topic from the Norwegian curriculum (LK20) — sourced from udir.no — and we'll fill in the fields below for you.",
      lk20LevelLabel: "Grade level",
      lk20SubjectLabel: "Subject",
      lk20TopicLabel: "Curriculum topic",
      lk20UseBtn: "⬆️ Use this topic",

      playTrueFalse: "❓ True/False",
      addQuestionsFirstTrueFalse: "❓ Add questions first",
      tfQuestionLabel: "Question",
      tfStatementLabel: "Is this answer correct?",
      tfTrueBtn: "✅ True",
      tfFalseBtn: "❌ False",
      tfCorrect: "✅ Correct!",
      tfWrong: "❌ Wrong! The correct answer was {answer}",
      tfProgress: "Round {index} of {count}",
      tfSummaryTitle: "Done!",
      tfSummaryText: "You got {correct} of {total} correct and earned {coins} coins!",
      deleteDeckBtn: "Delete topic",
      confirmDeleteDeck: "Delete the topic «{name}» and all its questions?",
      noQuestionsInDeck: "No questions in this topic yet.",
      questionListItem: "{question} — Correct: {answer}",
      deleteBtn: "Delete",

      manualHeading: "Add a question manually",
      manualDeckLabel: "Topic",
      manualQuestionLabel: "Question",
      manualQuestionPlaceholder: "E.g. «When did World War II start?»",
      optionALabel: "Answer A",
      optionBLabel: "Answer B",
      optionCLabel: "Answer C",
      optionDLabel: "Answer D",
      correctAnswerLegend: "Correct answer",
      addQuestionBtn: "+ Add question",

      aiHeading: "🤖 Generate questions with AI",
      aiHint:
        "No AI is connected directly to the game yet (that requires a server to safely hide an API key). Instead we build a ready-made prompt you paste into e.g. ChatGPT, Claude or Gemini — then paste the answer straight back in here.",
      aiTopicLabel: "Topic / subject",
      aiTopicPlaceholder: "E.g. «Photosynthesis»",
      aiCountLabel: "Number of questions",
      aiLevelLabel: "Difficulty",
      aiLevelEasy: "Easy",
      aiLevelMedium: "Medium",
      aiLevelHard: "Hard",
      aiContextLabel: "Extra context (optional)",
      aiContextPlaceholder: "E.g. curriculum text, chapter number, keywords...",
      aiMakePromptBtn: "Build prompt",
      aiPromptOutputLabel: "Ready-made prompt (copy and paste into your AI)",
      aiCopyBtn: "📋 Copy prompt",
      aiCopiedBtn: "✅ Copied!",
      aiResponseLabel: "Paste the AI's answer (JSON) here",
      aiResponsePlaceholder: "Paste the AI's full response here...",
      aiImportDeckLabel: "Add the questions to topic",
      aiImportBtn: "⬇️ Import questions",
      aiImportNoDeck: "Choose or create a topic first.",
      aiImportNoValid: "No valid questions found in the response. Check the format and try again.",
      aiImportSuccess: "✅ Added {count} questions!",

      footerNote: "Made for personal learning. Data is only stored locally in your browser.",

      backLink: "← Back",
      pointsLabel: "Score",
      recordLabel: "Record",
      emptyDeckTitle: "Topic not found",
      emptyDeckText: "Choose a topic with at least one question on the homepage.",
      toHomepage: "To the homepage",

      flappyTitle: "🐦 Flappy Quiz",
      flappyIntro: "Press space, W, or click to flap.",
      flappyIntro2: "Every time you score, a question pops up. Answer correctly to keep going!",
      startGameBtn: "Start game",
      gameOverTitle: "Game over!",
      playAgainBtn: "Play again",
      backToDecks: "Back to topics",
      answerCorrectContinuing: "✅ Correct! Continuing...",
      answerWrongWithAnswer: "❌ Wrong! Correct answer: {answer}",
      newRecordSummary: "You scored {score} points — new record! 🎉",
      scoreSummary: "You scored {score} points. Record: {record}.",

      dealerLabel: "Dealer",
      playerLabel: "You",
      chooseBet: "Choose your bet",
      dealBtn: "Deal cards",
      hitBtn: "Hit",
      doubleBtn: "Double",
      standBtn: "Stand",
      continueBtn: "Continue",
      betLabel: "Bet: {bet} chips",
      allInLabel: "All in",
      outcomeBlackjack: "🂡 Blackjack! You win {profit} chips.",
      outcomeWin: "🎉 You won! +{profit} chips.",
      outcomePush: "🤝 Push. You get your bet back.",
      outcomeBust: "💥 Bust! You lost {bet} chips.",
      outcomeLose: "😬 You lost {bet} chips.",
      quizProgress: "Earn chips — question {index} of {count}",
      quizDone: "You got {correct}/{count} correct — {chips} chips to play with!",
      answerCorrectChips: "✅ Correct! +{reward} chips",
      answerWrongTryAgain: "❌ Wrong! Try again soon.",

      aiPromptText:
        'Create {count} multiple-choice questions about the topic "{topic}", meant as practice for a test/exam/presentation at {level}.\n{contextLine}Requirements:\n- Each question must have exactly 4 answer options.\n- Only one option should be correct.\n- Questions should be short enough to read quickly during a game.\n- Answer in {languageName}.\n- Respond with ONLY valid JSON, no explanatory text before or after, in exactly this format:\n\n[\n  {\n    "question": "Question text here?",\n    "options": ["Option A", "Option B", "Option C", "Option D"],\n    "correctIndex": 0\n  }\n]\n\n"correctIndex" is the index (0-3) in the "options" list that is correct.',
      aiPromptLevelEasy: "an easy/basic level",
      aiPromptLevelMedium: "a medium difficulty",
      aiPromptLevelHard: "an advanced/hard level",
      aiPromptContextLine: "Extra context / curriculum to consider: {context}\n",
      aiPromptFillFirst: "Paste the AI's answer first.",
      aiPromptParseError:
        "Could not parse the response as JSON. Check that you pasted the AI's full response.",
      aiPromptExpectedArray: "Expected a list of questions (JSON array).",
      languageName: "English",

      fcProgress: "Card {index} of {count}",
      fcQuestionLabel: "Question",
      fcAnswerLabel: "Answer",
      fcTapToFlip: "Tap to flip the card",
      fcShowAnswerBtn: "Show answer",
      fcDidNotKnowBtn: "😕 Didn't know it",
      fcKnewItBtn: "😄 Knew it",
      fcSummaryTitle: "Done!",
      fcSummaryText: "You knew {known} of {total} cards.",
      fcRetryUnknownBtn: "🔁 Practice the ones you missed",
      fcRestartBtn: "🔄 Start over",

      nextQuestionBtn: "Next question ➜",
      progressSummary: "{accuracy}% correct overall · {attempted} of {total} questions practiced",
      progressNoData: "You haven't practiced any questions in this topic yet. Play a round in one of the modes to see your progress here!",
      progressRowStats: "{correct} correct · {wrong} wrong",
      notAttemptedHeading: "Not practiced yet",
      resetStatsBtn: "🔄 Reset stats",
      confirmResetStats: "Reset all stats for the topic «{name}»?",
    },
  };

  function getLocale() {
    const stored = localStorage.getItem(LOCALE_KEY);
    if (stored && TRANSLATIONS[stored]) return stored;
    const browserLang = (navigator.language || "nb").slice(0, 2);
    return TRANSLATIONS[browserLang] ? browserLang : "nb";
  }

  function setLocale(locale) {
    if (!TRANSLATIONS[locale]) return;
    localStorage.setItem(LOCALE_KEY, locale);
    applyTranslations();
    document.dispatchEvent(new CustomEvent("localechange", { detail: { locale } }));
  }

  function t(key, vars) {
    const locale = getLocale();
    let str =
      (TRANSLATIONS[locale] && TRANSLATIONS[locale][key]) ??
      TRANSLATIONS.nb[key] ??
      key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.split(`{${k}}`).join(v);
      }
    }
    return str;
  }

  function applyTranslations(root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });
    document.documentElement.lang = getLocale();
  }

  function availableLocales() {
    return [
      { code: "nb", label: "🇳🇴 Norsk" },
      { code: "en", label: "🇬🇧 English" },
    ];
  }

  function mountSwitcher(container) {
    if (!container) return;
    container.innerHTML = "";
    const select = document.createElement("select");
    select.className = "lang-select";
    select.setAttribute("aria-label", t("langLabel"));
    for (const { code, label } of availableLocales()) {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = label;
      select.appendChild(opt);
    }
    select.value = getLocale();
    select.addEventListener("change", () => setLocale(select.value));
    container.appendChild(select);
    document.addEventListener("localechange", () => {
      select.value = getLocale();
      select.setAttribute("aria-label", t("langLabel"));
    });
  }

  return { t, getLocale, setLocale, applyTranslations, availableLocales, mountSwitcher };
})();
