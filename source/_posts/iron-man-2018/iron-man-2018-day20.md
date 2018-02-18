---
title: 前端新手村 flex grow & shrink 演算法
date: 2017-12-30 07:13:55
tags: ["2018鐵人賽", "flex-grow", "flex-shrink", "Flex"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# flex grow & shrink 演算法

> 此演算法，是和邦友 [OTree](https://ithelp.ithome.com.tw/users/20107334/profile) 一起研究，我只是寫 JavaScript 驗證。

新手若覺得這種學術路線不適合你，那這一篇就跳過吧！我還是想寫一下。

來說說伸縮與壓縮的尺寸計算方式
直接用例子來試算一下。[^1]

```html
<div class="outter">
  <div class="div1"></div>
  <div class="div2"></div>
</div>
```

```css
.outter {
  outline : solid 1px black;
  display: flex;

  .div1 {
    height:100px;
    background : red;
    flex-grow:5;
    flex-shrink:5;
    flex-basis:400px;
  }

  .div2 {
    height:100px;
    background : blue;
    flex-grow:1;
    flex-shrink:1;
    flex-basis:200px; //預借空間
  }
}
```

**渲染結果**

![](https://i.imgur.com/FpQeB3q.png)

**描述問題**

元素 $i$ (每個元素) 在 flex container 中，因為伸展和壓縮，需要重新計算寬度。

運算式的名詞定義

![](https://i.imgur.com/nK4Baef.png)

## `flex-grow`

運算式如下

![](https://i.imgur.com/P6dZATs.png)

由公式可以看出(真的可以看出嗎？)

最後的寬度，是由預借空間加上「伸展量」
伸展量是該元素佔有剩餘空間的比例。
(描述這個，跟本就是數學運算式要轉成國小應用問題的能力)

## `flex-shrink` & `flex-basis`

運算式如下

![](https://i.imgur.com/wnMAhMG.png)

由公式可以看出(真的可以看出嗎？)

最後的寬度，是由預借空間加上「壓縮量」(負數)
壓縮量是該元素的預借空間佔有剩餘空間的比例。


# 參考資料

[^1]: [flex-basis excerise](https://codepen.io/dwatow/pen/Nwmojy)
