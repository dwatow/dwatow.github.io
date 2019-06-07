---
title: 認識 meta viewport
date: 2019-04-16 09:48:51
tags: ["viewport", "RWD"]
categories: ["聽演講", "技術心得"]
---

# 認識 meta viewport

```html=
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

在這一段，寫了很多 `viewport` 的 `content` 設定字串。
這篇文章就是想來聊聊這些東西

## 前導觀念

首先，要先知道 `viewport` 有兩種

1. visual viewport^[[VisualViewport - MDN](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)]
2. layout viewport

### visual viewport

Visual viewport 是一個 js 物件，就存在 window 物件之下。可以在瀏覽器的 console 中找到它的寬度

用螢幕看，就等同於 `screen.width` 的值

```javascript=
visualViewport.width; // = screen.width
```

### layout viewport

在使用模擬器看手機排版時，可以用如圖的方式看見目前的 layout viewport 大小

![](https://i.imgur.com/EB5ugA8.png)

一般而言，瀏覽器會給一個預設值，而這個值，會因設備而異，而 Apple 的設備，預設值是 `980px` [^ref1](後面就知道怎麼找預設值)

## 設定字串

`width=device-width`

用來設定 layout viewport 的寬度，改變設備提供的預設值

`initial-scale=1.0`

有個江湖上的算法[^ref1]

```
initial-scale = visual viewport / layout viewport
```

若 `initial-scale` 值沒有設定，有時也是會正常的原因是因為有設定 `width` (layout viewport)

> **設定 initial-scale 或 width** 二選一
> 有時候會覺得這兩個變數設定其中一個就好了。

### 手機直置變橫置，會出現無法預測的縮放行為

**若兩個都不設定**
`scale` 最後的值也許會變成瀏覽器用預設值算出來的結果

[^ref1]: [消除 viewport 的疑惑-移動網頁開發](https://www.zybuluo.com/gongzhen/note/170557)
