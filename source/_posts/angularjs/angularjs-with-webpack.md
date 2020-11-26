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

```javascript=
var gulp = require('gulp');
var concat = require('gulp-concat');
var gulpLivereload = require('gulp-livereload');

gulp.task('all', () =>
  gulp
    .src(['./js/**/*.js','./app.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./'))
    .pipe(gulpLivereload()));

gulp.task('watch', () => {
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

**config**
在 webpack.config.js 中的 outputFileName 設定。

原本由 Gulp 將 `*.js` 編成 `all.js`
改成用 Webpack 編出 `all.js`

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

然後開始 try-error 的看看頁面是不是有正常運作。
下面是我遇到的一些問題，提供當案例參考。

## 開始一一解決問題

### 模組相依順序

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
重新整理整個 project 的 javascript 檔的相依關係。

(不知道要不要刪掉，確定完再來刪)

**example**

```javascript
require('./module1');   // 增加這幾行
require('./module2');   // 增加這幾行
require('./module3');  // 增加這幾行

angular.module("module", ['module1', 'module2', 'module3']);
```

### 立即時執行函數前的 `require` 要加分號

錯誤訊息

:::danger
Uncaught TypeError: \_\_webpack_require__(...) is not a function
:::

原本的寫法若是立即執行

```javascript=
(function() {
  var app = angular.module("//...
  //...
})();
```

前面加上 `require()` 後，要記得加分號 `;`

```javascript=
require('module1'); //沒問題
require('module1')  //出問題

(function() {
  var app = angular.module("//...
  //...
})();
```

### JS 套件相依順序

使用 bower 的套件要改用 npm 安裝。(注意版本)
原本使用 html script tag 的方式引入，都要改由 javascript 的 `require()` 的方式引入。

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

## 修正 router

網址是否樣子一樣？

### angular-router 的 hash 設定


**原本的網址**

```
https://host.name/#/hash
```

**出錯的網址**

```
https://host.name/#!/hash
```

**解決方式**

加入 `$locationProvider` 處理網址[^router]

```javascript=
angular.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  //...
}])
```

[^router]: [Webpack with angular route configuration - browser has valid config, cant resolve file - Stack Overflow](https://stackoverflow.com/questions/48083126/webpack-with-angular-route-configuration-browser-has-valid-config-cant-resolv)

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


## 模組劃分

### controller -> component 的 bindings 變數初始化問題

錯誤訊息

:::danger
TypeError: Cannot read property 'value' of undefined
:::

```javascript=
angular.module("dataTable", []).component("dTable", {
  //...
  controller: myController,
  bindings: {
    init: '<',
    //...
  },
  //...
});

function myController (/* ... */) {
  //...
  this.init.value //error
  //...
}
```

簡單的說就是 component 裡 `bindings` 的變數，並沒有在 controller function 的 `this` 裡。

**解決方式**

在 AngularJS 的 component 裡，`bindings` 的變數，必須要等 `$onInit` 時期，才會建構完成。

所以，有關 `bindings` 變數的操作都要放到 `$onInit` 裡~~，至於為什麼之前可以跑，我就不知道了~~，之前可以跑的原因，是因為 controller 並沒有 lifecycle 所以將 controller 這個 function 跑完就執行變數初始化。

```javascript=
function myController (/* ... */) {
  //...
  this.$onInit = function () {
    this.init.value
  }
  //...
}
```
## 時間格式問題

https://stackoverflow.com/questions/30537886/error-ngmodeldatefmt-expected-2015-05-29t190616-693209z-to-be-a-date-a

原本就有的 bug 暫不處理

## alasql 和 xlsx 的問題

這個問題，發生在已加上 alasql 套件相依的檔案上，而且還有使用 XLSX 的 alasql 語法。

錯誤訊息

:::danger
```
angular.js:15536 Error: Please include the xlsx.js library
    at getXLSX (alasql.js:4299)
    at Object.alasql.into.XLSX (alasql.js:17035)
    at alasql.Query.eval [as intoallfn] (eval at yy.Select.compile (alasql.js:NaN), <anonymous>:3:33)
    at queryfn3 (alasql.js:7179)
    at queryfn2 (alasql.js:6917)
    at Object.eval [as datafn] (eval at <anonymous> (alasql.js:NaN), <anonymous>:3:57)
    at eval (alasql.js:6865)
    at Array.forEach (<anonymous>)
    at queryfn (alasql.js:6861)
    at statement (alasql.js:8009) "Possibly unhandled rejection: {}"
