---
title: 從C++到《你所不知道的JS》系列
date: 2017-09-10 09:43:55
tags: 你所不知道的js
categories: 讀技術書
---

# 從C++到《你所不知道的JS》系列

《你所不知道的JS》原作: https://github.com/getify/You-Dont-Know-JS
我讀的是O'RELLY的書本

在此，針對我所不知道的JS，進行紀錄。

## 誤解

以下都是誤解
1. JS是一種直譯式語言，不會經過編譯。
2. this關鍵字是參考所有在的函式
3. type null 是 null
4. 弱型別，就是沒有型別
5. javascript的類別、繼承...(物件導向特性)
6. 想要完整學會javascript

粗略的正確的情況:
1. JS會在即將使用前，會先編譯。
2. this是「誰呼叫函式」
3. type null 是 object
4. 是「值型別」，無「變數型別」，typeof() 是「該變數的值型別」
5. javascript的行為委派
6. javascript還在持續發展中，永遠都有未知的部份

## typeof 型別

### why `typeof null === 'object'`

用來檢查未宣告的變數

```js
// Uncaught ReferenceError: b is not defined
if (typeof b !== 'undefined') {  // false
    //do something
}
```

## 值

### Array

以文字字串存取: 不會更新.length。

以數字字串存取: 數字字串當作數字型別使用。

```js
var a = []
a['5'] = 'aaaaa'
a.length = 6
```

### like-Array

轉成Array
```js
var larr = document.querySelectorAll('.class'); //like array
var arr = Array.prototype.slice.call(larr);
//or by ES6
var arr = Array.from(larr);
```

### string

如果常常需要用`array`的思維處理`string`。
建議將該`string`，存成`array`再用`.join()`印出即可。

需要使用的時機
以「反序」的需求為例，若常常這麼寫的時候:
```js
var str = 'foo'
str = str.split('').reveres().join('')
```
就可以考慮這麼寫
```js
var arr = 'foo'split('')
arr.reveres()  //代表處理很多其它的邏輯
str = arr.join('')
```
或參考[Esrever](https://github.com/mathiasbynens/esrever)

## number

詳閱[IEEE 754](https://zh.wikipedia.org/zh-tw/IEEE_754)

```js
42.toFixed(3)  //Uncaught SyntaxError: Invalid or unexpected token
(42).toFixed(3)
42..toFixed(3)  //很少見的用法
42 .toFixed(3)  //除了混淆，沒有其它更好的用途
```
其它進制的`number`表示法
小寫前綴是個好習慣，大寫也可以，但是「除了混淆，沒有其它更好的用途」

```js
0x2a  //16進制的42
0o52  //8進制的42
0b101010  //2進制的42
```

### `number < 1`

這是所有IEEE 754 所有的語言都有的問題。
`Number.EPSILON`是定義誤差容許範圍

```js
var a = 0.3
var b = 0.1 + 0.2

//是否相等
a === b // false
a - b < Number.EPSILON  // true
```
