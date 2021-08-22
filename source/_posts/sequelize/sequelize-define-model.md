---
title: Sequelize 的 define model
date: 2018-09-24 12:12:03
tags:
- sequelize
categories:
- 技術心得
---
# Sequelize 的 define model

定義 table 與 model 的映射，使用 `sequelize.define()`
使用了 sequelize-cli 後， model 的寫法如下

**models/project.js**

```javascript=
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("project", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  })
}
```

## Sequelize Define 使用方式

Sequelize 將自動添加 `createdAt` 和 `updatedAt` 屬性

**語法**

```javascript
const attributes = {}
const config = {}
var myModel = sequelize.define('name', attributes, config)
```

回傳的是可以操作資料表的 `class` , 要取得資料表的實例化物件，可以用 `myModel.build()` 不過不是一般的用法

```javascript
myModel //class
myModel.build() //instance
```

## attributes

直接看示範

```javascript=
var Foo = sequelize.define('foo', {
  columnName: {
    type: Sequelize. < 欄位的資料型別 > ,
    //primary keys
    primaryKey: true,
    // 自動遞增 (incrementing) 整數 (type: Sequelize.INTEGER)
    autoIncrement: true,
    // 自訂義欄位名稱
    field: "field_with_underscores",
    // 欄位的預設值:
    defaultValue: Sequelize.NOW, //預設 目前時間 (type: Sequelize.DATE)
    defaultValue: true // 預設 true (type: Sequelize.BOOLEAN)
    // 允許 NULL: false
    allowNull: false,
    // 在 MySQL and PG 可以指定各別欄位的 comment
    comment: "I'm a comment!",
    // 獨一無二欄位 (unique)
    unique: true,// 此欄位是 unique, 複合式 unique, 要看下面的例子
  },
  // 複合式 unique
  uniqueOne: {
    type: Sequelize.STRING,
    unique: 'compositeIndex' // 同名
  },
  uniqueTwo: {
    type: Sequelize.INTEGER,
    unique: 'compositeIndex' // 同名
  },
  // 這是一種 unique 的縮寫方式
  someUnique: {
    type: Sequelize.STRING,
    unique: true
  }
  // unique 詳細的寫法，要另外寫一個 models 的 indexes 選項，並且將欄位填上
  {
    someUnique: {
      type: Sequelize.STRING
    }
  },
  {
    indexes: [{
      unique: true,
      fields: ['someUnique']
    }]
  },
})
```

### DataTypes

參考 [Data types](http://sequelize.readthedocs.io/en/v3/api/datatypes/)

**example: 列舉**

```javascript=
sequelize.define('model', {
  states: {
    type:   Sequelize.ENUM,
    values: ['active', 'pending', 'deleted']
  }
})
```

### Getter/Setter

在 `sequelize.define()` 裡，`attributes`, `config` 都可以定義 getter/setter

getter/setter 有兩種。

1. 可以映射成資料表欄位: protecting properties
1. 可以只當作 model 的屬性: pseudo properties
pseudo properties (不真實存在 database schema 的 attribute)。

> 注意: 同名屬性，後定義優先覆蓋前定義
要使用 ES6 的寫法實現。

在 name 裡定義 getter, 在 title 裡定義 setter
```javascript=
var Employee = sequelize.define('employee', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    get: function()  {
      var title = ;
      // 'this' instance of 資料庫資料
      return `${this.getDataValue('name')} (${this.getDataValue('title')})`;
    },
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    set: function(value) {
      this.setDataValue('title', value.toUpperCase());
    }
  }
});
```

:::info
使用時這樣使用

```javascript=
Employee
  .create({ name: 'John Doe', title: 'senior engineer' })
  .then(function(employee) {
    console.log(employee.get('name')); // John Doe (SENIOR ENGINEER)
    console.log(employee.get('title')); // SENIOR ENGINEER
})
```
:::


### 關聯 (foreign key)

在 sequelize 的 define 階段只要宣告 `hasOne` 這一類的 method 即可

```javascript
Foo.member.hasOne(Bar, {foreignKey: 'foo_id'})
```

## config

時間戳記可以單獨使用 (要先開，再指定是否要使用)

- 資料表
  - tableName: 自訂 table name
- 資料欄位
  - underscored (false): 是否全小寫欄位名稱
  - freezeTableName (true): 不改成複數型的 table name
  - comment (''): 欄位註解 (MYSQL, PG only)
- 自動生成欄位
  - timestamps (true): 是否加上 updatedAt, createdAt 欄位
    - createdAt: false or '自訂欄位名稱'
    - updatedAt: false or '自訂欄位名稱'
  - paranoid (false): 當 timestamps: true 時，是否加上 deletedAt
    - deletedAt: false or '自訂欄位名稱'

**example:**

```javascript=
var Bar = sequelize.define('bar', { /* attributes */ }, {
// 新增/修改 時間戳記
  timestamps: false,  // 自動加上 updatedAt, createdAt
  createdAt: false, //加上 createdAt
  updatedAt: 'updateTimestamp', // 加上 updatedAt as updateTimestamp
// 刪除 時間戳記 刪除不刪資料，而是記錄刪除時間
  paranoid: true,  // 加上 deletedAt 先 timestamps: true
  deletedAt: 'destoryTime', // 加上 deletedAt as destoryTime
// 欄位名稱
  underscored: true,  // 全小寫欄位名稱
  // so updatedAt will be updated_at
// 資料表名稱
  freezeTableName: true,  // 禁止改成複數型的 table name: 預設 true
  tableName: 'custom_table_name',  // table name
// Comment (MYSQL, PG only)
  comment: "I'm a table comment!",
  indexes: [
    // 建立不重複 index on email
    {
      unique: true,
      fields: ['email']
    },
    // Creates a gin index on data with the jsonb_path_ops operator
    {
      fields: ['data'],
      using: 'gin',
      operator: 'jsonb_path_ops'
    },
    // By default index name will be [table]_[fields]
    // Creates a multi column partial index
    {
      name: 'public_by_author',
      fields: ['author', 'status'],
      where: {
        status: 'public'
      }
    },
    // A BTREE index with a ordered field
    {
      name: 'title_index',
      method: 'BTREE',
      fields: ['author', {attribute: 'title', collate: 'en_US', order: 'DESC', length: 5}]
    }
  ]
})
```

### 擴充 model 的 methods

超重要，這一個部份是大部份的重要邏輯放置的做法。

Model 之所以重要，並不是因為它可以把 table 的欄位，當作 object 的 property 而已。而是因為它可以將屬於 table 的邏輯放在 model 上，就是這個功能。

v3 文件的寫法

```javascript=
var Bar = sequelize.define('bar', { /* attributes */ }, {
  //無效寫法 建議使用 v4 的寫法
  classMethods: {
    method1: function(){ return 'smth' }
  },
  //有效寫法
  instanceMethods: {
    method2: function() { return 'foo' }
  }
})
```

v4 文件的寫法 (ES6)

```javascript=
// Adding a class level method
Bar.classLevelMethod = function() {
  return 'foo';
};

// Adding an instance level method
Bar.prototype.instanceLevelMethod = function() {
  return 'bar';
};
```

初始化會執行 `sequelize-cli` 生成的 `associate` method 就是要在這裡處理。
它算是一種 class method (static function) 執行

```javascript=
var Bar = sequelize.define('bar', { /* attributes */ }, {
  //有效寫法
  instanceMethods: {
    method2: function() { return 'foo' }
  }
})

Bar.associate = function () {
  Foo.member.hasOne(Bar, {foreignKey: 'foo_id'})
}
```
