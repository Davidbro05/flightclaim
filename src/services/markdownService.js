const { marked } = require('marked');

marked.setOptions({ gfm: true, breaks: false });

function render(markdown) {
  if (!markdown) return '';
  return marked.parse(markdown);
}

module.exports = { render };
