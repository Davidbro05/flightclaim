'use strict';

const NOW = new Date('2026-04-20T10:00:00.000Z').toISOString();

function article(fields) {
  return Object.assign(
    {
      type: 'blog',
      status: 'published',
      parent_slug: 'blogg',
      schema_type: 'Article',
      faq_json: null,
      affiliate_ref: null,
      created_at: NOW,
      updated_at: NOW,
    },
    fields
  );
}

const ARTICLES = [
  // ── Norwegian ─────────────────────────────────────────────────────────────
  article({
    slug: 'blogg/norwegian-forsenat-flyg',
    title: 'Försenat Norwegian-flyg — dina rättigheter och hur du ansöker',
    meta_title: 'Försenat Norwegian-flyg — upp till 600€ ersättning | FlightClaim',
    meta_desc: 'Har ditt Norwegian-flyg blivit försenat? Lär dig när EU 261 gäller, hur mycket du kan få och hur vi driver ärendet åt dig gratis.',
    category: 'flygbolag',
    content: `![Norwegian Boeing 737 på Arlanda](/images/articles/flygbolag/norwegian-boeing.jpg)

Norwegian Air Shuttle är ett av de mest trafikerade lågprisbolagen i Norden. Med hundratals avgångar om dagen är förseningar oundvikliga — och många passagerare vet inte att de har rätt till upp till **600€ per person** i kompensation.

## När gäller EU 261 för Norwegian?

EU-förordning 261/2004 gäller för alla Norwegian-avgångar från EU/EES-länder. Norge ingår inte i EU men däremot i EES, vilket innebär att förordningen gäller fullt ut för avgångar från norska flygplatser (Oslo, Bergen, Stavanger m.fl.) — precis som från svenska.

**Du har rätt till ersättning om:**
- Flyget ankom **3 timmar eller mer försenat** vid slutdestinationen
- Flyget **ställdes in med kortare varsel än 14 dagar**
- Du **nekades ombordstigning** pga överbookning

## Vanliga orsaker till Norwegian-förseningar

Norwegian flyger ett tight schema med hög beläggning. Vanliga orsaker till förseningar inkluderar:

- **Sena inkommande flygplan** (s.k. rotationsförseningar) — räknas *inte* som extraordinära omständigheter
- **Tekniska fel** — räknas *inte* som extraordinära omständigheter
- **Dåligt väder** — kan vara ett godkänt undantag
- **ATC-restriktioner** — kan vara godkänt om dokumenterat

Norwegian hänvisar ibland till extraordinära omständigheter i fall där de juridiskt inte håller. Vi vet vilka argument som fungerar.

## Hur mycket kan du få?

| Flygsträcka | Ersättning |
|---|---|
| Under 1 500 km | €250 |
| 1 500–3 500 km | €400 |
| Över 3 500 km | €600 |

**Observera:** om Norwegian erbjuder ombokning som inte försenar dig mer än 2–4 timmar kan beloppet halveras.

## Rätt till mat och boende vid lång väntan

Utöver penningkompensation har du rätt till **kostnadsfri mat och dryck** vid väntan på mer än 2 timmar, och **hotell + transport** om väntan sträcker sig över natten. Spara kvitton — du kan begära ersättning för dessa kostnader.

## Ansök om ersättning från Norwegian

[Fyll i formuläret](/anmalan) så driver vi ditt ärende mot Norwegian utan förskottskostnad. Vi tar 25% + moms vid framgångsrikt ärende.

→ Läs mer om [Norwegians rättigheter enligt EU 261](/flygbolag/norwegian)`,
  }),

  // ── KLM ───────────────────────────────────────────────────────────────────
  article({
    slug: 'blogg/klm-forsenat-flyg',
    title: 'Försenat KLM-flyg via Amsterdam — vad du har rätt till',
    meta_title: 'Försenat KLM-flyg — upp till 600€ ersättning | FlightClaim',
    meta_desc: 'Missat anslutningsflyget i Amsterdam med KLM? Eller försenat flyg hem? Vi förklarar dina rättigheter och driver ärendet gratis.',
    category: 'flygbolag',
    content: `![KLM Boeing 737 på Schiphol](/images/articles/flygbolag/klm-boeing-737.jpg)

KLM Royal Dutch Airlines har hub på Amsterdam Schiphol — en av Europas mest trafikerade flygplatser. Förseningar i Schiphol kan skapa dominoeffekter för hela resekedjan. Här är vad du har rätt till.

## EU 261 gäller för KLM — även utanför Europa

KLM är registrerat i Nederländerna och är ett EU-flygbolag. Det innebär att EU-förordning 261/2004 gäller för **alla KLM-avgångar från EU** — oavsett destination.

Flyger du Stockholm–Tokyo med KLM via Amsterdam? Hela resan täcks. Försenar Amsterdam-hubben ditt anslutningsflyg till Tokyo med 3+ timmar har du rätt till **€600 per person**.

## Missat anslutning i Amsterdam

Det vanligaste klagomålet mot KLM är missade anslutningar på Schiphol. Viktigt att veta:

- Har du **en genomgående biljett** (ett bokningsnummer) och missar anslutningen pga KLMs försening — räknas förseningsTiden vid slutdestinationen, inte vid Amsterdam
- Har du **separata biljetter** gäller EU 261 bara för det enskilda flyget du var försenad på

## Ombokning utan information

KLM har fått kritik för att ibland boka om passagerare till längre rutter utan förvarning. Det är ett brott mot EU 261 artikel 8 och ger rätt till full kompensation.

## Hur mycket kan du få?

| Flygsträcka | Ersättning |
|---|---|
| Under 1 500 km | €250 |
| 1 500–3 500 km | €400 |
| Över 3 500 km | €600 |

## Ansök om ersättning från KLM

[Fyll i formuläret](/anmalan) — vi utreder ärendet mot KLM och driver det kostnadsfritt.

→ Läs mer om [KLMs rättigheter enligt EU 261](/flygbolag/klm)`,
  }),

  // ── Lufthansa ─────────────────────────────────────────────────────────────
  article({
    slug: 'blogg/lufthansa-forsenat-flyg',
    title: 'Försenat Lufthansa-flyg — ersättning och dina rättigheter',
    meta_title: 'Försenat Lufthansa-flyg — upp till 600€ ersättning | FlightClaim',
    meta_desc: 'Lufthansa försenat eller inställt? Som EU-bolag är de skyldiga att betala. Vi driver ärendet gratis mot Lufthansa och hela Lufthansa-gruppen.',
    category: 'flygbolag',
    content: `![Lufthansa incheckning Frankfurt](/images/articles/flygbolag/lufthansa-incheckning-frankfurt.jpg)

Lufthansa är Europas största flygbolag med hub på Frankfurt och München. Trots sitt rykte som ett pålitligt bolag drabbas tusentals passagerare av förseningar varje år — många utan att veta att de kan kräva upp till **600€ per person**.

## Lufthansa-gruppen: fler bolag, samma regler

Lufthansa-gruppen inkluderar:
- **Lufthansa** (LH)
- **Swiss** (LX)
- **Austrian Airlines** (OS)
- **Brussels Airlines** (SN)
- **Eurowings** (EW)

Har du flugit med något av dessa bolag gäller exakt samma EU 261-rättigheter. Om du bokade via Lufthansa men flög med Eurowings är Lufthansa ansvarigt.

## Strejker — vad gäller?

Lufthansa har haft återkommande strejker bland piloter och kabinpersonal. Domstolarna har slagit fast att **interna strejker hos flygbolaget** *inte* räknas som extraordinära omständigheter — Lufthansa är alltså skyldigt att betala ersättning vid strejker bland den egna personalen.

Strejker bland flygplatspersonal eller ATC (flygtrafiktjänst) kan däremot räknas som extraordinära omständigheter.

## Hur mycket kan du få?

| Flygsträcka | Ersättning |
|---|---|
| Under 1 500 km | €250 |
| 1 500–3 500 km | €400 |
| Över 3 500 km | €600 |

## Ansök om ersättning från Lufthansa

[Starta din ansökan](/anmalan) — vi driver ärendet mot Lufthansa utan förskottskostnad.

→ Läs mer om [Lufthansas rättigheter enligt EU 261](/flygbolag/lufthansa)`,
  }),

  // ── EasyJet ───────────────────────────────────────────────────────────────
  article({
    slug: 'blogg/easyjet-forsenat-flyg',
    title: 'Försenat EasyJet-flyg — hur du kräver ersättning',
    meta_title: 'Försenat EasyJet-flyg — upp till 600€ ersättning | FlightClaim',
    meta_desc: 'EasyJet försenat eller inställt? Du kan ha rätt till upp till 600€. Vi driver ärendet mot EasyJet utan kostnad.',
    category: 'flygbolag',
    content: `![EasyJet Airbus A320](/images/articles/flygbolag/easyjet-airbus.jpg)

EasyJet är ett av Europas största lågprisflygbolag med rutter från Sverige till stora delar av Europa. Förseningar är vanliga — och EU 261/2004 ger dig rätt till upp till **€600 per person** i kompensation.

## EasyJet Europe — fullt EU-skydd

Efter Brexit opererar EasyJet inom EU via sitt österrikiska dotterbolag **EasyJet Europe**. Det innebär att alla EasyJet-flyg från EU-länder täcks av EU-förordning 261/2004 fullt ut.

## Vad räknas som försening?

EU 261 aktiveras när du anländer **3 timmar eller mer försenat** vid slutdestinationen. Det är ankomsttiden — inte avgångstiden — som räknas. Ankomsten definieras som när dörrarna öppnas vid destinationsgaten.

## Tekniska problem — ett vanligt argument från EasyJet

EasyJet hänvisar ibland till tekniska problem som orsak till förseningar. Viktigt att veta: **tekniska fel räknas normalt inte som extraordinära omständigheter** och ger därmed inte bolaget rätt att slippa ersättning. EU-domstolarna har bekräftat detta i flera avgöranden.

## Hur mycket kan du få?

| Flygsträcka | Ersättning |
|---|---|
| Under 1 500 km | €250 |
| 1 500–3 500 km | €400 |
| Över 3 500 km | €600 |

EasyJet flyger mestadels kortare Europalinjer — €250 är den vanligaste ersättningsnivån, men längre rutter t.ex. till Kanarieöarna ger €400.

## Ansök om ersättning från EasyJet

[Fyll i formuläret](/anmalan) — vi utreder och driver ditt ärende mot EasyJet gratis.

→ Läs mer om [EasyJets rättigheter enligt EU 261](/flygbolag/easyjet)`,
  }),

  // ── British Airways ───────────────────────────────────────────────────────
  article({
    slug: 'blogg/british-airways-forsenat-flyg',
    title: 'Försenat British Airways-flyg — EU 261 eller UK 261?',
    meta_title: 'Försenat British Airways-flyg — upp till 600€ ersättning | FlightClaim',
    meta_desc: 'British Airways försenat? Post-Brexit gäller EU 261 vid avgångar från EU. Vi reder ut reglerna och driver ärendet gratis.',
    category: 'flygbolag',
    content: `![British Airways Boeing 787 Dreamliner](/images/articles/flygbolag/british-airways-boeing.jpg)

Försenat British Airways-flyg skapar förvirring hos många resenärer efter Brexit — gäller EU-reglerna? Svaret är: **det beror på varifrån du avgick**.

## EU 261 eller UK 261 — vad gäller?

| Situation | Tillämplig lag |
|---|---|
| Avgång från Sverige/EU → London | ✅ EU 261 gäller |
| Avgång från London → Sverige/EU | UK 261 gäller |
| Avgång från London → USA | UK 261 gäller |

**Goda nyheter:** UK 261 (den brittiska versionen av förordningen) erbjuder i praktiken **identiskt skydd** med EU 261 — samma ersättningsbelopp, samma regler om extraordinära omständigheter.

## Ersättningsbelopp

Vid avgång från EU (t.ex. Stockholm, Köpenhamn):

| Flygsträcka | Ersättning |
|---|---|
| Under 1 500 km | €250 |
| 1 500–3 500 km | €400 |
| Över 3 500 km | €600 |

Vid avgång från UK (Heathrow, Gatwick, London City):

| Flygsträcka | Ersättning |
|---|---|
| Under 1 500 km | £220 |
| 1 500–3 500 km | £350 |
| Över 3 500 km | £520 |

## BA och IAG-gruppen

British Airways ingår i IAG-gruppen tillsammans med Iberia, Vueling och Aer Lingus. Om du bokade via BA men flög med ett av dessa bolag är BA ansvarigt enligt EU 261.

## Ansök om ersättning från British Airways

[Starta din ansökan](/anmalan) — vi avgör vilken lag som gäller och driver ärendet kostnadsfritt.

→ Läs mer om [British Airways rättigheter enligt EU 261](/flygbolag/british-airways)`,
  }),

  // ── Turkish Airlines ──────────────────────────────────────────────────────
  article({
    slug: 'blogg/turkish-airlines-forsenat-flyg',
    title: 'Försenat Turkish Airlines-flyg från Sverige — vad gäller?',
    meta_title: 'Försenat Turkish Airlines-flyg från EU — upp till 600€ | FlightClaim',
    meta_desc: 'Turkish Airlines försenat från Sverige? EU 261 gäller vid avgångar från EU. Vi förklarar reglerna och driver ärendet gratis.',
    category: 'flygbolag',
    content: `![Turkish Airlines Airbus A350 på Istanbul Airport](/images/articles/flygbolag/turkish-airlines-airbus.jpg)

Turkish Airlines (THY) är ett av världens snabbast växande flygbolag med hub på Istanbul Airport (IST). Men bolaget är turkiskt — inte EU-registrerat. Det skapar frågor om vilket skydd du har som passagerare.

## Nyckelfakta: EU 261 gäller bara vid avgång från EU

Turkish Airlines är **inte** ett EU-flygbolag. Förordningen EU 261/2004 gäller för:

1. **EU-registrerade bolag** — oavsett avgångsland
2. **Icke-EU-bolag** — men **enbart** för flyg som avgår från EU-flygplatser

| Situation | EU 261 gäller? |
|---|---|
| Stockholm (ARN) → Istanbul (IST) med Turkish Airlines | ✅ Ja |
| Istanbul (IST) → Stockholm (ARN) med Turkish Airlines | ❌ Nej |
| Stockholm (ARN) → New York (JFK) via Istanbul med Turkish Airlines | ✅ Ja (EUR-avgång) |

## Missat anslutningsflyg i Istanbul

Om du flyger från Sverige via Istanbul och missar en anslutning pga Turkish Airlines försening: **EU 261 gäller för hela resan** om du har en genomgående biljett och avgången skedde från Sverige.

## Hur mycket kan du få?

| Flygsträcka | Ersättning |
|---|---|
| Under 1 500 km | €250 |
| 1 500–3 500 km | €400 |
| Över 3 500 km | €600 |

Stockholm–Istanbul är ca 2 400 km → normalt **€400** per person.

## Ansök om ersättning från Turkish Airlines

[Fyll i formuläret](/anmalan) — vi utreder om ditt ärende faller under EU 261 och driver det kostnadsfritt.

→ Läs mer om [Turkish Airlines rättigheter enligt EU 261](/flygbolag/turkish-airlines)`,
  }),
];

exports.up = async function (knex) {
  for (const a of ARTICLES) {
    const exists = await knex('articles').where({ slug: a.slug }).first();
    if (!exists) {
      await knex('articles').insert(a);
    }
  }
};

exports.down = async function (knex) {
  const slugs = ARTICLES.map(a => a.slug);
  await knex('articles').whereIn('slug', slugs).delete();
};
