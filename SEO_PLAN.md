# FlightClaim SEO & CMS — Byggplan

## Syfte

Locka organisk trafik via SEO-optimerade innehållssidor och konvertera besökare till ansökningar via formuläret på startsidan.

```
SEO-sida (lockar trafik)
    → Läser guide / flygbolagsinfo
        → Klickar CTA "Ansök om ersättning"
            → Formuläret på startsidan (konvertering)
```

---

## Struktur: Topic Clusters

### Kluster 1 — Försenat flyg

| Sida | Typ | Schema |
|------|-----|--------|
| `/forsening` | guide (pillar) | FAQPage |
| `/forsening/hur-mycket` | guide | — |
| `/forsening/tidsgrans` | guide | — |
| `/forsening/anmarkningsvarda` | guide | — |
| `/forsening/bevisning` | guide | — |
| `/blogg/forsenat-flyg-case-study` | blog | Article |
| `/blogg/vanligaste-misstagen` | blog | Article |
| `/blogg/ryanair-nekar-ersattning` | blog | Article |

### Kluster 2 — Inställt flyg

| Sida | Typ | Schema |
|------|-----|--------|
| `/installda-flyg` | guide (pillar) | FAQPage |
| `/installda-flyg/ombokat` | guide | — |
| `/installda-flyg/sent-besked` | guide | — |
| `/installda-flyg/mat-hotell` | guide | — |
| `/installda-flyg/force-majeure` | guide | — |
| `/blogg/wizz-air-installde-mitt-flyg` | blog | Article |
| `/blogg/instaellt-dagen-fore` | blog | Article |
| `/blogg/aterbetalning-vs-kompensation` | blog | Article |

### Kluster 3 — Flygbolag

| Sida | Typ | Schema |
|------|-----|--------|
| `/flygbolag` | guide (pillar) | FAQPage |
| `/flygbolag/sas` | airline | — |
| `/flygbolag/ryanair` | airline | — |
| `/flygbolag/norwegian` | airline | — |
| `/flygbolag/wizz-air` | airline | — |
| `/blogg/snabbaste-utbetalning` | blog | Article |
| `/blogg/ryanair-extraordinara` | blog | Article |
| `/blogg/sas-konkurs-rattigheter` | blog | Article |

---

## Header-navigation (dropdown)

```
[Logo]  [Försenat flyg ▾]  [Inställt flyg ▾]  [Flygbolag ▾]  [Blogg]  [Ansök nu →]
```

Nav-items lagras i databasen och redigeras via admin-panelen.

---

## Databas

### Tabell: articles

| Kolumn | Typ | Beskrivning |
|--------|-----|-------------|
| id | integer PK | |
| type | ENUM guide/airline/blog | Klustertyp |
| status | ENUM draft/published | |
| slug | string unik | URL-del, t.ex. forsening/hur-mycket |
| parent_slug | string nullable | För breadcrumbs, t.ex. forsening |
| title | string | H1 på sidan |
| meta_title | string max 60 | SEO-titel |
| meta_desc | string max 160 | Meta description |
| content | text | Markdown |
| schema_type | ENUM FAQPage/Article/none | |
| faq_json | json nullable | Array av {q, a} för FAQPage-schema |
| affiliate_ref | string nullable | Koppla affiliate-kod till artikel |
| created_at | timestamp | |
| updated_at | timestamp | |

### Tabell: nav_items

| Kolumn | Typ | Beskrivning |
|--------|-----|-------------|
| id | integer PK | |
| label | string | Text i menyn |
| url | string | Länk (intern slug eller extern URL) |
| parent_id | integer nullable | NULL = toppnivå, annars dropdown-barn |
| sort_order | integer | Ordning i menyn |

---

## API-routes

### Admin (kräver autentisering)

```
GET    /api/articles              Lista alla artiklar
GET    /api/articles/:slug        Hämta en artikel
POST   /api/articles              Skapa artikel
PUT    /api/articles/:slug        Uppdatera artikel
DELETE /api/articles/:slug        Ta bort artikel

GET    /api/nav                   Hämta hela nav-strukturen
POST   /api/nav                   Skapa nav-item
PUT    /api/nav/:id               Uppdatera nav-item
DELETE /api/nav/:id               Ta bort nav-item
```

### Publik

```
GET    /api/nav                   Hämta meny (publik)
GET    /:slug                     SSR-renderad innehållssida
GET    /blogg/:slug               SSR-renderad bloggsida
GET    /flygbolag/:slug           SSR-renderad flygbolagssida
GET    /sitemap.xml               Dynamisk sitemap
GET    /robots.txt                Robots-fil
```

---

