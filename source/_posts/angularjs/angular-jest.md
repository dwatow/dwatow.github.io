---
title: AngularJS + Jest 實戰
date: 2019-08-14 17:33:58
tags: 
- jest
- angularjs
categories: 
- 技術心得
---
# AngularJS + Jest 實戰

![](https://i.imgur.com/toh1v1q.png)

實做專案: https://github.com/dwatow/AngularJS-demo/tree/jest-demo

一開始，先 git clone repository

```shell
git@github.com:dwatow/AngularJS-demo.git
```

## 測試案例

1. 顯示變數內容到畫面
2. 使用 button 改變變數，同時修改畫面

## 測試初始畫面

有兩個東西可以測

1. binding 進 component 的值
1. `$http` 透過 API 得到的值

binding 進來的值較單純，`$http` 等到測非同步時再來說。

### 測試目標

component 在註冊時，binding 是這樣寫的

**HelloWorld/index.html**

```htmlmixed=
<div class="hello">
  <h1>{{ vm.msg }}</h1>
...
```

**HelloWorld/index.js**

```javascript=
class controller {
  constructor() {
  // ...
  }
}

export default angular.module("helloWorld", []).component("helloWorld", {
  template,
  controller,
  bindings: {
    msg: "<",
  },
  controllerAs: "vm",
}).name;
```

在 App 的使用 helloWorld 方式是這樣

**App/index.html**

```htmlmixed
<hello-world msg="'Welcome to Your AngularJS App'"></hello-world>
```

### 建立測試程式

為了簡化 AngularJS 框架初始在測試程式的程式碼，使用 angularjs-jest [^boilerplate]

[^boilerplate]: [AngularJS and Jest. Three steps to improve your legacy frontend tests, 1. Throw away the cluttered test setup boilerplate](https://blog.softwaremill.com/angularjs-and-jest-three-steps-to-improve-your-legacy-frontend-tests-90674c0017e4)

宣告 AngularJS 和 AngularJS 的 mock 函數[^mock]

[^mock]: [ngMock - AngularJS](https://docs.angularjs.org/api/ngMock)

**test/helloWorld.spec.js**

```javascript=
import angular from 'angular';
import 'angular-mocks';
```

引入要用測試的 module

```javascript=3
import mathservice from '../src/service/mathmodule.js';
import helloWorld from '../src/components/HelloWorld/index.js';
```

引入要用測試的 angularjs-jest

```javascript=5
import { createTestApp } from 'angularjs-jest';
```

引入能在 node 跑類似 jQuery 的功能

```javascript=6
import cheerio from 'cheerio';
```

用 angularjs-jest 初始化。並且將 `$componentController` inject 進測試 app 中。它可以讓我們得到 component 的實體。(不包含 template)

```javascript=7
describe('component: HelloWorld', function () {
  const getTestApp = () => createTestApp({
    modules: [helloWorld, mathservice],
    access: ['$componentController'],
  });
  //...
```

### 寫測試

```javascript=13
  //...
  it('initial render binding msg: should be Welcome to Your AngularJS App', () => {
    const app = getTestApp();
```

直接取得渲染結果，並且將結果載入 `cheerio` 中。
並且測試 `h1` 內的文字是否與 binding 的字是一樣的。
   
```javascript=16
    const element = app.render(`<hello-world msg="'Welcome to Your AngularJS App'"></hello-world>`)
    const $ = cheerio.load(element.html())    
    expect($('h1').text()).toBe("Welcome to Your AngularJS App");
```

取得 controller 程式執行。並且同時設定 binding。
測試 `vm.msg` 內的文字是否與 binding 的字是一樣的。

```javascript=19
    const vm = app.$componentController(helloWorld, null, {
      msg: "Welcome to Your AngularJS App",
    });
    expect(vm.msg).toEqual("Welcome to Your AngularJS App");
  });
```

## 可能的問題: Jest 的 loader

因為 Jest 只吃 JavaScript (和 Webpack 一樣) 所以，有時可以拿 webpack 的 loader 來使用。在此打算使用 html-loader 來載入 html 檔。

安裝 `html-loader-jest` 較方便

```shell
npm install -D html-loader-jest
```

在 package.json 設定 jest 區段
(這是可以設定 Jest 的眾多方法其中之一)

**package.json**

```json=
{
  //...
  "jest": {
    // ...
    "transform": {
      "^.+\\.(js|jsx)$": "babel-jest",
      "^.+\\.html?$": "html-loader-jest",
      // ...
    }
}
```

這樣就可以將載入的 html 檔轉成 JavaScript 的字串。


## 測試互動改畫面

### 修改畫面

目前的測試程式是仿照 vue-cli 產生的畫面。它滿足了第一個測試案例，將變數顯示到畫面上。而第二個測試案例「使用 input」必須要先修改一下，才可以

**HelloWorld/index.html**

```html
<div class="hello">
  <h1>{{ vm.msg }}</h1>
  <p>
    <input type="button" value="change head 1"
      ng-click="vm.changeHead('Chris')">
  </p>
```

**HelloWorld/index.js**

```javascript
class controller {
  //...
  changeHead(msg) {
    this.msg = msg;
  }
}
```

### 寫測試

先將初始字串印出來。

**test/helloWorld.spec.js**

```javascript=
  it('hello world click button change text to Chris', () => {
    const vm = app.$componentController(helloWorld, null, {
      msg: "Welcome to Your AngularJS App",
    });
    expect(vm.msg).toBe("Welcome to Your AngularJS App");
```

再執行 `changeHead()`，`ng-click` 綁定的 function
再測試一次一樣的位置，顯示的內容要改變

```javascript=6
    vm.changeHead('Chris')
    expect(vm.msg).toBe("Chris");
  });
```
:::info
要自行執行 event callback[^runEvent]
:::

[^runEvent]: [Unit-testing Component Controllers](https://docs.angularjs.org/guide/component#unit-testing-component-controllers)

## 測試 service 傳給 component 的值

這一部份就是純邏輯的測試，非常適合 unit test

### 改 component

**HelloWorld/index.js**

加上一個

```javascript=
class controller {
  constructor($log, mathservice) {
    this.$log = $log;
    this.mathservice = mathservice;
  }

  $onInit() {
    this.math = this.mathservice.addTwoNumbers(1, 2);
    this.$log.log(this.math);
  }
}
```

### 寫測試

在取得 componentController 之後，

**test/helloWorld.spec.js**

```javascript=
  it('initial render service data', () => {
    const vm = app.$componentController(helloWorld);
    vm.$onInit();
    expect(vm.math).toBe(3);
  });
```

:::info
要自行執行 lifecycle
:::

## 結論

使用 Jest 測試 AngularJS 

- 沒有一個好的方式可以觸發 event 。
只能直接操作 component 的 event callback 假裝操作了 event。
- 不能自動執行 component 的 lifecycle

angularjs-jest 的 render 功能

- 無法再操作 dom 進行 event 的 trigger。會出現 trigger is not a function 的錯誤。也許是因為執行在 node.js 上面。
不過對於 snapshot 測試初始渲染的來說是一件非常方便的事。因為它會自動執行 `$onInit` 的結果。

下次再來試，怎麼測試 API 傳送的 case
