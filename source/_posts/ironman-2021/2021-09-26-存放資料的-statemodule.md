---
title: 存放資料的 state、module
date: 2021-09-26 00:00:00
tags:
  - 13th鐵人賽
  - vue.js
  - javascript
categories:
  - Vue.js 進階心法
source_url: https://ithelp.ithome.com.tw/articles/10272333
---

在 JavaScript 中，儲存資料的方式，長這樣。

```javascript
{
  name: 'Chris',
  age: 18
}

```

## 抽象資料型別 ADT

強型別語言的話，要先宣告「抽象資料型別」

```c
struct User {
  char *name;
  int age;
};

```

然後宣告一個實體

```c
struct User chris;

chris.name = "Chris";
chris.age = 18;

```

這樣要變更資料，是直接修改變數本身。像是 JavaScript 操作物件一樣的做法。

```javascript
const chris = {
  name: '',
  age: 0
}

chris.name = "Chris";
chris.age = 18;

```

但是，這樣會遇到一些問題

```javascript
const chris = {
  first_name: '',
  last_name: '',
}

chris.first_name = "Chris";
chris.last_name = "Wang";

```

如果想要 full name 就要另外寫一個邏輯，把它們組合起來。或者寫一個 `chris.full_name` 儲存 `"Chris Wang"`

那麼，會不會遇到資料不同步的問題？  
如果只是單純改變 `last_name` 需要同步改變 `full_name` 的內容嗎？

## 抽象介面

抽象資料型別，在物件的體現，就是相關的資料與行為，要放在一起。通常強型別語言，都是放在 class 上面。

```cpp
class User {
  string first_name;
  string last_name;
  string full_name;
  
  string setFirstName(const string& name) {
    first_name = name;
    full_name = name + " " + last_name
  }
  
  string setLastName(const string& name) {
    last_name = name;
    full_name = first_name + " " + name
  }
};

```

一樣將 `full_name` 視為**資料**，並且在設定 `first_name` 或 `last_name` 時，同步資料。

另一種做法

```cpp
class User {
  string first_name;
  string last_name;
  
  string getFullName() const {
    return first_name + " " + last_name;
  }
};

```

將**取得全名**，視為的**行為**，裡面的實作就是將 `first_name` 和 `last_name` 組合起來。

這兩種做法都是透過 User 的抽象行為，操作資料。

當然也有針對各別資料設定 getter/setter 的做法。起初這樣寫會覺得很多此一舉，但是後來如果要在 setter 加入資料的定義域，或者要在增加一個 getter 代表資料的另一種表現型式。都是很方便的事情。

### 資料的另一種表現型式

> 後面我就用 javascript 實作

```javascript
class User {
  constructor() {
    this.birthday = new Date();
  }

  setBirthday(year, month, day) {
    this.birthday.setYear(year);
    this.birthday.setMonth(month -1);
    this.birthday.setDate(day);
  }
    
  getBirthday () {
    return this.birthday;
  }
  
  getAge() {
    return new Date().getFullYear() - this.birthday.getFullYear();
  }
};

```

有了**抽象行為**可以將生日與年齡的關係建立起來，並且讓資料只有一筆，不會有資料同步的問題。

### 定義域

如果你想要在輸入月份超過 12 月，就要拋出例外的話。  
就可以隨時在 setter 的 method 裡面加上限制條件。

```javascript
class User {
  setBirthday(year, month, day) {
    // ...
    if ((month -1) > 12) throw Error('month > 12');
    this.birthday.setMonth(month -1);
    // ...
  }
};

```

如果沒有先寫好 setter ，在想加上條件時，就會比較辛苦的再寫一個 function 並且`birthday.setMonth(month -1);` 搬進去，再將所有原本寫 `birthday.setMonth(month -1);` 替換成 `setBirthday()`。

## 今天不是要講 vuex 的 state

[State | Vuex](https://vuex.vuejs.org/guide/state.html)

在 vuex 中，如果只有 `state` 直接存取資料。就像是沒有抽象介面的抽象資料型別。

所以我自己的用法，是**堅持絕對不要直接存取 `state`**，並且一定要用 `mutation` 和 `getters`。

> 其實 state 就是這樣短短的。沒有什麼特別的

![](/images/5f389961-BFysM1Y.png)

## 幾乎等同於抽像資料型別的 Module

[Modules | Vuex](https://vuex.vuejs.org/guide/modules.html)

vuex 裡面還有一個東西叫 module，我自己就它當作是「系統的抽象資料型別」在使用，像是 User 就是使用者的資料型別，在後端會建立資料表，在前端用 Vue.js 的話，我就會選擇在 vuex 建一個 user 的 module。也就是說，將系統要 CRUD 的「名詞」找出來，並建立成各種的 module 裡面的 state 則是存放資料的地方。

> vuex 的裡的 module 是對 state 做分群，並且限制 mutation 和 getters 可以取得的 state 的範圍，但是mutation 可以透過 commit、getters 可以再呼叫 getters 的方式跨 module 取得其它 module 的 state。

通常系統上需要儲存的方式和後端資料表不一樣。以 user 為例，要嘛就是顯示一個 user 的「列表」要嘛就是顯示「一筆」 user 資料。

所以，我有一個極致的用法(但不見得每一次都是這樣使用)

在每一個 module 裡的 state 都這樣規畫，其實就可以符合每一個畫面的需要了。

```javascript
export default {
  state: {
    one: {},
    list: []
  }
}

```

這只是一種極致的做法  
極致的地方在於，state 裡的命名，都只有 one 和 list  
當如果有其它的需求，就會另外命名  
而且它只適用於 CRUD 的資料。  
登入的 token 不適用於這種做法。
