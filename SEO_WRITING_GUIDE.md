# SEO-skrivguide för FlightClaim-artiklar

Denna guide gäller alla artiklar som publiceras på flightclaim.se. Läs igenom den noggrant innan du skriver en enda rad. Syftet är att varje artikel ska ranka högt i Google, bygga tillit hos läsaren och konvertera besökare till ansökningar. Allt hänger ihop.

---

## STANDARDMALL — kopiera denna för varje ny artikel

Nedan visas den exakta strukturen som varje artikel ska följa. Kopiera mallen, fyll i platsmarkörerna och ta aldrig bort en sektion utan giltigt skäl.

### Del 1 — Inställningar i admin-panelen

Fyll i dessa fält i admin under `/admin` innan du börjar skriva:

```
Titel (H1):        [Primärsökord: konkret fråga eller utfall]
Slug:              [url-slug utan snedstreck, t.ex. "hur-mycket"]
Parent slug:       [föräldresidens slug, t.ex. "forsening" — lämna tomt för pillar]
Typ:               guide / airline / blog
Status:            draft (byt till published när texten är godkänd)
Meta title:        [Max 60 tecken] | FlightClaim.se
Meta description:  [Max 160 tecken. Fakta + vad läsaren får + uppmaning.]
Schema-typ:        FAQPage (pillar/guide) · Article (blogg) · none (enkel spoke)
Affiliate ref:     [lämna tomt om ej relevant]
```

Parent slug är det som skapar brödsmulorna automatiskt. Om du skriver `/forsening/hur-mycket` ska parent slug vara `forsening`. Systemet skapar då brödsmulespåret **Hem › Försenat flyg › Hur mycket kan du få?** utan att du behöver göra något mer.

---

### Del 2 — Innehållsmallen (klistra in i Markdown-editorn)

Ersätt allt inom hakparenteser. Ta inte bort rubrikerna, bara texten under dem.

```markdown
![Hero-bild: [BESKRIVANDE ALT-TEXT MED SÖKORD]](/images/articles/[SLUG].jpg)

[INGRESS: 2 till 3 meningar. Svara direkt på frågan. Inga uppvärmningar.
Avsluta med: "Är du redan drabbad? [Ansök om ersättning gratis](/anmalan) så
sköter vi hela processen åt dig."]

## Vad säger lagen?

[Förklara EU-förordning 261/2004 kopplat till artikelns ämne. Nämn exakta
belopp och tidsgränser. Länka till EUR-Lex eller Konsumentverket som källa.
Minst 150 ord.]

## [Rubrik 2 — artikelns kärna]

[Fördjupad förklaring av det som läsaren faktiskt kom hit för. Här ska den
konkreta situationen beskrivas. Variera meningslängden. Inga bindestreck som
tankestreck. Minst 200 ord.]

### [Underrubrik om avsnittet är längre än 300 ord]

[Fortsatt text.]

## [Rubrik 3 — praktiska steg eller undantag]

[Gå igenom vad läsaren konkret ska göra, eller förklara de vanligaste
undantagen/undanflykterna från flygbolagen. Minst 150 ord.]

> **Har du redan väntat länge på svar från flygbolaget?** Många ger upp i
> det läget. Vi driver ditt ärende vidare utan att du behöver göra något mer.
> [Starta din ansökan här](/anmalan) — det tar två minuter och kostar ingenting.

## [Rubrik 4 — vanliga missuppfattningar ELLER jämförelse/tabell]

[Korrigera de vanligaste felen folk gör eller tror. Alternativt: visa en
tabell med ersättningsbelopp, tidsgränser eller flygbolagsrankning.
Minst 100 ord.]

## Vanliga frågor

[Skriv minst 4 frågor. Formulera dem som en människa faktiskt söker dem,
inte som läroboksrubriker. Varje svar ska vara komplett i sig, max 4 meningar.]

**Fråga 1?**
[Svar som inte kräver att man läst resten av artikeln.]

**Fråga 2?**
[Svar.]

**Fråga 3?**
[Svar.]

**Fråga 4?**
[Svar.]

---

*Läs mer: [LÄNK TILL PILLAR-SIDAN MED BESKRIVANDE ANKARTEXT] eller
[LÄNK TILL SYSTER-SPOKE MED BESKRIVANDE ANKARTEXT].*
```

