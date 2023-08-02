---
title: Raspberry Pi 4 的後端修鍊 (5) - ORM
date: 2023-08-02 15:40:26
tags:
- Raspberry Pi 4
- sequelize
- mariadb
categories:
- 技術練習
---
# Raspberry Pi 4 的後端修鍊 (5) - ORM

> 基本上就是要用 ORM 完成 [Raspberry Pi 4 的後端修鍊 (1) - Mariadb Initial](https://dwatow.github.io/2023/06-28-raspberry-pi/mariadb-init/) 的操作

## ORM

ORM，英文叫Object Relational Mapping， 翻譯成中文為物件關聯對映
概念上就是用物件導向的概念來理解資料操作。所以，接下來會用套件，看起來是操作 JS 的物件，但實際上是操作資料。

可以理解，在 node.js 上，它是一種資料庫操作的套件。所以，接下來會直接在 node 上面跑資料庫的建立與資料操作。

## 在此使用 sequelize

[官網](https://sequelize.org/) (目前 v6-stable)

## 安裝&初始化

先看 [sequelize-cli](https://dwatow.github.io/2021/05-15-raspberry-pi/sequelize-cli-beginer/)

設定 config

**專案/config/config.json**

最上面加一段，不 git 的

```json
{
  "root": {
    "username": "sa",
    "password": null,
    "database": "good_ideas_lib_dev",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  //...
}
```

設定
- username 最高管理者帳號
- password 最高管理者密碼
- database 即將要新增的新資料庫

```shell
$ npx sequelize db:create --env=root

Sequelize CLI [Node: 18.16.0, CLI: 6.6.1, ORM: 6.32.1]

Loaded configuration file "config/config.json".
Using environment "root".
Database good_ideas_lib_dev created.
```

`--env=root` 可以控制要執行哪一段設定

## 用 SQL 設定新資料庫與帳號

看之前的[文章](https://dwatow.github.io/2023/06-28-raspberry-pi/mariadb-init/#%E8%B3%87%E6%96%99%E5%BA%AB%E5%88%9D%E6%AC%A1%E8%A8%AD%E5%AE%9A)

裡面有介紹，如何新增帳號給資料庫，並且將賦予帳號權限給資料庫使用。
後面的 sequelize 的操作才成功。

## 測試連線

> 接下來的這一段與 sequelize-cli 生成的程式碼無關。

直接在專案根目錄新增一個 main.js

**專案/main.js**

```javascript
const { Sequelize } = require('sequelize');

const development = {
  // 請設定，並複製一份 config/config.js 裡的 development 的設定
}

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(development.database, development.username, development.password, {
  host: development.host,
  dialect: development.dialect
});

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
main()
```

測試

```shell
$ node main.js
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
```

連線成功！

