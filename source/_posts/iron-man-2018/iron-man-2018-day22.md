---
title: 前端新手村 Transition
date: 2018-01-01 09:42:05
tags: 
- 2018鐵人賽
- CSS
- Transition
categories: 
- 前端新手村
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# Transition

由互動行為而改變 CSS (不管是用 js 抽換 class ，還是使用 `:checked` 或 `:target`)，畫面會瞬間變成修改後的樣子。
如果想要中間變化的過程，隨時間顯示在畫面上，transition 是一個簡單又直覺的選擇。

transition 可以計算數值，從舊的到新的變化過程。只有可動畫化的屬性[^1]，才可以用在 transition。
transition 還有一個「隨時可以中斷」的特性。若在 running transition 時，CSS 改變了，就會馬上改變，而不會等完成 transition 之後才套用。

**語法**

(縮寫)
```
transition: 屬性 持續時間 delay時間 變化函數
```

因為 transition 要有轉變對象，開始時間、持續時間、結束時間，所以至少要寫下面這樣

```
transition: 屬性 持續時間
```

delay時間 變化函數 都是使用預設值。

## `transition-property` 屬性

值: 指定轉換的 CSS 屬性名稱 或 `none`
預設值: `all`

設定 `none` 就什麼都不轉換。

## `transition-duration` 持續時間

值: 時間 (正實數)
預設值: `0s`

若設定 `0s` 則表示過場變化瞬間完成，若設定負數表示不渲染。

## `transition-timing-function` 變化函數

值: timing function 名稱
預設值: `ease`

要過場的屬性值在時間變化中，有不同的變化速度。
將時間轉成百分比，再將位置經過不同的插值規則運算[^2]出來。

## `transition-delay` delay時間

值: 時間(實數)
預設值: `0s`

這個屬性控制兩件事
1. transition 執行時間
2. transition 顯示時間

設定值為正數( n)時，執行時間和顯示時間都會延遲
設定值為負數(-n)時，只有顯示時間延遲，執行時間延遲。所以會有「起始動畫到 n 秒」的效果


**來看個例子**
體驗一下 transition

```html
<div class="box"></div>
```

```css
.box {
  height: 100px;
  width: 100px;
  border: 1px solid black;
  background-color: #f00;
  margin-left: 0;
  transition: all 1s -.3s;
}


.box:hover {
  background-color: #00f;
  margin-left: 50px;
}
```

![Imgur](https://i.imgur.com/oGolSuh.gif)


## 常見的雷

**例子1: 元素要以淡出的方式消失在畫面上!!!**

一般來說，讓元素不出現在畫面上，都是給 `display:none` 但是，這就是 transition 的雷點。

複習一下文章開頭的一句
> transition 可以計算數值，從舊的到新的變化過程。

`diaplay: none` 到 `display: block` 要怎麼運算？
所以，在此要使用 `opacity: 0` 看到數值了吧？！ `opacity: 0` 到 `opacity: 1` 是可以運算的。

不過，在此做三種消失看看
`display: none;`
馬上消失，快速切換 `:hover` 和 無 hover 的 CSS 造成的閃爍
![](https://i.imgur.com/kW1SdXi.gif)
`visibility: hidden;`
在 transition 到達最後狀態時，才有 `visibility: hidden` 的效果
而恢復時，離開了最後狀態，就失去 `visibility: hidden` 的效果
![](https://i.imgur.com/Z0tjU1x.gif)
`opacity: 0;`
將 `opacity: 1` 的數值計算到 `opacity: 0` ，達到淡出的效果
![](https://i.imgur.com/D895Iqo.gif)

**例子2: hover 和恢復原狀，兩個 transition**

有時希望做倒帶的 transition，就要寫兩個 `transition`
但是往往會搞不清楚要寫在哪才是正確的。
在此寫了一個 hover 花1秒，恢復花5秒的 transition

先來看看原始碼

```css
.box {
  height: 100px;
  width: 100px;
  border: 1px solid black;

  background-color: #f00;
  border-radius: 50%;
  margin-left: 0;
  background-color: #eef;
  transform: rotate(30000000000deg);

  transition: all 5s 0s;

}

.box:hover {
  border-radius: 0%;
  margin-left: 50px;
  background-color: #fee;
  transform: rotate(0deg);

  transition: all 1s 0s;
}
```

```html
<div class="margin-top"></div>
<div class="box"></div>
```

![](https://i.imgur.com/FLmsenZ.gif)
上圖標示 hover 的作用區間，恢復的作用區間。(用顏色標示)

也就是說，元素只有在一開始是沒有 hover ，一旦要成為 hover 就是游標懸停時開始，所以 1秒變成方形的 `transition` 要寫在 `:hover` 上面；相反的，當游標離開元素，就要套用5秒變成圓形的 CSS。

**例子2: display: none -> display: block**

先說結果: 沒有 transition

```html
<input id="c1" type="checkbox">
<div class="box"></div>
```

```css
#c1:checked ~ .box {
  margin-left: 0px;
}

.box {
  height: 100px;
  width: 100px;
  background-color: #0a0;
  margin-left: 50px;
  transition: 1s -.3s linear;
}
```

結果是這樣
![](https://i.imgur.com/oF8c0zU.gif)

若我們要在一開始消失，後來出現。
在 CSS 加上 `display: none` -> `display: block` 的切換

```css
#c1:checked ~ .box {
  /* 和上面的一樣 */
  display: block;
}

.box {
  /* 和上面的一樣 */
  display: none;
}
```

結果是這樣
![](https://i.imgur.com/Ap2lDMk.gif)

那怎麼辦呢？
`display: none` 改成 `visibility: hidden;`
`display: block` 改成 `visibility: visible;`
就可以保留中間的動畫，又可以讓 box 在一開始消失囉~
若你想要的是淡出，又不知道怎麼做，再留言告訴我吧~^^

# 參考資料

[^1]: [9.1. Properties from CSS - w3.org](https://www.w3.org/TR/2017/WD-CSS-transitions-1-20171130/#animatable-CSS)
[^2]: [CSS Timing Functions Level 1](https://drafts.csswg.org/CSS-timing/)
