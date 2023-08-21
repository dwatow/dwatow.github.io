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

資料表 複數
Model 單數

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

並且直接生成 Model (麻豆)

**專案/models/user.js**

```javascript
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
```

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

```javascript
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
    underscored: true,
    freezeTableName: true, // 請手動加入這一行
  });
  return user;
};
```

## migrations 結構

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

## models 結構

除了生成的 ES6 class 可以使用，還有另一個比較舊的寫法 `sequelize.define` 也可以使用。
`sequelize.define` 與 `user.init` 在內部是相同的。

sequelize.define 寫法

```javascript
'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    name: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
    underscored: true,
    // freezeTableName: true, // 請手動加入這一行
  });
};
```

ES6 class 寫法

```javascript
'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    // 在此不要放置任何與資料相關的欄位定義，會覆蓋掉可存取資料的同名 getter/setter
    
    // 放置了自訂義的 method
    // 用在 object user 上的 method
    getSomething() {
      return 'something is ' + this.id;
    }
    
    // 用在 class user 上的 method
    static associate(models) {
      return 'associate at static';
    }
  }
  user.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
    underscored: true,
    // freezeTableName: true, // 請手動加入這一行
  });
  return user;  // 之後可以在 sequelize.models.user 取得這個 Model
};
```

到目前，還沒有生成任何資料表，讓我們來執行一下

```shell
$ npx sequelize-cli db:migrate
```

就可以透過 TablePlus 這種資料庫管理工具看見新增一個資料表囉
(當然透過 mycli ，再輸入 `SHOW TABLES;` 也可以看見唷)

## 使用 Model

> 在這裡看官網文件會有一點搞不懂，Model 都宣告了，但是要怎麼讓它在 `sequelize.models.user` 出現。

官網上的文件這樣宣告 `const user = new User({ id: 1 });` 
就直接拿來用？！(神奇！)

```javascript
// Valid
class User extends Model {
  otherPublicField;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
}, { sequelize });

const user = new User({ id: 1 });
user.id; // 1
```

但實際上，我使用 sequelize-cli 生成的 code 無法直接這麼用。

我另外寫了一個 main.js 來實現官網說的情況

**main.js**

```javascript
const { Sequelize, DataTypes } = require('sequelize');

// const db = require('./models')
// const { sequelize } = db;

const development = {
  "username": "admin",
  "password": "pi",
  "database": "good_ideas_lib_dev",
  "host": "127.0.0.1",
  "dialect": "mysql"
}

// 連結資料庫
const sequelize = new Sequelize(development.database, development.username, development.password, development);

// 宣告 Model
const user = require('./models/user')
user(sequelize, DataTypes);

// 主程式
function main() {
  try {
    await sequelize.authenticate();
    const newUser = new sequelize.models.user({ id: 1 });
    console.log('User', newUser.id);
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
main()
```

```shell
$ node main.js 
Executing (default): SELECT 1+1 AS result
User 1
Connection has been established successfully.
```

> **重要**
> 到目前為止，資料庫都還沒有增加資料，程式碼裡的 newUser 也只是還在記憶體裡的一筆資料而已。尚未寫入資料庫。

## 簡單操作

### 寫入

在 newUser 被 `new` 出來之後，執行 `save()`。

```javascript
async function main() {
  // ...
  const newUser = new sequelize.models.user({ id: 1, name: 'chris', password: 'chris'})
  await newUser.save();
  // ...
}
```

可以看見執行的過程中，會印出執行過程

```shell
$ node main.js 
Executing (default): SELECT 1+1 AS result
Executing (default): INSERT INTO `user` (`id`,`name`,`password`,`created_at`,`updated_at`) VALUES (?,?,?,?,?);
User 1
Connection has been established successfully.
```

其中這一段是 SQL

```sql
INSERT INTO `user` (`id`,`name`,`password`,`created_at`,`updated_at`) VALUES (?,?,?,?,?);
User 1
```

### method


```javascript
async function main() {
  // ...
  const newUser = new sequelize.models.user({ id: 1, name: 'chris', password: 'chris'})
  console.log('newUser', newUser.getSomething());
  console.log('User', sequelize.models.user.associate());
  // ...
}
```

```shell
$ node main.js 
Executing (default): SELECT 1+1 AS result
newUser something is 1
User associate at static
Connection has been established successfully.
```

### 不建議使用的指令

```javascript
User.sync() // 同步(新增)，和 migration 效果一樣，但是沒有留下版本記錄，不建議使用。
User.drop() // 刪除資料表
```

