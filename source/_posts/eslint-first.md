---
title: ESlint 初次安裝
date: 2019-01-20 17:36:20
tags: [eslint, prettier, webpack]
categories: '技術心得'
---

# ESlint 初次安裝

之前都是靠 vue-cli 安裝。
這次自己來裝看看...順便也研究一下要怎麼和 prettier 一起使用。

## 安裝

在官網找到 npm 上的安裝方式^[[Getting Started with ESLint](https://eslint.org/docs/user-guide/getting-started)]

```shell
npm install eslint --save-dev
```

如果你要用在 webpack 可以使用 eslint-loader^[[eslint-loader - github](https://github.com/webpack-contrib/eslint-loader)]

```shell
npm install eslint-loader --save-dev
```

**webpack.config.js**

```javascript=
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        include: [resolve("src")],
        enforce: "pre",
        use: [
          {
            loader: "eslint-loader"
          }
        ]
      }
    ]
  }
};
```

## Style 設定

使用問答來進行 `.eslintrc.json` 檔的生成^[[Global Installation and Usage](https://eslint.org/docs/user-guide/getting-started#global-installation-and-usage)]

```shell
npx eslint --init
```

生成的檔案內容

```json=
{
  "env": {
    "es6": true,
    "node": true,
    "browser": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2015,
    "sourceType": "module"
  },
  "rules": { ... } 請刪除整段
}
```

### 若要和 prettier 併用^[[You’ll thank me - Dan Abramov](https://twitter.com/dan_abramov/status/1086215004808978434?fbclid=IwAR2fib4Nvr4Lq5Onc1VXS7rguHkoFbt-Egu0O9-I_InJ4uVu6onQgSe-5jA)]

1. 打開 `.eslintrc` 檔
2. 刪掉 rule 的區段 (或安裝 `eslint-config-prettier`)
3. 安裝 Prettier

### 若要在 webpack 和 prettier 併用

除了上述的事要做之外，還要

1. 用在 webpack 要安裝 prettier-loader
1. 設定 webpack.config.js

**webpack.config.js**

```javascript=
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        include: [resolve("src")],
        enforce: "pre",
        use: [
          {
            loader: "eslint-loader"
          },
          {
            loader: "prettier-loader"
          }
        ]
      }
    ]
  }
};
```

這樣就可以跑完 prettier 跑 eslint 設定檔衝突也不會發生了。

## 省略不 lint

如果目前正在 debug 的地方，要加上 `console.log()`，想省略不要 lint ，可以利用 eslint 的特殊註解來標註^[[disabling-rules-with-inline-comments](https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments)]

兩種基本的用法

**單行**

```javascript
console.log("這一行沒有 eslint"); // eslint-disable-line
```

**多行的區塊**

```javascript
/* eslint-disable */
console.log("這裡沒有 eslint");
/* eslint-enable */
```
