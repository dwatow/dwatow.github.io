---
title: vue的computed和watch比較
date: 2017-08-28 11:16:41
tags: ['vuejs','computed','watch']
categories: '技術心得'
---

# vue的computed和watch比較

最近在學[vue](https://github.com/dwatow/vueExercise)，學到了`watch`和`computed`時，發現它們兩個極像又很難區分。

今天早上騎車時，想到了它們之間的差別了！就趕快來記錄下來。

## 語法差異

在此也順便的比較了`data`和`methods`。
而`watch`在語法上的特性是可以和`data`同名，我自己理解成是掛在`data`的`onchange`事件上的`function`。

|觸發方式|呼叫方式|必須和變數同名?|呼叫|
|-|-|-|-|
|`data`|「變數」被賦值，渲染view|o|`vue.value`|
|`watch`|「同名的變數」被賦值就執行|o|`vue.value`|
|`computed`|「取用的變數」被賦值就執行|x|`vue.xValue`|
|`methods`|被呼叫就執行|x|`vue.value()`|

## 語意上的差異

在使用上，`vue`是一種接api資料之後，再將接到的資料，填入`html`的內容。
所以!!!!先被決定的是接到的「資料欄位」，也就是`data`。

- watch使用時機
  改變`data`時，要非同步執行的函數。
  運算負擔很大時的函數
- computed使用時機
  一種寫`get`、`set`的設計。


> 以上是不負責任的....新手小小心得。