---

### Del 3 — Bildkonvention

Varje artikel ska ha en hero-bild längst upp i Markdown-innehållet. Bilden renderas av `marked` och visas som det första elementet under brödsmulespåret.

**Namngivning:** `/images/articles/[SLUG].jpg`

Exempel:
- `/images/articles/forsening.jpg`
- `/images/articles/forsening-hur-mycket.jpg`
- `/images/articles/flygbolag-ryanair.jpg`
- `/images/articles/blogg-case-study.jpg`

**Alt-text:** Ska alltid innehålla primärsökordet och beskriva bilden. Aldrig `bild1.jpg` eller `hero`. Skriv `Passagerare väntar på försenat flyg på flygplats`.

**Tekniskt format:** JPG, minst 1 200px bred, max 200 kB. Komprimera med squoosh.app eller liknande.

Om ingen specifik bild finns: använd `/images/articles/default-flyg.jpg` som fallback tills en riktig bild läggs till.

---

### Del 4 — CTA-placeringar i varje artikel

Det ska finnas **tre konverteringspunkter** i varje artikel. Ingen mer, ingen mindre.

**CTA 1 — I ingressen (sista meningen):**
Ska alltid finnas och alltid länka till `/anmalan`. Formulera det som en naturlig konsekvens av det du precis sagt, inte som en reklamjingel.

Exempel: "Är du redan drabbad? [Ansök om ersättning gratis](/anmalan) så sköter vi hela processen åt dig."

**CTA 2 — Mitt i artikeln (blockquote-format):**
Placeras efter det tyngsta informationsavsnittet, när läsaren just fått den kunskap de behövde och är redo att agera. Använd blockquote-formateringen från mallen ovan så att den sticker ut visuellt.

Exempel: "Har du redan väntat länge på svar från flygbolaget? Vi driver ditt ärende vidare. [Starta din ansökan här](/anmalan) — det tar två minuter."

**CTA 3 — Artikel-mallens bottenbanner:**
Renderas automatiskt av systemet. Du behöver inte skriva den. Den finns alltid längst ner på varje artikel-sida.

**Regler för CTA-text:**
Texten ska aldrig vara identisk i CTA 1 och CTA 2. Variera budskapet: den första kan handla om att "kolla om du har rätt", den andra om att "vi driver ditt ärende nu".

Ord som konverterar bra i detta segment:
- "gratis"
- "utan risk"
- "du betalar ingenting om vi inte vinner"
- "det tar två minuter"
- "vi sköter hela kontakten med flygbolaget"

---

### Del 5 — Intern länkstruktur per artikeltyp

**Pillar-sida** (t.ex. `/forsening`):
Ska länka ut till samtliga sina spoke-artiklar. Länkarna ska vara naturliga i brödtexten, inte en lista i slutet. Pillar-sidan tar emot inkommande länkar från alla sina spokes och från relevanta blogg-artiklar.

**Spoke-sida** (t.ex. `/forsening/hur-mycket`):
Ska länka upp till sin pillar minst en gång i brödtexten. Det är den enskilt viktigaste interna länken på sidan. Kan länka sidledes till en syster-spoke om det är naturligt, men aldrig forcerat.

**Blogg-artikel** (t.ex. `/blogg/ryanair-nekar-ersattning`):
Ska länka till minst en pillar. Ska aldrig bara länka till startsidan. Bloggen ska alltid peka uppåt mot guiderna, inte nedåt mot ingenting.

**Flygbolagssida** (t.ex. `/flygbolag/ryanair`):
Ska länka till `/forsening` eller `/installda-flyg` beroende på kontext. Ska aldrig vara en isolerad ö.

---

## Vad vi faktiskt konkurrerar om

Vår marknad är informationssökningar kring flygrättigheter på svenska. Konkurrenterna är Flightright, Flyghjälp och AirHelp. Alla tre har samma svaghet: generiskt, tunt och ofta maskinöversatt innehåll. Vår fördel är djupt, välstrukturerat, faktabaserat och mänskligt skrivet innehåll som faktiskt svarar på frågan.

Google rankar inte bara ord. Det rankar **topikalisk auktoritet** — sajter som äger ett ämne på riktigt. Det innebär att varje artikel vi publicerar stärker alla andra artiklar. Skriv aldrig en artikel som ett isolerat stycke text. Skriv den som en del av ett sammanhängande system.

