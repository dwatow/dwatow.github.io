---
title: AngularJS + Gulp → Webpack
date: 2018-12-06 08:58:58
tags: 
- angularjs
- gulp
- webpack
categories: 
- 技術心得
---

# AngularJS + Gulp → Webpack

![](https://i.imgur.com/fW5jyVi.png)

## 源起

目前有許多的舊專案，由於當年很潮人做了很潮的決定，使用了當時唯一首選 AngularJS。
也許種種原因，這個專案後來並沒有健康的跟著長大人與時俱進，到現在跑在 AngularJS 上。

也許是收得不夠所以不想幫專案更新？
也許是覺得大工程，所以接案不用這麼費力的更新這些？
也許，有太多的也許了....

但是這些也許在有一天就是要打破，混沌的世界將會有勇者來.....不對。
這樣的專案累積下來的技術債，要評估你的專案生命週期是否還有維護價值，再決定是否要繼續之後的重構步驟。

## 技術上的現況

目前網路上的 AngularJS 教學，還在教你使用 gulp 和 bower 來進行套件管理與網站相依性管理。也許可以使用 babel 讓你使用新一代的 ES 語法，但是這樣是遠遠不足時代的需求。
就連 [bower 都建議搬家，別再使用 bower 了](https://bower.io/blog/2017/how-to-migrate-away-from-bower/)

這篇來分享「如何將 AngularJS 放到 webpack 上」讓你的專案可以與時俱進，帶你經過困難的第一關!!!

經過這篇，你的 AngularJS 的工具使用如下:

- 套件管理器會使用 npm
- 網站打包工具使用 webpack

就如同現代前端框架的配備一樣先進呢!!!

## 用 npm 安裝 AngularJS

用 npm 安裝 AngularJS[^npmInstall]

在此要加上版號，限制只安裝 AngularJS (最後的版本是 1.7.x)
(安裝 AngularJS 1.5 以上的版本，才可以使用 Component 未來框架的重構會更現代化)

```shell
$ npm install --save-dev angular@1.7
```

[^npmInstall]: [AngularJS 1.x系列：Node.js安装及npm常用命令（1）2.2 npm包管理, npm install：安装包](https://www.cnblogs.com/libingql/p/6910826.html)

## 加入 Webpack

### 了解原本 Gulp 的運作。

先看看你自己的 Gulp 專案上的 task 怎麼設定的
在此，我手上的專案是將所有的 js 檔案串接成 all.js。(之後的 webpack 也是要做這件事)

```javascript
var gulp = require('gulp');
var concat = require('gulp-concat');
var gulpLivereload = require('gulp-livereload');

gulp.task('all', function() {
  return gulp.src(['./js/**/*.js','./app.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./'))
        .pipe(gulpLivereload())
});

gulp.task('watch', function() {
  gulpLivereload.listen();
  gulp.watch("./js/**/*.js", ["all"]);
  gulp.watch("./app.js", ["all"]);
})
```

### 開始 Webpack

安裝 webpack

```shell
$ npm install --save-dev webpack
```

安裝 dev-server

```shell
$ npm install --save-dev webpack-dev-server
```

設定 config

原本由 Gulp 將 `*.js` 編成 `all.js`
改成用 Webpack 編出 `all.js` (設定在 outputFileName)

```javascript
const path = require('path');

module.exports = {
  entry: './entryFileName.js',
  output: {
    filename: 'outputFileName.js',
    path: path.resolve(__dirname, '')
  },
  devServer: {
    contentBase: './'
  },
  mode: "production"
};
```

然後開始 try-error 的看看頁面是不是有正常運作

## 開始一一解決問題

### javascript 檔案的相依性問題


**主要是發生在這樣的 source code**

```javascript=
angular.module('myApp', ['team']);
```
彷彿 angular module 的中括號會失去作用

**瀏覽器 Console 的錯誤訊息**

:::danger
Uncaught Error: [$injector:modulerr]
Failed to instantiate module myApp due to:

Error: [$injector:modulerr]
Failed to instantiate module team due to:

Error: [$injector:nomod]
Module 'team' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.
:::

用 `require('path/controller')` 的相依性管理，將重新管理 `angular.module(name, [controller])` 裡的 `[controller]` 套件
重新建立整個 project 的 javascript 檔的相依關係。

(不知道要不要刪掉，確定完再來刪)

**example**

```javascript
require('./module1');   // 增加這幾行
require('./module2');   // 增加這幾行
require('./module3');  // 增加這幾行

angular.module("module", ['module1', 'module2', 'module3']);
```

### javascript 套件相依性問題

使用 bower 的套件要改用 npm 安裝。(注意版本)
原本使用 html script tag 的方式引入，改由 javascript 的 `require()` 的方式引入。

### angular-route 套件版本匹配問題

錯誤訊息

:::danger
angular.js:15536 Possibly unhandled rejection: undefined
:::

這是一個版本的問題，網路上教學建議使用下面的做法，是不好的[^$qProvider]

[^$qProvider]: [$q: Unhandled rejections should not be stringified #14631](https://github.com/angular/angular.js/issues/14631#issuecomment-267483102)

```javascript
$qProvider.errorOnUnhandledRejections(false)。
```

這個問題是一個已被解決的 bug[^$qBug]

[^$qBug]: [1.6.1 promise-rectification (2016-12-23), Bug Fixes, $q: Add traceback to unhandled promise rejections (174cb4 #14631)](https://github.com/angular/angular.js/blob/v1.6.1/CHANGELOG.md)

**package.json**

原本

```javascript
{
  "angular": "^1.7.4",
  "angular-route": "^1.5.7",
}
```

angular-route 換新版

```javascript
{
  "angular": "^1.7.4",
  "angular-route": "^1.5.11",
}
```

> AngularJS 適用的 angular-route 版本最新就是 1.5.11

### bootstrap 要用的全域 jQuery

錯誤訊息

:::danger
Uncaught ReferenceError: jQuery is not defined
:::

發生在，把下面這段程式

```javascript=
window.jQuery = require('jquery');
```

改成這樣

```javascript=
import $ from 'jquery';
window.jQuery = $;
```

解決方式[^jqueryWebpack]

[^jqueryWebpack]: [ProvidePlugin, Usage: jQuery - webpack](https://webpack.js.org/plugins/provide-plugin/#usage-jquery)

**webpack.config.js**

```javascript=
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      'jQuery': 'jquery'
    })
  ],
}
```

在 config 加上這個可以宣告成全域變數 `window.jQuery`
