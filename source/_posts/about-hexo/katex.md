---
title: hexo加上數學式 MathJax
date: 2018-01-28 20:45:21
tags: 'hexo'
categories: 'hexo改裝'
---

# hexo 加上數學式 MathJax

[套件連結](https://www.npmjs.com/package/markdown-it-katex)

> 注意
不要安裝 `markdown-it-mathjax`

## 安裝

```shell
npm install markdown-it-katex
```

## 配置 hexo

```
markdown:
  plugins:
    - markdown-it-katex
```

## 加上 CSS

```
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.CSS">
```

就可以渲染了
