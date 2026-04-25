'use strict';

const NOW = new Date('2026-04-23T14:00:00.000Z').toISOString();

const CROSSLINKS = {
  'forsening/hur-mycket': `

## Läs vidare

- [Försenat flyg: hela guiden](/forsening) — komplett översikt av dina rättigheter
- [Hur länge har du på dig att kräva ersättning?](/forsening/tidsgrans) — preskriptionstider per land
- [Hur bevisar du rätten till ersättning?](/forsening/bevisning) — bevisbörda och extraordinära omständigheter
- [Anmärkningsvärda rättsfall: Sturgeon, Wallentin-Hermann m.fl.](/forsening/anmarkningsvarda) — domarna bakom din rätt
- [Inställt flyg: dina rättigheter](/installda-flyg)
`,

  'forsening/tidsgrans': `

## Läs vidare

- [Försenat flyg: hela guiden](/forsening) — komplett översikt av dina rättigheter
- [Hur mycket ersättning kan du få?](/forsening/hur-mycket) — belopp och beräkningsexempel
- [Hur bevisar du rätten till ersättning?](/forsening/bevisning) — bevisbörda och extraordinära omständigheter
- [Anmärkningsvärda rättsfall: Sturgeon, Wallentin-Hermann m.fl.](/forsening/anmarkningsvarda) — domarna bakom din rätt
- [Inställt flyg: dina rättigheter](/installda-flyg)
`,

  'forsening/bevisning': `

## Läs vidare

- [Försenat flyg: hela guiden](/forsening) — komplett översikt av dina rättigheter
- [Hur mycket ersättning kan du få?](/forsening/hur-mycket) — belopp och beräkningsexempel
- [Hur länge har du på dig att kräva ersättning?](/forsening/tidsgrans) — preskriptionstider per land
- [Anmärkningsvärda rättsfall: Sturgeon, Wallentin-Hermann m.fl.](/forsening/anmarkningsvarda) — domarna bakom din rätt
- [Inställt flyg: dina rättigheter](/installda-flyg)
`,
};

exports.up = async function (knex) {
  for (const [slug, appendText] of Object.entries(CROSSLINKS)) {
    const article = await knex('articles').where({ slug }).first('id', 'content');
    if (!article) continue;
    if (article.content && article.content.includes('forsening/anmarkningsvarda')) continue;
    await knex('articles').where({ id: article.id }).update({
      content: (article.content ?? '') + appendText,
      updated_at: NOW,
    });
  }
};

exports.down = async function (knex) {
  for (const [slug, appendText] of Object.entries(CROSSLINKS)) {
    const article = await knex('articles').where({ slug }).first('id', 'content');
    if (!article || !article.content) continue;
    await knex('articles').where({ id: article.id }).update({
      content: article.content.replace(appendText, ''),
      updated_at: NOW,
    });
  }
};
