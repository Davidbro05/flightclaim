// Adds FAQPage schema + faq_json to all airline articles.
// Generic 4-question FAQ with airline-specific answers where relevant.

const GENERIC_FAQ = (name, nonEuNote) => [
  {
    q: `Täcker EU 261/2004 flyg med ${name}?`,
    a: nonEuNote
      ? nonEuNote
      : `Ja. ${name} är ett EU-registrerat flygbolag och EU-förordning 261/2004 gäller för alla avgångar från EU-länder. Förseningar på 3+ timmar, inställda flyg med kort varsel och nekad ombordstigning ger rätt till ersättning på €250–€600 per person.`,
  },
  {
    q: `Hur mycket ersättning kan jag få från ${name}?`,
    a: 'Ersättningen beror på flygsträckan: €250 för under 1 500 km, €400 för 1 500–3 500 km och €600 för över 3 500 km. Beloppet kan halveras om flygbolaget erbjuder ombokning som inte försenar dig med mer än 2–4 timmar.',
  },
  {
    q: `Vad händer om ${name} hänvisar till extraordinära omständigheter?`,
    a: 'Flygbolaget slipper ersättning om störningen beror på genuint extraordinära omständigheter utanför deras kontroll — t.ex. extremt väder eller terrorhot. Däremot är tekniska fel, personalbrist och kommersiella beslut normalt inte godkända undantag. Vi utreder om argumentet håller juridiskt.',
  },
  {
    q: `Hur länge har jag på mig att kräva ersättning från ${name}?`,
    a: 'Preskriptionstiden varierar per land. I Sverige är den 10 år, i Tyskland 3 år och i Frankrike 5 år. Räkna från flygdatumet. Ansök hellre tidigt — ju äldre ärendet är desto svårare kan det vara att samla bevis.',
  },
];

