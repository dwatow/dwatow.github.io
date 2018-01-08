---
title: 前端新手村 CSS Selector 的 Combinators
date: 2017-12-24 08:33:20
tags: ["2008鐵人賽", "Selector", "CSS"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# CSS 的 Selector Combinators[^1]

在介紹完 Simple selectors 之後，其實就可以做各式各樣的選擇，並且可以將它組成 Group。

這還沒結束， Selector 還可以用 Combinators 來將它以某種關係組合起來。

常見的應用，描述 Selector 透過 HTML 結構的耦合關係，套用特定 HTML element 的 CSS。

英文稱為 Combinators，不過我後來想一想，這個的概念像是英文的連結詞: and, but 之類的。

- Descendant combinator 後裔組合
  ```
  a b
  ```
- Child combinators  孩子組合
    ```
    a>b
   ```
- Sibling combinators  同層組合
  在考慮相鄰關係時，略過非元素節點
    - Adjacent sibling combinator  相鄰同層組合
    ```
    A+B
    ```
    - General sibling combinator 向後同層組合
    ```
    A~B
    ```

## 常見又不建議的關係整理

|邏輯|Selector|描述|
|-|-|-|
|AND|.A.B|同時擁有.A和.B|
|OR|.A, .B|只要有.A或.B|
|INCLUDE|.A .B|.B包含在.A裡|
|IN|.A > .B|.B下一層有.A|

其實，不推薦這樣理解它們。
原因在於，初學會有許許多多的疑問

- 不知道最後選到了誰
- 它們是不是運算式，有沒有先乘除後加減的規則？

還是用正確的分類一個一個來認識它們。

## 常見的應用

在 menu 或 footer 的設計上，常出現元素中間需要間隔線。

看個例子

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

span + span {
 color: red;
}
```

下次再來分享怎麼加上 `|`
(不是用 `border` 當然也不是 `outline`)

# 參考資料

[^1]: [Selectors Level 3, 6.6. Pseudo-classes - w3.org](https://www.w3.org/TR/css3-selectors/#pseudo-classes)
