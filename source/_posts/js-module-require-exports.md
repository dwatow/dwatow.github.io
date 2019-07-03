---
title: Node.js 的 module.exports 和 require
date: 2018-02-13 13:54:16
tags: ["JavaScript", "nodejs"]
categories: '技術心得'
---

# Node.js 的 module.exports 和 require

今天想要在 JavaScript 做一個 module 被主程式呼叫

- `example.js`
- `main.js`

## 最基本的使用方式

最基本，要先知道「 `module` 怎麼樣呼叫過來」，會是一個 scop，是一個 object 嗎？

### example.js

```javascript=
var text = "hello";
module.exports = text;
```

### main.js

```javascript=
var example = require("./example.js");
console.log(example);
```

### 顯示結果

```shell=
$ node main.js
hello
```

在此，可以得到一些初步的收獲

1. `module.exports` 像是 `return`
2. `require` 像是 call function ，等號左值會得到 return 值，無論它是什麼。

在此，在主程式得到的結果是

```javascript=
var module = text; // var text = "hello";
```

`require('./example.js')` 是載入一個檔案。回傳一個...它要回傳的東西。
也就是說，一個檔案，可以視為一個模組，讓這個模組回傳「該回傳的東西」

如果 `module.exports = object` 就是回傳 object
如果 `module.exports = function` 就是回傳 function
如果 `module.exports = string` 就是回傳 string
...(沒完沒了)

## 做一些像物件的東西

### example.js

```javascript=
var text = "hello";
module.exports = {
  getText: function() {
    return text;
  }
};
```

### main.js

```javascript=
var example = require("./example.js");
console.log(example.getText());
console.log(example.text);
```

### 顯示結果

```shell=
$ node main.js
hello
undefined
```

上述推論的沒有錯。
可以將 `module` 當作閉包。

## 小心遇到的雷點

在物件導向語言寫 getter 時要小心回傳值是一個參考(或指標)。
因為參考(或指標)被修改，會造成物件內容被修改(這不直覺呀!!)，所以危險，要避免。

在初學 js 寫 object 的時候，也會遇到這一類的問題，在此用一個簡化的方式來說明。

### example.js

```javascript=
var text = {
  message: "hello"
};

module.exports = {
  getText: function() {
    return text;
  }
};
```

### main.js

```javascript=
var example = require("./example.js");
var text = example.getText();
text.message = 34789;
console.log(example.getText());
```

### 顯示結果

```shell=
$ node main.js
{ message: 34789 }
```

因為 js 的 call by sharing，會讓 `module` 回傳物件的內容被改掉了。

### 想要避免的話

正常的回傳值，要回傳一個副本，執行 call by value 的效果。
所以，在這種 call by sharing 的情況，就要使用 object clone 的技巧。
在 function 內部先建立副本，再將副本回傳出來，等同於自己做 call by value。

在 JavaScript 中，可以使用 `Object.assign` 來建立物件深層 clone 的副本。

```javascript=
var text = {
  message: "hello"
};

module.exports = {
  getText: function() {
    return Object.assign({}, text);
  }
};
```
