---
title: 想讓 Google 翻譯的畫面直排
date: 2018-05-01 07:46:32
tags: 
- CSS
categories: 
- 技術心得
---

# 想讓 Google 翻譯的畫面直排

有時候，我們想要邊逛一些英文網站，一邊使用 Google 翻譯。
但是當螢幕排成橫自併排時，Google 卻不能理想的將原文與翻譯結果放在上下做對照，原本預設的排版是橫排。

這個我試了很久，終於讓我找到一個最小修改的方法

今天就讓我們來解析 Google 翻譯的排版，並且以最小改動的方式將排版改成直排吧！

## 先教怎麼改

1. 找 `gt-src-c` 和 `gt-res-c` ，位置大概是在這。

   ![](https://i.imgur.com/7QpRi7n.png)

   它有一個屬性 `width: 50%;`

   ```css
   #gt-src-c, #gt-res-c {
       width: 50%;
       margin: 0;
   }
   ```

   改成 `width: 100%`

1. 找 `gt-c` ，位置大概是在這。

   ![](https://i.imgur.com/18byang.png)

   它有一個屬性 `min-width: 765px`

   ```css
   #gt-c {
       min-width: 765px;
       position: relative;
       max-width: 100%
   }
   ```

   將 `min-width: 765px` 取消。

1. 改好了
   畫面就可以併排，而且可以像這樣使用
   ![](https://i.imgur.com/JgRwYBM.png)

## 來解釋一下原理吧！

### `gt-src-c` 和 `gt-res-c`

這兩個元素的排版，主要是靠 `float` 一左一右

1. `float` 是為了處理元素「內容可以並排」(或文繞圖)，使 `block` 重疊的情況。在此並沒有看見，因為同層的元素都是 `float` 。改變可橫排元素寬度，即可決定元素要橫排還是直排(橫排會斷行)，所以在此只要將寬度改成 `100%`

2. 而同層的元素 `gt-promo-lr` ，出現 `display: inline-block` 與 `float` 共用的情況。
   ![](https://i.imgur.com/Zxu9cbq.png)

我個人覺得，這樣不是很好，因為 `inline-block` 是一種允許 `block` 之間排列用 `inline` 排版方式，算是排橫的語法重複使用。

3. `float` 和 `clear` 搭配使用，在這並沒有看見，不過倒是在 `gt-text-top` 看見了「定訂最小高度」。

![](https://i.imgur.com/RCr2QCX.png)

我個人也覺得這樣並不是很好，因為內容排版方式改變，其實容器就無法容納內容元素，即使使用了 `min-height` 也一樣。

改成直排之後，其實 `gt-text-top` 變這樣

![](https://i.imgur.com/IeQbtd6.png =300x)

原因是元素都受 `float` 影響，早就不在 `block` 佔任何面積，所以其實 `gt-text-top` 裡早就不存在任何佔有面積的元素內容了。

## `gt-c`

在此視它是一個容器，內容物的大小，大多使用百分比決定。並且在容器設定了一個 `min-width: 765px` ，找不到為什麼使用 `765px` ，但是在此 Google 要限制最小寬度，當 `viewport` 再變小，就開始出現捲軸，所以要將這個縮小的限制打破，讓它可以在縮小視窗時，還是可以顯示所有內容。
