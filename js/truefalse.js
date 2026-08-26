const { getDeck } = window.Storage;

const params = new URLSearchParams(location.search);
const deckId = params.get("deck");
const deck = deckId ? getDeck(deckId) : null;

const t = window.I18n.t;
const ROUNDS = 10;

const deckTitleEl = document.getElementById("deck-title");
const progressLabel = document.getElementById("tf-progress-label");
const overlayEmpty = document.getElementById("overlay-empty");
const gameEl = document.getElementById("tf-game");
const summaryEl = document.getElementById("tf-summary");
const summaryText = document.getElementById("tf-summary-text");
const coinBadgeEl = document.getElementById("coin-badge");

const tfQuestion = document.getElementById("tf-question");
const tfStatement = document.getElementById("tf-statement");
const tfFeedback = document.getElementById("tf-feedback");
const answerControls = document.getElementById("tf-answer-controls");
const trueBtn = document.getElementById("tf-true-btn");
const falseBtn = document.getElementById("tf-false-btn");
const nextBtn = document.getElementById("tf-next-btn");
const restartBtn = document.getElementById("tf-restart-btn");

window.I18n.applyTranslations();
window.I18n.mountSwitcher(document.getElementById("lang-switcher"));
window.Theme.applyTheme();
document.addEventListener("localechange", () => window.I18n.applyTranslations());

if (!deck || !deck.questions || deck.questions.length === 0) {
  overlayEmpty.classList.remove("hidden");
  gameEl.classList.add("hidden");
} else {
  deckTitleEl.textContent = deck.name;
  window.Coins.mountBadge(coinBadgeEl);
  initGame();
}

function initGame() {
  let round = 0;
  let correctCount = 0;
  let lastQuestionId = null;
  let currentQuestion = null;
  let statementIsTrue = false;

  function pickQuestion() {
    const pool = deck.questions;
    if (pool.length === 1) return pool[0];
    let q;
    do {
      q = pool[Math.floor(Math.random() * pool.length)];
    } while (q.id === lastQuestionId);
    return q;
  }

  function nextRound() {
    if (round >= ROUNDS) {
      finish();
      return;
    }
    round++;
    progressLabel.textContent = t("tfProgress", { index: round, count: ROUNDS });

    currentQuestion = pickQuestion();
    lastQuestionId = currentQuestion.id;
    statementIsTrue = Math.random() < 0.5;

    let shownAnswer;
    if (statementIsTrue) {
      shownAnswer = currentQuestion.options[currentQuestion.correctIndex];
    } else {
      const wrongIndexes = currentQuestion.options
        .map((_, i) => i)
        .filter((i) => i !== currentQuestion.correctIndex);
      const wrongIndex = wrongIndexes[Math.floor(Math.random() * wrongIndexes.length)];
      shownAnswer = currentQuestion.options[wrongIndex];
    }

    tfQuestion.textContent = currentQuestion.question;
    tfStatement.textContent = shownAnswer;
    tfFeedback.textContent = "";
    answerControls.classList.remove("hidden");
    nextBtn.classList.add("hidden");
  }

  function answer(userSaysTrue) {
    const isCorrect = userSaysTrue === statementIsTrue;
    answerControls.classList.add("hidden");
    window.Storage.recordAnswer(deck.id, currentQuestion.id, isCorrect);

    if (isCorrect) {
      correctCount++;
      window.Coins.awardForCorrectAnswer();
      tfFeedback.textContent = t("tfCorrect");
      tfFeedback.style.color = "#4ade80";
    } else {
      const correctWord = statementIsTrue ? t("tfTrueBtn") : t("tfFalseBtn");
      tfFeedback.textContent = t("tfWrong", { answer: correctWord });
      tfFeedback.style.color = "#f87171";
    }

    nextBtn.classList.remove("hidden");
  }

  function finish() {
    gameEl.classList.add("hidden");
    summaryEl.classList.remove("hidden");
    summaryText.textContent = t("tfSummaryText", {
      correct: correctCount,
      total: ROUNDS,
      coins: correctCount * window.Coins.EARN_PER_CORRECT,
    });
  }

  function restart() {
    round = 0;
    correctCount = 0;
    lastQuestionId = null;
    summaryEl.classList.add("hidden");
    gameEl.classList.remove("hidden");
    nextRound();
  }

  trueBtn.addEventListener("click", () => answer(true));
  falseBtn.addEventListener("click", () => answer(false));
  nextBtn.addEventListener("click", nextRound);
  restartBtn.addEventListener("click", restart);

  nextRound();
}
