---
title: node-sass 初探
date: 2018-03-12 21:52:31
tags: [nodejs, webpack, vuejs, 'node-sass', 'JavaScript']
categories: [工具使用]
---
# NODE-SCSS

除了 ruby 的 compass ，還有其它的方案可以編 `sCSS -> CSS`。

> 為了 vue-cli 而看 webpack ，由於 webpack 看了 sass-loader，因為看了 sass-loader 知道了 node-sass。

這一篇就來談談，如何用 node-sass 編 sCSS -> CSS。

## 初探 node-sass

node-sass 是一套在 node.js 用 [LibSass](https://github.com/sass/libsass) 編 sCSS 的工具。

```
project
├ index.sCSS
└ bigFont.sCSS
```

### 安裝[^node-sass]

```shell=
npm install node-sass
```

### 程式碼

有含 `@import` 的指令

index.sCSS
```sCSS
@import "bigFont";

body {
    color: red;
}
```

bigFont.sCSS
```sCSS
body {
    font-size: 36px;
}
```

### 改 package.json

> node-sass 安裝在 local 而不是 global 。
讓 sCSS 可以用 npm 的指令觸發

指令要加在 package.json[^node-sass-note]

```javascript=
  "scripts": {
    "build-CSS": "node-sass",
  },
```

### 執行

下指令
```shell=
npm run build-CSS ./index.sCSS ./index.css
```


## 那... `compass watch` 呢？

如果要 `watch` 就是將 npm

```javascript=
    "scripts": {
        "build-CSS": "node-sass -w",
    },
```

## 那... 要結構化 sass 呢？

如果要編出相對應的資料夾結構。[^node-sass-15min]
就要將指令做成這樣

```javascript=
    "scripts": {
        "build-CSS": "node-sass --output-style=expanded --watch sCSS/ -o CSS/"
    },
```

[^node-sass]: [node-sass github](https://github.com/sass/node-sass)

[^node-sass-note]: [Node sass 入門 \[筆記\]](http://adon988.logdown.com/posts/4736822-node-sass-tutorial)

[^node-sass-15min]: [SCSS 15分鐘入門](http://eddychang.me/blog/others/91-sCSS-15-mins.html)
