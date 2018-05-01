---
title: Webpack 官網文件內介紹過的套件
date: 2018-02-26 16:20:16
tags: webpack
categories: ["工具使用"]
---
# Webpack 官網文件內介紹過的套件

## 緣起

很多人自學 webpack 都卡在不知道套件。而研究 webpack 卡卡的。

部份自動化，導致很多時候無法自動化而造成更多的技術債。

在此就介紹一下 webpack v3.11.0 的教學中，有提到的套件名稱、安裝方式、以及用途。

## 我自己學 webpack

我自己看 webpack 的官網文件學 webpack 。過程覺得還滿好上手的，其中需要記得的就是它可以做什麼，需要什麼關鍵字。大多都是安裝套件，就解決了什麼問題。

所以，此文章的結構，會採用 webpack 官網文件 Guides 的結構，並且 tree sharking

## Asset Management

在 webpack 裡想要編寫 JS 其它語言，就要用 loader 系列的套件。它們將其它語言變成 JS 。這麼一來才可以讓 webpack 看得懂

### [Loading CSS](https://webpack.js.org/guides/asset-management/#loading-CSS)

載入 CSS 要安裝兩個套件
- CSS-loader: 將 CSS 轉成 js
- style-loader 將轉好的 js 轉成 html 可以使用的樣式

```shell
npm install --save-dev style-loader CSS-loader
```

> [postCSS](https://webpack.js.org/loaders/postCSS-loader), [sass](https://webpack.js.org/loaders/sass-loader), [less](https://webpack.js.org/loaders/less-loader) 都可以唷
(postCSS 幫你加 prefix)

### [Loading Images](https://webpack.js.org/guides/asset-management/#loading-images)

處理一般檔案(圖片、字型檔、文件)

```shell
npm install --save-dev file-loader
```
### [Loading Data](https://webpack.js.org/guides/asset-management/#loading-data)

處理 csv, xml 格式的檔案

```shell
npm install --save-dev csv-loader xml-loader
```

## Output Management

修改 `webpack.config.js` 自動生成 html 。


### [Setting up HtmlWebpackPlugin](https://webpack.js.org/guides/output-management/#setting-up-htmlwebpackplugin)

也自動在 html 加上隨 `webpack.config.js` 的設定而改變 的 js 檔名。

```shell
npm install --save-dev html-webpack-plugin
```

HtmlWebpackPlugin 的套件

```shell
npm install html-webpack-template --save-dev
```

## Cleaning up the `/dist` folder

webpack 到目前為止都一直生成檔案到 `/dist` 資料夾，要如何讓它乾淨一點，不要有「用不到的檔案」呢？

### [`clean-webpack-plugin`](https://www.npmjs.com/package/clean-webpack-plugin)

每次 build 時清空它，所生成的檔案自然就是需要的檔案了。

```shell
npm install clean-webpack-plugin --save-dev
```

## Development

### [Using source maps](https://webpack.js.org/guides/development/#using-source-maps)

開發時，若有「編譯原始碼，產生生成碼」或者「代理呼叫(jQuery)」的設計，在除錯時會相當麻煩，不知道生成碼或代理，對應到自己寫的原始碼會在哪一行。

這時需要 source maps 來「對應原始碼」。
出現錯誤訊息時，會指向出錯的原始碼。

### [Choosing a Development Tool](https://webpack.js.org/guides/development/#choosing-a-development-tool)

在開發時，會需要大量修改，所以在這會使用「自動編譯」的功能
有三種做法。

1. webpack's Watch Mode
    優點: 內建功能
    缺點: 需要自己重新整理瀏覽器畫面
1. webpack-dev-server
    需安裝 `webpack-dev-server`
    ```shell
    npm install --save-dev webpack-dev-server
    ```
    優點: live-reload
    :::warning
    遇到問題: 使用 webpack-dev-server ，啟動時出現錯誤訊息
    ```shell
    Error: Cannot find module 'webpack-cli/bin/config-yargs'
    ```

    解決方案: 安裝套件
    ```shell
    npm install webpack-cli
    ```
    :::
1. webpack-dev-middleware
    可以和 express 結合在一起的做法

## Tree Shaking

> 此名稱引用自知名套件: [Rollup](https://github.com/rollup/rollup)
- dead-code: 用不到的 code

>You can imagine your application as a tree. The source code and libraries you actually use represent the green, living leaves of the tree. Dead code represents the brown, dead leaves of the tree that are consumed by autumn. In order to get rid of the dead leaves, you have to shake the tree, causing them to fall.

JavaScript 模組化之後，出現引用，卻沒使用的情況，就是 dead code ，希望可以自動編出無 dead code 的程式碼

### [Minify the Output](https://webpack.js.org/guides/tree-shaking/#minify-the-output)

可以去除 dead code 的 程式碼縮小燈

```shell
npm install --save-dev uglifyjs-webpack-plugin
```

類似的選擇

- **[webpack-rollup-loader](https://github.com/erikdesjardins/webpack-rollup-loader)**

## Production

開發的編譯取向

> In _development_, we want strong source mapping and a localhost server with live reloading or hot module replacement.

產品的編譯取向

> In _production_, our goals shift to a focus on minified bundles, lighter weight source maps, and optimized assets to improve load time.

兩者的取向不同所以要設定不同的 webpack configuation 檔。
需要將共同部份抽出來變成 `webpack.common.js`、`webpack.dev.js`和`webpack.prod.js`設定檔再用 `webpack-merge` 合併它們。

```shell
npm install --save-dev webpack-merge
```

- webpack.common.js
    - entry
    - output
    - plugins
- webpack.dev.js
    - devtool
    - devServer (or watch)
- webpack.prod.js
    - tree shaking (UglifyJSPlugin)

### [NPM Scripts](https://webpack.js.org/guides/production/#npm-scripts)

需要設定 npm 的 packaeg.json

```javascript
"scripts": {
    "start": "webpack-dev-server --open --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
},
```

### [Minification](https://webpack.js.org/guides/production/#minification)

縮小燈的各種選擇，不管你選擇哪一種，請記得會有「消除 dead code」的功能。

- [`UglifyJSPlugin`](https://webpack.js.org/plugins/uglifyjs-webpack-plugin)
- [`BabelMinifyWebpackPlugin`](https://github.com/webpack-contrib/babel-minify-webpack-plugin)
- [`ClosureCompilerPlugin`](https://github.com/roman01la/webpack-closure-compiler)

### Source Mapping[](https://webpack.js.org/guides/production/#source-mapping)

鼓勵在產品 code 使用 source mapping 的功能。

webpack.prod.js

- `devtool: 'source-map'`
- plugins `UglifyJSPlugin({sourceMap: true})`

### [Specify the Environment](https://webpack.js.org/guides/production/#specify-the-environment)

內建的套件 [`DefinePlugin`](https://webpack.js.org/plugins/define-plugin) 設定環境變數，讓 dev 模式可以寫條件編譯

```javascript
if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}
```

### [Split CSS](https://webpack.js.org/guides/production/#split-CSS)

使用[ExtractTextWebpackPlugin](https://webpack.js.org/plugins/extract-text-webpack-plugin)可以分離 CSS 檔

### [CLI Alternatives](https://webpack.js.org/guides/production/#cli-alternatives)

使用 command line interface 也可以達到某種程度的效果

```shell=
--optimize-minimize
```
包含 `UglifyJSPlugin`

```shell=
--define process.env.NODE_ENV="'production'"
```
包含 `DefinePlugin`

```shell=
webpack -p
```
包含上述兩個
