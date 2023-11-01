---
title: 用 vue 切換 class
date: 2018-04-05 22:26:33
tags:
- vue
- JavaScript
categories:
- 技術心得
---

# 用 vue 切換 class

vue 是一個資料驅動的框架。
所以任何變動都是因資料而改變。

在 jQuery 的時候，常常寫抽換 class 的程式，非常直覺，什麼邏輯之下。把 DOM 的 class 換成另一個，算是一種 bottom up 的設計方式。

但是，在 vue 時，往往要用 top down 的設計方式。要改變 class 要再想想，是改變狀態？還是改變什麼資料？

> 不要想著: 就 class 屬性改變了。
> 因為這樣會把 class 屬性，變成資料的一部份。
> code 自然無法 DRY

## 一個 filter 案例

(由於此案例用來講解 class 的抽換，較為無關的 code 會刪掉)

有一個 filter
![](https://i.imgur.com/OoHfII7.png)

會將 `talks` 依時間過濾後再顯示到畫面上。

以我的理解「每一個按鈕，都是一種 `filter`，只是條件不同，所以算是三個 component」

**parent component**

每一個 component 都有自己的代表的 `status` 和接收一個 parent's status 的 `currStatus`

```html
<div class="talks-filter">
    <talksFilter :currStatus="status" status="all"></talksFilter>
    <talksFilter :currStatus="status" status="showing"></talksFilter>
    <talksFilter :currStatus="status" status="finished"></talksFilter>
</div>
```

**child component**

child 的 class 則是「偵測是否 active」的 `isActive` 。
它是一個 `computed` 回傳整個 class 裡會有什麼 class name[^toggle-class-by-computed]

```html
<template lang="html">
    <div :class="isActive"></div>
</template>
```

在此判斷 parent 的 status 與自己的 status 是否相等。
表示自己是不是被按下。

```html
<script>
export default {
  //...
  computed: {
    isActive () {
      return {
        active: this.status === this.currStatus
      }
    }
  },
  //...
}
</script>
```

## 結論

用 vue 和 jQuery 思維不同。
程式的「本質性問題」不變。不可消除的複雜度 `this.status === this.currStatu` 依然存在，幸運的是，還是可以用 vue 優雅的實現抽換 class。

[^toggle-class-by-computed]: [Class and Style Bindings — Vue.js, Binding HTML Classes, Object Syntax](https://vuejs.org/v2/guide/class-and-style.html#Object-Syntax)
