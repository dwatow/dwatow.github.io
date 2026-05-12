---
title: 我剛接觸 Web Camp 的 KATA 版本！
date: 2020-09-24 00:00:00
tags:
  - 12th鐵人賽
  - training camp
  - kata
categories:
  - 完美 Camp 進化論
source_url: https://ithelp.ithome.com.tw/articles/10242958
---

簡單的說 Kata\[1\] 指的是在一定的動作之下，去體會設計這個動作的原因，遇見的痛點就是學習的點。

> 警語!!  
> 照著 Kata 練習，會遇到許多的困難。  
> 我會在這盡可能的把 Kata 講清楚，但是不保證照練就成功。

在好想工作室的 Web Camp 有一個進化中的 Kata  
今天以我剛當學員時接觸到的版本介紹(進化後的現行版本會專門寫一系列介紹)  
有追連載的朋友，可以比較這前後的差異哦

**切版練習**

-   切版: HTML/CSS 原生語法
-   切版+RWD: CSS 框架
-   切版+RWD: CSS 前置處理器

**JavaScript練習**

-   事件趨動、資料趨動
-   拓展前端視野
-   前端框架

所有的 Kata 都放在 git 程式碼託管服務上(像是 github) 所以要開始 Kata 前，有一個隱藏的關卡，把 git 學起來。

> 但是要學到什麼程度，是一個發散式的問題  
> 不過在此「學習 git」這件事，有明確的問題要解決「把題目 clone 下來」  
> 所以雖然發散，只要腦袋清楚就不會失去方向。

## 切版練習

在我剛 Training 時，有 7 個版，但是中途被加了一個版，所以總共切了 8 個版。  
但是，Kata 沒有變，還是三個主題。

> 每兩個版，同一個主題，切完兩個版，找人 code review

主要就是找賣版的網站，然後仿做一個。  
以這樣的方式看看自己的理解與實際做出來的困難度。  
這是一個沒有標準答案的切版練習。

> code review 的大原則「不要使用你不懂的語法」

code review 的有趣之處就是可以看見學員的思路是不是卡住還是對「正確」這件事有誤會。可以透過溝通進行交流學習。

學習是透過自學，所以一直都是自己上網找問題的解決方式，卡關時就問問隔壁的或其它的前輩。  
透過隨時分享的方式進行知識性的交流，對起步較友善。

### 切版: HTML/CSS 原生語法

學習 HTML/CSS 的學習方法，就是當作字典，查一個字學一個字。  
利用大量的時間查閱來累積字彙。

**基本的語法結構**

```xml
<tagName attribute="value">Contain</tagName>

```

**切版原則**\[2\]

-   由上到下
-   由左至右
-   由粗到細

![](/images/f4a91620-nsGJlz1.jpg)

### 切版+RWD: CSS 框架

學習主流的 CSS 框架: Bootstrap。當時，我學習時是 Bootstrap 4 Alpha 版。  
就是還沒有出現 Bootstrap4 中文版文件的那個時候。XDD

主要學習 Bootstrap 的 Grid 是如何 RWD 的。  
那時實現的語法是 flex，所以也順便學習了 flex 的語法。

也是那時，開始有比較規律的「想知道嗎？」(關於「想知道嗎？」這個活動，以後會專門寫一篇來介紹)

### 切版+RWD: CSS 前置處理器

學習主流的前置處理器: Sass 但是要寫 Sass 還是 SCSS 是自己決定就好。  
我選擇較接近原生寫法的 SCSS。

主要學習前置處理器的厲害功能，更有彈性的使用 CSS

