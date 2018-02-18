---
title: 前端新手村 Media Query
date: 2017-12-31 07:18:37
tags: ["2018鐵人賽", "CSS", "Media Query"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# Media Query[^1]

它是由一個 [media type](https://www.w3.org/TR/CSS22/media.html#media-groups) [^2]  和 media feature 的條件式組成。條件式的結果，不是 true 就是 false

## 有幾個地方可以使用

在 html 插入 css 時加條件。

```html
<link rel="stylesheet" media="screen and (color)" href="example.css" />
```

在 css 插入 css 時加條件。

```css
@import url(color.css) screen and (color);
```

在使用 css 時加條件

```css
@media all and (min-width:500px) { ... }
@media (min-width:500px) { ... }
```

media type 是 `all` 時，可以省略。

```css
@media (orientation: portrait) { ... }
@media all and (orientation: portrait) { ... }
```

`@media` 的條件可以用 `,` 和 `and` 組成。
- `, ` 和 CSS 的 Combinators 一樣
- `and` 就是「邏輯 AND」

```css
@media screen and (color), projection and (color) { ... }
```

如果沒有給 media type 和 條件式，結果 always true

```css
@media all { ... }
@media { ... }
```

在寫 media query 一開始，可以用 `not` 做「邏輯 NOT」

```html
<link rel="stylesheet" media="not screen and (color)" href="example.css" />
```

```css
@media not screen and (color) { ... }
```

對於比較舊的 CSS 可以用 `only` ~~給 IE~~


```html
<link rel="stylesheet" media="only screen and (color)" href="example.css" />
```

可以在 `@import` 時加上 media query 的條件

```css
@import url(example.css) screen and (color), projection and (color);
```

使用時要注意 media type 和 media feature 的單位是否匹配，若不適用會使結果變成 false

## Media features

雖然 media query 在撰寫時，有一種在寫 css 的感覺。但是們還是有一些要注意的地方

- 的內容是「輸出設備的要求」。
- 不可以使用 `>` 和 `<` 取代常出現的 `max-` 和 `min-` 前綴字。
- 常使用 `max-` 和 `min-` 前綴字的屬性也可以單獨使用
- 可以只有屬性，也可以指定值(0可以不給單位)
- 使用 `max-` 和 `min-` 的前綴字時，一定要給值才有作用
- 不可以使用 `calc()`，只能在一個屬性後面給一個簡單的值。

### 有這些 Media features 可以使用

|media feature|value|Applies to which media type | prefixes|
|-|-|-|-|
|width|length|visual, tactile|yes|
|height|length|visual, tactile|yes|
|device-width|length|visual, tactile|yes|
|device-height|length|visual, tactile|yes|
|orientation|"portrait", "landscape"|bitmap|no|
|aspect-ratio|"ratio"|bitmap|yes|
|device-aspect-ratio|"ratio"|bitmap|yes|
|color|integer|visual|yes|
|color-index|integer|visual|yes|
|monochrome|integer|visual|yes|
|resolution|resolution|bitmap|yes|
|scan|"progressive", "interlace"|tv|no|
|grid|integer(1 or 0)|visual, tactile |no|

- width/height: 可視區大小
- device-width/device-height: 單一螢幕大小
- orientation: 橫向/縱向顯示
    - `@media all and (orientation:portrait) { … }`
    - `@media all and (orientation:landscape) { … }`
- aspect-ratio: width/height 視窗寬高比
- device-aspect-ratio: device-width/device-height 設備寬高比
    - `@media screen and (device-aspect-ratio: 16/9) { … }`
	- `@media screen and (device-aspect-ratio: 32/18) { … }`
	- `@media screen and (device-aspect-ratio: 1280/720) { … }`
	- `@media screen and (device-aspect-ratio: 2560/1440) { … }`
- color: 在彩色顯示器中，值代表每個顏色至少幾bit
    - `@media all and (color) { … }`
      `@media all and (min-color: 1) { … }`
- color-index: 自訂調色盤(顏色查表法)大小
    - `@media all and (color-index) { … }`
    - `@media all and (min-color-index: 1) { … }`
    - `<?xml-stylesheet media="all and (min-color-index: 256)" href="http://www.example.com/…" ?>`
- monochrome: 在單色顯示器中，值代表每個像素幾bit
    - `@media all and (monochrome) { … }` 黑白畫面
    - `@media all and (min-monochrome: 2) { … }`
    - `<link rel="stylesheet" media="print and (color)" href="http://…" />`
      `<link rel="stylesheet" media="print and (monochrome)" href="http://…" />`
- resolution: pixel 密度(dpi 或 dpcm)
    - `@media print and (min-resolution: 300dpi) { … }`
    - `@media print and (min-resolution: 118dpcm) { … }`
- scan: 顯示器掃描線的方式，其值等同於 1080i 和 1080p 的字尾英文意思
    - `@media tv and (scan: progressive) { … }`
- grid: 像是 terminal 或者是固定寬度字體的顯示方式
    - `@media handheld and (grid) and (max-width: 15em) { … }`
    - `@media handheld and (grid) and (device-max-height: 7em) { … }`

## 常見的應用

**例子1: RWD (以 bootstrap 為例)**

桌機版
![](https://i.imgur.com/YvyIxrR.png)


手機版
![](https://i.imgur.com/mbadJh9.png)


來看看這個 `.col-sm-8
```css
.col,  /*...*/.col-sm-8 /*...*/ {
    position: relative;
    width: 100%;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
}
```
```css
@media (min-width: 576px) {
/* ... */
    .col-sm-8 {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 66.666667%;
        flex: 0 0 66.666667%;
        max-width: 66.666667%;
    }
/* ... */
}
```
`.col-sm-8` 預設是寬度 100%，
是在任何的 media 中可視區 576px 以上，最大寬度改成 66.666667%;


**例子2: 瀏覽與預覽列印**

找一個頁面來看看

![](https://i.imgur.com/6eR8ghR.png)

進入列印的預覽

![](https://i.imgur.com/ckySHZ8.png)

發現不同了嗎？

來看看 CSS 發現側邊欄 `#mw-navigation` 和其它的 selector 在列印中有設定隱藏。

```css
@media print {
    .noprint,
    .catlinks,
    .magnify,
    .mw-cite-backlink,
    .mw-jump,
    .mw-editsection,
    .mw-editsection-like,
    .mw-hidden-catlinks,
    .mw-indicators,
    .mw-redirectedfrom,
    .patrollink,
    .usermessage,
    #column-one,
    #footer-places,
    #jump-to-nav,
    #mw-navigation,
    #siteNotice,
    #f-poweredbyico,
    #f-copyrightico,
    li#about,
    li#disclaimer,
    li#mobileview,
    li#privacy {
        display: none
    }
    /* ... */
}

```

# 參考資料

[^1]: [Media Queries - w3.org](https://www.w3.org/TR/2012/REC-css3-mediaqueries-20120619/)
[^2]: [7 Media types - w3.org](https://www.w3.org/TR/CSS22/media.html#media-groups)
