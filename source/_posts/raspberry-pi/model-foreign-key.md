---
title: Raspberry Pi 4 的後端修鍊 (8) - migration 要 foreign key
date: 2023-09-12 23:53:33
tags:
- orm
- sequelize
- model
- foreign key
categories:
- 技術練習
---
# Raspberry Pi 4 的後端修鍊 (7) - migration 要 foreign key

## 「讀者」資料表

```sql
CREATE TABLE reader (
  id CHAR(10) NOT NULL,
  password VARCHAR(128),
  slack_id VARCHAR(50),
  line_id VARCHAR(50),
  phone CHAR(10),
  email VARCHAR(50),
  PRIMARY KEY (id),
  created_at DATETIME,
  updated_at DATETIME,
  creator_id INT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES user (id)
) ENGINE = InnoDB;
```

在加入之前，我想先增加 npm script 的區段，將常用的指令加上去

```json
  "scripts": {
    //...
    "new:table": "npx sequelize model:generate --underscored --force",
    "migrate": "npx sequelize db:migrate",
    "migrate:undo": "npx sequelize db:migrate:undo",
    //...
  },
```

接著輸入指令，訊息會印出原本的指令長怎樣。

```shell
$ npm run new:table -- --name reader --attributes password:string,slack_id:string,line_id:string,phone:string,email:string,creator:integer

> lib-backend@1.0.0 new:table
> npx sequelize model:generate --underscored --force --name reader --attributes password:string,slack_id:string,line_id:string,phone:string,email:string,creator:integer


Sequelize CLI [Node: 18.16.0, CLI: 6.6.1, ORM: 6.32.1]

New model was created at /home/admin/case/lib-backend/models/reader.js .
New migration was created at /home/admin/case/lib-backend/migrations/20230912142904-create-reader.js .
```

**migrations/20230912142904-create-reader.js**

- 修改表格名稱，readers -> reader (讓它與真正生成的表格名稱相同)

```javascript
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reader', {
      id: {
        allowNull: false,
        autoIncrement: false, // 不自動跳號
        primaryKey: true,
        type: Sequelize.CHAR(10)  // 身份證字號
      },
      password: {
        type: Sequelize.STRING(128),
        defaultValue: '000', // 加入預設值
      },
      slack_id: {
        type: Sequelize.STRING(50)
      },
      line_id: {
        type: Sequelize.STRING(50)
      },
      phone: {
        allowNull: false,
        type: Sequelize.CHAR(10)
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      creator_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        // foreign key 的設定
        references: {
          model: 'user',
          key: 'id'
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reader');
  }
};
```

**models/reader.js**

```javascript
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reader extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  reader.init({
    id: DataTypes.CHAR(10),
    password: DataTypes.STRING,
    slack_id: DataTypes.STRING,
    line_id: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    creator_id: {
      DataTypes: DataTypes.INTEGER,
      references: {
        // This is a reference to another model
        model: user,  
        // This is the column name of the referenced model
        key: 'id',
      }
    },
  }, {
    sequelize,
    modelName: 'reader',
    underscored: true,
    freezeTableName: true, // 請手動加入這一行
  });
  return reader;
};
```

## 想要知道的問題

- 預設值 DefaultValue 應該加在哪？migration？model？都加？
- foreign key 的設定 怎麼加？

## 執行 migrate

