---
title: 前端新手村 HTML的作用
date: 2017-12-13 07:46:53
tags: ["2008鐵人賽", "HTML"]
categories: "前端新手村"
---
> 「當你迷惘的時候，就回到原點想一想」-中華一番 蘭飛鴻

## 前言

網頁前端新手村系列文章，宗旨並不在技術本身的教導，重點放在技術與技術之間的脈胳關係。讓零碎的網頁前端技術的關鍵字，成為比較有系統性的視野。

讓一開始接觸網頁前端的新手們，有一個比較友善的系統來架構你的學習，至於技術本身的深入探討，就留給其它的高手們吧。

# HTML的作用

先破題， HTML 是網頁的資料結構。
HTML ，是「 HyperText Markup Language 」的縮寫，它是一種標記語言，並不是程式語言。

現在所訂定的HTML5，是由2008年提出的工作草案[^1]，受許多其它類似的標準影響，成為比以往的HTML更嚴謹的語法。

HTML 檔案是一種文字檔案，內容就只有一種資料型別: 文字(`String`)。

> node = element object (在js看html才會叫node)
> element = `<tag></tag>` 把 html 當文字

## 語法

HTML的語法表示法，據我所知，有三種寫法。
1. 有頭有尾的嚴註表示法
最常見的就是這一種，將資料內容夾在兩個 tag 中間。

```html
<div>資料</div>
<span>資料</span>
<script>資料</script>
<style>資料</style>
```

2. element 就是「要顯示的非文字」資料的表示法
本身就是資料，並無法再放置任何的資料進 element 。(很重要)

```html
<img href="" />
<br />
```

3. 描述、無資料的表示法
最後這一種，大多只是用來描述 HTML 檔案的特性描述，本身並不參與顯示。這種描述的內容，會影響瀏覽器如何渲染網頁。

```html
<meta>
<link>
```

以第一種，來介紹語法結構，就可以涵蓋其它兩種了

```html
<tagName attributeName="attributeValue">Content</tagName>
```

### Tag name

tag name 的用處，大多是用來決定該資料的型別，預設渲染方式。

如果把 HTML 當作是一種 XML ，那麼瀏覽器就是大家都說好的一種 Parser。
XML 是一種可以自訂 tag name 的標記語言，但是如何解讀或處理該tag name卻是沒有一致的標準。而 HTML 有(大約)一致的處理標準。

w3school 有[列表](https://www.w3schools.com/tags/ref_byfunc.asp)，可以看一下有哪些

###  Name

Attribute name 對資料的細部設定選項。(後面簡稱 attribute )

在 CSS 出現之前，有許多關於對齊、排版的 attribute 還在HTML裡面，一直到 HTML5 標準出來，才將這一切撥亂反正。排版歸排版、資料歸資料。[^2]

w3school 有列出兩種通用的 attribute
1. [Global Attrubute](https://www.w3schools.com/tags/ref_standardattributes.asp) 一種可以加在任意 tag 的 attribute
1. [HTML Event Attributes](https://www.w3schools.com/tags/ref_eventattributes.asp) 一種允許 tag 可以觸發 js的 event (不過不常用)

### Attribute Value

attribute value 是相對 attribute 定訂可以使用的值。

提供給瀏覽器可以運算的數據或演算法名稱。

### Content

content 主要是「要顯示的文字資料」為主。

## 初學 HTML tag 的方式

其實學習這個，就像是查字典一樣。
有看到別人有使用，就查一查。查了一個字，學習一個字。

除了多寫，也要多看別人寫的，才可以接觸到更多的「生字」

## 語意化標籤

HTML5 制訂了很多的新標籤，包含用來排版的語意標籤 `<header>`, `<footer>`, `<article>`, 和 `<section>`。
這些在過去，大多都使用 `<div>` 後來為了提高 SEO 而推薦使用這些語意化標籤。

## 資料結構

HTML 的作用，是組織一個資料結構。表示一個 HTML 文件。
這種資料結構本身，是一種樹狀結構

![](https://i.imgur.com/dQz2OoL.jpg)


## 對於切版來說要注意什麼

**一般初學，請記口訣**

- 由上至下
- 由左至右
- 由粗到細

用在看著設計稿(或圖檔)時，要怎麼把元素「切」成 HTML 樹狀結構。

**會設計的朋友，請回想**

在學設計時，常常遇到抽象畫面表示。要透過元素與元素之間的關係決定設計的語彙。

切版要切得好，除了將語法熟練之外，還需要因為內容或元素的關係，決定切版怎麼切，決定資料與資料彼此的關係。


# 參考資料

[^1]: [HTML - wiki](https://zh.wikipedia.org/wiki/HTML)
[^2]: [HTML Attribute Reference](https://www.w3schools.com/tags/ref_attributes.asp)
