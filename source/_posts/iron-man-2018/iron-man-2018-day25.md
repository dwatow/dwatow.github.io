---
title: 前端新手村 都市傳說之body範圍
date: 2018-01-04 05:56:41
tags: ["2018鐵人賽", "body", "background", "outline", "border", "html"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# 都市傳說之body範圍

這個問題，來自於幾種現象(好像在講鬼故事)

1. 對 `<body>` 設定 `background` 時
2. 對 `<body>` 設定 `position: relative` 再將內容的元素設定 `position: absolute` ，內容的元素再設定 `bottom: 0` 下邊緣，就會找到 `<body>` 的下邊緣
3. 對 `<body>` 設定 `border` 或 `outline` 可以框出 `<body>` 的四邊

這幾種現象，讓 `<body>` 的大小眾說紛紜。

## 看 HTML5 的 body

從 www.w3.org 的 [HTML5, 4.3.1. The body element](https://www.w3.org/TR/html5/sections.html#the-body-element) [^1]文件中，看不出 body 有針對這部份，有什麼特別解釋的地方。

又找到 dev.w3.org 的 [HTML5](https://dev.w3.org/html5/html-author/#the-body-element) 裡面特別定義了實作瀏覽器時要定義的 Interface 滿有趣的，不過，還是沒有什麼特別針對渲染和範圍做定義。

```java
interface HTMLBodyElement : HTMLElement {
    attribute Function onbeforeunload;
    attribute Function onerror;
    attribute Function onhashchange;
    attribute Function onload;
    attribute Function onmessage;
    attribute Function onoffline;
    attribute Function ononline;
    attribute Function onpopstate;
    attribute Function onresize;
    attribute Function onstorage;
    attribute Function onunload;
};
```

看 HTML 的 `<body>` 的定義，沒有什麼線索。

## background 的特殊 element[^2]

試看看從 CSS 的 `background` 來看好了。

> 術語
canvas: 渲染出來的格式化結構創造的空間。[^3]
(避免與 `<canvas>` 混淆，下面的內容以「畫布」來稱呼)

畫布是無限維度空間。渲染出有限維度結果。

所以，文件畫布渲染之後是2維無限大的表面。在 CSS2 規範中，並無元素對應到畫布，所以 CSS 套用到 root element 的 background。

那我們就來看看 CSS2 的規範。

## CSS2 定義的 background [^4]

可以指定一個顏色或圖片在元素的背景(渲染表面)。用 box model 解釋的話，就是 padding 和 border 的 background。margin 的 background 永遠透明。

背景屬性不會繼承，但是由於 `background-color` 預設值是 `transparent` ，所以元素總是會透出容器的背景設定。

> 術語
root element: 根元素，在 HTML 文件中指的是 `<html>`

- 根元素背景，就是畫布背景。
- 建議指定 `<body>` 元素背景，而不是 `<html>` 元素。
- 根元素一直都用 `background-color: transparent` 和 `background-image: none` 來計算背景。
- `<body>` 繪製背景時，要將其背景繪製到畫布上。

## 結論

用 `background` 來找 `<body>` 是不對的，`background` 本身對 `<body>` 的行為是一種特例。而不管是用 `position` 還是用 `border` 圈出來，都是正確的做法。

# 參考資料

[^1]: [4.3.1. The body element - w3.org](https://www.w3.org/TR/html5/sections.html#the-body-element)
[^2]: [3.11. Backgrounds of Special Elements - w3.org](https://www.w3.org/TR/css-backgrounds-3/#special-backgrounds)
[^3]: [2.3.1 The canvas - w3.org](https://www.w3.org/TR/CSS22/intro.html#the-canvas)
[^4]: [14.2 The background - w3.org](https://www.w3.org/TR/CSS22/colors.html#background)
