// Koder/dekoder et tema til en URL-trygg base64-streng, slik at hele
// temaet kan deles via en lenke uten noen backend. Ulempe: lange temaer
// gir lange lenker (se hint i UI om å bruke fil-eksport for store temaer).

window.Share = (function () {
  function encodeDeck(deck) {
    const payload = {
      name: deck.name,
      questions: deck.questions.map(({ question, options, correctIndex }) => ({
        question,
        options,
        correctIndex,
      })),
    };
    const json = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(json);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function decodeDeck(encoded) {
    let str = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    const binary = atob(str);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  }

  function buildShareUrl(deck) {
    const url = new URL(location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("import", encodeDeck(deck));
    return url.toString();
  }

  return { encodeDeck, decodeDeck, buildShareUrl };
})();
