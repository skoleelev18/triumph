// Utvalgte kjerneelementer fra LK20 (Kunnskapsløftet 2020), hentet fra
// udir.no sine offisielle læreplansider. Dette er IKKE en fullstendig
// gjengivelse av læreplanen — bare kjerneelementene (hovedtemaene) for et
// utvalg vanlige fag, ment som raske utgangspunkt for KI-prompten.
// Kilde: udir.no/lk20/<fagkode>/om-faget/kjerneelementer
//
// Utvidbarhet: "vgo"-fagene har et `programs`-felt (f.eks.
// "studiespesialiserende"). I dag viser vi bare studiespesialiserende
// programfag på videregående, men for å legge til en ny utdanningslinje
// (f.eks. yrkesfag) eller egne matematikkfag (1P/1T/R1/R2 osv.) senere:
// 1) legg til nye fag-objekter i SUBJECTS med riktig `programs`-verdi,
// 2) bygg ev. en programvelger i UI-et som filtrerer på `programs` i
//    tillegg til `levels`, slik getSubjectsForLevel gjør i dag.

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
      programs: ["studiespesialiserende"],
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
      // NB: MAT01-05 gjelder kun 1.-10. trinn, ikke videregående (der er
      // matematikk delt i egne fag som 1P/1T/R1/R2/S1/S2 osv.). Legg ev.
      // til disse som egne fag-objekter med programs-felt senere.
      levels: ["ungdomsskole"],
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
      programs: ["studiespesialiserende"],
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
      programs: ["studiespesialiserende"],
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
        { nb: "Demokratiforståelse og deltakelse", en: "Understanding democracy and participation", descNb: "Forstå forutsetninger for samarbeid, organisering og beslutninger i samfunnet." },
        { nb: "Bærekraftige samfunn", en: "Sustainable societies", descNb: "Hvordan geografiske forhold rammer inn hvordan behov dekkes og ressurser fordeles." },
        { nb: "Identitetsutvikling og fellesskap", en: "Identity development and community", descNb: "Innsikt i hvordan mennesker utvikler identitet og tilhørighet gjennom samhandling." },
      ],
    },
    {
      id: "samfunnskunnskap",
      nameNb: "Samfunnskunnskap",
      nameEn: "Civics",
      levels: ["vgo"],
      programs: ["studiespesialiserende"],
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
      programs: ["studiespesialiserende"],
      code: "HIS01-03",
      topics: [
        { nb: "Historiebevissthet", en: "Historical awareness", descNb: "Forstå seg selv som historieskapt og historieskapende, med en fortid, nåtid og framtid." },
        { nb: "Utforskende historie og kildekritikk", en: "Exploratory history and source criticism", descNb: "Undersøke fortiden kritisk og vurdere hvordan historisk kunnskap blir til." },
        { nb: "Historisk empati og perspektiver", en: "Historical empathy and perspectives", descNb: "Forstå menneskers handlinger i fortiden som resultat av datidens valg og vilkår." },
        { nb: "Mennesker og samfunn i fortid, nåtid og framtid", en: "People and society past, present and future", descNb: "Innsikt i viktige temaer og perioder i norsk og internasjonal historie." },
      ],
    },
    {
      id: "biologi",
      nameNb: "Biologi",
      nameEn: "Biology",
      levels: ["vgo"],
      programs: ["studiespesialiserende"],
      code: "BIO01-02",
      topics: [
        { nb: "Praksiser og tenkemåter i biologi", en: "Practices and ways of thinking in biology", descNb: "Hvordan naturvitenskapelige hypoteser, teorier, metoder og modeller utvikles og brukes i faget." },
        { nb: "Biologiske system", en: "Biological systems", descNb: "Oppbygging av celler, vev og organ og samspillet mellom dem, og økosystemene organismene lever i." },
        { nb: "Biologiske prosesser", en: "Biological processes", descNb: "Prosesser i og mellom celler, genetikk og fysiologi hos organismer, samt evolusjonære prosesser." },
        { nb: "Biologi i samfunnet", en: "Biology in society", descNb: "Hvordan biologisk kompetanse kan brukes til å forvalte naturen bærekraftig, og etiske spørsmål rundt bruk av biologisk kunnskap." },
      ],
    },
    {
      id: "kjemi",
      nameNb: "Kjemi",
      nameEn: "Chemistry",
      levels: ["vgo"],
      programs: ["studiespesialiserende"],
      code: "KJE01-02",
      topics: [
        { nb: "Praksiser og tenkemåter i kjemi", en: "Practices and ways of thinking in chemistry", descNb: "Hvordan naturvitenskapelige hypoteser, teorier, metoder og modeller i kjemi utvikles og brukes, koblet til eksperimentelt og utforskende arbeid." },
        { nb: "Kjemiske bindinger og strukturer", en: "Chemical bonds and structures", descNb: "Krefter mellom partikler og betydningen for sammensetning og egenskaper til stoffer." },
        { nb: "Kjemiske reaksjoner", en: "Chemical reactions", descNb: "Hvordan og hvorfor stoffer reagerer, inkludert reaksjonstyper, termodynamikk og reaksjonsfart." },
        { nb: "Anvendt kjemi", en: "Applied chemistry", descNb: "Bruke kjemikompetanse til å forstå hvordan kjemiske stoffer og prosesser påvirker mennesker og samfunn." },
      ],
    },
    {
      id: "fysikk",
      nameNb: "Fysikk",
      nameEn: "Physics",
      levels: ["vgo"],
      programs: ["studiespesialiserende"],
      code: "FYS01-02",
      topics: [
        { nb: "Praksiser og tenkemåter i fysikk", en: "Practices and ways of thinking in physics", descNb: "Hvordan naturvitenskapelige metoder, eksperimenter, teorier og modeller utvikles, inkludert bruk av programmering." },
        { nb: "Energi og energioverføring", en: "Energy and energy transfer", descNb: "Energi involvert i alle fysiske prosesser, ulike energiformer og energioverføring mellom objekter." },
        { nb: "Krefter og felt", en: "Forces and fields", descNb: "Vekselvirkning mellom objekter, kraftanalyse for beregning av bevegelse, og feltbegrepet for fjernkrefter." },
        { nb: "Materie, tid og rom", en: "Matter, time and space", descNb: "Byggesteinene i naturen og de teoretiske modellene som beskriver universets oppbygning." },
      ],
    },
    {
      id: "psykologi",
      nameNb: "Psykologi",
      nameEn: "Psychology",
      levels: ["vgo"],
      programs: ["studiespesialiserende"],
      code: "PSY01-04",
      topics: [
        { nb: "Tanker, emosjoner og atferd", en: "Thoughts, emotions and behaviour", descNb: "Psykologiske prosesser og menneskelig atferd, og hvordan tanker, emosjoner og atferd påvirkes av individuelle, situasjonelle og sosiale faktorer." },
        { nb: "Menneskelig utvikling og samspill", en: "Human development and interaction", descNb: "Hvordan arv, miljø og psykologiske prosesser påvirker menneskelig utvikling i et livsløpsperspektiv." },
        { nb: "Vitenskapelig og kritisk tenkning", en: "Scientific and critical thinking", descNb: "Vurdere holdbarheten i psykologiske påstander og koble psykologiske tema til forskningsmetode." },
      ],
    },
    {
      id: "sosiologi",
      nameNb: "Sosiologi og sosialantropologi",
      nameEn: "Sociology and social anthropology",
      levels: ["vgo"],
      programs: ["studiespesialiserende"],
      code: "POS04-01",
      topics: [
        { nb: "Sosiale strukturer, aktører og handling", en: "Social structures, actors and action", descNb: "Måter å organisere fellesskap på i ulike samfunn og kulturer, og sosiale prosesser knyttet til ulikhet og arbeid." },
        { nb: "Vitenskapelig metode og kildebruk", en: "Scientific method and use of sources", descNb: "Innsikt i samfunnsvitenskapelig forskning, metoder, analyseverktøy og teorier, med kritisk kildebruk." },
        { nb: "Sosialisering og medborgerskap", en: "Socialisation and citizenship", descNb: "Tilhørighet i fellesskap og hvordan vi blir påvirket av samhandling gjennom livet." },
        { nb: "Kulturforståelse og interkulturell kompetanse", en: "Cultural understanding and intercultural competence", descNb: "Likheter og forskjeller innenfor og mellom kulturer, og urfolks- og minoritetsperspektiv." },
      ],
    },
    {
      id: "samfunnsokonomi",
      nameNb: "Samfunnsøkonomi",
      nameEn: "Economics",
      levels: ["vgo"],
      programs: ["studiespesialiserende"],
      code: "SOK01-04",
      topics: [
        { nb: "Ressursbruk og fordeling", en: "Resource use and distribution", descNb: "Hvordan samfunn bruker arbeidskraft, realkapital og naturressurser til å produsere varer og tjenester, og fordelingen av verdiskapingen." },
        { nb: "Samfunnsøkonomisk metode og analyse", en: "Economic method and analysis", descNb: "Økonomiske årsakssammenhenger og bruk av teori og grafiske modeller knyttet til økonomisk virkelighet." },
        { nb: "Makroøkonomi og økonomisk politikk", en: "Macroeconomics and economic policy", descNb: "Hvordan nasjonale og internasjonale forhold påvirker økonomier, og hvilke virkemidler myndighetene bruker." },
      ],
    },
    {
      id: "historieogfilosofi",
      nameNb: "Historie og filosofi",
      nameEn: "History and philosophy",
      levels: ["vgo"],
      programs: ["studiespesialiserende"],
      code: "HIF01-03",
      topics: [
        { nb: "Søke kunnskap og innsikt", en: "Seeking knowledge and insight", descNb: "Forstå mennesker i nåtid og fortid gjennom filosofisk samtale, kritisk tenkning og bruk av kilder." },
        { nb: "Et meningsfylt og godt liv", en: "A meaningful and good life", descNb: "Reflektere over eksistensielle spørsmål, utvikle etisk bevissthet og undersøke samfunnets organisering." },
        { nb: "Det historieskapte og historieskapende", en: "Being shaped by and shaping history", descNb: "Vurdere hvordan samfunnsmessige strukturer og aktører skaper endringer i samfunnet." },
        { nb: "Menneskets plass i verden", en: "Humanity's place in the world", descNb: "Reflektere over menneskets forhold til omgivelser, verdier, miljø og teknologiens rolle i samfunnet." },
      ],
    },
    {
      id: "politikkogmenneskerettigheter",
      nameNb: "Politikk og menneskerettigheter",
      nameEn: "Politics and human rights",
      levels: ["vgo"],
      programs: ["studiespesialiserende"],
      code: "POS05-01",
      topics: [
        { nb: "Politisk teori og demokratiforståelse", en: "Political theory and understanding of democracy", descNb: "Kunnskap om statsvitenskapelig forskning og fagets teorier, modeller og begreper for å analysere politiske problemstillinger." },
        { nb: "Makt, påvirkning og medborgerskap", en: "Power, influence and citizenship", descNb: "Hvordan aktører påvirker politiske beslutningsprosesser og utøvelse av lokalt, nasjonalt og globalt medborgerskap." },
        { nb: "Menneskerettigheter og den internasjonale rettsorden", en: "Human rights and the international legal order", descNb: "Menneskerettighetenes rolle og betydning, samt internasjonal rett og hvordan den påvirker aktørers handlingsrom." },
        { nb: "Politiske institusjoner, aktører og prosesser", en: "Political institutions, actors and processes", descNb: "Samfunnets politiske system på ulike nivåer, og hvordan aktører deltar i beslutningsprosesser." },
      ],
    },
    {
      id: "rettslaere",
      nameNb: "Rettslære",
      nameEn: "Legal studies",
      levels: ["vgo"],
      programs: ["studiespesialiserende"],
      code: "RTL01-05",
      topics: [
        { nb: "Juridisk refleksjon", en: "Legal reflection", descNb: "Skille mellom rett og rettferd, og reflektere over sammenhengen mellom rettsregler og etikk." },
        { nb: "Juridisk metode", en: "Legal method", descNb: "Læren om hvilke rettskilder som finnes, og hvordan man bruker dem for å løse rettsspørsmål." },
        { nb: "Rettsreglane i samfunnet", en: "Legal rules in society", descNb: "Det juridiske forholdet mellom individer og stat, og borgernes rettigheter og plikter." },
      ],
    },
    {
      id: "markedsforingogledelse",
      nameNb: "Markedsføring og ledelse",
      nameEn: "Marketing and management",
      levels: ["vgo"],
      programs: ["studiespesialiserende"],
      code: "MFL01-04",
      topics: [
        { nb: "Markedsanalyse og innsikt", en: "Market analysis and insight", descNb: "Innhente og vurdere informasjon som gir perspektiv på markeder, målgrupper og deres behov." },
        { nb: "Markedsstrategiske vurderinger", en: "Market strategy assessments", descNb: "Velge tiltak for å nå virksomhetsmål og utvikle helhetlige strategier med etiske og bærekraftige vurderinger." },
        { nb: "Faglig kreativitet og problemløsing", en: "Professional creativity and problem-solving", descNb: "Nye idéer som bidrar til å skape forandring og løse markedsstrategiske problemstillinger." },
      ],
    },
    {
      id: "entreprenorskap",
      nameNb: "Entreprenørskap og bedriftsutvikling",
      nameEn: "Entrepreneurship and business development",
      levels: ["vgo"],
      programs: ["studiespesialiserende"],
      code: "ENT01-04",
      topics: [
        { nb: "Innovasjon", en: "Innovation", descNb: "Iverksette nye former for verdiskapende aktiviteter knyttet til produkt- og prosessinnovasjoner." },
        { nb: "Verdiskaping og bærekraft", en: "Value creation and sustainability", descNb: "Konsekvenser virksomheters handlinger har på verdiskaping, og betydningen av bærekraftig utvikling." },
        { nb: "Strategi og virksomhetsutvikling", en: "Strategy and business development", descNb: "Hvordan virksomheter blir etablert, driftet og videreutviklet." },
      ],
    },
    {
      id: "religionogetikk",
      nameNb: "Religion og etikk",
      nameEn: "Religion and ethics",
      levels: ["vgo"],
      programs: ["studiespesialiserende"],
      code: "REL01-02",
      topics: [
        { nb: "Kjennskap til religioner og livssyn", en: "Knowledge of religions and worldviews", descNb: "Kunnskap om og forståelse for religioner og livssyn lokalt, nasjonalt og globalt." },
        { nb: "Utforsking av religioner og livssyn med ulike metoder", en: "Exploring religions and worldviews using different methods", descNb: "Undersøke religioner som sammensatte fenomener gjennom varierte metodiske tilnærminger og kritisk refleksjon." },
        { nb: "Utforsking av eksistensielle spørsmål og svar", en: "Exploring existential questions and answers", descNb: "Ulike måter mennesker har nærmet seg spørsmål om mening, identitet og virkelighetsbilde." },
        { nb: "Kunne ta andres perspektiv", en: "Taking others' perspective", descNb: "Utvikle synspunkter gjennom dialog og refleksjon, og styrke evnen til å forstå ulike kulturelle og religiøse bakgrunner." },
        { nb: "Etisk refleksjon", en: "Ethical reflection", descNb: "Identifisere etiske dilemmaer og drøfte moralske spørsmål ved hjelp av egen erfaringsbakgrunn." },
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
