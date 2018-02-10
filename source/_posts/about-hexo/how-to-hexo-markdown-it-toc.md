---
title: markdown-it 如何順利使用 toc 在 hexo
date: 2018-01-28 22:05
tags: 'hexo'
categories: 'hexo改裝'
---
# markdown-it 如何順利使用 toc 在 hexo

這個文章標題有點難解釋。

首先，這是解決 hexo 的問題。(就是此 blog 產生器的問題)
但是，要改 `markdown-it` 渲染器才有的問題。
最後，這個問題是 我的 toc 都是 `#undefined`

## 前情提到

先前研究的文章中，有提到關於 `markdown-it` 在 `_config.yml` 的設定。[^config]

## 設定

```yaml=
markdown:
  anchors:
    level: 1 # Minimum level for ID creation. (Ex. h2 to h6)
    collisionSuffix: 'v' # A suffix that is prepended to the number given if the ID is repeated.
    permalink: true # If true, creates an anchor tag with a permalink besides the heading.
    permalinkClass: header-anchor # Class used for the permalink anchor tag.
    permalinkSymbol: '¶' # The symbol used to make the permalink.
```

只要在 `level` 設定 `1` 就會從 1 到後面 (6) 的標題都會加上錨點。因為它是設定最小值，並不是最小標題。[^#34]

## 讓我繞了一圈的這些討論

無需安裝任何外掛程式，如下面列表
- `markdown-it-named-headings`[^#40]
- `markdown-it-toc-and-anchor`[^#4]
- `hexo-renderer-markdown-it-plus`[^#4]
- `hexo-toc`[^#11]

也不是「官方 markdown-it 好像拒绝实现这个功能，就是不渲染 heading 的 id 导致锚点失效」[^#974]



# 參考資料

[^config]: [Advanced Configuration](https://github.com/hexojs/hexo-renderer-markdown-it/wiki/Advanced-Configuration#automatic-headline-ids)
[^#34]: [根据 markdown 生成的 TOC 锚点的内容是 undefined #34](https://github.com/Haojen/hexo-theme-Anisina/issues/34)
[^#40]: [Cannot render headings with ids? #40](https://github.com/hexojs/hexo-renderer-markdown-it/issues/40)
[^#974]: [TOC锚点初始化失败？ #974](https://github.com/iissnan/hexo-theme-next/issues/974)
[^#4]: [[TOC] anchor problem #4](https://github.com/CHENXCHEN/hexo-renderer-markdown-it-plus/issues/4)
[^#11]: [Content's link show 'undefine' #11](https://github.com/YenYuHsuan/hexo-theme-beantech/issues/11)
