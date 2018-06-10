---
title: 前端新手村 Animations (下)
date: 2018-01-08 07:26:06
tags: ["2018鐵人賽", 'CSS', "animation", "keyframes"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# Animations (下)

昨天，我們介紹了動畫一半的屬性，今天介紹在動畫播時，還有哪些特別的控制。

因為動畫可以自動觸發，所以可以重複播放，暫停，甚至可以控制正向播放或倒轉播放。

要了解動畫有幾個重點
1. 套用動畫的元素 → 由 `animation-name` 控制
2. 動畫播放開始 → 由`animation-delay` 控制
3. 動畫播放結束 → 由`animation-duration` 和 `animation-iteration-count` 控制

## `animation-iteration-count`[1]

指定動畫循環播放(0%~100%)的次數， 1 起始計數。

預設值: `1`
值: 正整數

特別的值
- `0` (瞬間跑完動畫)
- `infinite` 無限次數

和其它值的關係
- `animation-direction: alternate*` ，正反向算兩趟

## `animation-direction`[1]

指定動畫播放的順序是正向 (0%→100%) 或反向 (100%→0%)。

預設值: `normal`

可設定的值
- `normal`: 正向 (0%→100%)
- `reverse`: 反向 (100%→0%)
- `alternate`: 奇數正向，偶數反向
- `alternate-reverse`: 奇數反向，偶數正向

## `animation-play-state`[1]

動畫播放 `play` 還是 `pause` 狀態

預設值: `play`

可設定的值
- `play`: 動畫會正常跑
- `pause`: 動畫會暫停(停格在某一個 frame)

不管設定在哪一個值，元素依然套用 `@keyframes` 的 CSS，而(若有重疊的話)不會吃設定在元素本身的 CSS。

## `animation-fill-mode`[1]

動畫播放(元素套用動畫狀態)的前後，是否要繼續套用動畫的CSS值。

預設值: `none`

可使用的值
- `none` 前後都套用原本的CSS值
- `forwards` 只有前面套用原本的 CSS 值
    - 在播放次數 > 0 時，最後的 CSS 是套用上一次動畫的結束狀態 (不是下一次的開始值)
    - 在播放次數 = 0 時，最後的 CSS 是套用動畫的起始狀態
- `backwards` 只有後面套用原本的CSS值
    - 動畫開始之前，套用下一次的起始狀態
- `both` 前後都不要套用原本的CSS值
    - 元素一直都在動畫狀態內

## 遺珠
- `animation-fill-mode` 和 `will-change` 之間的關係
- `animation` 觸發 js 的 動畫 event

## 套件

[Animation.css](https://daneden.github.io/animate.css/)
這個套件的好處，就是知道動畫的名字，好跟人溝通。
好學好上手。

# 參考資料

[1]: [CSS Animations Level 1 - w3.org](https://www.w3.org/TR/CSS-animations-1/)
