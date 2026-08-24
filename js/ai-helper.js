// Bygger en ferdig prompt du kan lime inn i en KI-chat (ChatGPT, Claude, Gemini, ...)
// og tolker JSON-svaret du limer tilbake inn i spillet.

window.AIHelper = (function () {

function buildPrompt({ topic, count, level, context }) {
  const t = window.I18n.t;
  const levelText =
    {
      lett: t("aiPromptLevelEasy"),
      middels: t("aiPromptLevelMedium"),
      vanskelig: t("aiPromptLevelHard"),
    }[level] || t("aiPromptLevelMedium");

  const contextLine = context ? t("aiPromptContextLine", { context }) : "";

  return t("aiPromptText", {
    count,
    topic,
    level: levelText,
    contextLine,
    languageName: t("languageName"),
  });
}

function parseAIResponse(text) {
  const t = window.I18n.t;
  if (!text || !text.trim()) {
    throw new Error(t("aiPromptFillFirst"));
  }
  // Trekk ut JSON selv om KI-en har pakket det inn i ```json ... ``` eller skrevet tekst rundt.
  let candidate = text.trim();
  const fenced = candidate.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    candidate = fenced[1].trim();
  } else {
    const start = candidate.indexOf("[");
    const end = candidate.lastIndexOf("]");
    if (start !== -1 && end !== -1 && end > start) {
      candidate = candidate.slice(start, end + 1);
    }
  }

  let parsed;
  try {
    parsed = JSON.parse(candidate);
  } catch {
    throw new Error(t("aiPromptParseError"));
  }

  if (!Array.isArray(parsed)) {
    throw new Error(t("aiPromptExpectedArray"));
  }
  return parsed;
}

return { buildPrompt, parseAIResponse };

})();
