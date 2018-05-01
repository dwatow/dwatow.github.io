---
title: 前端新手村 Block 和 Inline 排版
date: 2017-12-16 07:17:35
tags: ["2018鐵人賽", 'CSS', "Block", "Inline"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# Block 和 Inline 排版

初學 HTML 開始切版時，先學 `div` 和 `span` 這兩個標籤，就可以練習排所有的東西了!!!

在網頁排版裡，可以粗略的分成兩大系統。

- 區塊(Block)元素
- 行列(Inline)元素

這兩種元素，就只是設定「內容的排列環境(formatting context)」。[^1]
在網頁的排列上

在 w3c 的文件中，有明確的定義這兩種排列方式，在此節錄一部份相關的內文來看

> **9.4.1 Block formatting contexts**
>
> In a block formatting context, boxes are laid out one after the other, vertically, beginning at the top of a containing block.[^2]


> **9.4.2 Inline formatting contexts**
>
> In an inline formatting context, boxes are laid out horizontally, one after the other, beginning at the top of a containing block.

這兩段內文，我們會在下面的原始碼中，有更多的體會。

## HTML 表現形式

 `div` 和 `span` 這兩個元素，就是支援這兩種元素觀念的 HTML 表現形式。

看個例子

> 建議
> 申請一個 [code pen](https://codepen.io/) 讓你可以隨時做實驗。

```html
<div>div element</div><div>div element</div>
<div>div element</div>
<div>div element</div>
```

```html
<span>span element</span><span>span element</span>
<span>span element</span>
<span>span element</span>
```

上面兩種原始碼，可以看出
1. 無論你的原始碼是橫排還是直排，是不會影響最後呈現的結果。
2. div 的內容 由上到下的垂直排列
3. span 的內容 由左至右的水平排列

### `<div>` 的預設行為

- `block` 類型元素的代表
- 自然排列是直排
    - `div` 元素寬與它的容器大小一樣(`width: 100%;`)。
    - `div` 元素高由它的內容撐開。
- `div` 本身的作用
    - 界定區塊尺寸與留白範圍
    - 賦予執行 `block` 元素的CSS特性

使用上大多都用在區塊之間的切割，在初次看見設計稿時，腦海的分割畫面行為，大多都可以算是用 `div` 切割的行為。

網頁排版大多也是使用 `block` 區塊，來描述元素之間的關係。

### `<span`>

- `inline` 類型元素的代表
- 自然排列是橫排
    - `span` 元素寬與它的內容撐開，所以可以「水平的一個接著一個」。
    - `span` 元素高由它的內容撐開。
- `span` 本身的作用
    - 界定內容選取範圍
    - 賦予執行 `inline` 元素的CSS特性

使用上，最常搞混的是`<img>`，其實是一種 `inline` 元素。

## CSS 表現形式

`display`屬性中，有兩個值 `inline` 和 `block` 。
發現了嗎？就算你只會 `div` 也可以透過設定 `display: inline` 將 `div` 變成 `inline` 元素。(但請不要....不要這麼做。)

看個例子
承上面的 code，加上 CSS

```CSS=
div {
    display: inline;
}

span {
    display: block;
}
```

### 排版特性交換 (要小心!!!)

若你是寫成 HTML 檔，會變這樣
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style media="screen">
        div {
            display: inline;
        }

        span {
            display: block;
        }
    </style>
</head>
<body>
    <div>div element</div><div>div element</div>
    <div>div element</div>
    <div>div element</div>

    <span>span element</span><span>span element</span>
    <span>span element</span>
    <span>span element</span>
</body>
</html>
```

上面兩種原始碼，可以看出
- 加上 CSS 之後，兩種元素的排列方式改變(交換)了。

為什麼不要讓他們屬性交換，原因有兩個
1. 每個 HTML 標籤都有預設 CSS 行為，改了一個，還有千千萬萬個。
   不要有「display在手，要怎麼排都有」的 ~~邪~~ 觀念呀!!! ><
   不如在認識每個標籤時，都正確的記得它的用途與英文原文
2. `div` 要橫排，要設 `inline-block` ，內容超過行高就出問題了!!(之後會細談橫排與直排)


# 參考資料
[^1]: [KB010: 常規流( Normal flow ) - w3help](http://w3help.org/zh-cn/kb/010/)
[^2]: [9 Visual formatting model - w3c](https://www.w3.org/TR/2016/WD-CSS22-20160412/visuren.html#normal-flow)
