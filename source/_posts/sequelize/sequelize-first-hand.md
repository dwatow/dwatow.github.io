---
title: 初探 Sequelize
date: 2018-09-24 10:49:42
tags: [Sequelize, JavaScript]
categories: 技術心得
---
# Sequelize 初探

Sequelize 是一個使用 JavaScript 的 ORM。
我自己的使用方式是與 Express 搭配，當作 MVC 的 `M`

另外，因為官網文件很鳥，所以寫了一個教學流程

## 安裝

使用 Node.js 盡量不要安裝 `-g` 因為每個 project 需要的工具，不管是初始化專案還是要維護時使用的套件，都是應該安裝的套件。

```shell
$ npm install --save sequelize@"<4.0.0"  //我需要 v3 版
$ npm install --save mysql2
$ npm install --save sequelize-cli
```

## 初始化

```shell
$ npx sequelize init
```

### 生成的檔案

**config/config.json**

這是用來儲存連線資訊的設定檔，看預設給的，有分成 `development`, `test`, `production` 三種環境變數設定。
可依自己的需要與設定進行修改

```
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

**models/index.js**

這個檔案很長，是 sequelize-cli 的重點。
透過這段程式碼，幫你管理的幾個部份，成為 MVC 的 `M`
- 資料庫連線設定 `config.json`
- 還有 Models 的內容 `models/index.js`

來導讀一下這一段程式碼

第一段，將需要的功能載進來，包含 Sequelize 的套件程式。
並且環境變數設定預設 development
引入 `config.json`

```javascript=
'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};
```

第二段，就是官網文件會介紹到的連線設定。[^connenction]
引入的 `config.json` 存成變數 `config` 並在這此使用它。

```javascript=10
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}
```

[^connenction]: [Getting Started - Setting up a connection](https://sequelize.readthedocs.io/en/v3/docs/getting-started/)

:::info
如果要使用 env file 的設定，就是使用連線字串的方式連線

**env file**
```javascript
{
    "production": {
        "use_env_variable": 'mysql://root:password@mysql_host.com/database_name'
    }
}
```
:::

第三段，`require` 將相同目錄底下的 `.js` 以 `model.name` 當索引值放到 `db` 物件中。
執行每一個 model 的 「`define`」將 資料表與 js 對應上

```javascript=15
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });
```

第四段，用來執行 `db` 物件裡的每一個 `.associate` method
執行每一個 「model 關聯」 的設定，也就是關聯式資料庫的 foreign key 的設定與 js 對應上。

```javascript=24
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
```

將全域的物件與類別，也放進 `db` 物件中。
將所有關於 MVC 的 `M` 都收斂在 `db` 裡

```
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```

這兩個資料夾目前都還是空的。

**migrations**
**seeders**

就先不要管它。
先看懂程式碼比較重要，對於之後，要如何維護 Model 心裡要有一個底。
