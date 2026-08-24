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
const panelBroke = document.getElementById("panel-broke");
const overlayQuestion = document.getElementById("overlay-question");
const overlayEmpty = document.getElementById("overlay-empty");

const betButtonsEl = document.getElementById("bet-buttons");
const betInput = document.getElementById("bet-input");
const betChipsAvailable = document.getElementById("bet-chips-available");
const dealBtn = document.getElementById("deal-btn");
const hitBtn = document.getElementById("hit-btn");
const standBtn = document.getElementById("stand-btn");
const continueBtn = document.getElementById("continue-btn");
const resolvedText = document.getElementById("resolved-text");
const bailoutBtn = document.getElementById("bailout-btn");

const questionProgress = document.getElementById("question-progress");
const questionText = document.getElementById("question-text");
const questionOptions = document.getElementById("question-options");
const questionFeedback = document.getElementById("question-feedback");

const MIN_BET = 5;
const BAILOUT_CHIPS = 50;
const CHIP_REWARD = 20;
const SUITS = [
  { symbol: "♠", color: "black" },
  { symbol: "♥", color: "red" },
  { symbol: "♦", color: "red" },
  { symbol: "♣", color: "black" },
];
const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

if (!deck || !deck.questions || deck.questions.length === 0) {
  overlayEmpty.classList.remove("hidden");
  panelBetting.classList.add("hidden");
} else {
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
      div.textContent = `${card.rank}${card.suit}`;
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
    [panelBetting, panelPlaying, panelResolved, panelBroke].forEach((p) =>
      p.classList.add("hidden")
    );
    panel.classList.remove("hidden");
  }

  function goToBetting() {
    dealerCardsEl.innerHTML = "";
    playerCardsEl.innerHTML = "";
    dealerTotalEl.textContent = "";
    playerTotalEl.textContent = "";
    const chips = renderChipsDisplay();
    if (chips < MIN_BET) {
      showPanel(panelBroke);
      return;
    }
    betChipsAvailable.textContent = chips;
    betInput.max = chips;
    if (Number(betInput.value) > chips) betInput.value = Math.min(chips, 10);
    renderBetButtons(chips);
    showPanel(panelBetting);
  }

  function renderBetButtons(chips) {
    betButtonsEl.innerHTML = "";
    const presets = [5, 10, 25, 50].filter((v) => v <= chips);
    for (const amount of presets) {
      const btn = document.createElement("button");
      btn.className = "secondary";
      btn.textContent = amount;
      btn.addEventListener("click", () => (betInput.value = amount));
      betButtonsEl.appendChild(btn);
    }
    const allIn = document.createElement("button");
    allIn.className = "secondary";
    allIn.textContent = "Alt inn";
    allIn.addEventListener("click", () => (betInput.value = chips));
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
    bjMessage.textContent = `Innsats: ${bet} chips`;

    if (isBlackjack(playerHand)) {
      finishHand();
    } else {
      showPanel(panelPlaying);
    }
  }

  function hit() {
    playerHand.push(drawCard());
    renderHands({ hideDealerHole: true });
    if (handValue(playerHand) > 21) {
      finishHand();
    }
  }

  function stand() {
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
    let questionCount = 1;

    if (outcome === "blackjack") {
      payout = currentBet + Math.floor(currentBet * 1.5);
      text = `🂡 Blackjack! Du vinner ${payout - currentBet} chips.`;
      questionCount = randInt(1, 3);
    } else if (outcome === "win") {
      payout = currentBet * 2;
      text = `🎉 Du vant! +${payout - currentBet} chips.`;
      questionCount = randInt(1, 3);
    } else if (outcome === "push") {
      payout = currentBet;
      text = "🤝 Uavgjort. Du får innsatsen tilbake.";
      questionCount = 1;
    } else if (outcome === "bust") {
      payout = 0;
      text = `💥 Bust! Du tapte ${currentBet} chips.`;
      questionCount = randInt(3, 5);
    } else {
      payout = 0;
      text = `😬 Du tapte ${currentBet} chips.`;
      questionCount = randInt(3, 5);
    }

    if (payout > 0) addChips(deck.id, payout);
    renderChipsDisplay();

    resolvedText.textContent = `${text} Nå venter ${questionCount} spørsmål — riktig svar gir ${CHIP_REWARD} chips hver.`;
    showPanel(panelResolved);
    continueBtn.onclick = () => startQuestionRound(questionCount);
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function startQuestionRound(count) {
    let index = 0;
    let correct = 0;

    function nextQuestion() {
      if (index >= count) {
        overlayQuestion.classList.add("hidden");
        bjMessage.textContent = `Runde ferdig: ${correct}/${count} riktige, +${correct * CHIP_REWARD} chips.`;
        goToBetting();
        return;
      }
      index++;
      questionProgress.textContent = `Spørsmål ${index} av ${count}`;

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
      for (const opt of order) {
        const btn = document.createElement("button");
        btn.textContent = opt.text;
        btn.addEventListener("click", () => handleAnswer(opt.correct, btn, order, q));
        questionOptions.appendChild(btn);
      }
      overlayQuestion.classList.remove("hidden");
    }

    function handleAnswer(isCorrect, btn, order, q) {
      const buttons = [...questionOptions.children];
      buttons.forEach((b) => (b.disabled = true));

      if (isCorrect) {
        correct++;
        addChips(deck.id, CHIP_REWARD);
        renderChipsDisplay();
        btn.classList.add("correct");
        questionFeedback.textContent = `✅ Riktig! +${CHIP_REWARD} chips`;
        questionFeedback.style.color = "#4ade80";
      } else {
        btn.classList.add("incorrect");
        const correctIdx = order.findIndex((o) => o.correct);
        buttons[correctIdx].classList.add("correct");
        questionFeedback.textContent = `❌ Feil! Riktig svar: ${q.options[q.correctIndex]}`;
        questionFeedback.style.color = "#f87171";
      }

      setTimeout(nextQuestion, 1100);
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

  function bailout() {
    let index = 0;
    const count = 1;
    let lastId = null;

    const pool = deck.questions;
    const q = pool[Math.floor(Math.random() * pool.length)];
    const order = q.options.map((text, i) => ({ text, correct: i === q.correctIndex }));
    shuffle(order);

    questionProgress.textContent = "Bonusspørsmål";
    questionText.textContent = q.question;
    questionFeedback.textContent = "";
    questionOptions.innerHTML = "";
    for (const opt of order) {
      const btn = document.createElement("button");
      btn.textContent = opt.text;
      btn.addEventListener("click", () => {
        const buttons = [...questionOptions.children];
        buttons.forEach((b) => (b.disabled = true));
        if (opt.correct) {
          addChips(deck.id, BAILOUT_CHIPS);
          btn.classList.add("correct");
          questionFeedback.textContent = `✅ Riktig! +${BAILOUT_CHIPS} chips`;
          questionFeedback.style.color = "#4ade80";
        } else {
          const correctIdx = order.findIndex((o) => o.correct);
          buttons[correctIdx].classList.add("correct");
          btn.classList.add("incorrect");
          questionFeedback.textContent = `❌ Feil! Prøv igjen om litt.`;
          questionFeedback.style.color = "#f87171";
        }
        setTimeout(() => {
          overlayQuestion.classList.add("hidden");
          goToBetting();
        }, 1100);
      });
      questionOptions.appendChild(btn);
    }
    overlayQuestion.classList.remove("hidden");
  }

  dealBtn.addEventListener("click", deal);
  hitBtn.addEventListener("click", hit);
  standBtn.addEventListener("click", stand);
  bailoutBtn.addEventListener("click", bailout);

  goToBetting();
}
