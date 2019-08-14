---
title: AngularJS 1.5+ Component lifecycle
date: 2019-01-02 10:30:34
tags: 
- angularjs
categories: 
- 技術心得
---

# AngularJS 1.5+ Component lifecycle

## component

在前端框架引入 virtual dom 時，意味著前端工程師有多了幾個必須要知道的觀念。而這個觀念一直延用到了今天。 (vue-cli3 出來的這一年都還適用)

- component input/output of one-way binding
- lifecycle

## AngularJS Binding of Component

AngularJS 使用符號來表達 bindings 的方式。有 4 種方式。

1. `=`
1. `<`
1. `@`
1. `&`

最早，有如魔法般的 two-way binding `=` 。

後期較推崇的 onw-way binding 而希望取消 two-way binding。
所以出現了 `<` + `$onChange()` + `&` 可以做到 two-way binding 的效果。

最後是傳入 `const string` 的 one-way binding `@`

### 以下用一個例子來說說，要怎麼寫 input/output

在 parent 層使用 component

**tabs.html**

```xml
<tab-home text="vm.text" my-touch="vm.onTouch({text})"></tab-home>
```

component 這樣寫

**tabHome/index.html**

```xml
<div id="home">
  <div>Home component</div>
  <div>{{ vm.text }}</div>
  <button type="button" name="button" ng-click="vm.myTouch(vm)">cliek it</button>
</div>
```

**tabHome/index.js**

```javascript
import angular from 'angular';
import template from './index.html';

class controller {
  constructor() {}
}

export default angular
  .module('tabHome', [])
  .component('tabHome', {
    template,
    controller,
    controllerAs: 'vm',
    bindings: {
      text: '<',
      myTouch: '&',
    }
  }).name;
```

### Input of Component

在 parent 層使用 component 時
直接給自訂的 attribute 並且放入參數

```xml
<tab-home text="vm.text"></tab-home>
```

component 這樣寫
使用`<` one-way binding 傳入變數

```javascript
bindings: {
  text: '<',
  //...
}
```

如果需要「連動修改」要記得使用 `$onChanged()`

### Output of Component

使用 component 時，直接給自訂的 attribute
並且放入 function 執行，參數要使用 `{}` 並且在裡面寫下要被傳出來的 property。


```xml
<tab-home my-touch="vm.onTouch({text})"></tab-home>
```

component 這樣寫

指定真實事件觸發的地方，執行傳入的 function name，並且傳入 object 當 component output 的參數

```xml
<button type="button" name="button"
  ng-click="vm.myTouch(vm)">cliek it</button>
```

(在此可以假想像是這樣的 object)

```javascript
vm = {
  text: 'Hi',  <- 這是 parent 層會接收到的變數
}
```


用 `&` binding 傳入 function

```javascript
bindings: {
  //...
  myTouch: '&',
}
```

## Lifecycle

![AngularJS lifecycle](https://i.imgur.com/PXSdTNq.png)


在此簡單的介紹一下

**`$onChanges(changesObj)`**

每當 one-way binding 更新時，`changesObj` 就是改變前後的差異

**`$onInit()`**

完成 bindings 初始化時，用來初始化 controller data 的好地方。
在 directives 的 pre & post linking 之前觸發。

**`$postLink()`**

controller 的元素和它的 children linked 完時。在這時可以操作 DOM ，類似 Angular 的 `ngAfterViewInit` 或 `ngAfterContentInit`

**`$onDestroy()`**

銷毀 controller 和它的 scope 時，用在釋放資源。

較特別的是

**`$doCheck()`**

每個 hook 呼叫之後會呼叫它，提供檢測和處理更改的機會。用來當 watch [^codelord.net]

[^codelord.net]: [Replacing Angular's Deep Watches with the $doCheck Lifecycle Hook - codelord.net](https://www.codelord.net/2016/12/20/replacing-angulars-deep-watches-with-the-%24docheck-lifecycle-hook/)

### 實際執行

以一個 tab 轉換的練習來看看 lifecycle 是什麼時候發生的

![](https://i.imgur.com/9xkn5ZD.png)

相同的練習用 Vue 和 AngularJS 做了一次。並且把 lifecycle 都印出來看，下面的圖左邊是 Vue 右邊是 AngularJS。

**切到 Posts，清空 log 切回 Home**

> AngularJS 使用 `ng-if` 切換觸發完整 lifecycle 的做法

![](https://i.imgur.com/7m6En0B.png) ![](https://i.imgur.com/8dnCSKv.png)

**keep-alive**

> AngularJS 使用 `ng-show` 切換當作是保持不滅的做法

![](https://i.imgur.com/ualJGFb.png) ![](https://i.imgur.com/9Iddhvo.png)

**初始化完，切到 Posts**

把 Archive 嵌到 Posts 裡的 lifecycle 練習

![](https://i.imgur.com/U3snr2d.png)
![](https://i.imgur.com/Y3eklNy.png)

印出巢狀 component 的 lifecycle 狀況

![](https://i.imgur.com/nJfpTOH.png =200x) ![](https://i.imgur.com/kImYRh1.png =200x)
