---
title: 前端新手村 CSS 的 簡單 Selector (中篇)
date: 2017-12-22 07:10:54
tags: ["2008鐵人賽", "Selector", "CSS"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# CSS 的 簡單 Selector (中篇)

## pseudo-classes[^1]

「偽類」不同於「偽元素」這兩個內容不同。

定義: 是一種描述「 HTML element 狀態」的選擇器描述方式，選擇器名稱不屬於「 HTML element 節點」上節點。

一旦狀態改變，偽類就可以實作 純CSS 的動態變化。
常見於一些標榜著「使用 CSS 省下 JS 的炫麗技術」就是這一單元的應用。
換句話說，要學神技，就看懂這些!!!

用法
- 可以用 `:` 加在任何一個簡單選擇器之後。
- 有互斥的偽類，也有可以疊加的偽類


### Dynamic pseudo-classes

用在連結 `<a href="##"></a>` 看過或未看過的狀態。
使用者與畫面元素之間的互動，也會改變狀態。


- The link pseudo-classes 表示 link 的狀態
    - `:link` 未看過連結
    - `:visited` 看過連結
- The user action pseudo-classes 表示 user action 的狀態(不限定是 link!! )
    - `:hover` 懸停
      若使用者用行動裝置，`hover`就不一定會有反應
      有些互動媒體並不支援[^2]
    - `:active` 互動當下一瞬間
      適用於互動裝置的主觸發鍵(通常是滑鼠左鍵)
    - `:focus`
      接受鍵盤或滑鼠形式的操作，或其它能具有「游標」的形式。
      ex: `<a href="##"></a>`, `<input type="text">`
      簡單測試: **用 tab 移動游可到達的，就可以擁有 focus**

**實際測試套用情況**

在 Chrome 的開發者模式，找到

![](https://i.imgur.com/JZNOEK2.png)


### The target pseudo-class

網址後面有時會接著一個 `#` 後面再接一段字，那段字若等同於某個 id ，則擁有 id 的 HTML element 稱為 target element ，就會用到 `:target` 的 css

使用情境

```html
<a href="#chris">chris</a>
<a href="#mary">mary</a>
<!--中間省略-->
<div id="chris">chris</div>
<div id="mary">mary</div>
```

```css
:target {
 display: block;
}

div {
 display: none;
}
```

- `:target` = `*:target` 任何 html element 的 id 在網址上，就會被套用 `:target` css。
- `div:target` 就是只有 div 的 id 在網址上，才會套用 `:target` css。

> 注意，捲軸會重新捲到顯示 `id` 的地方。
> 若使用 `:target` 出現無法解釋的捲軸移動現象，就只是為了顯示擁有該 `id` 的元素。

### The language pseudo-class

- `:lang`

指定語言時，決定排版方向，在製作多國語系時可以考慮這個用法。
在此不深入研究。


# 參考資料

[^1]: [Selectors Level 3, 6.6. Pseudo-classes](https://www.w3.org/TR/css3-selectors/#pseudo-classes)
[^2]: [7.3.1 Media groups](https://www.w3.org/TR/REC-CSS2/media.html#interactive-media-group)
