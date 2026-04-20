'use strict';

const NOW = new Date('2026-04-20T10:00:00.000Z').toISOString();

function guide(fields) {
  return Object.assign(
    {
      type: 'guide',
      status: 'published',
      schema_type: 'FAQPage',
      faq_json: null,
      affiliate_ref: null,
      created_at: NOW,
      updated_at: NOW,
    },
    fields
  );
}

const ARTICLES = [

  // ══════════════════════════════════════════════════════════════════
  //  KLUSTER 1: FÖRSENAT FLYG
  // ══════════════════════════════════════════════════════════════════

  guide({
    slug: 'forsening',
    parent_slug: null,
    title: 'Försenat flyg — din rätt till ersättning enligt EU 261',
    meta_title: 'Försenat flyg: upp till 600€ i ersättning | FlightClaim',
    meta_desc: 'Har ditt flyg blivit försenat? Du kan ha rätt till upp till 600€ per person enligt EU 261/2004. Komplett guide om när och hur du kan kräva ersättning.',
    category: 'forsening',
    schema_type: 'FAQPage',
    faq_json: JSON.stringify([
      {
        q: 'När har jag rätt till ersättning för försenat flyg?',
        a: 'Du har rätt till ersättning när ditt flyg anländer mer än tre timmar försenat vid slutdestinationen, flyget avgick från en EU-flygplats, eller flygbolaget är registrerat inom EU (gäller även ankomster till EU). Förseningen ska inte bero på extraordinära omständigheter som bolaget inte kunde råda bot på.'
      },
      {
        q: 'Hur mycket ersättning kan jag få för försenat flyg?',
        a: 'Ersättningen är: €250 för flyg under 1 500 km, €400 för flyg inom EU över 1 500 km och alla andra flyg 1 500–3 500 km, €600 för flyg utanför EU över 3 500 km. Vid försening 3–4 timmar på de längsta sträckorna kan beloppet halveras till €300.'
      },
      {
        q: 'Hur länge kan jag vänta med att ansöka om ersättning?',
        a: 'Preskriptionstiden varierar per land. I Sverige preskriberas flygkrav efter 3 år. Det innebär att du kan kräva ersättning för flyg som försenades upp till 3 år bakåt i tiden.'
      },
      {
        q: 'Kan flygbolaget vägra betala om de hänvisar till extraordinära omständigheter?',
        a: 'Ja — om bolaget kan bevisa att förseningen orsakades av extraordinära omständigheter de inte kunde undvika. Men bevisbördan ligger på flygbolaget. Tekniska fel på planet räknas normalt inte som extraordinärt. Väder, politisk instabilitet och luftrumsrestriktioner kan godkännas.'
      },
      {
        q: 'Måste jag ha biljettkvittot för att ansöka?',
        a: 'Du behöver inte originalkvittot men det underlättar. Flygbolagen kan spåra din bokning via namn och bokningsnummer. Har du mejl från bolaget, banktransaktion eller boarding pass räcker det som underlag.'
      },
    ]),
    content: `Ditt flyg landade tre timmar för sent — eller kom aldrig alls. Irriterande, ja. Men också ett scenario där EU-rätten ger dig ett tydligt skydd. Sedan 2005 gäller [EU-förordning 261/2004](https://eur-lex.europa.eu/legal-content/SV/TXT/?uri=CELEX:32004R0261) för alla flygresenärer i Europa — och den kan ge dig upp till **600€ i ersättning per person**.

## Vad säger lagen?

EU 261/2004 ger passagerare rätt till fast ekonomisk kompensation, assistans (mat, dryck, hotell) och ombokning när ett flyg försenar, ställs in eller nekar ombordstigning. Förordningen gäller om:

- Flyget **avgick från en EU-flygplats** (oavsett vilket bolag), eller
- Flyget **anlände till EU** med ett EU-registrerat bolag (t.ex. SAS, Ryanair, Norwegian).

## Tre timmars gränsen

Det viktigaste att förstå: det är **ankomsttiden** vid slutdestinationen som räknas — inte avgångstiden. Dörröppningen vid destinationen räknas som officiell ankomst.

Är flyget mer än **tre timmar** försenat? Då har du normalt rätt till ersättning.

## Hur mycket kan du få?

| Flygsträcka | Ersättning |
|---|---|
| Under 1 500 km | **€250** per person |
| 1 500–3 500 km (inom EU) | **€400** per person |
| 1 500–3 500 km (utanför EU) | **€400** per person |
| Över 3 500 km (utanför EU) | **€600** per person |

> **OBS:** Vid försening 3–4 timmar på flyg över 3 500 km kan beloppet halveras till €300 om flygbolaget erbjöd alternativ transport och du anlände högst 4 timmar senare än planerat.

Läs mer om hur beloppen beräknas i guiden [Hur mycket ersättning kan jag få för försenat flyg?](/forsening/hur-mycket).

## Extraordinära omständigheter — när gäller inte lagen?

Flygbolagen är inte skyldiga att betala om förseningen orsakades av **extraordinära omständigheter** som de inte rimligen kunde undvika. Det kan vara:

- Allvarliga väderförhållanden (storm, tjock dimma)
- Politisk instabilitet, terrorhot
- Strejk hos flygplatspersonal eller ATC
- Säkerhetsincidenter utanför bolagets kontroll

**Gäller inte som extraordinärt:**

- Tekniska fel på planet (EU-domstolen: *Wallentin-Hermann* C-549/07)
- Strejk bland bolagets egna anställda (*TUI m.fl.* C-28/20)
- Kommersiella beslut som schemaläggning och överbookning

Läs mer om hur extraordinära omständigheter faktiskt bedöms i praktiken → [Försenat flyg: bevisning och extraordinära omständigheter](/forsening/bevisning).

## Rätt till assistans under väntetiden

Utöver ekonomisk ersättning har du rätt till **kostnadsfri assistans** under väntetiden om förseningen är:

- **2+ timmar** (kortdistans under 1 500 km): måltider och förfriskningar
- **3+ timmar** (medeldistans 1 500–3 500 km): måltider och förfriskningar
- **4+ timmar** (långdistans 3 500+ km): måltider och förfriskningar
- **Övernattning krävs**: hotell och transfer till/från hotellet

Spara alla kvitton — du kan kräva dessa kostnader separat.

## Tre år bakåt i tiden

Den svenska preskriptionstiden för flygkrav är **tre år**. Det innebär att du kan söka ersättning för flyg som försenades under de senaste tre åren — även om bolaget aldrig hörde av sig.

Se [tidsgränsen för att kräva ersättning](/forsening/tidsgrans) för detaljer per land och bolag.

## Vanligaste misstagen

Många resenärer gör fel när de kräver ersättning och missar pengarna. De vanligaste fällorna:

1. **Accepterar resepoäng istället för pengar** — du har alltid rätt till kontant ersättning
2. **Ger upp vid första avslaget** — många flygbolag avslår automatiskt i hopp om att resenären ger upp
3. **Väntar för länge** — preskriptionstiden tickar
4. **Dokumenterar inte** — foton av skyltarna, screenshot av app-notiser och sparade mejl är guld värda

Läs [5 misstag som kostar dig ersättningen](/blogg/vanligaste-misstagen) för fullständig genomgång.

## Så ansöker du

1. [Fyll i vårt formulär](/anmalan) med flyginformation
2. Vi granskar om du uppfyller kriterierna kostnadsfritt
3. Vi driver ärendet mot flygbolaget — du betalar ingenting om vi inte lyckas
4. Ersättningen betalas ut direkt till ditt konto

Vi tar **25% + moms** vid framgångsrikt ärende — ingen risk för dig.
`,
  }),

  guide({
    slug: 'forsening/hur-mycket',
    parent_slug: 'forsening',
    title: 'Hur mycket ersättning kan du få för försenat flyg?',
    meta_title: 'Ersättning försenat flyg: €250, €400 eller €600? | FlightClaim',
    meta_desc: 'Exakt hur mycket du kan få i ersättning för försenat flyg beror på flygsträckan. Komplett guide med belopp, beräkningsexempel och halvering vid lång sträcka.',
    category: 'forsening',
    schema_type: 'FAQPage',
    faq_json: JSON.stringify([
      {
        q: 'Vad är det maximala ersättningsbeloppet för försenat flyg?',
        a: '600€ per person — för flyg utanför EU på sträckor över 3 500 km. Det är det juridiskt fastställda maxbeloppet enligt EU 261/2004.'
      },
      {
        q: 'Kan ersättningen halveras?',
        a: 'Ja. På flyg över 3 500 km kan beloppet halveras till 300€ om flygbolaget erbjöd ombokning och du anlände högst 4 timmar senare än det ursprungliga schemat. Flygbolaget måste bevisa att kriteriet uppfylls.'
      },
      {
        q: 'Gäller ersättningen per person eller per bokning?',
        a: 'Per person. Om ni är fyra passagerare på samma bokning som alla drabbas av samma försening har ni rätt till fyra separata ersättningar.'
      },
      {
        q: 'Räknas flygsträckan med eller mot vinden?',
        a: 'Sträckan mäts alltid som kortaste avstånd ("great circle distance") mellan avreseflygplats och slutdestination, oavsett faktisk rutt. Det är den raka linjen på kartan.'
      },
      {
        q: 'Kan jag kräva mer än fastställt belopp?',
        a: 'Inte via EU 261 — beloppen är fasta. Men du kan komplettera med en separat talan i allmän domstol om du haft faktiska skador som överstiger EU 261-beloppet, t.ex. missad konferens med dokumenterade förluster.'
      },
    ]),
    content: `EU 261/2004 fastställer tre fasta ersättningsnivåer. Vilket belopp du har rätt till beror uteslutande på **flygsträckan** — inte på vad biljetten kostade, hur länge du väntade (så länge det var 3+ timmar) eller vilket bolag det var.

## De tre ersättningsnivåerna

| Flygsträcka | Ersättning |
|---|---|
| Under 1 500 km | **€250** per person |
| Inom EU: 1 500 km eller mer | **€400** per person |
| Utanför EU: 1 500–3 500 km | **€400** per person |
| Utanför EU: över 3 500 km | **€600** per person |

Sträckan mäts som fågelvägen (great circle distance) mellan avreseflygplats och **slutdestination** — inte mellanlandningsorten.

## Konkreta exempel

### Stockholm → Malmö (ca 450 km)
Typiskt Arlanda–Sturup eller Bromma–Sturup. **€250** per person.

### Stockholm → London (ca 1 740 km)
Över 1 500 km, EU-intern rutt. **€400** per person.

### Stockholm → New York (ca 6 300 km)
Utanför EU, över 3 500 km. **€600** per person — men potentiell halvering gäller.

### Göteborg → Bangkok (ca 9 300 km)
Utanför EU, över 3 500 km. **€600** per person.

## När kan beloppet halveras?

På flyg **utanför EU med sträcka över 3 500 km** (€600-nivån) kan flygbolaget halvera till **€300** om:

1. De erbjöd ombokning till alternativt flyg, **och**
2. Du anlände till slutdestinationen **högst 4 timmar** efter ursprunglig schemalagd tid.

Båda villkoren måste uppfyllas. Flygbolaget bär bevisbördan. Om de inte kan visa att de erbjöd ombokning i tid är full ersättning på €600 gällande.

## Per person — inte per bokning

Varje passagerare på bokningen har rätt till sin egen ersättning. Fyra resenärer på ett Stockholm–Barcelona-flyg med 4 timmars försening = **4 × €400 = 1 600€** totalt.

Barn räknas med om de haft en betald biljett. Spädbarn som flyger på förälders knä utan egen biljett omfattas normalt inte.

## Utöver ersättningen: assistansrätten

Oavsett om du har rätt till ekonomisk ersättning har du alltid rätt till **kostnadsfri mat och dryck** vid väntetider på 2 timmar eller mer. Flygbolaget ska erbjuda detta på plats — eller ersätta rimliga kostnader mot kvitto om de misslyckas med att ordna det.

Kräver förseningen övernattning har du rätt till hotell och transfer.

## Skattepliktig ersättning?

I Sverige är ersättning enligt EU 261 inte skattepliktig inkomst. Den betraktas som skadestånd, inte lön eller kapitalinkomst.

## Ansök om din ersättning

Vet du inte exakt hur sträckan mäts eller om du uppfyller kraven? [Fyll i formuläret](/anmalan) — vi gör en gratis bedömning och driver sedan ärendet om du kvalificerar.
`,
  }),

  guide({
    slug: 'forsening/tidsgrans',
    parent_slug: 'forsening',
    title: 'Hur länge kan du vänta med att kräva ersättning för försenat flyg?',
    meta_title: 'Tidsgräns ersättning försenat flyg — 3 år i Sverige | FlightClaim',
    meta_desc: 'I Sverige har du 3 år på dig att kräva ersättning för försenat eller inställt flyg. Läs om preskriptionstider per land och vad du bör göra nu.',
    category: 'forsening',
    schema_type: 'FAQPage',
    faq_json: JSON.stringify([
      {
        q: 'Hur länge har jag på mig att kräva ersättning för försenat flyg i Sverige?',
        a: 'I Sverige gäller en preskriptionstid på 3 år för fordringar mot flygbolag enligt EU 261/2004. Tiden räknas från dagen för den planerade avgången.'
      },
      {
        q: 'Kan jag kräva ersättning för ett flyg som var försenat för 2 år sedan?',
        a: 'Ja, om flyget avgick från en EU-flygplats eller med ett EU-bolag och förseningen uppstod inom de senaste 3 åren. Samla ihop bokningsunderlag, boarding pass eller mejl från flygbolaget som bevis.'
      },
      {
        q: 'Vad händer om preskriptionstiden löper ut?',
        a: 'Löper preskriptionstiden ut förlorar du normalt rätten att kräva ersättning — även om du juridiskt sett hade haft rätt. Flygbolag kan invända preskription i domstol och ärendet avvisas då.'
      },
      {
        q: 'Varierar preskriptionstiden beroende på vilket land flyget avgick från?',
        a: 'Ja. Preskriptionstiden regleras av nationell lagstiftning. Storbritannien tillämpar 6 år, Frankrike 5 år, Tyskland 3 år, Sverige 3 år. Flygbolagets hemland spelar normalt ingen roll — det är avgångslandet som är avgörande.'
      },
    ]),
    content: `Många resenärer vet inte att de kan kräva ersättning för förseningar som hände för länge sedan. EU-rätten sätter inga egna tidsgränser — det är **nationell rätt** som avgör hur länge du kan vänta.

## Sverige: 3 år

I Sverige preskriberas fordringar mot flygbolag efter **3 år** räknat från dagen för den planerade avgången. Det innebär att ett flyg som försenades den 15 april 2023 kan krävas senast 15 april 2026.

## Preskriptionstider per land

| Land | Preskriptionstid | Rättslig grund |
|---|---|---|
| Sverige | 3 år | Preskriptionslagen (1981:130) |
| Frankrike | 5 år | Code de l'aviation civile |
| Spanien | 5 år | Código Civil art. 1964 |
| Italien | 2 år | Codice della Navigazione |
| Polen | 1 år | Prawo lotnicze |
| Österrike | 3 år | ABGB |
| Belgien | 1 år | Code judiciaire |

**Vilket lands preskriptionstid gäller?** Vid avgång från t.ex. Spanien med ett europeiskt bolag kan spansk preskriptionstid tillämpas. Det är inte alltid självklart och beror på vilken domstol ärendet prövas i.

## Bevisbördan och äldre ärenden

Ju äldre ärendet är, desto svårare kan det vara att dokumentera. Men du behöver inte originalkvittot:

- **Bokningsbekräftelse** via e-post (de flesta e-postleverantörer sparar i år)
- **Kontoutdrag** som visar biljettkostnaden
- **Boarding pass** — ofta sparade som PDF i mejl
- **Flygbolagens bokningssystem** — de kan nästan alltid spåra din bokning med namn + bokningsnummer

Flygbolagen sparar flightdata under lång tid. Vi kan i de flesta fall verifiera förseningen utan att du behöver leta fram egna handlingar.

## Avbryter en klagan preskriptionstiden?

Att kontakta flygbolaget direkt eller lämna in ett klagomål till Konsumentverket/ARN **avbryter inte** preskriptionstiden i sig. Preskriptionen avbryts först när du:

1. Lämnar in stämningsansökan till tingsrätt, **eller**
2. Bolaget skriftligen erkänner skulden, **eller**
3. Parterna ingår ett avtal om att avbryta preskriptionen.

Om preskriptionstiden är nära bör ärendet skickas vidare till domstol — inte bara klagas på hos bolaget.

## Vänta inte

Om du vet att du hade ett försenat flyg för 2–3 år sedan — **agera nu**. Preskriptionstiden tickar. Det tar ofta 6–12 månader från anmälan till utbetalning om ärendet behöver drivas hårt.

[Ansök om ersättning gratis →](/anmalan)
`,
  }),

  guide({
    slug: 'forsening/bevisning',
    parent_slug: 'forsening',
    title: 'Hur bevisar du din rätt till ersättning för försenat flyg?',
    meta_title: 'Bevisa försenat flyg: handlingar och extraordinära omständigheter | FlightClaim',
    meta_desc: 'Vad behöver du för att bevisa ett flygkrav — och när kan flygbolaget undvika att betala? Komplett guide om bevisbörda och extraordinära omständigheter.',
    category: 'forsening',
    schema_type: 'FAQPage',
    faq_json: JSON.stringify([
      {
        q: 'Vad behöver jag för att bevisa ett försenat flyg?',
        a: 'Du behöver i princip bara bokningsbekräftelse (namn + bokningsnummer) och kunna ange datum och avgångsplats. Flygbolagens system bekräftar förseningen. Boarding pass, mejl om förseningen och kvitton på utlägg under väntetiden stärker ärendet.'
      },
      {
        q: 'Vem bär bevisbördan för extraordinära omständigheter?',
        a: 'Flygbolaget. Det är bolaget som måste bevisa att förseningen orsakades av extraordinära omständigheter som de inte rimligen kunde undvika. Du behöver inte bevisa att det inte var extraordinärt — de måste bevisa att det var det.'
      },
      {
        q: 'Räknas tekniska fel som extraordinärt?',
        a: 'Normalt inte. EU-domstolen slog fast i målet Wallentin-Hermann (C-549/07) att tekniska problem hörande till flygbolagets normala verksamhet inte är extraordinärt. Undantag kan göras för dolda fabrikationsfel som inte kan spåras på rutin.'
      },
      {
        q: 'Gäller ersättningen om ett tidigare flyg orsakat kedjeförsening?',
        a: 'Ja. Om ett flygplan försenades på en tidigare sträcka och det är orsaken till din försening ansvarar bolaget ändå, eftersom det är ett normalt operativt problem. Undantag gäller bara om orsaken till den första förseningen var extraordinär.'
      },
    ]),
    content: `En av de vanligaste anledningarna till att resenärer inte får sin ersättning är inte att de saknar rätt — utan att de ger upp när flygbolaget skickar ett standardavslag med hänvisning till "extraordinary circumstances". Här är vad du behöver veta om bevisbördan.

## Du behöver väldigt lite för att styrka grundanspråket

För att ett EU 261-krav ska vara giltigt behöver du kunna visa:

1. **Att du var passagerare** — bokningsbekräftelse eller boarding pass
2. **Att flyget var försenat 3+ timmar** — flygbolagets egna system dokumenterar detta

Det är allt. Det är flygbolaget som måste motbevisa att de är skyldiga att betala.

## Omvänd bevisbörda för extraordinära omständigheter

EU-domstolen (mål C-12/11, *McDonagh*) har bekräftat att bevisbördan ligger på flygbolaget. De måste:

- Identifiera den specifika händelsen
- Visa att den var extraordinär (utanför normal verksamhet)
- Visa att de vidtog alla rimliga åtgärder för att undvika förseningen

Standardsvar som "vi hänvisar till extraordinary circumstances" utan specificering godtas inte av domstolarna.

## Tekniska fel — en vanlig missbedömning

**Räknas inte:**
- Motorfel, hydraulikproblem, avionic-fel = normalt underhåll
- Slitage på delar = förväntat operativt problem
- Sen leverans av reservdel = bolagets ansvar att hålla delar i lager

**Kan räknas:**
- Dolda fabrikationsdefekter som inte kan spåras med rimlig underhållsrutin (bevisad undantagsfall)
- Kollisionsskada från föremål på start-/landningsbana (utanför bolagets kontroll)

## Väder — inte alltid extraordinärt

Väder är inte automatiskt extraordinärt. Bolaget måste visa att:

- Vädret var exceptionellt (inte normalt vinterflyg)
- De inte kunde undvika förseningen trots alla rimliga åtgärder
- Exakt detta flyg drabbades (inte bara att det var dåligt väder den dagen generellt)

En dimma som stängde en flygplats kan vara extraordinärt. Lätta snöförhållanden i Stockholm i december är normalt.

## Strejk — beror på vem som strejkar

| Strejktyp | Extraordinärt? |
|---|---|
| Flygbolagets egna piloter | **Nej** (EU-dom C-28/20, *TUI m.fl.*) |
| Flygbolagets egna kabinpersonal | **Nej** |
| Flygplatspersonal (säkerhet, bagagehantering) | **Ja** |
| Flygkontroll (ATC) | **Ja** |
| Generell samhällsstrejk | **Ja** |

## Dokumentation som stärker ditt ärende

Samla in och spara:

- **Skärmbilder** av bolagets app med forsening/inställning
- **SMS/mejl** om ändrad avgångstid
- **Kvitton** för mat, dryck, hotell under väntetiden
- **Boarding pass** (digital eller papper)
- **Foton** av informationsskyltar på flygplatsen

Har du ingenting alls? Vi kan i de flesta fall styrka förseningen via offentliga flightdata-databaser.

## Krav på rimliga åtgärder

Även om en extraordinär händelse inträffar befriar det inte automatiskt bolaget. De måste ha vidtagit **alla rimliga åtgärder** för att minimera förseningen. Hade bolaget t.ex. ett reservplan tillgängligt? Erbjöd de ombokning i tid?

[Ansök gratis — vi granskar om du har rätt](/anmalan)
`,
  }),

  // ══════════════════════════════════════════════════════════════════
  //  KLUSTER 2: INSTÄLLT FLYG
  // ══════════════════════════════════════════════════════════════════

  guide({
    slug: 'installda-flyg',
    parent_slug: null,
    title: 'Inställt flyg — dina rättigheter och rätt till ersättning',
    meta_title: 'Inställt flyg: ersättning och rättigheter enligt EU 261 | FlightClaim',
    meta_desc: 'Inställt flyg? Du har rätt till ombokning, återbetalning och upp till 600€ i ersättning. Komplett guide om vad som gäller och hur du kräver det.',
    category: 'installda-flyg',
    schema_type: 'FAQPage',
    faq_json: JSON.stringify([
      {
        q: 'Har jag alltid rätt till ersättning när flyget ställs in?',
        a: 'Nej, inte alltid. Du har rätt till ersättning om du fick besked om inställningen kortare än 14 dagar innan avgång och inställningen inte berodde på extraordinära omständigheter. Fick du besked mer än 14 dagar i förväg har du däremot rätt till återbetalning av biljettpriset, men inte kompensation.'
      },
      {
        q: 'Vad är skillnaden mellan återbetalning och kompensation?',
        a: 'Återbetalning innebär att du får tillbaka biljettpriset om du väljer att inte resa. Kompensation (€250–€600) är ett fast skadestånd för det besvär inställningen orsakar. Du kan kräva båda om du uppfyller kriterierna.'
      },
      {
        q: 'Mitt flyg ställdes in med 10 dagars varsel. Har jag rätt till ersättning?',
        a: 'Ja, under förutsättning att bolaget inte erbjöd alternativ transport med avgång/ankomst inom vad lagen specificerar (inom 1 timma/2 timmar av ursprunglig tid). Fick du ett alternativ som uppfyller tidskraven kan kompensationen reduceras eller bortfalla.'
      },
      {
        q: 'Flygbolaget erbjöd mig ombokning — förlorar jag då rätten till ersättning?',
        a: 'Det beror på vilken ombokning de erbjöd och om du accepterade. Du kan acceptera ombokning och ändå kräva kompensation om alternativflygtet avviker mer än vad lagen tillåter. Accepterar du ombokning som uppfyller lagens krav kan rätten till kompensation bortfalla.'
      },
      {
        q: 'Har jag rätt till mat och hotell vid inställt flyg?',
        a: 'Ja. Om du väljer att boka om och behöver vänta på nästa tillgängliga flyg har du rätt till måltider, förfriskningar, hotellinkvartering (vid övernattning) och transfertransport. Flygbolaget ska tillhandahålla detta — kan de inte det, spara kvitton för ersättning.'
      },
    ]),
    content: `Att komma till flygplatsen och mötas av inställd avgång är en av de mest stressande situationerna som kan uppstå under en resa. Men EU 261/2004 ger dig tydliga rättigheter — och flygbolaget har strikta skyldigheter.

## Dina tre grundläggande rättigheter

Oavsett anledning till inställningen har du alltid rätt att välja mellan:

1. **Återbetalning** — hela biljettpriset tillbaka inom 7 dagar
2. **Ombokning** — till nästa tillgängliga flygning på liknande villkor, utan extra kostnad
3. **Ombokning till senare datum** — om det passar dig bättre

Dessa rättigheter gäller alltid, även vid extraordinära omständigheter.

## När har du rätt till kompensation?

Kompensation (det fasta beloppet €250–€600) gäller utöver återbetalning/ombokning och betalas ut när:

- Du fick besked om inställningen **kortare än 14 dagar** före avgång, **och**
- Inställningen **inte** orsakades av extraordinära omständigheter

| Besked fick du | Kompensation? |
|---|---|
| Mer än 14 dagar i förväg | Nej — bara återbetalning/ombokning |
| 7–13 dagar i förväg | Ja, om alternativ avgång avviker för mycket |
| 0–6 dagar i förväg | Ja, om alternativ avgång avviker för mycket |

Läs om detaljerna kring sent besked i [Inställt flyg med kort varsel — dina rättigheter](/installda-flyg/sent-besked).

## Hur mycket kan du få i kompensation?

Samma belopp som vid förseningar:

| Flygsträcka | Kompensation |
|---|---|
| Under 1 500 km | €250 per person |
| 1 500–3 500 km | €400 per person |
| Över 3 500 km (utanför EU) | €600 per person |

## Assistans under väntetiden

Väljer du ombokning har du rätt till kostnadsfri hjälp under väntetiden:

- **Måltider och förfriskningar** i rimlig proportion till väntetiden
- **Två kostnadsfria telefonsamtal, fax eller e-post**
- **Hotellinkvartering** om övernattning krävs
- **Transfer** till och från hotellet

Flygbolaget ska erbjuda detta aktivt. Missar de det — spara kvitton. Du kan kräva rimliga kostnader i efterhand.

## Extraordinära omständigheter

Flygbolaget kan slippa kompensation (men inte assistans eller återbetalning) om inställningen orsakades av extraordinärt. Samma regler gäller som vid försening:

- **Gäller:** extremt väder, luftrumsrestriktioner, politisk instabilitet
- **Gäller inte:** tekniska fel på planet, bolagets egna strejker, överbookning

Mer om detta i [Force majeure och inställt flyg — när slipper flygbolaget betala?](/installda-flyg/force-majeure)

## Skillnaden mellan återbetalning och kompensation

En vanlig missuppfattning: om flygbolaget ger tillbaka biljettpriset anser de sig klara. Det stämmer inte. Återbetalning och kompensation är **separata skyldigheter**. Du kan ha rätt till båda.

Läs mer: [Återbetalning eller kompensation — det är inte samma sak](/blogg/aterbetalning-vs-kompensation)

## Ombokning — men på vilka villkor?

Om du accepterar ombokning och flyget avgår och anländer nära ursprungstiden kan kompensationen reduceras. Men om alternativflygtet:

- Avgår mer än 2 timmar tidigare, **eller**
- Anländer mer än 4 timmar senare

...har du fortfarande rätt till full kompensation utöver ombokningen.

Mer om detta: [Ombokat flyg vid inställning — dina rättigheter](/installda-flyg/ombokat)

## Ansök gratis

Vi granskar ditt ärende kostnadsfritt och driver det mot flygbolaget om du har rätt till ersättning.

[Ansök om ersättning →](/anmalan)
`,
  }),

  guide({
    slug: 'installda-flyg/ombokat',
    parent_slug: 'installda-flyg',
    title: 'Ombokat flyg vid inställning — har du fortfarande rätt till ersättning?',
    meta_title: 'Ombokat vid inställt flyg — rätt till ersättning? | FlightClaim',
    meta_desc: 'Accepterade du ombokning när flyget ställdes in? Du kan ändå ha rätt till upp till 600€. Läs vad lagen säger om ombokning och kompensation.',
    category: 'installda-flyg',
    schema_type: 'FAQPage',
    faq_json: JSON.stringify([
      {
        q: 'Kan jag kräva ersättning om jag accepterade ombokning?',
        a: 'Ja, i många fall. Om det ombokade flyget avgår mer än 1 timme tidigare eller anländer mer än 2 timmar senare (vid 7–13 dagars varsel), eller mer än 2/4 timmar vid kortare varsel, har du rätt till kompensation även om du reste med det alternativa flyget.'
      },
      {
        q: 'Flygbolaget erbjöd mig ett alternativ som avgick nästa dag. Har jag rätt till ersättning?',
        a: 'Om du fick besked kortare än 7 dagar i förväg och det ombokade flyget anländer mer än 2 timmar senare än det ursprungliga har du rätt till full kompensation. Avgång nästa dag uppfyller normalt inte lagens krav på alternativ transport.'
      },
      {
        q: 'Vad händer om jag tackar nej till ombokning?',
        a: 'Tackar du nej har du rätt till full återbetalning av biljettpriset. Du kan även kräva ersättning om inställningen skedde med kort varsel och inte berodde på extraordinärt.'
      },
    ]),
    content: `När flyget ställs in är flygbolagets första reaktion ofta att erbjuda ombokning. Många resenärer accepterar — och tror sedan att de gett upp rätten till kompensation. Det stämmer inte alltid.

## Reglerna för ombokning och kompensation

EU 261/2004 artikel 5 definierar när ett ombokat alternativ "räknar" som tillräckligt för att reducera eller ta bort kompensationsrätten:

### Om du fick besked 7–13 dagar i förväg:

Kompensation bortfaller **bara** om det alternativa flyget:
- Avgår **högst 2 timmar** tidigare än ursprungstiden, **och**
- Anländer **högst 4 timmar** senare än ursprungstiden

Uppfylls inte båda — full kompensation (€250–€600).

### Om du fick besked 0–6 dagar i förväg:

Kompensation bortfaller **bara** om det alternativa flyget:
- Avgår **högst 1 timme** tidigare än ursprungstiden, **och**
- Anländer **högst 2 timmar** senare än ursprungstiden

Ännu snävare. Avgång nästa dag uppfyller nästan aldrig detta.

## Praktiskt exempel

Ursprungligt flyg: Stockholm → Rom, avgång 08:00, ankomst 11:30.
Inställt med 5 dagars varsel.
Erbjudet alternativ: Avgång 10:00, ankomst 14:30 (3 timmar senare).

**Resultat:** Ankomst är 3 timmar försenad. Kravet är max 2 timmar. Du har rätt till **€400** i kompensation — även om du reste med det alternativa flyget.

## Accepterade du ombokning via app utan att veta om rättigheterna?

Det spelar ingen roll. Ombokning ogiltigförklarar inte din rätt till kompensation automatiskt. Du kan kräva kompensation i efterhand — upp till preskriptionstidens slut.

## Skillnad mot "frivillig ombokning"

Observera: detta gäller vid **inställda** flyg. Väljer du frivilligt att boka om av privata skäl (inte pga inställning) gäller andra regler.

## Ansök nu

[Fyll i formuläret](/anmalan) — vi bedömer om du kvalificerar, oavsett om du reste med det ombokade flyget eller inte.
`,
  }),

  guide({
    slug: 'installda-flyg/sent-besked',
    parent_slug: 'installda-flyg',
    title: 'Inställt flyg med kort varsel — vad gäller?',
    meta_title: 'Inställt flyg med kort varsel: dina rättigheter | FlightClaim',
    meta_desc: 'Fick du veta att flyget ställdes in kort innan avgång? 14-dagarsregeln och vad du har rätt till. Komplett guide.',
    category: 'installda-flyg',
    schema_type: 'FAQPage',
    faq_json: JSON.stringify([
      {
        q: 'Vad menas med "kort varsel" vid inställt flyg?',
        a: 'EU 261 delar in det i tre kategorier: mer än 14 dagar (inget kompensationskrav), 7–13 dagar (kompensationskrav om alternativet avviker för mycket), samt 0–6 dagar (striktaste kraven på alternativet).'
      },
      {
        q: 'Flyget ställdes in 2 dagar innan avgång. Hur mycket kan jag kräva?',
        a: 'Du har rätt till kompensation (€250–€600) om det alternativa flyget anländer mer än 2 timmar senare än ursprunget — eller om inget alternativ erbjöds. Dessutom har du rätt till assistans och, om du väljer att inte resa, full återbetalning.'
      },
      {
        q: 'Gäller 14-dagarsregeln från bokat datum eller från när jag köpte biljetten?',
        a: 'Från bokat avgångsdatum — inte från köptillfället. Om flyget avgår 10 januari och du fick besked 28 december (13 dagar innan) räknas det som kort varsel.'
      },
    ]),
    content: `14 dagar är den kritiska gränsen i EU 261/2004. Men "kort varsel" är inte bara ett begrepp — det är en skala med olika konsekvenser beroende på hur sent beskedet kom.

## Tre scenarier

### Mer än 14 dagar i förväg
Du har **rätt till återbetalning** (eller ombokning) men **ingen rätt till kompensation**. Bolaget har gett dig tillräckligt med tid att planera om.

### 7–13 dagar i förväg
Du har rätt till kompensation **om** det erbjudna alternativet:
- Avgår mer än 2 timmar tidigare, **eller**
- Anländer mer än 4 timmar senare

Uppfyller alternativet kraven — inget kompensationskrav. Uppfyller det inte — full €250–€600.

### 0–6 dagar i förväg
Du har rätt till kompensation **om** det erbjudna alternativet:
- Avgår mer än 1 timme tidigare, **eller**
- Anländer mer än 2 timmar senare

Striktare. Dag-för-dag-ombokning räcker normalt inte.

## Beräkning av 14-dagarsgränsen

Dagen för avgång räknas **inte** med. Räkna 14 hela kalenderdagar bakåt från avgångsdagen:

- Flyg: 20 april
- 14 dagar bakåt = 6 april (exklusive 20 april)
- Fick du besked **6 april eller tidigare** → utanför kompensationskravet
- Fick du besked **7 april eller senare** → potentiellt krav

## Vad händer på flygplatsen?

Ställs flyget in på flygplatsen (efter att du checkat in) gäller de striktaste reglerna. Du har dessutom rätt till omedelbar assistans — mat, dryck och ombokning — på plats.

Be flygbolaget om en skriftlig bekräftelse på att flyget ställts in och anledningen. Fotografera informationsskärmarna.

## Kan du kräva ersättning om biljetten var extremt billig?

Ja. Ersättningsbeloppet enligt EU 261 är fast och oberoende av biljettpriset. En lågprisbiljett till €19 ger samma €250 i kompensation som en affärsklass-biljett till €2 000.

[Ansök om ersättning — gratis bedömning](/anmalan)
`,
  }),

  guide({
    slug: 'installda-flyg/mat-hotell',
    parent_slug: 'installda-flyg',
    title: 'Mat, hotell och assistans vid inställt flyg — vad har du rätt till?',
    meta_title: 'Mat och hotell vid inställt flyg — dina rättigheter | FlightClaim',
    meta_desc: 'Har du rätt till gratis mat, hotell och transfer när flyget ställs in? Ja — EU 261 garanterar det. Läs vad som gäller och hur du kräver ersättning.',
    category: 'installda-flyg',
    schema_type: 'FAQPage',
    faq_json: JSON.stringify([
      {
        q: 'Har jag rätt till gratis mat när flyget ställs in?',
        a: 'Ja. Du har rätt till måltider och förfriskningar i rimlig proportion till väntetiden — oavsett orsaken till inställningen. Flygbolaget ska ordna detta på flygplatsen eller ersätta rimliga kostnader om de inte kan.'
      },
      {
        q: 'Vad händer om jag tvingas övernatta på grund av inställt flyg?',
        a: 'Du har rätt till gratis hotellinkvartering och transfer till/från hotellet. Flygbolaget ska boka och bekosta detta. Om de inte ordnar det har du rätt att boka själv och kräva ersättning i efterhand mot kvitto.'
      },
      {
        q: 'Hur mycket kan jag kräva i ersättning för mat och hotell?',
        a: 'Det finns inget fast maxbelopp — kostnaden ska vara "rimlig". Hotell behöver inte vara femstjärnigt. Mat vid flygplatsen till normala priser är rimligt. Spara alla kvitton.'
      },
      {
        q: 'Gäller assistansrätten även vid extraordinära omständigheter?',
        a: 'Ja. EU-domstolen slog fast i McDonagh-målet (C-12/11) att rätten till assistans (mat, hotell) gäller oavsett orsak — även vid extraordinärt som vulkanutbrott. Det är bara kompensationsbeloppet som bortfaller vid extraordinärt.'
      },
    ]),
    content: `En sak skiljer sig från kompensationen: rätten till assistans gäller **alltid** — oavsett om inställningen berodde på extraordinärt eller inte. Det slog EU-domstolen fast i det berömda McDonagh-målet 2013.

## Vad du alltid har rätt till

Väljer du att vänta på ombokning (istället för återbetalning) har du rätt till:

- **Måltider och förfriskningar** — i rimlig proportion till väntetiden, kostnadsfritt
- **Två kommunikationer** — telefonsamtal, mejl eller fax
- **Hotell** — om övernattning krävs (ett eller flera nätter)
- **Transfer** — taxi eller buss till och från hotellet

Dessa skyldigheter aktiveras utan att du behöver fråga om dem. Flygbolaget ska proaktivt erbjuda dem.

## "Rimlig proportion" — vad menas?

Lagen anger inte ett maxbelopp. Men:

- **Väntetid 2–3 timmar:** Kaffe, smörgås, vatten = rimligt. Trerötterskälla = inte rimligt.
- **Väntetid 5–8 timmar:** Fullständig lunch/middag = rimligt.
- **Övernattning:** 3–4 stjärnors hotell på rimligt avstånd från flygplatsen = rimligt. Lyxsvit = inte rimligt.

Domstolar har generellt tolererat kostnader på €40–€80 per person och natt för hotell och €15–€30 per person för mat. Avviker du markant uppåt utan skäl riskerar du att inte få allt ersatt.

## Flygbolaget ordnar inget — vad gör du?

1. **Be om skriftlig bekräftelse** på inställningen och deras skyldigheter (vouchers)
2. **Boka själv** om de inte kan ordna det — ta det billigaste rimliga alternativet
3. **Spara alla kvitton** — det är ditt bevis
4. **Kräv ersättning i efterhand** — mejla kvittona till bolaget med krav om ersättning

Dokumentera med foto och skärmbilder. Visa att du inte hade tillgång till maten/hotellet som bolaget skulle ha ordnat.

## McDonagh-domen: gäller till och med vid vulkanutbrott

2010 stängde askmolnet från Eyjafjallajökull europeiskt luftrum i dagar. Många resenärer satt fast i dagar. EU-domstolen slog fast att flygbolagen var skyldiga att tillhandahålla assistans (mat, hotell) under hela perioden — oavsett att orsaken var extraordinär.

Det innebär att flygbolag **inte** kan vägra assistans med hänvisning till extraordinärt. Bara kompensationsbeloppet (€250–€600) kan de undvika.

## Sammanfattning: assistans vs. kompensation

| Rättighet | Vid extraordinärt | Vid normal inställning |
|---|---|---|
| Mat och dryck | **Ja** | **Ja** |
| Hotell (om nödvändigt) | **Ja** | **Ja** |
| Transfer till hotell | **Ja** | **Ja** |
| Kompensation €250–€600 | **Nej** | **Ja** |
| Återbetalning av biljett | **Ja** | **Ja** |

[Ansök om din ersättning gratis →](/anmalan)
`,
  }),

  guide({
    slug: 'installda-flyg/force-majeure',
    parent_slug: 'installda-flyg',
    title: 'Force majeure och inställt flyg — när slipper flygbolaget betala?',
    meta_title: 'Force majeure inställt flyg: när gäller undantaget? | FlightClaim',
    meta_desc: 'När kan flygbolaget slippa betala kompensation med hänvisning till force majeure och extraordinära omständigheter? Komplett juridisk guide.',
    category: 'installda-flyg',
    schema_type: 'FAQPage',
    faq_json: JSON.stringify([
      {
        q: 'Vad menas med extraordinära omständigheter i flygrätten?',
        a: 'Händelser utanför flygbolagets normala verksamhet som de inte rimligen kunde ha undvikit, t.ex. extremt väder, politisk instabilitet, terrorhot, luftrumsrestriktioner och flygplatsstrejker. Tekniska fel och bolagets egna personalstrejker räknas normalt inte.'
      },
      {
        q: 'Hur bevisar flygbolaget extraordinära omständigheter?',
        a: 'Flygbolaget bär bevisbördan. De måste specificera den extraordinära händelsen, visa att den direkt orsakade inställningen och visa att de vidtog alla rimliga åtgärder för att undvika det. Generella hänvisningar till "väder" utan specificering godtas inte.'
      },
      {
        q: 'Kan jag kräva ersättning trots att bolaget hänvisar till force majeure?',
        a: 'Ja, du kan alltid ifrågasätta det. Bevisbördan ligger på bolaget och domstolarna är restriktiva. Kräv skriftlig förklaring och specifik dokumentation av den extraordinära händelsen. Många initiala avslag på force majeure-grunden vinner resenären sedan i domstol.'
      },
      {
        q: 'Räknas COVID-pandemin som extraordinärt?',
        a: 'Generellt ja, men bara för inställningar direkt orsakade av reserestriktioner eller myndighetsbeslut. Inställningar av kommersiella skäl under pandemin (låg efterfrågan utan specifikt myndighetsbeslut) räknas inte som extraordinärt.'
      },
    ]),
    content: `"Force majeure" och "extraordinära omständigheter" används av flygbolag för att slippa betala kompensation. Men undantaget är snävare än de vill ge sken av — och domstolarna har konsekvent begränsat det.

## Vad är extraordinärt enligt EU-domstolen?

EU-domstolen har i ett antal vägledande domar preciserat att extraordinärt kräver två saker:

1. Händelsen är **inte förenlig med flygbolagets normala verksamhet**, och
2. Flygbolaget **hade inte möjlighet att kontrollera händelsen**

Båda kraven måste uppfyllas. Händelser som hör till flygets normala riskbild — tekniska problem, nödvändigt underhåll, kommersiella beslut — uppfyller inte kriterierna.

## Vad räknas som extraordinärt?

**Bekräftade av EU-domstolen och nationella domstolar:**
- Extremt och ovanligt väder (stormar, tjock dimma)
- Politisk instabilitet, krig, terrorhot
- Beslut från luftfartsmyndigheter om luftrumsrestriktioner
- Strejk bland flygplatspersonal (säkerhet, bagagehantering)
- ATC-strejk
- Kollisionsskada orsakad av utomstående

**Avvisade av EU-domstolen:**
- Tekniska fel (Wallentin-Hermann C-549/07)
- Bolagets egna personalstrejker (TUI m.fl. C-28/20)
- Överbookning och kommersiella prioriteringar
- Förseningar i en annan del av nätverket ("ripple effect") om grundorsaken var normal

## Även vid force majeure — dina rättigheter

Det viktigaste att förstå: **force majeure tar bort kompensationsanspråket (€250–€600) men inte assistansrätten**.

| | Force majeure | Normal inställning |
|---|---|---|
| Assistans (mat, hotell) | **Ja** (McDonagh C-12/11) | **Ja** |
| Återbetalning av biljett | **Ja** | **Ja** |
| Kompensation €250–€600 | **Nej** | **Ja** |

## "Rim­liga åtgärder" — ett krav som ofta glöms

Även om en extraordinär händelse inträffar befriar det inte bolaget om de inte vidtog **alla rimliga åtgärder** för att minimera konsekvenserna. Hade de ett reservplan? Kunde de omdirigera via annan flygplats? Erbjöd de snabb ombokning?

Domstolarna har avvisat force majeure-invändningar i fall där bolaget hade möjlighet att begränsa förseningen men valde inte att göra det.

## Vad gör du när bolaget hänvisar till extraordinärt?

1. **Begär skriftlig dokumentation** — exakt vilken händelse, vid vilken tidpunkt, hur den orsakade just ditt flygs inställning
2. **Kontrollera nyheter och flightdata** — var verkligen flygplatsen stängd? Flög andra bolag?
3. **Kräv ändå** — bevisbördan ligger på dem, inte dig
4. **Anlita oss** — vi vet vilka invändningar som håller och vilka som faller

[Ansök gratis — vi granskar om force majeure-invändningen håller](/anmalan)
`,
  }),

];

exports.up = async function (knex) {
  const now = new Date().toISOString();
  for (const art of ARTICLES) {
    const exists = await knex('articles').where({ slug: art.slug }).first();
    if (!exists) {
      await knex('articles').insert({
        ...art,
        created_at: art.created_at ?? now,
        updated_at: art.updated_at ?? now,
      });
    }
  }
};

exports.down = async function (knex) {
  const slugs = ARTICLES.map(a => a.slug);
  await knex('articles').whereIn('slug', slugs).delete();
};
