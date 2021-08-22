---
title: Raspberry Pi 4 的後端修鍊 - sequelize-cli
date: 2021-05-15 00:07:11
tags:
- "Raspberry Pi 4"
- sequelize
- migration
categories:
- 技術練習
---
# Raspberry Pi 4 的後端修鍊: sequelize-cli

## 安裝

**sequelize**[^sequelize-setup]

[^sequelize-setup]: [Sequelize](https://sequelize.org/)

```shell
$ npm install --save sequelize mysql2
```

> 要使用 mariadb 要安裝 mysql2
> 並且把 config 的 "dialect" 設成 "mysql" (後面會講)

**sequelize-cli**[^sequelize-cli-setup]

[^sequelize-cli-setup]: [sequelize/cli: The Sequelize CLI](https://github.com/sequelize/cli)

```shell
$ npm install -g --save sequelize-cli
```

安裝好，確定一下安裝成功

```shell
$ sequelize --version

Sequelize CLI [Node: 12.18.0, CLI: 5.5.1, ORM: 5.21.13]

5.5.1
```

> 問題: Unable to resolve sequelize package
> 因為 `sequelize-cli` 不會幫你安裝 `sequelize` 所以 shell 執行 `sequelize` 時會出現呼叫不到 `sequelize`

指令說明

```shell
$ npx sequelize

Sequelize CLI [Node: 12.18.0, CLI: 5.5.1, ORM: 5.22.4]

sequelize [command]

命令：
  sequelize db:migrate                        Run pending migrations
  sequelize db:migrate:schema:timestamps:add  Update migration table to have timestamps
  sequelize db:migrate:status                 List the status of all migrations
  sequelize db:migrate:undo                   Reverts a migration
  sequelize db:migrate:undo:all               Revert all migrations ran
  sequelize db:seed                           Run specified seeder
  sequelize db:seed:undo                      Deletes data from the database
  sequelize db:seed:all                       Run every seeder
  sequelize db:seed:undo:all                  Deletes data from the database
  sequelize db:create                         Create database specified by configuration
  sequelize db:drop                           Drop database specified by configuration
  sequelize init                              Initializes project
  sequelize init:config                       Initializes configuration
  sequelize init:migrations                   Initializes migrations
  sequelize init:models                       Initializes models
  sequelize init:seeders                      Initializes seeders
  sequelize migration:generate                Generates a new migration file                                                                         [別名: migration:create]
  sequelize model:generate                    Generates a model and its migration                                                                        [別名: model:create]
  sequelize seed:generate                     Generates a new seed file                                                                                   [別名: seed:create]

選項：
  --help     顯示說明                                                                                                                                                  [布林]
  --version  顯示版本
```

分成幾個部份

**初始化**

| 指令                      | 作用                         |
| ------------------------- | ---------------------------- |
| sequelize init            | 初始化 project(包含下面四個) |
| sequelize init:config     | 初始化 configuration         |
| sequelize init:migrations | 初始化 migrations            |
| sequelize init:models     | 初始化 models                |
| sequelize init:seeders    | 初始化 seeders               |

**資料庫 建立/刪除**

使用時注意權限是否可以更動資料庫

| 指令                | 作用                            |
| ------------------- | ------------------------------- |
| sequelize db:create | 從指定的 config 檔新增 database |
| sequelize db:drop   | 從指定的 config 檔刪除 database |

**產生各種腳本**

| 指令                         | 作用                          | 參數                      |
| ---------------------------- | ---------------------------- | ------------------------ |
| sequelize migration:generate | 產生 new migration 檔         | [別名: migration:create] |
| sequelize model:generate     | 產生 model 和它的 migration 檔 | [別名: model:create]     |
| sequelize seed:generate      | 產生 new seed 檔              | [別名: seed:create]      |

**資料表結構維護**

| 指令                                       | 作用                                       |
| ------------------------------------------ | ----------------------------------------- |
| sequelize db:migrate                       | 執行未跑過的 migrations                     |
| sequelize db:migrate:undo                  | 恢復一次 migration                         |
| sequelize db:migrate:undo:all              | 恢復所有跑過的 migrations                   |
| sequelize db:migrate:schema:timestamps:add | Update migration table to have timestamps |
| sequelize db:migrate:status                | List the status of all migrations         |

**前置資料維護**

| 指令                       | 作用                  |
| -------------------------- | -------------------- |
| sequelize db:seed          | 執行指定的 seeder     |
| sequelize db:seed:all      | 執行每一個 seeder     |
| sequelize db:seed:undo     | 從 database 刪除資料  |
| sequelize db:seed:undo:all | 從 database 刪除資料  |


## 初始化 sequelize 的基本環境

sequelize 的 cli 工具，可以做到很多事情，不過大多都在處理 migration。

```shell
$ sequelize init

Sequelize CLI [Node: 12.18.0, CLI: 5.5.1, ORM: 5.22.4]

Created "config/config.json"
Successfully created models folder at "/home/pi/code/express-demo/models".
Successfully created migrations folder at "/home/pi/code/express-demo/migrations".
Successfully created seeders folder at "/home/pi/code/express-demo/seeders".
```

執行完會出現

```shell
project/
├- migrations/
├- seeders/
├- config/
|  ├- config.json
└- models/
   └- index.js
```


- `config`, 包含 config 檔案, 提供資料庫連線給 CLI
- `models`, 包含專案中所有的 models
- `migrations`, 包含所有的 migration 檔案
- `seeders`, 包含所有的 seed 檔案

在此出現幾個陌生的名詞

- CLI: command line interface
- models: MVC 的 model，用來和資料庫連動的物件定義
- migration: 資料庫變動記錄
- seed: 餵資料，通常是資料庫的系統初始資料

> ORM 工具管理資料表變化，都會使用 migration。
它就像是 git 這種版本控制工具，只是它版控的是 table schema (只有管有哪些資料表與有哪些資料表的欄位)

## 資料庫連線設定

sequelize 要連線資料庫要靠 `config/config.json` 這裡的資訊。

[^env]: [Node.js 使用 .env 加上環境變數 - 《Chris 技術筆記》](https://dwatow.github.io/2019/01-26-node-with-env-first/)

**config/config.json**

環境變數就會對應到預設 config 的 `development`, `test`, `production` 三種情境，可依需要增減。

> dialect: 翻譯到不同資料庫的 statement[^sequelize-dialect]
>
[^sequelize-dialect]: [Manual Dialects | Sequelize](https://sequelize.org/v5/manual/dialects.html)

在此，我使用的是 mariadb，所以 "dialect" 設定成 ~~"mariadb"~~ "mysql" 才會跑。(不知道為什麼的雷點！)

如果有 `operatorsAliases: false` 營運商別名，保持預設值就好。(我目前是刪掉它)

```jsonld
{
  "development": {
    "username": "root",
    "password": "root",
    "host": "127.0.0.1",
    "database": "booklibrary",
    "dialect": "mysql"
  },
  "test": {
    "username": "rasp",
    "password": "rasp",
    "host": "127.0.0.1",
    "database": "booklibrary",
    "dialect": "mysql"
  },
  "production": {
    "username": "rasp",
    "password": "rasp",
    "database": "booklibrary",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

```

三個的使用情境，我自己會這麼使用

**development**

用在開發者變動(新增/刪除/修改)資料庫、資料表結構

**production**

用在平常的執行時使用的設定 (給 CD/CI 起動時用的)

**test**

還沒想到。

## 用 ORM 創造資料庫

```shell
$ npx sequelize db:create booklibrary

Sequelize CLI [Node: 12.18.0, CLI: 5.5.1, ORM: 5.22.4]

Loaded configuration file "config/config.json".
Using environment "development".
Database booklibrary created.
```

> 因為用 cli 所以 env 要自帶在 env 參數
> 預設 env 參數是 "development"

:::danger
db:create 要使用權限較高的帳號執行。
在此設定在 `development` 的 config 中。
:::


## 用 ORM 創造 Migration 步驟

Migration 像是資料庫的演進過程，每一步都記錄下來的話，有助於未來再建立一次初始系統。
也有助於自動化資料表建置、修改或系統的初始資料建置。

但是 migration 畢竟一開始算是「一個動作」我們就以這個角度切入看看 sequelize-cli 幫我們打造了什麼工具又可以做到什麼吧！

一開始我們創一個 Migration 檔來執行或恢復。

```bash
$ npx sequelize-cli migration:generate --name create-empty-file

Sequelize CLI [Node: 12.18.0, CLI: 5.5.1, ORM: 5.22.4]

migrations folder at "/home/pi/code/express-demo/migrations" already exists.
New migration was created at /home/pi/code/express-demo/migrations/20210820152155-create-empty-file.js .
```

可以產生一個 migration 檔。

**migrations/20210820152155-create-empty-file.js**

```javascript=
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

    // Example:
    return queryInterface.createTable('users', { id: Sequelize.INTEGER });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */

    // Example:
    return queryInterface.dropTable('users');
  }
};
```

配合上面的 Example (source code 產生的)

- `queryInterface`: 用來修改 Database
- `Sequelize`: 用來記可以用的資料型別 (ex: STRING, INTEGER)
- function up, down: 回傳 promise

### 執行 migration

執行到底

```bash
sequelize-cli db:migrate
```

恢復到底

```bash
sequelize db:migrate:undo:all
```

### 此也可以加上 transaction

透過 `queryInterface.sequelize.transaction(done => {})` 可以在 callback 裡面執行 一次 transaction 的所有行為。並且在每個行為的最後一個參數加上 `, { transaction: done }`

```javascript=
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return queryInterface.createTable('users', {
        id: Sequelize.INTEGER
      }, { transaction });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return queryInterface.dropTable('users', { transaction });
    });
  }
};
```

### 此也可以含有 forang key

```javascript=
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Person', {
      name: Sequelize.DataTypes.STRING,
      isBetaMember: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'users',
            schema: 'schema'
          },
          key: 'id'
        },
        allowNull: false
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Person');
  }
}
```

改寫成 async/await

```javascript=
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'Person',
        'petName',
        {
          type: Sequelize.DataTypes.STRING,
        },
        { transaction }
      );
      await queryInterface.addIndex(
        'Person',
        'petName',
        {
          fields: 'petName',
          unique: true,
          transaction,
        }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('Person', 'petName', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
```

### 一併創造資料表

可以在建立 migration 的同時，也產生好對應 Model 檔案。

```shell
$ sequelize model:generate --name authors --attributes author_id:number,name_last:string,name_first:string,country:string


Sequelize CLI [Node: 12.18.0, CLI: 5.5.1, ORM: 5.22.4]

New model was created at /home/pi/code/express-demo/models/authors.js .
New migration was created at /home/pi/code/express-demo/migrations/20210501084235-authors.js .
```

- author_id:number
- name_last:string
- name_first:string
- country:string

產生 **models/authors.js**

```javascript=
'use strict';
module.exports = (sequelize, DataTypes) => {
  const authors = sequelize.define('authors', {
    author_id: DataTypes.NUMBER,
    name_last: DataTypes.STRING,
    name_first: DataTypes.STRING,
    country: DataTypes.STRING
  }, {});
  authors.associate = function(models) {
    // associations can be defined here
  };
  return authors;
};
```

產生 **migrations/20210501084235-create-authors.js**

這裡做一點修改，我們想要讓 id 用 author_id 表示

```javascript=
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('authors', {
      author_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // author_id: {
      //   type: Sequelize.NUMBER
      // },
      name_last: {
        type: Sequelize.STRING
      },
      name_first: {
        type: Sequelize.STRING
      },
      country: {
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('authors');
  }
};
```

```sql
describe authors;
```
```shqll
+------------+--------------+------+-----+---------+----------------+
| Field      | Type         | Null | Key | Default | Extra          |
+------------+--------------+------+-----+---------+----------------+
| author_id  | int(11)      | NO   | PRI | <null>  | auto_increment |
| name_last  | varchar(255) | YES  |     | <null>  |                |
| name_first | varchar(255) | YES  |     | <null>  |                |
| country    | varchar(255) | YES  |     | <null>  |                |
| createdAt  | datetime     | NO   |     | <null>  |                |
| updatedAt  | datetime     | NO   |     | <null>  |                |
+------------+--------------+------+-----+---------+----------------+

6 rows in set
Time: 0.759s
```

## 用 ORM 創造資料

為了在 migration 可以預先填入資料

```shell
$ npx sequelize-cli seed:generate --name base-authors

Sequelize CLI [Node: 12.18.0, CLI: 5.5.1, ORM: 5.22.4]

seeders folder at "/home/pi/code/express-demo/seeders" already exists.
New seed was created at /home/pi/code/express-demo/seeders/20210501134052-base-authors.js .
```

**seeders/20210501134052-base-authors.js**

```javascript=
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      自己寫入要加上去什麼資料
      */
    return queryInterface.bulkInsert('authors', [{
      name_first: 'Kafka',
      name_last: 'Franz',
      country: 'Czech Republic',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name_first: 'Dostoevsky',
      name_last: 'Fyodor',
      country: 'Russian',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name_first: 'Chris',
      name_last: 'Wang',
      country: 'Tainan',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name_first: 'Mary',
      name_last: 'Lee',
      country: 'Tainan',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      同時要寫下返回的時候要刪掉什麼資料
      */
    return queryInterface.bulkDelete('authors', null, {});
  }
};
```

執行

```shell
$ npx sequelize db:seed

Sequelize CLI [Node: 12.18.0, CLI: 5.5.1, ORM: 5.22.4]

Loaded configuration file "config/config.json".
Using environment "development".
```

看資料是否有加進去資料庫


```sql
select * from authors;
```
```shqll
+-----------+-----------+------------+----------------+---------------------+---------------------+
| author_id | name_last | name_first | country        | createdAt           | updatedAt           |
+-----------+-----------+------------+----------------+---------------------+---------------------+
| 1         | Franz     | Kafka      | Czech Republic | 2021-05-01 13:36:31 | 2021-05-01 13:36:31 |
| 2         | Fyodor    | Dostoevsky | Russian        | 2021-05-01 13:36:31 | 2021-05-01 13:36:31 |
| 3         | Wang      | Chris      | Tainan         | 2021-05-01 13:36:31 | 2021-05-01 13:36:31 |
| 4         | Lee       | Mary       | Tainan         | 2021-05-01 13:36:31 | 2021-05-01 13:36:31 |
+-----------+-----------+------------+----------------+---------------------+---------------------+

4 rows in set
Time: 0.507s
```

返回上次填入資料的動作

```shell
$ npx sequelize-cli db:seed:undo
```

指定檔案返回填入資料的動作

```shell
$ npx sequelize-cli db:seed:undo --seed seeders/20210501134052-base-authors.js
```

返全部填入資料的動作

```shell
$ npx sequelize-cli db:seed:undo:all
```
