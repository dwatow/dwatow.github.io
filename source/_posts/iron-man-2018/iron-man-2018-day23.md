---
title: 前端新手村 細說 Timing function
date: 2018-01-02 07:53:59
tags: ["2018鐵人賽", 'CSS', "Transition"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# 細說 Timing function

動畫並不是只是讓元素在畫面動起來，若可以符合觀賞者的直覺與物理特性相同的動畫行為，可以達到更好的效果。

Timing function 提供元素在畫面上變化的控制方式，可以在畫面變化的同時，實現符合動畫的基本法則[^1]。

## 讀函數圖

![](https://i.imgur.com/L1piHHs.png)

水平軸: 資料t, 輸入的時間百分比
垂直軸: 資料x, 輸出的位置

步驟:
1. 在 t(水平軸)，先等距的畫出一些點(t0~t10)，代表「渡過固定的時間變化量」。(幾個隨意，重點是等距)
2. 從 x(垂直軸)上的點到函數曲線 (curve) 之間，畫出垂直線，在函數曲線上的點稱為「c0~c10」 。
3. 將每個 c 點到 x (垂直軸)，畫出水平線，可以得到許多在垂直軸上的點(x0~x10)，代表「出現在畫面上的距離變化量」

從垂直軸上的點，可以看得出
- 點很疏，就是速度快(過了相同的時間，距離變化大)。
- 點很密，就是速度慢(過了相同的時間，距離不太變化)。

而 timing function 在定義上，必須是數學的 Pure function [^2]。

定義域是[0, 1]的實數，值域是[-∞, +∞]的實數。

函數本身，即是輸入與輸出的對應關係

> Pure function 意指相同的輸入，永遠會得到相同的輸出，而且沒有任何顯著的副作用。

## linear 線性函數

使用時，設定值為 `linear`
輸入等於輸出的一種對應關係。

在數學上，可用零階貝茲曲線表示。[^3]

## Cubic Bézier 二次貝茲曲線

二階貝茲曲線[^3]，利用兩個控制點，決定一個曲線。

![](https://upload.wikimedia.org/wikipedia/commons/d/db/B%C3%A9zier_3_big.gif)

有興趣的人可以到 [cubic-bezier.com](http://cubic-bezier.com/) 來拉一下，玩玩看。
但是這個工具有它的極限，但是用 Chrome 的開發者工具 keyin，沒有極限。

![](https://i.imgur.com/OfGJFrS.png)
![](https://i.imgur.com/C0rm439.png)


使用時，設定值為 `cubic-bezier(P1x, P1y, P2x, P2y)` [^4]

特例 (在 CSS 中有列舉出來，可以接直使用)
- `ease` = `cubic-bezier(0.25, 0.1, 0.25, 1)`.
- `ease-in` = `cubic-bezier(0.42, 0, 1, 1)`.
- `ease-out` = `cubic-bezier(0, 0, 0.58, 1)`.
- `ease-in-out` = `cubic-bezier(0.42, 0, 0.58, 1)`.

![](https://i.imgur.com/DeeTDXc.png)

## Step 線性定格

線性定格(亂翻譯的，若有知道正確中譯者，麻煩在留言告訴我，感謝)

值入值: steps 數字 和 step position
- steps: 非零正整數
- position: `start` 或 `end`

step position 的意思
1. 「第一步切換下一步的時機」，換句話說，第一步是 `start` 就下一步，還是 `end` 才下一步。
2. `start` 定義域的整數無條件進位成值域， `end` 定義域的整數無條件捨去成值域。

將輸入值的時間，切割成幾個間隔，平均分佈顯示的每個間隔的位置

![](https://i.imgur.com/13XVSja.png)

舉例

```CSS
transition-timing-function: steps(1, start);
transition-timing-function: steps(1, end);
transition-timing-function: steps(3, start);
transition-timing-function: steps(3, end);
```

特例 (在 CSS 中有列舉出來，可以接直使用)
- `step-start` = `steps(1, start)`
- `step-middle` Chrome 給的特例值 (試都沒有什麼作用)
- `step-end` = `steps(1, end)`


## Frames timing functions

Chrome & Firefox 怎麼試都不行，還是附上語法，也許有一天會動。

語法

```
frames(大於1的正整數)
```

例子

```CSS
transition-timing-function: frames(3);
```

# 參考資料

[^1]: [ 動畫的12項基本法則 - wiki](https://zh.wikipedia.org/wiki/%E5%8B%95%E7%95%AB%E7%9A%8412%E9%A0%85%E5%9F%BA%E6%9C%AC%E6%B3%95%E5%89%87)
[^2]: [ 第 3 章：Pure Function－單純的幸福](https://jigsawye.gitbooks.io/mostly-adequate-guide/content/ch3.html)
[^3]: [Bézier curve - wiki](https://en.wikipedia.org/wiki/B%C3%A9zier_curve)
[^4]: [ CSS Timing Functions Level 1](https://drafts.csswg.org/CSS-timing/)
