---
title: 前端新手村 flex (下)
date: 2017-12-29 07:38:50
tags: ["2008鐵人賽", "CSS", "Flex"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# flex (下)

今天來說說，`flex` 比較讓人不好懂的部份。

## Flexibility[^1]

`flex` 的定義裡盡可能的讓 flex item 的高寬填滿容器

`flex` 的 CSS 屬性，用來定義 flex item 如何填滿容器。如何伸長分配剩餘空間，如何擠壓自己防止 flex item 超出容器

## `flex` 縮寫語法

語法

```
flex: 延伸 壓縮 預借空間
```

`flex` 裡的三個值，依序如下

1. 延伸 `flex-grow`
1. 壓縮 `flex-shrink`
1. 預借空間 `flex-basis`

預設值 `flex: 0 1 auto;`

>為了符合過去常常見的大部份的情況，所以將縮寫預設值不同於單一屬性預設值。

- `flex: initial` = `flex: 0 1 auto`
- `flex: auto` = `flex: 1 1 auto`
- `flex: none` = `flex: 0 0 auto;`
- `flex: n` = `flex n 1 0` 純以比例決定 flex item 大小

flex 可以搭配 `min-width` 和 `min-height` 改變壓縮時的幅度。

> 建議優先使用 `flex` 而不建議只用各別的 `flex-grow`、`flex-shrink`、`flex-basis`，因為縮寫預設值較符合一般使用情境

## `flex-grow`

定義 flex grow factor 伸延因數

- 預設值: 1
- 值: 負數無效

當容器的「分配空間」是**正數**時，就使用 `flex-grow`


## `flex-shrink`

定義 flex grow factor 壓縮因數

- 預設值: 1
- 負數無效

當容器的「分配空間」是**負數**時，就使用 `flex-grow`

> 縮小時，`flex-shrink` × `flex-basis`
> 依物品能夠縮小的比例。
> 目的在於「較大物品明顯減少之前，小物品不會縮到0」

## `flex-basis`

- 預設值: auto

決定容器的「分配空間」之前，每一個 flex-item 要先佔有的尺寸，換句話說，是 flex-item 對「分配空間」的「預借空間」

- 設定 `auto` 時，會去找該元素的主要尺寸設定值(`height`/`width`)做為基礎，若它們也都是 `auto` 就用內容尺寸。
- 設定 `0` 直接看圖比較實在
  ![](https://i.imgur.com/LlQkutI.png)
    - 上面是設定 `0`，設定 0，包含內容都當作是剩餘空間。
    - 下面是設定 `auto`，flex-item 尺寸內容尺寸為準，留白才算剩餘空間。

## flex 使用 margin [^2]

- 要避免在 flex item 的 `margin` 和 `padding` 使用百分比，會跨瀏覽器的問題

一般在 `flex item` 的 `margin` 的排法，寫在[排版演算法](https://www.w3.org/TR/2017/CR-css-flexbox-1-20171019/#layout-algorithm)，但是當 `margin: auto` ，flex 希望比較像是 `block` 的排版，所以有下列幾點要注意:

- 計算 `flex-basis` 時，`margin` 會直接當作 0
- 在 `justify-content` 和 `align-self` 計算之前，會先分配正數的剩餘空間給該方向的 `margin: auto`
- 若擠滿容器，主軸方向的 `margin: auto` 會忽略，不會超過 flex container。

不管你是不是看得懂這一段在寫什麼。
總之，用 flex item 要注意你是不是用了 `margin: auto`。
flex item 都使用 `flex` 處理剩餘空間了，就不應該又使用 `margin: auto` 來分配剩餘空間

# 參考資料

[^1]: [ 7.1. The flex Shorthand - w3.org](https://www.w3.org/TR/2017/CR-css-flexbox-1-20171019/#flex-property)
[^2]: [ 8.1. Aligning with auto margins - w3.org](https://www.w3.org/TR/2017/CR-css-flexbox-1-20171019/#auto-margins)
