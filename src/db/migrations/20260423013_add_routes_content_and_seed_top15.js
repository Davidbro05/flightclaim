'use strict';

const NOW = new Date('2026-04-23T15:30:00.000Z').toISOString();

const ROUTES = {

  'stockholm-london': `## Försenat flyg Stockholm–London? Dina rättigheter

Sträckan Stockholm Arlanda (ARN) till London (~1 760 km) är en av de mest trafikerade rutterna i Skandinavien med avgångar från SAS, British Airways, Ryanair och Norwegian. Alla dessa flygbolag är EU-registrerade (eller avgår från EU), vilket innebär att EU 261/2004 ger dig rätt till **400 euro per person** vid mer än 3 timmars ankomstförsening.

### Varför just 400 euro?

Sträckan Stockholm–London är drygt 1 500 km — vilket placerar rutten i mellanspannet (1 500–3 500 km inom EU) där ersättningen är fast **400 €** per passagerare. Biljettpriset spelar ingen roll.

### Vanligaste orsakerna till försening på ARN–LHR/LGW/STN

- **Heathrow-trängsel (LHR):** En av världens mest belastade flygplatser. Kapacitetsproblem är förutsebara och räknas inte som extraordinärt.
- **Tekniska fel:** Wallentin-Hermann (C-549/07) — tekniska fel i normal drift är flygbolagets ansvar.
- **Sent inkommande plan:** Planet var försenat på en tidigare sträcka. Om bolaget inte vidtar rimliga åtgärder för att hämta in tiden är det inte extraordinärt.
- **Pilotstrejk:** Krüsemann (C-195/17) — egna personalstrejker är inte extraordinärt.

### Hur lång försening krävs?

Ankomsten till London (dörrens öppning vid gate) måste vara **3 timmar eller mer försenad**. Flygbolag mäter ibland "touchdown" — det korrekta är ankomsttid enligt Germanwings (C-452/13).

### Beräkningsexempel

- **Du och din partner, 4 timmars försening:** 2 × 400 € = **800 €** (ca 9 000 kr).
- **Familj på fyra, inställt flyg med 5 dagars varsel:** 4 × 400 € = **1 600 €** (ca 18 000 kr).

### Så ansöker du

1. Spara PNR, förseningsnotis och FlightAware-loggar.
2. Skicka krav till flygbolaget (SAS/BA/Ryanair/Norwegian). Referera EU 261 art. 5/6/7.
3. Inget svar inom 30 dagar? → ARN (gratis) eller tingsrätt.

[Ansök gratis hos FlightClaim](/anmalan) — vi driver ärendet åt dig.
`,

  'stockholm-barcelona': `## Försenat flyg Stockholm–Barcelona? Dina rättigheter

Stockholm Arlanda (ARN) till Barcelona El Prat (BCN) är ca 2 500 km — en populär semesterrutt med Vueling, Norwegian, Ryanair och SAS. Ersättningen är **400 euro per person** vid 3+ timmars ankomstförsening.

### Varför 400 euro?

Sträckan faller i EU-kategorin 1 500–3 500 km → fast ersättning **400 €** per passagerare.

### Typiska förseningsorsaker

- **Tekniska fel:** Vanligast på högsäsongsrutter med snäv turnaround. Wallentin-Hermann gäller.
- **Barcelona El Prat-ATC:** BCN är en av Europas mest trafikerade flygplatser under sommaren. Förutsebar trängsel = inte extraordinärt.
- **Sent inkommande plan från annan sträcka.**
- **Pilotstrejk hos Ryanair:** Inte extraordinärt (Krüsemann C-195/17).

### Beräkningsexempel

- **Par på sommarresa, 3,5 timmars försening:** 2 × 400 € = **800 €**.
- **Familj på fyra, inställt flyg med 10 dagars varsel:** 4 × 400 € = **1 600 €**.

### Preskription

Du har **tre år** från flygdagen att kräva ersättning i Sverige.

[Ansök gratis](/anmalan) — no win, no fee.
`,

  'stockholm-malaga': `## Försenat flyg Stockholm–Málaga? Dina rättigheter

ARN till Málaga (AGP) är ca 3 000 km — en av de mest populära semesterrutterna till Costa del Sol. Flygbolag som Ryanair, Vueling, Norwegian och Wizz Air flyger rutten. Ersättningen är **400 euro per person** vid 3+ timmars försening.

### Ersättning och beräkning

Sträckan 3 000 km faller i spannet 1 500–3 500 km (EU-intern) → **400 €** per passagerare.

- **Par, 4 timmars försening:** 2 × 400 € = **800 €**.
- **Familj på fyra, inställt med 6 dagars varsel:** 4 × 400 € = **1 600 €**.

### Typiska orsaker

- **Tekniska problem** på långa semesterrutter med lång turnaround.
- **Málaga AGP-kapacitet** under hög säsong — förutsebar, inte extraordinärt.
- **Väder:** Extrem hetta/åskväder i södra Spanien kan ibland vara extraordinärt, men kräver dokumentation.

### Kom ihåg

- **Kontant ersättning**, inte voucher.
- **Tre år preskription** i Sverige.
- **Alla passagerare i bokningen** har rätt till var sin ersättning.

[Ansök gratis](/anmalan).
`,

  'stockholm-amsterdam': `## Försenat flyg Stockholm–Amsterdam? Dina rättigheter

ARN till Amsterdam Schiphol (AMS) är ca 1 510 km med KLM och SAS som dominerande flygbolag. Ersättningen är **400 euro per person** vid 3+ timmars ankomstförsening (sträckan passerar 1 500 km).

### Schiphol och EU 261

Amsterdam Schiphol hade allvarliga kapacitetsproblem 2022–2023 med långa köer och inställda avgångar. Dessa räknades **inte** som extraordinärt av ARN och EU-domstolen eftersom trängsel på Schiphol är ett förutsebart mönster.

### Ersättning

**400 €** per person (sträckan ~1 510 km, EU-intern). KLM är EU-registrerat och täcks globalt.

- **Par med missad anslutning:** Om anslutning i AMS ingick på en bokning och slutdestinationen nåddes 3+ timmar sent → full ersättning till slutdestination (Folkerts C-11/11).

### Kom ihåg

- Schiphol-problem = inte extraordinärt.
- Tre år preskription.

[Ansök gratis](/anmalan).
`,

  'stockholm-paris': `## Försenat flyg Stockholm–Paris? Dina rättigheter

ARN till Paris Charles de Gaulle (CDG) eller Orly (ORY) är ca 1 870 km med Air France, SAS och Norwegian. Ersättningen vid 3+ timmars ankomstförsening är **400 euro per person**.

### Paris CDG — en trafikstark hubb

CDG är Europas näst trafikerade flygplats och har kroniska kapacitetsproblem, personalbrist och ATC-trängsel. Dessa är **förutsebara** operationsproblem och räknas inte som extraordinärt för bolag som hubbar där (Air France).

### Ersättning

**400 €** per passagerare (sträckan ~1 870 km, EU-intern).

- **Par, 3 timmars försening:** 2 × 400 € = **800 €**.
- **Missad Paris–vidare-anslutning på en bokning:** Slutdestinationens ankomsttid räknas (Folkerts C-11/11) → 400 € eller 600 € beroende på slutdestination.

### Preskription och att komma ihåg

Tre år preskription i Sverige. Air France är EU-registrerat = täcks globalt.

[Ansök gratis](/anmalan) — vi driver ärenden mot Air France och SAS.
`,

  'stockholm-berlin': `## Försenat flyg Stockholm–Berlin? Dina rättigheter

ARN till Berlin Brandenburg (BER) är ca 1 020 km med SAS, Ryanair och Eurowings. Ersättningen är **250 euro per person** (under 1 500 km → lägsta nivå).

### Varför 250 euro och inte mer?

Sträckan Stockholm–Berlin är drygt 1 000 km, vilket faller under 1 500 km-gränsen → **250 €** per passagerare vid 3+ timmars försening.

### Typiska problem

- **Berlin Brandenburg-ATC:** BER är ett relativt nytt nav med inledande kapacitetsproblem. Förutsebara problem = inte extraordinärt.
- **Tekniska fel:** Wallentin-Hermann.
- **Ryanair-pilotstrejk:** Inte extraordinärt (Krüsemann).

### Beräkningsexempel

- **Familj på fyra, 3 timmars försening:** 4 × 250 € = **1 000 €**.
- **Par, inställt med 5 dagars varsel:** 2 × 250 € = **500 €**.

[Ansök gratis](/anmalan).
`,

  'stockholm-rom': `## Försenat flyg Stockholm–Rom? Dina rättigheter

ARN till Rom Fiumicino (FCO) eller Ciampino (CIA) är ca 2 400 km med SAS, Ryanair, Norwegian och ITA Airways. Ersättningen är **400 euro per person** vid 3+ timmars ankomstförsening.

### Fiumicino och Ciampino

- **Fiumicino (FCO):** Roms huvudflygplats. Hög trafik, ATC-trängsel sommartid.
- **Ciampino (CIA):** Ryanairs bas i Rom, lägre kapacitet och mer känslig för förseningskedjor.

### Ersättning och beräkning

**400 €** per passagerare (sträckan ~2 400 km, EU-intern).

- **Par, 4 timmars försening:** 2 × 400 € = **800 €**.
- **Familj på fyra, inställt med 3 dagars varsel:** 4 × 400 € = **1 600 €**.

### Preskription

Tre år från flygdagen i Sverige.

[Ansök gratis](/anmalan).
`,

  'stockholm-istanbul': `## Försenat flyg Stockholm–Istanbul? Dina rättigheter

ARN till Istanbul (IST eller SAW) är ca 2 440 km med Turkish Airlines, SAS och Pegasus. Ersättningen är **400 euro per person** — men med en viktig nyans: **EU 261 gäller enbart avgångar från Sverige** (ARN). Returresan från Istanbul med TK täcks **inte** (icke-EU-bolag).

### EU 261 och Turkish Airlines

Turkish Airlines är turkiskt och inte EU-registrerat. Förordningen gäller för TK-avgångar från EU (Sverige, Norden, Europa), men **inte** för TK-avgångar från Turkiet. Flyger du Stockholm→Istanbul och din retur Istanbul→Stockholm: bara utresan täcks av EU 261.

SAS och andra EU-bolag på rutten täcker båda riktningarna.

### Ersättning

**400 €** per passagerare (sträckan ~2 440 km, EU-avgång).

- **Par, 3,5 timmars försening (avgång från ARN med TK):** 2 × 400 € = **800 €**.

### Om du fortsätter till Asien

Flyger du Stockholm–Istanbul–Dubai/Bangkok/New York på **en bokning** med TK? Om du missar anslutningen i Istanbul och anländer 3+ timmar sent till slutdestinationen → ersättning baseras på slutdestinationens sträcka (600 € om >3 500 km), **eftersom avgången skedde från EU (Folkerts-principen)**.

[Ansök gratis](/anmalan) — vi hanterar Turkish Airlines-ärenden.
`,

  'stockholm-new-york': `## Försenat flyg Stockholm–New York? Dina rättigheter

ARN till New York (JFK eller EWR) är ca 6 650 km med SAS, Norwegian och amerikanska bolag (United, Delta). Ersättningen är **600 euro per person** — det högsta möjliga beloppet under EU 261.

### 600 euro — varför?

Sträckor över 3 500 km utanför EU → fast ersättning **600 €** per passagerare. En familj på fyra som drabbas kan ha rätt till 4 × 600 € = **2 400 €** (ca 27 000 kr).

### Vilka flygbolag täcks?

- **SAS och Norwegian:** EU-registrerade, täcks globalt — inklusive returresan New York→Stockholm.
- **United och Delta:** Ej EU-registrerade, täcks **enbart** vid avgångar från Sverige (ARN→JFK) — inte på returresan.

### Vanliga förseningsorsaker

- **Transatlantiska rutter:** Väderfront över Atlanten kan vara extraordinärt — kräver dokumentation om faktisk påverkan.
- **JFK-ATC:** New York-hubben är en av världens mest trafikerade och kapacitetsproblem är förutsebara.
- **Tekniska fel:** Van der Lans (C-257/14) — tillverkarens fel är inte extraordinärt.

### Beräkningsexempel

- **Par, inställt med 8 dagars varsel (SAS):** 2 × 600 € = **1 200 €**.
- **Ensamresenär, 4 timmars försening vid ankomst JFK:** 1 × 600 € = **600 €**.

### Preskription

Tre år från flygdagen i Sverige.

[Ansök gratis](/anmalan) — vi driver transatlantiska ärenden mot SAS, Norwegian och US-bolag.
`,

  'stockholm-dubai': `## Försenat flyg Stockholm–Dubai? Dina rättigheter

ARN till Dubai (DXB) är ca 5 180 km med Emirates, Finnair och SAS. Ersättningen är **600 euro per person** vid 3+ timmars ankomstförsening.

### Emirates och EU 261

Emirates är ett emiratiskt bolag och **inte** EU-registrerat. EU 261 gäller för Emirates-avgångar från Sverige (ARN→DXB), men **inte** för returresan DXB→ARN. Finnair och SAS är EU-registrerade och täcks i båda riktningar.

### Ersättning

**600 €** per passagerare (sträckan >3 500 km).

- **Par, 4 timmars ankomstförsening (ARN→DXB med Emirates):** 2 × 600 € = **1 200 €**.
- **Familj på fyra (Finnair, SAS, båda riktningar täcks):** 4 × 600 € = **2 400 €**.

### Dubai som nav

Emirates använder DXB som global nav med tät avgångsfrekven. Förseningar på andra inkommande flygplan kan kaskaderas, men "inkommande plan försenat" är **inte** automatiskt extraordinärt om det gäller egna rutter.

### Preskription

Tre år i Sverige.

[Ansök gratis](/anmalan).
`,

  'stockholm-bangkok': `## Försenat flyg Stockholm–Bangkok? Dina rättigheter

ARN till Bangkok Suvarnabhumi (BKK) är ca 8 650 km med Finnair och SAS (typiskt via Helsinki eller Frankfurt). Ersättningen är **600 euro per person** — det maximala EU 261-beloppet.

### En bokning till Bangkok

Om du flyger Stockholm–Helsingfors–Bangkok med Finnair på en bokning och missar anslutningen i HEL, räknas ankomsttiden till Bangkok (Folkerts C-11/11). Landar du 3+ timmar sent i BKK → 600 € per person.

### Ersättning

**600 €** per passagerare (sträckan >3 500 km, Finnair/SAS är EU-registrerade).

- **Par, missad anslutning i HEL, 5 timmar sen till BKK:** 2 × 600 € = **1 200 €**.

### Preskription

Tre år i Sverige.

[Ansök gratis](/anmalan).
`,

  'stockholm-athen': `## Försenat flyg Stockholm–Aten? Dina rättigheter

ARN till Aten Venizelos (ATH) är ca 2 680 km med Aegean Airlines, Ryanair och SAS. Ersättningen är **400 euro per person** vid 3+ timmars ankomstförsening.

### Vanliga problem

- **Aegean Airlines och ATH-kapacitet:** Atens flygplats är hårt belastad sommar och påsk. Förutsebara kapacitetsproblem = inte extraordinärt.
- **Tekniska fel:** Wallentin-Hermann.

### Ersättning

**400 €** per passagerare (sträckan ~2 680 km, EU-intern).

- **Par, 3 timmars försening:** 2 × 400 € = **800 €**.
- **Familj på fyra, inställt med 5 dagars varsel:** 4 × 400 € = **1 600 €**.

### Preskription

Tre år i Sverige.

[Ansök gratis](/anmalan).
`,

  'stockholm-lissabon': `## Försenat flyg Stockholm–Lissabon? Dina rättigheter

ARN till Lissabon (LIS) är ca 3 120 km med TAP Air Portugal, Ryanair och SAS. Ersättningen är **400 euro per person** vid 3+ timmars ankomstförsening.

### TAP och pilotstrejker

TAP prövades i EU-domstolen (C-28/20) angående pilotstrejker — resultatet: egna pilotstrejker är **inte extraordinärt**. Om ditt TAP-flyg ställdes in pga pilotstrejk har du rätt till kompensation.

### Ersättning

**400 €** per passagerare (sträckan ~3 120 km, EU-intern).

- **Par, 3,5 timmars försening med TAP:** 2 × 400 € = **800 €**.

### Lissabon som nav för Brasilien

Flyger du vidare till Sao Paulo/Rio med TAP på en bokning? Om slutdestinationen nås 3+ timmar sent → 600 € per person (sträckan >3 500 km).

[Ansök gratis](/anmalan).
`,

  'stockholm-madrid': `## Försenat flyg Stockholm–Madrid? Dina rättigheter

ARN till Madrid Barajas (MAD) är ca 2 900 km med Iberia, SAS, Ryanair och Vueling. Ersättningen är **400 euro per person** vid 3+ timmars ankomstförsening.

### Iberia och vidare Latinamerika

Iberia hubbar i Madrid och flyger vidare till Sao Paulo, Buenos Aires, Bogota, Lima, Mexico City. Flyger du Stockholm–Madrid–Buenos Aires på en bokning och anländer 3+ timmar sent? 600 € per person (Folkerts-principen, slutdestination >3 500 km).

### Ersättning

**400 €** (Stockholm–Madrid, ~2 900 km) eller **600 €** (vidare till Latinamerika, en bokning).

- **Par, 4 timmars försening i Madrid:** 2 × 400 € = **800 €**.
- **Familj på fyra, missad vidare till Buenos Aires (en bokning):** 4 × 600 € = **2 400 €**.

[Ansök gratis](/anmalan).
`,

  'goteborg-london': `## Försenat flyg Göteborg–London? Dina rättigheter

Göteborg Landvetter (GOT) till London (LGW/LHR) är ca 1 290 km med Ryanair och British Airways. Ersättningen är **250 euro per person** (sträckan under 1 500 km).

### Varför 250 euro?

Sträckan Göteborg–London är under 1 500 km → fast ersättning **250 €** per passagerare. Biljettpris saknar betydelse.

### British Airways och Brexit

BA-avgångar från Göteborg (EU) täcks av EU 261. Ryanair är EU-registrerat och täcks fullt ut.

### Beräkningsexempel

- **Par, 3 timmars försening:** 2 × 250 € = **500 €**.
- **Familj på fyra, inställt med 6 dagars varsel:** 4 × 250 € = **1 000 €**.

### Preskription

Tre år i Sverige.

[Ansök gratis](/anmalan).
`,
};

exports.up = async function (knex) {
  const hasContent = await knex.schema.hasColumn('routes', 'content');
  if (!hasContent) {
    await knex.schema.table('routes', (table) => {
      table.text('content').nullable();
    });
  }

  for (const [slug, content] of Object.entries(ROUTES)) {
    const exists = await knex('routes').where({ slug }).first('id');
    if (!exists) continue;
    await knex('routes').where({ slug }).update({ content, updated_at: NOW });
  }
};

exports.down = async function (knex) {
  await knex.schema.table('routes', (table) => {
    table.dropColumn('content');
  });
};
