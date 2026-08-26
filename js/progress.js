const { getDeck, resetDeckStats } = window.Storage;

const params = new URLSearchParams(location.search);
const deckId = params.get("deck");
const deck = deckId ? getDeck(deckId) : null;

const t = window.I18n.t;

const deckTitleEl = document.getElementById("deck-title");
const overlayEmpty = document.getElementById("overlay-empty");
const content = document.getElementById("pg-content");
const summaryEl = document.getElementById("pg-summary");
const listEl = document.getElementById("pg-list");
const notAttemptedBlock = document.getElementById("pg-not-attempted");
const notAttemptedList = document.getElementById("pg-not-attempted-list");
const resetBtn = document.getElementById("reset-stats-btn");

window.I18n.applyTranslations();
window.I18n.mountSwitcher(document.getElementById("lang-switcher"));
window.Theme.applyTheme();
document.addEventListener("localechange", () => {
  window.I18n.applyTranslations();
  render();
});

if (!deck || !deck.questions || deck.questions.length === 0) {
  overlayEmpty.classList.remove("hidden");
  content.classList.add("hidden");
} else {
  deckTitleEl.textContent = deck.name;
  resetBtn.addEventListener("click", () => {
    if (confirm(t("confirmResetStats", { name: deck.name }))) {
      resetDeckStats(deck.id);
      render();
    }
  });
  render();
}

function render() {
  const questions = deck.questions;
  const attempted = questions.filter(
    (q) => q.stats && q.stats.correct + q.stats.wrong > 0
  );
  const notAttempted = questions.filter(
    (q) => !q.stats || q.stats.correct + q.stats.wrong === 0
  );

  const totalCorrect = attempted.reduce((sum, q) => sum + q.stats.correct, 0);
  const totalWrong = attempted.reduce((sum, q) => sum + q.stats.wrong, 0);
  const totalAnswers = totalCorrect + totalWrong;

  if (totalAnswers === 0) {
    summaryEl.textContent = t("progressNoData");
  } else {
    const accuracy = Math.round((totalCorrect / totalAnswers) * 100);
    summaryEl.textContent = t("progressSummary", {
      accuracy,
      attempted: attempted.length,
      total: questions.length,
    });
  }

  const sorted = [...attempted].sort((a, b) => {
    const accA = a.stats.correct / (a.stats.correct + a.stats.wrong);
    const accB = b.stats.correct / (b.stats.correct + b.stats.wrong);
    return accA - accB;
  });

  listEl.innerHTML = "";
  for (const q of sorted) {
    const total = q.stats.correct + q.stats.wrong;
    const accuracy = Math.round((q.stats.correct / total) * 100);

    const row = document.createElement("div");
    row.className = "pg-row";

    const questionEl = document.createElement("p");
    questionEl.className = "pg-row-question";
    questionEl.textContent = q.question;

    const meta = document.createElement("div");
    meta.className = "pg-row-meta";

    const statsText = document.createElement("span");
    statsText.textContent = t("progressRowStats", {
      correct: q.stats.correct,
      wrong: q.stats.wrong,
    });

    const bar = document.createElement("div");
    bar.className = "pg-bar";
    const fill = document.createElement("div");
    fill.className = "pg-bar-fill";
    fill.style.width = `${accuracy}%`;
    if (accuracy < 50) fill.style.background = "linear-gradient(90deg, #f87171, #ef4444)";
    else if (accuracy < 80) fill.style.background = "linear-gradient(90deg, #fbbf24, #f59e0b)";
    bar.appendChild(fill);

    const accuracyEl = document.createElement("span");
    accuracyEl.className = "pg-accuracy";
    accuracyEl.textContent = `${accuracy}%`;

    meta.append(statsText, bar, accuracyEl);
    row.append(questionEl, meta);
    listEl.appendChild(row);
  }

  notAttemptedList.innerHTML = "";
  if (notAttempted.length === 0) {
    notAttemptedBlock.classList.add("hidden");
  } else {
    notAttemptedBlock.classList.remove("hidden");
    for (const q of notAttempted) {
      const li = document.createElement("li");
      li.textContent = q.question;
      notAttemptedList.appendChild(li);
    }
  }
}
