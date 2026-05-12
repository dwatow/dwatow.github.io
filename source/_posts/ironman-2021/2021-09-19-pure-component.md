---
title: pure component
date: 2021-09-19 00:00:00
tags:
  - 13th鐵人賽
  - vue.js
  - javascript
categories:
  - Vue.js 進階心法
source_url: https://ithelp.ithome.com.tw/articles/10267499
---

在寫 Vue.js 或 React 的過程，一定都會聽過這個名詞。  
並不是所有的 component 都必須 pure ，不是這樣的，是有時候會需要 pure 有時候不需要，重點是開發者是不是可以掌握「我現在要不要 pure」而不是靠本能 pure。

## 快速複習 pure function 的重點

在 pure function 這個專有名詞中，我們獲得兩個重點

1.  輸出只和輸入有關
2.  沒有 side effect

也就是說，如果 component 也可以做到一樣的效果，不是 pure 至少也要「等效 pure」。

## 輸出輸入

Vue.js 在 component 的語法中，我認為輸入可以指 props，輸出可以指 event。

-   [components props](https://vuejs.org/v2/guide/components-props.html)
-   [components custom events](https://vuejs.org/v2/guide/components-custom-events.html)

從這個角度切入的話，要符合「輸出只和輸入有關」可以翻譯成「**event 只和 prop 有關**」(請畫重點。XDD)

而且在純 FP 的情況之下 ，是不會宣告變數的，所以盡可能的在 pure component 裡面，不要使用 data ，雖然大多數的情況之下，都是可以**用 computed 來取代不被修改的 data**，但還是有畫面邏輯需要的例外狀況。

重點:

1.  event 只和 prop 有關
2.  用 computed 來取代不被修改的 data

> 就算你用 slot 這個定義依然沒有矛盾。因為 slot 的 props 會接到另一個 component 的 props。

## Side effect

一般來說，就是不使用 props ，但可以取得資料的做法。

基本的常見情況

-   在 component 裡直接存取 vuex 的資料。 -> Side effect
-   在 component 裡打 API 取得資料。 -> Side effect
-   在 compenent 裡存取 cookie、localStorage。 -> Side effect
-   在 compenent 裡存取檔案。 -> Side effect

有些較難判斷的

-   在 compenent 裡存取 $route -> 算是全域變數 Side effect
-   在 compenent 裡存取 import 進來的可變資料 -> 通常是 Singleton 算是全域變數 Side effect
-   在 compenent 裡 (使用 $ref) 存取 DOM 上的資訊當資料 -> 算是存取文件 Side effect

相信還有很多其它的狀況，像是使用 canvas 還是 maps 都是很難判斷的情況，所以一開始不要用這個來練習。

## 誰該 pure

在 vue-cli 工具幫我們建置好的專案目錄中，有一個 views 和 component 兩個地方可以放 `.vue` 檔。初學的時候，只知道要放**重複使用的 component**，其實真正的意思是放「pure component」唯有 pure 才「好用 (方便重複使用)」，但也因為 pure 不適合由這個 component 決定資料是誰。

反而是由另一個目錄 views 的 `.vue` 檔來決定要載什麼資料，在 views 裡的 `.vue` 檔，引用 pure component 決定「要怎麼處理、呈現資料」，**什麼 type 的資料，就選用相對應的 component 處理** (重要！要畫重點)。

## 萬一不 pure

其實就不 pure 而已，並不是一定要遵守這個原則，只是照著嚴格理論有它的優點，但**並不是要記教條**。沒有 pure 其實就沒有而已。哈哈~~ 維護上麻煩一點，寫的時候小心就可以了。

但是，要是有一絲絲的可能，可以完美的接近嚴格理論，我願意遵守。