```
:::

要先知道， alasql 本來就有相依性於 xlsx

![](https://i.imgur.com/rcskWY0.png)

**alasql 本身有個 bug**

以 browser 執行環境為例!!

下面的 `getXLSX()` 一直都會 return `null`

```javascript=
var getXLSX = function() {
  var XLSX = alasql["private"].externalXlsxLib;

  if (XLSX) {
    return XLSX;
  }

  if (utils.isNode || utils.isBrowserify || utils.isMeteorServer) {
    /*not-for-browser/*
    XLSX = require('xlsx') || null;
    //*/
  } else {
    XLSX = utils.global.XLSX || null;
  }

  if (null === XLSX) {
    throw new Error('Please include the xlsx.js library');
  }

  return XLSX;
};
```

這一段程式碼出了問題，所以造成無法順利運作
目前尚未有好的解決方案。

不過有找到臨時解決方式[^alasqlbug]，我自己是以下面的步驟解決

**安裝**

[^alasqlbug]: [Webpack, Browserify, Vue and React (Native)](https://github.com/agershun/alasql#vue)


如果要用 alasql + xlsx 的話，一定要另外自己安裝 xlsx 套件。

```shell
$ npm install --save alasql xlsx
```

> 關於 xls 的套件，非常多。
有 xls, xlsjs, js-xlsx ... 太多啦！這些是我誤以為而安裝上去的

**webpack.config.js**

```javascript=
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './')
    }
  }
```

**using alasql 的檔案.js**

```javascript
import alasql from '@/alasql';
```

**/alasql/index.js**

```javascript=
import alasql from 'alasql';
import XLSX from 'xlsx';

alasql.utils.isBrowserify = false;
alasql.utils.global.XLSX = XLSX;

export default alasql;
```

重點是在使用時，強制設定。

```javascript
alasql.utils.isBrowserify = false;
alasql.utils.global.XLSX = XLSX;
```

只是我把它集中起來，要使用時，再宣告 `import alasql from '@/alasql';`


## Webpack 編 prod 不會動, dev 正常

沒有錯誤訊息

**現象描述**

用 webpack 編譯 prod 之後，開啟頁面，發現從登入頁登入之後， menu 會改變，而 登入畫面不會被替換成其它的頁面內容。

**初判**

反反覆覆測試之後
1. menu 的顯示與否是用 API 回傳值控制 `ng-show`
2. 登入畫面內容，是由 `ngView` 渲染

```xml=
<body>
  <!-- <ng-include src="'./partial/navbar.html'"></ng-include> -->
  <!-- ngInclude: -->
  <ng-include src="'./partial/navbarByFunc.html'" class="ng-scope">
    <!-- menu -->
  </ng-include>
  <!-- ngView: -->
  <div ng-view="" class="ng-scope">
    <!-- form -->
  </div>
</body>
```

### 找線索

懷疑過

- 是不是 webpack 的設定不正確
- 是不是 babel 的設定不正確，或者要加更多的套件？

當然，這就花了很多時間排除

在茫茫大海中，無意間改改下面這段程式碼...(沒錯！單純的只是基於操 code 看不順眼想修改)

```javascript=
angular.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/',{/*...*/})  // 剛進網站 要進入登入頁

  var originalWhen = $routeProvider.when;
  $routeProvider.when = function(path, route) {
    // 重新寫一個 when 並且呼叫原本的 when
    return originalWhen.call($routeProvider, path, route);
  };

  /* other route*/
  $routeProvider.when (/* ... */)
  //...
}]);
```

4~12 行可以和 29 行合併成這樣寫

```javascript
$routeProvider.when (/* ... */).when().when()//...
```

但是竟然改變了出錯的行為

**發現新線索**

開新的畫面，除了 menu 之外，畫面其它的地方都空白
仔細觀察發現 `ngView` 並沒有渲染任何東西。

```xml=
<body>
  <!-- <ng-include src="'./partial/navbar.html'"></ng-include> -->
  <!-- ngInclude: -->
  <ng-include src="'./partial/navbarByFunc.html'" class="ng-scope">
    <!-- menu -->
  </ng-include>
  <!-- ngView: -->
