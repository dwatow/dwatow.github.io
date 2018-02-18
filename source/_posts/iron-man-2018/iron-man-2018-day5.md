---
title: 前端新手村 CSS 的作用
date: 2017-12-15 08:02:10
tags: ["2018鐵人賽", "CSS", "Vendor Prefix"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# CSS 的作用

CSS，是「 Cascading Style Sheets 」的縮寫。

在1996年左右，CSS剛開始被提出來，我自己是在大約1999年才接觸到CSS1，對於一個高中生來說，是很新的東西。在這之前，CSS的功能是做在 HTML attribute上。

> 目的在於，資料歸資料，畫面歸畫面[^1]

當你覺得，這一段 code 是為了畫面生時，就是使用CSS的時候了。
也就是說，要讓 CSS 控制「呈現的形式」。

- 顯示與否
- 排版(直排、橫排、圖繞文)
- 字型
- 留白、邊框
- 頁面圖層
- 特效
    - 3D
    - 過場、動畫
    - 透明、濾鏡
    - 陰影

語法多到你沒想到，他都幫你想好了!!!!

## 語法

```css
Selector {
    Property: Value;
}
```

### 術語

新手要知道的是術語，方便和資深的工程師進行溝通(才不會漏學了什麼厲害的技術)

![](https://i.imgur.com/8x561cf.png)

- Selector: 用來決定要對哪個 HTML 進行設定，每個選取器有它自己的 Specificity。
- Property: 這就像查字典一樣，有遇到再來查。之後會介紹一些常用的 Property 在此就不破梗了。
- Value: 隨 Property 的介紹，再來介紹 Value。
- Declaration: Property + Value 。
- Declaration Block: 大括號內的一切。
- Ruleset: Selector + Declaration Block 。

## CSS3 的特色

CSS3 帶來的真是一則以喜，一則以憂呀，對新手來說，隱藏著些許的不友善，但是卻帶來強大的功能。

1. 用`,`(逗號)隔開，值可以給多組(多重背景、多重陰影、多重 ~~字型~~ )
2. 有 Vendor Prefix

### Vendor Prefix[^2]

當你看見 CSS 有加一些特定的前綴

```css
-o-
-moz-
-ms-
-webkit-
```

看個例子

```css
-webkit-border-radius: 5px;
-moz-border-radius: 5px;
border-radius: 5px;
```

為什麼瀏覽器總是會刪掉幾個？不寫就好了呀!!!
(寫到這，總算有一點 for 新手的感覺了)

這種寫法，是一種歷史共業!!!
當年很新潮的寫法，各家瀏覽器業者先實作，不管標準，之後標準推出，這些若拿掉對不起的是對自家瀏覽器的狂熱開發者(應該啦)。所以各家依然留著這樣的實作內容。

那要怎麼做呢？

建議用這樣的原則這麼寫
1. 把可能支援的瀏覽器都寫出來。
2. 把標準的寫法，寫在這些 declaration 最下面。

用意在於，若瀏覽器不支援標準，會自動選一個自己有支援的前綴。
若有實作標準，還可以吃最後一行標準的 declaration 來覆蓋已支援但有前綴的設定。


## 瀏覽器比對的方式

瀏覽器為了提高效能，比對選取器的方式，是由右至左。

看個例子

```css
#nav-global > ul > li > a.nav-link {
    color: red;
}
```

1. 找 HTML 裡是不是有個 HTML 的 class 包含 `.nav-link`。如果有，再繼續找。
2. 找 `.nav-link` 的 tag name 是不是有 `a`。如果有，再繼續找。
3. 找 `a` 的上一層 是不是有 `li`。如果有，再繼續找。
4. (以此類推)
5. 一直找到 找 HTML 裡是不是有個 HTML 的 id 是 `#nav-global`。

以保持瀏覽器高效能。
也就是說，短一點，瀏覽器可以跑快一點。

## CSS的 瀏覽器支援度

w3school會在每個語法教學頁，附上語法在各瀏覽器支援程度的訊息。
若遇到想查詢的時候，也可以直接上 [Can I Use](https://caniuse.com/) 查詢。
查詢到的資訊，我覺得還是謹供參考，自己實驗之後才確實是如此。

# 參考資料

[^1]: [階層式樣式表 - wiki](https://zh.wikipedia.org/wiki/%E5%B1%82%E5%8F%A0%E6%A0%B7%E5%BC%8F%E8%A1%A8)
[^2]: [Vendor Prefix - MDN](https://developer.mozilla.org/zh-TW/docs/Glossary/Vendor_Prefix)
