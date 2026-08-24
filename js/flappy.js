const { getDeck, setHighScore } = window.Storage;

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;
const GROUND_H = 44;

const params = new URLSearchParams(location.search);
const deckId = params.get("deck");
const deck = deckId ? getDeck(deckId) : null;

const scoreDisplay = document.getElementById("score-display");
const highscoreDisplay = document.getElementById("highscore-display");
const deckTitleEl = document.getElementById("deck-title");
const overlayStart = document.getElementById("overlay-start");
const overlayQuestion = document.getElementById("overlay-question");
const overlayGameover = document.getElementById("overlay-gameover");
const overlayEmpty = document.getElementById("overlay-empty");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const questionText = document.getElementById("question-text");
const questionOptions = document.getElementById("question-options");
const questionFeedback = document.getElementById("question-feedback");
const gameoverSummary = document.getElementById("gameover-summary");

if (!deck || !deck.questions || deck.questions.length === 0) {
  overlayEmpty.classList.remove("hidden");
  overlayStart.classList.add("hidden");
} else {
  deckTitleEl.textContent = deck.name;
  highscoreDisplay.textContent = deck.highScore || 0;
  initGame();
}

function initGame() {
  const GRAVITY = 1500;
  const FLAP_VELOCITY = -430;
  const PIPE_SPEED = 190;
  const PIPE_WIDTH = 70;
  const PIPE_GAP = 190;
  const PIPE_SPACING = 260;
  const BIRD_X = 110;
  const BIRD_R = 15;

  let state = "start"; // start | playing | question | gameover
  let bird = { y: H / 2, vy: 0 };
  let pipes = [];
  let score = 0;
  let lastTime = null;
  let distanceSinceSpawn = 0;
  let lastQuestionId = null;
  let flashTimer = 0;

  function resetGame() {
    bird = { y: H / 2, vy: 0 };
    pipes = [];
    score = 0;
    distanceSinceSpawn = 0;
    lastTime = null;
    scoreDisplay.textContent = "0";
    spawnPipe();
  }

  function spawnPipe() {
    const margin = 90;
    const gapCenter = margin + Math.random() * (H - GROUND_H - margin * 2);
    pipes.push({
      x: W + PIPE_WIDTH,
      gapCenter,
      passed: false,
    });
  }

  function flap() {
    if (state === "start") {
      startGame();
      return;
    }
    if (state === "gameover") {
      return;
    }
    if (state === "playing") {
      bird.vy = FLAP_VELOCITY;
    }
  }

  function startGame() {
    resetGame();
    state = "playing";
    overlayStart.classList.add("hidden");
    overlayGameover.classList.add("hidden");
    requestAnimationFrame(loop);
  }

  function askQuestion() {
    state = "question";
    let pool = deck.questions;
    let q;
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
      btn.classList.add("correct");
      questionFeedback.textContent = "✅ Riktig! Fortsetter...";
      questionFeedback.style.color = "#4ade80";
      setTimeout(() => {
        overlayQuestion.classList.add("hidden");
        bird.vy = 0;
        state = "playing";
        lastTime = null;
        requestAnimationFrame(loop);
      }, 800);
    } else {
      btn.classList.add("incorrect");
      const correctIdx = order.findIndex((o) => o.correct);
      buttons[correctIdx].classList.add("correct");
      questionFeedback.textContent = `❌ Feil! Riktig svar: ${q.options[q.correctIndex]}`;
      questionFeedback.style.color = "#f87171";
      setTimeout(() => {
        overlayQuestion.classList.add("hidden");
        endGame();
      }, 1400);
    }
  }

  function endGame() {
    state = "gameover";
    setHighScore(deck.id, score);
    const newHigh = getDeck(deck.id)?.highScore || score;
    highscoreDisplay.textContent = newHigh;
    gameoverSummary.textContent =
      score >= newHigh && score > 0
        ? `Du fikk ${score} poeng — ny rekord! 🎉`
        : `Du fikk ${score} poeng. Rekord: ${newHigh}.`;
    overlayGameover.classList.remove("hidden");
  }

  function update(dt) {
    bird.vy += GRAVITY * dt;
    bird.y += bird.vy * dt;

    if (bird.y - BIRD_R < 0) {
      bird.y = BIRD_R;
      bird.vy = 0;
    }
    if (bird.y + BIRD_R > H - GROUND_H) {
      bird.y = H - GROUND_H - BIRD_R;
      endGame();
      return;
    }

    distanceSinceSpawn += PIPE_SPEED * dt;
    if (distanceSinceSpawn >= PIPE_SPACING) {
      distanceSinceSpawn = 0;
      spawnPipe();
    }

    for (const pipe of pipes) {
      pipe.x -= PIPE_SPEED * dt;

      const withinX = BIRD_X + BIRD_R > pipe.x && BIRD_X - BIRD_R < pipe.x + PIPE_WIDTH;
      const gapTop = pipe.gapCenter - PIPE_GAP / 2;
      const gapBottom = pipe.gapCenter + PIPE_GAP / 2;
      const withinGap = bird.y - BIRD_R > gapTop && bird.y + BIRD_R < gapBottom;
      if (withinX && !withinGap) {
        endGame();
        return;
      }

      if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_X) {
        pipe.passed = true;
        score++;
        scoreDisplay.textContent = score;
        askQuestion();
        return;
      }
    }

    pipes = pipes.filter((p) => p.x > -PIPE_WIDTH - 10);
    if (flashTimer > 0) flashTimer -= dt;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, "#7ec8e3");
    skyGrad.addColorStop(1, "#bfe9ff");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#2f9e44";
    for (const pipe of pipes) {
      const gapTop = pipe.gapCenter - PIPE_GAP / 2;
      const gapBottom = pipe.gapCenter + PIPE_GAP / 2;
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, gapTop);
      ctx.fillRect(pipe.x, gapBottom, PIPE_WIDTH, H - GROUND_H - gapBottom);
      ctx.fillStyle = "#237032";
      ctx.fillRect(pipe.x - 4, gapTop - 22, PIPE_WIDTH + 8, 22);
      ctx.fillRect(pipe.x - 4, gapBottom, PIPE_WIDTH + 8, 22);
      ctx.fillStyle = "#2f9e44";
    }

    ctx.fillStyle = "#d9a441";
    ctx.fillRect(0, H - GROUND_H, W, GROUND_H);
    ctx.fillStyle = "#b9832f";
    ctx.fillRect(0, H - GROUND_H, W, 8);

    ctx.save();
    ctx.translate(BIRD_X, bird.y);
    const angle = Math.max(-0.5, Math.min(0.9, bird.vy / 700));
    ctx.rotate(angle);
    ctx.fillStyle = "#ffd43b";
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e8590c";
    ctx.beginPath();
    ctx.moveTo(BIRD_R - 2, 0);
    ctx.lineTo(BIRD_R + 10, -4);
    ctx.lineTo(BIRD_R + 10, 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#1c2333";
    ctx.beginPath();
    ctx.arc(5, -5, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function loop(ts) {
    if (state !== "playing") return;
    if (lastTime === null) lastTime = ts;
    let dt = (ts - lastTime) / 1000;
    lastTime = ts;
    dt = Math.min(dt, 0.033);

    update(dt);
    draw();

    if (state === "playing") {
      requestAnimationFrame(loop);
    }
  }

  // Initial idle draw
  draw();

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
      e.preventDefault();
      flap();
    }
  });
  canvas.addEventListener("mousedown", flap);
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    flap();
  });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