</body>
```

## 整理線索

1. 發現從登入之後，登入畫面出錯(不會被替換成其它的頁面內容) -> 登入後，的 `ngView` 不渲染
2. 整理 route 的 code 出錯方式不同，原本是登入畫面的地方，變成一片空白 -> 發現 `ngView` 不渲染

route 出問題的機率很高。

## 檢視 route 可能出問題的地方

恢復這段程式成修改前的樣子。

**route.js**

```javascript=
angular.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/', { //暫時放著
    templateUrl: './../pages/login.html',
    controller: 'loginController as Ctrl',
    resolve: {
      validateAuth: [
        'funcService',
        function(funcService) {
          funcService.validateAuth("/");
        }
      ]
    }
  })

  const originalWhen = $routeProvider.when;
  $routeProvider.when = function(path, route) {
    route.resolve || (route.resolve = {});
    angular.extend(route.resolve, {
      validateAuth: function(funcService) {
        return funcService.validateAuth();
      }
    });
    return originalWhen.call($routeProvider, path, route);
  };

  $routeProvider.when('/default', {
    templateUrl: '../pages/default.html'
  })
}]);
```

先看看 `$routeProvider` 的用法[^ref\$routeProvider] ，在此有一個 `resolve` 的進階用法，但是一般的範例的 `resolve` 用法如下[^resolve]

**網路上的範例**

```javascript=
$routeProvider.when("/news", {
  templateUrl: "newsView.html",
  controller: "newsController",
  resolve: {
    message: function(messageService){
        return messageService.getMessage();
    }
  }
})
```

如同官網文件[^ref\$routeProvider]介紹，它是一個 object ，而且是記錄「為特定頁面載入前執行的程式碼」


前面覆寫的 `$routeProvider.when` 的情況也不知道是不是正確的，就先將這些 `resolve` 都註解掉。

### Webpack 的 prod 編出來的 route 就會動了

但是因為被註解掉的 code 沒有運作，所以網站沒有正常執行，但是 route 會其它頁面渲染出來了!!

這真是太振奮人心了!!

接下來就以語法的角度來觀察，這段 code 是在寫些什麼。
它是在換頁面之前，check 帳號的權限 ...

好吧，看起來就是應該放在 route 的 hook 上。
不是什麼特例邏輯，而是每一頁都要執行的程式

AngularJS route 有供什麼 hook，在 AngularJS 裡，它叫 Event[^routeEvent]

它提供了這幾個

- $routeChangeStart
- $routeChangeSuccess
- $routeChangeError
- $routeUpdate

AngularJS 的文件沒有 `$routeChangeStart` 的範例程式，所以另外找了一下[^routeChantgeStartCode]

```javascript=
angular.run(function($rootScope, $location) {
  $rootScope.$on( "$routeChangeStart", function(event, next, current) {
    if ($rootScope.loggedInUser == null) {
      // no logged user, redirect to /login
      if ( next.templateUrl === "partials/login.html") {
      } else {
        $location.path("/login");
      }
    }
  });
});
```

將程式碼搬過去，宣告好。

```javascript=
angular.run(function($rootScope, $location, funcService) {
  $rootScope.$on( "$routeChangeStart", function(event, next, current) {
    funcService.validateAuth(next.originalPath);
  });
})
```
route 就會是依設計上的正常運作。

## 最後

成功 build 出 /dist 的檔案之後，就可以拔掉 gulp 了，剩下的就是設定 webpack 讓它功能正常運作。

[^ref\$routeProvider]: [\$routeProvider - AngularJS](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider)

[^resolve]: [Using Resolve In AngularJS Routes - Ode to Code](https://odetocode.com/blogs/scott/archive/2014/05/20/using-resolve-in-angularjs-routes.aspx)

[^routeEvent]: [\$route - AngularJS](https://docs.angularjs.org/api/ngRoute/service/$route)

[^routeChantgeStartCode]: [Listening on Route Changes to Implement a Login Mechanism Problem](https://fdietz.github.io/recipes-with-angular-js/urls-routing-and-partials/listening-on-route-changes-to-implement-a-login-mechanism.html)
