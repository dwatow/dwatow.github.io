---
title: 前端新手村 垂直排列 與 Box Model
date: 2017-12-17 07:38:51
tags: ["2018鐵人賽", "Box Model", 'CSS']
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# 垂直排列 與 Box Model

在網頁中，每個元素都可以用 Box Model 理解，不過`inline`元素，有些屬性不見得有反應，`block` 元素都可以正常演示。
Box Model 在垂直排列時，會遇到一些特殊的問題，這裡也會說明它的觀念。

從 Chrome 的開發者模式，就可以馬上看見每一個參數目前的設定。

![](https://i.imgur.com/GwrhbfO.png)

圖中，橘色、黃色、綠色、藍色分別如下

- 白色: position (與 Box Model 無關)
- 橘色: margin
- 黃色: border
- 綠色: padding
- 藍色: content(資料本身)

在此，的定義描述，我喜歡使用 w3school 的英文描述，下面會引用其原文，並且再用中文解釋一次。


## 共同的特性

**語法**

上下左右，可以一行設定

```
屬性: 上下左右
屬性: 上下 左右
屬性: 上 左右 下
屬性: 上 右 下 左
```

上下左右，也可以指定設定

```
屬性-top: 上
屬性-right: 右
屬性-bottom: 下
屬性-left: 左
```

**值**

Box Model 的三種屬性可以使用的值，各有不同。
要注意的有幾個重點
1. 設定固定值(數字): 可使用的「定義域」[^1]
3. 設定百分比: 100%是誰。
2. 設定預設選項(就是英文的選項): 有哪些選擇。

 要注意: 並不是每個選項都有預設選項。

# `margin`

一般稱為外距。
> **CSS Margins**
The CSS margin properties are used to create pace around elements, outside of any defined borders.[^2]

位置: elemnts 週邊的留白空間，圍繞在 borders。

**語法**

```
margin: 值;
```

### 值

- 固定值: R(實數)[^3] + 任意的 CSS 單位
- 百分比: 相對於容器的寬!!!
- 預設選項:
    - auto: 剩下的空間，由「設定auto的地方」平均分配。
      (若同時有 `left` 和 `right` 則一人一半，若只有 `left` 或只有 `right` 則剩下的都給他)

### 常踩的雷: margin collapse

**問題描述**

讓我們準備一段可以重現問題的 code

```CSS
body {
 outline: 1px solid red;
}

.blue {
 background-color: rgba(0, 0, 255, .6);
 outline: 1px solid blue;
}

.green {
 background-color: rgba(0, 255, 0, .6);
 outline: 1px solid green;
}
```

```html
<div class="green">
 <h1>This is 1</h1>
 <h2>This is 2</h2>
</div>
<div class="blue">
 <h1>This is 3</h1>
 <h2>This is 4</h2>
</div>
```

這渲染結果，為什麼讓 This is 2 和 This is 3 中間出現空白？

**渲染結果**

![](https://i.imgur.com/jSIgBSO.png)



**問題定義**

這個問題稱為「margin collapse」[^4]

如果用開發者模式，並且選看看 This is 3 。

![](https://i.imgur.com/1kOHEBf.png)

可以發現， This is 3 的 `margin` 與  This is 4 的重疊。
如果自己有練習的朋友，可以再看一下  This is 1 和  This is 4 的 `margin` 超過 `div` 容器了。

**Margin Collapse**

這問題，只會發生在垂直方向
- 元素與元素: 兩元素間的垂直排列，若有 `margin-top` 與 `margin-bottom` 相遇，兩元素間的距離，是兩個 `margin` 取大值。
- 容器與元素:
    1. 容器的第一個元素的 `margin-top` 和最後一個元素的 `margin-bottom` 會成為容器對外的 `margin-top` 或 `margin-bottom`。
    2. 容器本身有 `marign` 又遇上元素的 `margin` 跑出來的時候，兩者之間取大值，當作容器的 `margin` 。

簡單的處理方式，在容器的 CSS 加上`overflow: auto;`。

真正的原因，是要觸發 block formatting context 讓容器與週邊的元素以 block 排版的方式呈現。

> 以下是我猜的
block 元素本身預設 `overflow: visible;` 而它沒有觸發 block formatting context [^5]
如此猜測的原因，只是結果回推，將 `overflow: visible;` 設定上去，並無任何改變。但是並無任何更有力的根據。

## `border`[^6]

一般稱為邊框。

`border` 最常寫的，是縮寫語法，但是縮寫縮了哪些東西呢？`border`有三樣。

1. `border-style`: 預設選項
1. `border-width`: R+
1. `border-color`: 色碼 | 顏色名稱 | 色域表示法

**縮寫語法**

順序可以換，可缺 `color` 、 `width`，瀏覽器會補上預設值。

```
border: width style color;
```
例如
```CSS
border: 1px solid #000;
```

### 常踩的雷

**顯示border(很隱性!!)**

`border` 若不設定 style ，就等於沒有設定 border!!
也就是說，若不顯示 `border` 並不是 `border-width: 0;` 這只是恰巧沒有顯示，並不是 `border` 不存在

`border: 0px solid #000;` 有邊框，大小等於0，瀏覽器要渲染。
`border: 1px none #000;` 無邊框，不用渲染。

**切版時習慣將元素加上框線**

切版時，初學都會想知道元素目前的大小與位置。直覺上會加入 `border` ，但有時拿掉 `border` 時畫面卻跑版了。不知道為什麼。
這有兩個常見的原因:
1. `border` 佔空間，會擠到其它元素
2. `border` 會阻止 Margin Collapse 的發生

好的 debug 框線的做法有兩種:
1. 用 `outline` (用法和 `border` 一模一樣)
2. 用 `box-shadow`



### `border-style`


先來 [w3school 的演示](https://www.w3schools.com/CSS/CSS_border.asp)，看看 `border-style` 的值 有幾種預設選項[^7]

![](https://i.imgur.com/JUnkIqU.png)

### `border-width`

若 `border-width: 0;` 瀏覽器還是會渲染。

值有兩種設定方式
- 數字: R+(正實數)[^3] + CSS 單位 (ex: `3px`)
- 使用預設選項
    - thick 厚的
    - medium 中的
    - thin 細的

### `border-color`

顏色值有三種表示方式

```
色碼 | 顏色名稱 | 色域表示法
```

介紹下去有點離題，所以先看[這篇](https://www.w3schools.com/CSS/CSS_colors.asp)頂著先。不同的表示法並不會產生新的顏色，只是表示法不同，控制的維度不同。每個表示法的每個顏色，都是可以互相轉換的(應該啦)。

## `padding`

一般稱為內距。

> **CSS Padding**
>
> The CSS padding properties are used to generate space around an element's content, inside of any defined borders.

位置: 圍繞在 element 內容週圍的留白區域。

**語法**

```
padding: 值;
```

### 值

- 固定值: R+(正實數)[^3] + 任意的 CSS 單位
- 百分比: 相對於容器的寬!!!
- 預設選項: (無)
### 不常想到的妙招

用 `padding-top` 或 `padding-bottom` 創造正方形。

寬度等同於容器寬，又不確定其高，可以直接給 `padding-top: 100%;` 就會是正方形了。

```CSS
.box {
 width: 100px;
 outline: solid;
}
.box > div {
 padding-top: 100%;
}
```

```htmlmixed=
<div class="box">
 <div></div>
</div>
```

## `content`

由內容撐開的高寬。
一開始以為 `inline` 元素就是 `content` 結果我錯了。並不是這樣的。
明天會來細說水平排列

## 總結

`content` 和 `border` 有顯示形式， `margin` 和 `padding` 是一種圍繞在它們週圍的留白空間。

# 參考資料
[^1]: [定義域 - wiki](https://zh.wikipedia.org/wiki/%E5%AE%9A%E4%B9%89%E5%9F%9F)
[^2]: [CSS Margins](https://www.w3schools.com/CSS/CSS_margin.asp)
[^3]: [實數 - wiki](https://zh.wikipedia.org/wiki/%E5%AE%9E%E6%95%B0)
[^4]: [8 Box model - w3.org](https://www.w3.org/TR/CSS22/box.html)
[^5]: [9 Visual formatting model - w3.org](https://www.w3.org/TR/2016/WD-CSS22-20160412/visuren.html#block-formatting)
[^6]: [4. Borders - w3.org](https://www.w3.org/TR/CSS-backgrounds-3/#borders)
[^7]: [CSS Border Properties](https://www.w3schools.com/CSS/CSS_border.asp)
