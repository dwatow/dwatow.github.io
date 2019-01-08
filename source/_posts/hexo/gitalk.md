---
title: Hexo 加上 gitalk
date: 2019-01-08 10:53:06
tags: ['hexo', 'gitalk']
categories: 'hexo改裝'
---
## Hexo 加上 gitalk

看見一些朋友開始使用[^alex] gitalk。
覺得更貼近使用 github 功能做 blog 的精神。

接下來就參考官網[^offical]的步驟來做看看

> 要注意你自己的主題是不是 `ejs` 做的
如果不是，就不適用官網的介紹。

## 加上 CDN

引用 npm 的檔案
會自動轉換成最新版

```html
<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
<script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
```

可以貼上 theme 的模版。看看是不是要貼在 `<head>`


## 開啟 github 權限

直接去 [Github > Profile > Settings Developer > settings > New OAuth App](https://github.com/settings/applications/new)

填上

1. Application name
1. Homepage URL
1. Application description
1. Authorization callback URL

> 1. Application name 可以任意填。
> 2. Homepage URL 和 4. Authorization callback URL 都要輸入你的 blog 網址。

成功會看見這個畫面

![](https://i.imgur.com/24Bepdi.png)

## 加上留言區

這裡要爬一下自己用的主題使用的模版語言。
要符合以下的邏輯

1. 要渲染 post 的邏輯
2. 該文章適合的位置(通常是最下面)加上語法

### 我自己的做法

**themes/icalm/layout/post.ejs**

找到 post 的渲染位置
加上渲染 comment 的引用。

```html
<div>
  <%- partial('_partial/content-view', { post: page, isPage: false}) %>
  <%- partial('_partial/comment') %>
</div>
```

**themes/icalm/layout/_partial/comment.ejs**

可以發現我的 cdn 掛在這個位置，並不是所有頁面的 `head`

這一段初始化最後會渲染在 `#gitalk-container` 的位置

```html
<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
<script src="https://unpkg.com/gitalk/dist/gitalk.js"></script>
<script type="text/javascript">
    var gitalk = new Gitalk({
        clientID: '<%= theme.gitalk.clientID %>',
        clientSecret: '<%= theme.gitalk.clientSecret %>',
        id: window.location.pathname,
        repo: '<%= theme.gitalk.repo %>',
        owner: '<%= theme.gitalk.owner %>',
        admin: '<%= theme.gitalk.admin %>',
        distractionFreeMode: '<%= theme.gitalk.on %>'
    })
    gitalk.render('gitalk-container')
</script>
```

**themes/icalm/layout/_partial/content-view.ejs**

下面加入這一段

```html
    <% if (!isPage) { %>
        ...
        <section>
          <div id="gitalk-container"></div>
        </section>
    <% } %>
```

判斷 `!isPage` 指的 page 不是內容頁，是 `tag` 或 `categories` 的這種引導頁面，用否定指的是「要找內容頁」。

> 在 hexo 內容頁通常叫 `post`

這裡還提供 `#gitalk-container` 的位置，也就是留言區在畫面的位置。

## 加 config 啟動 gitalk

在這加上 `_config.yam` 指的是 佈景主題裡的 config 檔。
加上這一段設定，在 ejs 中可以用 `theme.gitalk.on` 抓到 `true`

所以上面那一段初始化 javascript 的渲染現在才 work

```yaml=
gitalk:
  on: true
  owner: dwatow
  repo: dwatow.github.io
  admin: ['dwatow']
  clientID: ...
  clientSecret: ...
  labels: ['Gitalk']
```

## 驗證成功

如果你成功的話，可以在 `hexo server` 看見這樣的畫面，這樣再推上去都還來得及。

![](https://i.imgur.com/TvIAP6d.png)

## 要注意的問題

在使用 gitalk 之後，hexo 的使用上就要注意檔名長度。
因為 ==github 的 issue labels 長度不可以超過 50 個字== 如果超過就會無法留言!!


[^alex]:[在 Hexo 裡加入 Applo Theme 和 Gitalk](https://alxtz.github.io/2018/07/16/hexo-theme-gitalk/)
[^offical]: [Gitalk - github](https://github.com/gitalk/gitalk/blob/master/readme-cn.md)
