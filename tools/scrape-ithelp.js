#!/usr/bin/env node
/**
 * 爬取 iThome 鐵人賽文章並轉為 Markdown
 *
 * 用法（單篇）:
 *   node scripts/scrape-ithelp.js <article-url> [output-dir]
 *
 * 用法（從列表頁批次抓取）:
 *   node scripts/scrape-ithelp.js --list <list-page-url> [output-dir]
 *
 * 用法（更新目錄下所有文章的 tags）:
 *   node scripts/scrape-ithelp.js --update <dir>
 *
 * 範例:
 *   node scripts/scrape-ithelp.js https://ithelp.ithome.com.tw/articles/10201807
 *   node scripts/scrape-ithelp.js --list "https://ithelp.ithome.com.tw/users/20107637/ironman/1927?page=2"
 *   node scripts/scrape-ithelp.js --update source/_posts/ironman-2019
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const { load } = require('cheerio');
const TurndownService = require('turndown');

const DEFAULT_OUTPUT_DIR = path.join(__dirname, '../source/_posts/2019ironman');
const DELAY_MS = 1000; // 每篇之間的間隔，避免請求過於頻繁

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-TW,zh;q=0.9',
      },
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchPage(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[\s　]+/g, '-')
    .replace(/[^\w一-鿿-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseArticleList(html) {
  const $ = load(html);
  const urls = [];
  $('.qa-list__title-link').each((_, el) => {
    const href = $(el).attr('href').trim();
    if (href) urls.push(href);
  });
  return urls;
}

function parseArticle(html, url) {
  const $ = load(html);

  const title = $('.qa-header__title').text().trim();

  const dateRaw = $('.qa-header__info-time').first().attr('title') ||
                  $('.qa-header__info-time').first().text().trim();
  const dateMatch = dateRaw.match(/(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().slice(0, 10);

  const author = $('.ir-article-info__name').first().text().trim();

  const contentEl = $('.qa-markdown .markdown__style').first();
  const contentHtml = contentEl.html() || '';

  const tags = [];
  $('.qa-header__tagGroup a').each((_, el) => {
    tags.push($(el).text().trim());
  });

  return { title, date, author, contentHtml, tags, url };
}

// 將 <table> 轉為 markdown，並以 placeholder 替換，避免被 turndown 再次處理
function extractTables(contentHtml) {
  const $ = load(contentHtml);
  const tableMap = {};
  let idx = 0;

  $('table').each((_, table) => {
    const rows = [];
    $(table).find('tr').each((_, tr) => {
      const cells = [];
      $(tr).find('th, td').each((_, cell) => {
        cells.push($(cell).text().replace(/\n/g, ' ').trim());
      });
      rows.push(cells);
    });
    if (rows.length === 0) return;

    const colCount = Math.max(...rows.map(r => r.length));
    const pad = (c) => c.map(v => v || '').concat(Array(colCount).fill('')).slice(0, colCount);

    const mdRows = rows.map(r => `| ${pad(r).join(' | ')} |`);
    const firstRowHasTh = $(table).find('tr').first().find('th').length > 0;
    const separator = `| ${Array(colCount).fill('---').join(' | ')} |`;
    if (firstRowHasTh) {
      mdRows.splice(1, 0, separator);
    } else {
      mdRows.unshift(`| ${Array(colCount).fill('').join(' | ')} |`);
      mdRows.splice(1, 0, separator);
    }

    const key = `TABLEHOLDER${idx++}END`;
    tableMap[key] = mdRows.join('\n');
    $(table).replaceWith(`<p>${key}</p>`);
  });

  return { html: $('body').html() || $.html(), tableMap };
}

function toMarkdown(article, { categories = ['iThome 鐵人賽'] } = {}) {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });

  td.addRule('fencedCodeBlock', {
    filter: (node) => node.nodeName === 'PRE' && node.firstChild && node.firstChild.nodeName === 'CODE',
    replacement: (content, node) => {
      const lang = (node.firstChild.getAttribute('class') || '').replace(/^language-/, '');
      const code = node.firstChild.textContent;
      return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
    },
  });

  const { html: processedHtml, tableMap } = extractTables(article.contentHtml);
  let body = td.turndown(processedHtml);
  for (const [key, mdTable] of Object.entries(tableMap)) {
    body = body.replace(key, `\n${mdTable}\n`);
  }
  const tagsYaml = article.tags.length
    ? `tags:\n${article.tags.map(t => `  - ${t}`).join('\n')}`
    : 'tags:';
  const catsYaml = categories.length
    ? `categories:\n${categories.map(c => `  - ${c}`).join('\n')}`
    : 'categories:';

  const titleYaml = /[:#{}\[\],&*?|<>=!%@`]/.test(article.title)
    ? `"${article.title.replace(/"/g, '\\"')}"`
    : article.title;

  return `---
title: ${titleYaml}
date: ${article.date} 00:00:00
${tagsYaml}
${catsYaml}
source_url: ${article.url}
---

${body}
`;
}

async function scrapeOne(url, outputDir) {
  const html = await fetchPage(url);
  const article = parseArticle(html, url);

  if (!article.title) {
    console.error(`  ✗ 無法解析標題: ${url}`);
    return false;
  }

  const markdown = toMarkdown(article);
  const filename = `${article.date}-${slugify(article.title)}.md`;
  const outputPath = path.join(outputDir, filename);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, markdown, 'utf8');

  console.log(`  ✓ ${article.date} ${article.title}`);
  console.log(`    → ${outputPath}`);
  return true;
}

// 從 markdown 檔案解析 front matter 中的 source_url、tags、categories
function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = match[1];

  const sourceUrl = (fm.match(/^source_url:\s*(.+)$/m) || [])[1]?.trim();

  const tagsMatch = fm.match(/^tags:\n((?:  - .+\n?)*)/m);
  const existingTags = tagsMatch
    ? tagsMatch[1].match(/  - (.+)/g)?.map(s => s.replace('  - ', '').trim()) ?? []
    : [];

  const catsMatch = fm.match(/^categories:\n((?:  - .+\n?)*)/m);
  const existingCats = catsMatch
    ? catsMatch[1].match(/  - (.+)/g)?.map(s => s.replace('  - ', '').trim()) ?? []
    : [];

  return { sourceUrl, existingTags, existingCats };
}

function mergeTags(existing, incoming) {
  return [...new Set([...existing, ...incoming].map(t => t.trim()).filter(Boolean))];
}

async function updateDir(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  if (files.length === 0) {
    console.error('目錄下沒有 .md 檔案');
    process.exit(1);
  }

  console.log(`找到 ${files.length} 篇文章，開始更新...\n`);
  let success = 0;

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dir, files[i]);
    const existing = fs.readFileSync(filePath, 'utf8');
    const parsed = parseFrontMatter(existing);

    if (!parsed?.sourceUrl) {
      console.log(`[${i + 1}/${files.length}] ✗ 無 source_url: ${files[i]}`);
      continue;
    }

    console.log(`[${i + 1}/${files.length}] ${parsed.sourceUrl}`);
    try {
      const html = await fetchPage(parsed.sourceUrl);
      const article = parseArticle(html, parsed.sourceUrl);

      if (!article.title) {
        console.log(`  ✗ 無法解析標題`);
        continue;
      }

      article.tags = mergeTags(parsed.existingTags, article.tags);
      const markdown = toMarkdown(article, { categories: parsed.existingCats });
      fs.writeFileSync(filePath, markdown, 'utf8');

      console.log(`  ✓ ${article.title}`);
      console.log(`    tags: [${article.tags.join(', ')}]`);
      success++;
    } catch (err) {
      console.log(`  ✗ 錯誤: ${err.message}`);
    }

    if (i < files.length - 1) await delay(DELAY_MS);
  }

  console.log(`\n完成：${success}/${files.length} 篇`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === '--update') {
    const dir = args[1];
    if (!dir) {
      console.error('用法: node scripts/scrape-ithelp.js --update <dir>');
      process.exit(1);
    }
    await updateDir(path.resolve(dir));
  } else if (args[0] === '--list') {
    const listUrl = args[1];
    const outputDir = args[2] || DEFAULT_OUTPUT_DIR;

    if (!listUrl) {
      console.error('用法: node scripts/scrape-ithelp.js --list <list-page-url> [output-dir]');
      process.exit(1);
    }

    console.log(`抓取列表頁: ${listUrl}`);
    const listHtml = await fetchPage(listUrl);
    const urls = parseArticleList(listHtml);

    if (urls.length === 0) {
      console.error('未找到任何文章連結');
      process.exit(1);
    }

    console.log(`找到 ${urls.length} 篇文章，開始抓取...\n`);
    let success = 0;
    for (let i = 0; i < urls.length; i++) {
      console.log(`[${i + 1}/${urls.length}] ${urls[i]}`);
      const ok = await scrapeOne(urls[i], outputDir);
      if (ok) success++;
      if (i < urls.length - 1) await delay(DELAY_MS);
    }

    console.log(`\n完成：${success}/${urls.length} 篇`);
  } else {
    const url = args[0];
    const outputDir = args[1] || DEFAULT_OUTPUT_DIR;

    if (!url) {
      console.error('用法: node scripts/scrape-ithelp.js <article-url> [output-dir]');
      console.error('      node scripts/scrape-ithelp.js --list <list-page-url> [output-dir]');
      process.exit(1);
    }

    console.log(`抓取: ${url}`);
    const ok = await scrapeOne(url, outputDir);
    if (!ok) process.exit(1);
  }
}

main().catch(err => {
  console.error('錯誤:', err.message);
  process.exit(1);
});
