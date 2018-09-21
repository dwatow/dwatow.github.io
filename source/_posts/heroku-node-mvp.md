---
title: node.js 的 Hello world 在 heroku
date: 2018-01-13 12:26:22
tags: ["nodejs", "heroku", "npm"]
categories: "工具使用"
---

# node.js 的 Hello world 在 heroku

# 前言

因為，光是要用 node.js 上傳簡單程式碼到 heroku 測試，就花了很多時間認識 heroku。
所以，特別寫了一篇 ~~比 heroku 清楚~~ 的從零開始教學。

## 寫給誰

已安裝 node.js 並且想把它佈署到網路空間

- 後端程式
  - 使用 [node.js](https://nodejs.org/en/)
  - 不使用 [express](http://expressjs.com/zh-tw/) 框架
- 用 [heroku](www.heroku.com) 空間

# 開始囉

依文章的標題「node.js 的 Hello world 在 heroku」
可以拆成兩大部份

1. node.js 的 Hello world
2. 在 heroku

## 先做 node.js 的 Hello world

到 node 官網，找 doc ，選任一版本，點擊文件裡的 [Usage & Example](https://nodejs.org/docs/latest-v7.x/api/synopsis.html)

此例是使用 Node.js v7.10.1 Documentation 的程式碼

```javascript=
const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

新增一個檔案 (ex: index.js) ，再將程式碼 貼上 → 存檔。

到該目錄下執行

```shell=
$ ls
index.js
$ node index.js
Server running at http://127.0.0.1:3000/
```

打開瀏覽器，網址輸入 `http://127.0.0.1:3000/`
看見 `Hello World` 的字眼就算這一步成功了

## 在 heroku

到這，可是「正片開始」
首先，我們要了解，光是上傳一個 `index.js` 的話，heroku 是不知道要怎麼執行它。

### 修改程式碼

對於 port 的設定，必須要這樣執行

```javascript=
const PORT = process.env.PORT || 5000;
//...
server.listen(PORT);
```

不像是版本的問題。
測試下來，線上版本是 8.9.4 但是若使用預設的程式碼依然無法利執行。

### 決定上傳 heroku 的途徑

這裡就比較多 heroku 的注意事項了。

#### 1. 本機 repository 上傳 heroku

如果你是私有專案，要安裝 heroku-cli

```shell
$ brew install heroku/brew/heroku
```

學一下它怎麼[初始化並上傳程式碼到 heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app)

#### 2. Github repository 上傳 heroku

如果要透過 Github 傳到 heroku。
就在 heroku 的服務中，新增 app
在 app 裡面找 Deploy

這裡選 Github

![](https://i.imgur.com/TRfSpJ2.png)

並且指定你要傳過來的 repository 和 branch

heroku 提供的佈署方式很靈活，算是滿方便的。

1. 自動佈署的開關
   - 是否要等 CI 正確再自動部署到 heroku
2. 手動佈署的觸發按鈕

### 設定 heroku 啟動 node.js

#### heroku 預設的啟動指令

在 Web 介面 Overview 上，可看到這個東西

![](https://i.imgur.com/rkbEtG0.png)

它就是預設的啟動指令。

heroku 預設 node.js 會使用 `npm start` ，所以預設使用這樣的指令啟動你的專案。

### 初始化 npm

在專案目錄下執行

```shell
$ npm init
```

會出現 `package.json`

> 如果要指定 `node.js` 或 `npm` 的版本，要在這時候加上去。

打開 `package.json`

```json=
  "scripts": {
    "start": "node index.js", //加入這一行
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

測試一下啟動指令

```shell
$ npm start
```

一樣打開瀏覽器，網址輸入 http://127.0.0.1:3000/
看見 Hello World 的字眼就算 `npm` 的初始就算成功了

不過，也可以手動設定

也就是說，也可以不安裝 `npm` 改預設啟動指令，也可以用 `node index.js` 來啟動程式

### 手動設定 heroku 的啟動指令

在 [node.js 快速啟動教學](https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-a-procfile) 中，有介紹 Procfile 檔案。

它就是 heroku 預設會讀的檔案，若你不設定，空間會提供一個預設檔，內容就是預設指令。

:::danger
若你要設定，這是付費功能。
:::

不過，線上就可以修改了

### 最後加上 .env 檔

參考自 [node-js-getting-started](https://github.com/heroku/node-js-getting-started) 這個可執行的專案。

它有一個 .env 檔。
而且在佈署時，缺此檔，會有 WARNING

而檔案內容就一行，(依 key=value 的格式)

```shell
TIMES=2
```

## 這樣，應該就成功了

上傳之後，在瀏覽器看到

![](https://i.imgur.com/S4xxZj2.png)

就很開心了。

不用為了上傳 heroku 而必須學 express 這樣奇怪的決策順序。

有幾個地方要知道，會幫助在這過程找到錯誤的線索。

### 看佈署 log

![](https://i.imgur.com/nmgO4yo.png)

### 看執行 log

![](https://i.imgur.com/IPajyxD.png)
