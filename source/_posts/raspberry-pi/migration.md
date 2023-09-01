---
title: Raspberry Pi 4 的後端修鍊 (6) - Migration
date: 2023-08-21 13:09:29
tags:
- Raspberry Pi 4
- sequelize
- migration
categories:
- 技術練習
---
# Raspberry Pi 4 的後端修鍊 (6) - Migration

## Migration

[前面有提到 Migration 這個詞](https://dwatow.github.io/2023/07-28-raspberry-pi/foreign-key/#%E5%BB%BA%E7%AB%8B-migration)，現在總算是要正式介紹它了。還記得前面是遇到什麼問題的時候提到的嗎？

建立資料表

概念上它會記錄每次資料表的修改歷程，並且要開發者寫下前進一步與後退一步的程式碼。
例如: 

## 命名

都用單數。

### example: 2023/08/01-新增 USER 資料表

這個歷程，用 SQL 執行就會寫成[^create-user]

[^create-user]: [重新再新增資料表, 刪除資料表, Raspberry Pi 4 的後端修鍊 (2) - 建立資料表](https://dwatow.github.io/2023/07-27-raspberry-pi/create-table/#%E9%87%8D%E6%96%B0%E5%86%8D%E6%96%B0%E5%A2%9E%E8%B3%87%E6%96%99%E8%A1%A8)

**前進**

新增資料表，並定義資料表欄位

```sql
CREATE TABLE user (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  password CHAR(128) NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  PRIMARY KEY (id)
) ENGINE = InnoDB;
```

**後退**

刪除資料表

```sql
DROP TABLE user;
```

用 Sequelize 該怎麼做呢？

## 建立資料表[^create-table][^data-type]

[^create-table]: [Creating the first Model (and Migration)](https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-model-and-migration)

[^data-type]: [Data Types, Model Basics | Sequelize](https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types)

```shell
$ npx sequelize model:generate --name User --attributes id:integer,name:string,password:string,created_at:date,updated_at:date

Sequelize CLI [Node: 18.16.0, CLI: 6.6.1, ORM: 6.32.1]

New model was created at /home/admin/case/lib-backend/models/user.js .
New migration was created at /home/admin/case/lib-backend/migrations/20230802083644-create-user.js .
```

會生成

**專案/migrations/20230802083644-create-user.js**

```javascript
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
```

並且直接生成 Model (麻豆)...關於 Model 的一切，我們下一篇再處理，目前先不管它

等等...
好像哪裡怪怪的。

sequelize 生成每一個資料表，會自動送三個欄位 `id`, `createdAt`, `updatedAt` 和我們自己定義的那一組重複了。

### 先取消剛剛的步驟

要重新建立，必須要先刪除

```shell
$ npx sequelize db:migrate:undo

Sequelize CLI [Node: 18.16.0, CLI: 6.6.1, ORM: 6.32.1]

Loaded configuration file "config/config.json".
Using environment "development".
No executed migrations found.
```

### 再一次建立資料表

```shell
$ npx sequelize model:generate --underscored --force --name user --attributes name:string,password:string

Sequelize CLI [Node: 18.16.0, CLI: 6.6.1, ORM: 6.32.1]

New model was created at /home/admin/case/lib-backend/models/user.js .
New migration was created at /home/admin/case/lib-backend/migrations/20230803111707-create-user.js .
```

- `--name` 定義資料表名稱，建議使用小寫。
- `--underscored` 欄位名稱都用`小寫`+`底線` 命名
- `--force` 命名強制相同，不要有單複數 (在此都用單數)

sequelize 會產生下面原始碼

**專案/migrations/20230803090103-create-user.js**

> `queryInterface.createTable('users'` 應該要用 `'user'` 才對。
sequelize 出現 bug [^force-bug]
> 在此請手動修正

[^force-bug]: [Command argument --force does not work with model:generate #638](https://github.com/sequelize/cli/issues/638)

```javascript
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
//await queryInterface.createTable('users', {  // 手動修正取消這一行
  await queryInterface.createTable('user', { // 請手動修正成這樣
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
```

**專案/models/user.js**

(略)

### 產生資料表

到目前，還沒有生成任何資料表，讓我們來執行一下 migrate 到最新進度

如果我們想要執行 migration 的時候，看得到 log 出現 SQL 語法。就必須在 config 的部份加上 `"logging": true` [^log]

[^log]: [Logging Sequelize Migrations](https://stackoverflow.com/a/49370372)

```json
{
  // ...
  "development": {
    "username": "admin",
    "password": "pi",
    "database": "good_ideas_lib_dev",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": true
  },
  // ...
}
```

加好之後，執行 migrate 就可以看見 SQL 印在 shell 囉

```shell
$ npx sequelize-cli db:migrate

Sequelize CLI [Node: 18.16.0, CLI: 6.6.1, ORM: 6.32.1]

Loaded configuration file "config/config.json".
Using environment "development".
Executing (default): SELECT 1+1 AS result
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = 'good_ideas_lib_dev';
Executing (default): SHOW FULL COLUMNS FROM `SequelizeMeta`;
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'SequelizeMeta' AND TABLE_SCHEMA = 'good_ideas_lib_dev'
Executing (default): SHOW INDEX FROM `SequelizeMeta`
Executing (default): SELECT `name` FROM `SequelizeMeta` AS `SequelizeMeta` ORDER BY `SequelizeMeta`.`name` ASC;
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'SequelizeMeta' AND TABLE_SCHEMA = 'good_ideas_lib_dev'
Executing (default): SHOW INDEX FROM `SequelizeMeta`
Executing (default): SELECT `name` FROM `SequelizeMeta` AS `SequelizeMeta` ORDER BY `SequelizeMeta`.`name` ASC;
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'SequelizeMeta' AND TABLE_SCHEMA = 'good_ideas_lib_dev'
Executing (default): SHOW INDEX FROM `SequelizeMeta`
Executing (default): SELECT `name` FROM `SequelizeMeta` AS `SequelizeMeta` ORDER BY `SequelizeMeta`.`name` ASC;
== 20230824085150-create-user: migrating =======
Executing (default): CREATE TABLE IF NOT EXISTS `user` (`id` INTEGER NOT NULL auto_increment , `name` VARCHAR(255), `password` VARCHAR(255), `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'SequelizeMeta' AND TABLE_SCHEMA = 'good_ideas_lib_dev'
Executing (default): SHOW INDEX FROM `SequelizeMeta`
Executing (default): INSERT INTO `SequelizeMeta` (`name`) VALUES (?);
== 20230824085150-create-user: migrated (0.039s)
```

其中與新增資料表有關的部份

```sql
CREATE TABLE IF NOT EXISTS `user` (
  `id` INTEGER NOT NULL auto_increment , 
  `name` VARCHAR(255), 
  `password` VARCHAR(255), 
  `created_at` DATETIME NOT NULL, 
  `updated_at` DATETIME NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
```

比對一下，一開始我們想要的 SQL ，會發現幾個有趣的事

```sql
CREATE TABLE user (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  password CHAR(128) NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  PRIMARY KEY (id)
) ENGINE = InnoDB;
```

- sequelize 宣告的 `INTEGER` 不是縮寫(手寫可以寫縮寫 `INT`)
- sequelize 宣告的 `name: DataTypes.STRING` 對應的資料是 `VARCHAR(255)`
- sequelize 宣告的欄位預設是 `NOT NULL`
- sequelize 宣告的 created_at 與 updated_at 都沒有 `NOT NULL`

### 倒退 migraion

```shell
$ npx sequelize-cli db:migrate:undo

Sequelize CLI [Node: 18.16.0, CLI: 6.6.1, ORM: 6.32.1]

Loaded configuration file "config/config.json".
Using environment "development".
Executing (default): SELECT 1+1 AS result
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = 'good_ideas_lib_dev';
Executing (default): SHOW FULL COLUMNS FROM `SequelizeMeta`;
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'SequelizeMeta' AND TABLE_SCHEMA = 'good_ideas_lib_dev'
Executing (default): SHOW INDEX FROM `SequelizeMeta`
Executing (default): SELECT `name` FROM `SequelizeMeta` AS `SequelizeMeta` ORDER BY `SequelizeMeta`.`name` ASC;
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'SequelizeMeta' AND TABLE_SCHEMA = 'good_ideas_lib_dev'
Executing (default): SHOW INDEX FROM `SequelizeMeta`
Executing (default): SELECT `name` FROM `SequelizeMeta` AS `SequelizeMeta` ORDER BY `SequelizeMeta`.`name` ASC;
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'SequelizeMeta' AND TABLE_SCHEMA = 'good_ideas_lib_dev'
Executing (default): SHOW INDEX FROM `SequelizeMeta`
Executing (default): SELECT `name` FROM `SequelizeMeta` AS `SequelizeMeta` ORDER BY `SequelizeMeta`.`name` ASC;
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'SequelizeMeta' AND TABLE_SCHEMA = 'good_ideas_lib_dev'
Executing (default): SHOW INDEX FROM `SequelizeMeta`
Executing (default): SELECT `name` FROM `SequelizeMeta` AS `SequelizeMeta` ORDER BY `SequelizeMeta`.`name` ASC;
== 20230824085150-create-user: reverting =======
Executing (default): DROP TABLE IF EXISTS `users`;
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'SequelizeMeta' AND TABLE_SCHEMA = 'good_ideas_lib_dev'
Executing (default): SHOW INDEX FROM `SequelizeMeta`
Executing (default): DELETE FROM `SequelizeMeta` WHERE `name` = '20230824085150-create-user.js'
== 20230824085150-create-user: reverted (0.027s)
```

倒退的語法，倒是滿符合內心期望的，哈哈。

```sql
Executing (default): DROP TABLE IF EXISTS `users`;
```

## 依想要的欄位設定再產生資料表

所以使用 cli

```shell
$ npx sequelize model:generate --underscored --force --name user --attributes name:string,password:string
```

取得 migration 的程式碼時。
需要手動修改一下。

migration 的 code 才是真正產生資料表結構的程式碼，所以要修改 **migrations/20230901021924-create-user.js** 底下的

- 變動字串長度要修改，直接加(`Sequelize.STRING(長度)`)[^Data-Types-String]
- 想要長度 128 的固定字串，要改成 `Sequelize.CHAR(128)`
- 欄位必填，直接加 `allowNull: false`

> 新增與修改日期，進行到此的時候，覺得它應該要必填，所以留著。

[^Data-Types-String]: [Model Basics | Sequelize, Data Types, String](https://sequelize.org/docs/v6/core-concepts/model-basics/#strings)

```javascript
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      password: {
        allowNull: false,
        type: Sequelize.CHAR(128)
      },
      created_at: {
        allowNull: false, // 現在覺得它應該要必填，所以留著
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false, // 現在覺得它應該要必填，所以留著
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
```
生成

```shell
$ npx sequelize db:migrate

Sequelize CLI [Node: 18.16.0, CLI: 6.6.1, ORM: 6.32.1]

Loaded configuration file "config/config.json".
Using environment "development".
Executing (default): SELECT 1+1 AS result
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = 'good_ideas_lib_dev';
Executing (default): SHOW FULL COLUMNS FROM `SequelizeMeta`;
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'SequelizeMeta' AND TABLE_SCHEMA = 'good_ideas_lib_dev'
Executing (default): SHOW INDEX FROM `SequelizeMeta`
Executing (default): SELECT `name` FROM `SequelizeMeta` AS `SequelizeMeta` ORDER BY `SequelizeMeta`.`name` ASC;
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'SequelizeMeta' AND TABLE_SCHEMA = 'good_ideas_lib_dev'
Executing (default): SHOW INDEX FROM `SequelizeMeta`
Executing (default): SELECT `name` FROM `SequelizeMeta` AS `SequelizeMeta` ORDER BY `SequelizeMeta`.`name` ASC;
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'SequelizeMeta' AND TABLE_SCHEMA = 'good_ideas_lib_dev'
Executing (default): SHOW INDEX FROM `SequelizeMeta`
Executing (default): SELECT `name` FROM `SequelizeMeta` AS `SequelizeMeta` ORDER BY `SequelizeMeta`.`name` ASC;
== 20230901021924-create-user: migrating =======
Executing (default): CREATE TABLE IF NOT EXISTS `user` (`id` INTEGER NOT NULL auto_increment , `name` VARCHAR(50) NOT NULL, `password` CHAR(128) NOT NULL, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'SequelizeMeta' AND TABLE_SCHEMA = 'good_ideas_lib_dev'
Executing (default): SHOW INDEX FROM `SequelizeMeta`
Executing (default): INSERT INTO `SequelizeMeta` (`name`) VALUES (?);
== 20230901021924-create-user: migrated (0.039s)
```

其中和生成資料表有關的部份

```sql
CREATE TABLE IF NOT EXISTS `user` (
  `id` INTEGER NOT NULL auto_increment , 
  `name` VARCHAR(50) NOT NULL, 
  `password` CHAR(128) NOT NULL, 
  `created_at` DATETIME NOT NULL, 
  `updated_at` DATETIME NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
```

這個就和一開始想要的那一段 SQL 一樣了(除了突然想要必填的日期欄位之外)

```sql
CREATE TABLE user (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  password CHAR(128) NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  PRIMARY KEY (id)
) ENGINE = InnoDB;
```

先看看 migration 生成什麼 JS ？？

## migrations 結構

migrations 產生的 JS 真的會轉成 SQL 的 code。
所以，想要讓資料表產生之後長怎樣的設定，通通在這裡調整。

```javascript
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 前進一步 
  },
  async down(queryInterface, Sequelize) {
    // 後退一步
  }
};
```

執行時是用 `sequelize-cli` 進行，並不是直接用執行 `node`

執行前進

```shell
$ npx sequelize db:migrate
```

執行後退

```shell
$ npx sequelize db:migrate:undo
```

其它 sequelize-cli 的細節，用指令查比較多資料也比較符合當下使用的版本

```shell
npx sequelize --help
```

## 不建議使用的指令

```javascript
User.sync() // 同步(新增)，和 migration 效果一樣，但是沒有留下版本記錄，不建議使用。
User.drop() // 刪除資料表
```

