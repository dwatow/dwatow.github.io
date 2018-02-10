---
title: hexo 加上 安全網 (文章推薦)
date: 2018-01-28 22:51:16
tags: 'hexo'
categories: 'hexo改裝'
---

# hexo 加上 安全網 (文章推薦)

關於「安全網」，是來自於《架站前一定要上的10堂課：網站企畫成功術》。

> 對於使用者看瀏覽完網站之後，接下來要去哪？是否有引導？
最後最後，設計好的引導都用完了，有沒有什麼方式防止使用者離開網站。

而安全網通常都是以「你也許還想知道」這種「文章推薦」的形式出現

hexo 也有這種外掛唷！我找到兩個。
一個是跨 blog 的文章推薦。
另一個是同站同系列的文章推薦。

我使用的是後者，來看看怎麼做吧！

## 安裝

```shell
$ npm install hexo-list-related-posts --save
```

## 使用

在你找的佈景主題之中，把這個加進去

```
<%- list_related_posts({maxCount: 10, orderBy: 'random'}) %>
```

還可以去 [npm 的頁面](https://www.npmjs.com/package/hexo-list-related-posts) 看看它的設定參數[^npm]

## 改造

也許需要改造的朋友可以看一下[別人的文章](https://coffee0127.github.io/blog/2016/08/11/hexo-abstract-of-related-post/) [^改裝]

# 參考資料
[^npm]: [hexo-list-related-posts](https://www.npmjs.com/package/hexo-list-related-posts)
[^改裝]: [Hexo 相關文章摘要](https://coffee0127.github.io/blog/2016/08/11/hexo-abstract-of-related-post/)