const AIRLINE_FAQS = {
  'flygbolag/sas': GENERIC_FAQ('SAS'),
  'flygbolag/norwegian': GENERIC_FAQ('Norwegian'),
  'flygbolag/ryanair': [
    {
      q: 'Täcker EU 261/2004 Ryanair-flyg?',
      a: 'Ja. Ryanair är registrerat i Irland och EU 261/2004 gäller för alla Ryanair-avgångar från EU-länder. Trots att Ryanair ofta nekar anspråk inledningsvis är bolaget juridiskt skyldigt att betala vid berättigade fall.',
    },
    {
      q: 'Hur mycket ersättning kan jag få från Ryanair?',
      a: 'Ersättningen är €250 för flyg under 1 500 km, €400 för 1 500–3 500 km och €600 för över 3 500 km. Ryanair flyger mestadels kortare Europalinjer, vilket innebär att €250 är den vanligaste ersättningsnivån.',
    },
    {
      q: 'Ryanair nekar min ersättningsansökan — vad gör jag?',
      a: 'Ryanair är känt för att avvisa ersättningsanspråk och hänvisa till extraordinära omständigheter i fall där det juridiskt inte håller. Vid nekad ansökan bör du antingen anmäla till Konsumentverket/ARN eller anlita ett ombud som FlightClaim som driver ärendet vidare — utan förskottskostnad.',
    },
    {
      q: 'Hur länge har jag på mig att kräva ersättning från Ryanair?',
      a: 'Preskriptionstiden för svenska resenärer är 10 år från flygdatumet. Irland (där Ryanair är registrerat) tillämpar 6 år. Vi rekommenderar att ansöka så snart som möjligt för att bevisen ska vara färska.',
    },
  ],
  'flygbolag/klm': [
    {
      q: 'Täcker EU 261/2004 KLM-flyg utanför Europa?',
      a: 'Ja — med ett viktigt undantag. EU 261 gäller för alla KLM-flyg som avgår från EU, oavsett destination. Flyger du Stockholm–Tokyo med KLM via Amsterdam täcks hela resan. Flyger du Tokyo–Amsterdam med KLM gäller EU 261 bara om du anländer till EU och avgår från en icke-EU-flygplats med ett EU-bolag.',
    },
    {
      q: 'Hur mycket ersättning kan jag få från KLM?',
      a: '€250 för under 1 500 km, €400 för 1 500–3 500 km och €600 för över 3 500 km. KLM flyger många interkontinentala rutter vilket ofta innebär €600 per person.',
    },
    {
      q: 'Vad händer om KLM bokar om mig utan att informera?',
      a: 'Ombokning utan information är ett brott mot EU 261. Om KLM ändrar din rutt (t.ex. lägger till en mellanlandning) utan förvarning och ombokningen inte uppfyller kraven i artikel 8, kan du ha rätt till full kompensation på upp till €600.',
    },
    {
      q: 'Hur länge har jag på mig att kräva ersättning från KLM?',
      a: 'I Sverige gäller 10 års preskriptionstid, i Nederländerna (KLMs hemland) 2 år. Ansök hellre tidigt för att undvika komplicerade jurisdiktionsfrågor.',
    },
  ],
  'flygbolag/lufthansa': GENERIC_FAQ('Lufthansa'),
  'flygbolag/wizz-air': GENERIC_FAQ('Wizz Air'),
  'flygbolag/easyjet': GENERIC_FAQ('EasyJet'),
  'flygbolag/finnair': [
    {
      q: 'Täcker EU 261/2004 Finnair-flyg till Asien?',
      a: 'Ja. Finnair flyger till Tokyo, Seoul, Shanghai och Bangkok via Helsingfors. Eftersom avgångsflygplatsen är inom EU (ARN eller HEL) gäller EU 261 för hela resan — inklusive om du missar anslutningsflygplanet i Helsingfors.',
    },
    {
      q: 'Hur mycket ersättning kan jag få från Finnair?',
      a: '€250 för under 1 500 km, €400 för 1 500–3 500 km och €600 för över 3 500 km. Asienrutter ger normalt €600 per person.',
    },
    {
      q: 'Vad händer om Finnair hänvisar till extraordinära omständigheter?',
      a: 'Finnair hänvisar ibland till dåligt väder i Helsingfors som orsak. Väder kan vara ett godkänt undantag — men bara om det specifikt och direkt orsakade just ditt flygs försening. Generella hänvisningar till vinterväder accepteras sällan av domstolarna.',
    },
    {
      q: 'Hur länge har jag på mig att kräva ersättning från Finnair?',
      a: 'I Sverige 10 år, i Finland 3 år. Vi rekommenderar att ansöka snarast för tydligast bevisläge.',
    },
  ],
  'flygbolag/turkish-airlines': [
    {
      q: 'Täcker EU 261/2004 Turkish Airlines-flyg?',
      a: 'Delvis. Turkish Airlines är ett turkiskt bolag och EU 261 gäller enbart för flyg som avgår från EU-flygplatser — t.ex. Stockholm, Göteborg eller Köpenhamn till Istanbul. Flyg från Istanbul till Sverige täcks däremot av turkisk lag.',
    },
    {
      q: 'Hur mycket ersättning kan jag få från Turkish Airlines (avgångar från EU)?',
      a: '€250 för under 1 500 km, €400 för 1 500–3 500 km och €600 för över 3 500 km. Stockholm–Istanbul är ca 2 400 km och ger normalt €400.',
    },
    {
      q: 'Vad händer om Turkish Airlines hänvisar till extraordinära omständigheter?',
      a: 'Turkish Airlines åberopar ibland väderstörningar i Istanbul. Kom ihåg att undantaget måste gälla det specifika planet och den specifika avgången — generella hänvisningar till väder på hubben accepteras sällan.',
    },
    {
      q: 'Hur länge har jag på mig att kräva ersättning från Turkish Airlines?',
      a: 'Vid avgång från Sverige gäller 10 års preskriptionstid. Ansök tidigt för att bevisen ska vara tillgängliga.',
    },
  ],
  'flygbolag/eurowings': GENERIC_FAQ('Eurowings'),
  'flygbolag/transavia': GENERIC_FAQ('Transavia'),
  'flygbolag/vueling': GENERIC_FAQ('Vueling'),
  'flygbolag/tap-air-portugal': [
    {
      q: 'Täcker EU 261/2004 TAP-flyg till Brasilien och USA?',
      a: 'Ja. TAP är registrerat i Portugal (EU) och EU 261 gäller för alla TAP-avgångar från EU — inklusive långdistansrutter till Brasilien, USA och Afrika via Lissabon.',
    },
    {
      q: 'Hur mycket ersättning kan jag få från TAP Air Portugal?',
      a: '€250 för under 1 500 km, €400 för 1 500–3 500 km och €600 för över 3 500 km. Transatlantiska rutter (t.ex. till São Paulo eller New York) ger normalt €600.',
    },
    {
      q: 'Vad händer om TAP hänvisar till extraordinära omständigheter?',
      a: 'TAP har fått kritik för att använda extraordinära omständigheter alltför brett. Tekniska fel, sena flygplan i systemet och kommersiella schemaändringar är normalt inte godkända undantag.',
    },
    {
      q: 'Hur länge har jag på mig att kräva ersättning från TAP?',
      a: 'I Sverige 10 år, i Portugal 3 år. Ansök i god tid för säkraste bevisläge.',
    },
  ],
  'flygbolag/air-france': GENERIC_FAQ('Air France'),
  'flygbolag/british-airways': [
    {
      q: 'Täcker EU 261/2004 British Airways-flyg efter Brexit?',
      a: 'EU 261 gäller fortfarande för British Airways-avgångar från EU-flygplatser. Flyger du från Stockholm eller Köpenhamn med BA täcks du av EU-rätten. Flyger du från London (Heathrow/Gatwick) gäller istället UK 261 — den brittiska versionen med i praktiken identiska ersättningsbelopp.',
    },
    {
      q: 'Hur mycket ersättning kan jag få från British Airways?',
      a: 'Vid avgång från EU: €250/€400/€600 beroende på sträcka. Vid avgång från UK: £220/£350/£520. Beloppen är i praktiken likvärdiga.',
    },
    {
      q: 'Vad händer om British Airways hänvisar till extraordinära omständigheter?',
      a: 'BA åberopar ibland ATC-störningar och väder. Undantaget måste vara direkt orsakssamband med just ditt flyg — inte generella nätverksstörningar. Vi utreder om hänvisningen håller.',
    },
    {
      q: 'Hur länge har jag på mig att kräva ersättning från British Airways?',
      a: 'Vid avgång från EU: 10 år (svensk preskription). Vid avgång från UK: 6 år (UK Limitation Act). Ansök gärna inom 1–2 år för att dokumentation ska vara tillgänglig.',
    },
  ],
  'flygbolag/brussels-airlines': GENERIC_FAQ('Brussels Airlines'),
  'flygbolag/iberia': GENERIC_FAQ('Iberia'),
  'flygbolag/aer-lingus': [
    {
      q: 'Täcker EU 261/2004 Aer Lingus-flyg till USA?',
      a: 'Ja. Aer Lingus är registrerat i Irland (EU) och EU 261 gäller för alla avgångar från EU/EES — inklusive transatlantiska rutter till New York, Boston och Chicago. Notera att USA:s gränskontroll sker i Dublin (US Preclearance), inte vid ankomst i USA.',
    },
    {
      q: 'Hur mycket ersättning kan jag få från Aer Lingus?',
      a: '€250 för under 1 500 km, €400 för 1 500–3 500 km och €600 för över 3 500 km. Transatlantiska rutter ger normalt €600 per person.',
    },
    {
      q: 'Vad händer om Aer Lingus hänvisar till extraordinära omständigheter?',
      a: 'Aer Lingus åberopar ibland ATC-restriktioner och väder. Undantaget kräver ett direkt orsakssamband med just ditt flyg. Väderstörningar på annan plats i nätverket godkänns normalt inte.',
    },
    {
      q: 'Hur länge har jag på mig att kräva ersättning från Aer Lingus?',
      a: 'I Sverige 10 år, i Irland (Aer Lingus hemland) 6 år. Ansök hellre tidigt för tydligare bevisläge.',
    },
  ],
  'flygbolag/austrian-airlines': GENERIC_FAQ('Austrian Airlines'),
  'flygbolag/lot-polish-airlines': [
    {
      q: 'Täcker EU 261/2004 LOT-flyg till Nordamerika?',
      a: 'Ja. LOT är registrerat i Polen (EU) och EU 261 gäller för alla avgångar från EU — inklusive transatlantiska rutter till New York, Chicago och Toronto via Warszawa.',
    },
    {
      q: 'Hur mycket ersättning kan jag få från LOT Polish Airlines?',
      a: '€250 för under 1 500 km, €400 för 1 500–3 500 km och €600 för över 3 500 km. Transatlantiska rutter ger €600 per person.',
    },
    {
      q: 'Vad händer om LOT hänvisar till extraordinära omständigheter?',
      a: 'LOT har fått kritik för bristfällig kommunikation vid störningar. Tekniska fel och sena flygplan i systemet är normalt inte godkända undantag — och räknas inte som extraordinära omständigheter.',
    },
    {
      q: 'Hur länge har jag på mig att kräva ersättning från LOT?',
      a: 'I Sverige 10 år, i Polen 3 år. Ansök tidigt för bästa bevisläge.',
    },
  ],
  'flygbolag/aegean-airlines': [
    {
      q: 'Täcker EU 261/2004 Aegean Airlines-flyg?',
      a: 'Ja. Aegean Airlines är registrerat i Grekland (EU) och EU 261 gäller för alla avgångar från EU-länder. Bolaget ingår i Star Alliance och samarbetar bl.a. med SAS.',
    },
    {
      q: 'Hur mycket ersättning kan jag få från Aegean Airlines?',
      a: '€250 för under 1 500 km, €400 för 1 500–3 500 km och €600 för över 3 500 km. Skandinavien–Aten är ca 2 600 km och ger normalt €400.',
    },
    {
      q: 'Vad händer om Aegean hänvisar till extraordinära omständigheter?',
      a: 'Aegean åberopar ibland ATC-restriktioner och väder på Aten. Undantaget kräver direkt orsakssamband med just ditt flyg — generella störningar i det grekiska luftrummet räcker normalt inte.',
    },
    {
      q: 'Hur länge har jag på mig att kräva ersättning från Aegean Airlines?',
      a: 'I Sverige 10 år, i Grekland 5 år. Ansök tidigt för att dokumentation ska finnas kvar hos bolaget.',
    },
  ],
  'flygbolag/condor': [
    {
      q: 'Täcker EU 261/2004 Condor-flyg?',
      a: 'Ja. Condor är registrerat i Tyskland (EU) och EU 261 gäller för alla avgångar från EU-länder — inklusive charterflygningar till Karibien, USA och Mexiko.',
    },
    {
      q: 'Hur mycket ersättning kan jag få från Condor?',
      a: '€250 för under 1 500 km, €400 för 1 500–3 500 km och €600 för över 3 500 km. Condors populära Karibien- och USA-rutter ger normalt €600 per person.',
    },
    {
      q: 'Gäller EU 261 om jag köpt en paketresa med Condor?',
      a: 'Ja. EU 261 gäller för flyget oavsett om det ingår i en paketresa eller köpts separat. Du kan dessutom ha rätt till ersättning enligt paketreselagen (direktiv 2015/2302) för hela resans störning.',
    },
    {
      q: 'Hur länge har jag på mig att kräva ersättning från Condor?',
      a: 'I Sverige 10 år, i Tyskland 3 år (Condors hemland). Ansök tidigt för bästa bevisläge.',
    },
  ],
  'flygbolag/tui-fly': [
    {
      q: 'Täcker EU 261/2004 TUI fly-flyg?',
      a: 'Ja. TUI fly är EU-registrerat och EU 261 gäller för alla avgångar från EU-länder — oavsett om du köpt en paketresa eller enbart flygbiljett.',
    },
    {
      q: 'Hur mycket ersättning kan jag få från TUI fly?',
      a: '€250 för under 1 500 km, €400 för 1 500–3 500 km och €600 för över 3 500 km. Semesterdestinationer i Karibien eller Asien ger normalt €600.',
    },
    {
      q: 'Kan jag kräva ersättning från TUI fly även om jag köpt en paketresa?',
      a: 'Ja — du kan ha rätt till ersättning på två grunder: EU 261 (för flygets försening/inställning) och paketreselagen (för hela resan). Dessa är oberoende av varandra. Vi utreder vilket skydd som är mest fördelaktigt i ditt fall.',
    },
    {
      q: 'Hur länge har jag på mig att kräva ersättning från TUI fly?',
      a: 'I Sverige 10 år. Paketreselagens reklamationsrätt är kortare — normalt 2 år. Ansök för EU 261-ersättning så snart som möjligt.',
    },
  ],
  'flygbolag/airbaltic': GENERIC_FAQ('airBaltic'),
  'flygbolag/icelandair': [
    {
      q: 'Täcker EU 261/2004 Icelandair-flyg?',
      a: 'Ja. Island är inte EU-medlem men tillhör EES (Europeiska ekonomiska samarbetsområdet) och EU 261 gäller fullt ut för Icelandair-avgångar från EU/EES-länder — inklusive Sverige, Norge och Island självt.',
    },
    {
      q: 'Hur mycket ersättning kan jag få från Icelandair?',
      a: '€250 för under 1 500 km, €400 för 1 500–3 500 km och €600 för över 3 500 km. Rutter till Nordamerika via Reykjavik ger normalt €600 per person.',
    },
    {
      q: 'Vad händer om Icelandair hänvisar till vulkanutbrott eller extremväder på Island?',
      a: 'Vulkanutbrott och extremt isländskt väder kan vara genuint extraordinära omständigheter. Men undantaget kräver att störningen direkt orsakade just ditt flygs inställning — och att Icelandair vidtog alla rimliga åtgärder. Vi utreder det konkreta fallet.',
    },
    {
      q: 'Hur länge har jag på mig att kräva ersättning från Icelandair?',
      a: 'I Sverige 10 år. Island tillämpar 4 år. Ansök tidigt för att bevisen ska vara tillgängliga.',
    },
  ],
  'flygbolag/ita-airways': [
    {
      q: 'Täcker EU 261/2004 ITA Airways-flyg?',
      a: 'Ja. ITA Airways är registrerat i Italien (EU) och EU 261 gäller för alla avgångar från EU-länder — inklusive interkontinentala rutter till Nordamerika och Asien via Rom Fiumicino.',
    },
    {
      q: 'Hur mycket ersättning kan jag få från ITA Airways?',
      a: '€250 för under 1 500 km, €400 för 1 500–3 500 km och €600 för över 3 500 km. Transatlantiska rutter ger normalt €600 per person.',
    },
    {
      q: 'Är ITA Airways ansvarigt för gamla Alitalia-ärenden?',
      a: 'Nej. ITA Airways grundades 2021 och övertog inte Alitalias skulder eller rättsliga ansvar. Om du hade ett öppet ersättningsanspråk mot Alitalia (konkurs 2021) är det inte ITA Airways uppgift att betala. Kontakta Alitalias konkursförvaltning i det fallet.',
    },
    {
      q: 'Hur länge har jag på mig att kräva ersättning från ITA Airways?',
      a: 'I Sverige 10 år, i Italien 2 år (ITA Airways hemland). Ansök tidigt för bästa bevisläge.',
    },
  ],
};

exports.up = async function (knex) {
  for (const [slug, faqs] of Object.entries(AIRLINE_FAQS)) {
    await knex('articles')
      .where({ slug })
      .update({
        schema_type: 'FAQPage',
        faq_json: JSON.stringify(faqs.map(f => ({ q: f.q, a: f.a }))),
      });
  }
};

exports.down = async function (knex) {
  const slugs = Object.keys(AIRLINE_FAQS);
  await knex('articles').whereIn('slug', slugs).update({
    schema_type: 'Article',
    faq_json: null,
  });
};
