const {
  getDecks,
  createDeck,
  deleteDeck,
  addQuestion,
  deleteQuestion,
  importQuestions,
  exportDeck,
} = window.Storage;
const { buildPrompt, parseAIResponse } = window.AIHelper;

const deckListEl = document.getElementById("deck-list");
const newDeckForm = document.getElementById("new-deck-form");
const newDeckNameInput = document.getElementById("new-deck-name");
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
    opt.textContent = "Opprett et tema først";
    opt.disabled = true;
    opt.selected = true;
    selectEl.appendChild(opt);
    return;
  }
  for (const deck of decks) {
    const opt = document.createElement("option");
    opt.value = deck.id;
    opt.textContent = `${deck.name} (${deck.questions.length} spørsmål)`;
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
    empty.textContent = "Ingen temaer ennå. Lag ditt første tema under.";
    deckListEl.appendChild(empty);
    return;
  }

  for (const deck of decks) {
    const card = document.createElement("div");
    card.className = "deck-card";

    const info = document.createElement("div");
    info.className = "deck-info";
    info.innerHTML = `<strong>${escapeHtml(deck.name)}</strong><br/>
      <span class="meta">${deck.questions.length} spørsmål · Rekord: ${deck.highScore || 0} poeng</span>`;

    const actions = document.createElement("div");
    actions.className = "deck-actions";

    const playLink = document.createElement("a");
    if (deck.questions.length > 0) {
      playLink.href = `flappy.html?deck=${encodeURIComponent(deck.id)}`;
      playLink.textContent = "▶ Spill Flappy Quiz";
    } else {
      playLink.href = "#";
      playLink.textContent = "▶ Legg til spørsmål først";
      playLink.style.pointerEvents = "none";
      playLink.style.opacity = "0.5";
    }
    playLink.className = "secondary";
    Object.assign(playLink.style, {
      display: "inline-block",
      background: "#eef0f7",
      color: "#1c2333",
      borderRadius: "8px",
    });

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "secondary";
    toggleBtn.textContent = expandedDeckId === deck.id ? "Skjul spørsmål" : "Se spørsmål";
    toggleBtn.addEventListener("click", () => {
      expandedDeckId = expandedDeckId === deck.id ? null : deck.id;
      renderDeckList(decks);
    });

    const exportBtn = document.createElement("button");
    exportBtn.className = "secondary";
    exportBtn.textContent = "Eksporter";
    exportBtn.addEventListener("click", () => downloadDeck(deck.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "danger";
    deleteBtn.textContent = "Slett tema";
    deleteBtn.addEventListener("click", () => {
      if (confirm(`Slette temaet «${deck.name}» og alle spørsmålene i det?`)) {
        deleteDeck(deck.id);
        render();
      }
    });

    actions.append(playLink, toggleBtn, exportBtn, deleteBtn);
    card.append(info, actions);
    deckListEl.appendChild(card);

    if (expandedDeckId === deck.id) {
      const list = document.createElement("div");
      list.className = "question-list";
      if (deck.questions.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "Ingen spørsmål i dette temaet ennå.";
        list.appendChild(empty);
      } else {
        for (const q of deck.questions) {
          const item = document.createElement("div");
          item.className = "question-item";
          const correctText = q.options[q.correctIndex];
          const span = document.createElement("span");
          span.textContent = `${q.question} — Riktig: ${correctText}`;
          const del = document.createElement("button");
          del.className = "danger";
          del.textContent = "Slett";
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
    copyPromptBtn.textContent = "✅ Kopiert!";
    setTimeout(() => (copyPromptBtn.textContent = "📋 Kopier prompt"), 1500);
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
    importStatus.textContent = "Velg eller opprett et tema først.";
    importStatus.className = "error";
    return;
  }

  try {
    const parsed = parseAIResponse(aiResponseInput.value);
    const added = importQuestions(deckId, parsed);
    if (added === 0) {
      importStatus.textContent =
        "Fant ingen gyldige spørsmål i svaret. Sjekk formatet og prøv igjen.";
      importStatus.className = "error";
    } else {
      importStatus.textContent = `✅ La til ${added} spørsmål!`;
      importStatus.className = "success";
      aiResponseInput.value = "";
      render();
    }
  } catch (err) {
    importStatus.textContent = err.message;
    importStatus.className = "error";
  }
});

render();
