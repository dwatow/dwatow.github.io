---
title: 前端新手村 CSS 簡單 Selector (上篇) & Groups
date: 2017-12-21 07:30:03
tags: ["2018鐵人賽", "Selector", 'CSS']
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# CSS 簡單 Selector (上篇)

## CSS Selector

> Selectors are patterns that match against elements[^1]
>
選擇器是一種樹狀元素匹配的 Pattern，可以高效率的選取 HTML 和 XML 節點。

**運作原理[^1]**
```
expression ∗ element → boolean
```
expression: 指的是你的選擇器
element: 指的是選中的 HTML / XML 節點
兩者相乘，指的是「邏輯 AND 」兩者都要 `true`，最後才是 `true`

透過一種 STSS[^2] 的機制，決定 Selector 的運作。

**大小寫？**
CSS 的 Selector 語法不區分大小寫

**新手要注意**

許許多多的選擇器，可以幫助我們降低工作量，將所有的選擇器都看過一輪並且有印象(不用硬背起來)，是初學首要任務之一，原因在於當你需要時是否可以知道「Selector 是否辦得到」，至於實作細節或關鍵字，再查就好了無需死背。(除非要靠這個考高中 or 大學)

## 簡單 Selector

我們從最簡單的 Selector 開始介紹。
各式各樣的 Selector ，順便再介紹有趣的應用。

```html
<div class="chrisClass1 chrisClass2" id="chrisId"></div>
```

如果要選到上面的 HTML element，我們可以怎麼選。

1. universal selector
    - `*` 選到任何的 HTML elements
1. type selector
    - `div` 選到相同 html tag name 的 HTML elements
1. class selector
    - `.chrisClass1` 選到擁有相同 class 的 HTML elements
    - `.chrisClass2`
1. ID selector
    - `#chrisId` 選到相同 id 的 HTML element

初學，最主要先學 1~4
屬性選擇器就有空再學就好了。

換個例子

![](https://i.imgur.com/Bfa0BEO.png)

5. attribute selector
    - Attribute presence and value selectors
        - `[type]` 只要有這個屬性
        - `[type=text]` 要有屬性，值等於 `val`
        - `[class~=border]` 要有這個屬性，值以空白隔開，其中一個值是 `border`
        - `[class|=color]` 要有這個屬性，值以空白隔開，其中一個值開頭 `color-`
    - Substring matching attribute selectors 關鍵字吻合
        - `[class^='color']` 要有這個屬性，第一個值以 `color-blue` 前綴開頭
        - `[class$='margin-top-10']` 要有這個屬性，最後一個值以 `margin-top-10` 後綴結尾
        - `[class*='border']` 要有這個屬性，值包含 `border` 關鍵字


## ID Selector 在 JavaScript 無需再宣告

有個特別的現象，會發生在 id 選擇器。

```html
<div id="abcde"></div>
```

直接在 console 執行 JavaScript

```javascript
console.log(abcde)  //<div id="abcde"></div>
```

無需再宣告！這是一個有趣的現象。
而且每個 id 名稱在每一頁，不能重複。
就像是變數命名一樣，所以通常 id 是留給 js 用的。
(不過 js 還是有在用 class ，CSS 還是有在用 id 的)

CSS 還是會建議以 class 優先使用。
原因是「大多數的 CSS 修改不具備畫面唯一性」。

## Groups of Selectors

可以使用`,`符號，將 Selector 串起來，這是將 Selector 組成群組 (Group)。

```CSS
*, .className {}
#id, .className {}
```

它並沒有任何在 DOM 樹上的關係連結符號，只是單純的將各式各樣的 Selector 連起來，共用 Ruleset

還有其它的 Selectors ，接下來再慢慢介紹

# 參考資料

[^1]: [Selectors Level 3 - w3.org](https://www.w3.org/TR/CSS3-selectors/)
[^2]: [Simple Tree Transformation Sheets 3 - w3.org](https://www.w3.org/TR/NOTE-STTS3)
