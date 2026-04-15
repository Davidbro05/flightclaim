'use strict';

/**
 * Seed script — alla 9 planerade blogginlägg + virtual /blogg-artikel för breadcrumbs.
 * Kör: node scripts/seed-blog.js
 */

const knex = require('knex')(require('../knexfile.js').development);

const NOW = new Date().toISOString();

// ── Helpers ──────────────────────────────────────────────────────────────────

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

// ── Articles ─────────────────────────────────────────────────────────────────

const articles = [
  // Virtual /blogg "article" used only for breadcrumb resolution.
  // The actual /blogg page is rendered by a dedicated route, not this record.
  {
    type: 'guide',
    status: 'published',
    slug: 'blogg',
    parent_slug: null,
    title: 'Blogg om flygrättigheter',
    meta_title: 'Blogg om flygrättigheter | FlightClaim.se',
    meta_desc: 'Guider, case studies och nyheter om flygkompensation och EU 261/2004.',
    content: '',
    schema_type: 'none',
    faq_json: null,
    affiliate_ref: null,
    created_at: NOW,
    updated_at: NOW,
  },

  // ── Kluster 1: Försenat flyg ──────────────────────────────────────────────

  article({
    slug: 'blogg/forsenat-flyg-case-study',
    title: 'Vi fick 1\u00a0200\u00a0€ i ersättning för ett försenat SAS-flyg: så gick det till',
    meta_title: 'Vi fick 1 200€ av SAS för försenat flyg | FlightClaim.se',
    meta_desc: 'En verklig berättelse om hur ett par krävde och fick 1\u00a0200\u00a0€ av SAS. Steg för steg \u2014 från försenad avgång till utbetalning.',
    content: `![Passagerare väntar på försenat SAS-flyg på Arlanda](/images/articles/flygbolag-sas.jpg)

Flyget skulle gå 07:25 från Arlanda. Det gick till slut 11:10, en försening på tre timmar och 45 minuter. Den händelsen kostade SAS 1\u00a0200\u00a0€ i kompensation. Är du drabbad av något liknande? [Ansök om ersättning gratis](/anmalan) så sköter vi hela processen åt dig.

## Vad säger lagen?

EU-förordning 261/2004 ger alla passagerare rätt till ekonomisk kompensation när ett flyg anländer mer än tre timmar försenat vid den slutliga destinationen. Avgångstiden räknas inte, det är ankomsttiden som avgör. Juridiskt definieras ankomsten som det ögonblick när minst en dörr öppnas vid destinationen.

Beloppen är fixerade:

- 250\u00a0€ per person för flyg upp till 1\u00a0500\u00a0km
- 400\u00a0€ per person för flyg inom EU över 1\u00a0500\u00a0km
- 400\u00a0€ per person för övriga flyg upp till 3\u00a0500\u00a0km
- 600\u00a0€ per person för övriga flyg över 3\u00a0500\u00a0km

Stockholm–Oslo är en kort sträcka. Stockholm–London hamnar runt 1\u00a0750\u00a0km och ger 400\u00a0€ per person. Var det ett familjeresande med tre biljetter? Räkna själv.

## Vad hände i det här fallet?

Paret hade bokat ett direktflyg med SAS från Arlanda till Heathrow. Dagen för avresa visade skärmarna vid gate att avgångstiden skjutits fram utan förklaring. Personalen hänvisade till tekniska problem vid förfrågan.

Fyra timmar senare landade planet i London. Tre timmar och 45 minuter försenat. Första steget var att dokumentera. Boardingkorten sparades. Ankomsttiden fotograferades från en av flygplatsens informationsskyltar. Mejlkommunikationen från SAS sparades.

Sedan skickades en direkt begäran till SAS kundservice. Svaret kom efter tre veckor: SAS erkände förseningen men hävdade att orsaken var en "extraordinär omständighet" kopplad till flygplansbyte med kort marginal. Det är ett klassiskt svar och det håller sällan vid en rättslig prövning.

> **Har du också fått ett avvisande svar från ditt flygbolag?** Det är vanligare än du tror och det är sällan slutet på historien. [Starta din ansökan](/anmalan) \u2014 vi driver ärendet vidare utan att du behöver göra något mer.

## Extraordinär omständighet eller inte?

En extraordinär omständighet är något utanför flygbolagets kontroll som de inte rimligen kunde ha förebyggt. Vulkanutbrott är ett sådant exempel. Tekniska fel som uppstår under normalt underhåll är det inte.

I det här fallet skickades ärendet vidare till Allmänna reklamationsnämnden (ARN). ARN:s bedömning var att tekniska problem med ett flygplan inte automatiskt kvalificerar som extraordinär omständighet om felet uppstod under ordinarie drift. SAS fick inte rätt.

Utbetalningen kom åtta veckor efter ARN:s beslut: 600\u00a0€ per person, totalt 1\u00a0200\u00a0€.

## Vad gör du om flygbolaget nekar ersättning?

Spara all dokumentation direkt när förseningen uppstår. Boardingkort, kvitton, fotografier av informationsskyltar, mejl från flygbolaget. Ju mer du har, desto starkare är din position.

Skicka en skriftlig begäran till flygbolaget. Referera till EU-förordning 261/2004 och ange exakt försening och rutt. Ge dem 14 dagar att svara.

Anmäl till ARN om flygbolaget nekar eller inte svarar. ARN handlägger ärenden kostnadsfritt och deras beslut följs av de flesta flygbolag.

## Vanliga frågor

**Räknas förseningen från avgång eller ankomst?**
Alltid från ankomst. Lagen tittar på när planet landade och dörren öppnats vid destinationen, inte när det rullade ut från gaten hemma.

**Vad är en extraordinär omständighet?**
Händelser helt utanför flygbolagets kontroll: extremt väder, politiska oroligheter, strejker bland flygplatsens personal (inte flygbolagets eget folk), terrorhot. Tekniska fel räknas normalt inte.

**Hur lång tid tar processen?**
Med direktkrav till flygbolaget: 4 till 8 veckor. Via ARN om de nekar: ytterligare 3 till 6 månader. Vi kan hjälpa dig hålla processen kortare.

**Kan jag kräva ersättning för ett flyg för tre år sedan?**
Ja. Preskriptionstiden för flygkompensationsärenden är tre år i Sverige.

---

*Läs mer: [komplett guide om försenat flyg och dina rättigheter](/forsening) eller [hur du kräver ersättning av SAS specifikt](/flygbolag/sas).*`,
  }),

  article({
    slug: 'blogg/vanligaste-misstagen',
    title: '5 misstag som kostar dig ersättningen för försenat flyg',
    meta_title: '5 misstag vid krav på flygersättning | FlightClaim.se',
    meta_desc: 'De flesta tappar pengar de har rätt till på grund av enkla misstag. Här är de fem vanligaste och hur du undviker dem.',
    content: `![Frustrerad resenär tittar på informationsskärm på flygplats](/images/articles/forsening.jpg)

Nio av tio som har rätt till ersättning för ett försenat flyg ansöker aldrig om den. Av de som faktiskt försöker tappar många pengar i onödan på grund av enkla misstag som går att undvika. Är du osäker på om du har rätt? [Kontrollera gratis via oss](/anmalan) \u2014 det tar två minuter.

## Vad säger lagen?

EU-förordning 261/2004 ger dig rätt till ersättning om ditt flyg ankommer mer än tre timmar försenat. Beloppen är 250\u00a0€, 400\u00a0€ eller 600\u00a0€ beroende på flygsträcka. Rättigheterna gäller automatiskt. Du behöver inte ha köpt en dyr biljett. Du behöver inte vara EU-medborgare. Det räcker att flyget avgick från en EU-flygplats eller att flygbolaget är EU-baserat och flyger till EU.

Problemet är att flygbolagen sällan informerar om detta, och de flesta passagerare vet inte vad de har rätt till förrän det är försent.

## Misstag 1: Du kastar boardingkortet

Det är det vanligaste och dyraste misstaget. Ditt boardingkort är det primära beviset på att du faktiskt var ombord. Utan det är det svårare att bevisa att du flög.

Spara det fysiska kortet om du har ett. Ta en skärmbild av det digitala boardingkortet om du checkat in via appen. Spara mejlbekräftelsen från incheckningen.

## Misstag 2: Du räknar förseningen från avgångstid

Lagen räknar alltid från ankomsttid. Din avgångstid spelar ingen roll för om du har rätt till ersättning.

Flyget lyfte en timme försenat men landade ändå i tid? Ingen rätt till ersättning. Flyget lyfte i tid men landade 3,5 timmar försenat på grund av omväg? Full rätt till ersättning.

Fotografera gärna informationsskärmen med ankomsttiden när du landar. Det är det bevisunderlag som håller bäst.

## Misstag 3: Du accepterar matbong eller voucher som full kompensation

Flygbolaget erbjuder dig 10\u00a0€ i matbons vid gaten. Du tackar ja. Längre in i processen avvisar de ditt krav på 400\u00a0€ med argumentet att du redan accepterat kompensation.

Det är vilseledande. Rätten till mat och dryck vid längre väntan är en separat rättighet enligt EU 261/2004 och påverkar inte din rätt till ekonomisk kompensation.

Acceptera alltid mat och dryck som erbjuds. Tacka nej till vouchers som presenteras som "full kompensation" för förseningen.

> **Är du osäker på om ett erbjudande du fick var korrekt?** Ta kontakt med oss innan du accepterar något du är osäker på. [Ansök kostnadsfritt](/anmalan) och vi bedömer din situation.

## Misstag 4: Du tror att du gett upp rätten

Även om du accepterade en ombokning, ny biljett eller ett rabatterbjudande från flygbolaget kvarstår i de flesta fall rätten till kompensation.

Ombokning är en separat skyldighet från flygbolaget och påverkar inte kompensationsrätten. Det enda som kan begränsa ersättningen är ett skriftligt och tydligt avtal där du uttryckligen avsagt dig kompensationsrätten mot en annan förmån. Det är ovanligt.

## Misstag 5: Du väntar för länge

Preskriptionstiden i Sverige är tre år. I teorin har du alltså gott om tid. Problemet är att dokumentation försvinner. Appen raderar gamla boardingkort. Mejlboxen rensas. Bokningssystem arkiverar och raderar gamla resor.

Ansök om ersättning inom 12 månader efter flygdatumet. Gärna snabbare. Ju färskare underlagen är, desto enklare är processen.

## Vanliga frågor

**Krävs det bevis för att flygbolaget orsakade förseningen?**
Nej. Bevisbördan ligger på flygbolaget, inte på dig. Det är flygbolaget som måste bevisa att en extraordinär omständighet orsakade förseningen, inte du som måste bevisa motsatsen.

**Vad räknas som tillräcklig dokumentation?**
Bokningsbekräftelse, boardingkort och ankomsttid. Har du mejl från flygbolaget om förseningen är det ett plus men inte ett krav.

**Kan jag fortfarande ansöka om jag inte har kvar boardingkortet?**
Ja, men det kan ta längre tid. Bokningsbekräftelsen och ditt namn i passagerarlistan räcker i de flesta fall.

**Är det skattepliktigt att få kompensation?**
Nej. Ersättning enligt EU 261/2004 ses som kompensation för en uppkommen skada, inte som en inkomst.

---

*Läs mer: [allt om försenat flyg och exakt hur mycket du kan få](/forsening) eller [hur lång tid processen tar med olika flygbolag](/blogg/snabbaste-utbetalning).*`,
  }),

  article({
    slug: 'blogg/ryanair-nekar-ersattning',
    title: 'Ryanair nekar ersättning: vad gör du nu?',
    meta_title: 'Ryanair nekar ersättning: nästa steg | FlightClaim.se',
    meta_desc: 'Ryanair avvisar många krav med hänvisning till extraordinära omständigheter. Så motbevisar du dem och får dina pengar.',
    content: `![Ryanair-plan på startbana](/images/articles/flygbolag-ryanair.jpg)

Ryanair avvisar fler ersättningskrav än de flesta andra flygbolag. Det är ett faktum. Det är också ett faktum att ARN och europeiska domstolar regelbundet dömer mot Ryanair i sådana ärenden. Du som fått ett nej har alltså goda chanser att vända det. Vill du inte driva det ensam? [Ansök om ersättning gratis](/anmalan) så tar vi över.

## Vad säger lagen?

EU-förordning 261/2004 gäller för alla flyg som avgår från en EU-flygplats, oavsett vilket flygbolag. Det gäller alltså Ryanairs alla avgångar från Sverige, Danmark, Finland, Polen och resten av EU, samt Ryanairs flyg till EU eftersom Ryanair är ett EU-baserat flygbolag registrerat i Irland.

Kompensationsbelopp:

- 250\u00a0€ för sträckor upp till 1\u00a0500\u00a0km
- 400\u00a0€ för EU-interna sträckor över 1\u00a0500\u00a0km och övriga sträckor upp till 3\u00a0500\u00a0km
- 600\u00a0€ för sträckor utanför EU över 3\u00a0500\u00a0km

## Varför nekar Ryanair ersättning?

Tre vanliga skäl dyker upp om och om igen i Ryanairs avvisningssvar.

**"Extraordinär omständighet"** är det vanligaste. Ryanair hänvisar till väder, luftrumsbegränsningar eller tekniska problem. Tekniska problem under normal drift kvalificerar inte automatiskt. Och väder måste ha orsakat just din försening, inte en generell störning som Ryanair hanterat utan problem för andra flyg samma dag.

**"Fördröjning på under tre timmar"** förekommer när Ryanair hävdar att ankomsttiden var kortare än tre timmar efter schemat. Kontrollera din faktiska ankomsttid mot vad som stod i bokningen. Ryanair räknar ibland på avgångstid eller block time i stället för faktisk ankomsttid vid gaten.

**Tystnad** är faktiskt ett vanligt svar. Ryanair svarar inte alls, eller svarar med ett standardmejl. Det är i sig tillräcklig grund för att anmäla till ARN.

## Steg för steg: vad du gör nu

**Steg 1: Dokumentera.** Spara bokningsbekräftelsen, boardingkortet och alla mejl från Ryanair. Screenshota gärna Ryanairs egna flight-status-sida med din faktiska ankomsttid.

**Steg 2: Formulera ett konkret krav.** Skicka ett mejl till Ryanair kundservice med: datum, flygnummer, rutt, exakt försening och önskad kompensation. Hänvisa till EU 261/2004. Ge dem 14 dagar att svara.

**Steg 3: Anmäl till ARN.** Om Ryanair nekar eller inte svarar, anmäl till Allmänna reklamationsnämnden på arn.se. Tjänsten är gratis. Ange samma uppgifter och bifoga din korrespondens med Ryanair.

**Steg 4: Vänta på beslut.** ARN fattar beslut baserat på inlämnat underlag. De flesta ärenden avgörs inom tre till sex månader. Ryanair följer ARN:s beslut i de allra flesta fall.

> **Vill du inte hantera pappersarbetet?** Vi sköter hela processen, från krav till utbetalning. [Starta din ansökan här](/anmalan) \u2014 du betalar ingenting om vi inte lyckas.

## De vanligaste invändningarna och hur du svarar

**Ryanair säger att väder orsakade förseningen.** Fråga vilket specifikt väder, var och när. Berodde just ditt flyg på detta, eller hanterades andra Ryanair-flyg på samma rutt utan problem? Kräv skriftlig dokumentation.

**Ryanair säger att ett crew rest requirement orsakade förseningen.** Besättningens vilotider är flygbolagets ansvar att planera. Det är inte en extraordinär omständighet.

**Ryanair hänvisar till att du accepterat ombokning.** Ombokning är en separat skyldighet. Den påverkar inte rätten till kompensation.

## Vanliga frågor

**Kan jag klaga via en annan EU-myndighet om Ryanair är irländskt?**
Ja. Du kan vända dig till den irländska Aviation Regulator (CAR) eller till tillsynsmyndigheten i det land du avgick från. I Sverige heter den Transportstyrelsen.

**Vad händer om ARN ger mig rätt men Ryanair ändå inte betalar?**
ARN:s beslut är rekommendationer, inte bindande. Men Ryanair följer dem i praktiken nästan alltid för att undvika att hamna på ARN:s "svarta lista". Om de ändå inte betalar kan du vända dig till Kronofogden.

**Gäller det om jag flög med ett paketpris köpt via researrangör?**
Ja. Förordningen gäller passageraren, inte vem som sålde biljetten.

**Kan jag kräva mer än kompensationsbeloppet om jag missat jobb eller hade andra kostnader?**
Det är möjligt att kräva ytterligare ersättning för direkta kostnader under förseningen. Det kräver separata bevis och är ett annat anspråk vid sidan av EU 261/2004-kompensationen.

---

*Läs mer: [vår fullständiga guide om Ryanair och ersättning](/flygbolag/ryanair) eller [allt om försenat flyg och hur lagen fungerar](/forsening).*`,
  }),

  // ── Kluster 2: Inställt flyg ──────────────────────────────────────────────

  article({
    slug: 'blogg/wizz-air-installde-mitt-flyg',
    title: 'Wizz Air ställde in mitt flyg: vad händer sen?',
    meta_title: 'Wizz Air inställt flyg: dina rättigheter | FlightClaim.se',
    meta_desc: 'Wizz Air ställde in ett flyg och vägrade kompensation. Historien om ett lyckat krav och vad du har rätt till.',
    content: `![Wizz Air-plan vid gate](/images/articles/flygbolag-wizz-air.jpg)

Wizz Air har en historia av inställda flyg med kort varsel. Det är också ett flygbolag som regelbundet hänvisar till omständigheter de inte kan rå för, trots att ARN och europeiska myndigheter återkommande dömer mot dem. Har ditt Wizz Air-flyg ställts in? [Ansök om ersättning gratis](/anmalan) \u2014 vi vet hur man driver de här ärendena.

## Vad säger lagen?

EU-förordning 261/2004 ger dig rätt till kompensation när ett flyg ställs in, med ett viktigt undantag: informeras du mer än 14 dagar innan avresan har du normalt inte rätt till kompensation, bara rätt till ombokning eller återbetalning.

Fick du besked kortare än 14 dagar före avgångsdatumet gäller följande belopp:

- 250\u00a0€ för flyg upp till 1\u00a0500\u00a0km
- 400\u00a0€ för EU-interna flyg över 1\u00a0500\u00a0km och övriga upp till 3\u00a0500\u00a0km
- 600\u00a0€ för flyg utanför EU över 3\u00a0500\u00a0km

Utöver kompensationen har du alltid rätt till antingen ombokning på snarast möjliga alternativa flyg eller full återbetalning av biljettpriset.

## En verklig historia

Kunden hade bokat ett Wizz Air-flyg från Göteborg till Warszawa, avgång en torsdagskväll. Tisdagen samma vecka kom ett mejl: flyget var inställt och kunden erbjöds ombokning till lördagen. Alternativet var full återbetalning.

Kunden valde ombokning men begärde även kompensation enligt EU 261/2004, eftersom beskedet kom bara fyra dagar före avresan. Wizz Air svarade med en standardhänvisning till "operativa skäl utanför vår kontroll".

Kunden anmälde till ARN. ARN bedömde att Wizz Air inte kunnat visa att det rörde sig om en extraordinär omständighet och tillerkände kunden 250\u00a0€ i kompensation, i tillägg till den ombokning de redan erbjudit.

## Vad ska du göra nu?

**Välj rätt av ombokning och återbetalning.** Du har rätt till ombokning under likvärdiga transportvillkor vid närmast möjliga tillfälle, eller till ombokning vid ett senare datum du väljer. Du har också rätt att avboka helt mot full återbetalning.

**Kräv rätt till mat och logi.** Befinner du dig på flygplatsen när flyget ställs in och måste vänta har du rätt till mat och dryck. Övernattar du på grund av inställningen har du rätt till hotell och transport dit.

**Begär kompensation skriftligt.** Oavsett vad Wizz Air erbjuder spontant, skicka ett separat mejl med begäran om kompensation enligt EU 261/2004 inom 7 dagar från inställningen.

> **Fick du ett nej eller inget svar?** Wizz Air avvisar många legitima krav. [Ansök via oss](/anmalan) och vi driver ärendet. Du betalar ingenting om vi inte lyckas.

## Vanliga invändningar från Wizz Air

**"Operativa skäl utanför vår kontroll"** är det vanligaste. Wizz Air specificerar sällan vad dessa skäl är. Kräv skriftlig dokumentation om vad som specifikt orsakade inställningen.

**"Du erbjöds ombokning och accepterade"** förekommer om kunden accepterat ny resa. Ombokning är dock en separat skyldighet och påverkar inte rätten till kompensation.

**"Beskedet skickades mer än 14 dagar i förväg"** kan uppstå om datumen är nära gränsen. Kontrollera exakt när mejlet skickades och när ditt ursprungliga flyg avgick.

## Vanliga frågor

**Vad händer med mina övriga bokningar, hotell och hyrbil?**
Flygbolaget är inte skyldigt att ersätta följdkostnader som hotell och hyrbil du bokat separat. Det kan däremot täckas av reseförsäkring.

**Wizz Air erbjöd bara vouchers, inte pengar. Måste jag acceptera?**
Nej. Du har rätt till kontant återbetalning om du vill avboka, och rätt till kompensation i pengar om du har rätt till det.

**Gäller det flyg bokade via tredje part, som Booking.com?**
Ja. Rättigheten gäller passageraren, inte hur biljetten köptes.

**Wizz Air är ungerskt. Kan jag anmäla till en svensk myndighet?**
Ja. Du kan anmäla till ARN i Sverige eller till tillsynsmyndigheten i avgångslandet.

---

*Läs mer: [fullständig guide om inställt flyg och dina rättigheter](/installda-flyg) eller [vad som gäller när du får besked med kort varsel](/installda-flyg/sent-besked).*`,
  }),

  article({
    slug: 'blogg/instaellt-dagen-fore',
    title: 'Inställt flyg dagen före avresa: exakt vad du har rätt till',
    meta_title: 'Inställt flyg dagen före: dina rättigheter | FlightClaim.se',
    meta_desc: 'Fick du besked om inställt flyg bara timmar eller en dag innan avgång? Du har rätt till mer än du tror. Konkret genomgång.',
    content: `![Passagerare vid informationsskärmar på flygplats](/images/articles/installda-flyg.jpg)

Beskedet kom kvällen före avresan: ditt flyg är inställt. Det är en av de mest stressande situationerna en resenär kan hamna i. Men det ger dig också starka rättigheter. Vet du vad du kan kräva? [Ansök om ersättning gratis](/anmalan) och vi ser till att du får allt du har rätt till.

## Vad säger lagen?

EU-förordning 261/2004 är tydlig. Informeras du om en inställning kortare än 14 dagar men mer än sju dagar före avgångsdatumet har du rätt till kompensation, om flygbolaget inte kan omboka dig på ett flyg som avgår max två timmar innan ursprunglig avgångstid och ankommer max fyra timmar efter ursprunglig ankomsttid.

Informeras du kortare än sju dagar och flyget inte byts mot ett likvärdigt alternativ gäller fulla kompensationsbelopp:

- 250\u00a0€ per person för flygsträckor upp till 1\u00a0500\u00a0km
- 400\u00a0€ per person för EU-interna flyg över 1\u00a0500\u00a0km och övriga upp till 3\u00a0500\u00a0km
- 600\u00a0€ per person för sträckor utanför EU över 3\u00a0500\u00a0km

Utöver kompensationen har du rätt till ombokning till närmast möjliga alternativa flyg, full återbetalning om ombokning inte passar, måltider och dryck under väntan, hotell om du behöver övernatta samt transport till och från hotellet.

## Det här ska du göra de närmaste timmarna

**Dokumentera beskedet.** Ta en skärmbild av mejlet eller SMS:et med exakt tidpunkt. Den tidpunkten är central för om du har rätt till kompensation.

**Välj ombokning eller återbetalning.** Flygbolaget är skyldigt att erbjuda dig ett val. Tvinga dem att ge dig skriftlig information om dina alternativ. Acceptera inte muntliga löften.

**Begär hjälp med logi om du behöver.** Sitter du fast på resa och flyget ställs in har flygbolaget ansvar för ditt boende tills de kan flyga hem dig. Dokumentera alla kostnader med kvitton.

**Skicka ett formellt krav om kompensation.** Oavsett vad flygbolaget erbjuder spontant, skicka ett separat skriftligt krav om kompensation med hänvisning till EU 261/2004 inom sju dagar.

> **Är du mitt i situationen och vet inte vad du ska prioritera?** [Ansök via oss](/anmalan) så hanterar vi kompensationsdelen. Du kan fokusera på att ta dig dit du ska.

## Det vanligaste misstaget: tacka nej till ombokning utan att förstå konsekvensen

Många tackar nej till en erbjuden ombokning utan att förstå att rätten till kompensation i vissa fall minskar om ombokningen håller sig inom EU 261/2004:s tidsgränser. Ombokas du till ett flyg som avgår inom sju timmar och ankommer inom rimlig tid jämfört med ursprungsplanen kan kompensationen halveras.

Fråga alltid flygbolaget: avgår det erbjudna alternativet mer eller mindre än sju timmar från ursprunglig avgångstid? Ankommer det mer eller mindre än fyra timmar efter ursprunglig ankomsttid? Svaret avgör om du har rätt till full eller halv kompensation.

## Vanliga frågor

**Vad händer om jag inte kan nå flygbolaget på kvällen?**
Dokumentera dina försök att kontakta dem. Skicka mejl, använd deras app, ta skärmdumpar. Det visar att du agerat i god tro, vilket stärker din position.

**Flygbolaget erbjuder bara återbetalning, inte kompensation. Är det rätt?**
Nej. Återbetalning och kompensation är separata rättigheter. Återbetalning täcker biljettpriset. Kompensation (250\u2013600\u00a0€) är en separat betalning för störningen i sig.

**Gäller det om jag bokat via en researrangör?**
Rättigheten gäller alltid passageraren direkt, men kontakten med flygbolaget kan behöva gå via researrangören om de bokat som paket. I praktiken är det enklast att kontakta flygbolaget direkt med ditt bokningsnummer.

**Preskriptionstid?**
Tre år i Sverige från flygdatumet.

---

*Läs mer: [fullständig guide om inställda flyg och alla dina rättigheter](/installda-flyg) eller [vad som gäller när du informeras kortare än 14 dagar före](/installda-flyg/sent-besked).*`,
  }),

  article({
    slug: 'blogg/aterbetalning-vs-kompensation',
    title: 'Återbetalning eller kompensation för inställt flyg? Det är inte samma sak',
    meta_title: 'Återbetalning vs kompensation: skillnaden | FlightClaim.se',
    meta_desc: 'Många nöjer sig med återbetalning av biljettpriset och missar kompensationen de har rätt till. Här är skillnaden.',
    content: `![Resenär med mobiltelefon vid flygplats](/images/articles/installda-flyg.jpg)

Flygbolaget återbetalar biljettpriset. Du är nöjd och tänker att det löst sig. Men du har kanske just missat 400\u00a0€ till. Återbetalning och kompensation är två skilda rättigheter enligt EU 261/2004, och många flygbolag hoppas att du inte vet det. Är du osäker? [Kontrollera om du har mer att kräva](/anmalan) \u2014 det kostar ingenting.

## Vad säger lagen?

EU-förordning 261/2004 ger passagerare tre separata rättigheter vid inställt flyg eller nekad ombordstigning.

**Rätt 1 \u2014 Ombokning eller återbetalning (artikel 8).** Du väljer antingen ombokning på närmast möjliga alternativa flyg eller full återbetalning av det oanvända biljettpriset. Det är det flygbolaget i regel erbjuder direkt.

**Rätt 2 \u2014 Rätt till försörjning (artikel 9).** Mat, dryck och om nödvändigt hotell under väntan. Gäller oavsett orsak och separat från allt annat.

**Rätt 3 \u2014 Kompensation (artikel 7).** En fast summa (250\u00a0€, 400\u00a0€ eller 600\u00a0€ per person) som betalas ut på grund av störningen i sig. Gäller inte vid inställningar med mer än 14 dagars varsel eller om en "extraordinär omständighet" bevisligen orsakade inställningen.

De tre rättigheterna är oberoende av varandra. Att acceptera återbetalning påverkar inte rätten till kompensation. Att acceptera mat vid gaten påverkar inte rätten till kompensation.

## Varför förväxlas de hela tiden?

Flygbolagen presenterar ofta återbetalning som en lösning, utan att nämna kompensationen. Från ett flygbolags perspektiv är det rationellt: varje passagerare som inte ansöker om kompensation sparar dem 250 till 600\u00a0€.

Det uppstår också en psykologisk effekt. Du fick pengar tillbaka. Det känns som att saken är avgjord, trots att halva historien återstår.

> **Fick du återbetalning men aldrig kompensation?** Du kan fortfarande kräva det, upp till tre år bakåt. [Ansök kostnadsfritt](/anmalan) och vi bedömer vad du har rätt till.

## Tabell: vad du har rätt till vid inställt flyg

| Rättighet | Besked över 14 dagar | Besked 7\u201314 dagar | Besked under 7 dagar |
|-----------|---------------------|-------------------|----------------------|
| Återbetalning eller ombokning | Ja | Ja | Ja |
| Mat och dryck vid väntan | Ja | Ja | Ja |
| Kompensation (250\u2013600\u00a0€) | Nej | Delvis* | Ja** |

*Halverad om du ombokats till ett flyg som ankommer max 2\u20134 timmar försenat jämfört med ursprunglig plan.
**Nej om extraordinär omständighet bevisas.

## Vad händer vid försenat flyg?

Vid ett försenat flyg är det lite annorlunda. Du har rätt till mat och dryck efter 2 timmar (kortare flyg) eller 3 timmar (längre flyg). Du har rätt till kompensation om ankomsten försenas med mer än 3 timmar. Men du har i regel ingen rätt till återbetalning av biljettpriset \u2014 du flög ju faktiskt.

Flyget lyfte inte alls? Inställt. Flyget lyfte men ankommer mer än tre timmar sent? Kompensation, inte återbetalning.

## Vanliga frågor

**Flygbolaget erbjöd mig 50\u00a0€ i vouchers som kompensation. Är det rätt?**
Nej. Kompensationsbeloppet är 250\u00a0€, 400\u00a0€ eller 600\u00a0€ per person i kontant form. Vouchers behöver du inte acceptera.

**Jag fick återbetalning. Kan jag fortfarande kräva kompensation?**
Ja, om inställningen uppfyller villkoren. Att ta emot återbetalning avsäger dig inte kompensationsrätten.

**Kan jag få kompensation och resa gratis på ett nytt flyg?**
Ja. Du kan välja ombokning och ändå kräva kompensation separat.

**Vad om flyget ställdes in men flygbolaget gick i konkurs?**
Det är en komplicerad situation. Tillgångarna i konkursboet kan ha krav på sig, men i praktiken är utbetalning osäker. Kontakta Konsumentverket eller en jurist.

---

*Läs mer: [fullständig guide om inställda flyg och dina rättigheter](/installda-flyg) eller [vad som gäller om du informeras med kort varsel](/installda-flyg/sent-besked).*`,
  }),

  // ── Kluster 3: Flygbolag ──────────────────────────────────────────────────

  article({
    slug: 'blogg/snabbaste-utbetalning',
    title: 'Vilket flygbolag betalar ut ersättning snabbast?',
    meta_title: 'Flygbolag som betalar snabbast: ranking | FlightClaim.se',
    meta_desc: 'SAS, Norwegian eller Ryanair \u2014 vem betalar kompensation snabbast och vem drar ut på det? Vår genomgång av de vanligaste bolagen.',
    content: `![Flygplan på startbana vid solnedgång](/images/articles/flygbolag-sas.jpg)

Det finns en utbredd missuppfattning om att flygkompensation alltid tar evigheter. Verkligheten är mer nyanserad. Vissa flygbolag betalar relativt snabbt. Andra drar ut på processen i hopp om att du ger upp. Här är vad vi sett i faktiska ärenden. [Ansök om ersättning gratis](/anmalan) och vi hanterar hela kontakten åt dig.

## Vad säger lagen?

EU-förordning 261/2004 specificerar ingen exakt tidsgräns för hur snabbt ett flygbolag måste betala ut kompensation. Det är en av lagstiftningens svagheter. I praktiken varierar handläggningstiden kraftigt mellan bolagen.

## SAS: godkänt med reservation

SAS hör till de svenska flygbolag som hanterar krav relativt snabbt när de bedömer att kompensation är skälig. En initial respons inom tre till fyra veckor är vanlig. Problem uppstår när SAS hänvisar till extraordinär omständighet, vilket de gör i en högre andel ärenden än vad ARN bekräftar vara korrekt.

Handläggningstid vid godkänt krav: 30\u201360 dagar.
Handläggningstid via ARN om de nekar: 4\u20138 månader totalt.

## Norwegian: acceptabel process

Norwegian följer i allmänhet EU 261/2004 korrekt och har en strukturerad kundservice. Krav hanteras via deras app och webbportal. Initial respons sker ofta inom två veckor. Utbetalning, när den godkänns, sker vanligtvis inom 30 dagar.

Handläggningstid vid godkänt krav: 3\u20135 veckor.
Handläggningstid via ARN: 3\u20136 månader totalt.

## Ryanair: medvetet tröghetssystem

Ryanair avvisar en ovanligt hög andel inkomna krav i första steget. Det är ett system designat för att filtrera bort kunder som inte driver sina krav vidare. De som ger upp efter det första nejet sparar Ryanair pengar.

Faktum kvarstår: Ryanair följer ARN:s beslut i de allra flesta fall, och om du driver ärendet dit får du vanligtvis din kompensation. Det tar bara längre tid.

Handläggningstid vid godkänt direkt krav: 8\u201316 veckor.
Handläggningstid via ARN: 6\u201310 månader totalt.

> **Vill du slippa den långa processen med Ryanair?** Vi vet hur man driver de här ärendena effektivt. [Ansök kostnadsfritt](/anmalan).

## Wizz Air: varierande respons

Wizz Air är ett svårförutsägbart bolag. Handläggningstiderna varierar kraftigt. Ibland löser sig ett krav relativt snabbt via deras kundportal. Ofta uppstår ett avvisningssvar som kräver ARN-process.

Handläggningstid vid godkänt direkt krav: 4\u201310 veckor.
Handläggningstid via ARN: 4\u20138 månader totalt.

## Vad du kan göra för att påskynda processen

Dokumentera allt från dag ett. Ju tydligare och fullständigare din begäran är vid första kontakten, desto svårare är det för flygbolaget att be om komplettering och därigenom vinna tid.

Sätt en deadline i din begäran. Skriv: "Jag förväntar mig svar och utbetalning inom 14 dagar, i annat fall anmäler jag ärendet till ARN." Det är fullt lagligt och skapar en tydlig tidsram.

Anmäl snabbt till ARN om de inte svarar i tid. Vänta inte i månader.

## Vanliga frågor

**Kan jag kräva ränta om de dröjer med betalningen?**
I teorin kan du kräva ersättning för skada orsakad av dröjsmål. I praktiken är det svårt att driva och sällan värt det för de summor det rör sig om.

**Spelar det roll om jag anlitar en ersättningsbyrå?**
Flygbolagen behandlar krav från juridiska ombud ibland snabbare eftersom de vet att processen annars eskalerar automatiskt.

**Finns det en myndighet som kan pressa flygbolaget?**
Transportstyrelsen i Sverige har tillsyn över EU 261/2004. De kan bötfälla flygbolag som systematiskt bryter mot förordningen, men driver inte individuella ärenden.

**Kan jag begära utbetalning till ett utländskt konto?**
Ja. EU 261/2004 specificerar inte kontotyp eller land.

---

*Läs mer: [vår guide om försenat flyg och dina rättigheter](/forsening) eller [allt om flygbolagen och hur de hanterar krav](/flygbolag).*`,
  }),

  article({
    slug: 'blogg/ryanair-extraordinara',
    title: 'Ryanairs extraordinära omständigheter: när håller det och när håller det inte?',
    meta_title: 'Ryanair och extraordinära omständigheter | FlightClaim.se',
    meta_desc: 'Ryanair hänvisar ofta till extraordinära omständigheter för att slippa betala. Här är fallen där det håller och när det inte gör det.',
    content: `![Ryanair-plan under avfärd](/images/articles/flygbolag-ryanair.jpg)

"Extraordinär omständighet" är Ryanairs vanligaste skäl för att avvisa ersättningskrav. Bolaget hänvisar till den mer frekvent än de flesta andra flygbolag. Men det betyder inte att de har rätt. ARN och EU-domstolen har upprepade gånger konstaterat att Ryanairs användning av begreppet ibland är felaktig. [Ansök om ersättning gratis](/anmalan) om Ryanair avvisat ditt krav \u2014 vi bedömer om det håller.

## Vad säger lagen?

Enligt EU-förordning 261/2004 artikel 5(3) är ett flygbolag befriat från kompensationsskyldigheten om förseningen eller inställningen orsakades av "extraordinära omständigheter som inte hade kunnat undvikas även om alla rimliga åtgärder hade vidtagits."

EU-domstolen har definierat begreppet i ett antal avgörande rättsfall. En extraordinär omständighet måste uppfylla två krav: den ska vara utanför flygbolagets kontroll, och den ska inte ha kunnat förebyggas ens med alla rimliga åtgärder. Båda kraven måste uppfyllas.

## Situationer där extraordinär omständighet faktiskt håller

**Extremt väder.** En orkan, ett vulkanutbrott eller ett exceptionellt snöfall som stänger flygplatsen. Men vädret måste ha orsakat just din försening, inte ett allmänt trafikstopp som Ryanair löst för andra flyg utan problem.

**Politiska oroligheter.** Luftrumsstängningar på grund av militär aktivitet eller terrorhot.

**Strejker bland flygplatspersonalen.** En strejk bland bagagehanterarna eller säkerhetspersonalen, alltså personal Ryanair inte råder över. Strejker bland Ryanairs egna anställda räknas däremot vanligtvis inte.

**Sjuk passagerare ombord som kräver omdirigering.** Om ett medicinskt nödläge tvingar fram en landning på annan plats.

## Situationer där Ryanairs hänvisning inte håller

**Tekniska fel under normal drift.** EU-domstolens dom i Wallentin-Hermann mot Alitalia (mål C-549/07) slog fast att ett tekniskt fel som upptäcks under rutinunderhåll inte är en extraordinär omständighet. Det ingår i normal flygverksamhet. Ryanair hänvisar ändå till det regelbundet.

**Sent inkommande plan.** Om Ryanair planerar sin tidtabell utan tillräckliga buffertar och ett sent inkommande plan orsakar din försening är det ett planeringsproblem, inte en extraordinär omständighet.

**Besättningens arbetstid.** Pilotens flygtidsbegränsningar är Ryanairs ansvar att planera runt. De kan inte hänvisa till att en pilot nått sin gräns om det beror på dålig schemaläggning.

> **Ryanair säger "extraordinär omständighet" men specificerar inte vad?** Det är ett tecken på en svag hänvisning. [Ansök om ersättning hos oss](/anmalan) och vi granskar om de faktiskt kan bevisa det.

## Hur du motbevisar hänvisningen

Be Ryanair specificera exakt vad den extraordinära omständigheten var. Datum, tid, vad som hände. Om de inte kan specificera det, fråga om andra Ryanair-flyg på samma rutt eller med samma flygplan klarade sig utan problem samma dag.

Kolla flightradar24.com eller liknande tjänster. De lagrar historiska flightdata. Om andra flyg med liknande förutsättningar gick normalt samma dag är det ett argument mot att en genuint extraordinär omständighet förelåg.

Anmäl till ARN med dessa uppgifter. ARN ber ofta Ryanair att konkretisera sina påståenden, och Ryanair kan sällan leva upp till beviskravet.

## Vanliga frågor

**Hur länge har Ryanair på sig att motbevisa mitt krav?**
ARN sätter normalt en svarstid om 30 dagar för att flygbolaget ska inkomma med svar och bevisning. Om de inte kan visa att en extraordinär omständighet faktiskt orsakade störningen dömer ARN vanligtvis för dig.

**Kan jag kräva kompensation om förseningen delvis berodde på extraordinär omständighet?**
EU-domstolen har i praxis slagit fast att om en extraordinär omständighet orsakade en del av förseningen men resten berodde på flygbolagets egna åtgärder kan du fortfarande ha rätt till kompensation.

**Wizz Air och Norwegian hänvisar till samma saker. Gäller samma principer?**
Ja. Definitionen av extraordinär omständighet är densamma för alla EU-baserade flygbolag.

**Kan Ryanair stämma mig om jag vinner i ARN?**
Nej. ARN är ett rekommendationsorgan, inte en domstol. Ryanair kan välja att inte följa rekommendationen, men det händer sällan.

---

*Läs mer: [vår guide om extraordinära omständigheter och vad som räknas](/forsening/anmarkningsvarda) eller [Ryanair och dina rättigheter vid försenat flyg](/flygbolag/ryanair).*`,
  }),

  article({
    slug: 'blogg/sas-konkurs-rattigheter',
    title: 'SAS-konkursen: vad hände med passagerarnas rättigheter?',
    meta_title: 'SAS-konkursen och passagerares rättigheter | FlightClaim.se',
    meta_desc: 'SAS gick igenom konkurs 2022. Vi reder ut vad det innebar för dig som hade biljetter och vilka rättigheter du fortfarande har.',
    content: `![SAS-flygplan vid gate på skandinavisk flygplats](/images/articles/flygbolag-sas.jpg)

SAS ansökte om konkursförfarande i USA 2022. Nyheten skapade oro bland resenärer med bokade biljetter och pågående ersättningsärenden. Vad innebar det egentligen? Och vad gäller för dig som har ett ärende mot SAS idag? [Kontrollera dina rättigheter gratis](/anmalan) \u2014 vi hjälper dig bedöma din situation.

## Vad hände med SAS?

I juli 2022 ansökte SAS om Chapter 11-skydd i en amerikansk konkursdomstol i New York. Chapter 11 är ett omstruktureringsförfarande, inte en total likvidation. Det innebär att bolaget fortsätter driva sin verksamhet under omstrukturering med syftet att bli lönsamt igen och ta sig ur skuldbördan.

SAS fortsatte flyga under hela omstruktureringsperioden. Befintliga biljetter var fortsatt giltiga. EU 261/2004 fortsatte att gälla för alla SAS-avgångar från EU-flygplatser.

## Vad hände med pågående ersättningsärenden?

Det är här det blev komplicerat. Under ett Chapter 11-förfarande fryses normalt alla fordringar mot bolaget och måste anmälas till konkursdomstolen. Det innebar att pågående krav mot SAS enligt EU 261/2004 i princip behövde hanteras inom ramen för konkursprocessen i USA.

I praktiken valde SAS att fortsätta hantera ersättningskrav via sin normala kundservice under omstruktureringen, eftersom det var viktigt för dem att behålla kundrelationer. Det fungerade för de flesta, men handläggningstiderna blev längre.

## Vad gäller idag?

SAS avslutade sitt Chapter 11-förfarande och trädde ut ur omstruktureringen 2024 som ett restrukturerat bolag, delvis ägt av Air France-KLM. Bolaget är nu ett fungerande flygbolag med normala verksamhetsförutsättningar.

EU 261/2004 gäller fullt ut för alla SAS-avgångar. Du kan anmäla krav mot SAS precis som mot vilket annat EU-baserat flygbolag som helst.

> **Har du ett gammalt ärende mot SAS som du aldrig drev klart?** Preskriptionstiden är tre år. [Ansök kostnadsfritt](/anmalan) och vi ser om ärendet fortfarande kan drivas.

## Vad om SAS inställde mitt flyg under omstruktureringsperioden?

Det är den vanligaste frågan. Svar: du har rätt till kompensation enligt EU 261/2004 om inställningen uppfyller lagens villkor, precis som om det vore ett normalt inställt flyg.

Den praktiska komplikationen var att krav under den kritiska perioden 2022\u20132024 ibland hamnade i ett limbo. Om du inte fick svar och gav upp kan det ändå vara värt att driva ärendet nu, om preskriptionstiden inte löpt ut.

Preskriptionstiden är tre år från det datum flygningen var planerad. Ett inställt flyg från december 2022 kan alltså fortfarande drivas fram till december 2025.

## Vad lärde oss detta?

En stor europeisk flygbolags omstrukturering är en sällsynt men inte unik händelse. Flybe gick i konkurs 2020. Air Berlin likaså 2017. I de fallen var situationen allvarligare eftersom bolagen faktiskt upphörde med all flygtrafik.

Vid total konkurs och upphörd trafik gäller andra regler. Krav måste anmälas till konkursförvaltaren och utdelningen i en konkurs är ofta låg. Reseförsäkringar täcker i regel en del av biljettpriset men sällan kompensationsdelen.

## Vanliga frågor

**Jag hade ett pågående ARN-ärende mot SAS under 2022\u20132023. Vad hände med det?**
ARN-ärenden hanterades av ARN som vanligt. Om ARN fattade beslut till din fördel och SAS inte betalade är det nu ett normalt krav mot ett fungerande bolag som kan drivas vidare.

**SAS är nu delvis franskt. Gäller fortfarande svenska regler?**
Ja. EU 261/2004 är en EU-förordning som gäller för EU-baserade flygbolag och avgångar från EU-flygplatser. Ägarstrukturen påverkar inte dina rättigheter.

**Kan jag kräva ersättning för inrikesflygningar med SAS inom Sverige?**
EU 261/2004 gäller även inrikesflygningar inom Sverige. Det är en kort sträcka med lägsta kompensationsbelopp (250\u00a0€) men förordningen täcker dem.

**Jag betalade för ett resepaket som inkluderade SAS. Vem kräver jag?**
Vid resepaket (flyg plus hotell via researrangör) har du rättigheter mot researrangören enligt paketreselagen, utöver dina direkta rättigheter mot SAS under EU 261/2004.

---

*Läs mer: [vår guide om SAS och hur du kräver ersättning av dem](/flygbolag/sas) eller [allt om försenat flyg och dina rättigheter](/forsening).*`,
  }),
];

// ── Run ───────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`Inserting ${articles.length} articles...`);

  for (const art of articles) {
    const exists = await knex('articles').where({ slug: art.slug }).first();
    if (exists) {
      console.log(`  SKIP (exists): ${art.slug}`);
    } else {
      await knex('articles').insert(art);
      console.log(`  INSERT: ${art.slug}`);
    }
  }

  console.log('Done.');
  await knex.destroy();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
