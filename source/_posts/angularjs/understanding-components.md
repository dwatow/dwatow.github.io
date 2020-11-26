---
title: 翻譯 Component - AngularJS 開發指南
date: 2020-11-26 11:30:36
tags:
- angularjs
- angular1
- component
categories:
- 翻譯
---
# 翻譯 Component - AngularJS 開發指南

[原文: AngularJS: Developer Guide: Components](https://docs.angularjs.org/guide/component)

## CONTENTS

>Creating and configuring a Component
Comparison between Directive definition and Component definition
Component-based application architecture
Example of a component tree
Components as route templates
Intercomponent Communication
Unit-testing Component Controllers

在 AngularJS, Component 是一種使用簡易組態 (config) 的 directive 。適合用在 component-base 應用的結構。

更容易用類似 Web Component 或新的 AngularJS style 的架構製作網站。

優點

- 比 directives 更容易設定組態
- 合理的預設值 & 最佳實踐
- 最佳化 components-base 架構
- components 的寫法更容易升級到 Angular

不推薦理由

- 編譯和 pre-link 執行操作的 directives
- 使用 directive 的進階定義選項 像是 priority, terminal, multi-element
- 要透過 attribute 或 css class 觸發 directive

## Creating and configuring a Component

可以用 AngularJS module (由 `angular.module()` 回傳)的 `.component()` 註冊 Components
這個 method 有兩個 arguments

- Components 的名字
- 組態物件 (注意，不像是 `.directive()` ，這個 method 沒有 factory 功能)

```htmlmixed=
<hero-detail hero="ctrl.hero"></hero-detail>
```

```javascript=
angular.module('heroApp')
.component('heroDetail', {
  template: `<span>Name: {{$ctrl.hero.name}}</span>`,
  bindings: {
    hero: '='
  }
});
```

## Comparison between Directive definition and Component definition

比較 Component vs Directive

||Directive| Component|
|-|-|-|
|bindings|無|有 (binds controller)|
|controller| 有 | 有 (預設 `function () {}`) |
|controllerAs | 有 (預設 `false`) | 有 (預設 `$ctrl` )|
|require|無|有|
|template|有|有, 可相依注入|
|templateUrl|有|有, 可相依注入|
|transclude|有(預設`false`)|有(預設`false`)|
|
|bindToController|Yes
|compile function|Yes
|link functions|Yes
|multiElement|Yes
|priority|Yes
|replace|Yes
|restrict|Yes
|templateNamespace|Yes
|terminal|Yes

## Component-based application architecture

如前所述，component helper 有助於用簡單的 component-base 架構你的應用程式。但是 component helper 在建構一個 componet 時，還額外做了哪些事？

- **Components 只控制自己的 View 和 Data**
  Components 應該從來都不要修改自己 scope 以外的 data 或 DOM。一般而言，AngularJS 可以透過強化 scope 和 watches 修改整個程式裡的任何資料。這很好用，但也導致修改應用程式的資料混亂不清的問題。這也是為什麼 component 使用 isolate scope，所以操作整個 scope 的類別是不可能的。
- **Components 有明確的對外 API - 輸入和輸出**
  然而，scope 只隔離到這裡，因為 AngularJS 使用 two-way binidng。所以如果傳入一個物件進 component 像是 `bindings: {item: '='}` ，並且在 component 裡修改它的 property，修改會反射到 component 外層(原本那層)。對 components 來說，只有擁有 data 才可以修改它，更易於除錯。因此， components 要遵守一些簡單的約定:
    - 輸入使用 `<` (one-way) 和 `@` (string) bindings。
    `<` 從 1.5 版出現，不同於 `=` ，在 components scope 裡綁定屬性，不被 watched ，意思是你指定新的值在 component scope ，不會更新到外面這一層。
    但請注意，內外 scope 參考的是相同的物件，所以如果在 component 裡改變了物件屬性或陣列元素，外層會反射出修改結果。原則上，永遠不要修改 component scope 裡的物件或陣列內容。
    傳入字串可以使用 `@` ，尤其是不會改變這個值時。
    - 用 `&` bindings 實現 Output 當作 components 的 callback。
    反而不是操作 Input Data，component 呼叫正確的 Output Event 改變資料。以 deletion 來說，意思是 component 不刪除 hero 自己，但是用正確的 event 傳給 owner component ，用 hero 當變數。
    ```htmlmixed
    <!-- note that we use kebab-case for bindings in the template as usual -->
    <button ng-click="$ctrl.onDelete({hero: $ctrl.hero})">Delete</button>
    ```
    - 用這個方式，外層的 component 可以決定 event 回傳值回來之後，還要做什麼。
    ```xml
    <editable-field on-delete="$ctrl.deleteHero({hero})"></editable-field><br>
    ```
    ```javascript
    // ES6 class
    deleteHero (result) { //result ={ hero }
      this.$http.delete(...).then(() => {/*...*/};
    }
    ```
- Components 有明確的 lifecycle:
    每一個 component 可以實作 lifecycle hooks。這些 methods 會在 component 生命週期中的特定時間點被呼叫。下列這些 hook methods 可以實作:
    - `$onInit()` 完成 bindings 初始化時。在 directives 的 pre & post linking 之前。
      初始化你的 controller 的好地方
    - `$onChanges(changesObj)` 每當 one-way binding 更新時，`changesObj` 就是改變前後的差異
    - `$doCheck()` 每個 hook 呼叫之後會呼叫它，提供檢測和處理更改的機會。
    - `$onDestroy()` 銷毀 controller 和它的 scope 時，用在釋放資源。
    - `$postLink()` controller 的元素和它的 children linked 完時。在這時可以操作 DOM ，類似 Angular 的 `ngAfterViewInit` 或 `ngAfterContentInit`

透過實作這些 method 你可以參與你的 component 的生命週期。

- 應用程式是樹狀的 component:
    理想情況，整個應用程式應該是一個實現明確定義的輸入和輸出的組件樹，並最小化雙向綁定。可以更容易地預測數據何時發生變化以及組件的狀態。


## Components as route templates

Components 也可以用在 route 的 `template` (以 `ngRoute` 為例)。在 component-base 的應用程式 ，每一個 view 都是一個 component:

當使用 `$routeProvider` ，你可以避免一些重複的寫法 (boilerplate)，透過解析 route 相依直接傳遞給 component。從 1.5 版開始，ngRoute 自動解析 route scope 指定給 `$resolve` (你也可以用 `resolveAs` 改變它)。當使用 component ，你可以利用此功能直接傳遞 component，無需另外指定 controller。

換句話說(上面如果看不懂)，指的是透過 route 的 resolve 功能，可以直接給 component binding 的變數內容。


**home.js**

```javascript
const home = angular.module('home').component('home', {
  template: '<h1>Home</h1><p>Hello, {{ $ctrl.user.name }} !</p>',
  bindings: {
    user: '<'
  }
}).name;
```

**route.js**

```javascript=
const route = angular.module('route', []).config(function($routeProvider) {
  $routeProvider.when('/', {
    template: '<home user="$resolve.user"></home>',
    resolve: {
      user: function($http) { return $http.get('...'); }
    }
  });
}).name;
```

**main.js**

```javascript
import route from './route.js'
import home from './home.js'
angular.module('myMod', [route, home])
```
