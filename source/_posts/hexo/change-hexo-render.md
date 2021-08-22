---
title: 換Hexo的markdown渲染器
date: 2017-06-12 16:44:36
tags:
- hexo
- markdown-it
categories:
- hexo改裝
---

# 換Hexo的markdown渲染器

## 「懶」的原因
由於，個人超愛用[hackmd](hackmd.io)，希望之後寫部落格都使用hackmd寫一寫，再直接下載.md檔，就可以上部落格了。(當然這一篇文章就是這樣來的)

就不用寫兩次相同內容的文章或者在那轉碼(markdown to html)貼文。

## 先備知識

[^MOPCON2016]: 透過[HackMD - Markdown 協作筆記@ 2016 MOPCON - HackMD](https://hackmd.io/p/Bk9X2eJT)這一場分享的資訊知道，

在此並不是要先認識渲染器(這是先備知識的先備知識)。

先知道的是hackmd是使用什麼渲染器。它是使用一個叫`markdown-it`的渲染器[^MOPCON2016]，到hackmd的github

參考[hackmd的package.json](https://github.com/hackmdio/hackmd/blob/master/package.json)內的`package.json`

```javascript=61
    "markdown-it": "^8.2.2",
    "markdown-it-abbr": "^1.0.4",
    "markdown-it-container": "^2.0.0",
    "markdown-it-deflist": "^2.0.1",
    "markdown-it-emoji": "^1.3.0",
    "markdown-it-footnote": "^3.0.1",
    "markdown-it-imsize": "^2.0.1",
    "markdown-it-ins": "^2.0.0",
    "markdown-it-mark": "^2.0.0",
    "markdown-it-regexp": "^0.4.0",
    "markdown-it-sub": "^1.0.0",
    "markdown-it-sup": "^1.0.0",
```

## 修改步驟

### 更換渲染器

1. 刪除原本的渲染器[^change-render]
```shell
$ npm un hexo-renderer-marked --save
```
2. 在`hexo`的專案中，安裝套件`hexo-renderer-markdown-it`[^hexo-renderer-markdown-it]
```shell
$ npm i hexo-renderer-markdown-it --save
```

### 修改渲染器參數設定程式碼

在此只要確定在`$hexo/node_modules/hexo-renderer-markdown-it/lib/renderer.js`的程式碼長這樣就好

```javascript=11
if(opt.plugins) {
  parser = opt.plugins.reduce(function (parser, pugs) {
    if(pugs instanceof Object && pugs.name) {
      return parser.use(require(pugs.name), pugs.options);
    }
    else {
      return parser.use(require(pugs));
    }
  }, parser);
}
```
> [Github](https://github.com/hexojs/hexo-renderer-markdown-it/blob/master/lib/renderer.js)上的版本是上面這樣。

### 安裝渲染器外掛套件

在`$hexo`目錄下，下指令安裝套件

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
$ npm install markdown-it-checkbox --save
```

### 設定`_config.yml`

先看全部，把下面那一段，直接貼到`_config.yml`的最下面。
後面會一一的解釋這些區段如何使用。

```python
# Markdown-it config
## Docs: https://github.com/celsomiranda/hexo-renderer-markdown-it/wiki
markdown:
  render:
    html: true # Doesn't escape HTML content so the tags will appear as html.
    xhtmlOut: false # Parser will not produce XHTML compliant code.
    breaks: true # Parser produces `<br>` tags every time there is a line break in the source document.
    linkify: false # Returns text links as text.
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
       level: 1, 2 # Minimum level for ID creation. (Ex. h2 to h6)
       collisionSuffix: 'v' # A suffix that is prepended to the number given if the ID is repeated.
       permalink: true # If true, creates an anchor tag with a permalink besides the heading.
       permalinkClass: header-anchor # Class used for the permalink anchor tag.
       permalinkSymbol: '' # The symbol used to make the permalink.
```

#### render的參數

可以參考hackmd的
[`hackmd/blob/master/public/js/extra.js`](https://github.com/hackmdio/hackmd/blob/master/public/js/extra.js) 這裡有hackmd初始化`markdown-it`的程式碼

```javascript=944
import markdownit from 'markdown-it'
import markdownitContainer from 'markdown-it-container'

export let md = markdownit('default', {
  html: true,
  breaks: true,
  langPrefix: '',
  linkify: true,
  typographer: true,
  highlight: highlightRender
})
```

#### plugins

把剛剛安裝的`markdown-it`外掛套件一個一個加上來。

#### anchors

我還沒研究


[^change-render]: [Getting Started - hexo-renderer-markdown-it](https://github.com/hexojs/hexo-renderer-markdown-it/wiki/Getting-Started)

[^npm-install-string]: [[npm套件]string](https://www.npmjs.com/package/string)


[^hexo-renderer-markdown-it]: [[Github] hexo-renderer-markdown-it](https://github.com/hexojs/hexo-renderer-markdown-it)