```shell
$ npm run migrate

> lib-backend@1.0.0 migrate
> npx sequelize db:migrate


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
== 20230912142904-create-reader: migrating =======
Executing (default): CREATE TABLE IF NOT EXISTS `reader` (`id` CHAR(10) NOT NULL , `password` VARCHAR(128) DEFAULT '000', `slack_id` VARCHAR(50), `line_id` VARCHAR(50), `phone` CHAR(10) NOT NULL, `email` VARCHAR(50) NOT NULL, `creator_id` INTEGER NOT NULL, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`)) ENGINE=InnoDB;
Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'SequelizeMeta' AND TABLE_SCHEMA = 'good_ideas_lib_dev'
Executing (default): SHOW INDEX FROM `SequelizeMeta`
Executing (default): INSERT INTO `SequelizeMeta` (`name`) VALUES (?); "20230912142904-create-reader.js"
== 20230912142904-create-reader: migrated (0.060s)
```

```sql
CREATE TABLE IF NOT EXISTS `reader` (
  `id` CHAR(10) NOT NULL , 
  `password` VARCHAR(128) DEFAULT '000', 
  `slack_id` VARCHAR(50), 
  `line_id` VARCHAR(50), 
  `phone` CHAR(10) NOT NULL, 
  `email` VARCHAR(50) NOT NULL, 
  `creator_id` INTEGER NOT NULL, 
  `created_at` DATETIME NOT NULL, 
  `updated_at` DATETIME NOT NULL, 
  PRIMARY KEY (`id`), 
  FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB;
```

比對一下原本想要的 SQL，除了後來覺得需要加的部份，其餘果然和原本想的一模一樣。讚！

```sql
CREATE TABLE reader (
  id CHAR(10) NOT NULL,
  password VARCHAR(128),
  slack_id VARCHAR(50),
  line_id VARCHAR(50),
  phone CHAR(10),
  email VARCHAR(50),
  PRIMARY KEY (id),
  created_at DATETIME,
  updated_at DATETIME,
  creator_id INT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES user (id)
) ENGINE = InnoDB;
```

## 執行後才知道錯

寫了一個程式使用 model

```javascript
const { Sequelize, DataTypes } = require('sequelize');

async function main() {
  const development = {
    //...
  }
  // Option 3: Passing parameters separately (other dialects)
  const sequelize = new Sequelize(...);
                                  
  // 引用參考 (不用管順序)
  require('./models/reader')(sequelize, DataTypes);
  require('./models/user')(sequelize, DataTypes);
  
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  
  try {
    const chris = await sequelize.models.user.create({ name: 'chris', password: 'chris' });
    await sequelize.models.reader.create({
      name: 'mary',
      phone: '0987654321',
      email: 'mary@gmail.com',
      creator_id: chris.id,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
    
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.log(error.message);
  }
}
main()
```

執行之後，各種錯誤，再重新修改 model 的表示方式。

**models/user.js**

```javascript
// ...
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    // ...
  }
  user.init({
    // 加上 id 的定義，要給別人 reference 成 foreign key 用的
    id: {
      type: DataTypes.INTEGER, // 型別要正確
      primaryKey: true  // 要設定 primaryKey: true
    },
    name: DataTypes.STRING(50),
    password: DataTypes.CHAR(128)
  }, {
    // ...
  });
  return user;
};
```

**models/reader.js**

```javascript
'use strict';
const {
  Model
} = require('sequelize');
const user = require('./user'); // 為了 foreign keys
module.exports = (sequelize, DataTypes) => {
  class reader extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  reader.init({
    // 加上 id 的定義，要給別人 reference 成 foreign key 用的
    id: {
      type: DataTypes.CHAR(10), // 型別要正確
      primaryKey: true // 要設定 primaryKey: true
    },
    password: DataTypes.STRING,
    slack_id: DataTypes.STRING,
    line_id: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    creator_id: {
      type: DataTypes.INTEGER,
      // foreign keys 的設定
      references: {
        // This is a reference to another model
        model: user,  
        // This is the column name of the referenced model
        key: 'id',
      }
    },
  }, {
    sequelize,
    modelName: 'reader',
    underscored: true,
    freezeTableName: true, // 請手動加入這一行
  });
  return reader;
};
```

設定之後，執行

```shell
$ node main.js 
Executing (default): SELECT 1+1 AS result
Executing (default): INSERT INTO `user` (`id`,`name`,`password`,`created_at`,`updated_at`) VALUES (?,?,?,?,?); null, "chris", "chris", "2023-09-12 15:29:09", "2023-09-12 15:29:09"
Executing (default): INSERT INTO `reader` (`id`,`phone`,`email`,`creator_id`,`created_at`,`updated_at`) VALUES (?,?,?,?,?,?); null, "0987654321", "mary@gmail.com", null, "2023-09-12 15:29:09", "2023-09-12 15:29:09"
Column 'id' cannot be null
```

修改一下 **main.js**

```javascript
await sequelize.models.user.create({ name: 'chris', password: 'chris' });

// 要將 user 的資料從資料庫再撈一次，才會是包含所有在資料庫裡的內容。而不是只有在 JS 出現的而已。
const chris = await sequelize.models.user.findOne({
  where: { name: 'chris' }
})

const mary = await sequelize.models.reader.create({
  id: 'E123456789',
  name: 'mary',
  phone: '0987654321',
  email: 'mary@gmail.com',
  creator_id: chris.id,
  created_at: Date.now(),
  updated_at: Date.now(),
});

console.log('mary.password', mary.password)
```

```shell
$ node main.js 
Executing (default): SELECT 1+1 AS result
Executing (default): INSERT INTO `user` (`id`,`name`,`password`,`created_at`,`updated_at`) VALUES (?,?,?,?,?); null, "chris", "chris", "2023-09-12 15:41:46", "2023-09-12 15:41:46"
Executing (default): SELECT `id`, `name`, `password`, `created_at` AS `createdAt`, `updated_at` AS `updatedAt` FROM `user` AS `user` WHERE `user`.`name` = 'chris' LIMIT 1;
Executing (default): INSERT INTO `reader` (`id`,`phone`,`email`,`creator_id`,`created_at`,`updated_at`) VALUES (?,?,?,?,?,?); "E123456789", "0987654321", "mary@gmail.com", 18, "2023-09-12 15:41:46", "2023-09-12 15:41:46"
mary.password undefined
Connection has been established successfully.
```

可以發現 mary.password 是 `undefined` 也是相同的道理。

改一下 Model 的 password，加上 DefaultValue ，其實也是一樣的結果。

## 心得

Model 主要還是 JS 餵進去的資料為新增時回傳的物件。
並不會依照資料庫 (或 Model) 的預設值而自動幫你加上去，id 也是
除非在新增完之後，再從資料庫撈一次，該在資料表上的內容就會出現在 JS 物件中了。

而 sequelize 在 Model 上可以設定 DefaultValue 的設定，是為了搭配 `.sync()` 吧？從 Model 新增 Table 的方式。

## 尚未做的

未設定 Model 之間的關聯性

所以 `console.log(mary.toJSON())` 印出來的 mary 會是這樣

```javascript
{
  id: 'E123456789',
  phone: '0987654321',
  email: 'mary@gmail.com',
  creator_id: 19,
  updatedAt: 2023-09-12T15:48:58.828Z,
  createdAt: 2023-09-12T15:48:58.828Z
}
```