---

## Grundregler (inga undantag)

### 1. Inga bindestreck som tankestreck

Använd **aldrig** bindestreck ( - ) för att ersätta ett tankestreck eller komma. Det är ett av de tydligaste AI-tecknen som finns och skadar trovärdigheten direkt.

**Fel:** "Du kan ha rätt till ersättning - men det finns undantag."
**Rätt:** "Du kan ha rätt till ersättning, men det finns undantag."
**Rätt:** "Du kan ha rätt till ersättning. Det finns dock undantag."

Använd komma, punkt, "men", "dock", "däremot", "och", "samt" i stället.

### 2. Variera meningslängden

Mänsklig text har **burstiness** — en naturlig rytm av korta och långa meningar. AI skriver meningar som är nästan exakt lika långa. Det märks.

**Exempel på bra rytm:**
> Tre timmar. Så lång försening krävs som minst innan EU:s regelverk ger dig rätt till ersättning. Men det är inte hela sanningen, för flygbolaget kan undgå ersättningsskyldigheten om de kan bevisa att orsaken var en så kallad extraordinär omständighet, exempelvis en vulkanutbrott eller en terroristattack, och att de inte kunde ha gjort något åt situationen ens om de hade försökt.

Kort. Kort. Lång med detaljer. Sedan kort igen. Aldrig tre likabent långa meningar i rad.

### 3. Inga AI-klyschor

Ta bort dessa fraser ur ditt ordförråd helt:

- "Det är viktigt att notera att..."
- "Sammanfattningsvis..."
- "Övergripande sett..."
- "I dagens samhälle..."
- "Med detta i åtanke..."
- "Det är värt att nämna att..."
- "Låt oss utforska..."
- "Kom ihåg att..."
- "Avslutningsvis vill vi säga..."

Om du hittar någon av dessa i texten: ta bort hela meningen och skriv om den.

### 4. Skriv till en person, inte till en massa

Använd **du** genomgående. Inte "resenärer", inte "passagerare", inte "man". Du pratar med en konkret människa som precis landade fyra timmar försenad och är frustrerad.

**Fel:** "Resenärer bör spara sina boardingkort."
**Rätt:** "Spara ditt boardingkort. Det kan vara det viktigaste pappret du har när du ska kräva ersättning."

### 5. Fakta och lag är grunden

Vi skriver om YMYL-ämnen (Your Money, Your Life) vilket innebär att Google granskar oss extra hårt. Varje påstående om rättigheter måste kunna backas upp av EU-förordning 261/2004, ARN, Konsumentverket eller Luftfartsverket.

Nämn alltid:
- Exakt förordningsnummer (EU 261/2004)
- Exakta belopp (250€, 400€, 600€)
- Exakta tidsgränser (3 timmar försening, 14 dagar för inställt flyg)
- Exakta distansgränser (1 500 km, 3 500 km)

Vaga påståenden rankar sämre och urholkar trovärdigheten.

---

## Artikeltyper och ordräkningsmål

### Pillar-sida (klusterHub)

**Exempel:** `/forsening`, `/installda-flyg`, `/flygbolag`

Ordmål: **1 500 till 2 500 ord**

En pillar-sida är den mest kompletta genomgången av ett ämne. Den svarar på huvud-frågan, berör alla underteman ytligt och länkar ut till varje spoke-artikel som fördjupar respektive undertema. Pillar-sidan ska vara den bästa enskilda resursen på svenska för just det ämnet.

Struktur:
1. H1 med huvud-sökordet
2. Ingress (2 till 3 meningar) som svarar direkt på frågan utan att hålla inne information
3. H2: Vad säger lagen? (med exakta fakta från EU 261/2004)
4. H2: Hur mycket kan du få? (tabell med belopp och distanser)
5. H2 per undertema med kort förklaring + länk till spoke-artikel
6. FAQ-sektion (minst 4 frågor, används för FAQPage-schema)
7. CTA-sektion

### Spoke-sida (klustergren)

**Exempel:** `/forsening/hur-mycket`, `/installda-flyg/force-majeure`

Ordmål: **800 till 1 400 ord**

En spoke-sida fördjupar ett specifikt undertema. Den börjar med att länka tillbaka till pillar-sidan och förklarar ett enda ämne grundligt. Ska inte försöka täcka allt, bara ett.

