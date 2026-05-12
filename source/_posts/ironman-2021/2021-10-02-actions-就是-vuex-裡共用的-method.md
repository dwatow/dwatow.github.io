---
title: actions 就是 Vuex 裡「共用的 method」
date: 2021-10-02 00:00:00
tags:
  - 13th鐵人賽
  - vue.js
  - javascript
categories:
  - Vue.js 進階心法
source_url: https://ithelp.ithome.com.tw/articles/10276209
---

有時候，需要 CRUD 以外的行為，後端有時會開專屬的 API，有時候不會。  
有時候在使用 API 時，前端也有一些「一定會一起執行的事」。

那麼，這些「雜項」就很適合寫在 action 方便表現「系統的行為」

-   系統可以登入
-   系統可以登出
-   系統可以上傳檔案

`POST` `/login`

request body

```json=
{
  user: '',
  password: ''
}

```

response 200

```json=
{
  token: ''
}

```

`POST` `/file`

request header

```json=
{
  'Content-Type': 'multipart/form-data'
}

```

request body

form-data

```json=
{
  file: (binary)
}

```

response 200

```json=
{
  data: '/file/:file_path'
}

```

這些行為有時候可以寫在 acitons。

## 實作 vuex

在 action 可以直接定義 login, logout, uploadFile 的動作。

應該還有其它的用途，但是我一時之間想不到。

```javascript=
  async login({ commit }, payload) {
    const res = await backendAPI.POST('/login', payload)
    commit('setToken', res.token)
    cookies.set('token', res.token)
  },
  logout({ commit }) {
    commit('setToken', '')
    cookies.clear()
    router.push('/')
  },
  async uploadFile({ commit }, file) {
    const res = await backendAPI.formDataPOST(`/file`, { file })
    return res.data
  }

```

這些和 CRUD 不一樣的是，API 發送結束，並不是只有更新資料的 commit 而已。有時還有一些其它的事情要做。

列舉一些其它可能會有特別在 actions 出現的實作。不過如果這些邏輯和畫面有關，就有可能會在 component 上實作，而不是 actions

-   logout 可能在 API 收到 403 時就要執行。
-   uploadFile 可能會配合其它的功能使用。
-   login 需要儲存 cookie

明天來實作在一個 actions 裡做多個個非同步行為。
