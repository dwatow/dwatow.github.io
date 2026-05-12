#!/usr/bin/env node
/**
 * 將 markdown 文章中的外部圖片下載到本地，並更新圖片路徑
 *
 * 命名規則: {hash(文章檔名, 8碼)}-{原始圖片檔名}
 * 輸出目錄: source/images/
 *
 * 用法:
 *   node tools/localize-images.js [posts-dir]
 *   node tools/localize-images.js source/_posts/ironman-12th
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const REPO_ROOT = path.join(__dirname, '..');
const DEFAULT_POSTS_DIR = path.join(REPO_ROOT, 'source/_posts');
const IMAGES_DIR = path.join(REPO_ROOT, 'source/images');
const IMAGES_URL_PREFIX = '/images';

const DEFAULT_UA = 'Mozilla/5.0';
const DOMAIN_UA = {
  'wikimedia.org': 'localize-images/1.0 (blog image archiver; https://dwatow.github.io)',
  'wikipedia.org': 'localize-images/1.0 (blog image archiver; https://dwatow.github.io)',
};

const AUTH_HEADERS = {
  'hackmd.io': process.env.HACKMD_COOKIE
    ? { Cookie: `connect.sid=${process.env.HACKMD_COOKIE}` }
    : null,
};

// 匹配 markdown 圖片語法，相容 markdown-it-imsize 的 "=WxH" 後綴
const IMG_PATTERN = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+?)(\s+=\d*x\d*)?\)/g;

function articleHash(filename) {
  return crypto.createHash('sha256').update(filename).digest('hex').slice(0, 8);
}

function imageFilenameFromUrl(url) {
  try {
    const { pathname } = new URL(url);
    const base = path.basename(pathname) || 'image';
    // 去除非法字元，保留副檔名
    return base.replace(/[^a-zA-Z0-9._-]/g, '_');
  } catch {
    return 'image';
  }
}

function extFromContentType(contentType = '') {
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
  };
  const type = contentType.split(';')[0].trim();
  return map[type] ?? '';
}

function headersForUrl(url) {
  try {
    const { hostname } = new URL(url);
    const ua = Object.entries(DOMAIN_UA).find(([d]) => hostname.endsWith(d))?.[1] ?? DEFAULT_UA;
    const auth = Object.entries(AUTH_HEADERS).find(([d, h]) => hostname.endsWith(d) && h)?.[1] ?? {};
    return { 'User-Agent': ua, ...auth };
  } catch {
    return { 'User-Agent': DEFAULT_UA };
  }
}

function downloadImage(url, retries = 3) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const options = { headers: headersForUrl(url) };

    client.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        res.resume();
        return downloadImage(res.headers.location, retries).then(resolve).catch(reject);
      }
      if (res.statusCode === 429 && retries > 0) {
        res.resume();
        const wait = parseInt(res.headers['retry-after'] ?? '5', 10) * 1000;
        return setTimeout(() => downloadImage(url, retries - 1).then(resolve).catch(reject), wait);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const contentType = res.headers['content-type'] ?? '';
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType }));
    }).on('error', reject);
  });
}

async function localizeFile(mdPath) {
  const content = fs.readFileSync(mdPath, 'utf8');
  const articleFilename = path.basename(mdPath);
  const hash = articleHash(articleFilename);

  const replacements = new Map(); // url -> local path
  const errors = [];

  // 先收集所有不重複的外部圖片 URL
  const urls = new Set();
  for (const [, , url] of content.matchAll(IMG_PATTERN)) {
    urls.add(url);
  }

  if (urls.size === 0) return { skipped: true };

  for (const url of urls) {
    let localFilename = `${hash}-${imageFilenameFromUrl(url)}`;
    const localPath = path.join(IMAGES_DIR, localFilename);

    if (!fs.existsSync(localPath)) {
      try {
        const { buffer, contentType } = await downloadImage(url);

        // 若無副檔名，從 Content-Type 補上
        if (!path.extname(localFilename)) {
          const ext = extFromContentType(contentType);
          if (ext) localFilename += ext;
        }

        fs.writeFileSync(path.join(IMAGES_DIR, localFilename), buffer);
      } catch (err) {
        errors.push({ url, reason: err.message });
        continue;
      }
    }

    replacements.set(url, `${IMAGES_URL_PREFIX}/${localFilename}`);
  }

  if (replacements.size === 0) return { errors };

  // 替換文章中的圖片 URL（保留 alt text 和 imsize 後綴）
  const updated = content.replace(IMG_PATTERN, (match, alt, url, size) => {
    const local = replacements.get(url);
    return local ? `![${alt}](${local}${size ?? ''})` : match;
  });

  fs.writeFileSync(mdPath, updated, 'utf8');
  return { replaced: replacements.size, errors };
}

function collectMarkdownFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  const postsDir = path.resolve(process.argv[2] ?? DEFAULT_POSTS_DIR);
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const files = collectMarkdownFiles(postsDir);
  console.log(`掃描 ${files.length} 篇文章，圖片輸出至 source/images/\n`);

  let totalReplaced = 0;
  let filesChanged = 0;
  const failedImages = []; // { article, url, reason }

  for (const [i, mdPath] of files.entries()) {
    const rel = path.relative(REPO_ROOT, mdPath);
    const result = await localizeFile(mdPath);

    if (result.skipped) continue;

    const { replaced = 0, errors = [] } = result;
    if (replaced > 0) {
      filesChanged++;
      totalReplaced += replaced;
      console.log(`[${i + 1}/${files.length}] ✓ ${rel}  (${replaced} 張)`);
    }
    for (const { url, reason } of errors) {
      failedImages.push({ article: rel, url, reason });
      console.log(`  ✗ ${url}\n    ${reason}`);
    }
  }

  if (failedImages.length > 0) {
    const errorLogPath = path.join(REPO_ROOT, 'tools/broken-images.json');
    fs.writeFileSync(errorLogPath, JSON.stringify(failedImages, null, 2), 'utf8');
    console.log(`\n失效圖片紀錄已存至 tools/broken-images.json（${failedImages.length} 筆）`);
  }

  console.log(`\n完成：${filesChanged} 篇更新，${totalReplaced} 張圖片本地化，${failedImages.length} 個錯誤`);
}

main().catch(err => {
  console.error('錯誤:', err.message);
  process.exit(1);
});
