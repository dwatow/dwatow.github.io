---
title: 前端新手村 CSS 的 簡單 Selector (下篇)
date: 2017-12-23 07:17:11
tags: ["2018鐵人賽", "Selector", "CSS"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# css 的 簡單 Selector (下篇)

## The UI element states pseudo-classes

可以 enable / disable 切換的UI元素。
切換時可用這兩種元素選取

- `:enabled`
- `:disabled`

`<input type="radio"|"checkbox">` 的 element 可以套用上，點擊可以切換成能套用 `:checked` 和不能套用 `:checked` 的。

- `:checked`

## Structural pseudo-classes

結構化虛擬類，允許用 DOM 樹結構關係進行選取。
以1起始計數

- `:root` document 的根節點

### n 的小小補習班

n 可以是 `odd` 或 `even` 單數、偶數。
如果覺得很難記，教你一個好記的方式

`odd` 幾個字母？3是奇數還是偶數？
`even` 幾個字母？4是奇數還是偶數？

所以 `odd` 是奇數，`even` 是偶數

n也可以是 `±Zn±Z` 或 `±Zn` (Z是整數) [^2]


無差別計數。
像是家裡的第幾個小孩

- `:nth-child(n)` 正數第 `n` 個同層
- `:nth-last-child(n)` 倒數最後一個同層
- `:first-child` 老大
- `:last-child` 老么
- `:only-child` 獨子

同類計數
像是家裡的第幾個男孩或女孩

- `:nth-of-type(n)` 正數第 `n` 個同層同類
- `:nth-last-of-type(n)` 倒數第 `n` 個同層同類
- `:first-of-type` 長男或長女
- `:last-of-type` 么男或么女
- `:only-of-type` 生一個男的或一個女的

最後一個

- `:empty` 沒有孩子，沒有資料

有些特別的

```html
<div></div> 有
<div>1</div> 無
<input type="text" value="chris"> 有
```

## The negation pseudo-class

- `:not(selector)` 改選擇沒被 selector 到的那些

## 常見好案例

案例 1: CSS 取代 onclick

被選到的就變紅字

![](https://i.imgur.com/lDb98ya.png)

```css
input:checked + span {
 color: red;
}
```

```html
 <input type="radio" name="X"><span>1X</span>
 <input type="radio" name="X"><span>2X</span>
 <input type="radio" name="X"><span>3X</span>
 <input type="radio" name="X"><span>4X</span>
 <input type="radio" name="X"><span>5X</span>
```


案例 2: 磚型排版

要做這個排版

![](https://i.imgur.com/wobW8d9.png)

可以先觀察，重複性: 每九個就重複一次，排列方式。
只要先做一般的排版，並且選取到紅色的部份，就等於做完了。

```
n = 9n+6
```

![](https://i.imgur.com/Svg5oGt.png)

原始碼長這樣
將 `margin-left: 50px;` 解除註解就可以看到成功的案例囉

```css
.box {
 padding-bottom: 50px;
 width: 100px;
 outline: 1px solid black;
 display: inline-block;
}

.box:nth-child(9n+6) {
/*  margin-left: 50px; */
 background-color: #f00;
}

.container {
 width: 500px;
 font-size: 0;
}
```

```html
<div class="container">
 <div class="box"></div>
 <div class="box"></div>
 <!--  省略掉很多 box  -->
 <div class="box"></div>
 <div class="box"></div>
 <div class="box"></div>
</div>
```

# 參考資料

[^1]: [Selectors Level 3, 6.6. Pseudo-classes - w3.org](https://www.w3.org/TR/css3-selectors/#pseudo-classes)
[^2]: [整數 - wiki](https://zh.wikipedia.org/wiki/%E6%95%B4%E6%95%B0)