## SEO-standards (automatiserat per sida)

Varje publicerad artikel får automatiskt:

- `<title>` = meta_title eller `title + " | FlightClaim.se"`
- `<meta name="description">` = meta_desc
- `<link rel="canonical">`
- `<meta property="og:*">` för social delning
- Breadcrumb JSON-LD: `Hem > Försenat flyg > Hur mycket`
- FAQPage eller Article schema beroende på schema_type
- Intern CTA-block: *"Drabbad? Ansök om ersättning på 2 minuter →"*

---

## Byggfaser

---

### Fas 1 — Databas
**Mål:** Skapa tabeller för articles och nav_items

- [ ] Migration: skapa `articles`-tabell
- [ ] Migration: skapa `nav_items`-tabell
- [ ] Seed: grundläggande nav-struktur (3 dropdowns + Blogg + Ansök nu)

---

### Fas 2 — Backend API
**Mål:** CRUD-endpoints för articles och nav

- [ ] `src/routes/articlesApi.js` — CRUD för artiklar (autentiserad)
- [ ] `src/routes/navApi.js` — CRUD för nav (autentiserad, GET publik)
- [ ] Montera routes i `src/app.js`
- [ ] Tester för nya endpoints

---

### Fas 3 — Admin CMS (React)
**Mål:** Skapa och redigera artiklar + nav direkt i admin-panelen

- [ ] Artikellista med filter (type, status)
- [ ] Artikeleditor:
  - Titel, slug (auto-genererad från titel), type, status
  - Meta title + meta desc med teckentälknare
  - Markdown-editor med live-förhandsgranskning
  - FAQ-builder (lägg till Q&A-par → sparas som JSON)
  - Schema type-väljare
  - Affiliate ref-koppling
- [ ] Nav-manager:
  - Lista menyval
  - Lägg till / redigera / ta bort
  - Sätt parent (dropdown-barn)
  - Sorteringsordning

---

### Fas 4 — Publik SSR-rendering
**Mål:** Innehållssidor renderas som HTML på servern för optimal SEO

- [ ] `src/services/markdownService.js` — Markdown → säker HTML (marked + sanitize-html)
- [ ] `src/routes/content.js` — SSR-routes för alla slugs
- [ ] HTML-template med:
  - `<head>` med alla SEO-taggar
  - Breadcrumb JSON-LD
  - FAQPage / Article schema
  - Intern länkstruktur
  - CTA-block mot formuläret
- [ ] 404-hantering för ej publicerade/obefintliga slugs

---

### Fas 5 — Header med dropdown-nav
**Mål:** Dynamisk navigation på publika sajten hämtad från databasen

- [ ] Hämta nav från `/api/nav` vid sidladdning
- [ ] Dropdown-meny desktop
- [ ] Hamburger-meny mobil
- [ ] Aktiv-markering på nuvarande sida
- [ ] "Ansök nu"-knapp i headern

---

### Fas 6 — Sitemap & robots
**Mål:** Sökmotorer kan indexera allt korrekt

- [ ] `GET /sitemap.xml` — dynamisk, inkluderar alla published articles + statiska sidor
- [ ] `GET /robots.txt` — tillåter allt utom /admin och /api/admin
- [ ] Submit sitemap till Google Search Console

---

### Fas 7 — Content
**Mål:** Publicera de 9 guides + 9 blogginlägg enligt klusterplanen

**Prioritetsordning:**
1. `/forsening` pillar (mest sökvolym)
2. `/flygbolag/ryanair` + `/flygbolag/sas` (högst köpintention)
3. Blogg: case study + Ryanair-artikeln
4. `/installda-flyg` pillar
5. Resterande spokes och blogg

---

## Tidplan

| Vecka | Fas | Leverans |
|-------|-----|----------|
| 1 | Fas 1–2 | DB-tabeller + API klart |
| 2 | Fas 3 | Admin CMS klart |
| 3 | Fas 4–5 | Publika sidor + header klart |
| 4 | Fas 6 | Sitemap + robots klart |
| 5+ | Fas 7 | Content skrivs och publiceras |

---

## Konkurrensanalys

| Aktör | Styrka | Svaghet |
|-------|--------|---------|
| AirHelp.com | Hög domänauktoritet | Tunn svensk content |
| Flightright.se | Bra DA, etablerade | Generisk blogg |
| EUclaim.se | Stark länkprofil | Föråldrat content |
| Reclaimed.se | Lokal närvaro | Liten sajt |

**Vår möjlighet:** Ingen äger djupt, välstrukturerat svenskt content kring specifika flygbolag + rättigheter. Vi bygger det underifrån med rätt klusterstruktur.
