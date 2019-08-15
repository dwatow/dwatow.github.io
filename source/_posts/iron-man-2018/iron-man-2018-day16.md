---
title: 前端新手村 CSS Cascade 串接
date: 2017-12-26 07:43:34
tags: 
- 2018鐵人賽
- Specificity
- Rulest Order
- CSS
categories: 
- 前端新手村
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# CSS Cascade[^1]

Cascade 中文翻譯成「串接」。

Cascade 動作是由 Specificity 和 Ruleset order 作用，決定要套用的 CSS。

## Specificity[^2]

Specificity 在中文翻譯成「特定度」。

千言萬語，透過[一個頁面](http://CSSspecificity.com/)可以說盡。
看不懂沒關係，只要繼續看下去。


### 定義 Specificity

首先，我們想知道 specificity 是多少，要計算 `a`, `b`, `c`, `d` 四個數字
所以，目的在搞懂這四個數字怎麼計算，就可以掌握 specificity

```
(a, b, c, d)
```

- a
    - `style`，直接寫在 HTML element 的 `style` attribute，a = 1
- b
    - b = 出現 `id` 選取器的次數
- c
    - c = 出現 `class` 類別選取器的次數
    - c = 出現 `[attribute=value]` 屬性選取器的次數
    - c = 出現 `:pseudoclasses` 偽類選取器的次數
- d
    - d = 出現 `:sudoelements` 偽元素選取器的次數
    - d = 出現 `tagname` 類型(HTML標籤)選取器的次數

### 計算 Specificity

1. a, b, c, d 彼此不換算。(很重要)
2. a, b, c, d 各別只會相加
3. 結果是四個數字
4. 特例
    1. value後面加 `!important` 直接在 a 前的第五位 +1
    2. `*` 選取器，不佔任何分數 +0

看個例子

```css
#nav-global > ul > li > a.nav-link /* 0, 1, 1, 3 */
```
- a = 0: 沒有寫在 HTML 的 `style`
- b = 1: `#nav-blobal`
- c = 1: `.nav-link`
- d = 3: `ul`, `li`, `a`

## Rulest order

Rulest order 翻譯成 規則集順序。

千言萬語，只要開「開發者模式」就可以看結果。

![](https://i.imgur.com/EcCbRuB.png)

以結果來說圖中的 `margin-top`被覆寫。

### 定義 Rulest order

若出現兩個 Specificity 強度相同的 Ruleset ，晚宣告有較高的優先權。

> 是要改套件樣式，要掌握這個訣竅

看個例子

```css
#nav-global > ul > li > a.nav-link {
    color: blue;
}
#nav-global > ul > li > a.nav-link {
    color: red;
}
```

最後的字型顏色，是紅色的。

# 參考資料
[^1]: 《重構 CSS》
[^2]: [9. Calculating a selector's specificity - w3.org
](https://www.w3.org/TR/selectors-3/#specificity)
