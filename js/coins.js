// Global valuta (mynter) — uavhengig av tema-spesifikke Blackjack-sjetonger.
// Tjenes på tvers av alle spillmoduser, brukes i design-butikken.

window.Coins = (function () {
  const KEY = "quizspill_coins_v1";
  const EARN_PER_CORRECT = 5;

  function getBalance() {
    const raw = localStorage.getItem(KEY);
    const n = raw === null ? 0 : Number(raw);
    return Number.isFinite(n) ? n : 0;
  }

  function addCoins(amount) {
    const next = Math.max(0, getBalance() + amount);
    localStorage.setItem(KEY, String(next));
    document.dispatchEvent(new CustomEvent("coinschange", { detail: { balance: next } }));
    return next;
  }

  function spendCoins(amount) {
    const balance = getBalance();
    if (balance < amount) return false;
    addCoins(-amount);
    return true;
  }

  function awardForCorrectAnswer() {
    return addCoins(EARN_PER_CORRECT);
  }

  function mountBadge(container) {
    if (!container) return;
    container.innerHTML = "";
    const badge = document.createElement("div");
    badge.className = "coin-badge";
    const icon = document.createElement("span");
    icon.className = "coin-badge-icon";
    icon.textContent = "🪙";
    const amount = document.createElement("span");
    amount.textContent = getBalance();
    badge.append(icon, amount);
    container.appendChild(badge);
    document.addEventListener("coinschange", (e) => {
      amount.textContent = e.detail.balance;
    });
  }

  return { getBalance, addCoins, spendCoins, awardForCorrectAnswer, mountBadge, EARN_PER_CORRECT };
})();
