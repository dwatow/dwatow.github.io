---
title: Hexo 加上 Graphviz 功能
date: 2019-02-04 22:57:53
tags: 
- hexo
categories: 
- hexo改裝
---

# Hexo 加上 Graphviz 功能

今天突然心血來潮，除夕沒事就來改改 hexo 寫寫程式吧

一開始也是想「移植 hackmd 的功能到 hexo」下一個就是，我超愛也很常用的 Graphviz
改這個之前，都是貼上 svg code 上來。而不是在 hexo 上直接寫 source code。

調查 Graphviz 已經不是第一次了，確定不能用 `Graphviz` 這個名字就搞定。所以這次直接去找 hackmd 的 source code。
看看它是怎麼做的

## 看 hackmd 的 code

憑著記憶找了一下是在哪個位子。
運氣真好，一下就被我找到了^[[codimd - github](https://github.com/hackmdio/codimd/blob/master/public/js/extra.js#L354)]

```javascript=354
// graphviz
var graphvizs = view.find('div.graphviz.raw').removeClass('raw')
graphvizs.each(function (key, value) {
try {
  var $value = $(value)
  var $ele = $(value).parent().parent()

  var graphviz = Viz($value.text())
  if (!graphviz) throw Error('viz.js output empty graph')
  $value.html(graphviz)

  $ele.addClass('graphviz')
  $value.children().unwrap().unwrap()
} catch (err) {
  $value.unwrap()
  $value.parent().append('<div class="alert alert-warning">' + err + '</div>')
  console.warn(err)
}
})
```

這就是 hacmkd 處理 graphviz 的地方。其中 `var graphviz = Viz($value.text())` 似乎就是處理的語法。

```javascript=21
var Viz = require('viz.js')
```

在 21 行之處，有宣告...，這不就是套件名稱了嗎？！帥呀！來研究一下

## Viz.js ≠ Viz

說明文件^[[Using a `<script>` Tag](https://github.com/mdaines/viz.js/wiki/Usage#using-a-script-tag)]，足以說明如何使用

```html
<script src="viz.js"></script>
<script src="full.render.js"></script>
<script>
  var viz = new Viz();

  viz.renderSVGElement('digraph { a -> b }')
  .then(function(element) {
    document.body.appendChild(element);
  })
  .catch(error => {
    // Create a new Viz instance (@see Caveats page for more info)
    viz = new Viz();

    // Possibly display the error
    console.error(error);
  });
</script>
```

發現了嗎？ `var viz = new Viz();` + `viz.renderSVGElement('digraph { a -> b }')` 的用法，是不是和 hackmd 不一樣呢？簡單的說，Viz.js 已經更新到 2.x 版了。而 hacmkd 使用的版本是 1.x 版的。

不過，光知道套件還不能直接上 hexo，還要找找 hexo 的外掛程式，依之前的命名規則，應該是叫做 `hexo-filter-viz` ^[[hexo-filter-viz - github](https://github.com/yao-zou/hexo-filter-viz)]。而果然沒錯，有這個套件，立馬裝來試看看。

結果，一直渲染不出來，只有一塊白色的區塊，但是有 svg code。
我自己實測的結果，如果使用 2.1.2 版，就不會出現這個問題。

## hexo-filter-viz 更新它

fork 了一份 hexo-filter-viz ^[[fork hexo-filter-viz - github](https://github.com/dwatow/hexo-filter-viz)]

最後，仿照 `hexo-filter-flowchart` 和 `hexo-filter-sequence` 兩個的架構，來重新實作 hexo-filter-viz。
再提 pull request 給原作者。雖然幾乎重新寫了它的 code ，但是還是用提「pull request」的方式來更新比較好。

## 安裝

有興趣的朋友們，可以裝我 github 上的版本。
如果 pull request 成功合併之後，再安裝它的版本。
目前 npm 沒有 package 可以安裝。

```shell
npm install https://github.com/dwatow/hexo-filter-viz.git
```

直接跑 hackmd 的語法測試，成功的話出現這樣的畫面

![](https://i.imgur.com/J7RZhAc.png)
