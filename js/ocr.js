// Leser tekst ut av et bilde (f.eks. et foto av en lærebokside) direkte i
// nettleseren med Tesseract.js — ingen server involvert. Kvaliteten
// avhenger av bildet: rette, tydelige foto av trykt tekst fungerer best.

(function () {
  const scanBtn = document.getElementById("ocr-scan-btn");
  const fileInput = document.getElementById("ocr-file-input");
  const statusEl = document.getElementById("ocr-status");
  const reviewBlock = document.getElementById("ocr-review-block");
  const reviewText = document.getElementById("ocr-review-text");
  const useBtn = document.getElementById("ocr-use-btn");

  if (!scanBtn) return;

  const t = () => window.I18n.t;

  scanBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    fileInput.value = "";
    if (!file) return;

    reviewBlock.classList.add("hidden");
    statusEl.classList.remove("hidden");
    statusEl.classList.remove("error");
    statusEl.textContent = t()("ocrStarting");

    try {
      const result = await Tesseract.recognize(file, "nor", {
        logger: (info) => {
          if (info.status === "recognizing text") {
            statusEl.textContent = t()("ocrProgress", { percent: Math.round(info.progress * 100) });
          } else {
            statusEl.textContent = t()("ocrWorking");
          }
        },
      });

      const text = result.data.text.trim();
      if (!text) {
        statusEl.textContent = t()("ocrEmpty");
        return;
      }

      statusEl.classList.add("hidden");
      reviewText.value = text;
      reviewBlock.classList.remove("hidden");
    } catch {
      statusEl.classList.add("error");
      statusEl.textContent = t()("ocrError");
    }
  });

  useBtn.addEventListener("click", () => {
    const aiContext = document.getElementById("ai-context");
    if (!aiContext) return;
    aiContext.value = reviewText.value.trim();
    reviewBlock.classList.add("hidden");
    aiContext.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();
