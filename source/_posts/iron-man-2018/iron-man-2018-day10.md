---
title: 前端新手村 再論 ex, em
date: 2017-12-20 07:11:03
tags: 
- 2018鐵人賽
- CSS
- "CSS Unit"
categories:
- 前端新手村
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# 再論 ex, em

`ex`: 定義「x-height 的高度」也就是說它是一種高度單位。
`em`: 定義「M 字母寬」也就是說，它是一種寬度單位。[^1]

那定義都這麼清楚了，要再論什麼呢？
這一篇，會是一篇設計相關的小知識，不過有助於我們了解 `ex`, `em` 是否能正確使用。

## 為什麼是 x

我們都知道 x-height 定義的是小寫的x，那為什麼不是 o-height 或 a-height
我們來列舉一下類似高度的字母看看
```
abcdefghijklmnopqrstuvwxyz
```

其中有
```
acemnorsuvwxz
```
![](https://i.imgur.com/DdSh5T3.png)

視覺上，圓形略大感覺和方形一樣大。

![](https://i.imgur.com/GMLGIby.png)

所以淘汰有圓形的字母
```
vwxz
```
![](https://i.imgur.com/ms6kA78.png)

剩下這四個。
淘汰有三角形尖端會凸出去的字母
```
xz
```
![](https://i.imgur.com/Sq14xIR.png)

比較了各種字型之後，發現一個殘酷的事

![](https://i.imgur.com/STks9lg.png)

最後，殘酷的是 z 不是正方形。
做為一個基準尺寸，就是這麼殘酷。

## 為什麼是 M

![](https://i.imgur.com/L8SSLO5.gif)

同理可證，不過，還是寫個程式比一下字母

```css
.letters {
    position: relative;
    top: 0;
    left: 0;
    font-size: 300px;
    font-family: serif;
    height: 300px;
    /* outline: 1px solid black; */
    text-align: center;
}

.letters > span {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
}
```

```html
<div class="letters">
    <span class="A">A</span>
    <span class="B">B</span>
    <span class="C">C</span>
    <span class="D">D</span>
    <span class="E">E</span>
    <span class="F">F</span>
    <span class="G">G</span>
    <span class="H">H</span>
    <span class="I">I</span>
    <span class="J">J</span>
    <span class="K">K</span>
    <span class="L">L</span>
    <span class="M">M</span>
    <span class="N">N</span>
    <span class="O">O</span>
    <span class="P">P</span>
    <span class="Q">Q</span>
    <span class="R">R</span>
    <span class="S">S</span>
    <span class="T">T</span>
    <span class="U">U</span>
    <span class="V">V</span>
    <span class="W">W</span>
    <span class="X">X</span>
    <span class="Y">Y</span>
    <span class="Z">Z</span>
</div>
```

```javascript
var index = 0;
setInterval(nextLetter, 500)
function nextLetter () {
    const letters = document.querySelectorAll(`.letters>span`);
    if (index == letters.length) index = 0;
    const letter = document.querySelector(`.letters>span:nth-child(${++index})`);

    letters.forEach(function (item, index) {
       item.style.color = "black";
       item.style.zIndex = 0;
    })
    letter.style.color = "red";
    letter.style.zIndex = 10;
}
```

M 比 X 寬，且接近正方形字母。
(W 不是正方形 QQ)


## 總結一下

在這可以知道
- `em` 是字的最大方形基準尺寸[^1]
- `ex` 是字的最小方形基準尺寸

### 網頁設計

IE 的 `ex` 等同於 `0.5em`
firefox 的 `ex` 才真正接近 x-height。[^2]

Chrome 和上述兩種瀏覽器長度不同。

# 參考資料

[^1]: [Em (typography)](https://goo.gl/dc93dy)
[^2]: [ x-height](https://en.wikipedia.org/wiki/X-height)
