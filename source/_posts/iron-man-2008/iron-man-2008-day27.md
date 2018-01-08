---
title: 前端新手村 Animations (前傳)
date: 2018-01-06 10:01:14
tags: ["2008鐵人賽", "CSS", "animation", "transition"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# Animations (前傳)

不是只有 Start Wars 才有前傳，Animation 也要來一下前傳。

前傳介紹「Animations 像 Transition 的部份」

Animations 和 Transition 很像。但是卻不完全一樣，今天先來談談如何快速上手 Animation ，如何在熟悉 Transition 的情況之下，可以快速的上手 Animation。又為何要使用？

在這一部份，先介紹它最簡單的部份，當作 強大的 Transition 使用要怎麼用？

## `animation` 快速上手

語法

```
animation: 動畫名稱 持續時間
```

沒錯就是這麼簡單，我們複習一下 `transition` 來看看差在哪？

```
transition: CSS屬性 持續時間;
```

差在 原本指定要 `transition` 的CSS屬性，改成 `animation` 的「動畫名稱」。
「動畫名稱」指的是，設定的 `@keyframe` 的命名，指定要改變的 CSS屬性 就寫放置在這。[^1]

## `@keyframe` 快速上手

語法
```
@keyframe 動畫名稱 {
    from {
        CSS 屬性: 值
    }
    to {
        CSS 屬性: 值
    }
}
```

在使用 `transition` 時，直接寫在每個 Selector 裡的 CSS 屬性，在 `animation` 時，搬到了一個叫 `@keyframes` 的獨立區塊。


## 何時使用？

使用 `transition` 時，往往都是用在 CSS Selector 轉換之間，需要顯示中間的過渡畫面。

1. Selector 通常不會自動觸發(除非使用 JS 的 `setInterval()` 之類的計數器)，必須要透過「互動」才會`觸發`。例如: 滑鼠點擊/移動、鍵盤輸入...之類的。
2. 過渡畫面的顯示次數，通常只有 `1 次`。

但是 `animation` 並沒有這方面的限制。

1. `animation` 可以控制播放次數，而且可以`擁有 CSS 時`，就開始播放。
2. 設定播放 `animation` 的次數。


看個比較的例子

**先用 `transition` 做看看**

```html
<input type="checkbox"> 移動 box
<div class="box"></div>
```

```css
.box {
  height: 100px;
  width: 100px;
  border: 1px solid black;
  position: relative;
  left: 0px;
  transition: left .3s;
}

input:checked + .box {
  left: 30px;
}
```

![](https://i.imgur.com/YaAwKZg.gif)


1. 觸發(換 CSS )的方式: `click`
2. 次數 always 1次/click


**用 `animation` 做看看 1**

`載入`時，播放 `10 次`

只要改 CSS，將屬性 改成 `@keyframe` 的名稱
並且將要動畫的屬性 `left` ，放到動畫播放的位置

```css
.box {
  height: 100px;
  width: 100px;
  border: 1px solid black;
  position: relative;
  left: 0px;
  /* transition: left .3s; */
  animation: movebox .3s 10;
}

@keyframes movebox {
  /* input:checked + .box {*/
  50% {
    left: 30px;
  }  
}
```

![](https://i.imgur.com/fAjrpjD.gif)

1. 觸發方式: 畫面載入，擁有 `animation` 就會動
2. 次數: 10次


**用 `animation` 做看看 2**

`載入` 時，播放 `10 次`

```css
.box {
  height: 100px;
  width: 100px;
  border: 1px solid black;
  position: relative;
  left: 0px;
}

input:checked + .box {
   animation: movebox .3s 10;
}

@keyframes movebox {
  50% {
    left: 30px;
  }  
}
```

![](https://i.imgur.com/9pNdzEL.gif)


## 常見的雷

如果想要「混用 `transition` 和 `animation` 」呢？

可以!! 但，其實不建議，如果使用到相同的屬性時， `animation` 顯得強勢多了。

`transition` 的權重，是依照 CSS Cascade 的方式。
但是 `animation` 卻是超越這一切(甚至是 `!important` 的權重)，獨立而強加的渲染 `animation` 設定的屬性。

一樣設定一個 box
在點擊 `checkbox` 時，box 的 `animation` 會搖十下。
在 `hover` 時，box 的 `transition` 會下降 `30px` 並且變紅色。


```css
.box {
  height: 100px;
  width: 100px;
  border: 1px solid black;
  position: relative;
  left: 0px;
  top: 10px;
  transition: .3s;
}

.box:hover {
  top: 30px;
  background-color: #f00;
}

input:checked + .box {
   animation: movebox .3s 10;
}

@keyframes movebox {
  0%, 100% {
    top: 10px;
  }
  50% {
    left: 10px;
  }
}
```

![](https://i.imgur.com/PYy7aF0.gif)


實際測試結果發現。

- 相同屬性的 `top` 在動畫播放時間，就算 `hover` box 還是吃 `animation` 的 `top: 10px` ，一直持到十搖完，才吃得到 `transition` 的 `top: 30px;`。
- 不同屬性的 `background` 不管是不是在動畫播放時間，都會在 `hover` 時，讓 box 變紅色。


# 參考資料

[^1]: [3. Animations - w3.org](https://www.w3.org/TR/css-animations-1/#animations)
