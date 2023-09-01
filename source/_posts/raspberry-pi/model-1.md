---
title: Raspberry Pi 4 的後端修鍊 (7) - Model
date: 2023-09-01 13:09:29
tags:
- Raspberry Pi 4
- sequelize
- model
categories:
- 技術練習
---
# Raspberry Pi 4 的後端修鍊 (7) - Model

建立資料表，會同時產生 migration 與 model 兩個檔案。
在生成 Table 的 SQL 正確之前，先不要管 Model 一直到生成 Table 的 SQL 正確為止。
正確生成 Table (資料表)之後，Model 的任務就是要正確的操作資料，並且將資料的操作邏輯收納到 Model 上面。

接續上一篇的篇章，只是這一次把注意力放在 Model 上面

## 建立資料表[^create-table][^data-type]

[^create-table]: [Creating the first Model (and Migration)](https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-model-and-migration)

[^data-type]: [Data Types, Model Basics | Sequelize](https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types)

```shell
$ npx sequelize model:generate --underscored --force --name user --attributes name:string,password:string

Sequelize CLI [Node: 18.16.0, CLI: 6.6.1, ORM: 6.32.1]

New model was created at /home/admin/case/lib-backend/models/user.js .
New migration was created at /home/admin/case/lib-backend/migrations/20230803111707-create-user.js .
```

- `--name` 定義資料表名稱，建議使用小寫。
- `--underscored` 欄位名稱都用`小寫`+`底線` 命名
- `--force` 命名強制相同，不要有單複數 (在此都用單數)

> 在此要注意一下，產生的 model 是不是也是和我這次練習的 v6 版本一樣對於 `force` 沒有反應

sequelize 會產生下面原始碼

**專案/migrations/20230803090103-create-user.js**

(migrations 有提到修正方式，在此略過)

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
$ npx sequelize model:generate --underscored --force --name user --attributes name:string,password:string
```

取得 model 的程式碼時。
別忘了需要手動修改一下資料型別。
修改 **models/user.js** 的 DataType

```javascript
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    // ...
  }
  user.init({
    name: DataTypes.STRING(50),
    password: DataTypes.CHAR(128)
  }, {
    sequelize,
    modelName: 'user',
    underscored: true,
    freezeTableName: true, // 請手動加入這一行
  });
  return user;
};
```

- 變動字串長度要修改，直接加(`Sequelize.STRING(長度)`)[^Data-Types-String]
- 想要長度 128 的固定字串，要改成 `Sequelize.CHAR(128)`

[^Data-Types-String]: [Model Basics | Sequelize, Data Types, String](https://sequelize.org/docs/v6/core-concepts/model-basics/#strings)

這樣就大功告成了。

> 想不到這些型別的微調需要搞這麼久。

## models 結構

這一個部份，就是在 JS 裡取得 TABLE 資料的部份，型別定義我目前猜測是為了要檢查是否有格式錯誤的第一道欄位驗證判斷。在進 SQL 之前就可以先判斷的一個地方 (吧？)

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
    // 欄位 (預設不會在程式控制 id, created_at, updated_at 所以沒有在這列出)
    // 如果有自定義的 method, v6 是定義成欄位 getter/setter 與 虛擬欄位的 getter/setter
  }, {
    sequelize,
    // 設定
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
    // 欄位 (預設不會在程式控制 id, created_at, updated_at 所以沒有在這列出)
  }, {
    sequelize,
    // 設定
  });
  return user;  // 之後可以在 sequelize.models.user 取得這個 Model
};
```
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

async function main() {
  const development = {
    "username": "admin",
    "password": "pi",
    "database": "good_ideas_lib_dev",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
  // Option 3: Passing parameters separately (other dialects)
  const sequelize = new Sequelize(development.database, development.username, development.password, development);
  require('./models/user')(sequelize, DataTypes);
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  try {
    // 練習貼在這
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.log(error.message);
  }
}
main()
```

```shell
$ node main.js 
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
```

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
Connection has been established successfully.
```

其中這一段是 SQL

```sql
INSERT INTO `user` (`id`,`name`,`password`,`created_at`,`updated_at`) VALUES (?,?,?,?,?);
```

### log 的內容出現 `?` 

[^sequelize-log-not-content]: [使用egg-sequelize的问题，sql语句中的问号 #4079](https://github.com/eggjs/egg/issues/4079)

在 main.js 裡的 config 要加上 `logQueryParameters:true` 的設定。

> 如果是一般的執行情境，要改 config 裡的 json 檔案比較一致。只是在此的語法練習都是在 main.js 進行 sequelize 的初始化，所以才直接改 main.js 裡的 config 物件。

config 加完之後，刪除新增好的資料，再執行一次 `main.js`。

```shell
$ node main.js 
Executing (default): SELECT 1+1 AS result
Executing (default): INSERT INTO `user` (`id`,`name`,`password`,`created_at`,`updated_at`) VALUES (?,?,?,?,?); 1, "chris", "chris", "2023-09-01 03:28:36", "2023-09-01 03:28:36"
Connection has been established successfully.
```

看起來是把新增的資料加在原本的 SQL 後面。

### method

如果要自己加上 method 有兩種做法。

**models/user.js**

`sequelize.define`

```javascript
'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    getSomething: {
      type: DataTypes.VIRTUAL,
      get() {
        return 'getSomething method: ' + this.name;
      },
    }
  }, {
    sequelize,
    // 設定
  });
};
```

ES6 class

```javascript
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    getSomething() {
      return 'getSomething method: ' + this.name
    }
    static associate(models) {
      return 'associate'
    }
  }
  user.init({
    // 欄位
  });
  return user;
};
```

> 棄用: `getterMethods` and `setterMethods`
> DANGER
> This feature has been removed in Sequelize 7. 
> You should consider using either VIRTUAL attributes or native class getter & setters instead.

**main.js**

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
newUser getSomething method: chris
User associate
Connection has been established successfully.
```

可以看見，如實的印出了 method 裡的字串，也透過 method 的 this 取得了實例的資料。

```
newUser getSomething method: chris
User associate
```

## model 的欄位驗證

### name 過長

```javascript
    const name = Array(51).fill('A').join('');
    const password = Array(129).fill('A').join('');
    await sequelize.models.user.create({ name, password })
```

```shell
$ node main.js 
Executing (default): SELECT 1+1 AS result
Executing (default): INSERT INTO `user` (`id`,`name`,`password`,`created_at`,`updated_at`) VALUES (DEFAULT,?,?,?,?); "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "2023-09-01 03:45:09", "2023-09-01 03:45:09"
Data too long for column 'name' at row 1
```

會出現精準的錯誤訊息
但是會出現第一個錯誤訊息，不會一次吐全部
