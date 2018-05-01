---
title: 前端新手村 flex (上)
date: 2017-12-28 07:25:29
tags: ["2018鐵人賽", 'CSS', "Flex"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# flex (上)

## 歷史

跟著我的步調，先來看看 flex 對於內容排版，有什麼基本的功能吧！

以《眾妙之門》這本簡中翻譯書的內容對照出版日，來看看 flex 為什麼是現在這個名字\[^1]。

|年份|display|屬性名稱|
|-|-|-|
|2009年以前|`display:box;`|`box-{*}`|
|2011年的左右|`display:flexbox;`|`flex()`|
|2012-2013年|`display:flex`|`flex-{*}`|

在繁中的一些早期就有出的書(ex: 《HTML5 完美風暴》)，也可以看得出這些語法的版本改變，講的都是同一件事，就是 flex box
在現在(2017年底)講的版本，相對穩定許多。(硬要酸一下)

在 CSS2.1 中，定義了四種排版方式。

1. block 排版，為文章排版而設計。
2. inline 排版，為文字排版而設計。
3. table 排版，為了將資料攤成表格。
4. position 排版，為了依位置而不是依內容關係排版而設計

在此介紹第五種排版方式

5. flex 排版，為了複雜排版畫面而設計。

## flex 術語

- **flex container** 使用 `flex` 或 `inline-flex` 的容器，內容以 flex formatting context 方式排列。
- **flex items** 在 flex container 裡的元素們(整行的元素)
- **flex directions** 在 flex container 裡的排列方向

## flex container

在容器使用

```CSS
display: flex;
display: inline-flex;
```

容器裡的元素排列會以 `flex` 的排列方式進行。

- 排列方式會像 `inline` 可以橫向並且一行一行的排列，也像 `block` 這樣控制每個元素
- `::first-letter` 、 `::first-line`、`float` 以及 `clear` 和 `vertical-align` 沒有作用。
- `margin` 不會 margins collapsing
- `margin` 和 `padding` 不要用在元素上，目前未定案
- `margin: auto` 特別規定在 [8.1. Aligning with auto margins - w3.org](https://www.w3.org/TR/2017/CR-CSS-flexbox-1-20171019/#auto-margins)

## 在 flex 容器排元素

理解方式，就像是理解 `inline` 排版的方式。
一邊看語法，一邊用 `inline` 的圖複習一下

- **justify** 指的是每一行的頭尾對齊[^2] (主軸方向)
    - `justify-content` 文章的行頭尾對齊


![](https://i.imgur.com/oyl3mjs.png)

- **align** 指的是「以行為單位」的對齊(副軸方向)
    - `align-content` 行與行副軸空間分配(副軸頭尾對齊)
    - `align-items` 整排元素(整行)的對齊(上下調整)
    - `align-self` 個別元素的對齊(上下調整)

![](https://i.imgur.com/boIyUpF.png)

## `flex-flow`

縮寫語法

```
flex-flow: <flex-direction>  <flex-wrap>
flex-flow: <flex-wrap>
flex-flow: <flex-direction>
```

### `flex-direction`

設定在容器

調整文字排列方向，預設 `row`

- `col` 上→下排
    - `col-reverse` 下→上
- `row` 左→右排
    - `row-reverse` 右→左


### `flex-wrap`

設定在容器

自動換行，預設 `nowrap`

- `nowrap` 可以選擇不換行
- `wrap` 滿了換到下一行
- `wrap-reverse` 滿了換到上一行


## `order`

設定在元素

改變元素順序，預設 0

- 正數靠右排
- 負數靠左排


## 學習管道

- [CSS-Tricks flex box](https://CSS-tricks.com/snippets/CSS/a-guide-to-flexbox/)
- [小青蛙練習](http://flexboxfroggy.com/)

# 參考資料

[^1]: [ Flexbox的奇怪歷史](https://yuguo.us/weblog/flexbox-history)
[^2]: [ Align or justify text - InDesign User Guide](https://helpx.adobe.com/indesign/using/aligning-text.html)
[^3]: [ 5.4. Display Order: the order property - w3.org](https://www.w3.org/TR/2017/CR-CSS-flexbox-1-20171019/#order-property)