Struktur:
1. H1 med lång-svanssökordet (the specific question)
2. Ingress (direkt svar på frågan, ingen utfyllnad)
3. H2: Bakgrund/sammanhang
4. H2: Regelverket i detalj
5. H2: Praktiska steg för läsaren
6. H2: Vanliga missuppfattningar (stark SEO-vinkel)
7. Länk tillbaka till pillar-sidan (naturlig intern länk)
8. CTA

### Blogg-artikel

**Exempel:** `/blogg/ryanair-nekar-ersattning`, `/blogg/forsenat-flyg-case-study`

Ordmål: **800 till 1 500 ord**

Bloggen är för berättande och case-study-format. Här kan du använda en mer personlig ton, berätta historier och diskutera verkliga fall. Varje bloggartikel måste länka till minst en pillar-sida.

Struktur:
1. H1: Konkret och klickvärd rubrik (nyhet, case, vanlig fråga)
2. Ingress: Börja med berättelse eller konkret händelse
3. Brödtext: Berätta, analysera, dra slutsats
4. H2: Vad säger lagen i det här fallet?
5. H2: Vad kan du göra om det händer dig?
6. CTA

### Flygbolagssida

**Exempel:** `/flygbolag/ryanair`, `/flygbolag/sas`

Ordmål: **1 000 till 1 600 ord**

Kombinerar pillar-djup med specifik flygbolagsinformation. Läsaren vet redan vilket bolag de flög med och söker specifik hjälp.

Struktur:
1. H1: "[Flygbolag] ersättning: vad har du rätt till?"
2. Ingress: Direkt svar + bolagets rykte för att betala ut ersättning
3. H2: Hur hanterar [Flygbolag] ersättningskrav?
4. H2: Hur mycket kan du få av [Flygbolag]?
5. H2: Steg för steg: kräva ersättning av [Flygbolag]
6. H2: Vanliga undanflykter från [Flygbolag]
7. Länk till pillar (/forsening eller /installda-flyg)
8. CTA

---

## Rubrikformler som funkar

H1 ska alltid innehålla det primära sökordet och svara på en konkret fråga. Tre beprövade formler:

**Formel 1 — Direkt fråga:**
"Försenat flyg: vad har du rätt till?"

**Formel 2 — Specificitet:**
"Hur mycket ersättning kan du få för försenat flyg?"

**Formel 3 — Konkret utfall:**
"Ryanair nekar ersättning: vad gör du nu?"

H2-rubriker ska fungera som kapitel i en bok. En läsare som bara läser H2-rubrikerna ska förstå hela artikelns logik utan att läsa brödtexten.

H3-rubriker används när ett H2-avsnitt är längre än 300 ord och behöver brytas upp. Inte annars.

---

## Ingressregeln

Ingressen är de första 2 till 3 meningarna. Det är det viktigaste du skriver. Google visar den i sökresultaten. Läsaren avgör på 3 sekunder om artikeln är värd att läsa.

**Regel:** Svara direkt. Håll inte inne svaret för att "bygga upp". Ingen som söker "hur länge måste flyget vara försenat" vill läsa tre meningar om hur vanliga förseningar är. De vill ha svaret.

**Fel:**
> "Flygresor är idag ett vanligt sätt att resa och tyvärr händer det att flyg blir försenade. Det kan vara frustrerande och påverka dina resor negativt. I den här artikeln går vi igenom vad du har rätt till."

**Rätt:**
> "Ditt flyg måste vara försenat med minst tre timmar vid destinationen för att EU:s kompensationsregler ska gälla. Är förseningen kortare än så har du tyvärr ingen rätt till ekonomisk ersättning, däremot kan du ha rätt till mat och dryck om väntan sker på flygplatsen."

---

## Intern länkning

Varje artikel länkar till och från i ett mönster:

Pillar länkar ut till alla sina spoke-artiklar och tar emot inkommande länkar från varje spoke samt från relevanta blogg-artiklar.

Spoke länkar alltid upp till sin pillar och kan länka sidledes till systerSpoke-artiklar om det är naturligt.

Blogg länkar alltid till minst en pillar. Aldrig bara till startsidan.

Flygbolagssida länkar till pillar (/forsening eller /installda-flyg) och tar emot inkommande från relevanta blogg-artiklar.

