---
title: 初次使用 Docsify
date: 2018-07-28 17:10:50
tags: ['docsify', 'markdown', 'vuejs']
categories: '工具使用'
---
# 初次使用 Docsify

這是一個 markdown + vue 組合的文件網站產生器。
markdown 渲染器只能用 marked

> 它不會生成靜態 `.html` 頁面，而是執行時期動態的將 `.md` 轉成 `.html` 的內容
> 可以直接佈署到 github

## 為什麼用 Docsify

上次聽 Tainan.py 介紹 sphinx 的強大，印象深刻，只可惜它沒有 markdown
而且，其實 JavaScript 的開發者都會想要用 JavaScript 開發的工具，差點就用 sphinx 了。

就用相同的道理來找找，有沒有 JavaScript 的 open source project 有使用什麼厲害的工具。
看過了 vue.js, node.js, express...都沒有，

其中 vue.org 這麼說

> This site is built with hexo. Site content is written in Markdown format located in src. Pull requests welcome!

還是 hexo !!!!

原本，強者我朋友介紹我 [Docusaurus](https://docusaurus.io/) ，他說可以看看一些 JavaScript 的 open source project 使用什麼工具。
他就說 React Native, ReasonReact, Babel, Jest, ReasonML 都用它耶。

我研究了一下， markdown + react 的組合，還真是吸引人，不過由於我自己熟悉的是 vue.js 所以貪心的我又希望 vue.js 的開發者都會想要用 vue.js 開發的工具，所以又找了一下。

找到了[Awesome Static Web Site Generators](https://github.com/myles/awesome-static-generators)

還是不知道為什麼，就找到 [Docsify](https://docsify.js.org/)


# 安裝

```shell
$ mkdir <資料夾名稱>
$ cd <資料夾名稱>
$ npm install -D docsify-cli
```

安裝 `docsify-cli` 成 develop 工具，使用 npx 執行

## 初始化

如果未來存放文件資料夾要設定成 `./docs`
初始化時就這樣下指令

```shell
$ npx docsify init ./docs
```

初始化之後，可以到 `./docs` 裡看看

```shell
docs/
├── .nojekyll
├── README.md
└── index.html
```

**.nojekyll**

讓 github 不忽略底線開頭的檔案

**README.md**

網站的首頁內容

**index.html**

這裡面就像是 vue.js 的 code

```htmlmixed=
  <div id="app">Loading...</div>
  <script>
    window.$docsify = {
      name: 'docsify-demo',
      repo: ''
    }
  </script>
  <script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
```

其中 `script` 中，預設為 `el: '#app'`
若 `template` (html) 改變 `id` 值

```htmlmixed=
<div id="myComponent">Loading...</div>
```

要重新設定 component 裡的 `el`

```
window.$docsify = {
  el: '#myComponent',
  name: 'docsify-demo',
  repo: '',
  homepage: 'home.md', //改首頁
}
```

其它配置可參考 [`$docsify` 文件](https://docsify.js.org/#/zh-cn/configuration)

## 路由

路由與頁面的路徑有關

```
docs/README.md        → http://domain.com/#
docs/guide.md         → http://domain.com/#/guide
docs/zh-cn/README.md  → http://domain.com/#/zh-cn/
docs/zh-cn/guide.md   → http://domain.com/#/zh-cn/guide
```

## 側邊欄

兩種用法

### 指定側邊欄 md 檔

- 使用預設檔名
  1. 加入 `loadSidebar: true`*
  2. 新增文件 `./docs/_sidebar.md`
- 使用自訂檔名 `sidebarConfig.md`
  1. 加入 `loadSidebar: 'sidebarConfig'`*
  2. 新增文件 `./docs/sidebarConfig.md`

*在 `./docs/index.html` 中的 `script`

**index.html**

```javascript
window.$docsify = {
  name: 'docsify-demo',
  repo: '',
  loadSidebar: true, //加入這一行
}
```

**_sidebar.md**

```
* [首页](zh-cn/)
* [指南](zh-cn/guide)
  * [快速开始](zh-cn/quickstart.md)
* 真正的指南
  * [多页文档](zh-cn/more-pages.md)
  * [定制导航栏](zh-cn/custom-navbar.md)
  * [封面](zh-cn/cover.md)
```

### 自動生成

有導覽列，就會想用「自動生成側邊欄」

拿掉指定側邊欄設定的檔案，反而要加入「顯示側邊欄最大層數」(沒設定預設 6)

**index.html**

```javascript
window.$docsify = {
  name: 'docsify-demo',
  repo: '',
  subMaxLevel: 2, //加入這一行
}
```

## 導覽列

### 修改 `template`

**index.html**

加入 `<nav>`

```htmlmixed=
<body>
  <nav>
    <a href="#/">EN</a>
    <a href="#/zh-cn/">中文</a>
  </nav>
  <div id="app"></div>
</body>
```

### 指定導覽列 md 檔

- 使用預設檔名
  1. 加入 `loadNavbar: true`*
  2. 新增文件 `./docs/_navbar.md`
- 使用自訂檔名 `navbarConfig.md`
  1. 加入 `loadNavbar: 'navbarConfig'`*
  2. 新增文件 `./docs/navbarConfig.md`

*在 `./docs/index.html` 中的 `script`

**index.html**

```javascript
window.$docsify = {
  name: 'docsify-demo',
  repo: '',
  loadNavbar: true, //加入這一行
}
```

**_navbar.md**

```
* [快速开始](zh-cn/quickstart.md)
* 基础
  * [多页文档](zh-cn/more-pages.md)
  * [定制导航栏](zh-cn/custom-navbar.md)
  * [封面](zh-cn/cover.md)
* [配置项](zh-cn/configuration.md)
  * [主题](zh-cn/themes.md)
  * [使用插件](zh-cn/plugins.md)
  * [Markdown 配置](zh-cn/markdown.md)
  * [代码高亮](zh-cn/language-highlight.md)
```

## 封面頁

### 指定封面頁 md 檔

- 使用預設檔名
  1. 加入 `coverpage: true`*
  2. 新增文件 `./docs/_coverpage.md`
- 使用自訂檔名 `coverPage.md`
  1. 加入 `coverpage: 'coverPage'`*
  2. 新增文件 `./docs/coverPage.md`

*在 `./docs/index.html` 中的 `script`

**index.html**

```javascript
window.$docsify = {
  name: 'docsify-demo',
  repo: '',
  coverpage: true, //加入這一行
}
```

**_coverpage.md**

```
![logo](_media/icon.svg)

# docsify

> A magical documentation site generator.

* Simple and lightweight (~12kb gzipped)
* Multiple themes
* Not build static html files

[GitHub](https://github.com/docsifyjs/docsify/)
[Get Started](#quick-start)
```

其它的功能再參考[官網文件](https://docsify.js.org/)吧!!
