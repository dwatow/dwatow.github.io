---
title: 不要在 mutation 加工 API 回來的資料
date: 2021-09-30 00:00:00
tags:
  - 13th鐵人賽
  - vue.js
  - javascript
categories:
  - Vue.js 進階心法
source_url: https://ithelp.ithome.com.tw/articles/10274949
---

**mutation**  
當作 state 的 setter 使用。  
要符合 setter 的使命，擋掉錯誤格式。

> 在 GET 和 POST 格式差很多時。  
> 可以在 mutation 不讓資料失真的前提轉格式。  
> 只是這樣的 case 我自己很少遇到。

**極致版的 state**  
只儲存 list 和 one 兩個變數。在此可以儲存一筆資料和一個列表的資料。

**基本款的 getters**  
就是直送，將資料原封不動的直接送出來。

**@/store/index.js**

```javascript=
import actions from './actions';

export default {
  actions,
  state: {
    one: {},
    list: []
  },
  mutations: {
    user (state, payload) {
      if (!(payload instanceof Object)) {
        throw Error('user is not Object in mutation')
      }
      state.one = payload
    },
    users (state, payload) {
      if (!(payload instanceof Array)) {
        throw Error('users is not Array in mutation')
      }
      state.list = payload
    }
  },
  getters: {
    user (state) {
      return state.one;
    },
    users (state) {
      return state.list;
    }
  }
}

```

> mutation 一定要用，為了配合 vue devtool 的 hook。

## 命名原則

mutation 的命名和 getters 一樣。就可以從呼叫 `dispatch('fetchUser')` 知道裡面有使用 `commit('user')` 之後可以從同名的 `getters.user` 拿到資料。

## 分檔原則

只將 actions 分出去  
一來會讓它大多數的作用是 API Doc 的對照表。  
二來是將 Module 本體保時資料 + getters + setters 的三個部份。
