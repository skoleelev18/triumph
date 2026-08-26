const {
  getDecks,
  getDeck,
  createDeck,
  deleteDeck,
  addQuestion,
  deleteQuestion,
  importQuestions,
  importDeck,
  exportDeck,
} = window.Storage;
const { buildPrompt, parseAIResponse } = window.AIHelper;

const deckListEl = document.getElementById("deck-list");
const newDeckForm = document.getElementById("new-deck-form");
const newDeckNameInput = document.getElementById("new-deck-name");
const importFileBtn = document.getElementById("import-file-btn");
const importFileInput = document.getElementById("import-file-input");
const deckImportStatus = document.getElementById("deck-import-status");
const manualDeckSelect = document.getElementById("manual-deck-select");
const manualQuestionForm = document.getElementById("manual-question-form");
const aiPromptForm = document.getElementById("ai-prompt-form");
const aiPromptResult = document.getElementById("ai-prompt-result");
const aiPromptOutput = document.getElementById("ai-prompt-output");
const copyPromptBtn = document.getElementById("copy-prompt-btn");
const aiImportDeckSelect = document.getElementById("ai-import-deck-select");
const aiResponseInput = document.getElementById("ai-response-input");
const importQuestionsBtn = document.getElementById("import-questions-btn");
const importStatus = document.getElementById("import-status");

let expandedDeckId = null;
const t = window.I18n.t;

function render() {
  const decks = getDecks();
  renderDeckList(decks);
  renderDeckSelect(manualDeckSelect, decks);
  renderDeckSelect(aiImportDeckSelect, decks);
}

function renderDeckSelect(selectEl, decks) {
  const prevValue = selectEl.value;
  selectEl.innerHTML = "";
  if (decks.length === 0) {
    const opt = document.createElement("option");
    opt.textContent = t("deckOptionCreateFirst");
    opt.disabled = true;
    opt.selected = true;
    selectEl.appendChild(opt);
    return;
  }
  for (const deck of decks) {
    const opt = document.createElement("option");
    opt.value = deck.id;
    opt.textContent = t("deckOptionLabel", { name: deck.name, count: deck.questions.length });
    selectEl.appendChild(opt);
  }
  if (decks.some((d) => d.id === prevValue)) {
    selectEl.value = prevValue;
  }
}

function renderDeckList(decks) {
  deckListEl.innerHTML = "";
  if (decks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = t("noDecksYet");
    deckListEl.appendChild(empty);
    return;
  }

  for (const deck of decks) {
    const card = document.createElement("div");
    card.className = "deck-card";

    const info = document.createElement("div");
    info.className = "deck-info";
    info.innerHTML = `<strong>${escapeHtml(deck.name)}</strong><br/>
      <span class="meta">${t("deckMeta", { count: deck.questions.length, score: deck.highScore || 0 })}</span>`;

    const actions = document.createElement("div");
    actions.className = "deck-actions";

    const playLink = document.createElement("a");
    const blackjackLink = document.createElement("a");
    const flashcardsLink = document.createElement("a");
    const progressLink = document.createElement("a");
    if (deck.questions.length > 0) {
      playLink.href = `flappy.html?deck=${encodeURIComponent(deck.id)}`;
      playLink.textContent = t("playFlappy");
      blackjackLink.href = `blackjack.html?deck=${encodeURIComponent(deck.id)}`;
      blackjackLink.textContent = t("playBlackjack");
      flashcardsLink.href = `flashcards.html?deck=${encodeURIComponent(deck.id)}`;
      flashcardsLink.textContent = t("playFlashcards");
      progressLink.href = `progress.html?deck=${encodeURIComponent(deck.id)}`;
      progressLink.textContent = t("playProgress");
    } else {
      playLink.href = "#";
      playLink.textContent = t("addQuestionsFirstFlappy");
      playLink.style.pointerEvents = "none";
      playLink.style.opacity = "0.5";
      blackjackLink.href = "#";
      blackjackLink.textContent = t("addQuestionsFirstBlackjack");
      blackjackLink.style.pointerEvents = "none";
      blackjackLink.style.opacity = "0.5";
      flashcardsLink.href = "#";
      flashcardsLink.textContent = t("addQuestionsFirstFlashcards");
      flashcardsLink.style.pointerEvents = "none";
      flashcardsLink.style.opacity = "0.5";
      progressLink.href = "#";
      progressLink.textContent = t("addQuestionsFirstProgress");
      progressLink.style.pointerEvents = "none";
      progressLink.style.opacity = "0.5";
    }
    for (const link of [playLink, blackjackLink, flashcardsLink, progressLink]) {
      link.className = "secondary";
      Object.assign(link.style, {
        display: "inline-block",
        background: "#eef0f7",
        color: "#1c2333",
        borderRadius: "8px",
      });
    }

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "secondary";
    toggleBtn.textContent = expandedDeckId === deck.id ? t("hideQuestions") : t("showQuestions");
    toggleBtn.addEventListener("click", () => {
      expandedDeckId = expandedDeckId === deck.id ? null : deck.id;
      renderDeckList(decks);
    });

    const exportBtn = document.createElement("button");
    exportBtn.className = "secondary";
    exportBtn.textContent = t("exportBtn");
    exportBtn.addEventListener("click", () => downloadDeck(deck.id));

    const shareBtn = document.createElement("button");
    shareBtn.className = "secondary";
    shareBtn.textContent = t("shareBtn");
    shareBtn.addEventListener("click", () => shareDeck(deck, shareBtn));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "danger";
    deleteBtn.textContent = t("deleteDeckBtn");
    deleteBtn.addEventListener("click", () => {
      if (confirm(t("confirmDeleteDeck", { name: deck.name }))) {
        deleteDeck(deck.id);
        render();
      }
    });

    actions.append(playLink, blackjackLink, flashcardsLink, progressLink, toggleBtn, exportBtn, shareBtn, deleteBtn);
    card.append(info, actions);
    deckListEl.appendChild(card);

    if (expandedDeckId === deck.id) {
      const list = document.createElement("div");
      list.className = "question-list";
      if (deck.questions.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = t("noQuestionsInDeck");
        list.appendChild(empty);
      } else {
        for (const q of deck.questions) {
          const item = document.createElement("div");
          item.className = "question-item";
          const correctText = q.options[q.correctIndex];
          const span = document.createElement("span");
          span.textContent = t("questionListItem", { question: q.question, answer: correctText });
          const del = document.createElement("button");
          del.className = "danger";
          del.textContent = t("deleteBtn");
          del.addEventListener("click", () => {
            deleteQuestion(deck.id, q.id);
            render();
          });
          item.append(span, del);
          list.appendChild(item);
        }
      }
      deckListEl.appendChild(list);
    }
  }
}

