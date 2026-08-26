const t = window.I18n.t;
const grid = document.getElementById("shop-grid");
const coinBadgeEl = document.getElementById("coin-badge");

window.I18n.applyTranslations();
window.I18n.mountSwitcher(document.getElementById("lang-switcher"));
window.Theme.applyTheme();
document.addEventListener("localechange", () => {
  window.I18n.applyTranslations();
  render();
});

function render() {
  window.Coins.mountBadge(coinBadgeEl);
  grid.innerHTML = "";
  const balance = window.Coins.getBalance();
  const active = window.Theme.getActive();

  for (const theme of window.Theme.THEMES) {
    const owned = window.Theme.isOwned(theme.id);
    const isActive = active === theme.id;

    const card = document.createElement("div");
    card.className = "shop-card" + (isActive ? " active" : "");

    const swatch = document.createElement("div");
    swatch.className = "shop-swatch";
    swatch.style.background = `linear-gradient(90deg, ${theme.swatch.join(", ")})`;

    const name = document.createElement("p");
    name.className = "shop-card-name";
    name.textContent = window.Theme.getThemeName(theme);

    const price = document.createElement("p");
    price.className = "shop-card-price";
    price.textContent = theme.price === 0 ? t("shopFree") : `🪙 ${theme.price}`;

    const btn = document.createElement("button");
    if (isActive) {
      btn.textContent = t("shopInUse");
      btn.className = "owned-active";
      btn.disabled = true;
    } else if (owned) {
      btn.textContent = t("shopUseBtn");
      btn.addEventListener("click", () => {
        window.Theme.setActive(theme.id);
        render();
      });
    } else if (balance < theme.price) {
      btn.textContent = t("shopTooExpensive");
      btn.className = "locked";
      btn.disabled = true;
    } else {
      btn.textContent = t("shopBuyBtn");
      btn.addEventListener("click", () => {
        const result = window.Theme.buy(theme.id);
        if (result.ok) render();
      });
    }

    card.append(swatch, name, price, btn);
    grid.appendChild(card);
  }
}

render();
