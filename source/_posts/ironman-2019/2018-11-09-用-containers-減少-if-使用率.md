---
title: 用 Containers 減少 if 使用率
date: 2018-11-09 00:00:00
tags:
  - 2019鐵人賽
  - 容器
  - 糙 code
categories:
  - 可不可以不要寫糙 code
source_url: https://ithelp.ithome.com.tw/articles/10208918
---

> 良好程式碼的優點大同小異。  
> 不好的程式碼的糙點卻各有巧妙之處。

容器!! 在 JavaScript 中，其實並沒有特別強調這個東西。  
但是，在寫程式的過程中，容器有一些特別的技巧可以使用。

在此我們來介紹一下容器與寫程式有什麼可以使用的技巧吧。

## 容器 Containers

使用容器，可以直接取得一種成熟可靠的資料結構。可以讓你更專注於你的問題，而不是在處理資料結構的問題上。

> STL 將「在資料上執行的操作」與「要執行操作的資料分開」

稱為容器的意思，是結構相容而型別不同的構造。不過 JavaScript 本來就沒有變數型別，所以沒有強調這方面，C++ 倒是就會強調型別的問題。

故事是這樣的。  
依組合語言的使用型式造出了 C 樣貌，而「相同型別的連續記憶體空間」就被稱為了「陣列」

**陣列**

```c
#include <stdio.h>
#define ArrayLength 10

int main()
{
    int array[ArrayLength] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
    array[4] = 0; //setter
    for (int i = 0; i < ArrayLength; i++) {
        printf("%d", array[i]); //getter
    }

    return 0;
}

```

**輸出**

```shell
0123056789

```

優點，就是擁有了抽象資料型別: array  
缺點，在執行時期 `array` 是不可以變動長度的。對於大型專案來說，記憶體無法得到善用。  
所以，有了「資料結構」這門課！！教教大家從「如何善用記憶體，又可以保持相同的使用方便性」入手。

### 循序式容器 sequence containers

> One common property of all sequential containers is that the elements can be accessed sequentially.\[2\]

循序式容器，就是非常的像是陣列的使用方式，依序存取。  
在最初 C 語言陣列，是用「移動指標」的方式實現。也就是「距離開頭多遠」的方式找到該元素。

索引方式: 只能使用數字

C++ 代表性的循序式容器: `vector`, `list`

### 關聯式容器 associative containers

關聯式容器，要做到隨機存取，意思是說，存取任何一個元素所花費的時間將會是固定的。

每個元素是由一組 `key-value` 組成，稱為一個 `pair`，在 C++ 中，是確實有這樣的型別，但是在 JavaScript 中，只是一個(兩個元素)的陣列。所有元素的 `key 不可以重複`

