---
title: 又換了一次的 scroll top
date: 2020-04-18 16:32:14
tags:
- JavaScript
categories:
- hexo改裝
---
# 又換了一次的 scroll top

在 blog 中，我選的佈景主題較陽春，但也較好改，要什麼功能都自己加上來。
這個功能是希望使用者在游標移到右上角時，出現的目錄，點擊連結可以將文章移到指定段落
而這一次，把之前的原生 scroll top 換掉了。
因為不想只是為了這個功能引入 jQuery 套件，所以想說用原生語法。

這次的出處在這: https://gist.github.com/andjosh/6764939
其實不錯，寫的 style 很漂亮。

## 修改

有一些地方，我做了修改。

1. 因為我不是 always 都要到 top ，所以改了 `to` 的值，由每一個點擊標題決定。
2. 由於要修改 body 的 scroll 所以，改用 `document.documentElement` 不是 `document.body`
3. 每一個標題的定位，使用元素的 `element.offsetTop` 的位置。
    另外[這一篇](https://gist.github.com/felipenmoura/650e7e1292c1e7638bcf6c9f9aeb9dd5) 使用的是 `element.getBoundingClientRect().top` 找到最後要停留的位置。
4. 最外面使用一個 IIFE 包起來，避免全域污染。

## 原始碼

```javascript
(() => {
  console.log('scrolltop');
  
  document.querySelectorAll('.toc-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const header = document.querySelector(decodeURIComponent(link.hash));
      scrollTo(header.offsetTop, 550);
    })
  })

  function scrollTo (to, duration) {
    const element = document.documentElement;
    var start = element.scrollTop,
      change = to - start,
      currentTime = 0,
      increment = 20;

    var animateScroll = function () {
      
      currentTime += increment;
      var val = parseInt(Math.easeInOutQuad(currentTime, start, change, duration));
      console.log(val.toFixed(4));
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }

  //t = current time
  //b = start value
  //c = change in value
  //d = duration
  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };
})()
```