**Teknisk regel:** Ankartexten ska vara beskrivande och innehålla ett sökord. Aldrig "klicka här" eller "läs mer". Skriv "läs vår guide om extraordinära omständigheter" eller "se exakt hur mycket du kan kräva av SAS".

---

## Meta title och meta description

### Meta title (max 60 tecken inklusive mellanslag)

Formel: **[Primärsökord] | FlightClaim.se**

Exempel:
- "Försenat flyg: ersättning upp till 600€ | FlightClaim.se" (54 tecken)
- "Ryanair ersättning: kräv dina pengar tillbaka | FlightClaim.se" (63 tecken, för långt)

Varje tecken räknas. Skriv titeln, klistra in i en teckentäknare, justera.

### Meta description (max 160 tecken)

Ska sammanfatta vad sidan ger läsaren och innehålla en uppmaning. Inte kopiera från brödtexten. Skriv den som en reklamskylt.

Formel: **[Vad läsaren får] + [konkret detalj] + [CTA]**

Exempel:
- "EU-förordning 261/2004 ger dig rätt till 250 till 600€ vid försening. Vi förklarar exakt vad som gäller och hjälper dig ansöka gratis." (138 tecken)

---

## FAQ-sektionen

Varje artikel av typen guide och pillar ska ha en FAQ-sektion. Den fyller tre syften: ger svar på sökvarianter, genererar FAQPage-schema som kan visas som rich results i Google och förbättrar dwell time.

**Antal:** Minst 4 frågor, max 8 per artikel.

**Format:** Frågan ska vara formulerad exakt som en människa faktiskt söker den, inte som en rubrik i en lärobok.

**Fel:** "Vad innebär extraordinära omständigheter?"
**Rätt:** "Kan flygbolaget slippa betala om det var dåligt väder?"

**Regel:** Varje svar ska vara komplett i sig. Läsaren ska inte behöva läsa resten av artikeln för att förstå svaret. Max 3 till 4 meningar per svar.

---

## E-E-A-T: Bygg trovärdighet i texten

E-E-A-T står för Experience, Expertise, Authoritativeness, Trustworthiness. Google värderar det extra högt för juridiskt och finansiellt innehåll.

Konkret innebär det:

**Experience (Erfarenhet):** Referera till verkliga fall. "I ett avgörande från ARN 2023 fastslogs att..." är bättre än "enligt experter".

**Expertise (Kompetens):** Nämn lagen vid namn. Citera exakta paragrafer. Förklara nyanser som en okunnig skribent inte skulle känna till (t.ex. att "ankomst" definieras som när minst en dörr öppnas, inte när planet landar).

**Authoritativeness (Auktoritet):** Länka till primärkällor i texten: EUR-Lex (EU-förordningen), ARN, Konsumentverket. Det signalerar att vi inte hittar på.

**Trustworthiness (Trovärdighet):** Inga överdrifter. Skriv "du kan ha rätt till" istället för "du har alltid rätt till". Erkänn undantagen öppet. En sajt som berättar när du INTE kan kräva ersättning är mer trovärdig än en som lovar allt.

---

## Ord och fraser att använda (på svenska)

Dessa ord och fraser matchar hur svenska resenärer faktiskt söker:

**Primärord per kluster:**
- Försenat flyg, flyg försenat, försening flyg
- Inställt flyg, inställt flyg ersättning, flyget inställt
- Flyg ersättning, flygbolag ersättning, EU 261
- SAS ersättning, Ryanair ersättning, Norwegian ersättning

**Naturliga varianter att vava in:**
- "rätt till ersättning"
- "kräva pengar tillbaka"
- "EU-förordning 261/2004"
- "extraordinär omständighet"
- "Allmänna reklamationsnämnden" / "ARN"
- "250 euro" / "400 euro" / "600 euro"
- "tre timmars försening"
- "flygets ankomsttid"
- "nekad ombordstigning"
- "overbooking"
- "force majeure"

Vava in varianterna naturligt. Repetera aldrig exakt samma fras mer än två gånger i en artikel.

---

## Vad du ALDRIG ska göra

**Aldrig inleda meningar med samma ord flera gånger i rad.** Om tre meningar på rad börjar med "Det", skriv om.

**Aldrig använda passiv form i onödan.** "Ersättning kan krävas av dig" ska bli "du kan kräva ersättning".

