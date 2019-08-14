---
title: 修改 Hexo 程式碼區段 後處理
date: 2017-06-14 14:07:48
tags: 
- hexo
categories: 
- hexo改裝
---

# 修改 Hexo程式碼區段 後處理

## 問題描述

hexo在程式碼區段決定要不要「行號」是透過`_condifg.yml`設定決定。
但是，我自己愛用的hackmd卻是用`markdown`中，直接指定。

可以在文章中，動態的決定這一段是不是要加行號，並且指定第一行的行號是幾號。

### markdown

請無視下面的`<code>`標籤

```markdown
## Code

Inline `code`

Indented code

  // Some comments
  line 1 of code
  line 2 of code
  line 3 of code

Block code "fences"

<code>```</code>
Sample text here...
<code>```</code>

Syntax highlighting

<code>```js</code>
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
<code>```</code>
```

### HEXO的結果是這樣

用語法區隔出來的程式碼區塊，Hexo出現的結果會自動加上行號。html會用table呈現

```html
    <h2>Code</h2>
    <p>Inline <code>code</code></p>
    <p>Indented code</p>
    <pre><code>// Some comments
    line 1 of code
    line 2 of code
    line 3 of code
    </code></pre>
    <p>Block code &quot;fences&quot;</p>
    <p>
      <figure class="highlight plain">
        <table>
          <tr>
            <td class="gutter"><pre><div class="line">1</div></pre></td>
            <td class="code"><pre><div class="line">Sample text here...</div></pre></td>
          </tr>
        </table>
      </figure>
    </p>
    <p>Syntax highlighting</p>
    <p>
      <figure class="highlight js">
        <table>
          <tr>
            <td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div></pre></td>
            <td class="code"><pre><div class="line"><span class="keyword">var</span> foo = <span class="function"><span class="keyword">function</span> (<span class="params">bar</span>) </span>&#123;</div><div class="line">  <span class="keyword">return</span> bar++;</div><div class="line">&#125;;</div><div class="line"></div><div class="line"><span class="built_in">console</span>.log(foo(<span class="number">5</span>));</div></pre></td>
          </tr>
        </table>
      </figure>
    </p>
```

### [markdown-it demo web](https://markdown-it.github.io/) 結果如下

第二段和第三段程式碼沒有自動加上去的行號，自然也不會出現table的html

```html
    <h2>Code</h2>
    <p>Inline <code>code</code></p>
    <p>Indented code</p>
    <pre><code>// Some comments
    line 1 of code
    line 2 of code
    line 3 of code
    </code></pre>
    <p>Block code “fences”</p>
    <pre class="hljs"><code>Sample text here...
    </code></pre>
    <p>Syntax highlighting</p>
    <pre class="hljs language-js"><code><span class="hljs-keyword">var</span> foo = <span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params">bar</span>) </span>{
    <span class="hljs-keyword">return</span> bar++;
    };

    <span class="hljs-built_in">console</span>.log(foo(<span class="hljs-number">5</span>));
    </code></pre>
```

## 找程式碼

### hexo-util

經過一夜的找尋，原以為這是markdown渲染器造成的問題，結果不是，是hexo有自帶一個外掛程式叫[hexo-util](https://github.com/hexojs/hexo-util)主要是對文件內的特定區塊做「再處理」，比較偏向前端才能處理的情況

在檔案`$hexo/node_modules/hexo-util/lib/highlight.js`中，找到`function highlightUtil()`裡面有針對程式碼區段的處理，可以看見它插入`<table>`的地方

```javascript=
function highlightUtil(str, options) {
  if (typeof str !== 'string') throw new TypeError('str must be a string!');
  options = options || {};

  var gutter = options.hasOwnProperty('gutter') ? options.gutter : true;
  var wrap = options.hasOwnProperty('wrap') ? options.wrap : true;
  var firstLine = options.hasOwnProperty('firstLine') ? +options.firstLine : 1;
  var caption = options.caption;
  var mark = options.hasOwnProperty('mark') ? options.mark : [];
  var tab = options.tab;
  var data = highlight(str, options);

  if (!wrap) return data.value;

  var lines = data.value.split('\n');
  var numbers = '';
  var content = '';
  var result = '';
  var line;

  for (var i = 0, len = lines.length; i < len; i++) {
    line = lines[i];
    if (tab) line = replaceTabs(line, tab);
    numbers += '<div class="line">' + (firstLine + i) + '</div>';
    content += '<div class="line';
    content += (mark.indexOf(firstLine + i) !== -1) ? ' marked' : '';
    content += '">' + line + '</div>';
  }

  result += '<figure class="highlight' + (data.language ? ' ' + data.language : '') + '">';

  if (caption) {
    result += '<figcaption>' + caption + '</figcaption>';
  }

  result += '<table><tr>';

  if (gutter) {
    result += '<td class="gutter"><pre>' + numbers + '</pre></td>';
  }

  result += '<td class="code"><pre>' + content + '</pre></td>';
  result += '</tr></table></figure>';

  return result;
}
```

在此希望呼叫此段程式碼時，丟進來的參數`options`的`firstLine`和`gutter`可以依markdown的code進行改變。

### hexo

在[`$hexo/node_modules/hexo/lib/plugins/filter/before_post_render/backtick_code_block.js`](https://github.com/dwatow/hexo/blob/master/lib/plugins/filter/before_post_render/backtick_code_block.js)中

```javascript=11
function backtickCodeBlock(data) {
  var config = this.config.highlight || {};
  if (!config.enable) return;

  data.content = data.content.replace(rBacktick, function() {
    var start = arguments[1];
    var end = arguments[5];
    var args = arguments[3];
    var content = arguments[4];

    var options = {
      autoDetect: config.auto_detect,
      gutter: config.line_number,
      tab: config.tab_replace
    };
```

## 修改程式

直接看[github的pull request](https://github.com/hexojs/hexo/pull/2612/files?diff=split)
修改時，請注意，若留下註解行，就會改變行號唷!!

### 保持程式碼指定參數
將`=`左邊的部份取出來，就是原本指定程式語言的參數了

將第18行改成這樣

```javascript=18
// var args = arguments[3];
var args = arguments[3].split('=').shift();
```

### markdown動態指定行號使用的情況

先判斷是否要使用行號，判斷是否有給`=`
若有要用行號，則取`=`右邊是否有數字，若無給預設值`1`
若沒有要使用行號就給`0`(原程式給`undefine`)

將上面21~25行改成這樣

```javascript=21
    var gutterIndex = arguments[3].indexOf('=');
    var isGutter = (gutterIndex !== -1) ? true : false;
    var options = {
      autoDetect: config.auto_detect,
      gutter: isGutter,
      firstLine: isGutter ? arguments[3].split('=')[1] || 1 : 0,
      tab: config.tab_replace
    };
```



就可以像hackmd的程式碼區段的用法
- ` ```javascript ` 不加行號
- ` ```javascript= ` 加行號，第1起始(預設)
- ` ```javascript=21` 加行號，第21起始
