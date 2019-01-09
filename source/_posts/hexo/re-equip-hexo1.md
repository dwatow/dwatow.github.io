---
title: Hexo研究筆記 1
date: 2017-06-18 22:40:21
tags: 'hexo'
categories: 'hexo改裝'
---

# Hexo 研究筆記 1

大約七天前，開始重新研究 `hexo`。
之前安裝好就沒有研究它，因為目前還在學習前端的技術，所以暫時沒有花太多心力進行研究。

之後還有一些進步的空間，希望可以出續集

## 有動力的契機

工作室，聊起了「行銷自己」這件事。也開始對於「品牌管理」、「作品集」...等設計相關的個人行銷手法有一些著墨。

而寫部落格是其中一種。

身為一個前端工程師(雖然現在還只是前端小學徒)，使用 github 來架設自己的部落格，也是正常的吧？

就想說，再來進一步的研究 hexo 吧。

## 研究方向

話說，先前的文章有提到，我是 hackmd 的愛用者，hexo是沒有「所見即所得」的編輯介面，而 hackmd 如果能成為我的編輯介面那就再好不過了。

所以，就將 hexo 呈現的內容結果(不管我套哪個主題)，先看起來和 hackmd 有幾分像吧！

## 渲染器

先對渲染器著手吧！

一開始以為只要搞定渲染器，`html` 就可以和 hackmd 一模一樣了。沒想到這是一個天大的誤會。
`markdown` 渲染器搞定，頂多是「確定 `input` 端沒問題」。可以吃的語法都可以吃，但是不保證結果一樣。
在此，換成和 hackmd 一樣的渲染器: `markdown-it` ，除了核心渲染器之外，還有它的外掛也要一起安裝。

### 更換渲染器

刪除原本的渲染器

```shell
$ npm uninstall hexo-renderer-marked
```

在hexo的專案中，安裝套件 `hexo-renderer-markdown-it`

```shell
$ npm install git+https://github.com/hexojs/hexo-renderer-markdown-it.git --save
```

