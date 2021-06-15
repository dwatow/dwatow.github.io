---
title: Vue 的 Component 相關的導讀
date: 2018-04-20 20:27:01
tags:
- vue
- JavaScript
categories:
- 技術心得
---

# Vue 的 Component 相關的導讀

希望有助於初學在看文件時，對於關鍵字有一些初步的概念，看英文文件會比較容易上手或者複習。

## Component 邏輯

1. data: component 的資料，有時是存放「控制 view 的變數」
2. watch: 監聽 data 改變，連動其它 data 改變的行為
3. computed: data 的 setter/getter ，尤其是 getter 使用，當作是新的值
4. methods: 就像是一般的 method 。
5. filter: 修飾 data 的 getter
   - 用法: `data | filter | filter` (由左執行到右)
   - 輸入: method 參數
   - 輸出: method 回傳值
6. mixins: 共用 component 結構的 js object

## Component 生命週期

- created: 出現 data
- mounted: 出現畫面
- updated: data 變動
- destoryed: component 消滅
- keep-alive[^vue-hooks]
  - activated: `keep-alive` 的 component 再生
  - deactivated: `keep-alive` 的 component 消滅

> 關於[生命週期](https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)，還有很多可以關心的
>
> 1. before 上述 hook
> 2. Vue, vue instance, component 的同名 hook 執行先後時機

## Component 傳值

1. tag name: component 名稱，在 parent component 裡宣告時決定
2. attribute:
   - `attr`: 傳字串到 component 裡當常數
   - `:attr`: 傳變數到 component 裡當 `props`
3. event:
   - `v-on:event` 綁定 method 到自訂 event 上
     - `$emit('event', <$event> )`: 在 component 裡事件回傳值的出口
   - `$event`: 從 component 傳出來的回傳值
4. content:

   - `solt`, 無命名 = default
   - 多個 `solt` 可命名指定，也可設定 `solt` 預設內容

<!-- prettier-ignore-start -->
[^vue-hooks]: [Understanding Vue.js Lifecycle Hooks, other hooks](https://alligator.io/vuejs/component-lifecycle/#other-hooks)
<!-- prettier-ignore-end -->
