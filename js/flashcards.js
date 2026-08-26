const { getDeck } = window.Storage;

const params = new URLSearchParams(location.search);
const deckId = params.get("deck");
const deck = deckId ? getDeck(deckId) : null;

const t = window.I18n.t;

const deckTitleEl = document.getElementById("deck-title");
const progressLabel = document.getElementById("progress-label");
const overlayEmpty = document.getElementById("overlay-empty");
const gameEl = document.getElementById("fc-game");
const summaryEl = document.getElementById("fc-summary");
const summaryText = document.getElementById("fc-summary-text");

const flipCard = document.getElementById("flip-card");
const fcQuestion = document.getElementById("fc-question");
const fcAnswer = document.getElementById("fc-answer");
const flipControls = document.getElementById("fc-flip-controls");
const flipBtn = document.getElementById("flip-btn");
const rateControls = document.getElementById("fc-rate-controls");
const knownBtn = document.getElementById("fc-known-btn");
const unknownBtn = document.getElementById("fc-unknown-btn");
const retryUnknownBtn = document.getElementById("fc-retry-unknown-btn");
const restartBtn = document.getElementById("fc-restart-btn");

window.I18n.applyTranslations();
window.I18n.mountSwitcher(document.getElementById("lang-switcher"));
window.Theme.applyTheme();
document.addEventListener("localechange", () => window.I18n.applyTranslations());

if (!deck || !deck.questions || deck.questions.length === 0) {
  overlayEmpty.classList.remove("hidden");
  gameEl.classList.add("hidden");
} else {
  window.Coins.mountBadge(document.getElementById("coin-badge"));
  deckTitleEl.textContent = deck.name;
  initGame();
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function initGame() {
  let queue = shuffle(deck.questions);
  let index = 0;
  let knownCount = 0;
  let unknownCards = [];

  function startRound(cards) {
    queue = shuffle(cards);
    index = 0;
    knownCount = 0;
    unknownCards = [];
    summaryEl.classList.add("hidden");
    gameEl.classList.remove("hidden");
    showCard();
  }

  function updateProgress() {
    progressLabel.textContent = t("fcProgress", { index: index + 1, count: queue.length });
  }

  function showCard() {
    flipCard.classList.remove("flipped");
    flipControls.classList.remove("hidden");
    rateControls.classList.add("hidden");
    const q = queue[index];
    fcQuestion.textContent = q.question;
    fcAnswer.textContent = q.options[q.correctIndex];
    updateProgress();
  }

  function flip() {
    flipCard.classList.add("flipped");
    flipControls.classList.add("hidden");
    rateControls.classList.remove("hidden");
  }

  function rate(knew) {
    window.Storage.recordAnswer(deck.id, queue[index].id, knew);
    if (knew) {
      knownCount++;
      window.Coins.awardForCorrectAnswer();
    } else {
      unknownCards.push(queue[index]);
    }
    index++;
    if (index >= queue.length) {
      finishRound();
    } else {
      showCard();
    }
  }

  function finishRound() {
    gameEl.classList.add("hidden");
    summaryEl.classList.remove("hidden");
    summaryText.textContent = t("fcSummaryText", { known: knownCount, total: queue.length });
    if (unknownCards.length > 0) {
      retryUnknownBtn.classList.remove("hidden");
      retryUnknownBtn.onclick = () => startRound(unknownCards);
    } else {
      retryUnknownBtn.classList.add("hidden");
    }
  }

  flipCard.addEventListener("click", () => {
    if (flipControls.classList.contains("hidden")) return;
    flip();
  });
  flipCard.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (flipControls.classList.contains("hidden")) return;
    flip();
  });
  flipBtn.addEventListener("click", flip);
  knownBtn.addEventListener("click", () => rate(true));
  unknownBtn.addEventListener("click", () => rate(false));
  restartBtn.addEventListener("click", () => startRound(deck.questions));

  startRound(deck.questions);
}
