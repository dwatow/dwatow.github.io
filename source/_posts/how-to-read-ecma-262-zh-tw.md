---
title: 翻譯 如何閱讀 ECMAScript Specification 中文版
date: 2021-05-08 14:29:12
tags:
- JavaScript
- 看書
categories:
- 翻譯
---
# 翻譯 如何閱讀 ECMAScript Specification 中文版

[How to Read the ECMAScript Specification 原文](https://timothygu.me/es-howto/#why-should-i-read-the-ecmascript-specification)

# Abstract

The ECMAScript Language specification（也稱 JavaScript 規範，或 ECMA-262）是學習 JavaScript 複雜運作原理的絕妙資源。 但這是一個巨大的文本，一開始可能會令人困惑和恐懼。此文件撰寫的原因，是為了讓您能夠在閱讀最佳的 JavaScript 語言參考資料時降低起步門檻。

# 1 Prelude 序幕

決定每天來點 ECMAScript spec 有助健康。也許它是一個新年的決定，或者是醫生的處方。無論如何都歡迎上船。

> 注意: 在此文件內，我只會用 "ECMAScript" 代表規範本身。 "JavaScript" 代表其它的意思。
> 但是這兩個的術語指的是同一個東西。
> (ECMAScript 和 JavaScript 在歷史意義上不同，但是超過這份文件要講的範圍，有興趣[自己 Google](https://www.google.com/search?q=ecmascript+vs.+javascript))

## 1.1 Why should I read the ECMAScript specification

> 譯註: 為什麼要閱讀 ECMAScript 規範

ECMAScript spec 是所有 JavaScript 實作的權威來源。無論是在你的瀏覽器[^WHATISMYBROWSER]、Node.js [^NODEJS]、太空船[^NODEJS-NASA]上或是物聯網設備 [^JOHNNY-FIVE]裡。
所有 JavaScript 引擎開發人員都以規範為主，確保他們閃亮亮的新功能運作如同預期，就如同其它的 JavaScript 引擎一樣。

[^WHATISMYBROWSER]: [What browser am I using?](https://www.whatsmybrowser.org/)
[^NODEJS]: [Node.js](https://nodejs.org/)
[^NODEJS-NASA]: [Node.js Helps NASA Keep Astronauts Safe and Data Accessible.](https://foundation.nodejs.org/wp-content/uploads/sites/50/2017/09/Node_CaseStudy_Nasa_FNL.pdf)
[^JOHNNY-FIVE]: [Johnny-Five: The JavaScript Robotics & IoT Platform.](http://johnny-five.io/)

但是我覺得此規範不只是給「JavaScript 引擎開發者」這種神話生物閱讀，實際上，我覺得對你或**一般的 JavaScript 撰寫人員也很有用，只是你沒有意識到。**

假設，你在日常的工作中發現了特別的東西

```javascript
> Array.prototype.push(42)
1
> Array.prototype
[42, constructor: ƒ, concat: ƒ, copyWithin: ƒ, fill: ƒ, find: ƒ, …]
> Array.isArray(Array.prototype)
true
```
```javascript
> Set.prototype.add(42)  // Uncaught TypeError
Uncaught TypeError: Method Set.prototype.add called on incompatible receiver #<Set>
    at Set.add (<anonymous>)
    at <anonymous>:1:15
> Set.prototype
Set {constructor: ƒ, has: ƒ, add: ƒ, delete: ƒ, clear: ƒ, …}
```

困惑為什麼一個方法可以用在原型，另一個方法卻不能用在原型。而且[Google 總是找不到](https://www.google.com/search?q=array+prototype+push+on+prototype)，[Stack Overflow 也幫不到你](https://stackoverflow.com/search?q=array+prototype+push+on+prototype)。

閱讀規範能解惑。

或者，你可能想知道惡名昭彰的[寬鬆相等](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Equality_operators) (`==`) 跑起來是什麼樣的 function。(在此[^WAT]不嚴謹的使用 "function" 這個詞) 即使是勤奮好學的軟體工程師，在查找 MDN 所找到的收獲遠不及對你眼睛的傷害。[^MDN]

閱讀規範能解惑。

:::info
譯註: 一些精彩的 WAT 反應
```javascript=
[] + []
[] + {}
{} + []
{} + {}
Array(16)
Array(16).join("wat")
Array(16).join("wat" + 1)
Array(16).join("wat" - 1) + "Batman!"
```
:::


[^MDN]: [Mozilla Developer Network](https://developer.mozilla.org/en-US/)

[^WAT]: [A lightning talk by Gary Bernhardt from CodeMash 2012](https://www.destroyallsoftware.com/talks/wat)


另外，對於不熟悉 JavaScript 的開發人員，我不推薦讀 spec。如果你是 JavaScript 新手，請先上網玩一輪！建立一些 web apps！找 JavaScript 的寶寶監視器應用！或任何什麼都行！
當你歷經了許多 JavaScript 的缺陷或者對 JavaScript 有經驗豐富到不用擔心，只要符合其中一個就可以考慮回到這個文件看看。

OK, 現在您知道閱讀規範對您理解語言或平台的複雜性會是非常有用的工具。 但是究竟什麼屬於 ECMAScript 規範呢？

## 1.2 What belongs to the ECMAScript specification, and what does not

> 譯註: 什麼(語法)在 ECMAScript ，什麼(語法)不是

教科書的回答是「只有語言的功能才會進入 ECMAScript 規範中」，但是這有講等於沒講，如同我說「JavaScript 就是 JavaScript」。我不是在描述恆等式。

相反的，我要做一些在 JavaScript 中常見的事來告訴你，它們是不是語言功能。

|內容|是不是 ES|備註
|-|-|-|
| 語法元素的結構規則<br> (i.e., 像是有效的 `for`..`in` 迴圈的樣子)	|✔| 句型規則: 某種語言結構規格
| 語法元素的語意(對應的意思)<br> (i.e., `typeof null` 或 `{ a: b }` 的回傳值)	|✔| 語意: 對應某一個意思
|`import a from 'a';`	|~~❓~~ [1] ✔|The ECMAScript spec 規定了類似宣告的語法以及它們的意思，但是未規定模組加載方式 (後來有了)
|[`Object`](https://tc39.es/ecma262/#sec-object-objects), [`Array`](https://tc39.es/ecma262/#sec-array-objects), [`Function`](https://tc39.es/ecma262/#sec-function-objects), [`Number`](https://tc39.es/ecma262/#sec-number-objects), [`Math`](https://tc39.es/ecma262/#sec-math-object), [`RegExp`](https://tc39.es/ecma262/#sec-regexp-regular-expression-objects), [`Proxy`](https://tc39.es/ecma262/#sec-proxy-objects), [`Map`](https://tc39.es/ecma262/#sec-map-objects), [`Promise`](https://tc39.es/ecma262/#sec-promise-objects), [`ArrayBuffer`](https://tc39.es/ecma262/#sec-arraybuffer-objects), [`Uint8Array`](https://tc39.es/ecma262/#sec-typedarray-objects), [`globalThis`](https://tc39.es/ecma262/#sec-globalthis), ...	|✔ | 物件型別
|`console`, `setTimeout()`, `setInterval()`, `clearTimeout()`, `clearInterval()`	|✘|這些東西在瀏覽器和 node.js 中都可以用，但不是標準之一。在 Node.js 有規範/文件，記在[文件的 Globals 篇](https://nodejs.org/api/globals.html#globals_global_objects)可以找到。對於各家瀏覽器，[console](https://console.spec.whatwg.org/#namespacedef-console) 有 Console 的規範/文件。[^CONSOLE1][^CONSOLE2]，其它的部份由 HTML 的標準來規範 [^HTML1][^HTML2]。
|[Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer), [process](https://nodejs.org/api/globals.html#globals_process), [global](https://nodejs.org/api/globals.html#globals_global)* |✘|這些都是 Node.js 才有的全域變數，記在[文件的 Globals 篇](https://nodejs.org/api/globals.html#globals_global_objects)。 <br>* 要注意的是它不像 `global`，[globalThis](https://tc39.es/ecma262/#sec-globalthis)是 ECMAScript 的一部份[^ECMA-262-GLOBAL]，已在瀏覽器上實作。
|[module](https://nodejs.org/api/modules.html#modules_module), [`exports`](https://nodejs.org/api/modules.html#modules_exports), [`require()`](https://nodejs.org/api/modules.html#modules_require), [`__dirname`](https://nodejs.org/api/modules.html#modules_dirname), [`__filename`](https://nodejs.org/api/modules.html#modules_filename) |✘|這些都是 Node.js 才有的全域變數，記在[文件的 Modules: CommonJS modules 篇](https://nodejs.org/api/modules.html#modules_modules)。
|window, alert(), confirm(), the DOM (document, HTMLElement, addEventListener(), Worker, ...)	|✘|這些都是瀏覽器才有的東西。

[^CONSOLE1]: [Dominic Farolino; Terin Stock; Robert Kowalski. - Console Standard](https://console.spec.whatwg.org/).
[^CONSOLE2]: (Living Standard)[https://console.spec.whatwg.org/](https://console.spec.whatwg.org/)

[^HTML1]: [Anne van Kesteren; et al. HTML Standard](https://html.spec.whatwg.org/multipage/).
[^HTML2]: [Living Standard.](https://html.spec.whatwg.org/multipage/)

[^ECMA-262-GLOBAL]: [tc39/proposal-global: ECMAScript Proposal, specs, and reference implementation for `global`. ](https://github.com/tc39/proposal-global)


## 1.3 Before going any further, where is the ECMAScript specification?

> 譯註: 進入之前，規範在哪？

當你 Google "ECMAScript specification" 你會看見*很多*稱聲是合法的規範。而哪一個才是你該讀的？

**簡單的說，最有可能的是發佈在 [tc39.es/ecma262/](https://tc39.es/ecma262/) 上的這一份才是你要的。**[^ECMA-262]

[^ECMA-262]: [ECMAScript Language Specification.](https://tc39.github.io/ecma262/)

詳細的版本:

目前是由 Ecma International Technical Committee 39 (ECMA 國際技術委員會 39，也稱 TC39[^TC39]) 來開發 The ECMAScript language specification，它們是一群不同背景的人所組成的。TC30 在 [tc39.es](tc39.github.io) [^ECMA-262] 維護最新規範。

[^TC39]: [TC39 - ECMAScript](https://www.ecma-international.org/memento/tc39.htm)

會變複雜的原因是，每一年 TC39 會利用一點時間來對規格做快照，成為該年的 ECMAScript 語立標準及版號。例如，*ECMAScript®2019 Language Specification（ECMA-262, 10^th^）*[^ECMA-262-2019]（通常稱為 ES10 或 ES2019）就是把 [tc39.es](tc30.github.io) [^ECMA-262] 上看到的規範，在 2019 年 6 月放入福馬林，密封包裝並以 Pdf 格式永久歸檔。

因此，除非你希望自己的 Web application 只執行在 2018 年 6 月之後的福馬林中的瀏覽器，不然就要一直追最新的 tc39.github.io [^ECMA-262]
但是如果你想(或必須)支援舊瀏覽器或 Node.js 版本，參考較早的規範可能所有幫助。

> 譯註: 福馬林
> 其實原文用 formaldehyde (甲醛)，在此談的是封裝保存手法，所以就用福馬林借代較口語化，我想也較貼近原作的幽默。(wiki: 福馬林是甲醛含量為35%至40%的水溶液。)

[^ECMA-262-2018]: [ECMAScript 2018 Language Specification.](https://ecma-international.org/ecma-262/9.0/index.html)

[^ECMA-262-2019]: [ECMAScript 2019 Language Specification.](https://ecma-international.org/ecma-262/10.0/)

> Note: ISO/IEC 也有發佈 ECMAScript Language Standard 在 ISO/IEC 16262 [^ISO-16262-2011] 上面。不用擔心，因為在此發佈的內容與 ECMA International 發佈的一樣 - 唯一不同的就是要支付 [198 瑞士法郎](https://www.google.com/search?q=198+swiss+francs+in+my+currency)才可以取得。 (大約 6000 新台幣)

[^ISO-16262-2011]: [ISO/IEC 16262:2011 - Information technology - Programming languages, their environments and system software interfaces - ECMAScript language specification.](https://www.iso.org/standard/55755.html)

## 1.4 Navigating the spec

> 譯註: 導讀規範

ECMAScript specification 講了很多事。縱使寫作時已經盡所能的分成邏輯區塊，它仍然是很**龐大**的內容。

就我而言，我喜歡將它分成五個部份

1. 慣例 (Conventions) 與基本定義 (basics)
    - 什麼是 Number？
    - 這句在規範指的是什麼 'throw a **TypeError** exception'？
1. 語言的語法說明
    - 如何寫一個 `for`-`in` 迴圈
1. 語言的編寫時期 (Static) 語意
    - 在 `var` 述句中， `var` 的變數名稱如何決定
1. 語言的執行時期 (Runtime) 語意
    - 如何執行 `for`-`in` 迴圈
1. APIs
    - `String.prototype.subString()` 做了什麼？


但是這並不是規範本身的架構。它的架構中，第一個銀彈是 [§5 Notational Conventions](https://tc39.github.io/ecma262/#sec-notational-conventions) 再來是 [§9 Ordinary and Exotic Objects Behaviours](https://tc39.github.io/ecma262/#sec-ordinary-and-exotic-objects-behaviours)，與第三部份交錯在一起從 [§10 ECMAScript Language: Source Code](https://tc39.github.io/ecma262/#sec-ecmascript-language-source-code) 到 [§15 ECMAScript Language: Scripts and Modules](https://tc39.github.io/ecma262/#sec-ecmascript-language-scripts-and-modules)，像是

> - [§13.6 The `if` Statement](https://tc39.github.io/ecma262/#sec-if-statement) **Grammar productions
Grammar productions**
>     - §13.6.1-6 **Static semantics
Runtime sematics**
>     - §13.6.7 **Static semantics
Runtime sematics**
> - [§13.7 Iteration Statements](https://tc39.github.io/ecma262/#sec-iteration-statements) **Grammar productions
Grammar productions**
>     - §13.7.1 Shared **static
runtime semantics** and **static
runtime semantics**
>     - §13.7.2 The `do`-`while` Statement
>         - §13.7.2.1-5 **Static semantics
Runtime semantics**
>         - §13.7.2.6 **Static semantics
Runtime semantics**
>     - §13.7.3 The `while` Statement
>         - ...

雖然 APIs 分散在 [§18 The Global Object](https://tc39.github.io/ecma262/#sec-global-object) 到 [§26 Reflection](https://tc39.github.io/ecma262/#sec-reflection)

在此，我想強調的是絕對沒有人閱讀規範的方式是從頭到尾。你只要查看想找的相關章節與內容就好。試著反問自己要找的是這五個部份的哪一個部份。如果你無法確定是哪一個，請問自己一個問題「在哪個時間點運作的問題(無論你想要確認什麼)？」可能會有幫助。不用擔心，看規範會慢慢習慣的。

> 譯註:
> "at which time is this (whatever you are trying to confirm) evaluated?"
> 有些人翻譯成 "在什麼時候(無論你想要確認什麼)這個問題被評估了?"
> evaluated 其實也許是 eval() 的意思，直翻是評估，是編譯 JS 的一個步驟，執行前必定會做的事，在此翻譯成「運作」較為口語化。

# 2 Runtime semantics

> 譯註: Runtime semantics 執行時期語意

規範大部份的內容，都是此語言的執行時期語意與 APIs，讓人感到疑惑的通常也都在這部份。

一般來說，閱讀這些段落是很利落直白的。但是該規範使用許多的縮寫，對於剛起步的人 (至少對我來說) 是非常棘手的。我試著解釋其中的一些 conventions，並且利用它搞清楚一些事情是如何運作的。

## 2.1 Algorithm steps

> 譯註: Algorithm steps 演用法步驟

ECMAScript 常用演算法步驟表示執行時期的語意，它不像虛擬碼 (pseudocode)，而是更加精確的表示形式。

> **EXAMPLE 1**
> :::warning
> 一個簡單的演算法步驟如下:
> 1. Let a be **1**.
> 2. Let b be a+a.
> 3. If b is **2**, then
>    1. Hooray! Arithmetics isn't broken.
> 4. Else
>    1. Boo!
> :::
>

> 深入閱讀: [§5.2 Algorithm Conventions](https://tc39.github.io/ecma262/#sec-algorithm-conventions)

## 2.2 Abstract operations

> 譯註: Abstract operations 抽象運算

你有時會在規範中看見像是函數的東西，[`Boolean()`](https://tc39.github.io/ecma262/#sec-boolean-constructor-boolean-value) 函數的第一步是:

:::warning
When `Boolean` is called with argument value, the following steps are taken:

1. Let b be [ToBoolean](https://tc39.github.io/ecma262/#sec-toboolean)(value).
2. ...
:::

這個 "ToBoolean" 函式，就被稱為 **abstract operations** (抽象運算): 它是抽象的，因為並不是實際曝露在 JavaScript 程式的函式。只是撰寫人員發明的一種表示法，使他們不必一次又一次撰寫相同的東西。

> 注意: 現在暫時不用擔心在 ToBoolean 前的 `!`。我們將在稍後的 [§ 2.4 Completion Records; ? and !](#24-Completion-Records--and-) 討論。

> 深入閱讀: [§5.2.1 Abstract Operations](https://tc39.github.io/ecma262/#sec-algorithm-conventions-abstract-operations)

## 2.3 What is [[This]]

有時候也看見這種 ***[[Notion]]*** 的用法，像是「把 *proto* 表示成 *obj.[[Prototype]]*」。這個符號利用解讀上下文，能夠技術性地表示成幾種不同的意思，但是你要花很長的時間了解，符號代表一些無法透過觀察 JavaScript 程式了解的內部特性。

精準的表示的話，這符號代表三種意義，我將會舉規範中的範例說明。

不過，現在請先隨意的跳過。

> 譯註: 要看的話就是接下來的三個小節。

### 2.3.1 A field of a Record

> 譯註: 一個 Record 的一個 field
> 譯註: 物件屬性, pair
> 譯註: 像是 public 的 object property. ex: `O.field`

ECMAScript spec 使用術語 **Record** 表示有固定的 key 組合成的 key-value 對照關係 (有點像是 C 語言的 structure)。Record 的每一對 key-value 會稱為 ***field***，因為 Record 只出現在規範，並不在 JavaScript 程式中，所以使用 [[Notation]] 意思是指一個  Record 的 fields。

> 譯註: [[Notation]] = field in Record = key-value pair

> **EXAMPLE 2**
> 值得注意的是, [Property Descriptors (屬性描述器)](https://tc39.es/ecma262/#sec-property-descriptor-specification-type) 是擁有 [[Value]], [[Writable]], [[Get]], [[Set]], [[Enumerable]], 和 [[Configurable]] 這些 fields 的 Records。在 [IsDataDescriptor](https://tc39.es/ecma262/#sec-isdatadescriptor) abstract operation 大量使用這個符號。
>
> :::warning
> 當 *Desc* ([Property Descriptor](https://tc39.es/ecma262/#sec-property-descriptor-specification-type)或 **undeinfed**) 當作參數呼叫 abstract operation  IsDataDescriptor 時，會執行下面的步驟
>
> 1. If *Desc* is undefined, return **false**.
> 2. If both *Desc*.\[\[Value\]\] and *Desc*.\[\[Writable\]\] are absent, return **false**.
> 3. Return **true**.
> :::
>
> 譯註: 翻譯結果是參考規範 ES2021 的內容。


另一個 Records 的實際案例可以在本篇下一節，[§2.4 Completion Records; ? and !](#24-Completion-Records--and-) 找到。

> 延伸閱讀: [§6.2.1 The List and Record Specification Types](https://tc39.es/ecma262/#sec-list-and-record-specification-type)

### 2.3.2 An internal slot of a JavaScript Object

> 譯註: JS 物件的內部插槽(開口)
> 譯註: 「插槽」翻成「開口」也滿合乎意思的
> 譯註: 物件方法
> 譯註: 像是 private 的 object property. ex: `O.[[Notion]]`

JavaScript Objects 還有規定所謂的 internal slots (內部開口) 用來保存資料。和 Record fields 一樣，internal slots 也不能透過觀察 JavaScript 來發現它們，但是也許會從某些專用工具中曝露出來，像是 Google Chrome's DevTools。因此 [[Notation]] 也是 internal slots 的意思。

internal slots 的規範在 [§2.5 JavaScript Objects](https://timothygu.me/es-howto/#javascript-objects) 有介紹。現在不必在意它能做什麼用，但請注意以下範例。

> **EXAMPLE 3**
> 大多數的 JavaScript Objects 都有一個 [[Prototype]] 的 internal slot 指向該物件的繼承自哪個物件。此 internal slot 的值通常是 [`Object.getPrototypeOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf#) 的返回值。在 [OrdinaryGetPrototypeOf](https://tc39.es/ecma262/#sec-ordinarygetprototypeof) abstract operation 中，就只是回傳 internal slot 的值:
> :::warning
> 以 Object *O* 作參數，呼叫 abstract operation `OrdinaryGetPrototypeOf` 時，就會運作下列的步驟:
> > 1. Return *O*.[[Prototype]].
> :::

> 注意: Object 的 internal slots 和 Record fields 的 fields 看起來是相同的，但是可以透過查看符號前面的部份來區分 (點`.`之前的部份), 無論它是一個 Object 或 Record。這通常從環境上下文就很明顯。

### 2.3.3 An internal method of a JavaScript Object

JavaScript Objects 還有規定所謂的 internal methods。像 internal slots 一樣，這些 internal method 無法透過 JavaScript 直接觀察到。所以使用 [[Notation]] 也是 internal methods 的意思

Internal methods 的規範在 [§2.5 JavaScript Objects](https://timothygu.me/es-howto/#javascript-objects)有介紹。現在不必在意它能做什麼用，但請注意以下範例。

> **EXAMPLE 4**
> 所有的 JavaScript 函數都有一個 internal method [[Call]] 代表函數的「執行」功能。[Call](https://tc39.es/ecma262/#sec-call) 的 abstract operation 如下面步驟:
>
> > 3.Return ? *F*.[[Call]](*V*, *argumentsList*).
>
> 其中 *F* 是一個 JavaScript 的 function 物件。在這個例子中，*F* 的 internal method 的這個 [[Call]] 是使用本身的參數 *V* 和 *argumentsList* 執行的

> 注意: [[Notation]] 的第三個意思看起來像是 function call, 這點可以與其他的區別開來。

## 2.4 Completion Records; ? and !

> 譯註: runtime semantic 執行時期解讀的結果 => 推估的執行結果
> 述句完成值

在 ECMAScript spec 中，每一個 runtime semantic，會顯性或隱性地產生一個報告結果的 ***Completion Record***。Completion Record 是一個可能有三個 fields 的 Record。


1. ***[[Type]]*** (**`normal`**, `return`, `throw`, `break` 或 `continue`)
2. 若 [[Type]] 是 `normal`, `return` 或 `throw`，那麼還會有一個 ***[[Value]]*** ("看是什麼被 return/throw 出來")
3. 若 [[Type]] 是 `break` 或 `continue`，那麼有可能還會有 [label](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label#) 當作是接下來要執行到哪 (breaks from/continues to)的 ***[[Target]]***，當作執行語意的結果。

> 注意: 表示 Records 的 fields 要使用兩個中括號。跳去看 [§2.3.1 A field of a Record](#231-A-field-of-a-Record-一個-Record-的一個-field) 初步了解一下 Records 和相關符號的定義。

一個 Completion Record 的 [[Type]] 是 `normal` 稱為 ***normal compliton***。每一個不同於 `normal compliton` 的 Completion Record 稱為 ***abrupt completion***。

大多數的情況下，你只有遇到 [[Type]] 是 throw 的 abrupt completeions 程式才會死掉。其它三種 abrupt completion 是看程式怎麼寫就怎麼執行。實際上，你將不會看見任何其它的 type 在內建的 function 的定義中。因為 `break`/`continue`/`return` 不會跨 function 執行。


> 譯註: 意思是
> 1. ***[[Type]]***
> 2. ***[[Value]]*** 值
>     - [[Type]] 的值是 `normal` => **normal compliton**
>     - [[Type]] 的值是 `throw` => **abrupt completion** 程式容易死掉
>     - [[Type]] 的值是 `return` => **abrupt completion**
> 3. ***[[Target]]*** 去哪
>     - [[Type]] 的值是 `break` => **abrupt completion**
>     - [[Type]] 的值是 `continue` => **abrupt completion**

> 延伸閱讀: [§6.2.3 The Completion Record Specification Type](https://tc39.github.io/ecma262/#sec-completion-record-specification-type)

---

由於 Completion Records 的定義，JavaScript 執行像是傳遞錯誤泡泡一直遇到 `try`-`catch` 區塊的這種細節並不存在規範中。實際上錯誤 (或更確切的是 abrupt completions) 是明確處理。

沒有縮寫，普通的一個 abstract operation 呼叫一定會 return 一個計算結果或 throw 一個錯誤，如下所示

> **EXAMPLE 5**
> :::warning
> 呼叫一個可能會 throw 的 abstract operation 無縮寫版本的步驟如下:
> 1. Let *resultCompletionRecord* be AbstractOp().
> > 注意: *resultCompletionRecord* 是一個 Completion Record.
> 2. If *resultCompletionRecord* is an abrupt completion, return *resultCompletionRecord*.
> > 注意: 若是 abrupt completion 直接回傳 *resultCompletionRecord* 。換句話說，倚在 AbstractOp 錯誤被轉拋，就停止繼續執行
> 3. Let *result* be *resultCompletionRecord*.[[Value]].
> > 注意: 確保取得 normal completion 之後，我們可以 unwrap Completion Record 取得我們預計獲得的實際結果
> 4. *result* is the result we need. We can now do more things with it.
> :::
>
> 這可能會依稀回想起你的 C 錯誤處理方式：
>
> ```c
> int result = abstractOp();  // Step 1
> if (result < 0)             // Step 2
>   return result;            // Step 2 (continued)
>                             // Step 3 is unneeded
> // func() succeeded; carrying on...  // Step 4
> ```

但是為了減少這些大量重複的步驟，ECMAScript spec 的編輯人員自 ES2016 開始加入一些縮寫方式，透過以下兩種寫法等效的表達相同的規範。

> **EXAMPLE 6**
> :::warning
> 呼叫一個可能會 throw 的 abstract operation 用 ***`ReturnIfAbrupt`*** 縮寫版本的步驟如下:
> >
> 1. Let *result* be AbstractOp().
> > 注意: 在此，就像上述例子的第一步，result 是一個 Completion Record。
> 2. ReturnIfAbrupt(*result*).
> > 注意: ReturnIfAbrupt 用處理任何可能的 abrupt completions，並將 result 自動 unwrap [[Value]]。
> 3. *result* is the result we need. We can now do more things with it.
> :::


或者用更簡潔的問號(?)表達:

> **EXAMPLE 7**
> :::warning
> 呼叫一個可能會 throw 的 abstract operation 用 ***question mark (?)*** 縮寫版本的步驟如下:
>
> 1. Let *result* be ? AbstractOp().
> > 注意: 有了這個符號我們再也不會因為 Completion Records 而讓程式死掉。這個 `?` 縮寫幫我們處理*所有的事*，結果也可以馬上拿來使用。
> 2. `result` 是我們要的結果。拿它來做更多的事。
> :::

---

有時，它可以傳達更多有關規範意圖的訊息給讀者，如果我們知道一個特定的 `AbstractOp()` 呼叫將不會回傳一個 abrupt completion。這樣的情況，將使用 ***exclamation mark (!)***:

> EXAMPLE 8
> :::warning
> 呼叫一個可能會 throw 的 abstract operation 用 ***exclamation mark (!)*** 縮寫版本的步驟如下:
> A few steps that call an abstract operation that cannot ever throw with an exclamation mark (!):
>
> 1. Let result be ! AbstractOp().
>
> >  使用 `?` 表達「 一定會遇到任何錯誤」使用 `!`  表達「永遠不會遇到任何錯誤」會在 abrupt completions 中得到，而且如果我們這樣做的話，它會是 spec 的 bug。像是這個用 `?` 的例子，我們不會處理所有的 Completion Records。，結果也可以馬上拿來使用。
>
> 2. result 是我們要的結果。拿它來做更多的事。
> :::

> CAUTION
> 可以承認 `!` 看起來容易和有效的 JavaScript 表達式搞混:
>
> > 1. Let *b* be ! `ToBoolean(value)`.
> >
> > — 摘錄自 [`Boolean()`](https://tc39.es/ecma262/#sec-boolean-constructor-boolean-value).
>
> 在此，`!` 只是指我們保證呼叫 ToBoolean 不會產生例外, 而不是對結果進行邏輯 `not` 運算!

> 延伸閱讀: [§5.2.3.4 ReturnIfAbrupt Shorthands](https://tc39.es/ecma262/#sec-returnifabrupt-shorthands)

## 2.5 JavaScript Objects

在 ECMAScript 中，每個 Object 有一組 ***internal methods*** 規範的其它部份做某些任務時會呼叫，所有 Object 的一些 internal methods。

- [[Get]], 取得 Object 上的 property (e.g. `obj.prop`)
- [[Set]], 設定 Object 上的 property (e.g. `obj.prop = 42;`)
- [[GetPrototypeOf]], 取得 Object 上 ptototype (i.e., `Object.getPrototypeOf(obj)`)
- [[GetOwnProperty]], 取得 Object  property 上的 Property Descriptor (i.e., `Object.getOwnPropertyDescriptor(obj, "prop")`)
- [[Delete]], 刪除 Object 上的 property (e.g. `delete obj.prop`)

(詳情請看 [§6.1.7.2 Object Internal Methods and Internal Slots](https://tc39.es/ecma262/#sec-object-internal-methods-and-internal-slots)).

根據此定義，function 物件 (或只是 "function") 是就是具有 [[Call]] 或 [[Construct]] 這兩個內部方法的物件，所以也稱之為可執行(可呼叫)物件

規範將所有的 Object 分成兩個陣營: `ordinary object` (普通的物件) 和 `exotic object` (特殊的物件)。大部份你遇見的物件，都是只擁有定義在 [§9.1 Ordinary Object Internal Methods and Internal Slots](https://tc39.es/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) 這種預設 internal methods 的 ordinary objects .

但是ECMAScript 規範還有定義一些特殊物件。這些物件會 override 一些預設 internal method 的實作。允許執行特殊物件，會有一些最小限度的限制，但是一般而言這些已經 overriden internal methods 可以做很多的神奇妙用，而不違反規範。

> EXAMPLE 9
> `Array` 物件就是 `exotic objects` 的一種。一些特殊語意，像是 `Array` 的 `length`。`ordinary objects` 適用的工具無法用在它身上。
>
> 其中，設定 Array 的 length 屬性，看起來是一個可以刪除的普通屬性(但其實不能被刪除)。相反，`new Map().size` 只是一個在 `Map.prototype` 上的 `getter` 函數，沒有像 `[].length` 這種的魔法屬性。

> ```javascript
> > const arr = [0, 1, 2, 3];
> > console.log(arr);
> [ 0, 1, 2, 3 ]
> > arr.length = 1;
> > console.log(arr);
> [ 0 ]
> > console.log(Object.getOwnPropertyDescriptor([], "length"));
> { value: 1,
>   writable: true,
>   enumerable: false,
>   configurable: false }
> ```
> ```javascript
> > console.log(Object.getOwnPropertyDescriptor(new Map(), "size"));
> undefined
> > console.log(Object.getOwnPropertyDescriptor(Map.prototype, "size"));
> { get: [Function: get size],
>   set: undefined,
>   enumerable: false,
>   configurable: true }
> ```
> 透過 override [[DefineOwnProperty]] 這個 internal method 可以實現這個神奇的行為。(但是改不了已經定義好的魔法屬性)，詳情可參考 [§9.4.2 Array Exotic Objects](https://tc39.es/ecma262/#sec-array-exotic-objects)

ECMAScript 規範也允許其它的規範定義自己特有的 exotic objects。透過這種機制可以指定在瀏覽器上跨域 API 存取的限制 (參考 [WindowProxy](https://html.spec.whatwg.org/multipage/window-object.html#windowproxy))。JavaScript 開發者也可以透過 `Proxy` API 建立自己的 exotic objects。

---

JavaScript Object 也有 ***internal solts*** 定義某些型別的值。我傾向將 internal slots 想成某種隱藏 [`Object.getOwnPropertySymobols()`](https://tc39.es/ecma262/#sec-object.getownpropertysymbols) 行為的 Symbol-named 屬性。`ordinary objects` 和 `exotic objects` 都有 `internal slots`

>  在 [§ 2.3.2 An internal slot of a JavaScript Object](#232-An-internal-slot-of-a-JavaScript-Object) 裡面, 我有提過物件有一個叫 [[Prototype]] 的 internal slot。(其實，所有 ordinary objects，甚至像是 Array 的 exotic objects 都擁有這樣的東西)，但是前面也提到有一個方法叫 [[GetPrototypeOf]]，它們有什麼差別？
>
> 此處關鍵字最多: 並不是所有的物件都有 [[Prototype]] 的 internal slot ，但是所有的物件都有實作 [[GetPrototypeOf]] internal method。
> 特別像是 Proxy 沒有自己的 [[Prototype]] ，而 [[GetPrototypeOf]] internal method 則是替代成儲存在 Proxy 物件內 [[ProxyTarget]] 的註冊(某 function) handler 或目標(某物件)的 prototype 。
>
> 所以，使用 Object 時，一定要用適合的 internal method 而不是直接存取 internal slot 一直都是好決定。

---

另一種 Object 關係的思考方式，internal methods 和 internal slots 是透過典型的物件導向視角來看。Object 型別像是一個 interface 指定幾個必須實作的 internal methods。(ex: ordinary objects 提供預設的實作，而 exotic objects 則是可以 override 一部份或全部。) 而 internal slots 就像是物件的 instance variables - 物件的實作細節。

所有的關係總結在下面這張 UML diagram (點擊放大):

[![](https://timothygu.me/es-howto/object-uml.svg)](https://timothygu.me/es-howto/object-uml.svg)


## 2.6 Example: String.prototype.substring()

現在，我們已經對規範怎麼架構和撰寫有一個非常好的了解，讓我們來練習！

設假現下列這樣的問題:

> 不執行下面程式碼，這段會回傳什麼？
> ```javascript
> String.prototype.substring.call(undefined, 2, 4)
> ```

這是一個棘手的問題。似乎有兩個合理的解果:

1. `String.prototype.substring()` 可以先將 **`undefined`** 轉成 `"undefined"` 並且在該字串的索引 2 和 3 處 (區間 [2, 4) ) 取出字串，**回傳** "de"。
2. 另一個解釋，`String.prototype.substring()` 也許只是合理的**拋出錯誤**，因此拒絕 **`undefined`** 作為輸入

不幸的是，[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring#) 也沒有提供此值不是字串時，函數的行為會如何的確切解答。

規範救援！在規範 [ECMA-262]左上角的搜尋輸入 `substring` 後，我們會到達 [§22.1.3.23 String.prototype.substring ( start, end )](https://tc39.es/ecma262/#sec-string.prototype.substring)[^2022ecma262] 記載著這個函數行為的規範。

[^2022ecma262]: [Draft ECMA-262 / April 6, 2021
ECMAScript® 2022 Language Specification](https://tc39.es/ecma262/)

閱讀演算法之前，我們先思考一下我們已知的部份，我假設我已了解 `str.substring()` 在回傳給定字串的一部份是如何工作的。我們現在還無法確定 **`this`** 值設定成 **`undefined`** 的行為是什麼。所以，我們特別查詢演算法處理 **`this`** 值的步驟。

幸運的是，[`String.prototype.substring()`](https://tc39.es/ecma262/#sec-string.prototype.substring) 演算法的第一步，就是要處理 this 值

> 1. Let *O* be ? [RequireObjectCoercible](https://tc39.es/ecma262/#sec-requireobjectcoercible) (**`this`** value).

這個  `?` 簡寫隱含的告訴我們，有時候 [RequireObjectCoercible](https://tc39.es/ecma262/#sec-requireobjectcoercible)(它是個 abstract operation) 會拋出例外，不然就是正常使用。

事實上，如果它拋出錯，就符合我們上述的第二個假設。符合期待的，我們查到透過點擊 [RequireObjectCoercible](https://tc39.es/ecma262/#sec-requireobjectcoercible) 連結查到的。

這個叫 [RequireObjectCoercible](https://tc39.es/ecma262/#sec-requireobjectcoercible) 的 abstract operation 有點不太一樣。不像大多數的 abstract operation，它是透過查表法定義而不是演算法。

> |參數型別   |回傳結果                      |
> |----------|----------------------------|
> |Undefined | 拋出一個 **TypeError** 例外。|
> |Null      | 拋出一個 **TypeError** 例外。|
> |...       |...                         |

不管怎樣 - 在 [RequireObjectCoercible](https://tc39.es/ecma262/#sec-requireobjectcoercible) 的規範中，和 Undeifned (我們傳給 [`substring()`](https://tc39.es/ecma262/#sec-string.prototype.substring) 作為 **this** 的型別) 對應在同一行的是回傳一個例外。並且因為在函數的定義中使用了 `?` 表示法，我們知道拋出例外給函數的 caller。Bingo!

而且，我們有我們的答案: **這一小段程式碼拋出一個 TypeError 例外。**

>  規範只有規定拋出 Error 的型別，沒有規定要包含什麼訊息。意思是實作可能有不同的錯誤訊息，甚至是本地的錯誤訊息。
>
> 例如:  Google 的 V8 6.4 版 (內建在 Google Chrome 64) 的訊息是
> ```
> TypeError: String.prototype.substring called on null or undefined
> ```
> 而 Mozilla Firefox 的 57.0 版給的訊息，少到沒什麼幫助
> ```
> TypeError: can't convert undefined to object
> ```
> 相同的 ChakraCore 的 1.7.5.0 版 (Microsoft Edge 的 JavaScript 引擎) 走的是 V8 的路線。
> ```
> TypeError: String.prototype.substring: 'this' is null or undefined
> ```


## 2.7 Example: Can `Boolean()` and `String()` ever throw exceptions?

當撰寫到任務關鍵程式碼時，第一重要的程式碼，往往是要寫一個例外處理。因此，要常思考「某些內建函數有拋過例外嗎？」

在這個例子，我們要試著回答兩個內建函數 `Boolean()` 和 `String()` 的問題。並非將變數包裝成物件(which form boxed objects)的 `new Boolean()` 和 `new String()` - 毫無懸念，這是 [JavaScript 最容易誤用的特性](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/types%20%26%20grammar/ch3.md#object-wrapper-gotchas)之一，很多 JS 的風格指南都不鼓勵這種做法[^YDKJS]。

[^YDKJS]: [Kyle Simpson. You Don't Know JS (book series)](https://github.com/getify/You-Dont-Know-JS)

找到規範中的 `Boolean()` 段落，我們看見短短的演算法

:::warning
When Boolean is called with argument value, the following steps are taken:

1. Let *b* be ! [ToBoolean](https://tc39.es/ecma262/#sec-toboolean)(*value*).
2. If NewTarget is **`undefined`**, return *b*.
3. Let *O* be ? [OrdinaryCreateFromConstructor](https://tc39.es/ecma262/#sec-ordinarycreatefromconstructor)(NewTarget, **"%Boolean.prototype%"**, « [[BooleanData]] »).
4. Set *O*.[[BooleanData]] to *b*.
5. Return *O*.
:::

不過，它並不像是看見的這麼簡單粗暴，還包含一些呼叫 [OrdinaryCreateFromConstructor](https://tc39.es/ecma262/#sec-ordinarycreatefromconstructor) 時複雜的雜技。更重要的是，有一個 `?` 簡寫，代表這個函數在某些情況之下可能會拋出錯誤。讓我們仔細看看。

第一步，把 *value* (函數的參數) 轉型成一個 Boolean 值。有趣的是這一步沒有 `?` 或 `!` 的簡寫，但是通常沒有 Completion Record 縮寫意思和 `!` 意思相同。所以第一步不會拋出例外

第二步，檢查被稱為 New Target 的這個東西是不是 **undefined**。***NewTarget*** 與 ES2015 加入的 `new.target` 描述屬性(meta property) 規範等效。允許規範區分 `new Boolean()`(New Target 是 `Boolean`) 和 `Boolean()` (New Target 是 `undefined`)呼叫。因為我們只注意到直接呼叫的 Boolean() 時灰 我們知道 NewTarget 總是 undefined，而且，演算法將總是直接回傳 b 沒有其它的處理。

因為不用 `new` 呼叫 `Boolean()` 只會跑 `Boolean()` 演算法的前兩步驟，而且前兩步都不會拋出例外，我們可以得出結論，無輪 **`Booldan()`** 輸入什麼，都**保證不會拋出例外**。

---

我們來看看 `String()`

:::warning
22.1.1.1 String ( value )
When String is called with argument value, the following steps are taken:

1. If value is not present, let s be the empty String.
2. Else,
	1. If NewTarget is **undefined** and [Type](https://tc39.es/ecma262/#sec-ecmascript-data-types-and-values)(*value*) is Symbol, return [SymbolDescriptiveString](https://tc39.es/ecma262/#sec-symboldescriptivestring)(*value*).
	1. Let s be ? [ToString](https://tc39.es/ecma262/#sec-tostring)(*value*).
3. If NewTarget is **undefined**, return *s*.
4. Return ! [StringCreate](https://tc39.es/ecma262/#sec-stringcreate)(*s*, ? [GetPrototypeFromConstructor](https://tc39.es/ecma262/#sec-getprototypefromconstructor)(NewTarget, `"%String.prototype%"`)).
:::


> 譯註:
> 原文寫 「4. Return ? StringCreate...」
> 第四步驟有 `?` 的簡寫，但 2022 的 ECMA262 改成使用 `!` 的縮寫。

以 [`Boolean()`](https://tc39.es/ecma262/#sec-boolean-constructor-boolean-value) 的經驗依此類推，我們知道 NewTarget 總是 **`undefined`** 在這個(直接呼叫)的時候，所以可以不用考慮，跳過最後一步。我們也會知道 Type 和 [SymbolDescriptiveString](https://tc39.es/ecma262/#sec-symboldescriptivestring) 是安全的，因為它們兩都不會處理 abrupt completeions 的情況。但是還有一個地方要注意呼叫 ToString 之前還有一個 abstract operation `?`。仔細看

像是前面查的 [RequireObjectCoercible](https://tc39.es/ecma262/#sec-requireobjectcoercible) ，[ToString](https://tc39.es/ecma262/#sec-tostring)(*argument*) 也提到這個定義。

> 譯註:
> 「也用這個表格定義。」但是這應該是提到有這個定義才對，並不是在此定義 ToString。

> |參數型別   |回傳結果                      |
> |----------|----------------------------|
> |Undefined | 拋出一個 **TypeError** 例外。|
> |Null      | 拋出一個 **TypeError** 例外。|
> |...       |...                         |
> |Object    |下面兩步 <br>1. Let primValue be ? [ToPrimitive](https://tc39.es/ecma262/#sec-toprimitive)(*argument*, hint String). <br>2. Return ? [ToString](https://tc39.es/ecma262/#sec-tostring)(*primValue*)

在 `String()` 中呼叫 `ToString()` 的時候，*value* 會是 Symbol 以外的值 (在前一步就就過濾好了)。然而，仍有兩個 `?` 在 Object 那一列，我們可以透過 [`ToPrimitive`](https://tc39.es/ecma262/#sec-toprimitive) 的連結，並看到事實上若 *value* 是一個 Object 有多機會產生問題。

> EXAMPLE 10
> `String()`
> **Several examples `String()` where throws**
> ```javascript
> // Spec stack trace:
> //   OrdinaryGet step 8.
> //   Ordinary Object's [[Get]]() step 1.
> //   GetV step 3.
> //   GetMethod step 2.
> //   ToPrimitive step 2.d.
> String({
>   get [Symbol.toPrimitive]() {
>     throw new Error("Breaking JavaScript");
>   }
> });
> ```
> ```javascript
> // Spec stack trace:
> //   GetMethod step 4.
> //   ToPrimitive step 2.d.
>
> String({
>   get [Symbol.toPrimitive]() {
>     return "Breaking JavaScript";
>   }
> });
> ```
> ```javascript
> // Spec stack trace:
> //   ToPrimitive step 2.e.i.
>
> String({
>   [Symbol.toPrimitive]() {
>     throw new Error("Breaking JavaScript");
>   }
> });
> ```
> ```javascript
> // Spec stack trace:
> //   ToPrimitive step 2.e.iii.
>
> String({
>   [Symbol.toPrimitive]() {
>     return { "breaking": "JavaScript" };
>   }
> });
> ```
> ```javascript
> // Spec stack trace:
> //   OrdinaryToPrimitive step 5.b.i.
> //   ToPrimitive step 2.g.
>
> String({
>   toString() {
>     throw new Error("Breaking JavaScript");
>   }
> });
> ```
> ```javascript
> // Spec stack trace:
> //   OrdinaryToPrimitive step 5.b.i.
> //   ToPrimitive step 2.g.
>
> String({
>   valueOf() {
>     throw new Error("Breaking JavaScript");
>   }
> });
> ```
> ```javascript
> // Spec stack trace:
> //   OrdinaryToPrimitive step 6.
> //   ToPrimitive step 2.g.
>
> String(Object.create(null));
> ```


So for String(), our conclusion is that it never throws exceptions for primitive values, but may throw errors for Objects.

所以 `String()` 絕對不會在 primitive values 時拋出例外，但是會在 Object 時可能拋出例外，是我們的結論。

## 2.8 Example: `typeof` operator

到現在，我們只分析了 API 函數，讓我們試些不同的。

>  待續。 <[https://github.com/TimothyGu/es-howto/issues/2](https://github.com/TimothyGu/es-howto/issues/2)>
