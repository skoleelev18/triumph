// Enkelt lagringslag for temaer (decks) og spørsmål, lagret i localStorage.
// Vanlig script (ikke ES-modul) slik at siden kan åpnes direkte som fil også.

window.Storage = (function () {

const DECKS_KEY = "quizspill_decks_v1";

function loadDecks() {
  const raw = localStorage.getItem(DECKS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveDecks(decks) {
  localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getDecks() {
  return loadDecks();
}

function getDeck(deckId) {
  return loadDecks().find((d) => d.id === deckId) || null;
}

function createDeck(name) {
  const decks = loadDecks();
  const deck = {
    id: uid(),
    name: name.trim(),
    createdAt: Date.now(),
    highScore: 0,
    questions: [],
  };
  decks.push(deck);
  saveDecks(decks);
  return deck;
}

function deleteDeck(deckId) {
  const decks = loadDecks().filter((d) => d.id !== deckId);
  saveDecks(decks);
}

function renameDeck(deckId, newName) {
  const decks = loadDecks();
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) return;
  deck.name = newName.trim();
  saveDecks(decks);
}

function addQuestion(deckId, question) {
  const decks = loadDecks();
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) return null;
  const q = {
    id: uid(),
    question: question.question.trim(),
    options: question.options.map((o) => o.trim()),
    correctIndex: question.correctIndex,
  };
  deck.questions.push(q);
  saveDecks(decks);
  return q;
}

function importQuestions(deckId, questions) {
  const decks = loadDecks();
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) return 0;
  let added = 0;
  for (const raw of questions) {
    if (!raw || typeof raw.question !== "string") continue;
    if (!Array.isArray(raw.options) || raw.options.length < 2) continue;
    const correctIndex = Number(raw.correctIndex);
    if (
      !Number.isInteger(correctIndex) ||
      correctIndex < 0 ||
      correctIndex >= raw.options.length
    )
      continue;
    deck.questions.push({
      id: uid(),
      question: raw.question.trim(),
      options: raw.options.map((o) => String(o).trim()),
      correctIndex,
    });
    added++;
  }
  saveDecks(decks);
  return added;
}

function deleteQuestion(deckId, questionId) {
  const decks = loadDecks();
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) return;
  deck.questions = deck.questions.filter((q) => q.id !== questionId);
  saveDecks(decks);
}

function setHighScore(deckId, score) {
  const decks = loadDecks();
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) return;
  if (score > (deck.highScore || 0)) {
    deck.highScore = score;
    saveDecks(decks);
  }
}

const DEFAULT_CHIPS = 100;

function getChips(deckId) {
  const deck = getDeck(deckId);
  if (!deck) return 0;
  if (typeof deck.chips !== "number") return DEFAULT_CHIPS;
  return deck.chips;
}

function addChips(deckId, delta) {
  const decks = loadDecks();
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) return 0;
  const current = typeof deck.chips === "number" ? deck.chips : DEFAULT_CHIPS;
  deck.chips = Math.max(0, current + delta);
  saveDecks(decks);
  return deck.chips;
}

function resetChips(deckId, amount) {
  const decks = loadDecks();
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) return 0;
  deck.chips = typeof amount === "number" ? amount : DEFAULT_CHIPS;
  saveDecks(decks);
  return deck.chips;
}

function exportDeck(deckId) {
  const deck = getDeck(deckId);
  if (!deck) return "";
  return JSON.stringify(
    {
      name: deck.name,
      questions: deck.questions.map(({ question, options, correctIndex }) => ({
        question,
        options,
        correctIndex,
      })),
    },
    null,
    2
  );
}

return {
  getDecks,
  getDeck,
  createDeck,
  deleteDeck,
  renameDeck,
  addQuestion,
  importQuestions,
  deleteQuestion,
  setHighScore,
  getChips,
  addChips,
  resetChips,
  exportDeck,
};

})();
