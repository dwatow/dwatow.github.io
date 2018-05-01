---
title: 前端新手村 @import 開心的結構化 CSS
date: 2018-01-05 07:27:46
tags: ["2018鐵人賽", 'CSS', "CSS3", "import"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# `@import` 開心的結構化 CSS

在 w3.org 的文件[^1]中， `@import` 和[ CSS Cascade ](https://ithelp.ithome.com.tw/articles/10191613) 是寫在一起的。
 `@import` 可以利用 CSS Cascade 的持性做一些讓程式碼變好的安排。所以在此特別提出來介紹一下。

第一次知道這個語法，還是一個看到一個高中生的 source code，他把雲端字型用 `@import "URI"` 插入到 CSS 檔中，而不是常見的，使用 `<link href="URI">`，不然之前都只是在 SASS 的環境中使用。(初學看不懂這一段沒關係~XD)



## 語法

指定路徑檔名 和 URI同名字串 都是常見的做法。

```CSS
@import "CSSFileName.CSS";
@import url(CSSFileName.CSS);
@import url("CSSFileName.CSS");
```

和 Media Query 一起使用，預設 `all`

```CSS
@import url(color.CSS) screen and (color);
@import url(example.CSS) screen and (color), projection and (color);
@import url("fineprint.CSS") print;
@import url("bluish.CSS") projection, tv;
@import url("narrow.CSS") handheld and (max-width: 400px);
```

## `@import` 的行為

`@import` 幫你把另一個 CSS 檔的內容抄過來這個檔。必須先宣告於該檔的其它 ruleset 之前，否則失效。

## 怎麼結構化 CSS

w3.org 有定義一份 [CSSOM](https://www.w3.org/TR/CSSom-1/)
不過，我們不詳細介紹，有興趣的朋友可以去看看。

只是，在學習一些前置處理器時，往往會強調一些「 CSS 原生功能」當 SASS 的功能。
反而不是提醒我們原本寫 CSS 時就可以這麼做。

在此，我們就參考幾篇 SASS 的文章，看看他們怎麼「結構化」

### 單一頁面的 CSS 結構

```shell
stylesheets/
|
|-- modules/              # Common modules
|   |-- _all.sCSS         # Include to get all modules
|   |-- _utility.sCSS     # Module name
|   |-- _colors.sCSS      # Etc...
|   ...
|
|-- partials/             # Partials
|   |-- _base.sass        # imports for all mixins + global project variables
|   |-- _buttons.sCSS     # buttons
|   |-- _figures.sCSS     # figures
|   |-- _grids.sCSS       # grids
|   |-- _typography.sCSS  # typography
|   |-- _reset.sCSS       # reset
|   ...
|
|-- vendor/               # CSS or Sass from other projects
|   |-- _colorpicker.sCSS
|   |-- _jquery.ui.core.sCSS
|   ...
|
`-- main.sCSS            # primary Sass file
```

我個人不參考這篇文章作者的使用方式 (將 mixin, functions, variables 放一起)，我傾向於「不管是 variables、function ... 將宣告與使用，放得愈近愈好」

以下是我個人的使用風格

1. primary file，充滿著 `@import` 和想要複寫其它 SASS 檔案裡的特殊 SASS 。
2. Partials，充滿著 `@import` 和放置畫面上的零件 SASS，提供同風格的多個頁面使用。
3. Common modules，放置零件上的群組屬性 SASS，提供同風格的多個零件使用。

另外，vendor目錄，放置使用的套件 SASS 檔案。


**離題了!!回來寫 CSS**

CSS 有可能在 SASS 的建議架構之下應用嗎？

```shell
CSS/
|-- partials/           # Partials
|   |-- reset.CSS       # reset setting
|   |-- colors.sCSS     # colors
|   |-- buttons.CSS     # buttons
|   |-- figures.CSS     # figures
|   |-- grids.CSS       # grids
|   |-- typography.CSS  # typography
|   ...
|
|-- vendor/             # CSS from other projects
|   |-- animate.CSS
|   ...
|
|-- index.CSS           # primary CSS file
|-- function.CSS        # primary CSS file
`-- payment.CSS         # primary CSS file
```

換成 CSS 就是這樣用

1. primary file，充滿著 `@import` 和想要複寫其它 CSS 檔案裡的特殊 CSS 。
2. Partials，充滿著 `@import` 和放置畫面上的零件 CSS，提供同風格的多個頁面使用。

也許最後只是將 `<link href="">` 換成 `@import` 不過，可以透過 CSS 檔擺放順序，改變 CSS Cascade 在某些後端 render 的網站，就可以獨立於後端，做前端的事。
不過，再進階的用法，可以在初學時，初步的嘗到一點點類似 OOCSS 的滋味。


# 參考資料

[^1]: [2. Importing Style Sheets: the @import rule - w3.org](https://www.w3.org/TR/CSS-cascade-3/#at-import)
[^2]: [How to structure a Sass project](http://thesassway.com/beginner/how-to-structure-a-sass-project)