`hexo-renderer-markdown-it` 是用來初始化 `markdown-it` 並且給外掛參數的地方。有興趣可以看看它的[程式碼](https://github.com/hexojs/hexo-renderer-markdown-it/blob/master/lib/renderer.js)。

### 安裝渲染器外掛

參考 hackmd 的 [`markdown-it` 初始化程式碼](https://github.com/hackmdio/hackmd/blob/master/public/js/extra.js)可以看得出它安裝了什麼外掛。

在此直接給安裝指令

```shell
$ npm install markdown-it-abbr --save
$ npm install markdown-it-container --save
$ npm install markdown-it-deflist --save
$ npm install markdown-it-emoji --save
$ npm install markdown-it-footnote --save
$ npm install markdown-it-imsize --save
$ npm install markdown-it-ins --save
$ npm install markdown-it-mark --save
$ npm install markdown-it-regexp --save
$ npm install markdown-it-sub --save
$ npm install markdown-it-sup --save
```

但是要注意，初始化外掛程式碼，加入 `markdown-it` 時，有些有第三個參數，而這些參數都用在修改html的語法，在此並不適用。

另外，還有幾個在 hackmd 上沒裝，但是 hexo 要裝的，也要裝上

```shell
$ npm install markdown-it-checkbox --save
```

### 修改hexo設定檔

在 hexo的 `_config.yml` 檔最下面加上這一段

```yaml
# Markdown-it config
## Docs: https://github.com/celsomiranda/hexo-renderer-markdown-it/wiki
markdown:
  render:
    html: true # Doesn't escape HTML content so the tags will appear as html.
    # xhtmlOut: false # Parser will not produce XHTML compliant code.
    breaks: true # Parser produces `<br>` tags every time there is a line break in the source document.
    langPrefix: ''
    linkify: true # Returns text links as text.
    typographer: true # Substitution of common typographical elements will take place.
    quotes: '“”‘’' # "double" will be turned into “single”
                   # 'single' will be turned into ‘single’
  plugins:
    - markdown-it-abbr
    - name: markdown-it-container
      options: success
    - name: markdown-it-container
      options: info
    - name: markdown-it-container
      options: warning
    - name: markdown-it-container
      options: danger
    - markdown-it-deflist
    - name: markdown-it-emoji
      options:
        shortcuts: {}
    - markdown-it-footnote
    - markdown-it-imsize
    - markdown-it-ins
    - markdown-it-mark
    - markdown-it-regexp
    - markdown-it-sub
    - markdown-it-sup
    - markdown-it-checkbox
anchors:
  level: 1 # Minimum level for ID creation. (Ex. h2 to h6)
  collisionSuffix: 'v' # A suffix that is prepended to the number given if the ID is repeated.
  permalink: true # If true, creates an anchor tag with a permalink besides the heading.
  permalinkClass: header-anchor # Class used for the permalink anchor tag.
  permalinkSymbol: '' # The symbol used to make the permalink.
```

### 確認 hexo-renderer-markdown-it

在此要確定  [`hexo-renderer-markdown-it/blob/master/lib/renderer.js`](https://github.com/hexojs/hexo-renderer-markdown-it/blob/master/lib/renderer.js) 的內容是否允許外掛程式進行第二個參數的設定

```javascript=11
if (opt.plugins) {
  parser = opt.plugins.reduce(function (parser, pugs) {
    if (pugs instanceof Object && pugs.name) {
      return parser.use(require(pugs.name), pugs.options);
    } else {
      return parser.use(require(pugs));
    }
  }, parser);
}
```

因為在研究時， npm 下載下來的版本並不是這麼寫，但是 github 已經更新成這樣了。

## 程式碼區塊的行號 (已經 merge 進 hexo)

在 hackmd 中，程式碼區塊的行號指定方式和hexo並不同。
hexo 是透過 config 檔案去設定整個部落格是否都一致要有行號，而且每一個程式碼區塊的第一個行號都是 1 開始計數。

但是 hackmd ，在程式碼區塊的三個點點後，是這麼設定的
- `js  ` -> js code block without line number
- `js= ` -> js code block with line number, start in 1
- `js=3` -> js code block with line number, start in 3

相當漂亮。

所以，在此修改`lib/plugins/filter/before_post_render/backtick_code_block.js`，並提交了[一份pull request](https://github.com/hexojs/hexo/pull/2612/files)

目前已經成為內建功能，安裝完成就有囉。

## 認識 hacmkd 在渲染器上的處理

- 第一層: 直接自訂 markdown-it
  最開始先是 markdown 轉 html
  有增訂語法，有些會加上額外的 `class="raw"`
- 第二層: 是靜態轉換，會把一些不需要互動的部分轉換出來
  有用 jQuery
- 第三層: 是動態轉換，把需要互動的元素綁定事件
  有用 jQuery

在 hackmd 的原始碼中，有看見 `ui.area.markdown`，其中[ui物件是這樣](https://github.com/hackmdio/hackmd/blob/master/public/js/lib/editor/ui-elements.js)建出來的，也許就是給第二層或第三層用，使用 jQuery 的地方。

### 找到 markdown-it 的程式進入點

原本想找在 hackmd 中，有沒有呼叫 markdown-it 的渲染器的地方呢？

就開始找了，終於找到幾個可能的地方，[其中一個地方](https://github.com/hackmdio/hackmd/blob/master/public/js/index.js)如下

```javascript=2800
function updateViewInner () {
  if (appState.currentMode === modeType.edit || !isDirty) return
  var value = editor.getValue()
  var lastMeta = md.meta
  md.meta = {}
  delete md.metaError
  var rendered = md.render(value)
```

這一行的 `.render()` method

```javascript
  var rendered = md.render(value)
```
和 [hexo-renderer-markdown-it](https://github.com/hexojs/hexo-renderer-markdown-it/blob/master/lib/renderer.js)裡的這一行好像呀

```javascript
  return parser.render(data.text);
```

所以 hackmd 的這一行指的是，使用者 keyin 原本的 markdown syntax

```javascript=
var value = editor.getValue()
```

## 過濾器 (後處理器)

過濾器，也就是語法的後處理器。

前面研究的[「程式碼區塊加行號的參數」](https://github.com/hexojs/hexo/blob/master/lib/plugins/filter/before_post_render/backtick_code_block.js)，就是後處理器在進行的。

```javascript=
var util = require('hexo-util');
var highlight = util.highlight;
```

由上面的程式碼得知，參數與程式碼則是丟進了外掛程式 `hexo-util` 的 `highlight` 函數中。進行後處理，hexo在處理程式碼加行號時，會使用 `table` 語法確定排列不與 `CSS` 相依，也可以排列出想要的位置。

### 過濾器與渲染器兩者之間差在哪呢？

渲染器: markdown -> html
後處理器: 模版語言 or html -> html

- 前面有說，修改渲染器只是確定 markdown 吃得進去。
- 而現在修改過濾器，是確定模板語言是否吃得進去。
  由於模版語言，並不是 markdown ，所以渲染器並不會處理。

最後的 html 並不會和 hackmd 一模一樣。(但是沒關係)

## 安裝過濾器

有一些外掛程式支援與 hackmd 一樣的寫法，並且出現相同的效果

- 流程圖[^flowchart]
- UML 循序圖[^sequence]

```shell=
$ npm install hexo-filter-flowchart --save
$ npm install hexo-filter-sequence --save
```

## 改上文章目錄[^toc]

我裝的主題，沒有文章目錄，所以要自己安裝上去。

在主題的 `layout` 資料夾中，找到插入內容的這一行 `<%- post.content %>` ，上面加上 `<%- partial('toc') %>`

改好如下

```
<%- partial('toc') %>  ##加上這一行
<%- post.content %>
```

<!-- prettier-ignore-start -->
[^emojis]: [[github]hexo-filter-github-emojis](https://github.com/crimx/hexo-filter-github-emojis)
[^flowchart]: [[github]hexo-filter-flowchart](https://github.com/bubkoo/hexo-filter-flowchart)
[^sequence]: [[github]hexo-filter-sequence](https://github.com/bubkoo/hexo-filter-sequence)
[^toc]: [Hexo小書 > 添加文章目錄](https://pengloo53.gitbooks.io/hexo/content/chapter2/7%20%E6%B7%BB%E5%8A%A0%E6%96%87%E7%AB%A0%E7%9B%AE%E5%BD%95.html)
<!-- prettier-ignore-end -->
