---
title: AngularJS 1.5+ Component style with es6-class
date: 2018-12-23 20:32:28
tags: 
- angularjs
- webpack
categories: 
- 技術心得
---

# AngularJS 1.5+ Component style with es6-class

![](https://i.imgur.com/64fbzVm.png)

在接手了 AngularJS 的專案到現在，一直在處理寫作風格造成除錯上的困擾。
包含無法完全封裝的 controller + template 的組合，終於可以用 component 打成一包。[^angularjs-component]
而且在一些預設的 (scope之類的) 限制上，也比較容易維護，並且順利的處理掉 route 上，如何使用 component 的寫法。

這一篇就是要介紹，如何將你的 controller 變成 component 而且還要使用 es6 的 class 語法將它變得漂漂亮亮的。
最後還會處理 `$inject` 的相依注入總是要寫兩次的原始框架設定，也終於可以使用套件魔法處理，只要寫一次就可以了。

[^angularjs-component]: [AngularJS 1.5 最佳實務](https://amobiz.github.io/2016/04/15/angularjs-1.5-best-practices/)

## 套件版本

- webpack 4
- babel 7

## controller → component

**javascript**

原本 angularjs 自定 `module` 的寫法是直接接 `.controller()` 指定 controller (function)
換成 component 的寫法，要在 angularjs 自定 `module` 後接著 `.component()` 並且給予一個定義物件，定義 component 的 `template` 和 `controller` 之類的屬性。
建議使用 `controllerAs` 。

```javascript=
angular.module("addReport", [])
.controller("myController", myController);
```

→

```javascript=
export default angular.module("injectName", [])
.component("tagName", {
  bindings: {
    isShow: '<',
  },
  template,
  controller: myController,
  controllerAs: 'Ctrl',
}).name;
```

> injectName 通常會和 tagName 同名。

**templage**

`$ctrl` 就剩下一種了，無法直接使用外部的 ctrl ，但是可以透過 binding 將變數傳進來。

```xml=
<div ng-if="MCtrl.fun" class="container" style="max-width:800px">
  <p><a ng-click="Ctrl.goBack()">返回列表</a></p>
  <report-form report="Ctrl.report" submit="Ctrl.submit"></report-form>
</div> <!--container-->
```

→

```xml=
<div ng-if="Ctrl.isShow" class="container" style="max-width:800px">
  <p><a ng-click="Ctrl.goBack()">返回列表</a></p>
  <report-form report="Ctrl.report" submit="Ctrl.submit"></report-form>
</div>
```

## router

在 route 的 when 裡，只要指定 template，並且填上 component 的使用方式。就包含渲染用的 template ，跑什麼 controller。

不建議使用外部指定的 controller

```javascript=
function route ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');

  $routeProvider
  //...
  .when('/addReport', {
    templateUrl: './addReport.html',
    controller: 'myController'
  })
}
```

→

```javascript=
function route ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');

  $routeProvider
  //...
  .when('/addReport', {
    template: `<tag-name is-show="true"></tag-name>`
  })
}
```

只要把 component 在 html 的使用形式當作 `template`

## binding function

component 要這樣設定的話

```javascript=
binding: {
  onSubmit: '&'
}
```

template 要這樣寫

```xml
<form ng-submit="Ctrl.onSubmit({$event: Ctrl.code})">
...
</form>
```

使用這個 components 要這樣寫

```javascript=
class myController {
  constructor () {}
  sumit(code) {
    // code === Ctrl.code of component
  }
}
```

```xml
<my-form on-submit="Ctrl.submit($event)"></my-form>
```


## controller of component → ES6 class

- 改用 `class` 要注意要先宣告，再 `export`
- 內建相依要在 `constructor` 設定給 this
不要在 `constructor` 做初始化變數的事，改到 `$onInit` 做[^angular-es6-class]

```javascript=
export default angular.module("injectName", [])
.component("tagName", {
  bindings: {
    isShow: '<',
  },
  template,
  controller: myController,
  controllerAs: 'Ctrl',
}).name;

myController.$inject = []

function myController () {
  console.log('constructor')
  this.$onInit = function () {
    console.log('$onInit')
  }
}
```

→

```javascript=
class myController{
  constructor ($routeParams) {
    console.log('constructor')
    this.$routeParams = $routeParams
  }

  $onInit () {
    console.log('$onInit')
    console.log(this.$routeParams.parameter)
  }
}

export default angular.module("injectName", [])
.component("tagName", {
  bindings: {
    isShow: '<',
  },
  template,
  controller: myController,
  controllerAs: 'Ctrl',
}).name;
```

[^angular-es6-class]: [Converting Angular Controllers to ES6 Classes - codelord.net](https://www.codelord.net/2017/05/20/converting-angular-controllers-to-es6-classes/)

## 保持 `$scope.$broadcast` 或 `$scope.$on` 運作

其實 `$scope` 是要被消滅的，但是一時之間不要修改太大的幅度的話，可以先依照下面的建議放置

- `$scope.$on` 是一種事件掛載。放置在 `constructor ()` 裡即可。
- `$scope.$broadcast` 是一種事件觸發。放置位置不要移動，改成 `this.$scope` 的方式使用。

## 想要刪除 `myController.$inject = [...]`

要移除 `$inject` 語法，就要靠 [ng-annotate](https://www.npmjs.com/package/ng-annotate) 套件[^delete-inject]

[^delete-inject]: [Implicit Annotation](https://docs.angularjs.org/guide/di#implicit-annotation)

相依注入的寫法要拿掉，可以說是費了相當大的困難，目前最好的選擇，可以說是 [babel-plugin-angularjs-annotate](https://github.com/schmod/babel-plugin-angularjs-annotate) 這個原生後繼者

安裝

```shell
$ npm install babel-plugin-angularjs-annotate --save-dev
```

在 .babelrc file 加上

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": ["angularjs-annotate"]
}
```

並且! 修改 webpack.config.js 在 babel 的設定，取消排除 `node_modules` 雖然會造成編出來的 all.js 變肥大，不過這是另一個可以被解決的問題。

```javascript
module.exports = {
  entry: {},
  output: {},
  module: {
    rules: [{
      test: /\.js$/,
      //exclude: /(node_modules|vendor)/,
      loader: "babel-loader"
    }]
  }
};

```
