---
title: Vue router 實戰
date: 2018-05-20 14:11:20
tags: [vuejs, "vue-router"]
categories: ['技術心得']
---

# Vue router 實戰

網頁路由技術，可以讓使用者透過網址，決定要顯示的頁面。
在沒有這個之前，一個網址就是一個頁面，要路由，就是透過網址下的檔案目錄結構決定
但是由於資訊的複雜與需求提昇，搜尋、過濾...等條件，希望也可以不用重複操作也可以回到該頁面
所以，開始出現將資料庫搜尋條件放到網址的做法(這樣會造成注入攻擊，不過是另外的故事了)

網址內容，會被程式判定為輸入的條件轉譯成資料庫搜尋條件，再吐回相對應的網頁。
而這樣的流程原本是在後端執行。

隨著 JavaScript 的進步，前端框架的盛行，這一件事也搬到前端來了。
透過網址，決定 JavaScript 要執行的動作，決定頁面呈現的內容，就稱為「前端 router」

在此介紹幾個入門的使用案例，並且使用 vue-router 實作。

## Nested Routes

### Story

- 首頁是登入頁面，使用者登入成功之後，才可以進入主頁

主頁有選單，選單切換會換網頁內容

### 工程師的思考

- 主頁和首頁要切換
- 主頁要包含其它的內頁
  - 在主頁中，內頁要彼此切換

路徑結構會像這樣 (列舉一些內頁可能的例子)

```
+ 首頁
+ 主頁
    + 最新消息
    + 產品內容
    + 購物車
    + 關於我們
    + ...
```

若加上網址，結構就會像這樣
(假設 host: dwatow.github.io)

```
+ 首頁: dwatow.github.io/
+ 主頁: dwatow.github.io/main
    + 最新消息: dwatow.github.io/main/news
    + 產品內容: dwatow.github.io/main/products
    + 購物車:   dwatow.github.io/main/carts
    + 關於我們: dwatow.github.io/main/about
    + ...
```

有發現嗎？網址會有部份共用，就像是檔案結構般(但其實不是)

**實作上**

根目錄 和 主頁 要放一個 `<router-view></router-view>`
在 vue-router 的 router 設計，要使用 `children` 代表某一層要共用，有子層結構
在共用層要使用 `redirect` 指向某一個子層

```javascript=
var route = new Router({
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "login",
      component: login
    },
    {
      path: "/main",
      name: "main",
      component: main,
      redirect: "/main/index",
      children: [
        //...
      ]
    }
  ]
});
```

:::danger
一個看似簡單的巢狀結構，其實還要搭配畫面的結構才可以順利運作。
:::

## 切換必做 beforeEach

其實這叫 Navigation Guards ，可以看作是一種 hooks
在切換頁面的某個時機點，會做一次

### Story

- 使用者進入頁面一次，要更新內容一次

### 工程師的思考

不同的頁面，要更新不同的內容
也許會呼叫不同的 API 來更新內容。
除了非同步的問題要處理之外，還要思考這個呼叫的時機是否適合。

1. 頁面生成時 created of components
2. 路由改變時 beforeEach of router

第一點，只有在第一次畫面載入時，才會發生。透過 router 切換頁面內容，是不會造成 components 消滅或重新生成 (vue 本來的設計，就是這樣)。
第二點， router 原生的設計，就有這一個時機 (`beforeEach`) 可以使用。

直接對 router 物件使用 method

```javascript=
const router = new VueRouter({ ... })

router.beforeEach(async (to, from, next) => {
  //...
  switch(to.name) {
    case 'news':
      await router.app.$store.dispatch('API', '/news')
      break
    case 'products':
      await router.app.$store.dispatch('API', '/products')
      break
    //...
  }
  next()
})
```

- to: 下一個 route
- from: 上一個 route (進入首頁 = null)
- next: 通通弄好要執行這個 function

前往每一個頁面前的判斷，就可以區隔開來，為各別頁面執行各別的邏輯

:::danger
為了讓業主才可以容易「再許願，再實現」!!
工程師除了實現這個，還要寫得好維護 !!!
:::

## Programmatic Navigation

### Story

- 使用者在切換頁面時，或重新 reload 時，若登入資料失效，要導向登入頁

登入資料失效，另外定義

### 工程師的思考

在使用 vue 時，這種流程、頁面切換的條件、程式碼執行。都會使用 vue router
通常入門 vue router 時，會先學用 HTML 指定的方式 `<router-link :to="...">`，按下就會前往某個 `path`，但是就謹止於此的簡單需求。

若遇到這種(語意上相同)「切換頁面，若....要導向」的 Story，就要考慮使用 JavaScript ，有邏輯的「選擇式導向」。

```javascript
router.push(location, onComplete?, onAbort?)
```

- location
  - 一個 `route`
  - `route` 裡的 `path`

就可以寫這樣

```javascript
router.push("/");
```

:::danger
短短一句 code 要先懂這些事呀
:::
