// Utvalgte kjerneelementer fra LK20 (Kunnskapsløftet 2020), hentet fra
// udir.no sine offisielle læreplansider. Dette er IKKE en fullstendig
// gjengivelse av læreplanen — bare kjerneelementene (hovedtemaene) for et
// utvalg vanlige fag, ment som raske utgangspunkt for KI-prompten.
// Kilde: udir.no/lk20/<fagkode>/om-faget/kjerneelementer

window.LK20 = (function () {
  const LEVELS = [
    { id: "ungdomsskole", nameNb: "Ungdomsskole (8.–10. trinn)", nameEn: "Lower secondary (grades 8–10)" },
    { id: "vgo", nameNb: "Videregående (Vg1–Vg3)", nameEn: "Upper secondary (Vg1–Vg3)" },
  ];

  const SUBJECTS = [
    {
      id: "norsk",
      nameNb: "Norsk",
      nameEn: "Norwegian",
      levels: ["ungdomsskole", "vgo"],
      code: "NOR01-06",
      topics: [
        { nb: "Tekst i kontekst", en: "Text in context", descNb: "Lese tekster for å oppleve, bli engasjert, undre seg, lære og få innsikt i andre menneskers tanker og livsbetingelser." },
        { nb: "Kritisk tilnærming til tekst", en: "Critical approach to text", descNb: "Reflektere kritisk over påvirkningskraft og troverdighet i tekster, og bruke språklige og retoriske virkemidler." },
        { nb: "Muntlig kommunikasjon", en: "Oral communication", descNb: "Muntlig uttrykking, og å lytte til og bygge på andres innspill i faglige samtaler." },
        { nb: "Skriftlig tekstskaping", en: "Written text creation", descNb: "Skrive på hovedmål og sidemål i ulike sjangre og for ulike formål." },
        { nb: "Språket som system og mulighet", en: "Language as system and possibility", descNb: "Kunnskap om grammatiske og estetiske sider ved språket, og å beherske språk- og sjangernormer." },
        { nb: "Språklig mangfold", en: "Linguistic diversity", descNb: "Kunnskap om dagens språksituasjon i Norge, og å forstå egen og andres språklige situasjon." },
      ],
    },
    {
      id: "matematikk",
      nameNb: "Matematikk",
      nameEn: "Mathematics",
      levels: ["ungdomsskole", "vgo"],
      code: "MAT01-05",
      topics: [
        { nb: "Utforsking og problemløsning", en: "Exploration and problem solving", descNb: "Utforske mønster og løse problemer systematisk, med vekt på strategier og framgangsmåter." },
        { nb: "Modellering og anvendelser", en: "Modelling and applications", descNb: "Beskrive virkeligheten i matematisk språk og vurdere kritisk om modeller er gyldige." },
        { nb: "Resonnering og argumentasjon", en: "Reasoning and argumentation", descNb: "Forstå at matematiske regler har klare begrunnelser, og begrunne egne framgangsmåter." },
        { nb: "Representasjon og kommunikasjon", en: "Representation and communication", descNb: "Uttrykke matematiske begreper på ulike måter — konkret, visuelt og symbolsk." },
        { nb: "Abstraksjon og generalisering", en: "Abstraction and generalisation", descNb: "Gradvis formalisering fra konkrete beskrivelser til formelt symbolspråk." },
        { nb: "Tall, algebra, geometri og statistikk", en: "Numbers, algebra, geometry and statistics", descNb: "Tall og tallforståelse, algebra, funksjoner, geometri, statistikk og sannsynlighet." },
      ],
    },
    {
      id: "naturfag",
      nameNb: "Naturfag",
      nameEn: "Natural science",
      levels: ["ungdomsskole", "vgo"],
      code: "NAT01-04",
      topics: [
        { nb: "Naturvitenskapelige praksiser og tenkemåter", en: "Scientific practices and ways of thinking", descNb: "Oppleve naturfag som et praktisk og utforskende fag gjennom eksperimentering og modellering." },
        { nb: "Teknologi", en: "Technology", descNb: "Forstå, skape og bruke teknologi, inkludert programmering og modellering." },
        { nb: "Energi og materie", en: "Energy and matter", descNb: "Bruke teorier og begreper om energi, stoffer og partikler for å forklare den fysiske verden." },
        { nb: "Jorda og livet på jorda", en: "The Earth and life on Earth", descNb: "Hvordan jorda er dannet, og hvordan livet på jorda har utviklet seg." },
        { nb: "Kropp og helse", en: "Body and health", descNb: "Hvordan kroppens store og små systemer virker sammen, og hvordan man ivaretar egen helse." },
      ],
    },
    {
      id: "engelsk",
      nameNb: "Engelsk",
      nameEn: "English",
      levels: ["ungdomsskole", "vgo"],
      code: "ENG01-04",
      topics: [
        { nb: "Kommunikasjon", en: "Communication", descNb: "Skape mening med språk og bruke det i formelle og uformelle sammenhenger." },
        { nb: "Språklæring", en: "Language learning", descNb: "Utvikle språkbevissthet og kunnskap om engelsk som system." },
        { nb: "Møte med engelskspråklige tekster", en: "Encountering English-language texts", descNb: "Arbeide med varierte tekster som gir kunnskap om språklig og kulturelt mangfold." },
      ],
    },
    {
      id: "samfunnsfag",
      nameNb: "Samfunnsfag",
      nameEn: "Social studies",
      levels: ["ungdomsskole"],
      code: "SAF01-04",
      topics: [
        { nb: "Undring og utforsking", en: "Wonder and exploration", descNb: "Reflektere over hvordan kunnskap om samfunn blir til gjennom aktiv kunnskapssøking." },
        { nb: "Samfunnskritisk tenking og sammenhenger", en: "Critical thinking and connections", descNb: "Forstå sammenhenger mellom geografiske, historiske og nåtidige forhold." },
        { nb: "Demokratiforståing og deltaking", en: "Understanding democracy and participation", descNb: "Forstå forutsetninger for samarbeid, organisering og beslutninger i samfunnet." },
        { nb: "Bærekraftige samfunn", en: "Sustainable societies", descNb: "Hvordan geografiske forhold rammer inn hvordan behov dekkes og ressurser fordeles." },
        { nb: "Identitetsutvikling og fellesskap", en: "Identity development and community", descNb: "Innsikt i hvordan mennesker utvikler identitet og tilhørighet gjennom samhandling." },
      ],
    },
    {
      id: "samfunnskunnskap",
      nameNb: "Samfunnskunnskap",
      nameEn: "Civics",
      levels: ["vgo"],
      code: "SAK01-01",
      topics: [
        { nb: "Undring og utforsking", en: "Wonder and exploration", descNb: "Reflektere over og vurdere kritisk hvordan kunnskap om samfunnet blir til." },
        { nb: "Perspektivmangfold og samfunnskritisk tenking", en: "Diverse perspectives and critical thinking", descNb: "Vurdere samfunnsforhold fra ulike perspektiv og stille spørsmål til maktstrukturer." },
        { nb: "Medborgerskap og bærekraftig utvikling", en: "Citizenship and sustainable development", descNb: "Demokratisk deltaking, bærekraftig utvikling og handlingskompetanse." },
        { nb: "Identitet og livsmestring", en: "Identity and life skills", descNb: "Identitetsutvikling og samhandling med andre." },
      ],
    },
    {
      id: "krle",
      nameNb: "KRLE",
      nameEn: "Religion, Philosophies of Life and Ethics",
      levels: ["ungdomsskole"],
      code: "RLE01-03",
      topics: [
        { nb: "Kjennskap til religioner og livssyn", en: "Knowledge of religions and worldviews", descNb: "Kunnskap om og forståelse for kristendom og andre religioner og livssyn." },
        { nb: "Utforsking med ulike metoder", en: "Exploration using different methods", descNb: "Undersøke religiøse fenomener gjennom varierte tilnærminger og kildekritikk." },
        { nb: "Eksistensielle spørsmål og svar", en: "Existential questions and answers", descNb: "Ulike måter mennesker har nærmet seg spørsmål om mening, identitet og virkelighetsbilde." },
        { nb: "Å ta andres perspektiv", en: "Taking others' perspective", descNb: "Forstå andre gjennom dialog, uavhengig av religiøs eller kulturell bakgrunn." },
        { nb: "Etisk refleksjon", en: "Ethical reflection", descNb: "Identifisere etiske dilemmaer og drøfte moralske spørsmål." },
      ],
    },
    {
      id: "historie",
      nameNb: "Historie",
      nameEn: "History",
      levels: ["vgo"],
      code: "HIS01-03",
      topics: [
        { nb: "Historiebevissthet", en: "Historical awareness", descNb: "Forstå seg selv som historieskapt og historieskapende, med en fortid, nåtid og framtid." },
        { nb: "Utforskende historie og kildekritikk", en: "Exploratory history and source criticism", descNb: "Undersøke fortiden kritisk og vurdere hvordan historisk kunnskap blir til." },
        { nb: "Historisk empati og perspektiver", en: "Historical empathy and perspectives", descNb: "Forstå menneskers handlinger i fortiden som resultat av datidens valg og vilkår." },
        { nb: "Mennesker og samfunn i fortid, nåtid og framtid", en: "People and society past, present and future", descNb: "Innsikt i viktige temaer og perioder i norsk og internasjonal historie." },
      ],
    },
  ];

  function getLevels() {
    return LEVELS;
  }

  function getSubjectsForLevel(levelId) {
    return SUBJECTS.filter((s) => s.levels.includes(levelId));
  }

  function getSubject(subjectId) {
    return SUBJECTS.find((s) => s.id === subjectId) || null;
  }

  function localizedName(item) {
    return window.I18n.getLocale() === "en" ? item.nameEn : item.nameNb;
  }

  function localizedTopic(topic) {
    return window.I18n.getLocale() === "en" ? topic.en : topic.nb;
  }

  return { getLevels, getSubjectsForLevel, getSubject, localizedName, localizedTopic, SUBJECTS };
})();
