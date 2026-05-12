---
title: 魔法般的 magic number
date: 2018-11-04 00:00:00
tags:
  - 2019鐵人賽
  - magic number
  - 0x5f3759df
  - 糙 code
categories:
  - 可不可以不要寫糙 code
source_url: https://ithelp.ithome.com.tw/articles/10207871
---

> 良好程式碼的優點大同小異。  
> 不好的程式碼的糙點卻各有巧妙之處。

## 先看程式碼

這是優透的程式設計師寫的 code。\[1\]

看看有沒有看不懂的地方。

```c
float Q_rsqrt( float number )
{
	long i;
	float x2, y;
	const float threehalfs = 1.5F;

	x2 = number * 0.5F;
	y  = number;
	i  = * ( long * ) &y;                       // evil floating point bit level hacking
	i  = 0x5f3759df - ( i >> 1 );               // what the fuck?
	y  = * ( float * ) &i;
	y  = y * ( threehalfs - ( x2 * y * y ) );   // 1st iteration 
//      y  = y * ( threehalfs - ( x2 * y * y ) );   // 2nd iteration, this can be removed

	return y;
}

```

## magic number

上面是一個「快速"平方根倒數"演算法」，用數學表示就是

```
x => x^(-1/2)

```

一般的寫法會這樣寫

```c
(float)(1.0/sqrt(x))

```

經測試，magic number 的 code 比這段常見的 code 快4倍\[2\]

magic number 相傳源自於「雷神之鎚 3代」的 3D繪圖引擎中，大量使用的「快速平方根倒數演算法」。裡面有使用一個 `0x5f3759df` 的數字。讓整個場景渲染的效能大增並且沒有明顯的畫質降低。**彷彿魔法般沒有出現的原因。** 而且起源已不可考。

## magic number 引申義

wiki 對於 magic number 的解釋如下

> 程式設計中所謂的魔術數字（magic number）是指寫死在程式碼裡的具體數值（如「10」「123」等以數字直接寫出的值）。雖然程式作者寫的時候自己能了解數值的意義，但對其他程式員而言，甚至製作者本人經過一段時間後，會難以了解這個數值的用途，只能苦笑諷刺「這個數值的意義雖然不懂，不過至少程式能夠執行，真是個魔術般的數字」而得名。\[3\]

也就是「 hard-code number 這樣的行為，是必須要小心處理」的。

## 有多常見？

《Code complete 2/e》Ch3 變數

程式教育，不自覺的教你寫了 magic number，下面這樣的程式碼，一定寫過吧？

```javascript
for (let i = 0; i < 10; ++i) {
  //...
}

```
```javascript
switch(x) {
case 12:
  //..
break;
}

```
```javascript
if (x > 100) {
  //...
}

```
```javascript
console.log(x/22)

```

「那怎辦？程式設計的基本，就教我寫糙 code？！」  
「我知道了！寫註解！一定是這樣的！註解加上去就沒事了」

再看一次上面的 magic number (也許是後來看 code 的人) 幫他加上的註解

```c
i  = 0x5f3759df - ( i >> 1 );               // what the fuck?

```

## 怎麼樣才不糙？

```javascript
for (let i = 0; i < 10; ++i) {
  //...
}

```

以這一段 for-loop 為例

第一步、把 10 處理掉

將 10 加上命名，對於整個問題的描述，是不是又增加了解問題線索？  
也許，這個問題要印出所有學生的資料？

```javascript
const student_total = 10;
for (let i = 0; i < student_total; ++i) {
  //...
}

```

第二步、把 0 處理掉

別忘了 0 也是 magic number ，可以的話，將它也命名吧

```javascript
const begin_cleaning_students = 0;
const student_total = 10;
for (let i = begin_cleaning_students; i < student_total; ++i) {
  //...
}

```

第三步、(命名狂熱者適用) 把短命名處理掉

如果可以，把 i 的短命名拿掉，搭配其它的命名

```javascript
const begin_cleaning_students = 0;
const student_total = 10;
for (let index_student = begin_cleaning_students; index_student < student_total; ++index_student) {
  //...
}

```

現在，我們對問題的全貌有更多的線索了，也許這是走訪即將負責打掃學生的清單的程式。

## 真實世界裡的 magic number

在物理學，其實也有非常多這樣的數字 (常數)。但是，再回來看看人月神話裡描述物理學厲害的原因。

> 數學和物理學之所以能在過去三個世紀突飛猛進，就是藉由為複雜現象建立出簡單的模型 (model) ，然後從模型中推導出現象的特性，並透過實驗來驗證這些特性。  
> 這種方式之所以行得通，是因為在模型中所排除掉的複雜性 並非現象的本質。\[name=《人月神話》, 沒有銀彈: 軟體工程的本質性與附屬性工作, p.239\]

最常見的

π: [pi](https://zh.wikipedia.org/wiki/%E5%9C%93%E5%91%A8%E7%8E%87)  
c: [光速](https://zh.wikipedia.org/wiki/%E5%85%89%E9%80%9F)  
h: [Planck constant](https://zh.wikipedia.org/wiki/%E6%99%AE%E6%9C%97%E5%85%8B%E5%B8%B8%E6%95%B0) 不同單位，還有不同的數，甚至還有變化數  
e: [Euler's number](https://zh.wikipedia.org/wiki/E_\(%E6%95%B0%E5%AD%A6%E5%B8%B8%E6%95%B0\))  
...太多太多

但是，它們都有命名與由來呀。

不然，`閱讀程式將會成為命案推理的過程`損失的是你我的熱情與業主的成本呀。

## 字串也不要 magic string\[4\]

```javascript
if (token = 'bM+fWkp/v9pxqFpTwXQPDfriZRZ4lZTLEMQtFhzs55ImfU') //亂截一段無意義的內容
  //...

```

這是什麼 token ？給誰的特權？可以拿掉嗎？  
可以的話，程式內的字串務必用「列舉」型別取代。  
若沒有列舉，也許用物件也行。

字串的直接比對，有時是會因為字元編碼有看不出來的差異。千萬要小心

## 提外話，昨天參加 (堅持在濁水溪以南的...)MOPCON

昨天在 [MOPCON](https://mopcon.org/2018/schedule.php) 中，在聽完 Akane 講完後，就跑去 BOF ，Howard 在介紹好想工作室。  
正好在廣告這個系列的文章，然後 MOPCON 的工作人員 Brook 很熱情的問

「請問『可不可以不要寫糙 code 』是誰寫的？」

我就舉手  
她說。

「這個系列超讚的！我好喜歡」

哇~~ 聽了我都臉紅了！![/images/emoticon/emoticon25.gif](/images/emoticon/emoticon25.gif)哈哈~~不過很開心就是了  
沒有面對面遇過如此熱情的讀者。  
這一系列，會繼續加油的！![/images/emoticon/emoticon41.gif](/images/emoticon/emoticon41.gif)  
也請喜歡這一系列的朋友，非常歡迎留言給我。  
如果有共鳴的朋友可以給我素材在留言裡。(或 mail 給我也行呀)

## 參考資料

\[1\]: [Quake-III-Arena - Gihtub](https://github.com/id-Software/Quake-III-Arena/blob/master/code/game/q_math.c#L552)  
\[2\]: [舊聞一則：神秘的0x5f3759df 不可思議的Quake III源碼](http://www.matrix67.com/blog/archives/362)  
\[3\]: [魔術數字 (程式設計)](https://zh.wikipedia.org/wiki/%E9%AD%94%E8%A1%93%E6%95%B8%E5%AD%97_\(%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%88\))  
\[4\]: [Magic string](https://en.wikipedia.org/wiki/Magic_string)
