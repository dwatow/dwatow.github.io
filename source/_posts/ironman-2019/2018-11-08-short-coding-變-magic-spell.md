---
title: Short Coding 變 Magic Spell
date: 2018-11-08 00:00:00
tags:
  - 2019鐵人賽
  - 短碼
  - 糙 code
  - code golf
  - short coding
categories:
  - 可不可以不要寫糙 code
source_url: https://ithelp.ithome.com.tw/articles/10208720
---

> 良好程式碼的優點大同小異。  
> 不好的程式碼的糙點卻各有巧妙之處。

會被視為 Short Coding 技巧

-   三元運算式
-   隱含的強制轉型
-   `!` or `~` 的轉態
-   `++`, `--`運算子的使用

## 「開新眼界」的走火入魔版

```javascript=
respons_message = (webhook_event.message) ? handleMessage(webhook_event.message) : (webhook_event.postback) ? handlePostback(webhook_event.postback) : "";

```

原本是這樣

```javascript=
if (webhook_event.message) {
  respons_message = handleMessage(webhook_event.message);
} else if (webhook_event.postback) {
  respons_message = handlePostback(webhook_event.postback);
}

```

在發現 `?:` 這種三元運算子可以縮短程式碼。讓這種寫法影響你大腦分泌的多巴胺時 (感覺到美妙)，就糟了，走火入魔的開始。

```javascript=
var myAge
if (age < 18)
  myAge = age
else
  myAge = 18
  
var chris = {
  age: myAge
}

```

變成這樣

```javascript=
var chris = {
  age: (age < 18) ? age : 18
}

```

有因為分泌多一點的「多巴胺」而感到美妙嗎？哈哈

## 再少一行！再少一行！

```javascript=
var fontColor = '#22beff'
var gray = encode(fontColor)
if (gray > 255) {
  // doSomething
}

```

再少一行

```javascript=
var gray = encode('#22beff')
if (gray > 255) {
  // doSomething
}

```

再少一行

```javascript=
if (encode('#22beff') > 255) {
  // doSomething
}

```

你看得出，它編碼編出來是什麼嗎？

**賦值，也要 Short Coding**

```javascript=
var a = 1;
var b = 1;

```

也許有人會這樣寫

```javascript=
var a = 1, b = 1;

```

試過這樣嗎？

```javascript=
var a = b = 1; // a = 1, b = 1

```

**函數參數，也要 Short Coding**\[1\]

```javascript=
a = a - 1;
foo(a);

```

再少一行

```javascript=
foo(--a);  // 分辨得出和 foo(a--); 的差異嗎？

```

## 開始走火入魔

### 合併相同長度的迴圈!!

```javascript=
var a = [1, 2, 3, 4, 5]
var b = [5, 3, 9, 8, 1]

for (let i = 0; i < a.length; ++i) {
  a[i] + 1; //做一些處理 a 的事
}

for (let i = 0; i < b.length; ++i) {
  b[i] + 23; //做一些處理 b 的事
}

```

變成

其實，你要看 a 和 b 的迴圈是否表示相同語意？  
合併語法的好原則，是依語意判斷

```javascript=
var a = [1, 2, 3, 4, 5]
var b = [5, 3, 9, 8, 1]

for (let i = 0; i < a.length; ++i) {
  a[i] + 1; //做一些處理 a 的事
  b[i] + 23; //做一些處理 b 的事
}

```

### 使用守護運算子

```javascript=
if (member && member.isExist) {
  saveFile();
}

```

改成

```javascript=
member && member.isExist && saveFile();

```

> JavaScript 的 `||` 和 `&&` 是一種判斷 + 選擇回傳的機制\[2\]  
> `a ? a : b` 約略等同 `a || b`\[3\]  
> `a ? b : a` 約略等同 `a && b`

```javascript=
let status = null;
    
if (!!project.workItem) {
  status = 'working';
} else {
  status = 'initialed';
}

```

改成

```javascript=
const status = (!!project.workItem) && 'working' || 'initialed';

```

> 三元運算式反而在這時是很適合使用的

```javascript=
const status = (!!project.workItem) ? 'working' : 'initialed';

```

### 偵測 indexOf

