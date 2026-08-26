const { getDeck, addChips, resetChips } = window.Storage;

const params = new URLSearchParams(location.search);
const deckId = params.get("deck");
const deck = deckId ? getDeck(deckId) : null;

const deckTitleEl = document.getElementById("deck-title");
const chipsDisplay = document.getElementById("chips-display");
const dealerCardsEl = document.getElementById("dealer-cards");
const playerCardsEl = document.getElementById("player-cards");
const dealerTotalEl = document.getElementById("dealer-total");
const playerTotalEl = document.getElementById("player-total");
const bjMessage = document.getElementById("bj-message");

const panelBetting = document.getElementById("panel-betting");
const panelPlaying = document.getElementById("panel-playing");
const panelResolved = document.getElementById("panel-resolved");
const overlayQuestion = document.getElementById("overlay-question");
const overlayEmpty = document.getElementById("overlay-empty");

const betButtonsEl = document.getElementById("bet-buttons");
const betInput = document.getElementById("bet-input");
const dealBtn = document.getElementById("deal-btn");
const hitBtn = document.getElementById("hit-btn");
const doubleBtn = document.getElementById("double-btn");
const standBtn = document.getElementById("stand-btn");
const continueBtn = document.getElementById("continue-btn");
const resolvedText = document.getElementById("resolved-text");

const questionProgress = document.getElementById("question-progress");
const questionText = document.getElementById("question-text");
const questionOptions = document.getElementById("question-options");
const questionFeedback = document.getElementById("question-feedback");
const nextQuestionBtn = document.getElementById("next-question-btn");

const MIN_BET = 5;
const CHIP_REWARD = 20;
const QUIZ_LENGTH = 5;
const SUITS = [
  { symbol: "♠", color: "black" },
  { symbol: "♥", color: "red" },
  { symbol: "♦", color: "red" },
  { symbol: "♣", color: "black" },
];
const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const t = window.I18n.t;

window.I18n.applyTranslations();
window.I18n.mountSwitcher(document.getElementById("lang-switcher"));
window.Theme.applyTheme();
document.addEventListener("localechange", () => window.I18n.applyTranslations());

if (!deck || !deck.questions || deck.questions.length === 0) {
  overlayEmpty.classList.remove("hidden");
  panelBetting.classList.add("hidden");
} else {
  window.Coins.mountBadge(document.getElementById("coin-badge"));
  deckTitleEl.textContent = deck.name;
  initGame();
}

