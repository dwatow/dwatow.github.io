---
title: node-sass 初探
date: 2018-03-12 21:52:31
tags:
- nodejs
- webpack
- vue
- node-sass
- JavaScript
categories:
- 工具使用
---

# node-sass 初探

:::danger
# 此方法不推薦!!
# 請直接用 `npm install sass` 安裝 dart sass
:::

除了 ruby sass 和 compass ，還有其它的方案可以處理 `SCSS -> CSS`。

> 為了 vue-cli 而看 webpack ，由於 webpack 看了 sass-loader，因為看了 sass-loader 知道了 node-sass。

使用 node-sass 的原因，除了因為 webpack 而接觸之外，盡可能的使用 JavaScript 造出來的工具，也是我選用的原因。
node-sass 是一套在 node.js 用 [LibSass](https://github.com/sass/libsass) 處理 SCSS 的工具。

這一篇就來談談，如何用 node-sass 處理 SCSS -> CSS

## 什麼是 SCSS

SCSS 是 superset of CSS[^define_scss]。
一種語法相容 CSS 又多了 Sass 的寫法。

[^define_scss]: [Syntax SCSS - Sass](https://sass-lang.com/documentation/syntax#scss)

## 程式碼

```
project
├ index.scss
└ bigFont.scss
```

**index.scss**

```scss
@import "bigFont";

body {
  color: red;
}
```

**bigFont.scss**

```scss
body {
  font-size: 36px;
}
```

## 安裝[^node-sass]

```shell
npm init -y # 要先有 package.json，如果已經有可以略過這一行
npm install --save node-sass
```

### 是否安裝成功

> 把 node-sass 安裝在 local 而不是 global
> 只能用 npm 的指令觸發 node-sass。

**修改 package.json[^node-sass-note]**

指令要加在 script 段落裡 (沒有的話，要自己加入)

```javascript=
{
  //...
  "scripts": {
    "build-css": "node-sass",
  },
  //...
}
```

若安裝成功，會出現以下訊息

```shell
chris$ npm run build-css

> node-sass-demo@1.0.0 build-css /Users/chris/code/node-sass-demo
> node-sass

Provide a Sass file to render

Example: Compile foobar.scss to foobar.css
  node-sass --output-style compressed foobar.scss > foobar.css
  cat foobar.scss | node-sass --output-style compressed > foobar.css

Example: Watch the sass directory for changes, compile with sourcemaps to the css directory
  node-sass --watch --recursive --output css
    --source-map true --source-map-contents sass
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! node-sass-demo@1.0.0 build-css: `node-sass`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the node-sass-demo@1.0.0 build-css script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/chris/.npm/_logs/2020-01-01T05_03_49_078Z-debug.log
```

## 執行

將 index.scss 處理成 index.css

下指令

```shell
npm run build-css ./index.scss ./index.css
```

這樣一來，指令就會組成

```shell
node-sass index.scss index.css
```

就會依 `node-sass 輸入檔 輸出檔` 的格式執行。

## 那... `compass watch` 呢？

*不過，處理一次就要下一次指令，是不是也太累了？
想要改一次檔案就處理一次可以嗎？*
當然可以，不過這問題要重新定義成「儲存一次 scss 檔，就處理一次 CSS」

有用過 ruby sass 的朋友們，如果安裝 compass 的話，使用 `compass watch` 就可以利用 compass 執行了
那在 compass 已成時代眼淚之後，使用 node-sass 的我們要怎麼做呢？

`watch` 就是「一直修改一直處理、一直修改一直處理...」

如果要 `watch` 就是將指令加上 `-w`

```javascript=
"scripts": {
    "build-css": "node-sass -w",
},
```

這樣一來，指令就會組成

```shell
node-sass -w index.scss index.css
```

就會依 `node-sass -w 輸入檔 輸出檔` 的格式執行。

## 那... 要結構化 sass 呢？

如果要處理出相對應的資料夾結構。

我們設定好的資料夾像這樣

```
project
└ scss
  ├ index.scss
  └ bigFont.scss
```

指令要做成這樣[^tsuifei]

[^tsuifei]: [SASS 環境部署與基礎 - tsuifei blog](https://tsuifei.github.io/SASS-deployment-environment-and-fundamental/)

```javascript=
"scripts": {
    "build-css": "node-sass -wr scss/ -o css/"
},
```

使用時，只要這樣寫

```shell
npm run build-css
```

加上了一個 `-r` 是為了巢狀式資料來而設定的，如果資料夾很深，也可以生成一樣的結構。

### 設定不處理的檔案

這樣生成兩個 css 檔。

bigFont.css

```css
body { font-size: 36px; }
```

index.css

```css
body { font-size: 36px; }
body { color: red; }
```

因為 index.scss 引用了 bigFont.scss 所以，如果兩個檔案都生成 css 檔，會讓 `body { font-size: 36px; }` 重複了一次。為了不會出現「不直接引用到 .html 檔的檔案」，Sass 在檔名的設定上有一個默契，加上「底線前綴」就可以告訴 Sass 不處理這個檔案，但是引用時不用加入底線前綴。

```
project
└ scss
  ├ index.scss
  └ _bigFont.scss
```

## 第一次執行就生成 CSS。


指令要做成這樣

```javascript=
"scripts": {
    "build-css": "node-sass -r scss/ -o css/ && node-sass -wr scss/ -o css/"
},
```

這其實是兩個指令，用 && 串起來，第一次不給 `-w` 第二次給 `-w`。
因為第一次給的指令，就是「要處理時，才下指令」
第二次給的指令是「每次存檔時才處理」

## 其它功能

其它指令參數

- `--source-comments` 在 CSS 檔加入 SCSS 的位置註解，
    有助於你找到這一個 CSS 是哪一行 SCSS 生成的

## 後記: 如果我只是想安裝 Sass ？安裝哪一種？

這個問題，其實不外乎就是看[官網](https://sass-lang.com/)在[Install](https://sass-lang.com/install) 裡有介紹。

> If you use Node.js, you can also install Sass using npm by running

```shell
npm install -g sass
```

> However, please note that this will install the pure JavaScript implementation of Sass, which runs somewhat slower than the other options listed here. But it has the same interface, so it’ll be easy to swap in another implementation later if you need a bit more speed!

因為我是 JavaScript 使用者，我想使用 npm 的 JS 版本比較適合我。

<!-- prettier-ignore-start -->
[^node-sass]: [node-sass github](https://github.com/sass/node-sass)
[^node-sass-note]: [Node sass 入門 \[筆記\]](http://adon988.logdown.com/posts/4736822-node-sass-tutorial)
<!-- prettier-ignore-end -->