被加碼的一個版: CSS component  
有興趣的人，可以看看這一篇 [How to structure a Sass project](http://thesassway.com/beginner/how-to-structure-a-sass-project) 關於 Sass 的結構化。

### 第七個版: 隨意使用技術。

第 7 個版，不限定你使用的技術，但是要在 git 上面開 branch 將你的 code 和別人的分開。

## JavaScript 練習

JavaScript 的學習，在好想工作室算是比較發散式的學習，並沒有明確的主題或內容告訴你明確的進度。但是也是有 Kata 可以進行。執行起來就比較......沒有邊際的感覺，總覺得把你丟在 JavaScript 海的中間，你要自己找到方向與依靠。

這**發散式的體會**，是設計中的一環

以寫程式為工作是一個永遠沒有終點的學習過程，學習是必要的主力技能。其中包含了學習什麼？要學到哪算是 ok？要往哪個方向學？如果學員一路的成長，都被扶持著，那麼這個問題在離開好想時終究要面對。未來你要學 Three.js 嗎？要學 TypeScript 嗎？要學 Webpack 嗎？

### 事件趨動、資料趨動

這個練習，就是 to-do list 3 個版本。  
做完一個版本，就找人 code review。

1.  原生 JavaScript
2.  jQuery
3.  Vue (CDN)

在這過程，有很多人就爆炸了。原因除了上述的發散式學習之外，這裡有一些隱藏的關卡。對未接觸 JavaScript 的人來說，這是剛接觸 JavaScript 的開始。所以還要熟悉基本語法。

> 相對於 git 的問題，在這就沒有明確的問題要解決。  
> 所以**熟悉基本語法**就是一個真正的發散式的課題。

我在當學員時，Howard 說你就跳過這一段，直接寫 JS30 吧！別浪費時間了。

### 拓展前端視野

那時，要去上全英文的線上課程 [JavaScript30](https://github.com/wesbos/JavaScript30)  
對我來說，英文聽力是一大挑戰，但是我還是挺過來了 (相信其它的學員們，一定也可以的)

JS30 拓展了我對前端可能性的視野。做完練習，我也練習了怎麼提交 pull request。想不到成功合併了，成為第一個繁體中文合併者。

![](/images/f4a91620-xVc2c9u.png)

### 前端框架

> 在這個時候，我已經是 Mentor 了。但是我還在學 Vue。

當時在好想的主流是用 Vue，也許是我在 to-do list 沒有好好體會事件驅動與資料驅動這件事。就開始做前端框架的練習，我直接閱讀/練習官網文件的內容。

當時使用的是 vue-cli，但是官網文件卻是用 vue cdn 讓我很困擾。  
我找了當時後期，也正在學 Vue(沒錯，他們追上我) 的學員一起弄個 Workshop 每一週做一些主題性的練習 [Vue a bit - github](https://github.com/dwatow/vue-a-bit)。進行了幾週之後，也上了一個老外的線上課程學 Vuex，才把 Vue 學起來，非常的吃力呢！

後來發現，這真的不是一件容易的事情。

## 光靠自己做 Kata ，是無法學會的

以柔道為例: (Clean Coder 是以忍術為例)

這是 Nage-No-Kata 由兩位日本的選手在 World Judo Kata Championships MALAGA 表演

> 對於柔道摔技的 Kata，叫做 Nage-no-Kata (日文發音)

[![Yes](/images/f4a91620-0.jpg)](https://www.youtube.com/watch?v=-Qe_JKQjJTA)

真實的比賽中，厲害的部份像這樣 2:24

[![Yes](/images/f4a91620-0.jpg)](https://www.youtube.com/watch?v=pQJrgIOplFo)

這兩者之間的差距，是教練與大量的練習。  
動作之間的體會，需要透過與教練或前輩的交談來確定你的體會是否正確。

有興趣者，歡迎來好想工室交流 training 的方式。

> 小故事:  
> 記得那時我已過了切版的流程了，所以是我後期的一個學員，他在切版的時候，發現這個 Kata 很好用。所以就快速的把 7 個版 clone 完之後，回到他的家鄉，找了一個 co-working space 也開啟了這樣一個切版練習的聚會，但是他是要收費的。(畢竟場地不是自己的，有付費成本在)
> 
> 最後並沒有成功，因為學習並不是看 Kata 就會了。

\[1\]: [Kata - Wikipedia](https://en.wikipedia.org/wiki/Kata)  
\[2\]: [前端新手村 HTML的作用 - 《Chris 技術筆記》](https://dwatow.github.io/2017/12-13-iron-man-2018/iron-man-2018-day3/#%E5%B0%8D%E6%96%BC%E5%88%87%E7%89%88%E4%BE%86%E8%AA%AA%E8%A6%81%E6%B3%A8%E6%84%8F%E4%BB%80%E9%BA%BC)
