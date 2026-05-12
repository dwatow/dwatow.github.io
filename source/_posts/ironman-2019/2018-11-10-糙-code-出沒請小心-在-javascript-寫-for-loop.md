---
title: 糙 code 出沒請小心!! 在 JavaScript 寫 for-loop
date: 2018-11-10 00:00:00
tags:
  - 2019鐵人賽
  - for-loop
  - 糙 code
  - array methods
categories:
  - 可不可以不要寫糙 code
source_url: https://ithelp.ithome.com.tw/articles/10209105
---

> 良好程式碼的優點大同小異。  
> 不好的程式碼的糙點卻各有巧妙之處。

自從學了 JavaScript 之後，就很少寫 for-loop 了!!!  
這件事，還是一陣子之後，看別人的寫了滿滿的 for-loop 才意識到。

## (不出現在...才是) 好的 for-loop

![](/images/eff44308-m0kt892.png)  
\-- 《哥布林殺手》第 2 話 p.43

在 JavaScript 中好的 for-loop 就是該出現時再出現。

迴圈有好幾種。其實 for-loop 和 while 或 do-while 各有不同。  
如果是已知長度或已知重複次數，就適合使用 for-loop 的語法。

```javascript=
for (;;) {
  // 糙 code 請用 while 取代它，會美多了
}

```

在現代的各種標準函式庫或 Array methods 都提供了各種讓開發者更專注邏輯，而不要考慮控制迴圈的寫法。

### Python 的 for-loop

在 python 這麼優雅的語言中，直接不給你寫 `for (i = 0; i < 10; i++)` 這一串。幾乎大部份的問題都會需要寫這一段。

```python
fruits = ["apple", "banana", "cherry"]
for x in fruits:
  print(x)

```

## Array Methods

在此列舉一些 JavaScript 中可以省掉 for-loop 的 methods


| return data | method name | 意思 |
| --- | --- | --- |
| undefined | fill() | 用相同的值改變自己的每一個元素 |
| boolean | includes() | 是否包含在內，等同於 ~array.indexOf(element) |
| index | indexOf() | 找出第一個相同元素的索引值(找不到給 -1) |
| index | lastIndexOf() | 找出最後一相同元素的索引值(找不到給 -1) |
| index | findIndex() | 濾出(讓 callback 回傳 true 的)第一個元素的索引 |



| return data | method name | 意思 |
| --- | --- | --- |
| boolean | every() | 是不是每一個都(讓 callback 回傳 true) |
| boolean | some() | 是不是至少一個(讓 callback 回傳 true) |
| element | find() | 濾出(讓 callback 回傳 true 的)第一個元素 |
| new sub array | filter() | 濾出(讓 callback 回傳 true 的)元素的陣列 |
| new array | map() | 每個元素都變身 |
| result | reduce() | 元素摺疊成一個東西(由左到右走訪) |
| result | reduceRight() | 元素摺疊成一個東西(由右到左走訪) |



| return data | method name | 意思 |
| --- | --- | --- |
| undefined | forEach() | 走訪每一個元素 (就是 for-loop) |
| array | reverse() | 倒轉陣列 |
| array | sort() | 排序原本陣列 |
| sub array | slice() | 切出一部份陣列 |
| sub array | splice() | 重組原本陣列 |


## 非寫 for-loop 不可的情況

將 for-loop 分成三個部份  
可以被取代的 for-loop 長這樣

```javascript
for (let i = 0; i < array.length; i++) {}

```

### 不是 0 起始計數 (i = 0)

```javascript
var start = 2
for (let i = start; i < array.length; i++) {
  console.log(element)
}

```

如果起始數很小

1.  可以在 methods 中排除掉不計數的部份

```javascript=
var list = ["Cecilie", "Lone", "Emil", "Tobias", "Linus"];
list.forEach((element, index) => {
  if (index > 2) {
    console.log(element)
  }
})

```

2.  直接取出後面那一段來處理 (更快!!)

```javascript=
var list = ["Cecilie", "Lone", "Emil", "Tobias", "Linus"];
list.slice(3).forEach(element => {
  console.log(element)
})

```

### 不是逐一計數 (i++, ++i, i += 1)

**規律**

跳過幾個做一次

```javascript
var list = ["Cecilie", "Lone", "Emil", "Tobias", "Linus"];
for (let i = 0; i < list.length; i += 2) {
  console.log(list[i])
}

```

(效能差一點)

```javascript
var list = ["Cecilie", "Lone", "Emil", "Tobias", "Linus"];
list.forEach((element, index) => {
  if (index % 2) return;
  console.log(element)
})

```

**不規律**

不規律，其實就沒差，因為本來就要用 if 處理。

```javascript
var list = ["Cecilie", "Lone", "Emil", "Tobias", "Linus"];
for (let i = 0; i < list.length; i++) {
  if (i === 2 || i === 4) continue;
  console.log(list[i])
}

```
```javascript
var list = ["Cecilie", "Lone", "Emil", "Tobias", "Linus"];
list.forEach((element, index) => {
  if (index === 2 || index === 4) return;
  console.log(element)
})

```

有時，還真的會遇到非寫 for-loop 的情況，但是目前絕大多數，是沒有必要一直寫 for-loop。  
善用型別的 method，比起狂寫這樣的贅 code 來得美妙呀。