function initGame() {
  let playerHand = [];
  let dealerHand = [];
  let shoe = [];
  let currentBet = 0;
  let lastQuestionId = null;

  function shuffledShoe() {
    const cards = [];
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        cards.push({ rank, suit: suit.symbol, color: suit.color });
      }
    }
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  function drawCard() {
    if (shoe.length === 0) shoe = shuffledShoe();
    return shoe.pop();
  }

  function handValue(cards) {
    let total = 0;
    let aces = 0;
    for (const c of cards) {
      if (c.rank === "A") {
        aces++;
        total += 11;
      } else if (["J", "Q", "K"].includes(c.rank)) {
        total += 10;
      } else {
        total += Number(c.rank);
      }
    }
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }
    return total;
  }

  function isBlackjack(cards) {
    return cards.length === 2 && handValue(cards) === 21;
  }

  function renderChipsDisplay() {
    const chips = window.Storage.getChips(deck.id);
    chipsDisplay.textContent = chips;
    return chips;
  }

  function renderCard(card, faceDown) {
    const div = document.createElement("div");
    div.className = "bj-card" + (faceDown ? " hidden-card" : ` ${card.color}`);
    if (!faceDown) {
      const top = document.createElement("div");
      top.className = "bj-card-rank";
      top.textContent = `${card.rank}${card.suit}`;
      const center = document.createElement("div");
      center.className = "bj-card-suit-center";
      center.textContent = card.suit;
      const bottom = document.createElement("div");
      bottom.className = "bj-card-rank bottom";
      bottom.textContent = `${card.rank}${card.suit}`;
      div.append(top, center, bottom);
    }
    return div;
  }

  function renderHands({ hideDealerHole }) {
    dealerCardsEl.innerHTML = "";
    dealerHand.forEach((card, i) => {
      dealerCardsEl.appendChild(renderCard(card, hideDealerHole && i === 1));
    });
    playerCardsEl.innerHTML = "";
    playerHand.forEach((card) => playerCardsEl.appendChild(renderCard(card, false)));

    playerTotalEl.textContent = `(${handValue(playerHand)})`;
    dealerTotalEl.textContent = hideDealerHole ? "" : `(${handValue(dealerHand)})`;
  }

  function showPanel(panel) {
    [panelBetting, panelPlaying, panelResolved].forEach((p) => p.classList.add("hidden"));
    if (panel) panel.classList.remove("hidden");
  }

  function goToBetting() {
    dealerCardsEl.innerHTML = "";
    playerCardsEl.innerHTML = "";
    dealerTotalEl.textContent = "";
    playerTotalEl.textContent = "";
    const chips = renderChipsDisplay();
    if (chips < MIN_BET) {
      runChipsQuiz(QUIZ_LENGTH);
      return;
    }
    betInput.max = chips;
    if (Number(betInput.value) > chips) betInput.value = Math.min(chips, 10);
    renderBetButtons(chips);
    showPanel(panelBetting);
  }

  function renderBetButtons(chips) {
    betButtonsEl.innerHTML = "";
    const selectChip = (btn, amount) => {
      betInput.value = amount;
      [...betButtonsEl.children].forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    };

    const presets = [5, 10, 25, 50].filter((v) => v <= chips);
    for (const amount of presets) {
      const btn = document.createElement("button");
      btn.className = `poker-chip chip-${amount}`;
      btn.type = "button";
      const label = document.createElement("span");
      label.className = "poker-chip-label";
      label.textContent = amount;
      btn.appendChild(label);
      btn.addEventListener("click", () => selectChip(btn, amount));
      betButtonsEl.appendChild(btn);
    }

    const allIn = document.createElement("button");
    allIn.className = "poker-chip chip-allin";
    allIn.type = "button";
    const allInLabel = document.createElement("span");
    allInLabel.className = "poker-chip-label";
    allInLabel.textContent = t("allInLabel");
    allIn.appendChild(allInLabel);
    allIn.addEventListener("click", () => selectChip(allIn, chips));
    betButtonsEl.appendChild(allIn);
  }

  function deal() {
    bjMessage.textContent = "";
    const chips = window.Storage.getChips(deck.id);
    let bet = Math.floor(Number(betInput.value));
    if (!Number.isFinite(bet) || bet < MIN_BET) bet = MIN_BET;
    if (bet > chips) bet = chips;
    currentBet = bet;
    addChips(deck.id, -bet);
    renderChipsDisplay();

    shoe = shuffledShoe();
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];

    renderHands({ hideDealerHole: true });
    bjMessage.textContent = t("betLabel", { bet });

    if (isBlackjack(playerHand)) {
      finishHand();
    } else {
      const remaining = window.Storage.getChips(deck.id);
      doubleBtn.disabled = remaining < currentBet;
      showPanel(panelPlaying);
    }
  }

  function hit() {
    doubleBtn.disabled = true;
    playerHand.push(drawCard());
    renderHands({ hideDealerHole: true });
    if (handValue(playerHand) > 21) {
      finishHand();
    }
  }

  function stand() {
    finishHand();
  }

  function double() {
    if (doubleBtn.disabled) return;
    addChips(deck.id, -currentBet);
    currentBet *= 2;
    renderChipsDisplay();
    playerHand.push(drawCard());
    renderHands({ hideDealerHole: true });
    finishHand();
  }

  function finishHand() {
    const playerTotal = handValue(playerHand);
    const playerBJ = isBlackjack(playerHand);

    if (playerTotal <= 21) {
      while (handValue(dealerHand) < 17) {
        dealerHand.push(drawCard());
      }
    }
    renderHands({ hideDealerHole: false });

    const dealerTotal = handValue(dealerHand);
    const dealerBJ = isBlackjack(dealerHand);

    let outcome;
    if (playerTotal > 21) {
      outcome = "bust";
    } else if (playerBJ && dealerBJ) {
      outcome = "push";
    } else if (playerBJ) {
      outcome = "blackjack";
    } else if (dealerBJ) {
      outcome = "lose";
    } else if (dealerTotal > 21) {
      outcome = "win";
    } else if (playerTotal > dealerTotal) {
      outcome = "win";
    } else if (playerTotal < dealerTotal) {
      outcome = "lose";
    } else {
      outcome = "push";
    }

    resolveOutcome(outcome);
  }

  function resolveOutcome(outcome) {
    let payout = 0;
    let text = "";

    if (outcome === "blackjack") {
      payout = currentBet + Math.floor(currentBet * 1.5);
      text = t("outcomeBlackjack", { profit: payout - currentBet });
    } else if (outcome === "win") {
      payout = currentBet * 2;
      text = t("outcomeWin", { profit: payout - currentBet });
    } else if (outcome === "push") {
      payout = currentBet;
      text = t("outcomePush");
    } else if (outcome === "bust") {
      payout = 0;
      text = t("outcomeBust", { bet: currentBet });
    } else {
      payout = 0;
      text = t("outcomeLose", { bet: currentBet });
    }

    if (payout > 0) addChips(deck.id, payout);
    renderChipsDisplay();

    resolvedText.textContent = text;
    showPanel(panelResolved);
    continueBtn.onclick = goToBetting;
  }

  function runChipsQuiz(count) {
    let index = 0;
    let correct = 0;

    function nextQuestion() {
      if (index >= count) {
        overlayQuestion.classList.add("hidden");
        const chips = renderChipsDisplay();
        bjMessage.textContent = t("quizDone", { correct, count, chips });
        goToBetting();
        return;
      }
      index++;
      questionProgress.textContent = t("quizProgress", { index, count });

      let q;
      const pool = deck.questions;
      if (pool.length > 1) {
        do {
          q = pool[Math.floor(Math.random() * pool.length)];
        } while (q.id === lastQuestionId);
      } else {
        q = pool[0];
      }
      lastQuestionId = q.id;

      const order = q.options.map((text, i) => ({ text, correct: i === q.correctIndex }));
      shuffle(order);

      questionText.textContent = q.question;
      questionFeedback.textContent = "";
      questionOptions.innerHTML = "";
      nextQuestionBtn.classList.add("hidden");
      for (const opt of order) {
        const btn = document.createElement("button");
        btn.textContent = opt.text;
        btn.addEventListener("click", () => handleAnswer(opt.correct, btn, order, q));
        questionOptions.appendChild(btn);
      }
      showPanel(null);
      overlayQuestion.classList.remove("hidden");
    }

    function handleAnswer(isCorrect, btn, order, q) {
      const buttons = [...questionOptions.children];
      buttons.forEach((b) => (b.disabled = true));
      window.Storage.recordAnswer(deck.id, q.id, isCorrect);

      if (isCorrect) {
        correct++;
        addChips(deck.id, CHIP_REWARD);
        window.Coins.awardForCorrectAnswer();
        renderChipsDisplay();
        btn.classList.add("correct");
        questionFeedback.textContent = t("answerCorrectChips", { reward: CHIP_REWARD });
        questionFeedback.style.color = "#4ade80";
      } else {
        btn.classList.add("incorrect");
        const correctIdx = order.findIndex((o) => o.correct);
        buttons[correctIdx].classList.add("correct");
        questionFeedback.textContent = t("answerWrongWithAnswer", { answer: q.options[q.correctIndex] });
        questionFeedback.style.color = "#f87171";
      }

      nextQuestionBtn.classList.remove("hidden");
      nextQuestionBtn.onclick = () => {
        nextQuestionBtn.classList.add("hidden");
        nextQuestion();
      };
    }

    nextQuestion();
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  dealBtn.addEventListener("click", deal);
  hitBtn.addEventListener("click", hit);
  standBtn.addEventListener("click", stand);
  doubleBtn.addEventListener("click", double);

  resetChips(deck.id, 0);
  renderChipsDisplay();
  runChipsQuiz(QUIZ_LENGTH);
}
