---
title: 前端新手村 從空白頁開始
date: 2017-12-11 07:46:27
tags: ["2008鐵人賽", "HTML"]
categories: "前端新手村"
---

> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻


## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# 從空白頁開始


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>

</body>
</html>
```


- 語法不區分大小寫[^1]
- `<!DOCTYPE html>` 告訴瀏覽器，這是 HTML5 的檔案[^2]
- `<head>` 和 `<body>` 分別是用來記載檔案的「檔頭」和「資料」，電腦中較為複雜的檔案，都會具備這兩個部份。

## meta
`<meta http-equiv="X-UA-Compatible" content="ie=edge">` 記錄此檔案要相容於 IE 的什麼版本[^3]，究竟還有沒有必要留，如果你的網站主要是為了 IE 而生就可以不用留了，其它的時候，還是設定一下吧！[^4]

有一種 meta 標籤，有 `name` 的屬性，表示這是設定哪方面的meta。
例如:
```
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
影響使用者是否可以用兩隻手指縮放網頁。
影響瀏覽器是否使用渲染解析度顯示網頁(行動版排版)，還使用物理解析度顯示網頁(桌機版排版)

## 所謂的切版

在早期，網頁還沒這麼複雜時，其實工作並不是分工進行的。
設計加一些簡單的語法就可以把網頁呈現出來了，而這樣的工作，就是「切版」。

「切版」，是一個動作，將視覺設計好的PSD，變成HTML+CSS，然後提供後端的工程師。[^5] 現在看起來也太黑心了，不過當年真的還有人就這麼賣起來了。

## 古早味的網頁製作

過去的網頁設計與現今有很大的不同，就來聊聊有什麼過去慣用，而現在不使用的手法吧。

後來手機導致響應式網頁設計(Responsive Web Design)(簡稱RWD)的廣為流行，讓切版的工作的複雜度與工作量變得更大更複雜。

### table 排版

`table` 排版，可以說是 2002年左右的切版神器。
就連知名歌手的官方網站，都是PSD轉出來的table語法組成的!!

不過，之後手機的廣為流行，改變了世界，也改變了網頁的製作方式。RWD的需求大增之後，使用 `div` 切版的技術就成為主流了。

### frame 排版

在 `table` 排版的時代，側邊欄流行用 `frame` 切割瀏覽器的方式，記得知名網站「史萊姆的第一個家」也`frame` 這樣製作的呢！當年還有「網頁製作百寶箱」之類的網站，教巢狀式 `frame` 一次只要切割兩格，有需要再將其中一格切成兩份，整個看起來就變三份了。

這樣的技術，也隨著時代而消失了。

## Mobile First

現在切版的觀念之一是: mobile first。
也就是手機優先考慮，換句話說，一定要 RWD。

加上平板電腦的出現，手機各種尺寸的機海戰術，前端工程師的工作複雜度大幅提高。
這也影響了設計師與前端工程師的工作分離。
接著UX的觀念、Ajax技術的廣為流行
後端工程師無法一直cover在前端裡的有工程師特性的工作(其它的設計師處理)。

接下來的文章，就開始來介紹這個時代製作網站的技術吧！^^


# 參考資料

[^1]: [HTML 5.1 2nd Edition](https://www.w3.org/TR/html5/syntax.html#doctype)
[^2]: [Recommended Doctype Declarations to use in your Web document.](https://www.w3.org/QA/2002/04/valid-dtd-list.html)
[^3]: [【HTML教學】X-UA-Compatible設置IE兼容模式](http://injerry.pixnet.net/blog/post/57042465-%E3%80%90html%E6%95%99%E5%AD%B8%E3%80%91x-ua-compatible%E8%A8%AD%E7%BD%AEie%E5%85%BC%E5%AE%B9%E6%A8%A1%E5%BC%8F)
[^4]: [https://www.w3.org/blog/2008/01/ie8-versioning-mechanism/](https://www.w3.org/blog/2008/01/ie8-versioning-mechanism/)
[^5]: [[新手前端]前端工程師和「切版的」有什麼不同?](https://blog.chibc.net/learning/uibeginner-daily/829)
