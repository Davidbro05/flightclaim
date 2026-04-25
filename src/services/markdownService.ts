import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

export interface TocEntry {
  id: string;
  text: string;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export function extractToc(markdown: string | null | undefined): TocEntry[] {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const entries: TocEntry[] = [];
  const seen = new Map<string, number>();
  let inCode = false;

  for (const line of lines) {
    if (/^```/.test(line)) { inCode = !inCode; continue; }
    if (inCode) continue;
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const text = m[1].replace(/[*_`]/g, '').trim();
    let id = slugifyHeading(text);
    if (!id) continue;
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;
    entries.push({ id, text });
  }
  return entries;
}

export function render(markdown: string): string {
  if (!markdown) return '';
  const renderer = new marked.Renderer();
  const seen = new Map<string, number>();
  let isFirst = true;

  renderer.image = ({ href, title, text }) => {
    const loading = isFirst ? 'eager' : 'lazy';
    const fetchpriority = isFirst ? ' fetchpriority="high"' : '';
    isFirst = false;
    const titleAttr = title ? ` title="${title}"` : '';
    return `<img src="${href}" alt="${text}"${titleAttr} loading="${loading}" decoding="async"${fetchpriority} class="article-img">`;
  };

  renderer.heading = ({ tokens, depth }) => {
    const text = tokens.map((t) => ('text' in t ? t.text : '')).join('');
    if (depth === 2) {
      let id = slugifyHeading(text);
      if (id) {
        const count = seen.get(id) ?? 0;
        seen.set(id, count + 1);
        if (count > 0) id = `${id}-${count + 1}`;
        return `<h2 id="${id}">${text}</h2>\n`;
      }
    }
    return `<h${depth}>${text}</h${depth}>\n`;
  };
  return marked.parse(markdown, { renderer }) as string;
}

export function wordCount(markdown: string | null | undefined): number {
  if (!markdown) return 0;
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`[^`]*`/g, '')
    .replace(/[#>*_~|\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return 0;
  return text.split(' ').length;
}

export function readingTimeMinutes(markdown: string | null | undefined): number {
  const words = wordCount(markdown);
  return Math.max(1, Math.round(words / 220));
}

export function extractFirstImage(markdown: string | null | undefined): string | null {
  if (!markdown) return null;
  const match = /!\[[^\]]*\]\(([^)\s]+)/.exec(markdown);
  return match ? match[1] : null;
}
