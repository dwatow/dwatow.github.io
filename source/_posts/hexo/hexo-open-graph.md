---
title: hexo 加上 Open Graph
date: 2018-02-07 14:55:07
tags: 
- hexo
categories: 
- hexo改裝
---

# hexo 加上 Open Graph

facebook 利用 [open graph](http://ogp.me/) [^og] 定義的協定，製作爬蟲抓取要在 facebook 分享的內容。在 [facebook 的開發者文件](https://developers.facebook.com/docs/sharing/webmasters)有說明用上什麼欄位，而且怎麼作用。

## hexo 要怎麼使用

在 hexo 上使用，非常簡單上面那一段都不看也沒關係。

直接在你使用的佈景主題 `head` 裡，可以貼 `meta` 的地方貼上這一段 [^hexo]

```
<%- open_graph() %>
```

就會幫你生成

## 測試

可以利用這個工具看看生成的結果。

- [facebook 測試工具](https://developers.facebook.com/tools/debug/sharing/?q=https%3A%2F%2Fdwatow.github.io%2F2018%2F01-27-for-designer%2Ffor-designer-messager-doc%2F)

## 參考資料

[^og]: [The Open Graph protocol 官網](http://ogp.me/)
[^hexo]: [hexo 官網說明](https://hexo.io/zh-tw/docs/helpers.html#open-graph)
