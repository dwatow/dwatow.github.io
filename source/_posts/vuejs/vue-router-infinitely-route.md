---
title: vue-router 遇到無窮循環 route
date: 2018-09-21 20:56:32
tags: ["vue-router", "vuejs"]
categories: '技術心得'
---

# vue-router 遇到無窮循環 route

## 源起

錯誤訊息並不是指向自己的程式碼
而是指向框架的錯誤

所以，算是一個不直覺處理的 bug

## 錯誤訊息

**截圖**

![](https://i.imgur.com/6DRZcKB.png)

**文字**

webpack-internal:///./node_modules/regenerator-runtime/runtime.js:288

:::danger

```
Uncaught (in promise) RangeError: Maximum call stack size exceeded
    at Generator.invoke [as _invoke] (webpack-internal:///./node_modules/regenerator-runtime/runtime.js:288)
    at Generator.prototype.(:8080/anonymous function) [as next] (webpack-internal:///./node_modules/regenerator-runtime/runtime.js:114:21)
    at step (webpack-internal:///./node_modules/babel-runtime/helpers/asyncToGenerator.js:17)
    at eval (webpack-internal:///./node_modules/babel-runtime/helpers/asyncToGenerator.js:35)
    at new Promise (<anonymous>)
    at new F (webpack-internal:///./node_modules/core-js/library/modules/_export.js:36)
    at eval (webpack-internal:///./node_modules/babel-runtime/helpers/asyncToGenerator.js:14)
    at eval (webpack-internal:///./src/router/index.js:204)
    at iterator (webpack-internal:///./node_modules/vue-router/dist/vue-router.esm.js:1943)
    at step (webpack-internal:///./node_modules/vue-router/dist/vue-router.esm.js:1717)
```

:::

## 搜尋關鍵字

這兩條關鍵字一起搜尋

```
Uncaught (in promise) RangeError: Maximum call stack size exceeded
at step (webpack-internal:///./node_modules/vue-router/dist/vue-router.esm.js:1717)
```

## 發生原因

同時使用 `redirect` 和 `beforEach` 時^[[Vue-router：Uncaught RangeError：超出最大調用堆棧大小](https://forum.vuejs.org/t/vue-router-uncaught-rangeerror-maximum-call-stack-size-exceeded/1994/2)] ，`beforeEach` 的條件沒有設定好，造成無窮 router

下面的例子的執行順序

1. 程式會先執行 `beforeEach` 將程式導回 `/` ，觸發 hash change
2. 再執行 `routes` 裡的 `redirect` 將頁面重新引導到 `/Index` ，觸發 `beforeEach` 回到 1.

```javascript=
var route = new Router({
  routes: [
    {
      path: '/',
      redirect: '/Index',
    },
    {
      path: '/Index',
      name: 'Index',
      component: Index,
    },
    //...
  ]
})

route.beforeEach(async (to, from, next) => {
  if (from.name === null &&
      to.name !== 'Login' &&
      (route.app.$store === undefined ||
       route.app.$store.getters.token.length === 0)) {
         route.push('/')
    }
  //...
}
```
