---
title: vue-computed-watch
date: 2017-08-28 11:16:41
tags: ['vue','computed','watch']
categories: '技術心得'
---

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

### watch使用時機

如果`data`有某些連動修改的邏輯，就放在`watch`裡，整個呼叫方式是一種「仿data」的感覺。
一模一樣的程式碼可以觸發`watch`的執行

### computed使用時機

如果，有一些畫面邏輯，需要為該畫面設計出來，呼叫方式又和`data`一樣。
就是一種「如果有這欄位的話，那該有多好哇」的想法出現了，就是`computed`該上場的時候了。

設計好的呼叫方式，也是一種「仿data」的感覺。
像是新增加的新欄位，可以觸發`computed`的執行。



> 以上是不負責任的....新手小小心得。
