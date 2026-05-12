---
title: pure function
date: 2021-09-18 00:00:00
tags:
  - 13th鐵人賽
  - vue.js
  - javascript
categories:
  - Vue.js 進階心法
source_url: https://ithelp.ithome.com.tw/articles/10266621
---

## functional programming (後面簡稱 FP，不是 FB)

> 這兩個特性，很重要，我們就依這兩個特性，將 pure function 的定義，轉移到 pure component，在此之前，再看一些關於 pure function 的特性，它到底厲害在哪裡？

老實說，這是一個我在寫 C++ 時完全沒有碰過的東西。之前看別的部門的人用 lambda，我那時還真看不太懂。

不過後來學 JavaScript 時，就正好碰到大 React 時代，遇到不少 FP 的狂熱信仰者討論著 FP 很多很神的特性，以及 FP 的程式設計特有的限制。

還記得 Java 嗎？它是純物件導向程式設計，用它寫程式有它相對應的限制，而這樣的限制伴隨而來的純粹帶來了許多好處。相對的純 FP 也是有一樣的情況，要真正了解這個理論，就必須要了解一下「純」的程式設計究竟有什麼好處，什麼限制，在此就說一下我自己所知道的部份。(可能還有其它的)

**限制**

-   變數宣告只有 arguments ，函數內部不宣告變數。
-   function = pure function
-   寫程式的過程，像是在寫數學證明題一樣

**優點**

-   不會有 side effect
-   不會有未預期的變數被修改

**特色**

-   immutable ，不會有變數被修改，只會取代 (蓋掉)。
-   函數行為可預測，只要輸入改變，輸出就可以預測。

## pure function

在 functional programming 的世界裡，有個特別的東西叫 pure function 。

在在維基百科，有到它們有兩個特性，  
![](/images/9d2a15ed-cvuFtP5.png)

1.  相同的輸入，只會得到相同的輸出。
2.  沒有 side effect

### 回傳值/引數 return value/arguments

```
input -> 邏輯運算 -> output

```

「相同的輸入，只會得到相同的輸出」是什麼意思呢？

以純 FP 來說，這個 function 內部是沒有變數宣告的，所以裡面只有邏輯運算。有變數的地方，只有 argument，也就是說可以把所有的 pure function 變成這樣的關係

```
arguments -> 邏輯運算 -> return value

```

### 副作用 side effective

簡單的說，就是不用 arguments 和 return value 來進行資料流，或者

1.  讀寫檔案、資料庫
2.  全域變數

## impure function (不 pure 的 function)

順便來討論一下「impure function」是什麼。

先說一個比較經典的特例，取亂數

```javascript=
Math.random()

```

這個函數是 pure 的嗎？不是，因為每一次都`沒有輸入，但是每一次的輸出都不一樣`。  
只要任何一個輸出，有相同的輸入，就 impure 了。

> 取得現在的時間也是 impure。

再看另一個例子，計數器

```javascript=
let count = 0;

function counter() {
  return ++count;
}

```
```javascript=
counter() // 1
counter() // 2
counter() // 3

```

函數 `counter` 和取亂數一樣，沒有輸入輸出不同。另外還有一個 impure 的特性，比取亂數更加明顯，就是它有 side effect (事實上 `random` 是靠 side effect 取亂數的)，變數 `count` 對 `counter` 來說，是一種「全域變數」的存在。

難道純 FP 一個無法宣告變數的環境，還會有`全域變數`這種 side effect 嗎？有的

```javascript=
function counter(count = 0) {
  return () => ++count;
}

```
```javascript=
const counter0 = counter(0);

counter0() // 1
counter0() // 2
counter0() // 3

```

使用閉包的手法，就可以為純 FP 的環境，儲存全域變數產生 side effect，counter0 變成了 impure function，有一些語言支援 `static 變數`，其實就像是閉包做到的效果。

## 那和前端框架有什麼關係？

如果你是用 React 就可以直接明白 pure function 和 pure component 之間的關係，因為 React 的 component 有一種就是直接寫個 function 做一次渲染，本身並不記錄 data 的。(雖然後來有 hook 好像就都這樣做)。

那 Vue.js 呢？明天我們就以 pure function 的特性，來看看 Vue.js 怎麼 pure，能有多 pure。
