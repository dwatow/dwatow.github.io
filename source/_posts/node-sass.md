---
title: node-sass 初探
date: 2018-03-12 21:52:31
tags: [nodejs, vuejs, 'node-sass', js]
categories: [工具使用]
---
# NODE-SCSS

除了 ruby 的 compass ，還有其它的方案可以編 `scss -> css`。

> 為了 vue-cli 而看 webpack ，由於 webpack 看了 scss-loader，因為看了 scss-loader 知道了 node-sass。

這一篇就來談談，如何用 node-scss 編 scss -> css。

## 初探 node-scss

node-scss 是一套在 node.js 用 [LibScss](https://github.com/sass/libsass) 編 scss 的工具。

```
project
├ index.scss
└ bigFont.scss
```

### 安裝[^node-scss]

```shell=
npm install node-sass
```

### 程式碼

有含 `@import` 的指令

index.scss
```scss
@import "bigFont";

body {
    color: red;
}
```

bigFont.scss
```scss
body {
    font-size: 36px;
}
```

### 改 package.json

> node-scss 安裝在 local 而不是 global 。
讓 scss 可以用 npm 的指令觸發

指令要加在 package.json[^node-scss-note]

```javascript=
  "scripts": {
    "build-css": "node-sass",
  },
```

### 執行

下指令
```shell=
npm run build-css ./index.scss ./index.css
```


## 那... `compass watch` 呢？

如果要 `watch` 就是將 npm

```javascript=
  "scripts": {
    "build-css": "node-sass -w",
  },
```


[^node-scss]: [node-scss github](https://github.com/sass/node-sass)

[^node-scss-note]: [Node sass 入門 \[筆記\]](http://adon988.logdown.com/posts/4736822-node-sass-tutorial)
