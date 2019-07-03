---
title: Node.js 使用 .env 加上環境變數
date: 2019-01-26 11:42:42
tags: ["nodejs", "env", "e2e"]
categories: '技術心得'
---

# Node.js 使用 .env 加上環境變數

:::danger
這就是不要 git commit 上去的檔案!!!
通常是拿來存放敏感的資料，例如: 帳號密碼

這次研究是為了 e2e 測試，要使用 admin 的帳號密碼!!
:::

## node.js 的環境變數使用方式

官網只有說，可以在使用前，將環境變數儲存在 `process.env` [^node]
用法下面的程式碼這樣，還可以用 delete 刪掉

```javascript=
process.env.TEST = 1;
console.log(process.env.test);
// => 1
delete process.env.TEST;
console.log(process.env.TEST);
// => undefined
```

所以，要有一個載入的機制。
就可以將它儲存成 `process.env` 的 object

## 使用 dotenv 套件

為了不在程式碼的各處加入新的環境變數，而想要集中在 `.env` 檔中管理它，所以有大神寫了 dotenv [^dotenv] 可以在程式一開始就載入所有的環境變數。

也可以避免在不同的應用程式之間，使用了共用的環境變數。(因為是用 .env 檔載入在該專案中)

### 安裝

```shell
npm install dotenv --save
```

### 使用

建立 `.env` 檔 (不要加入 git)

```
CHRIS=chris
DB_HOST=DB_HOST
DB_PORT=DB_PORT
DB_USER=DB_USER
DB_PASS=DB_PASS
```

在程式剛啟動時，就可以載入

**app.js**

```javascript
require("dotenv").load();
console.log(process.env.CHRIS); //chris
console.log(process.env["DB_HOST"]); //DB_HOST
console.log(process.env["DB_PORT"]); //DB_PORT
console.log(process.env["DB_USER"]); //DB_USER
console.log(process.env["DB_PASS"]); //DB_PASS
```

<!-- prettier-ignore-start -->
[^node]: [process.env - node](https://nodejs.org/docs/latest-v8.x/api/process.html#process_process_env)
[^dotenv]: [Working with Environment Variables in Node.js](https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html)
<!-- prettier-ignore-end -->
