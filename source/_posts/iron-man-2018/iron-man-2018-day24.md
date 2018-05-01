---
title: 前端新手村 都市傳說之隱藏元素的手法
date: 2018-01-03 07:38:38
tags: ["2018鐵人賽", "display", "visibility", "opacity", "Render tree"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# 都市傳說之隱藏元素的手法

- `visibility: hidden`
- `display: none`
- `opacity: 0`

## visibility [^1]

指的是無論有無渲染，都會佔有 layout 空間。

- visible
  萬物預設值，設定此值，box 可以顯示在畫面上
- hidden
  box 不可顯示在畫面上，完全透明，但是仍佔空間。若容器設定 `visibility: hidden` ，而元素 設定 `visibility: visible` 元素是可見的。
- collapse
  和 `hidden` 的設定值一模一樣。此關鍵字是參考 table 的動態跨欄或跨列效果。

## diaplsy [^2]

`display` 會影響自身元素與包在元素內的子元素們，是否被生成在畫面上。[^3]

預設值: `inline`

- block
生成一個 block 的元素
- inline-block
生成一個 inline-block 的容器，容器與容器外元素之間是 inline 關係，容器與容器內元素是 block 關係。
- inline
生成一個 inline 的元素
- list-item
生成一個 block 元素，並且在開頭會有標記。
- none
沒有任何元素會在生成，並佔據排版空間。
容器設定 `display: none` , 元素設定 `display: block` 元素還是不會顯示。
- 其它 `table`, `inline-table`, `table-row-group`, `table-column`, `table-column-group`, `table-header-group`, `table-footer-group`, `table-row`, `table-cell`, `and table-caption` 讓元素有 table 的表現形式。欲知詳情可以查看 [17 Tables](https://www.w3.org/TR/CSS22/tables.html) [^4]

## opacity [^5]

`opacity` 不透明度，可以被認為是最後處理的步驟，在元素被渲染在畫面上後，再將畫面區域的不透明度加上去。

值: alpha 值(0~1的實數)

容器設定不透明度，則容器內的元素也會有相同的不透明度。

## 整理一下

|屬性|佔據空間|子元素獨立設定|
|-|-|-|
|`display: none`| no | no |
|`visibility: hidden`| yes | yes |
|`opacity: 0`| yes | no |


## 從瀏覽器渲染引擎來看 [^6]

先看一下 Webkit(chrome, safari) 的流程圖[^7]
![webkit 的流程圖](https://i.imgur.com/Ex41AeZ.png)

再看一下 Gecko(firefox) 的流程圖[^7]
![gecko 的流程圖](https://i.imgur.com/LrgHZst.png)

在 Gecko 裡的術語在 render tree 的 element 叫 frame。在 webkit 稱 render 或 render object。而每一個 element 都知道它自己的 child element

webkit 瀏覽器會建立一棵叫 Rendering Tree (渲染樹)的資料結構。讓內容可以依照正確的順序繪製。每一個 element 都代表一個矩形區域，通常是符合 CSS2 的 box 規範。
在 render tree 階段，每一個 box 的形態，會受到 display 設定的影響。

看看 webkit 的程式碼。

```c++
RenderObject* RenderObject::createObject(Node* node, RenderStyle* style)
{
    Document* doc = node->document();
    RenderArena* arena = doc->renderArena();
    ...
    RenderObject* o = 0;

    switch (style->display()) {
        case NONE:
            break;
        case INLINE:
            o = new (arena) RenderInline(node);
            break;
        case BLOCK:
            o = new (arena) RenderBlock(node);
            break;
        case INLINE_BLOCK:
            o = new (arena) RenderBlock(node);
            break;
        case LIST_ITEM:
            o = new (arena) RenderListItem(node);
            break;
       ...
    }
    return o;
}

```

所以 `display: none` 不會把 DOM tree 的元素放到 render tree 上，但是 `visibility: hidden` 會放到 render tree。所以 DOM tree 和 render tree 並非完全有對應關係。

![](https://i.imgur.com/FjcIu6q.png)

上圖所示，HTML 中的 head 就是設定 `display: none` 。

畫面渲染結束，才會使用 `opacity` 設定畫面不透明度。

# 參考資料

[^1]: [11.2 Visibility: the 'visibility' property - w3.org](https://www.w3.org/TR/CSS22/visufx.html#visibility)
[^2]: [17.5.5 Dynamic row and column effects - w3.org](https://www.w3.org/TR/CSS22/tables.html#dynamic-effects)
[^3]: [9.2.4 The 'display' property - w3.org](https://www.w3.org/TR/CSS22/visuren.html#display-prop)
[^4]: [17 Tables - w3.org](https://www.w3.org/TR/CSS22/tables.html)
[^5]: [3.2. Transparency: the ‘opacity’ property - w3.org](https://www.w3.org/TR/CSS-color-3/#opacity)
[^6]: [Render tree construction](http://taligarsiel.com/Projects/howbrowserswork1.htm#Render_tree_construction)
[^7]: [深入探討瀏覽器引擎如何進行解析](https://ithelp.ithome.com.tw/articles/10191579)
