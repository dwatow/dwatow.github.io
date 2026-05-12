# Tools

部落格維護工具，放在此目錄以避免被 Hexo 自動載入執行。

---

## scrape-ithelp.js

從 iThome 鐵人賽爬取文章並轉成 Markdown。

### 安裝相依套件

```bash
npm install
```

### 用法

#### 單篇文章

```bash
node tools/scrape-ithelp.js <article-url> [output-dir]
```

```bash
node tools/scrape-ithelp.js https://ithelp.ithome.com.tw/articles/10201807
node tools/scrape-ithelp.js https://ithelp.ithome.com.tw/articles/10201807 source/_posts/ironman-2019
```

預設輸出至 `source/_posts/2019ironman/`。

#### 從列表頁批次抓取

```bash
node tools/scrape-ithelp.js --list <list-page-url> [output-dir]
```

```bash
node tools/scrape-ithelp.js --list "https://ithelp.ithome.com.tw/users/20107637/ironman/1927?page=2"
node tools/scrape-ithelp.js --list "https://ithelp.ithome.com.tw/users/20107637/ironman/1927?page=2" source/_posts/ironman-2019
```

抓取列表頁上所有文章連結（`.qa-list__title-link`），每篇間隔 1 秒。

#### 更新整個目錄

```bash
node tools/scrape-ithelp.js --update <dir>
```

```bash
node tools/scrape-ithelp.js --update source/_posts/ironman-2019
```

- 重新抓取文章內容並覆蓋
- Tags：現有 + 新抓取，自動去除重複
- Categories：保留檔案原有值，不覆蓋

### 輸出格式

- 檔名：`YYYY-MM-DD-{slug}.md`
- Front matter 包含 `title`、`date`、`tags`、`categories`、`source_url`
- 標題含 YAML 特殊字元（如 `:`）時自動加引號
- HTML 表格轉為 Markdown table 格式

---

## localize-images.js

掃描 Markdown 文章中的外部圖片連結，下載至本地並更新路徑。

### 用法

```bash
node tools/localize-images.js [posts-dir]
```

```bash
# 處理單一目錄
node tools/localize-images.js source/_posts/ironman-2020

# 處理全部文章
node tools/localize-images.js
```

預設掃描 `source/_posts/` 下所有 `.md`（含子目錄）。

### 命名規則

```
{hash(文章檔名, 8碼)}-{原始圖片檔名}
```

例：`934db1d3-gdUB7PB.png`

圖片存放於 `source/images/`，markdown 中的路徑替換為 `/images/{filename}`。

### 需要認證的圖片來源

部分圖床（如 HackMD）需要登入才能下載圖片。在 `tools/.env` 設定認證資訊（此檔案不會被 commit）：

```bash
# tools/.env
HACKMD_COOKIE=your_connect_sid_value
```

取得 HackMD Cookie 的方式：
1. 瀏覽器登入 HackMD
2. DevTools → Application → Cookies → `hackmd.io`
3. 複製 `connect.sid` 欄位的值貼入 `.env`

`.env` 已加入 `.gitignore`，不會被 commit。

### 特性

- **冪等**：已下載的圖片不重複下載
- **imsize 相容**：保留 `![](url =400x)` 的尺寸後綴
- **認證支援**：讀取 `.env` 對特定圖床帶上認證 header
- **失效圖片紀錄**：無法下載的連結（DNS 錯誤、HTTP 錯誤）輸出至 `tools/broken-images.json`

### broken-images.json 格式

```json
[
  {
    "article": "source/_posts/ironman-2020/2020-10-07-如何紮紮實實的學習.md",
    "url": "http://example.com/image.jpg",
    "reason": "getaddrinfo ENOTFOUND example.com"
  }
]
```
