// Globalt design-system: 10 kjøpbare fargetemaer som gjelder for hele
// siden (forsiden og alle spillmoduser), betalt med mynter fra Coins.

window.Theme = (function () {
  const KEY = "quizspill_theme_v1";

  const THEMES = [
    { id: "standard", nameNb: "Standard", nameEn: "Standard", price: 0, swatch: ["#4f46e5", "#f5b83d"] },
    { id: "ocean", nameNb: "Havblå", nameEn: "Ocean Blue", price: 50, swatch: ["#0891b2", "#22d3ee"] },
    { id: "forest", nameNb: "Skogsgrønn", nameEn: "Forest Green", price: 100, swatch: ["#15803d", "#84cc16"] },
    { id: "sunset", nameNb: "Solnedgang", nameEn: "Sunset", price: 150, swatch: ["#ea580c", "#f43f5e"] },
    { id: "grape", nameNb: "Lilla Drøm", nameEn: "Grape Dream", price: 200, swatch: ["#7c3aed", "#d946ef"] },
    { id: "dark", nameNb: "Mørk Modus", nameEn: "Dark Mode", price: 300, swatch: ["#6366f1", "#111827"] },
    { id: "retro", nameNb: "Retro Arkade", nameEn: "Retro Arcade", price: 400, swatch: ["#f59e0b", "#111111"] },
    { id: "neon", nameNb: "Neon Cyber", nameEn: "Neon Cyber", price: 500, swatch: ["#ff2fd0", "#00f0ff"] },
    { id: "gold", nameNb: "Gull", nameEn: "Gold", price: 700, swatch: ["#caa53d", "#1a1a1a"] },
    { id: "legendary", nameNb: "Legendarisk", nameEn: "Legendary", price: 1000, swatch: ["#ff5f6d", "#7c3aed", "#22d3ee"] },
  ];

  function load() {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { owned: ["standard"], active: "standard" };
    try {
      const data = JSON.parse(raw);
      if (!Array.isArray(data.owned)) data.owned = ["standard"];
      if (!data.owned.includes("standard")) data.owned.push("standard");
      if (!data.active) data.active = "standard";
      return data;
    } catch {
      return { owned: ["standard"], active: "standard" };
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function getThemeName(theme) {
    return window.I18n.getLocale() === "en" ? theme.nameEn : theme.nameNb;
  }

  function getOwned() {
    return load().owned;
  }

  function isOwned(id) {
    return load().owned.includes(id);
  }

  function getActive() {
    return load().active;
  }

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", getActive());
  }

  function setActive(id) {
    const data = load();
    if (!data.owned.includes(id)) return false;
    data.active = id;
    save(data);
    applyTheme();
    return true;
  }

  function buy(id) {
    const data = load();
    if (data.owned.includes(id)) return { ok: false, reason: "owned" };
    const theme = THEMES.find((t) => t.id === id);
    if (!theme) return { ok: false, reason: "unknown" };
    if (!window.Coins.spendCoins(theme.price)) {
      return { ok: false, reason: "insufficient" };
    }
    data.owned.push(id);
    data.active = id;
    save(data);
    applyTheme();
    return { ok: true };
  }

  return { THEMES, getThemeName, getOwned, isOwned, getActive, applyTheme, setActive, buy };
})();
