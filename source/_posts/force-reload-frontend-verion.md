---
title: 前端頁面強迫更新的做法
date: 2024-12-05 17:43:39
tags:
- 網頁前端技術
- exporess
categories:
- 技術心得
---

# 前端頁面強迫更新的做法

## 後端

開一個 API 讓前端可以取得版號。

```javascript=
const code = '1.0.0'

module.exports = (req, res) => {
  console.log(now, code)
  res.send('1.0.0')
}
```

## 前端

**src/store/actions.js**

```javascript=
export default {
  // 登入相關的 action
  // ...
  async checkVersion({ dispatch }) {
    const frontend_version = Cookies.get("version");
    // 前端沒有版本資訊，表示是第一次登入
    // 重新登入，會取得版本資訊
    if (!frontend_version) {
      // 強迫取得版號
      dispatch("logout");
      window.location.href = "/";
      return;
    }

    const backend_version = await API.GET("/v2/version");

    if (frontend_version !== backend_version) {
      // 強迫更新
      Cookies.set("version", backend_version);
      window.location.reload();
    }
  },
  // ...
}
```

**src/router/index.js**

```javascript=
export async function beforeEach(to, from, next) {
  // 自動登入，取得 token
  // ...
  await store.dispatch("checkVersion");
  // ...
  // 確認登入，取得使用者資料
  next();
}
```
