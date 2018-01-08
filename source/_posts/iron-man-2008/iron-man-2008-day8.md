---
title: 前端新手村 橫向排列
date: 2017-12-18 07:06:12
tags: ["2008鐵人賽", "Inline", "CSS"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# 橫向排列

在 HTML 中，直向排列會預設 `width: 100%;` ，但是在橫向排列時，會預設 `width: auto` 也就是依照內容決定寬度。在 Normal flow 的規則之下，它就會成為文字的排列方式。

橫向排列時的思考方式，比較不接近 Box Model 而是要使用「 inline 排版」的思考方式。

舉例來說

`div` 可以使用 `margin-right: auto;` 靠左，用 `margin-left: auto;` 靠右。
但是 `span` 不會有這樣的表現。

##  個人的 inline 排版觀念

這一段，純屬我個人的推敲，尚未全部證實，但是卻很好用。


![](https://i.imgur.com/oyl3mjs.png)


文由行組成，行由字組成。

### 文

表現「文」形式的做法，最簡單就是將文裝進 `block` 容器中。
這樣就可以將「文」當作「文字區塊」的概念進行排版。

對「文章」的設定，可以設定在容器(在此為`div`)。


可作用在容器的 CSS
- `text-align`[^1]: 設定文章靠左還是靠右對齊。
- `white-space`[^2] 控制斷行是不是要變空白

可作用在元素的 CSS
- `white-space`[^2] 控制「原始碼的斷行」是不是要變空白

### 行

文由行組成，不是由字組成。
相對於 block 排版，「行」是在 inline 排版裡較特別的概念。

可作用在容器的 CSS

- `line-height`[^3] 行高
- `text-indent`[^4] 行起始字縮排

可作用在元素的 CSS

- `line-height`[^3] 行高設定在元素，但是影響整個文的行高(被撐開了)

### 字

行由字組成。

有字距(字母) `letter-space` ，有單字距 `word-space`
文字可以改大小寫 `text-transform`


可作用在容器的 CSS

- `text-transform` [^5] 字母大小寫轉換
- `text-decoration` [^6]文字的修飾線條 (去掉底線改這個)
- `letter-space` [^7]字距，字母之間的距離(中文字距)
- `word-space` [^7]字距，單字之間的距離(空白的大小)

可作用在元素的 CSS

- `virtual-align` [^3] 字有大有小時，就可以設定字的垂直對齊方式。
- `text-transform` [^5] 字母大小寫轉換
- `text-decoration` [^6]文字的修飾線條 (去掉底線改這個)
- `letter-space` [^7]字距，字母之間的距離(中文字距)
- `word-space` [^7]字距，單字之間的距離(空白的大小)

## inline 的垂直對齊

文字的垂直對齊，對於初學者來說是一件很不好理解的事情。
因為，要垂直對齊，必須要在「行高」空間裡。

![](https://i.imgur.com/pyVxQ77.png)


也就是說， `inline` 元素要垂直對齊，必須要先找到該元素的「行」，並且「把行撐開」，才可以使用 `inline` 的對齊屬性

![](https://i.imgur.com/boIyUpF.png)

在多行的情況中，文字的垂直對齊更受限於行與行之間，並不像 `block` 元素般自由的移動。必須使用另一種排版觀念思考，掌握度比較高。


# 參考資料

[^1]: [16.2 Alignment: the 'text-align' property - w3.org](https://www.w3.org/TR/2016/WD-CSS22-20160412/text.html#propdef-text-align)
[^2]: [16.6 White space: the 'white-space' property - w3.org](https://www.w3.org/TR/2016/WD-CSS22-20160412/text.html#white-space-prop)
[^3]: [10.8 Line height calculations: the 'line-height' and 'vertical-align' properties - w3.org](https://www.w3.org/TR/2016/WD-CSS22-20160412/visudet.html#line-height)
[^4]: [16.1 Indentation: the 'text-indent' property - w3.org](https://www.w3.org/TR/2016/WD-CSS22-20160412/text.html#indentation-prop)
[^5]: [16.5 Capitalization: the 'text-transform' property - w3.org](https://www.w3.org/TR/2016/WD-CSS22-20160412/text.html#caps-prop)
[^6]: [16.3 Decoration - w3.org](https://www.w3.org/TR/2016/WD-CSS22-20160412/text.html#decoration)
[^7]: [16.4 Letter and word spacing: the 'letter-spacing' and 'word-spacing' properties - w3.org](https://www.w3.org/TR/2016/WD-CSS22-20160412/text.html#spacing-props)
