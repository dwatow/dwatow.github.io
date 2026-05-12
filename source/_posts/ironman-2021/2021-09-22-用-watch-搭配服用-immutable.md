---
title: 用 watch 搭配服用 immutable
date: 2021-09-22 00:00:00
tags:
  - 13th鐵人賽
  - vue.js
  - javascript
categories:
  - Vue.js 進階心法
source_url: https://ithelp.ithome.com.tw/articles/10269649
---

在 《Clean Architecture》裡第 6 章介紹 functional programming ，有提到一個很重要的觀念 - 不可變動性 (immutable)。

這是什麼意思呢？在 JavaScript 中，對於複雜型別 (常見的型別是 Object 或 Array) 的修改，會選擇替換掉物件本身，就能做到 immutable。

那這件事和 watch 有什麼關係呢？

在 Vue.js 的畫新畫面邏輯中「資料改變，畫面就改變」，要怎麼樣才是「正確的資料改變」呢？

## Vue.js 的 watch

在[官網文件中](https://vuejs.org/v2/api/#watch)的 API 介紹中，有完整的 watch 說明。

在此將它的介紹拆成兩個部份，會有助於觀念上的釐清。  
對於四種簡單型別的 watch 方式。

第一種就是直接用一個和 data 同名的 watch 。讓資料在 set 的同時，可以呼叫一次這個放在 watch 的 function

```javascript
export default {
  data: {
    a: 1
  },
  watch: {
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    }
  }
}

```

第二種，就是將 method 放到 watch 上面，因為有時候有些 method 會主動觸發，有時又要被動觸發，就必須這樣安排，不過另一種做法也可以放在第一種方法的 function 中再呼叫 `someMethod`

```javascript
export default {
  data: {
    b: 2
  },
  watch: {
    // string method name
    b: 'someMethod',
  },
  methods: {
    someMethod() {
      // do something...
    }
  }
}

```

第三種做法，watch 裡放的就不只是 method 了。而是一個 config ，註冊了一個 handler 並且設定它要 `deep:true` 的這樣觸發。

第四種做法就出現 `immediate` 這個關鍵字，並且也是設定成 true。

```javascript
export default {
  data: {
    c: 3,
    d: 4
  },
  watch: {
    // the callback will be called whenever any of the watched object properties change regardless of their nested depth
    c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    },
    // the callback will be called immediately after the start of the observation
    d: {
      handler: 'someMethod',
      immediate: true
    }
  }
}

```

最後一做法，在範例程式碼中，有出現較深的資料結構。  
如果 watch 較深的資料時，可以直接用 `e.f` 來監聰深度的結構改變。

```javascript
export default {
  data: {
    e: {
      f: {
        g: 5
      }
    }
  },
  watch: {
    // you can pass array of callbacks, they will be called one-by-one
    e: [
      'handle1',
      function handle2 (val, oldVal) { /* ... */ },
      {
        handler: function handle3 (val, oldVal) { /* ... */ },
        /* ... */
      }
    ],
    // watch vm.e.f's value: {g: 5}
    'e.f': function (val, oldVal) { /* ... */ }
  }
}

```

## 用替換了哪個記憶體位址了解 immutable\[1\]

```javascript
let user = {
  name: 'Chris',
  age: 18,
};

```

![](/images/3b651d28-v6im2d4.png)

畫成記憶體圖，如下圖 (假設 JavaScript 是以 call by sharing 實作的話)

> 修改的話，可以畫成下圖，接下來就來解釋兩種修改方式。

如果是 mutable (可變的，就直接改掉 user 的成員變數所指向的位置)，將 `user.age` 改成 19 的動作，就是指向 `0xFF0400` 指向 `0xFF0408`。

![](/images/3b651d28-35tziZQ.png)

程式碼如下

```javascript
let user = {
  name: 'Chris',
  age: 18,
};

user.age = 19

```

對於修改記憶體位址的位置來說，就不是 `user` 被替換，而是 `user.age` 的位置被替換。

如果要 immutable 就是換掉 user 為目標。(修改的是藍色線的指向，要指向新的一個物件)，將 `user` 改成 另一個 object 的動作，就是指向 `0xFF0200` 指向 `0xFF0210`。

![](/images/3b651d28-L94cyuD.png)

程式碼如下

```javascript
let user = {
  name: 'Chris',
  age: 18,
};

user = {
  name: 'Chris',
  age: 19,
}

```

對於修改記憶體位址的位置來說，就是 `user` 被替換。

## 那 immutable 和 Vue 的 watch 有什麼關係？

把上述的例子，拿來 vue 裡面放，就像這樣，也許會放在 vuex 不過意思差不多就是這樣。

有個 data 裡面有一個深一點的資料結構，也許是 object 也許是 array (在此用 object 當例子)

```javascript
export default {
  data () {
    return {
      user {
        name: 'Chris',
        age: 18
      }
    }
  }
}

```

Vue.js 可以監聽的範圍，基本上只要是 `return {}` 這一層裡面的變數 watch 都可以正常連動。以這個例子來說，就是修改 user 就可以正常連動，但是有時候我們只是想要修改 age 怎辦？

就可以準備一個已經改好的物件，`{ name: 'Chris', age: 19}` 來替換掉 user 原本的物件就可以了。這樣一來，對 user 來說就不是修改，而是替換，也可以讓 vue.js 保證 watch 可以連動，不需要查詢這麼特別又複雜的使用方式。

```javascript
export default {
  data () {
    return {
      user {
        name: 'Chris',
        age: 18
      }
    }
  },
  watch: {
    user() {
      console.log('update other data');
    }
  }
  methods: {
    updateUserAge() {
      this.user = {
        ...this.user,
        age: 19
      }
    }
  }
}

```

`updateUserAge` 就是一個簡單的做法，讓你在執行時， watch 的部份保證會連動到。Vue.js 會查覺到記憶體位址修改，所以要更新畫面。

## Vue.js 的連動更新畫面

有時候，vuex 的資料結構太深，mutate 只修改成員變數時，也會造成無法正確觸發 getters 的問題，導致畫面沒有正確更新

```javascript
const store = new Vuex.Store({
  state: {
    user: {
      name: 'Chris',
      age: 18
    }
  },
  mutations: {
    userName (state, { name }) {
      // 這樣可能 (我是說可能) 就會出現問題
      state.user.name = name
    }
  }
})

```

但是，只要保持 immutable 的觀念，讓更新。在[官網](https://vuex.vuejs.org/guide/mutations.html#mutations-follow-vue-s-reactivity-rules)的介紹中，叫 Reactivity Rules

```javascript
const store = new Vuex.Store({
  state: {
    user: {
      name: 'Chris',
      age: 18
    }
  },
  mutations: {
    userName (state, { name }) {
      // 這樣一定可以更新
      state.user = {
        ...state.user,
        name
      }
    }
  }
})

```

## 參考資料

1.  [傳值？傳參？](https://www.ithome.com.tw/voice/135952)
