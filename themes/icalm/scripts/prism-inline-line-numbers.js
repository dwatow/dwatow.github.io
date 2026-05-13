'use strict';

// Adds per-block line number opt-in for prismjs using '=' suffix syntax.
// Runs at priority 9, before Hexo's default backtick_code_block filter (priority 10),
// so Hexo's filter sees no remaining backtick blocks to process.
//
// Usage:
//   ```js        → no line numbers
//   ```js=       → line numbers from 1
//   ```js=5      → line numbers from 5

const rBacktick = /^((?:[^\S\r\n]*>){0,3}[^\S\r\n]*)(`{3,}|~{3,})[^\S\r\n]*((?:.*?[^`\s])?)[^\S\r\n]*\n((?:[\s\S]*?\n)?)(?:(?:[^\S\r\n]*>){0,3}[^\S\r\n]*)\2[^\S\r\n]?(\n+|$)/gm;
const rAllOptions = /([^\s]+)\s+(.+?)\s+(https?:\/\/\S+|\/\S+)\s*(.+)?/;
const rLangCaption = /([^\s]+)\s*(.+)?/;
const escapeSwigTag = str => str.replace(/{/g, '&#123;').replace(/}/g, '&#125;');

hexo.extend.filter.register('before_post_render', function(data) {
  const prismCfg = this.config.prismjs || {};
  if (!prismCfg.enable) return data;

  const dataContent = data.content;
  if (!dataContent.includes('```') && !dataContent.includes('~~~')) return data;

  const { prismHighlight } = require('hexo-util');

  data.content = dataContent.replace(rBacktick, ($0, start, $2, _args, _content, end) => {
    let content = _content.replace(/\n$/, '');

    const lineNumber = _args.includes('=');
    const firstLine = lineNumber ? parseInt(_args.split('=')[1], 10) || 1 : 0;
    const args = _args.split('=').shift().trim();

    let lang, caption;
    if (args) {
      const match = rAllOptions.exec(args) || rLangCaption.exec(args);
      if (match) {
        lang = match[1];
        if (match[2]) {
          caption = `<span>${match[2]}</span>`;
          if (match[3]) {
            caption += `<a href="${match[3]}">${match[4] ? match[4] : 'link'}</a>`;
          }
        }
      }
    }

    if (start.includes('>')) {
      const depth = start.split('>').length - 1;
      const regexp = new RegExp(`^([^\\S\\r\\n]*>){0,${depth}}([^\\S\\r\\n]|$)`, 'mg');
      content = content.replace(regexp, '');
    }

    const highlighted = prismHighlight(content, {
      lineNumber,
      firstLine,
      tab: prismCfg.tab_replace,
      isPreprocess: prismCfg.preprocess,
      lang,
      caption
    });

    return start
      + '<hexoPostRenderCodeBlock>'
      + escapeSwigTag(highlighted)
      + '</hexoPostRenderCodeBlock>'
      + end;
  });

  return data;
}, 9);