**Aldrig stapla punktlistor.** Mer än tre punktlistor i en artikel utan brödtext emellan = artikeln läses inte av en människa, och Google vet det. Punktlistor är för faktasammanfattningar och steg-för-steg-instruktioner, inte för allt.

**Aldrig börja en artikel med "I den här artikeln..."** Börja med svaret eller en konkret situation.

**Aldrig skriva rubriker med versaler i varje ord.** "Hur Lång Försening Krävs" ser konstigt ut på svenska. Skriv "Hur lång försening krävs?"

**Aldrig avsluta med en sammanfattning som upprepar allt.** Avsluta med CTA eller med den viktigaste insikten.

---

## CTA-placering

Varje artikel ska ha exakt tre CTA-möjligheter:

1. **I ingressen (implicit):** "...vi hjälper dig ansöka gratis" med länk till formuläret.
2. **I mitten av artikeln:** En naturlig övergång efter det praktiska avsnittet. "Vet du redan att du har rätt? Ansök direkt så sköter vi resten."
3. **I slutet:** CTA-bannern som alltid renderas av artikel-mallen.

CTA-texten ska aldrig vara "Klicka här". Använd:
- "Ansök om ersättning gratis"
- "Kontrollera om du har rätt till ersättning"
- "Låt oss driva ditt ärende"

---

## Checklista innan publicering

Gå igenom dessa punkter för varje artikel innan du ändrar status till "published":

**Admin-inställningar**
- [ ] Titel (H1) innehåller primärsökordet
- [ ] Slug är satt korrekt (inga versaler, inga mellanslag)
- [ ] Parent slug är satt om det är en spoke eller blogg-artikel
- [ ] Meta title är max 60 tecken och slutar med " | FlightClaim.se"
- [ ] Meta description är max 160 tecken och innehåller en uppmaning
- [ ] Schema-typ är satt korrekt (FAQPage för pillar/guide, Article för blogg, none för enkel spoke)
- [ ] Status satt till "published" (inte "draft")

**Innehåll**
- [ ] Hero-bild finns längst upp i Markdown (/images/articles/[slug].jpg med beskrivande alt-text)
- [ ] Ingressen svarar direkt på frågan (inga "i denna artikel" eller uppvärmningar)
- [ ] CTA 1 finns i ingressen med länk till /anmalan
- [ ] CTA 2 finns mitt i artikeln som blockquote med länk till /anmalan
- [ ] Inga bindestreck används som tankestreck
- [ ] Meningslängden varierar (inga fyra likabent långa meningar i rad)
- [ ] Inga AI-klyschor ("sammanfattningsvis", "det är viktigt att notera", etc.)
- [ ] EU 261/2004 nämns med exakt beteckning
- [ ] Exakta belopp (250/400/600€) och tidsgränser (3 timmar) finns med
- [ ] FAQ-sektion med minst 4 frågor (för pillar och guide)

**Intern länkning**
- [ ] Intern länk upp till pillar-sidan finns i brödtexten (om det är en spoke eller blogg)
- [ ] Intern länk ut till samtliga spokes finns (om det är en pillar)
- [ ] Ankartexterna är beskrivande och innehåller sökord (aldrig "klicka här")

---

## Ordlista: svenska rättsliga termer

Dessa termer ska användas korrekt och konsekvent:

| Term | Förklaring |
|------|-----------|
| EU-förordning 261/2004 | Den förordning som reglerar flygpassagerares rättigheter vid försening, inställning och nekad ombordstigning |
| Extraordinär omständighet | Händelse utanför flygbolagets kontroll som befriar dem från ersättningsskyldighet |
| ARN | Allmänna reklamationsnämnden, den svenska myndighet som kostnadsfritt prövar tvister |
| Ankomsttid | Definieras juridiskt som när minst en dörr öppnas vid destinationen, inte landningstid |
| Nekad ombordstigning | Overbooking eller liknande situationer där du hindras trots giltig biljett |
| Ombokning | Flygbolagets skyldighet att erbjuda alternativ resa vid inställt flyg |
| Rätt till försörjning | Mat, dryck och hotell som flygbolaget är skyldiga att erbjuda vid längre väntan |

---

*Senast uppdaterad: april 2026. Gäller tills ny version publiceras.*
