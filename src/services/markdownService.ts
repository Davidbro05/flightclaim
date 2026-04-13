import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

export function render(markdown: string): string {
  if (!markdown) return '';
  return marked.parse(markdown) as string;
}
