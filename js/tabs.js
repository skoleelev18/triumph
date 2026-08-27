// Generisk fane-system: en .tab-bar med .tab-btn (data-tab="panel-id")
// styrer synlighet på søsken-panelene med matchende id.

(function () {
  function setupTabBar(bar) {
    const buttons = [...bar.querySelectorAll(".tab-btn")];
    const panelIds = buttons.map((b) => b.dataset.tab);
    const panels = panelIds.map((id) => document.getElementById(id)).filter(Boolean);

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        panels.forEach((panel) => {
          panel.classList.toggle("hidden", panel.id !== btn.dataset.tab);
        });
      });
    });
  }

  document.querySelectorAll(".tab-bar").forEach(setupTabBar);
})();
