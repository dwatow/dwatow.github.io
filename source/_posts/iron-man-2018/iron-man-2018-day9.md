---
title: 前端新手村 橫向排列 & 實現純手工 RWD
date: 2017-12-19 07:18:33
tags: ["2018鐵人賽", "Inline", 'CSS', "RWD"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# 橫向排列 & 實現純手工 RWD

網頁的橫向排列，其實包含了直向排列的一些觀念，因為要處理橫向共存的問題，所以遇到的問題又更複雜了一點。

今天針對橫向排列的實作方式，在此列舉一些常見的做法。

## 人人都會用

只要打上文字，所有的文字自然排列就是橫向排列。
而文字本身會橫排在一個稱為匿名區塊裡的地方[^1]。

## 資深級 or 為 IE 而用

使用 `float`

**特性描述**

若有 `float` ，則 `float` 會在該行靠左或靠右，若有非定位的 `block` 元素，則會忽視 `float` 元素並佔用它的空間，但是 `block` 元素的內容，則會和 `float` 相擠排列。[^2]

與 `float` 共生的 `clear`

指定該元素的哪一邊不要和`float`相鄰

`float` 和 `clear` 是一種輕鬆做出「文繞圖」的技巧。
也就是說 `float` 要設定在「圖」身上。

大多數的資深開發者，也早就習慣拿它來做橫排的行為。而且熟練之後相當好用。但卻不直覺(容易踩雷)。


## 後來橫排問題試著被解決

```
I have a inline~
I have a block~
nm~inline-block!!
```

> 《Pen-Pineapple-Apple-Pen》（日語：ペンパイナッポーアッポーペン），簡稱《PPAP》，是一首由日本搞笑藝人古坂大魔王所扮演的虛構創作歌手Piko太郎（日語：ピコ太郎）創作[^3]

2016年日本搞笑藝人古坂大魔王學 w3c 設計 `inline-block` 的概念，創作了 PPAP 這首歌。(誤)

那...有了 `display: inline-block` 就好了(嗎？)

1. 將 `block` 元素的寬讓開發者定義(像 `float` 一樣)
2. 可以橫向排列(像 `inline` 一樣)

看似完美的解決方案，就在預設值不直覺的情況，還是有使用上不直覺(容易踩雷)的地方。[^4]

### 常踩的雷

看個例子

```html
<div>12345</div>
<div>
 <span>1</span>
 <span>2</span>
 <span>3</span>
 <span>4</span>
 <span>5</span>
</div>
<div class="inline-block">
 <div>1</div>
 <div>2</div>
 <div>3</div>
 <div>4</div>
 <div>5</div>
</div>
<div class="float-left">
 <div>1</div>
 <div>2</div>
 <div>3</div>
 <div>4</div>
 <div>5</div>
</div>
```

```CSS
.inline-block > div {
 display: inline-block;
}

.float-left > div {
 float: left;
}
```

![](https://i.imgur.com/aAs852U.png)



1. 原本的 12345 是緊密的靠在一起。
1. 各別用 `span` 的 12345 距離被拉開了(紫色背景數字)
1. 各別用 `div` + `display: inline-block` 的 12345 距離被拉開了 (紅色背景的數字)
1. 各別用 `float: left` 就像原本的一樣

囧!!!
這樣怎麼離得開 `float` 呀？

**解決方案**

要了解這問題的完美解決方式。
要先明白，預設 `white-space: normal` ，就是填入空白，視情容器大小斷行。
所以，將「空白鍵」的空間消除就可以了。

在容器設定 `font-size: 0;` 再設定各別的 `font-size` 回到原本的大小即可。

```CSS
.inline-block {
 font-size: 0;
}

.inline-block > div {
 font-size: 1rem;
 display: inline-block;
}
```
![](https://i.imgur.com/JmS1xHX.png)


## 橫排的問題，又再度被...順便解決

有了 `flex` 正中了好多人的下懷。簡單又好用的存在!!!

但是卻有一間廠商不願意讓世界完美起來，也正因為如此前端工程程師的肝與價值有了變化。

```html
<div class="flex">
 <div>1</div>
 <div>2</div>
 <div>3</div>
 <div>4</div>
 <div>5</div>
</div>
```

```CSS
.flex {
 display: flex;
}
```

`flex` 預設不斷行，若要再讓它斷行，需要再加其它的語法。(還是和 `float` 不一樣!!!)


## 純手工 RWD !!

所謂「最好的是手工，最爛的也是手工」

上述的技術透過調整寬度，允許斷行的方式，再配合 media query ，即可以做 RWD 效果。

之前在網路上看 [來聊聊一些個人切版的經驗與個人切版技巧吧！ - Live Coding](https://www.facebook.com/LiveCoding.tw/videos/1669445373356989/) 和 [隨機挑一個版型來切版當作練習 - Live Coding](https://www.facebook.com/LiveCoding.tw/videos/1672348406400019/) 切版影片。片中的手刻 RWD 示範，正是以 `inline-block` 的技巧+調整寬度辦到的。

而 Bootstrap 3 和 Bootstrap 4 的網格系統，也是透過 `float` 和 `flex` 的技術，實現 RWD 。

# 參考資料
[^1]: [9.2.1.1 Anonymous block boxes](https://www.w3.org/TR/CSS22/visuren.html#anonymous-block-level)
[^2]: [10. Floating boxes - w3.org](https://www.w3.org/TR/CSS3-box/#float)
[^3]: [Pen-Pineapple-Apple-Pen](https://zh.wikipedia.org/wiki/Pen-Pineapple-Apple-Pen)
[^4]: [CSS Layout - inline-block](https://www.w3schools.com/CSS/CSS_inline-block.asp)
