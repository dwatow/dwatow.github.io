---
title: JavaScript 的 OO 與 JSON
date: 2018-02-22 11:55:09
tags: ['json', 'javascript', 'oo', 'nodejs']
categories: '技術心得'
---
# JavaScript 的 OO 與 JSON

今天，想要用 JavaScript 做一個可以重複呼叫的物件，並且產生 JSON。

- `index.js`

## 最基本的使用物件方式

最基本，要先知道，如何建立一個 Object？並且輸出成 JSON。

例子:
在此用一個「人類」的概念，需要「名字」和「年紀」。
宣告了一個叫 chris 的人類

### index.js

```javascript=
var chris = {
    name: 'chris',
    age: 18
};
console.log(chris);
console.log(JSON.stringify(chris));
```

### 顯示結果

```shell=
$ node index.js
{ name: 'chris', age: 18 }
{"name":"chris","age":18}
```

直接 `console.log` 出來的內容，看似 JSON 不過其實是將物件印出來。而我們直正要的 JSON 則是需要將物件丟到 `JSON.stringify` 裡成為「 JSON 字串」。

## 屬性有物件或陣列

### index.js

```javascript=
var chris = {
    name: 'chris',
    age: 18,
    skills: ['html', 'css', 'javascript']
    devTool: {
        name: 'macbook12',
        year: 2017
    }
};
console.log(chris);
console.log(JSON.stringify(chris));
```

### 顯示結果

```shell=
$ node index.js
{ name: 'chris',
  age: 18,
  skills: [ 'html', 'css', 'javascript' ],
  devTool: { name: 'macbook12', year: 2017 } }
{"name":"chris","age":18,"skills":["html","css","javascript"],"devTool":{"name":"macbook12","year":2017}}
```

到目前為止，都是 JSON 原本的用法。

## JavaScript 的「物件導向味」

> 「物件導向味」因為它並不是演示封裝、繼承、動態連結。
而是除了物件的屬性，還加入了描述了物件行為的 method。

OO 之所以解決了軟體開發的副屬性問題，好用的原因之一。
就是「將 method 放在物件裡」，讓 function 不再自由的全域放置。


### index.js

```javascript=
var chris = {
    name: 'chris',
    age: 18,
    skills: [],
    addSkill: function (skill) {
        this.skills.push(skill)
    },
    devTool: {},
    setDevTool: function (tool) {
        this.devTool = tool
    }
};
chris.addSkill('html');
chris.addSkill('css');
chris.addSkill('javascript');
chris.setDevTool({
    name: 'macbook12',
    year: 2017
});
console.log(chris);
console.log(JSON.stringify(chris));
```

### 顯示結果

```shell=
$ node index.js
{ name: 'chris',
  age: 18,
  skills: [ 'html', 'css', 'javascript' ],
  addSkill: [Function: addSkill],  ## method
  devTool: { name: 'macbook12', year: 2017 },
  setDevTool: [Function: setDevTool] }  ## method
{"name":"chris","age":18,"skills":["html","css","javascript"],"devTool":{"name":"macbook12","year":2017}}
```

從輸出可以看出一點不同的地方。

- 單純印出來，會有 method 的資訊。
- 用 `JSON.stringify` 轉出來會是我們要的 JSON。

表示，放在物件裡的 method ，並不會成為 JSON 的一部份。

## JavaScript 的建構式

但是，若想讓物件大量的重複使用。像資料庫的 ORM 或商業邏輯的概念，一直重複的出現在系統的任何一個角落，而每一次的 get, set 都必須要相同。

如果資料庫選用 NoSql 就又更希望可以直送 JSON ，無須轉來轉去的。


### index.js

```javascript=
function human (name, age) {
    this.name = name;
    this.age = 18;
    this.skills = [];
    this.addSkill = function (skill) {
        this.skills.push(skill)
    };
    this.devTool = {};
    this.setDevTool = function (tool) {
        this.devTool = tool
    };
};
var chris = new human('chris', 18);
chris.addSkill('html');
chris.addSkill('css');
chris.addSkill('javascript');
chris.setDevTool({
    name: 'macbook12',
    year: 2017
});
var mary = new human('mary', 15);
mary.addSkill('nurse');
mary.addSkill('cook');
mary.addSkill('bake');
mary.setDevTool({
    name: 'kitchen',
    year: 2000
});
console.log(chris);
console.log(JSON.stringify(chris));
console.log(mary);
console.log(JSON.stringify(mary));
```

### 顯示結果

```shell=
$ node index.js
human {
  name: 'chris',
  age: 18,
  skills: [ 'html', 'css', 'javascript' ],
  addSkill: [Function],
  devTool: { name: 'macbook12', year: 2017 },
  setDevTool: [Function] }
{"name":"chris","age":18,"skills":["html","css","javascript"],"devTool":{"name":"macbook12","
year":2017}}
human {
  name: 'mary',
  age: 18,
  skills: [ 'nurse', 'cook', 'bake' ],
  addSkill: [Function],
  devTool: { name: 'kitchen', year: 2000 },
  setDevTool: [Function] }
{"name":"mary","age":18,"skills":["nurse","cook","bake"],"devTool":{"name":"kitchen","year":2000}}
```

這次，將 human 做成一個 constructor ，並且 new 了兩個物件 chris 和 mary ，他們使用了相同名稱的 method，也印成 JSON ，結果得到了兩個同類型，不同內容的 JSON 。
