'use strict';

/**
 * Data migration: seed the 9 planned blog articles + virtual /blogg breadcrumb article.
 * Idempotent — skips rows that already exist (keyed on slug).
 */

const NOW = new Date('2026-04-15T09:00:00.000Z').toISOString();

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
  // Virtual /blogg article — used only for breadcrumb resolution.
  // The actual /blogg listing is served by a dedicated route, not this record.
  {
    type: 'guide',
    status: 'published',
    slug: 'blogg',
    parent_slug: null,
    title: 'Blogg om flygrättigheter',
    meta_title: 'Blogg om flygrättigheter | FlightClaim.se',
    meta_desc: 'Guider, case studies och nyheter om flygkompensation och EU\u00a0261/2004.',
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
    title: 'Vi fick 1\u00a0200\u00a0\u20ac i ers\u00e4ttning f\u00f6r ett f\u00f6rsenat SAS-flyg: s\u00e5 gick det till',
    meta_title: 'Vi fick 1 200\u20ac av SAS f\u00f6r f\u00f6rsenat flyg | FlightClaim.se',
    meta_desc: 'En verklig ber\u00e4ttelse om hur ett par kr\u00e4vde och fick 1\u00a0200\u00a0\u20ac av SAS. Steg f\u00f6r steg \u2014 fr\u00e5n f\u00f6rsenad avg\u00e5ng till utbetalning.',
    content: `![SAS A321 vid Arlanda \u2014 f\u00f6rsenat flyg och r\u00e4tt till ers\u00e4ttning](/images/articles/flygbolag/sas-a321.jpg)

Flyget skulle g\u00e5 07:25 fr\u00e5n Arlanda. Det gick till slut 11:10, en f\u00f6rsening p\u00e5 tre timmar och 45 minuter. Den h\u00e4ndelsen kostade SAS 1\u00a0200\u00a0\u20ac i kompensation. \u00c4r du drabbad av n\u00e5got liknande? [Ans\u00f6k om ers\u00e4ttning gratis](/anmalan) s\u00e5 sk\u00f6ter vi hela processen \u00e5t dig.

## Vad s\u00e4ger lagen?

EU-f\u00f6rordning 261/2004 ger alla passagerare r\u00e4tt till ekonomisk kompensation n\u00e4r ett flyg anl\u00e4nder mer \u00e4n tre timmar f\u00f6rsenat vid den slutliga destinationen. Avg\u00e5ngstiden r\u00e4knas inte, det \u00e4r ankomsttiden som avg\u00f6r. Juridiskt definieras ankomsten som det \u00f6gonblick n\u00e4r minst en d\u00f6rr \u00f6ppnas vid destinationen.

Beloppen \u00e4r fixerade:

- 250\u00a0\u20ac per person f\u00f6r flyg upp till 1\u00a0500\u00a0km
- 400\u00a0\u20ac per person f\u00f6r flyg inom EU \u00f6ver 1\u00a0500\u00a0km
- 400\u00a0\u20ac per person f\u00f6r \u00f6vriga flyg upp till 3\u00a0500\u00a0km
- 600\u00a0\u20ac per person f\u00f6r \u00f6vriga flyg \u00f6ver 3\u00a0500\u00a0km

Stockholm\u2013Heathrow m\u00e4ter drygt 1\u00a0750\u00a0km. Reser du ensam har du r\u00e4tt till 400\u00a0\u20ac. \u00c4r ni ett par, 800\u00a0\u20ac. En familj p\u00e5 tre, 1\u00a0200\u00a0\u20ac.

## Vad h\u00e4nde i det h\u00e4r fallet?

Paret hade bokat ett direktflyg med SAS fr\u00e5n Arlanda till Heathrow. Dagen f\u00f6r avresa visade sk\u00e4rmarna vid gate att avg\u00e5ngstiden skjutits fram utan f\u00f6rklaring. Personalen h\u00e4nvisade till tekniska problem vid f\u00f6rfr\u00e5gan.

Tre timmar och 45 minuter efter ursprunglig avg\u00e5ngstid lyfte planet. De landade i London mer \u00e4n tre timmar f\u00f6rsenat j\u00e4mf\u00f6rt med schemat.

**Dokumentering:** Boardingkorten sparades. Ankomsttiden fotograferades fr\u00e5n flygplatsens informationssystem. Alla mejl fr\u00e5n SAS sparades ner.

**Direkt krav:** En skriftlig beg\u00e4ran skickades till SAS kundservice med h\u00e4nvisning till EU\u00a0261/2004. SAS svarade efter tre veckor med att f\u00f6rseningen berodde p\u00e5 en "extraordin\u00e4r omst\u00e4ndighet" kopplad till flygplansbyte med kort marginal. Det \u00e4r ett klassiskt svar och det h\u00e5ller s\u00e4llan vid en r\u00e4ttslig pr\u00f6vning.

**Anm\u00e4lan till ARN:** \u00c4rendet l\u00e4mnades in till Allm\u00e4nna reklamationsn\u00e4mnden. ARN \u00e4r en statlig myndighet som handl\u00e4gger konsumenttvister utan kostnad. ARN bed\u00f6mde att tekniska problem under normal drift inte automatiskt kvalificerar som extraordin\u00e4r omst\u00e4ndighet. SAS fick inte r\u00e4tt.

**Utbetalning:** \u00c5tta veckor efter ARN:s beslut kom pengarna: 600\u00a0\u20ac per person, totalt 1\u00a0200\u00a0\u20ac.

> **Har du ocks\u00e5 f\u00e5tt ett avvisande svar?** Flygbolag avvisar m\u00e5nga krav i ett f\u00f6rsta steg, men det \u00e4r s\u00e4llan slutet p\u00e5 historien. [Starta din ans\u00f6kan h\u00e4r](/anmalan) \u2014 vi driver \u00e4rendet vidare och du betalar ingenting om vi inte lyckas.

## Extraordin\u00e4r omst\u00e4ndighet eller inte?

En extraordin\u00e4r omst\u00e4ndighet \u00e4r n\u00e5got utanf\u00f6r flygbolagets kontroll som de inte rimligen kunde ha f\u00f6rebyggt. Vulkanutbrott \u00e4r ett s\u00e5dant exempel. Tekniska fel som uppst\u00e5r under normalt underh\u00e5ll \u00e4r det inte.

Flybolagen vet att de flesta passagerare inte vet detta. De hoppas att du ger upp.

## Vanliga fr\u00e5gor

**R\u00e4knas f\u00f6rseningen fr\u00e5n avg\u00e5ng eller ankomst?**
Alltid fr\u00e5n ankomst. Lagen tittar p\u00e5 n\u00e4r planet landade och d\u00f6rren \u00f6ppnats vid destinationen, inte n\u00e4r det rullade ut fr\u00e5n gaten hemma.

**Vad \u00e4r en extraordin\u00e4r omst\u00e4ndighet?**
H\u00e4ndelser helt utanf\u00f6r flygbolagets kontroll: extremt v\u00e4der, politiska oroligheter, strejker bland flygplatsens personal (inte flygbolagets eget folk), terrorhot. Tekniska fel r\u00e4knas normalt inte.

**Hur l\u00e5ng tid tar processen?**
Med direktkrav till flygbolaget: 4 till 8 veckor. Via ARN om de nekar: ytterligare 3 till 6 m\u00e5nader.

**Kan jag kr\u00e4va ers\u00e4ttning f\u00f6r ett flyg f\u00f6r tre \u00e5r sedan?**
Ja. Preskriptionstiden f\u00f6r flygkompensations\u00e4renden \u00e4r tre \u00e5r i Sverige.

---

*L\u00e4s mer: [komplett guide om f\u00f6rsenat flyg och dina r\u00e4ttigheter](/forsening) eller [hur du kr\u00e4ver ers\u00e4ttning av SAS specifikt](/flygbolag/sas).*`,
  }),

  article({
    slug: 'blogg/vanligaste-misstagen',
    title: '5 misstag som kostar dig ers\u00e4ttningen f\u00f6r f\u00f6rsenat flyg',
    meta_title: '5 misstag vid krav p\u00e5 flygers\u00e4ttning | FlightClaim.se',
    meta_desc: 'De flesta tappar pengar de har r\u00e4tt till p\u00e5 grund av enkla misstag. H\u00e4r \u00e4r de fem vanligaste och hur du undviker dem.',
    content: `![Avg\u00e5ngstavla p\u00e5 flygplats visar f\u00f6rsenat flyg](/images/articles/flygplats/avgangstavla.jpg)

Nio av tio som har r\u00e4tt till ers\u00e4ttning f\u00f6r ett f\u00f6rsenat flyg ans\u00f6ker aldrig om den. Av de som faktiskt f\u00f6rs\u00f6ker tappar m\u00e5nga pengar i on\u00f6dan p\u00e5 grund av enkla misstag som g\u00e5r att undvika. \u00c4r du os\u00e4ker p\u00e5 om du har r\u00e4tt? [Kontrollera gratis via oss](/anmalan) \u2014 det tar tv\u00e5 minuter.

## Vad s\u00e4ger lagen?

EU-f\u00f6rordning 261/2004 ger dig r\u00e4tt till ers\u00e4ttning om ditt flyg ankommer mer \u00e4n tre timmar f\u00f6rsenat. Beloppen \u00e4r 250\u00a0\u20ac, 400\u00a0\u20ac eller 600\u00a0\u20ac beroende p\u00e5 flygs\u00e4r\u00e4cka. R\u00e4ttigheterna g\u00e4ller automatiskt \u2014 du beh\u00f6ver inte ha k\u00f6pt en dyr biljett och du beh\u00f6ver inte vara EU-medborgare.

## Misstag 1: Du kastar boardingkortet

Det \u00e4r det vanligaste och dyraste misstaget. Ditt boardingkort \u00e4r det prim\u00e4ra beviset p\u00e5 att du faktiskt var ombord. Spara det fysiska kortet, ta en sk\u00e4rmbild av det digitala eller spara mejlbekr\u00e4ftelsen fr\u00e5n incheckningen.

## Misstag 2: Du r\u00e4knar f\u00f6rseningen fr\u00e5n avg\u00e5ngstid

Lagen r\u00e4knar alltid fr\u00e5n ankomsttid. Flyget lyfte en timme f\u00f6rsenat men landade \u00e4nd\u00e5 i tid? Ingen r\u00e4tt till ers\u00e4ttning. Flyget lyfte i tid men landade 3,5 timmar f\u00f6rsenat p\u00e5 grund av omv\u00e4g? Full r\u00e4tt till ers\u00e4ttning.

## Misstag 3: Du accepterar matbong eller voucher som full kompensation

Flygbolaget erbjuder dig 10\u00a0\u20ac i matbons vid gaten. Du tackar ja. L\u00e4ngre in i processen avvisar de ditt krav p\u00e5 400\u00a0\u20ac med argumentet att du redan accepterat kompensation.

Det \u00e4r vilseledande. R\u00e4tten till mat och dryck vid l\u00e4ngre v\u00e4ntan \u00e4r en separat r\u00e4ttighet och p\u00e5verkar inte din r\u00e4tt till ekonomisk kompensation.

> **\u00c4r du os\u00e4ker p\u00e5 om ett erbjudande du fick var korrekt?** [Ans\u00f6k kostnadsfritt](/anmalan) och vi bed\u00f6mer din situation.

## Misstag 4: Du tror att du gett upp r\u00e4tten

\u00c4ven om du accepterade en ombokning eller ett rabatterbjudande kvarst\u00e5r i de flesta fall r\u00e4tten till kompensation. Ombokning \u00e4r en separat skyldighet fr\u00e5n flygbolaget.

## Misstag 5: Du v\u00e4ntar f\u00f6r l\u00e4nge

Preskriptionstiden \u00e4r tre \u00e5r. Men dokumentation f\u00f6rsvinner. Ans\u00f6k om ers\u00e4ttning inom 12 m\u00e5nader efter flygdatumet. Ju f\u00e4rskare underlagen \u00e4r, desto enklare \u00e4r processen.

## Vanliga fr\u00e5gor

**Kr\u00e4vs det bevis f\u00f6r att flygbolaget orsakade f\u00f6rseningen?**
Nej. Bevissb\u00f6rdan ligger p\u00e5 flygbolaget, inte p\u00e5 dig.

**Vad r\u00e4knas som tillr\u00e4cklig dokumentation?**
Bokningsbekr\u00e4ftelse, boardingkort och ankomsttid.

**Kan jag fortfarande ans\u00f6ka om jag inte har kvar boardingkortet?**
Ja, men det kan ta l\u00e4ngre tid. Bokningsbekr\u00e4ftelsen r\u00e4cker i de flesta fall.

**\u00c4r det skattepliktigt att f\u00e5 kompensation?**
Nej. Ers\u00e4ttning enligt EU\u00a0261/2004 ses som kompensation f\u00f6r en uppkommen skada, inte som en inkomst.

---

*L\u00e4s mer: [allt om f\u00f6rsenat flyg och exakt hur mycket du kan f\u00e5](/forsening) eller [hur l\u00e5ng tid processen tar med olika flygbolag](/blogg/snabbaste-utbetalning).*`,
  }),

  article({
    slug: 'blogg/ryanair-nekar-ersattning',
    title: 'Ryanair nekar ers\u00e4ttning: vad g\u00f6r du nu?',
    meta_title: 'Ryanair nekar ers\u00e4ttning: n\u00e4sta steg | FlightClaim.se',
    meta_desc: 'Ryanair avvisar m\u00e5nga krav med h\u00e4nvisning till extraordin\u00e4ra omst\u00e4ndigheter. S\u00e5 motbevisar du dem och f\u00e5r dina pengar.',
    content: `![Ryanair-plan p\u00e5 startbana](/images/articles/flygbolag-ryanair.jpg)

Ryanair avvisar fler ers\u00e4ttningskrav \u00e4n de flesta andra flygbolag. Det \u00e4r ett faktum. Det \u00e4r ocks\u00e5 ett faktum att ARN och europeiska domstolar regelm\u00e4ssigt d\u00f6mer mot Ryanair i s\u00e5dana \u00e4renden. Du som f\u00e5tt ett nej har allts\u00e5 goda chanser att v\u00e4nda det. Vill du inte driva det ensam? [Ans\u00f6k om ers\u00e4ttning gratis](/anmalan) s\u00e5 tar vi \u00f6ver.

## Vad s\u00e4ger lagen?

EU-f\u00f6rordning 261/2004 g\u00e4ller f\u00f6r alla flyg som avg\u00e5r fr\u00e5n en EU-flygplats, oavsett vilket flygbolag. Det g\u00e4ller allts\u00e5 Ryanairs alla avg\u00e5ngar fr\u00e5n Sverige, Danmark, Finland, Polen och resten av EU, samt Ryanairs flyg till EU eftersom Ryanair \u00e4r ett EU-baserat flygbolag registrerat i Irland.

Kompensationsbelopp: 250\u00a0\u20ac (upp till 1\u00a0500\u00a0km), 400\u00a0\u20ac (EU-interna \u00f6ver 1\u00a0500\u00a0km), 600\u00a0\u20ac (utomeuropeiska \u00f6ver 3\u00a0500\u00a0km).

## Varf\u00f6r nekar Ryanair ers\u00e4ttning?

**"Extraordin\u00e4r omst\u00e4ndighet"** \u00e4r det vanligaste. Tekniska problem under normal drift kvalificerar inte automatiskt. V\u00e4der m\u00e5ste ha orsakat just din f\u00f6rsening, inte en generell st\u00f6rning som Ryanair hanterat utan problem f\u00f6r andra flyg samma dag.

**"F\u00f6rdröjning p\u00e5 under tre timmar"** f\u00f6rekommer n\u00e4r Ryanair h\u00e4vdar att ankomsttiden var kortare \u00e4n tre timmar efter schemat. Kontrollera din faktiska ankomsttid mot vad som stod i bokningen.

**Tystnad** \u00e4r ocks\u00e5 ett vanligt svar. Det \u00e4r i sig tillr\u00e4cklig grund f\u00f6r att anm\u00e4la till ARN.

## Steg f\u00f6r steg: vad du g\u00f6r nu

**Steg 1:** Spara bokningsbekr\u00e4ftelse, boardingkort och alla mejl fr\u00e5n Ryanair. Screenshota Ryanairs flight-status-sida med din faktiska ankomsttid.

**Steg 2:** Skicka ett konkret krav till Ryanair kundservice med flygnummer, rutt, exakt f\u00f6rsening och beg\u00e4rd kompensation. H\u00e4nvisa till EU\u00a0261/2004. Ge dem 14 dagar.

**Steg 3:** Om Ryanair nekar eller inte svarar, anm\u00e4l till ARN p\u00e5 arn.se. Gratis tj\u00e4nst.

**Steg 4:** V\u00e4nta p\u00e5 beslut. De flesta \u00e4renden avg\u00f6rs inom tre till sex m\u00e5nader. Ryanair f\u00f6ljer ARN:s beslut i de allra flesta fall.

> **Vill du inte hantera pappersarbetet?** [Starta din ans\u00f6kan h\u00e4r](/anmalan) \u2014 du betalar ingenting om vi inte lyckas.

## De vanligaste inv\u00e4ndningarna och hur du svarar

**Ryanair s\u00e4ger att v\u00e4der orsakade f\u00f6rseningen.** Vilket specifikt v\u00e4der, var och n\u00e4r? Berodde just ditt flyg p\u00e5 detta, eller hanterades andra flyg p\u00e5 samma rutt utan problem?

**Ryanair h\u00e4nvisar till crew rest requirement.** Bes\u00e4ttningens vilotider \u00e4r flygbolagets ansvar att planera. Det \u00e4r inte en extraordin\u00e4r omst\u00e4ndighet.

**Ryanair s\u00e4ger att du accepterat ombokning.** Ombokning p\u00e5verkar inte r\u00e4tten till kompensation.

## Vanliga fr\u00e5gor

**Kan jag klaga via en annan EU-myndighet om Ryanair \u00e4r irlSvenskt?**
Ja. Du kan v\u00e4nda dig till Transportstyrelsen i Sverige eller den irlanda Aviation Regulator (CAR).

**Vad h\u00e4nder om ARN ger mig r\u00e4tt men Ryanair \u00e4nd\u00e5 inte betalar?**
ARN:s beslut \u00e4r rekommendationer. Ryanair f\u00f6ljer dem i praktiken n\u00e4stan alltid. Om de \u00e4nd\u00e5 inte betalar kan du v\u00e4nda dig till Kronofogden.

**G\u00e4ller det om jag flev med ett paketpris via researrang\u00f6r?**
Ja. F\u00f6rordningen g\u00e4ller passageraren, inte vem som s\u00e5lde biljetten.

**Kan jag kr\u00e4va mer \u00e4n kompensationsbeloppet om jag missat jobb?**
M\u00f6jligt, men det \u00e4r ett separat ansp\u00e5k vid sidan av EU\u00a0261/2004-kompensationen.

---

*L\u00e4s mer: [v\u00e5r fullst\u00e4ndiga guide om Ryanair och ers\u00e4ttning](/flygbolag/ryanair) eller [allt om f\u00f6rsenat flyg och hur lagen fungerar](/forsening).*`,
  }),

  // ── Kluster 2: Inställt flyg ──────────────────────────────────────────────

  article({
    slug: 'blogg/wizz-air-installde-mitt-flyg',
    title: 'Wizz Air st\u00e4llde in mitt flyg: vad h\u00e4nder sen?',
    meta_title: 'Wizz Air inst\u00e4llt flyg: dina r\u00e4ttigheter | FlightClaim.se',
    meta_desc: 'Wizz Air st\u00e4llde in ett flyg och v\u00e4grade kompensation. Historien om ett lyckat krav och vad du har r\u00e4tt till.',
    content: `![Wizz Air-plan vid gate](/images/articles/flygbolag-wizz-air.jpg)

Wizz Air har en historia av inst\u00e4llda flyg med kort varsel. Det \u00e4r ocks\u00e5 ett flygbolag som regelm\u00e4ssigt h\u00e4nvisar till omst\u00e4ndigheter de inte kan r\u00e5 f\u00f6r, trots att ARN och europeiska myndigheter \u00e5terkommande d\u00f6mer mot dem. Har ditt Wizz Air-flyg st\u00e4llts in? [Ans\u00f6k om ers\u00e4ttning gratis](/anmalan) \u2014 vi vet hur man driver de h\u00e4r \u00e4rendena.

## Vad s\u00e4ger lagen?

EU-f\u00f6rordning 261/2004 ger dig r\u00e4tt till kompensation n\u00e4r ett flyg st\u00e4lls in, med ett viktigt undantag: informeras du mer \u00e4n 14 dagar innan avresan har du normalt inte r\u00e4tt till kompensation, bara r\u00e4tt till ombokning eller \u00e5terbetalning.

Fick du besked kortare \u00e4n 14 dagar f\u00f6re avg\u00e5ngsdatumet g\u00e4ller: 250\u00a0\u20ac (upp till 1\u00a0500\u00a0km), 400\u00a0\u20ac (EU-interna \u00f6ver 1\u00a0500\u00a0km), 600\u00a0\u20ac (utomeuropeiska \u00f6ver 3\u00a0500\u00a0km).

## En verklig historia

Kunden hade bokat ett Wizz Air-flyg fr\u00e5n G\u00f6teborg till Warszawa, avg\u00e5ng en torsdagskv\u00e4ll. Tisdagen samma vecka kom ett mejl: flyget var inst\u00e4llt och kunden erbjuds ombokning till l\u00f6rdagen. Kunden valde ombokning men beg\u00e4rde \u00e4ven kompensation \u2014 beskedet kom bara fyra dagar f\u00f6re avresan. Wizz Air svarade med en standardh\u00e4nvisning till "operativa sk\u00e4l utanf\u00f6r v\u00e5r kontroll".

ARN bed\u00f6mde att Wizz Air inte kunnat visa att det r\u00f6rde sig om en extraordin\u00e4r omst\u00e4ndighet. Kunden fick 250\u00a0\u20ac i kompensation, utanp\u00e5 den ombokning de redan erbjudit.

## Vad ska du g\u00f6ra nu?

V\u00e4lj ombokning eller \u00e5terbetalning. Kr\u00e4v r\u00e4tt till mat och logi om du v\u00e4ntar p\u00e5 flygplatsen. Skicka ett separat skriftligt krav om kompensation inom 7 dagar.

> **Fick du ett nej eller inget svar?** [Ans\u00f6k via oss](/anmalan) och vi driver \u00e4rendet. Du betalar ingenting om vi inte lyckas.

## Vanliga inv\u00e4ndningar fr\u00e5n Wizz Air

**"Operativa sk\u00e4l utanf\u00f6r v\u00e5r kontroll"** \u2014 kr\u00e4v skriftlig dokumentation om vad som specifikt orsakade inst\u00e4llningen.

**"Du erbjuds ombokning och accepterade"** \u2014 ombokning \u00e4r en separat skyldighet och p\u00e5verkar inte kompensationsr\u00e4tten.

**"Beskedet skickades mer \u00e4n 14 dagar i f\u00f6rv\u00e4g"** \u2014 kontrollera exakt n\u00e4r mejlet skickades mot ursprunglig avg\u00e5ngstid.

## Vanliga fr\u00e5gor

**Vad h\u00e4nder med mina \u00f6vriga bokningar?**
Flygbolaget \u00e4r inte skyldigt att ers\u00e4tta f\u00f6ljdkostnader som hotell och hyrbil du bokat separat. Det kan t\u00e4ckas av resef\u00f6rs\u00e4kring.

**Wizz Air erbjuds bara vouchers. M\u00e5ste jag acceptera?**
Nej. Du har r\u00e4tt till kontant \u00e5terbetalning och kompensation i pengar.

**G\u00e4ller det flyg bokade via Booking.com?**
Ja. R\u00e4ttigheten g\u00e4ller passageraren, inte hur biljetten k\u00f6ptes.

**Wizz Air \u00e4r ungerskt. Kan jag anm\u00e4la till ARN?**
Ja, du kan anm\u00e4la till ARN i Sverige eller till tillsynsmyndigheten i avg\u00e5ngslandet.

---

*L\u00e4s mer: [fullst\u00e4ndig guide om inst\u00e4llt flyg och dina r\u00e4ttigheter](/installda-flyg) eller [vad som g\u00e4ller n\u00e4r du f\u00e5r besked med kort varsel](/installda-flyg/sent-besked).*`,
  }),

  article({
    slug: 'blogg/instaellt-dagen-fore',
    title: 'Inst\u00e4llt flyg dagen f\u00f6re avresa: exakt vad du har r\u00e4tt till',
    meta_title: 'Inst\u00e4llt flyg dagen f\u00f6re: dina r\u00e4ttigheter | FlightClaim.se',
    meta_desc: 'Fick du besked om inst\u00e4llt flyg bara timmar eller en dag innan avg\u00e5ng? Du har r\u00e4tt till mer \u00e4n du tror. Konkret genomg\u00e5ng.',
    content: `![Flyginformationsk\u00e4rm p\u00e5 terminal visar inst\u00e4llt flyg](/images/articles/flygplats/flyginformation-skarm.jpg)

Beskedet kom kv\u00e4llen f\u00f6re avresan: ditt flyg \u00e4r inst\u00e4llt. Det \u00e4r en av de mest stressande situationerna en resenär kan hamna i. Men det ger dig ocks\u00e5 starka r\u00e4ttigheter. Vet du vad du kan kr\u00e4va? [Ans\u00f6k om ers\u00e4ttning gratis](/anmalan) och vi ser till att du f\u00e5r allt du har r\u00e4tt till.

## Vad s\u00e4ger lagen?

Informeras du kortare \u00e4n sju dagar f\u00f6re avg\u00e5ngsdatumet om att flyget st\u00e4lls in, och flygbolaget inte kan omboka dig p\u00e5 ett likv\u00e4rdigt alternativ, g\u00e4ller fulla kompensationsbelopp: 250\u00a0\u20ac (upp till 1\u00a0500\u00a0km), 400\u00a0\u20ac (EU-interna \u00f6ver 1\u00a0500\u00a0km), 600\u00a0\u20ac (utomeuropeiska \u00f6ver 3\u00a0500\u00a0km).

Utöver kompensationen har du r\u00e4tt till ombokning, fullst\u00e4ndig \u00e5terbetalning, m\u00e5ltider och dryck, hotell vid behov samt transport dit.

## Det h\u00e4r ska du g\u00f6ra de n\u00e4rmaste timmarna

**Dokumentera beskedet.** Ta en sk\u00e4rmbild av mejlet eller SMS:et med exakt tidpunkt.

**V\u00e4lj ombokning eller \u00e5terbetalning.** Tvinga flygbolaget att ge dig skriftliga alternativ. Acceptera inte muntliga l\u00f6ften.

**Kr\u00e4v hj\u00e4lp med logi.** Sitter du fast p\u00e5 resa har flygbolaget ansvar f\u00f6r ditt boende tills de kan flyga hem dig.

**Skicka ett formellt krav om kompensation** inom sju dagar, med h\u00e4nvisning till EU\u00a0261/2004.

> **\u00c4r du mitt i situationen?** [Ans\u00f6k via oss](/anmalan) s\u00e5 hanterar vi kompensationsdelen. Du kan fokusera p\u00e5 att ta dig dit du ska.

## Det vanligaste misstaget

M\u00e5nga tackar nej till erbjuden ombokning utan att f\u00f6rst\u00e5 att kompensationen i vissa fall minskar om ombokningen h\u00e5ller sig inom EU\u00a0261/2004:s tidsgr\u00e4nser. Fr\u00e5ga alltid: avg\u00e5r det erbjudna alternativet mer eller mindre \u00e4n sju timmar fr\u00e5n ursprunglig avg\u00e5ngstid?

## Vanliga fr\u00e5gor

**Vad h\u00e4nder om jag inte kan n\u00e5 flygbolaget p\u00e5 kv\u00e4llen?**
Dokumentera dina f\u00f6rs\u00f6k. Skicka mejl, anv\u00e4nd deras app, ta sk\u00e4rmdumpar.

**Flygbolaget erbjuder bara \u00e5terbetalning, inte kompensation. \u00c4r det r\u00e4tt?**
Nej. \u00c5terbetalning och kompensation \u00e4r separata r\u00e4ttigheter.

**G\u00e4ller det om jag bokat via en researrang\u00f6r?**
Ja. R\u00e4ttigheten g\u00e4ller alltid passageraren direkt.

**Preskriptionstid?**
Tre \u00e5r i Sverige fr\u00e5n flygdatumet.

---

*L\u00e4s mer: [fullst\u00e4ndig guide om inst\u00e4llda flyg](/installda-flyg) eller [vad som g\u00e4ller n\u00e4r du informeras kortare \u00e4n 14 dagar f\u00f6re](/installda-flyg/sent-besked).*`,
  }),

  article({
    slug: 'blogg/aterbetalning-vs-kompensation',
    title: '\u00c5terbetalning eller kompensation f\u00f6r inst\u00e4llt flyg? Det \u00e4r inte samma sak',
    meta_title: '\u00c5terbetalning vs kompensation: skillnaden | FlightClaim.se',
    meta_desc: 'M\u00e5nga n\u00f6jer sig med \u00e5terbetalning av biljettpriset och missar kompensationen de har r\u00e4tt till. H\u00e4r \u00e4r skillnaden.',
    content: `![Kabinint\u00f6r\u00f6r p\u00e5 flygplan \u2014 passagerarens r\u00e4ttigheter vid inst\u00e4llt flyg](/images/articles/flygplan/kabin-interior.jpg)

Flygbolaget \u00e5terbetalar biljettpriset. Du \u00e4r n\u00f6jd och t\u00e4nker att det l\u00f6st sig. Men du har kanske just missat 400\u00a0\u20ac till. \u00c5terbetalning och kompensation \u00e4r tv\u00e5 skilda r\u00e4ttigheter enligt EU\u00a0261/2004, och m\u00e5nga flygbolag hoppas att du inte vet det. \u00c4r du os\u00e4ker? [Kontrollera om du har mer att kr\u00e4va](/anmalan) \u2014 det kostar ingenting.

## Vad s\u00e4ger lagen?

EU-f\u00f6rordning 261/2004 ger passagerare tre separata r\u00e4ttigheter vid inst\u00e4llt flyg.

**R\u00e4tt 1 \u2014 Ombokning eller \u00e5terbetalning (artikel 8).** Du v\u00e4ljer ombokning p\u00e5 n\u00e4rmast m\u00f6jliga alternativa flyg eller full \u00e5terbetalning.

**R\u00e4tt 2 \u2014 R\u00e4tt till f\u00f6rs\u00f6rjning (artikel 9).** Mat, dryck och hotell vid v\u00e4ntan. G\u00e4ller oavsett orsak.

**R\u00e4tt 3 \u2014 Kompensation (artikel 7).** En fast summa (250\u2013600\u00a0\u20ac per person). G\u00e4ller inte vid inst\u00e4llningar med mer \u00e4n 14 dagars varsel eller om extraordin\u00e4r omst\u00e4ndighet bevisas.

De tre r\u00e4ttigheterna \u00e4r oberoende av varandra. Att acceptera \u00e5terbetalning p\u00e5verkar inte r\u00e4tten till kompensation.

## Varf\u00f6r f\u00f6rv\u00e4xlas de hela tiden?

Flygbolagen presenterar ofta \u00e5terbetalning som en l\u00f6sning, utan att n\u00e4mna kompensationen. Det \u00e4r rationellt fr\u00e5n deras perspektiv: varje passagerare som inte ans\u00f6ker sparar dem 250 till 600\u00a0\u20ac.

Det uppst\u00e5r ocks\u00e5 en psykologisk effekt. Du fick pengar tillbaka. Det k\u00e4nns som att saken \u00e4r avgj\u00f6rd, trots att halva historien \u00e5terst\u00e5r.

> **Fick du \u00e5terbetalning men aldrig kompensation?** Du kan fortfarande kr\u00e4va det, upp till tre \u00e5r bak\u00e5t. [Ans\u00f6k kostnadsfritt](/anmalan).

## Tabell: vad du har r\u00e4tt till vid inst\u00e4llt flyg

| R\u00e4ttighet | Besked \u00f6ver 14 dagar | Besked 7\u201314 dagar | Besked under 7 dagar |
|-----------|---------------------|-------------------|----------------------|
| \u00c5terbetalning eller ombokning | Ja | Ja | Ja |
| Mat och dryck | Ja | Ja | Ja |
| Kompensation (250\u2013600\u00a0\u20ac) | Nej | Delvis | Ja* |

*Nej om extraordin\u00e4r omst\u00e4ndighet bevisas.

## Vanliga fr\u00e5gor

**Flygbolaget erbjuder mig 50\u00a0\u20ac i vouchers som kompensation. \u00c4r det r\u00e4tt?**
Nej. Kompensationsbeloppet \u00e4r 250\u2013600\u00a0\u20ac per person i kontant form. Vouchers beh\u00f6ver du inte acceptera.

**Jag fick \u00e5terbetalning. Kan jag fortfarande kr\u00e4va kompensation?**
Ja, om inst\u00e4llningen uppfyller villkoren.

**Kan jag f\u00e5 kompensation och \u00e4nd\u00e5 resa p\u00e5 ett nytt flyg?**
Ja. Ombokning och kompensation \u00e4r separata r\u00e4ttigheter.

**Vad om flygbolaget gick i konkurs?**
Komplicerat. Tillg\u00e5ngarna i konkursboet kan ha krav p\u00e5 sig, men utbetalning \u00e4r os\u00e4ker. Kontakta Konsumentverket.

---

*L\u00e4s mer: [fullst\u00e4ndig guide om inst\u00e4llda flyg](/installda-flyg) eller [vad som g\u00e4ller med kort varsel](/installda-flyg/sent-besked).*`,
  }),

  // ── Kluster 3: Flygbolag ──────────────────────────────────────────────────

  article({
    slug: 'blogg/snabbaste-utbetalning',
    title: 'Vilket flygbolag betalar ut ers\u00e4ttning snabbast?',
    meta_title: 'Flygbolag som betalar snabbast: ranking | FlightClaim.se',
    meta_desc: 'SAS, Norwegian eller Ryanair \u2014 vem betalar kompensation snabbast och vem drar ut p\u00e5 det? V\u00e5r genomg\u00e5ng av de vanligaste bolagen.',
    content: `![Boeing 737 p\u00e5 startbana \u2014 j\u00e4mf\u00f6relse av flygbolag och utbetalningstid](/images/articles/flygbolag/klm-boeing-737.jpg)

Det finns en utbredd missuppfattning om att flygkompensation alltid tar evigheter. Verkligheten \u00e4r mer nyanserad. Vissa flygbolag betalar relativt snabbt. Andra drar ut p\u00e5 processen i hopp om att du ger upp. H\u00e4r \u00e4r vad vi sett i faktiska \u00e4renden. [Ans\u00f6k om ers\u00e4ttning gratis](/anmalan) och vi hanterar hela kontakten \u00e5t dig.

## Vad s\u00e4ger lagen?

EU-f\u00f6rordning 261/2004 specificerar ingen exakt tidsgr\u00e4ns f\u00f6r hur snabbt ett flygbolag m\u00e5ste betala ut kompensation. I praktiken varierar handl\u00e4ggningstiden kraftigt mellan bolagen.

## SAS: godk\u00e4nt med reservation

SAS h\u00f6r till de svenska flygbolag som hanterar krav relativt snabbt n\u00e4r de bed\u00f6mer att kompensation \u00e4r sk\u00e4lig. En initial respons inom tre till fyra veckor \u00e4r vanlig.

Handl\u00e4ggningstid vid godk\u00e4nt krav: 30\u201360 dagar.
Handl\u00e4ggningstid via ARN: 4\u20138 m\u00e5nader totalt.

## Norwegian: acceptabel process

Norwegian f\u00f6ljer i allm\u00e4nhet EU\u00a0261/2004 korrekt. Initial respons sker ofta inom tv\u00e5 veckor. Utbetalning n\u00e4r den godk\u00e4nns sker vanligtvis inom 30 dagar.

Handl\u00e4ggningstid vid godk\u00e4nt krav: 3\u20135 veckor.
Handl\u00e4ggningstid via ARN: 3\u20136 m\u00e5nader totalt.

## Ryanair: medvetet tr\u00f6ghetssystem

Ryanair avvisar en ovanligt h\u00f6g andel inkomna krav i f\u00f6rsta steget. De som ger upp efter det f\u00f6rsta nejet sparar Ryanair pengar. Ryanair f\u00f6ljer dock ARN:s beslut i de allra flesta fall.

Handl\u00e4ggningstid vid godk\u00e4nt direkt krav: 8\u201316 veckor.
Handl\u00e4ggningstid via ARN: 6\u201310 m\u00e5nader totalt.

> **Vill du slippa den l\u00e5nga processen med Ryanair?** [Ans\u00f6k kostnadsfritt](/anmalan).

## Wizz Air: varierande respons

Handl\u00e4ggningstiderna varierar kraftigt. Ibland l\u00f6ser sig ett krav relativt snabbt via deras kundportal. Ofta kr\u00e4vs ARN-process.

Handl\u00e4ggningstid vid godk\u00e4nt direkt krav: 4\u201310 veckor.
Handl\u00e4ggningstid via ARN: 4\u20138 m\u00e5nader totalt.

## Vad du kan g\u00f6ra f\u00f6r att p\u00e5skynda

S\u00e4tt en deadline i din beg\u00e4ran: "Jag f\u00f6rv\u00e4ntar mig svar och utbetalning inom 14 dagar, i annat fall anm\u00e4ler jag \u00e4rendet till ARN." Det \u00e4r fullt lagligt och skapar en tydlig tidsram. Anm\u00e4l snabbt till ARN om de inte svarar i tid.

## Vanliga fr\u00e5gor

**Kan jag kr\u00e4va r\u00e4nta om de dr\u00f6jer?**
I teorin ja. I praktiken s\u00e4llan v\u00e4rt att driva f\u00f6r summorna det r\u00f6r sig om.

**Spelar det roll om jag anlitar en ers\u00e4ttningsbyr\u00e5?**
Flygbolagen behandlar krav fr\u00e5n juridiska ombud ibland snabbare.

**Finns det en myndighet som kan pressa flygbolaget?**
Transportstyrelsen har tillsyn men driver inte individuella \u00e4renden.

**Kan jag beg\u00e4ra utbetalning till ett utl\u00e4ndskt konto?**
Ja. EU\u00a0261/2004 specificerar inte kontotyp eller land.

---

*L\u00e4s mer: [v\u00e5r guide om f\u00f6rsenat flyg och dina r\u00e4ttigheter](/forsening) eller [allt om flygbolagen och hur de hanterar krav](/flygbolag).*`,
  }),

  article({
    slug: 'blogg/ryanair-extraordinara',
    title: 'Ryanairs extraordin\u00e4ra omst\u00e4ndigheter: n\u00e4r h\u00e5ller det och n\u00e4r h\u00e5ller det inte?',
    meta_title: 'Ryanair och extraordin\u00e4ra omst\u00e4ndigheter | FlightClaim.se',
    meta_desc: 'Ryanair h\u00e4nvisar ofta till extraordin\u00e4ra omst\u00e4ndigheter f\u00f6r att slippa betala. H\u00e4r \u00e4r fallen d\u00e4r det h\u00e5ller och n\u00e4r det inte g\u00f6r det.',
    content: `![Flygplan under landning \u2014 extraordin\u00e4ra omst\u00e4ndigheter och ers\u00e4ttningsr\u00e4tt](/images/articles/flygplan/flygplan-landning.jpg)

"Extraordin\u00e4r omst\u00e4ndighet" \u00e4r Ryanairs vanligaste sk\u00e4l f\u00f6r att avvisa ers\u00e4ttningskrav. Bolaget h\u00e4nvisar till den mer frekvent \u00e4n de flesta andra flygbolag. Men det betyder inte att de har r\u00e4tt. ARN och EU-domstolen har upprepade g\u00e5nger konstaterat att Ryanairs anv\u00e4ndning av begreppet ibland \u00e4r felaktig. [Ans\u00f6k om ers\u00e4ttning gratis](/anmalan) om Ryanair avvisat ditt krav \u2014 vi bed\u00f6mer om det h\u00e5ller.

## Vad s\u00e4ger lagen?

EU-f\u00f6rordning 261/2004 artikel 5(3): ett flygbolag \u00e4r befriat fr\u00e5n kompensationsskyldigheten om f\u00f6rseningen orsakades av "extraordin\u00e4ra omst\u00e4ndigheter som inte hade kunnat undvikas \u00e4ven om alla rimliga \u00e5tg\u00e4rder hade vidtagits."

EU-domstolen har fastst\u00e4llt att en extraordin\u00e4r omst\u00e4ndighet m\u00e5ste uppfylla tv\u00e5 krav: den ska vara utanf\u00f6r flygbolagets kontroll, och den ska inte ha kunnat f\u00f6rebyggas ens med alla rimliga \u00e5tg\u00e4rder.

## Situationer d\u00e4r det faktiskt h\u00e5ller

**Extremt v\u00e4der.** En orkan, vulkanutbrott eller exceptionellt sn\u00f6fall som st\u00e4nger flygplatsen. Men v\u00e4dret m\u00e5ste ha orsakat just din f\u00f6rsening.

**Politiska oroligheter.** Luftrumsst\u00e4ngningar p\u00e5 grund av milit\u00e4r aktivitet eller terrorhot.

**Strejker bland flygplatspersonalen.** Bagagehanterare eller s\u00e4kerhetspersonal som Ryanair inte r\u00e5der \u00f6ver. Strejker bland Ryanairs egna anst\u00e4llda r\u00e4knas inte.

## Situationer d\u00e4r det inte h\u00e5ller

**Tekniska fel under normal drift.** EU-domstolens dom i Wallentin-Hermann mot Alitalia (m\u00e5l C-549/07) slog fast att tekniska fel under rutinunderh\u00e5ll inte \u00e4r extraordin\u00e4ra omst\u00e4ndigheter. Ryanair h\u00e4nvisar \u00e4nd\u00e5 till det regelm\u00e4ssigt.

**Sent inkommande plan.** Om Ryanair planerar sin tidtabell utan tillr\u00e4ckliga buffertar \u00e4r det ett planeringsproblem, inte en extraordin\u00e4r omst\u00e4ndighet.

**Bes\u00e4ttningens arbetstid.** Pilotens flygtidsbegr\u00e4nsningar \u00e4r Ryanairs ansvar att planera runt.

> **Ryanair s\u00e4ger "extraordin\u00e4r omst\u00e4ndighet" men specificerar inte vad?** [Ans\u00f6k hos oss](/anmalan) och vi granskar om de faktiskt kan bevisa det.

## Hur du motbevisar h\u00e4nvisningen

Be Ryanair specificera exakt vad som h\u00e4nde. Kolla flightradar24.com \u2014 om andra flyg med liknande f\u00f6ruts\u00e4ttningar gick normalt samma dag \u00e4r det ett argument mot att en genuint extraordin\u00e4r omst\u00e4ndighet f\u00f6rel\u00e5g.

## Vanliga fr\u00e5gor

**Hur l\u00e4nge har Ryanair p\u00e5 sig att motbevisa mitt krav?**
ARN s\u00e4tter normalt 30 dagars svarstid. Om de inte kan visa en extraordin\u00e4r omst\u00e4ndighet d\u00f6mer ARN vanligtvis f\u00f6r dig.

**Kan jag kr\u00e4va kompensation om f\u00f6rseningen delvis berodde p\u00e5 extraordin\u00e4r omst\u00e4ndighet?**
EU-domstolen har i praxis slagit fast att du kan ha r\u00e4tt till kompensation om bara en del av f\u00f6rseningen orsakades av extraordin\u00e4r omst\u00e4ndighet.

**Wizz Air och Norwegian h\u00e4nvisar till samma saker. G\u00e4ller samma principer?**
Ja. Definitionen \u00e4r densamma f\u00f6r alla EU-baserade flygbolag.

**Kan Ryanair st\u00e4mma mig om jag vinner i ARN?**
Nej. ARN \u00e4r ett rekommendationsorgan, inte en domstol.

---

*L\u00e4s mer: [guide om extraordin\u00e4ra omst\u00e4ndigheter](/forsening/anmarkningsvarda) eller [Ryanair och dina r\u00e4ttigheter](/flygbolag/ryanair).*`,
  }),

  article({
    slug: 'blogg/sas-konkurs-rattigheter',
    title: 'SAS-konkursen: vad h\u00e4nde med passagerarnas r\u00e4ttigheter?',
    meta_title: 'SAS-konkursen och passagerares r\u00e4ttigheter | FlightClaim.se',
    meta_desc: 'SAS gick igenom konkurs 2022. Vi reder ut vad det innebar f\u00f6r dig som hade biljetter och vilka r\u00e4ttigheter du fortfarande har.',
    content: `![SAS-flygplan i Kiruna \u2014 skandinavisk luftfart och passagerares r\u00e4ttigheter](/images/articles/flygbolag/sas-kiruna.jpg)

SAS ans\u00f6kte om konkursf\u00f6rfarande i USA 2022. Nyheten skapade oro bland resa\u00e4r med bokade biljetter och p\u00e5g\u00e5ende ers\u00e4ttnings\u00e4renden. Vad innebar det egentligen? Och vad g\u00e4ller f\u00f6r dig som har ett \u00e4rende mot SAS idag? [Kontrollera dina r\u00e4ttigheter gratis](/anmalan) \u2014 vi hj\u00e4lper dig bed\u00f6ma din situation.

## Vad h\u00e4nde med SAS?

I juli 2022 ans\u00f6kte SAS om Chapter 11-skydd i en amerikansk konkursdomstol i New York. Chapter 11 \u00e4r ett omstruktureringsf\u00f6rfarande, inte en total likvidation. SAS fortsatte flyga och befintliga biljetter var g\u00e4ltiga. EU\u00a0261/2004 fortsatte g\u00e4lla f\u00f6r alla SAS-avg\u00e5ngar fr\u00e5n EU-flygplatser.

## Vad h\u00e4nde med p\u00e5g\u00e5ende ers\u00e4ttnings\u00e4renden?

Under Chapter 11 fryses normalt alla fordringar. SAS valde \u00e4nd\u00e5 att hantera ers\u00e4ttningskrav via sin normala kundservice under omstruktureringen. Det fungerade f\u00f6r de flesta, men handl\u00e4ggningstiderna blev l\u00e4ngre.

## Vad g\u00e4ller idag?

SAS avslutade Chapter 11-f\u00f6rfarandet och tr\u00e4dde ut ur omstruktureringen 2024 som ett restrukturerat bolag delvis \u00e4gt av Air France-KLM. EU\u00a0261/2004 g\u00e4ller fullt ut f\u00f6r alla SAS-avg\u00e5ngar.

> **Har du ett gammalt \u00e4rende mot SAS som du aldrig drev klart?** Preskriptionstiden \u00e4r tre \u00e5r. [Ans\u00f6k kostnadsfritt](/anmalan).

## Vad om SAS inst\u00e4llde mitt flyg under omstruktureringsperioden?

Du har r\u00e4tt till kompensation enligt EU\u00a0261/2004 om inst\u00e4llningen uppfyller lagens villkor. Ett inst\u00e4llt flyg fr\u00e5n december 2022 kan fortfarande drivas fram till december 2025.

## Vad l\u00e4rde oss detta?

Flybe gick i konkurs 2020. Air Berlin 2017. Vid total konkurs m\u00e5ste krav anm\u00e4las till konkursf\u00f6rvaltaren och utdelningen \u00e4r ofta l\u00e5g. SAS-fallet var lyckligtvis en omstrukturering, inte en likvidation.

## Vanliga fr\u00e5gor

**Jag hade ett p\u00e5g\u00e5ende ARN-\u00e4rende mot SAS under 2022\u20132023. Vad h\u00e4nde med det?**
ARN-\u00e4renden hanterades av ARN som vanligt. Om ARN fattade beslut till din f\u00f6rdel och SAS inte betalade \u00e4r det nu ett normalt krav mot ett fungerande bolag.

**SAS \u00e4r nu delvis franskt. G\u00e4ller fortfarande svenska regler?**
Ja. EU\u00a0261/2004 g\u00e4ller EU-baserade flygbolag oavsett \u00e4garstruktur.

**Kan jag kr\u00e4va ers\u00e4ttning f\u00f6r inrikesflygningar med SAS?**
Ja. EU\u00a0261/2004 t\u00e4cker \u00e4ven inrikesflygningar inom Sverige.

**Jag betalade f\u00f6r ett resepaket som inkluderade SAS. Vem kr\u00e4ver jag?**
B\u00e5de researrang\u00f6ren (paketreselagen) och SAS direkt (EU\u00a0261/2004).

---

*L\u00e4s mer: [guide om SAS och hur du kr\u00e4ver ers\u00e4ttning](/flygbolag/sas) eller [allt om f\u00f6rsenat flyg och dina r\u00e4ttigheter](/forsening).*`,
  }),
];

// ── Migration ─────────────────────────────────────────────────────────────────

exports.up = async function (knex) {
  for (const art of ARTICLES) {
    const exists = await knex('articles').where({ slug: art.slug }).first();
    if (!exists) {
      await knex('articles').insert(art);
    }
  }
};

exports.down = async function (knex) {
  const slugs = ARTICLES.map((a) => a.slug);
  await knex('articles').whereIn('slug', slugs).delete();
};
