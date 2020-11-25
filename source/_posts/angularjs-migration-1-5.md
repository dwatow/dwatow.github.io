---
title: angularjs-migration-1.5+
date: 2020-11-25 17:19:23
tags:
categories:
---
# AngularJS 遷移 controller 到 component

## 將 controller 改寫成 component

這個改變，大約在 AngularJS 1.5 版出現。
也是前端框架的大變動時代。

由於有了 component 的概念，也前端也引進封裝的技術，期待可以做到將 HTML/CSS/JS 打包成一包，放在任何網站都不會跑版。

### 先整理元件

```bash
./src/
├── route/
│   └── index.js
├── pages/
│   └── map/
│       ├── map.html
│       ├── view.html
│       └── advanced-search.html
└── js/
    └── map/
        ├── map.js
        ├── view.js
        └── advanced-search.js
```

**html**

```htmlmixed=
<div ng-show="MCtrl..." class="container mb-15" style="position:relative;">
  <div ng-show='!Ctrl.showAdvencedSearch' class="">
    <!--  中間略  -->
    <map-view></map-view>
    <advanced-search></advanced-search>
  </div>
</div>
```

在 controller 寫法中最讓人覺得麻煩的，就是 不同層的 controller 會交疊在一起，在 html 上多層次的呈現，使用者互動是跨 controller 的。但是這也增加了維護上的困難，因為其實人在理解畫面時，並不是這樣的想法，而是現代前端框架使用的 component 的概念，AngularJS 也在後來的版本跟了這個寫法，今天就是要介紹要怎麼改寫成 component 的寫法。

**javascript**

```javascript=
import angular from 'angular';
import './view';
import './advanced-search';

(function() {
  var app = angular.module("map", ["view","advanced-search"]);
  app.controller("mapController", mapController);
  mapController.$inject = ["$scope", "authService"];

  function mapController($scope, authService) {
    // 中間略
  }
})();
```

AngularJS 自帶「相依模組管理」，可以在前端做相依模組的設定，但是整個專案變成 webpack 時，就必須在後端做相依模組管理，這個必須在 AngularJS + ESM(或 CommonJS) 的做法重疊的情況，又該怎麼做呢？

**route**

```javascript=
import angular from 'angular';
import ngRoute from 'angular-route';

export default angular.module('route', [ngRoute])
  .config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
  $locationProvider.hashPrefix('');
  //登入
  $routeProvider
  // 中間略
  .when('/map', { //地圖顯示頁面
    template: require('../pages/map/map.html'),
    controller: 'mapController as Ctrl'
  })
  // 中間略
  .otherwise({
    redirectTo: '/'
  })
}])
```

## 先整理沒有相依模組的 code


因為我們要做成 component 所以最後會將檔案整理在一起。
**一次整理一組，不要一口氣做全部。** 確保每一步都是正確的

```bash
./src/
└── components/
    ├── map/
    │   ├── index.html
    │   └── index.js
    ├── view/
    │   ├── index.html
    │   └── index.js
    └── advanced-search/
        ├── index.html
        └── index.js
```

**javascript**

```javascript=
import angular from 'angular';
import template from './index.html';

export default angular.module("map", [])
  .component('map', {
    template,
    controller,
    controllerAs: 'Ctrl',
    bindings: {
      isShow: '<'
    }
  }).name;

controller.$inject = ["$scope", "authService"];

function controller($scope, authService) {
  // 中間略
}
```

1. html 移到相同目錄，並用 ESM 引入成 template。(webpack 要安裝 [html-loader](https://www.npmjs.com/package/html-loader))
2. controller 內容不變，只有將命名改成 controller。
3. 將 `angular.module` 後面的宣告的 `controller` 改寫成 `component`
  - module 和 component 的名稱相同 (只是保持慣例，語法允許不同)。
  - 為了和原本的 template 相容要設定 `controllerAs: Ctrl`
  - 為了隔離 scope ，無法在 template 使用 MCtrl ，要將它設定成傳入的變數 `isShow`

> 注意:
> `angular.module("map", [])` 中 module method 的第二個參數，在沒有相依模組的情況之下，還是要給一個空陣列。

**html**

```htmlmixed=
<div ng-show="Ctrl.isShow" class="container mb-15" style="position:relative;">
  <div ng-show='!Ctrl.showAdvencedSearch' class="">
    <!--  中間略  -->
    <map-view></map-view>
    <advanced-search></advanced-search>
  </div>
</div>
```

由於目前是由 controller 控製渲染，所以要把 MCtrl 改成 Ctrl，並且將 `MCtrl...` 移到正確的位置。

**route**

```javascript=
import angular from 'angular';
import ngRoute from 'angular-route';

export default angular.module('route', [ngRoute])
  .config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
  $locationProvider.hashPrefix('');
  //登入
  $routeProvider
  // 中間略
  .when('/map', { //地圖顯示頁面
    template: `<map is-show="MCtrl..."></map>`
  })
  // 中間略
  .otherwise({
    redirectTo: '/'
  })
}]).name;
```

因為此 component 會跟著 route 變化而使用，所以使用於 route
route 會變化相對應的 html 出來，讓 AngularJS 呼叫相對應註冊好的 component。
所以，在 route 中，呼叫 template 的名稱 `<map is-show="MCtrl..."></map>` 要和 component 定義的一樣。
而 `MCtrl....` 在這一層將它的執行結果傳給 map 的 isShow。

## 相依設定

由於上述程式碼，要引入至根元件中。


**main.js**

原本的寫法

```javascript=
import angular from 'angular';
import router from '@/route';

import './js/v2/map/map.js';

angular.module('MainApp', [
  router,
  "map"
])
```

改寫成

```javascript=
import angular from 'angular';
import router from '@/route';

import map from './component/map';

angular.module('MainApp', [
  router,
  map
])
```

引用時，會引入該 component 的名稱。相容於 AngularJS 的相依設定。
記得將舊的刪除，避免相同名稱重複註冊。

## 結語

這樣的改寫可以將 AngularJS 專案，更接近於現代前端框架的邏輯，在專案的遷移任務中，可以「修改更少，每一步更穩定」
在尚未移到新專案中，也可以先看看 scope 的切割是否適合遷移到新的框架中。