`indexOf` 找不到會 return -1，在 JavaScript 中，`~` 使用 2 的補數，就可以偵測 是否 `-1` 轉成 `0` 並且在 if 中進行強制轉型成 boolean 值

```javascript
if (~[1, 2, 3].indexOf(2)) {  //true
  //...
}

```

## Coding Golf

> Code Golf 是一種 coding 挑戰， 它追求的特點就一個字： 短。為了實現某個功能， 用盡可能短的代碼去實現， 縮短哪怕一個字節也是進步。起這個名字顯然是因為高爾夫球的規則也是爭取用最短的桿數完成比賽。\[4\]

被當作休閒遊戲\[5\]，也是一種有趣的精進方式，但請不要拿它來工作場合實作。

有兩篇相關的技巧展現，就不在這裡佔用版面了。

-   [Tips for golfing in JavaScript](https://codegolf.stackexchange.com/questions/37624/tips-for-golfing-in-ecmascript-6-and-above)
-   [Programming Puzzles & Code Golf](https://codegolf.stackexchange.com/questions/2682/tips-for-golfing-in-javascript)

## Short Coding 適用於 Uglify 的技巧

JavaScript 有一個 Project 稱為 UglifyJS 用來混淆原本可讀性、品質高的 JavaScript。畢竟前端就是程式碼赤祼祼的送人看，所以出現這樣的套件也是一種必然的結果。

-   混淆命名
-   減少不必要的空白和排版

將 `if-else` 變成 `?:`，這種縮短程式碼的技巧，一定也會出現在裡面

看個例子

**webpack 官網中，一小段程式碼**

看見了嗎？ 除了命名被 Uglify 之外，

```javascript=
  n.n = function(e) {
    var t = e && e.__esModule
    ?
    function() {
      return e.default
    }
    :
    function() {
      return e
    };
    
    return n.d(t, "a", t), t
  }

```

## 不寫分號的 JS 可以再短一點

這其實也是 UglifyJS 有做的事。  
這件事其實在 2013 年出版的書\[6\] 就有提到這件事。自動補上分號，是 JavaScript 的容錯機制，有人將它視為一種 coding 風格，我也真服了他！(認真，因為他打算一輩子寫 JavaScript or Python 吧？)

## Short Coding，究竟是不是好的？

只要程式碼沒有複雜，就是好的。  
(我自己會使用下面的技巧)

```javascript=
var me = {
  age: duringBirthdayToNow > 18 ? 18 : duringBirthdayToNow,
  name: Nickname && parentsGiveName,
}

```

下面這一段，不這麼寫就會像下面這樣寫。

```javascript=
var age;
if (duringBirthdayToNow > 18) {
  var age = 18
}
else {
  var age = duringBirthdayToNow
}

var name;
if (Nickname) {
  name = Nickname;
}
else {
  name = parentsGiveName;
}

var me = {
  age,
  name,
}

```

當然，若兩者都看得懂就不會變密碼。  
若看不懂就會變成密碼。  
太複雜的邏輯、巢狀式條件式，都不建議使用 Short Coding 處理。

欲知更多 Short Coding 技巧，可以參考[《Short Coding 寫出簡潔好程式－短碼達人的心得技法》](https://www.tenlong.com.tw/products/9789862011461)

## 參考資料

\[1\]: [Tips for golfing in JavaScript](https://codegolf.stackexchange.com/questions/2682/tips-for-golfing-in-javascript)  
\[2\]: [深入淺出代碼優化﹣if/else](https://calpa.me/2018/10/22/javascript-if-else-in-depth/?fbclid=IwAR2rwgUkpHWq5T6SOzscz35A0Gn598HGSCSa5p19buKM_biblP2lNFRj5ek)  
\[3\]: 《你所不知道的JS》導讀、型別與文法, Ch7 強制轉型, 運算子 || 與 &&  
\[4\]: [什麼是Code Golf](http://www.10tiao.com/html/411/201608/2247483931/1.html)  
\[5\]: [Code Golf - wiki](https://en.wikipedia.org/wiki/Code_golf)  
\[6\]: Effective JavaScript 這本書的條款 6: 了解分號插入的限制
