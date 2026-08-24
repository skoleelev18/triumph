// Bygger en ferdig prompt du kan lime inn i en KI-chat (ChatGPT, Claude, Gemini, ...)
// og tolker JSON-svaret du limer tilbake inn i spillet.

window.AIHelper = (function () {

function buildPrompt({ topic, count, level, context }) {
  const levelText =
    {
      lett: "enkelt/grunnleggende nivå",
      middels: "middels vanskelighetsgrad",
      vanskelig: "avansert/vanskelig nivå",
    }[level] || "middels vanskelighetsgrad";

  const contextLine = context
    ? `Ekstra kontekst / pensum å ta hensyn til: ${context}\n`
    : "";

  return `Lag ${count} spørsmål med flervalgssvar om temaet "${topic}", ment som øving til en prøve/eksamen/presentasjon på ${levelText}.
${contextLine}Krav:
- Hvert spørsmål skal ha nøyaktig 4 svaralternativer.
- Bare ett alternativ skal være riktig.
- Spørsmålene skal være korte nok til å leses raskt midt i et spill.
- Svar KUN med gyldig JSON, ingen forklaringstekst før eller etter, i nøyaktig dette formatet:

[
  {
    "question": "Spørsmålstekst her?",
    "options": ["Alternativ A", "Alternativ B", "Alternativ C", "Alternativ D"],
    "correctIndex": 0
  }
]

"correctIndex" er indeksen (0-3) i "options"-listen som er riktig svar.`;
}

function parseAIResponse(text) {
  if (!text || !text.trim()) {
    throw new Error("Lim inn KI-svaret først.");
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
    throw new Error(
      "Klarte ikke å tolke svaret som JSON. Sjekk at du limte inn hele svaret fra KI-en."
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Forventet en liste med spørsmål (JSON-array).");
  }
  return parsed;
}

return { buildPrompt, parseAIResponse };

})();
