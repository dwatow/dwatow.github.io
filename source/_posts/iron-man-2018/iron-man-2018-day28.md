---
title: 前端新手村 Animations (上)
date: 2018-01-07 09:18:19
tags: ["2018鐵人賽", 'CSS', "animation", "keyframes"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# Animations (上)

CSS 的 Transition 讓我們可以簡單的做出「過場動畫」，不過動畫本身的參數(開始與結束的值)，是由現有的屬性決定，無法對動畫做出更多的控制。

所以，有了 Animations
- 權重: 原本的 CSS 屬性 < `@keyframe` < `!important`
    - firefox 符合標準，套用 `!important` 無視是否有 `transition`
    - Chrome 無視 `!important`
- 將 CSS 屬性設定在一組 `@keyframe` 。
- 類似 `transition` 的方式，在一段時間之內改變 CSS 屬性值。差別是自動觸發 `animations` 的每一段動畫。
- 可控制播放次數、暫停、執行、定格。
- 動態修改 animation 屬性，並不會造成 animation 重新開始

若元素設定 `display: none` 時設定動畫，若又將元素設定 `none` 以外的 `display` 設定值，就重新套用動畫。(transition 的痛點)

## `@keyframes`[^1]

frames 有翻成 影格、幀 ，amination 最大的色就是將所有和動畫有關的屬性都寫在這。

語法

![](https://i.imgur.com/U4TjG72.jpg)

- CSS 權重次於 `!important` (測試結果 firefox 符合, Chrome 不符合)
- keyframe selector 可以是 `from` `to` ，也可以是 `0%` `100%`，也可以混搭
    - `from` = `0%` ， `to` = `100%`
    - 不在 `0%~100%` 的百分比數字無效。
    - `0%` 不可以寫 `0`
    - 若沒 `0%` 或 `100%` ，自動抓元素本身的 CSS 設定值來當「沒有設定的動畫頭尾」
- keyframe name 使用 `jump` 還是 `"jump"` 都是等價的，大小寫視為不同。
    - 關鍵字(這時大小寫視為相同): `none`, `initial`, `None` (不可以取這些名字)
- declaration-list 可以使用任何的 CSS 屬性，不過它不參與 CSS cascade，所以會忽略 `!important` (不管它設在 keyframe 裡還是外)


```CSS
/* 這兩個等價 */
@keyframes foo { ... }
@keyframes "foo" { ... }

/* 這個與上面兩個不等價 */
@keyframes FOO { ... }

/* 下面的都是無效 */
@keyframes "initial" { ... }
@keyframes "None" { ... }
@keyframes initial { ... }
@keyframes None { ... }
```

## `animation-name`[^1]

```CSS
.box {
    animation-name: 動畫名稱;
}

@keyframe 動畫名稱
```

預設值: `none` (無動畫)
可用在偽元素身上

## `animation-duration`[^1]

定義: 單位動畫週期，所需要的時間
值: 時間(R+ 正實數)
預設值: `0s`

設定 `0s` 看起來和原本樣，但是 animation 的功能還是會跑一次。

## `animation-timing-function`[^1]

值: timing function 名稱
預設值: ease

animation 的 `@keyframe` 變化函數。

## `animation-delay`[^1]

值: 時間(R 實數)
預設值: `0s`

這個屬性控制兩件事

1. animation 執行時間
1. animation 顯示時間

設定值有兩種變化
- 設定值為正數( n)時
    - 執行時間和顯示時間都會延遲
    - 觸發動畫開始的 event (js)
- 設定值為負數(-n)時
    - 只有顯示時間延遲，執行時間延遲
    - 會有「起始動畫到 n 秒」的效果
    - 觸發動畫結束的 event (js)

只有第一個週期的 animation 才會受此值影響


## 常見的雷

**觸發動畫的關鍵**

觸發動畫的關鍵，是名稱。
在 `:hover`  時加了名稱(其它都設定好了)，保證動畫從 `0%` 開始播放。
但是，若是在 `:hover` 時加了時間(其它都設定好了)，不保證動畫從 `0%` 開始播放。

給一段正常的原始碼

```CSS
.box {
  height: 100px;
  width: 100px;
  border: 1px solid black;

  animation-duration: 5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-fill-mode: none;
}

:root:hover .box {
  animation-name: colorful;
}

@keyframes colorful {
  from {
    background-color: #fee;
  }

  50% {
    background-color: #efe;
  }

  to {
     background-color: #eef;
  }
}
```

將它改成不正常的情況

```CSS
.box {
/* ... */

  /* animation-duration: 5s; */
  animation-name: colorful;
/* ... */
}

:root:hover .box {
  /* animation-name: colorful; */
  animation-duration: 5s;
}
```
# 參考資料

[^1]: [CSS Animations Level 1 - w3.org](https://www.w3.org/TR/CSS-animations-1/)
