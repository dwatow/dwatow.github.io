---
title: 修 Pencil 在 expoert web 的 bug, 順便學了 XML,XSLT,XPath
date: 2022-04-08 20:53:21
tags:
- XML
- XSLT
- XPath
categories:
- 工具使用
---
# 修 Pencil 在 expoert web 的 bug, 順便學了 XML,XSLT,XPath

repo: https://github.com/evolus/pencil

## 使用情境

**做了兩頁面**

- index 點擊 button 可以連到 detail
- detail 點擊 button 可以連到 index

![](https://i.imgur.com/1rb489L.png)

![](https://i.imgur.com/0eY4oBg.png)

想要匯出

![](https://i.imgur.com/peuzClT.png)

![](https://i.imgur.com/d2TqXsX.png)


## 問題描述

做好了的頁面，可以點擊區域與畫面沒有吻合。

> 「點擊區」如圖藍色透明區域
> 「畫面」如綠色透明區域

點擊 back to index 目前是無法跑到另一頁的，因為可點擊範圍 (map > area) 的縮放放與圖片 (img) 的縮放比例不一樣。

> 在此的點擊範圍實作方式，是利用 [`HTML <map> Tag`](https://www.w3schools.com/tags/tag_map.asp) 技術

![](https://i.imgur.com/rleYTX4.png)


匯出來的 html 

**html**

```html
<div class="Page" id="index_page">
    <h2>index</h2>
    <div class="ImageContainer">
        <img src="pages/index.png" width="NaN" height="NaN" usemap="#map_index">
    </div>
    <map name="map_index">
        <area shape="rect" coords="50,91,142,116" href="#detail_page" title="Go to page 'detail'">
    </map>
</div>
```

## 探查問題原因

回過頭找找看 source code 怎麼會發生這個問題。

**app/pencil-core/templates/HTML/default.HTML/StyleSheet.xslt**

```xml
<div class="ImageContainer">
    <img src="{@rasterized}"
        width="{p:Properties/p:Property[@name='width']/text() * p:Properties/p:Property[@name='bitmapScale']/text()}"
        height="{p:Properties/p:Property[@name='height']/text() * p:Properties/p:Property[@name='bitmapScale']/text()}"
        usemap="#map_{p:Properties/p:Property[@name='fid']/text()}"/>
</div>
<map name="map_{p:Properties/p:Property[@name='fid']/text()}">
    <xsl:apply-templates select="p:Links/p:Link" />
</map>
```

找到了一段，匯出 web page 時，定義圖片 width/height 的地方。
而匯出結果的 html 檔案看起來是兩個東西在 JS 裡運算，出問題產生 `NaN`，看來這個運算，是相乘？

**驗證**

將原始碼中的

- `"{p:Properties/p:Property[@name='width']/text() * p:Properties/p:Property[@name='bitmapScale']/text()}"` 

分母刪除，改成 

- `"{p:Properties/p:Property[@name='width']/text()}"`

先讓疑似相乘造成 NaN 驗證一次，確認了問題發生的地方，再來深入研究。

再次匯出，圖片的比例就比一開始的圖片小許多了。

![](https://i.imgur.com/i8FQeRG.png)

```xml
<div class="Page" id="index_page">
    <h2>index</h2>
    <div class="ImageContainer">
        <img src="pages/index.png" width="192" height="166" usemap="#map_index">
    </div>
    <map name="map_index">
        <area shape="rect" coords="50,91,142,116" href="#detail_page" title="Go to page 'detail'">
    </map>
</div>
```

匯出的圖片寬高也正常許多。

到此，是我在 2020 年提的 issue [Export single web page width/height is NaN #604](https://github.com/evolus/pencil/issues/604)

並且同年提了 PR [fix-export-single-web-page-width-height-is-NaN-for-development #610](https://github.com/evolus/pencil/pull/610) 但是遲遲沒有合併，因為它是 workaround 吧？

沒有研究其它的地方就提的 PR。

## 不懂的地方

最不懂的是這個檔案 **app/pencil-core/templates/HTML/default.HTML/StyleSheet.xslt**

首先，什麼是 `.xslt` 檔？

xslt 檔中，看起來是寫 xml 但是它的 xml 在 tab name 和 attributes 上有 `:` 的寫法，不知道有什麼意思

```xml
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:p="http://www.evolus.vn/Namespace/Pencil"
    xmlns:html="http://www.w3.org/1999/xhtml"
    xmlns="http://www.w3.org/1999/xhtml">
<xsl:output method="html"/>
```

```xml
<xsl:template match="p:Page">
<xsl:if test="p:Note">
<xsl:apply-templates select="p:Note/node()" mode="processing-notes"/>
```

在 attributes 裡的 value，也有一些看不懂的 `{}`, `\`, `p:`, `[@name=""]`, `text()` 的這些記號

```xml
<img src="{@rasterized}"
      width="{p:Properties/p:Property[@name='width']/text() * p:Properties/p:Property[@name='bitmapScale']/text()}"
      height="{p:Properties/p:Property[@name='height']/text() * p:Properties/p:Property[@name='bitmapScale']/text()}"
      usemap="#map_{p:Properties/p:Property[@name='fid']/text()}"
 />
```

整理一下問題

1. 什麼是 xslt 檔？
2. tab name 上 `:` 的寫法，是什麼意思？
3. attributes 上 `:` 的寫法，是什麼意思？
4. attributes 裡的 value，也有一些看不懂的這些記號
    - `{}`
    - `\`
    - `p:`
    - `[@name=""]`
    - `text()`

## 解決不會的地方

### 什麼是 xslt 檔案

> With XSLT you can transform an XML document into HTML.
[name=https://www.w3schools.com/xml/xml_xslt.asp]

用來轉換 XML 成 HTML！(這不就是我想要的功能？繼續看看)

![](https://i.imgur.com/p1xRT8N.png)

看了一下 w3schools 的介紹，似乎不能直接把檔案文進瀏覽器，而它必須要經過一個程式轉換才可以看見結果。

### 蓋一個 hello world

我需要 xslt 的 hello world 示範。

<iframe width="560" height="315" src="https://www.youtube.com/embed/fdxfXaJw6SY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

這個影片，示範了使用 vscode 的環境，將 xslt 跑起來，並成功轉換 xml 檔案，我也跟著介紹。

安裝外掛 [XSLT/XPath for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=deltaxml.xslt-xpath)

說明文件中有 [Running XSLT](https://deltaxml.github.io/vscode-xslt-xpath/run-xslt.html) 的介紹，看 **Saxon-JS setup** 的做法

安裝

```
npm init -y
npm install --save-dev xslt3
```

使用

1. `cmd`+`shift`+`p` 選 `Tasks: Run Build Task`
2. 選生成一個 `Saxon-JS` 的設定

並且修改如下

- `${workspaceFolder}`: 目前的專案根目錄

因為只是 hello world 所以我設定成下面的檔名，方便執行。

- `index.xsl`
- `index.xml`
- `index.html`

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "xslt-js",
      "label": "xslt-js: Saxon-JS Transform (New)",
      "xsltFile": "${workspaceFolder}/index.xsl",
      "xmlSource": "${workspaceFolder}/index.xml",
      "resultPath": "${workspaceFolder}/index.xml",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": [
        "$saxon-xslt-js"
      ]
    }
  ]
}
```

成功轉換之後，就可以繼續看一下 w3schoolds 裡其它的介紹，看看 XML 還有什麼功能是關於這個問題中的疑問吧！

## XSLT 的基本語法

- `XSLT <template>`
- `XSLT <value-of>`
- `XSLT <for-each>`
- `XSLT <sort>`
- `XSLT <if>`
- `XSLT <choose>`

```xml
<xsl:template match="p:Page"></xsl:template>
<xsl:value-of select="catalog/cd/title"/>
<xsl:for-each select="catalog/cd"></xsl:for-each>
<xsl:sort select="artist"/>
<xsl:if test="p:Note"></xsl:if>
<xsl:choose>
  <xsl:when test="expression">
    ... some output ...
  </xsl:when>
  <xsl:otherwise>
    ... some output ....
  </xsl:otherwise>
</xsl:choose>
```
  
### tab name, attributes  上 : 的寫法，是什麼意思？

XML 有一個 namespace 的寫法。

> XML Namespaces provide a method to avoid element name conflicts.
[name=https://www.w3schools.com/xml/xml_namespaces.asp]

利用不同的 namespace 可以使用重複的命名 (不過就是一個前綴)

```xml
<h:table>
  <h:tr>
    <h:td>Apples</h:td>
    <h:td>Bananas</h:td>
  </h:tr>
</h:table>

<f:table>
  <f:name>African Coffee Table</f:name>
  <f:width>80</f:width>
  <f:length>120</f:length>
</f:table>
```

而且可以在 `root` 節點定義

定義兩個 namespace，`h` 和 `f` 並且用兩個 URI 來定義。而這個 URI 在 XML 並不會當作 link 而只是當作一個「字串」而已。

```xml
<root
  xmlns:h="http://www.w3.org/TR/html4/"
  xmlns:f="https://www.w3schools.com/furniture"
></root>
```

### attributes 裡的 value 有一些看不懂的這些記號

- `{}` 目前還不知道
- `\` [XPath 簡略語法](https://zh.wikipedia.org/wiki/XPath#%E7%AE%80%E7%95%A5%E7%9A%84%E8%AF%AD%E6%B3%95)
- `p:` namespace
- `[@name=""]` [XPath 軸描述語法的屬性縮寫](https://zh.wikipedia.org/wiki/XPath#%E8%BD%B4%E6%8F%8F%E8%BF%B0%E8%AF%AD%E6%B3%95)
- `text()` [節點測試 文字型別](https://zh.wikipedia.org/wiki/XPath#%E8%8A%82%E7%82%B9%E6%B5%8B%E8%AF%95),  [`text()`](https://stackoverflow.com/questions/11744465/xpath-difference-between-node-and-text)

大概就是使用 XPath 相關的東西。那 XPath 概念上是什麼呢？

看一下 [XPath Example](https://www.w3schools.com/xml/xml_xpath.asp)

### What is XPath?

> XPath is a major element in the XSLT standard.
>
> XPath can be used to navigate through elements and attributes in an XML document.

在 XSLT 中抓 XML 文件裡的元素，使用的表達方式。

拿個[例子](https://www.w3schools.com/xml/tryxslt.asp?xmlfile=cdcatalog&xsltfile=cdcatalog)來 demo

**XML file**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <cd>
    <title>Empire Burlesque</title>
    <artist>Bob Dylan</artist>
    <country>USA</country>
    <company>Columbia</company>
    <price>10.90</price>
    <year>1985</year>
  </cd>
  <cd>
    <title>Hide your heart</title>
    <artist>Bonnie Tyler</artist>
    <country>UK</country>
    <company>CBS Records</company>
    <price>9.90</price>
    <year>1988</year>
  </cd>
  <cd>
    <title>Greatest Hits</title>
    <artist>Dolly Parton</artist>
    <country>USA</country>
    <company>RCA</company>
    <price>9.90</price>
    <year>1982</year>
  </cd>
</catalog>
```

**XLST file**


```xml
<xsl:for-each select="catalog/cd">
<tr>
  <td><xsl:value-of select="title"/></td>
  <td><xsl:value-of select="artist"/></td>
</tr>
</xsl:for-each>
```

在 XLST 中，有一段 `select="catalog/cd"` 就是樹狀結構 `catalog` > `cd` 裡面有 `title` 和 `artist` 這種表示法就是 XPath

## 解決方案

重新定義問題: 
目前的問題是 XLST 轉換 XML 時出現的問題。

目前只知道，下面這段原始碼的 `p:Properties/p:Property[@name='bitmapScale']/text()` 可能有問題 (因為刪掉它就沒問題了，但刪掉它不能真正解決問題)。

```
width="{
  p:Properties/p:Property[@name='width']/text() * 
  p:Properties/p:Property[@name='bitmapScale']/text()
}"
height="{
  p:Properties/p:Property[@name='height']/text() * 
  p:Properties/p:Property[@name='bitmapScale']/text()
}"
```

但還需要 XML 檔案，才可以轉換。
在這個時候，我就想到了，用除錯模式啟動程式碼看看。

就試看看指令

```bash
$ npm run start:dev   
```

並且操作一樣的匯成 web page 的動作

看見 devTool 的 console 出現了一行

```
xmlFile:/var/folders/80/ljnyxvfd22b86h1slh6187pr0000gn/T/tmp-131911KeuYqT5JSHb.xml
```

把它打開

```xml=
<Document xmlns="http://www.evolus.vn/Namespace/Pencil">
    <Properties>
        <Property name="activeId">b826fd07699d4543a02b200d8db96726</Property>
        <Property name="exportTime">Fri Apr 08 2022 19:56:58 GMT+0800 (台北標準時間)</Property>
        <Property name="exportTimeShort">202248</Property>
        <Property name="fileName">backend</Property>
        <Property name="friendlyName">backend</Property>
        <Property name="bitmapScale">1</Property>
    </Properties>
    <Pages>
        <Page xmlns:p="http://www.evolus.vn/Namespace/Pencil" id="02e736b4249f4f0b8f322fc9a45093e1" rasterized="/Users/chris/Desktop/pencil file/pages/index.png">
            <Properties>
                <Property name="id">02e736b4249f4f0b8f322fc9a45093e1</Property>
                <Property name="fid">index</Property>
                <Property name="name">index</Property>
                <Property name="width">192</Property>
                <Property name="height">166</Property>
                <Property name="pageFileName">page_02e736b4249f4f0b8f322fc9a45093e1.xml</Property>
                <Property name="zoom">1</Property>
                <Property name="backgroundColorRGBA">rgba(255, 255, 255, 0)</Property>
            </Properties>
            <Links>
                <Link target="b826fd07699d4543a02b200d8db96726" targetName="detail" targetFid="detail" x="50" y="91" w="92" h="25" />
            </Links>
        </Page>
        <Page xmlns:p="http://www.evolus.vn/Namespace/Pencil" id="b826fd07699d4543a02b200d8db96726" rasterized="/Users/chris/Desktop/pencil file/pages/detail.png">
            <Properties>
                <Property name="id">b826fd07699d4543a02b200d8db96726</Property>
                <Property name="fid">detail</Property>
                <Property name="name">detail</Property>
                <Property name="width">201</Property>
                <Property name="height">293</Property>
                <Property name="pageFileName">page_b826fd07699d4543a02b200d8db96726.xml</Property>
                <Property name="zoom">1</Property>
                <Property name="backgroundColorRGBA">rgba(255, 255, 255, 0)</Property>
            </Properties>
            <Links>
                <Link target="02e736b4249f4f0b8f322fc9a45093e1" targetName="index" targetFid="index" x="50" y="113.25" w="92" h="25.75" />
            </Links>
        </Page>
    </Pages>
</Document>
```

觀察發現

- `Document\Properties\Property` 有 `bitmapScale` 但沒有 `width`, `height`
- `Document\Pages\PageProperties\Property` 有 `width`, `height` 但沒有 `bitmapScale`

再看一次 XLST

```xml
<xsl:template match="p:Page">
  ...
  <img src="{@rasterized}"
      width="{p:Properties/p:Property[@name='width']/text() * p:Properties/p:Property[@name='bitmapScale']/text()}"
      height="{p:Properties/p:Property[@name='height']/text() * p:Properties/p:Property[@name='bitmapScale']/text()}"
      usemap="#map_{p:Properties/p:Property[@name='fid']/text()}"/>
  ...
</xsl:template>
```

`p:` 是 namespace 先不管。
`<xsl:template>` 的 `match` 指定 XPath 為 `Page`。
`<img>` 的 `height` 和 `width` 指定 `Properties\Property`


屬性名稱 = width 的要和屬性名稱 = bitmapScale 相乘，幾乎等同於 `[@name='width'] * [@name='bitmapScale']` 這樣。

那是不是因為 `Document\Pages\PageProperties\Property` 沒有 `bitmapScale` 造成抓到的值是 `undefined` 所以相乘成為 `NaN` ？

心想: 那我來補一個 1 給他吧！

所以，就修改了程式，並且提交了新的 [Pull Request #713](https://github.com/evolus/pencil/pull/713/files#)。

**app/pencil-core/exporter/documentExportManager.js**

```javascript=351
var propertyNode = pageNode.ownerDocument.createElementNS(PencilNamespaces.p, "p:Property");
Dom.getSingle("./p:Properties", pageNode).appendChild(propertyNode);

propertyNode.setAttribute("name", "bitmapScale");
propertyNode.appendChild(dom.createTextNode(1));
```