在索引方式會[創造一棵樹](https://en.wikipedia.org/wiki/Self-balancing_binary_search_tree)\[3\]

每次使用 setter 時，會重新計算樹，並且將 pair 儲存起來。  
每次使用 getter 時，會走訪這顆樹，並且經過固定長度的節點，將樹走完，並且取得值。

索引方式: 可使用文字或數字  
(建議使用文字就好)

C++ 代表性的關聯式容器: `set`, `map`

## 利用容器寫程式

```javascript
if (apiData.status === 1) {
   project.status = "start"
}
else if (apiData.status === 2) {
   project.status = "processing"
}
else if (apiData.status === 3) {
   project.status = "staged"
}
else if (apiData.status === 4) {
   project.status = "finish"
}
else if (apiData.status === 0) {
   project.status = "error"
}

```

消除這個 `if-else`

```javascript=
const status = [
  "error",
  "start",
  "processing",
  "staged",
  "finish",
]

project.status = status[apiData.status]

```

為什麼可以這樣做呢？  
其實 if-else 裡，與容器透過索引值找到內容的方法相同，再看一次如下

```javascript
if (apiData.status === 0 + 1) {
   project.status = "start"
}
else if (apiData.status === 0 + 2) {
   project.status = "processing"
}
else if (apiData.status === 0 + 3) {
   project.status = "staged"
}
else if (apiData.status === 0 + 4) {
   project.status = "finish"
}
else if (apiData.status === 0 + 0) {
   project.status = "error"
}

```

反過來呢？

```javascript
if (apiData.status === "start") {
   project.status = 1
}
else if (apiData.status === "processing") {
   project.status = 2
}
else if (apiData.status === "staged") {
   project.status = 3
}
else if (apiData.status === "finish") {
   project.status = 4
}
else if (apiData.status === "error") {
   project.status = 0
}

```

再消除一次這個 `if-else`

```javascript=
const status = {
  "error": 0,
  "start": 1,
  "processing": 2,
  "staged": 3,
  "finish": 4,
}

project.status = status[apiData.status]

```

為什麼可以這樣做呢？  
關聯式容器在 `key-value` 找值的過程，做了很多的判斷。(它有寫 `if-else` 了)，所以可以利用這個容器特性省掉一些不必要的 `if-else` 變成程式碼冗贅的語法。

## 消除重複

在此就要特別介紹一下 `Set` 每個元素，都當作 key。也就是不重複元素的 list 或 array。

如果在 C++ 中，這個問題也不用像我以前不懂事這樣寫一堆 code\[4\]

```cpp
std::vector<int> vch;
//...
std::sort(vch.begin(), vch.end());  //排序
eraseit = std::unique(vch.begin(), vch.end());  //排不重覆元素
vch.erase(eraseit, vch.end()); //沒被排到的刪掉

```

**輸出**

```shell
0, 0, 1, 2, 2, 2, 3, 3, 3, 5, 5, 6, 6, 6, 6, 6, 7, 7, 9, 9,
0, 1, 2, 3, 5, 6, 7, 9, 3, 5, 5, 6, 6, 6, 6, 6, 7, 7, 9, 9,
0, 1, 2, 3, 5, 6, 7, 9,

```

後來都這樣寫

```cpp
show(vch);
std::set<int> sch (vch.begin(), vch.end());
show(sch);
std::vector<int> cloneVch (sch.begin(), sch.end());
show(cloneVch);

```

**輸出**

```shell=
3, 6, 7, 5, 3, 5, 6, 2, 9, 1, 2, 7, 0, 9, 3, 6, 0, 6, 2, 6,
0, 1, 2, 3, 5, 6, 7, 9,
0, 1, 2, 3, 5, 6, 7, 9,

```

看起來好像也不差。  
有時會用 if-else 判斷是否已存在就不用講了。

## 在 JavaScript 中

ES5 的標準中，想用關聯式容器就用 `{}` ，想用循序式容器用 `[]`

ES6 的標準已經有 Set 可以用，來看看兩者的比較\[5\]

ES6 的寫法，不用自己寫 if 囉

```javascript=
let s = new Set()
s.add("hello").add("goodbye").add("hello")
s.size === 2
s.has("hello") === true
for (let key of s.values()) // insertion order
    console.log(key)

```

用 ES5 的寫法就是有 if。

```javascript=
var s = {};
s["hello"] = true; s["goodbye"] = true; s["hello"] = true;
Object.keys(s).length === 2;
s["hello"] === true;
for (var key in s) // arbitrary order
    if (s.hasOwnProperty(key))
        console.log(s[key]);

```

雖然，不寫就不是不存在 (本來就必須存在)，但是要利用它的 if 邏輯，也許自己的程式碼可以保持某種程度的簡潔(狂熱!!!)

## 參考資料

\[1\]: [標準模板庫 - 維基百科，自由的百科全書](https://zh.wikipedia.org/wiki/%E6%A0%87%E5%87%86%E6%A8%A1%E6%9D%BF%E5%BA%93#%E5%85%A7%E5%AE%B9)  
\[2\]: [Sequence container (C++) - From Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/Sequence_container_\(C%2B%2B\))  
\[3\]: [Associative containers - From Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/Associative_containers#Design)  
\[4\]: [刪除vector重複元素 - 《DarkBlack - Tech》](https://darkblack02.blogspot.com/2012/06/vector.html)  
\[5\]: [Map/Set & WeakMap/WeakSet - ES6-feature.org](http://es6-features.org/#SetDataStructure)
