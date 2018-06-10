---
title: 在 Vue-cli 或 Webpack 想使用 Bootstrap
date: 2018-03-25 10:17:34
tags: [nodejs, webpack, vuejs, 'bootstrap', 'jquery', 'JavaScript']
categories: [工具使用]
---
# 在 Vue-cli 或 Webpack 想使用 Bootstrap

雖然官網文件[^webpack-bootstrap]有記載如何安裝，但是我在沒有很順利的情況之下，最後成功了。
回過頭再去看文件才看懂，希望可以幫助到和我一樣對官網文件有閱讀困難的朋友。

## 安裝

```shell
npm install bootstrap
```

用 npm 安裝的 Bootstrap 雖然方便，但是使用上不是這麼按照 npm 慣例。
畢竟是前端的 code 不會出現 module 也是正常的吧？

## 身為 npm 套件的 bootstrap

安裝完記得細節這一段。[^download-bootstrap]

> `require('bootstrap')` will load all of Bootstrap’s jQuery plugins onto the jQuery object. The `bootstrap` module itself does not export anything. You can manually load Bootstrap’s jQuery plugins individually by loading the `/js/*.js` files under the package’s top-level directory.

這一段意思看不懂沒關係。
來看一下 `source code` 的結構

![](https://i.imgur.com/OTDtlEp.png)

觀察發現

1. npm 套件並沒有放入 `index.js`
2. `package.json` [^npm-package.json]
    ```
    {
        ...
        "main": "dist/js/bootstrap",
        ...    
    }
    ```
身為 npm 套件的程式進入點在 `dist/js/bootstrap` 。

## 載入 Bootstrap 的 JavaScript

一段已經宣告好的 js 只需要 `<script src"...">` 就加進來了。
在 vue-cli 裡，要在 webpack 的 entry point 的 `.js` 檔裡加入這一行。
(或者是在有用到 bootstrap 的 .vue 檔裡)

> 對 jQuery 有 `peerDependencies`，所以記得要自己安裝

```javascript
import 'jquery';
import 'bootstrap';
```

等同於

```javascript
import 'jquery';
import 'bootstrap/dist/js/bootstrap.js';  //變成 main 的路徑
```

表示「引用 Bootstrap 的 JavaScript」。
而不是整個 Bootstrap

## 載入 Bootstrap 的 CSS

在 vue-cli 裡，要在 webpack 的 `entry point 的 .js` 檔裡加入這一行。
(或者是在有用到 bootstrap 的 .vue 檔裡)

```javascript
import 'bootstrap/dist/css/bootstrap.css'
```

表示「引用 Bootstrap 的 CSS」。
CSS 和 JavaScript 都引用進來，才算是有引用整個 Bootstrap。

:::danger
在 Webpack 還要設定 CSS-loader 。
:::

## 載入 Bootstrap 的 scss

在 vue-cli 裡，要在 webpack 的 `App.vue` 裡的 `<style lang="scss">` 加入這一行。
(或者是在有用到 bootstrap 的 .vue 檔裡)

```scss
@import "~bootstrap/scss/bootstrap";
```

表示「引用 Bootstrap 的 SCSS」。
CSS 和 JavaScript 都引用進來，才算是有引用整個 Bootstrap。

:::danger
在 Webpack 還要設定 scss-loader 。
:::

但是，事情卻還沒有這麼簡單!!!

### 引用 Bootstrap 的 `@mixin` 之類的共用資源

也許，是想也引用 SASS 的 `@mixin`, `@extand`, `@function`... 程式庫 (共用資源)，而不是引用寫好的 SCSS 而已。

那麼用官網教的方式，並不會順利成功。

因為 `vue-loader` 的關係，各個 component 的引用似乎不會照原本想的這樣。不過 `vue-loader` 官網有建議使用 `sass-resources-loader` [^vue-loader-sass-resources-loader]。

我自己試的結果，有兩點要注意

1. 在 `vue-loader` 下要設定「 `sass-loader` 系列」。
2. 如果遇到 "No PostCSS Config found" 的問題

下面就來記錄是怎麼解決的

### 1. 在 `vue-loader` 下要設定「 `sass-loader` 系列」。

**wepack.config.js**[^webpackconfig-setup-sass-resources-loader]

```javascript
{
  test: /\.vue$/,
  use: {
    loader: 'vue-loader',
    options: {
      loaders: {
        scss: [
          'vue-style-loader',
          'CSS-loader',
          'postCSS-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                './node_modules/bootstrap/scss/bootstrap.scss'
              ]
            },
          },
        ]
      }
    }
  }
},
```

### 2. 如果遇到 "No PostCSS Config found" 的問題

**postCSS.config.js**

修正 No PostCSS Config found [^fix-postCSS-config]

```javascript
module.exports = {};
```

使用這種「全域引用」的做法，可以確保 Bootstrap 的 SCSS 包含 `@mixin` 之類的程式庫。

## 用 bootstrap 的 vue 套件。

[bootstrap-vue](https://bootstrap-vue.js.org/docs)

這是一套將 bootstrap 的內容加工成 vue 形式的 source code 。
有興趣的人可以上它的官網看看其中的有趣。

[^download-bootstrap]: [Download · Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/download/#npm)

[^npm-package.json]: [package.json | npm Documentation](https://docs.npmjs.com/files/package.json#main)

[^webpack-bootstrap]: [Webpack · Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/webpack/)

[^vue-loader-sass-resources-loader]: [預處理器 · vue-loader, 加載一個全局設置文件](https://vue-loader.vuejs.org/zh-cn/configurations/pre-processors.html)

[^webpackconfig-setup-sass-resources-loader]: [Vue组件中使用Sass全局变量](https://xiaogliu.github.io/2017/09/09/use-sass-global-variables-in-every-vue-components/)

[^fix-postCSS-config]: [No PostCSS Config found with build:prod #604](https://github.com/akveo/ngx-admin/issues/604#issuecomment-271974780)
