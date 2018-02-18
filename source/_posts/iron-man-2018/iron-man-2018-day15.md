---
title: 前端新手村 偽元素
date: 2017-12-25 13:26:48
tags: ["2018鐵人賽", "Selector", "Pseudo-elements"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# 偽元素

偽類 不是 偽元素。
偽元素，是元素!!!會出現在 DOM 樹上，偽類不會出現在 DOM 樹上。

- 作用在 HTML element 裡的「內容」選擇器
- 使用 `::first-line`或`::first-letter`可以描述(選到的)內容的特定位置
- 使用 `::after` 或 `::before` 是「建立頭/尾內容」的偽元素

語法

```
Selector::偽元素
```

- 使用2個`:`是CSS3的規定，1個`:`也可以用的原因是對CSS1&2的相向下容性
- 一個 Selector 只能有一個偽元素

> 未來的版本會出現多重偽元素!!

## 第一行 `::first-line`

- 作用在第一行內容
- 第一行的 `inline-table`, `inline-block` CSS會失效
- 作用在 `block` 或 `table` 元素裡的 `inline` 內容(才有分行)。
- 會依寬度而影響被選到的對象(斷行就沒選到了)
- 第一行出現 `<br>` 那就是 `<br>` 之前的才算被選到
- 選出來的第一行特性接近 `inline` 元素

看個例子

```html
<DIV>
  <P>First paragraph</P>
  <P>Second paragraph</P>
</DIV>
```

其實瀏覽器會這麼讀它
> 注意
> 此例有把偽元素的作用範圍、順序精確的(以虛擬標籤的方式)標示在原始碼上。

```html
<DIV>
  <P><DIV::first-line><P::first-line>First paragraph</P::first-line></DIV::first-line></P>
  <P><P::first-line>Second paragraph</P::first-line></P>
</DIV>
```

## 第一個字 `::first-letter`

- 作用在一個字(母)
- 第一個字的 `inline-table`, `inline-block` CSS會失效
- 作用在 `block` 或 `table` 元素裡的 `inline` 內容(才有分行)。
- 第一個字的位置是圖，則沒有任何字被選上
- 標點符號起始的文章，標點符號會與字母一起被選取
    - ex1: ![](https://i.imgur.com/t9nk5TS.png)
    - ex2: ![](https://i.imgur.com/9Fswp9g.png)
- 第一個字出現 `<br>` 那就是沒有任何字母被選上
- 選出來的第一個字特性接近 `inline` 元素


**看個例子**

```css
p { color: red; font-size: 12pt }
p::first-letter { color: green; font-size: 200% }
p::first-line { color: blue }
```

```html
<P>Some text that ends up on two lines</P>
```

其實瀏覽器會這麼讀它

```html
<P>
    <P::first-line>
        <P::first-letter>
            S
        </P::first-letter>
        ome text that
    </P::first-line>
    ends up on two lines
</P>
```

結果是這樣

![](https://i.imgur.com/xCKbqdr.png)

> 注意
> 若同時設定 `::first-letter` 和 `::first-line`
> `::first-letter` 會繼承`::first-line` 的 CSS，若有衝突，會使用 `::first-letter` 的設定(會覆蓋)

### 常見的用途

"initial caps" and "drop caps"

![](https://i.imgur.com/8qTDKd3.png)

## 內容前&後 `::before` & `::after`

適用在可以裝子元素的 HTML element

- `::before` 建立第一個子元素內容
- `::after` 建立最後一個子元素內容

**使用注意**

要有 `content: ''` 這兩個偽元素才會 work ，是用來放偽元素的內容。

- 優點
    - 使用 CSS 控制是不是要加內容
- 缺點
    - SEO 不好(內容寫在 CSS)

**看個例子**

![](https://i.imgur.com/GLqxrjl.png)

```html
<span>A</span>
<span>A</span>
<span>A</span>
<span>A</span>
<span>A</span>
```

![](https://i.imgur.com/JUB7s4C.png)

透過相鄰選取器就可以選取到，就算成功了。
剩下的就是在左邊加上 `|` 就成功了

```css
span {
 position: relative;
}

span + span::after {
 content: '';
 display: block;
 position: absolute;
 top: 0;
 bottom: 0;
 margin: auto;
 width: 1px;
 height: 15px;
 background-color: #000;
 left: -2px;
}
```

下次再來分享怎麼加上 `|`
(不是用 `border` 當然也不是 `outline`)

## Selector 遺珠

### DTD

DTD: Document Type Definition
XML 的事，和網頁前端新手可以先跳過
在此不介紹

### namespace

`w3.org` 的文件的介紹，有講到 namespace[^2]

語法

```
namespace | Selector {}
```

CSS 的 Selector 會有 `|` 出現。
不過，在此不討論 namespace。

# 參考資料

[^1]: [7. Pseudo-elements - w3.org](https://www.w3.org/TR/css3-selectors/#pseudo-elements)
[^2]: [ @namespace - MDN](https://developer.mozilla.org/zh-TW/docs/Web/CSS/@namespace)
