---
title: Webpack 處理 Vue 專案的路徑規則整理
date: 2018-09-21 13:56:34
tags:
- webpack
- vue
- file-loader
- css-loader
categories:
- 技術心得
---

# Webpack 處理 Vue 專案的路徑規則整理

webpack 只處理 JavaScript 檔。
在 vue 專案
有 vue 檔，vue-loader，轉成 JavaScript
有 CSS 檔，它本身會透過 css-loader， CSS 的 `@import` 轉成 JavaScript
JavaScript 的 `require` 或 `import` 就會呼叫 file-loader

## vue-loader

[`vue-loader`](https://vue-loader.vuejs.org/)

vue-cli 的核心 loader

**路徑處理**

- 絕對路徑: 保留
- `./` => `/`
- `../` => `/../`
- `~`: node_module
- `@` => `./src`
- css-loader
  - `file.png` => `./file.png`
  - `~module/file.png` => `module/file.png`

## CSS-loader

- url(image.png) => require('./image.png')
- url(~module/image.png) => require('module/image.png')

## static 資料

webpack config 設定

**config/index.js**

```
module.exports = {
  // ...
  build: {
    assetsPublicPath: '/',
    assetsSubDirectory: 'static'
  }
}
```

使用絕對路徑

```
/static/[filename]
```

### Asset Resolving Rules (參考)

- 相對路徑 `./assets/login.png`
  - 模組依賴: webpack 自動生成路徑: base on output config
  - 絕對路徑 `/static/img/box.b7bc3af.png`
- 無前綴 `assets/login.png`
  - 相對路徑: 加上 `./`
- 根目錄 `/assets/login.png`
  - 還是根目錄
- 毛毛蟲 `~/asset/login.png`
  - 無前綴 `assets/login.png`
