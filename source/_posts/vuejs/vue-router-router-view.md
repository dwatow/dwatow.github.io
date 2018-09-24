---
title: Vue router 的 router-view 使用技巧
date: 2018-09-21 13:31:07
tags: [vuejs, "vue-router"]
categories: 工具使用
---

# Vue router 的 router-view 使用技巧

在此整理一些 vue-router 的 `router-view` 的使用技巧。

## 點擊 改變路徑

前端 router 主要是由網址決定要運作的 route ， route 決定要顯示的 component
常見的兩種手法如下

最簡單又常見的「一個 url → 一個 route → 一個 component」

用 HTML 裡記錄路徑

```html
<router-link to="/user" ></router-link>
```

用 JavaScript 裡記錄路徑

```javascript
const router = new VueRouter({...});
router.push('/user')
```

## 點擊 改變多層路徑

巢狀式的 route 又要怎麼控制要顯示的 component 呢？

```javascript=
const router = new VueRouter({
  routes: [
    {
      path: "/user/:id",
      component: User,
      children: [
        { path: "/user/foo/:key", component: Foo },
        { path: "/user/bar/:key", component: Bar }
      ]
    }
  ]
});
```

第一層 Component 的 `router-view`

```html=
<div id="app">
  <h1>Hello App!</h1>
  <router-link to="/user/foo/abcfoode">Go to Foo</router-link>
  <router-link to="/user/bar/abarbcde">Go to Bar</router-link>
  <router-view></router-view>
</div>
```

第二層 Component 的 `router-view`

```javascript=
const User = {
  template: `
  <div class="user">
    <h2>User {{ $route.params.id }}</h2>
    <router-view></router-view>
  </div>`
};
```

第三層 Components

```javascript=
const Foo = {
  template: `
  <div>
    foo {{ $route.params.key }}
  </div>`
};
const Bar = {
  template: `
  <div>
    bar {{ $route.params.key }}
  </div>`
};
```

### 點擊 多個 router-view

這個做法是一個 component 裡有兩個 `router-view` 那為了不讓 component 放錯位置，所以要對 `router-view` 命名

```html=
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

在一次 route 裡設定 指定多個 component，而且要對應到指定名稱。

```javascript=
const router = new VueRouter({
  routes: [
    {
      path: "/",
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
});
```
