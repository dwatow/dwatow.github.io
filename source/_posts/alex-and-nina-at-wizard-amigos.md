---
title: 來自國德的 Alex 和 Nina 交流
date: 2018-03-13 08:34:44
tags: [npm, unpkg, codepen]
categories: [工具使用]
---
# 來自德國的 Alex 和 Nina 交流

<iframe src="//slides.com/ninabreznik/wizard-amigos/embed?style=light" width="576" height="420" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

一切都是因為這一次的交流活動
前一天晚上在台中的 monospace 隔天來台南的好想工作室。

:::info
講的內容有一些好玩的技巧，就記錄在此文章。
:::

有興趣的朋友可以找他們的 [ninabreznik - codepen](https://codepen.io/ninabreznik/), [npm - ninabreznik](https://www.npmjs.com/~ninabreznik), [Nina Breznik - github](https://github.com/ninabreznik)
(由於主要是用 nina 的電腦 demo 所以大多都找他的區多)

## codepen 變 node.js 環境

在這兩天的活動中，他都有示範一個「如何用 codepen 測試 npm 套件的功能」
我想這對於後端也有莫大的吸引力。

而且，可以把 codepen 變成 node.js 的環境。
做好的 code 可以直接貼回 project 使用。

- [unpkg](https://unpkg.com/#/)
這是一套可以直接將 npm 的套件當作 cdn 引用的套件。
本身也是一個 cdn 套件。
- [npm-require](https://www.npmjs.com/package/npm-require)
可以用 commonjs 的方式，將 npm 模組引用到 project。

這兩個套件，可以在 codepen 這樣使用[^goodidea-usercard]
(程式碼引用自 Alex 在好想工作室活動的範例)

```html
<script src="https://unpkg.com/npm-require"></script>
```

```javascript
var usercard = require('goodideas-usercard')
var minixhr = require('minixhr')
var bel = require('bel')
var url = 'https://jsonplaceholder.typicode.com/users'

minixhr(url, function (data) {
  var arr = JSON.parse(data)
  var elements = arr.map(user => usercard(user))
  document.body.appendChild(bel`
     <div class="user-gallery">
       ${elements}
     </div>
   `)
})
```

<p data-height="265" data-theme-id="0" data-slug-hash="vdOOBv" data-default-tab="js,result" data-user="ninabreznik" data-embed-version="2" data-pen-title="vdOOBv" class="codepen">See the Pen <a href="https://codepen.io/ninabreznik/pen/vdOOBv/">vdOOBv</a> by Nina (<a href="https://codepen.io/ninabreznik">@ninabreznik</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>


[^goodidea-usercard]: [goodideas-usercard](https://www.npmjs.com/package/goodideas-usercard)
