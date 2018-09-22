---
title: Babel 第一次接觸
date: 2018-03-08 14:51:40
tags: [nodejs, webpack, vuejs, babel, "JavaScript"]
categories: [工具使用]
---

# Babel 第一次接觸

巴別塔，是一則聖經創世紀的故事。[^babel-wiki]
一群只說一種語言的人在「大洪水」之後從東方來到了示拿（希伯來語：שנער‎‎）地區，並且決定在這修建一座城市和一座「能夠通天的」高塔；上帝見此情形，就把他們的語言打亂，讓他們再也不能明白對方的意思，還把他們分散到了世界各地。

> 為了 vue-cli 而看 webpack ，由於 webpack 看了 babel-loader，因為看了 babel-loader 知道了 babel-core。

開一個新的 npm 專案，並且初始化完成之後。
安裝 `babel-core`

試著將這段程式碼從 es6 轉譯成 es5

```javascript
let x = n => n + 1;
```

> 學習的過程，有找到阮一峰的教學[^babel-ruanyifeng]
> 跟著文章裡的範例做，但是失敗了！
> 所以只好自己來一篇，解決自己遇到的問題。

## 初探 babel-core

### 安裝

```shell
npm install --save-dev babel-core
```

### 程式碼

引用自阮一峰的範例[^babel-ruanyifeng]

```javascript=
var babel = require("babel-core");

var es6Code = "let x = n => n + 1";
var es5Code = babel.transform(es6Code, {
  presets: ["es2015"]
}).code;
console.log(es5Code);
```

執行失敗，原因在於，只是安裝 `babel-core` 而已。在這一步，對於 babel 的運作，還不是很了解。

將錯誤訊息 Google 之後。
跟著錯誤訊息，找到了新線索
還要再裝

```shell
npm install babel-preset-es2015
```

執行成功!!

```shell
$ node index.js
"use strict";

var x = function x(n) {
  return n + 1;
};
```

總算是可以透過安裝 `babel-core` 來同作 babel 的核心功能。

但是，這並不能解決心中的疑問。

1. babel-core 是什麼？
2. babel-preset-es2015 是什麼？

接下來，來看看從官網文件的教學，解決心中的疑問吧！

## 官網安裝

[官網首頁](https://babeljs.io/)就有這個指令

```shell=
npm install --save-dev babel-cli babel-preset-env
```

官網一開始就叫我們安裝兩個套件

- `babel-cli`
- `babel-preset-env`

跟據反覆實驗的觀察 `babel-cli` 包含了 `babel-core`

在尚未安裝 `babel-preset-es2015` 時，我們暫時先將它註解掉，並且執行看看

```javascript=
var babel = require("babel-core");

var es6Code = "let x = n => n + 1";
var es5Code = babel.transform(es6Code, {
  //presets: ['es2015']
}).code;
console.log(es5Code);
```

發現，它可以 work，不過結果與剛剛有差。
而且，是原封不動的將程式碼吐出來。

```shell
$ node index.js
let x = n => n + 1;
```

這是怎麼回事？
我們跟著第二條線索 `babel-preset-env` 來看看是怎麼回事吧

## Preset

[Plugins · Babel](https://babeljs.io/docs/plugins/) 頁面可以看到簡單的介紹

在此官網開頭就解釋[^babel-preset] ~(看原文會更好)~

> Babel is a compiler, 一種吃 code 吐 code 的東西。
> 將程式碼解析之後，再吐出來，並沒有做任何的處理。
> 想要處理，要給 plugin。

其中 `preset` 就是一種 plubin
而 `env` 是一種 `preset`

## env

env 是一套 babel 官方套件，也是新手入門的好選擇

> babel 首頁就是叫我們安裝這一套

安裝

```shell
npm install babel-preset-env --save-dev
```

設定 options
在 babel-core 的 options 這樣設定

> babel 也建議這樣設定

```javascript
{
  "presets": ["env"]
}
```

```javascript=
var babel = require("babel-core");

var es6Code = "let x = n => n + 1";
var es5Code = babel.transform(es6Code, {
  //presets: ['es2015']
  presets: ["env"]
}).code;
console.log(es5Code);
```

執行程式，可以轉譯出來

```shell=
$ node index.js
"use strict";


var x = function x(n) {
  return n + 1;
};
```

其中，要設定轉譯的支援範圍，是 babel 的強項。

它使用了[browserslist](https://github.com/ai/browserslist) 的 parse 來解析設定值。它可以使用較 human friendly 的句子進行設定。

例如:
所有瀏覽器最近的兩版, 並且 Safari 的
7 版(含)以上

```javascript=
{
  "presets": [
    ["env", {
      "targets": {
        "browsers": ["last 2 versions", "safari >= 7"]
      }
    }]
  ]
}
```

官網文件的教學，也包含了轉成 node.js 的教學。有興趣可以去看

現在，我們學會了 babel 的安裝、設定和使用，現在回過頭再來看看，為什麼要另外安裝 [babel-preset-es2015](https://babeljs.io/docs/plugins/preset-es2015/)

其實就是一套指定版本的 preset。
使用官網的教學，則是用途較為廣泛的設定。

<!-- prettier-ignore-start -->
[^babel-wiki]: [巴別塔 - 維基百科](https://zh.wikipedia.org/wiki/%E5%B7%B4%E5%88%A5%E5%A1%94)
[^babel-ruanyifeng]:  [Babel 入門教程](http://www.ruanyifeng.com/blog/2016/01/babel.html)
[^babel-preset]: [Plugins · Babel](https://babeljs.io/docs/plugins/)
<!-- prettier-ignore-end -->