function downloadDeck(deckId) {
  const json = exportDeck(deckId);
  const deck = getDecks().find((d) => d.id === deckId);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(deck?.name || "tema").replace(/\s+/g, "_")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function shareDeck(deck, btn) {
  const url = window.Share.buildShareUrl(deck);
  const originalText = btn.textContent;
  try {
    await navigator.clipboard.writeText(url);
    btn.textContent = t("shareLinkCopied");
  } catch {
    prompt(t("shareLinkFallbackPrompt"), url);
  }
  if (url.length > 4000) {
    alert(t("shareLinkTooLong"));
  }
  setTimeout(() => (btn.textContent = originalText), 1800);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

newDeckForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = newDeckNameInput.value.trim();
  if (!name) return;
  createDeck(name);
  newDeckNameInput.value = "";
  render();
});

manualQuestionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const deckId = manualDeckSelect.value;
  if (!deckId) return;
  const question = document.getElementById("manual-question-text").value;
  const options = [0, 1, 2, 3].map((i) => document.getElementById(`opt-${i}`).value);
  const correctIndex = Number(
    document.querySelector('input[name="correct"]:checked').value
  );
  addQuestion(deckId, { question, options, correctIndex });
  manualQuestionForm.reset();
  render();
});

aiPromptForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const topic = document.getElementById("ai-topic").value.trim();
  const count = Number(document.getElementById("ai-count").value) || 5;
  const level = document.getElementById("ai-level").value;
  const context = document.getElementById("ai-context").value.trim();
  const prompt = buildPrompt({ topic, count, level, context });
  aiPromptOutput.value = prompt;
  aiPromptResult.classList.remove("hidden");
});

copyPromptBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(aiPromptOutput.value);
    copyPromptBtn.textContent = t("aiCopiedBtn");
    setTimeout(() => (copyPromptBtn.textContent = t("aiCopyBtn")), 1500);
  } catch {
    aiPromptOutput.select();
    document.execCommand("copy");
  }
});

importQuestionsBtn.addEventListener("click", () => {
  const deckId = aiImportDeckSelect.value;
  importStatus.className = "";
  importStatus.textContent = "";

  if (!deckId) {
    importStatus.textContent = t("aiImportNoDeck");
    importStatus.className = "error";
    return;
  }

  try {
    const parsed = parseAIResponse(aiResponseInput.value);
    const added = importQuestions(deckId, parsed);
    if (added === 0) {
      importStatus.textContent = t("aiImportNoValid");
      importStatus.className = "error";
    } else {
      importStatus.textContent = t("aiImportSuccess", { count: added });
      importStatus.className = "success";
      aiResponseInput.value = "";
      render();
    }
  } catch (err) {
    importStatus.textContent = err.message;
    importStatus.className = "error";
  }
});

importFileBtn.addEventListener("click", () => importFileInput.click());

importFileInput.addEventListener("change", () => {
  const file = importFileInput.files[0];
  importFileInput.value = "";
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    deckImportStatus.className = "";
    deckImportStatus.textContent = "";
    try {
      const data = JSON.parse(reader.result);
      const result = importDeck(data);
      if (!result) throw new Error(t("importFileError"));
      deckImportStatus.textContent = t("importSuccess", { name: result.deck.name });
      deckImportStatus.className = "success";
      render();
    } catch {
      deckImportStatus.textContent = t("importFileError");
      deckImportStatus.className = "error";
    }
  };
  reader.readAsText(file);
});

function importFromUrl() {
  const params = new URLSearchParams(location.search);
  const encoded = params.get("import");
  if (!encoded) return;

  history.replaceState(null, "", location.pathname);

  try {
    const data = window.Share.decodeDeck(encoded);
    if (!data || typeof data.name !== "string" || !Array.isArray(data.questions)) {
      throw new Error("invalid");
    }
    if (confirm(t("importConfirm", { name: data.name, count: data.questions.length }))) {
      const result = importDeck(data);
      deckImportStatus.textContent = t("importSuccess", { name: result.deck.name });
      deckImportStatus.className = "success";
      render();
    }
  } catch {
    deckImportStatus.textContent = t("importLinkError");
    deckImportStatus.className = "error";
  }
}

window.I18n.applyTranslations();
window.I18n.mountSwitcher(document.getElementById("lang-switcher"));
document.addEventListener("localechange", () => {
  window.I18n.applyTranslations();
  render();
});
render();
importFromUrl();
