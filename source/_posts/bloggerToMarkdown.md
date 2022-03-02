---
title: blogger 轉成 markdown 搬家器
date: 2022-03-02 22:30:30
tags:
  - markdown
  - blogger
  - 爬蟲
categories:
  - 技術練習
---

# blogger 轉成 markdown 搬家器。

blogger 有備份功能，可以將自己過往的所有文章備份下來，但是格式卻是 xml 檔案。
我就寫一個 node.js 的轉換器，將檔案轉成 markdown

我自己想要將過去從大學時代到我轉職前端工程師之前累積的文章，總共七百多篇，轉到目前在 github 上面。
因為我是用 hexo 建立的，所以目前生成的 markdown 是 for hexo 的格式。有興趣的朋友可以自己改一下

https://github.com/dwatow/blogger2markdown/
