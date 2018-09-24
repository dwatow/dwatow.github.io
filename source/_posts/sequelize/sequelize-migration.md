---
title: Sequelize Migration
date: 2018-09-24 14:53:11
tags: [sequelize]
categories: 技術心得
---
# Sequelize Migration

Sequelize 2 之後，增加了 cli 的功能
透過一次又一次的維護檔，確保移植時有相同的建構過程

migration 就是拿來變動資料表的。
所以，會有幾種動作在這裡處理。

- 變動資料表
- 變動欄位
- 變動資料表關聯

## 指令

要新增一次的 migration ，只要下這個指令，並且想好 migration message 。

```shell
$ sequelize migration:create --name <migration message>
```

就會產生檔案 `migrations/20180703032321-<migration message>.js`

```shell
sequelize db:migrate
```

執行檔案裡的 `up()`

```shell
sequelize db:migrate:undo
```

執行檔案裡的 `down()`


## 檔案架構

function `up`, `down` ，都回傳 promise

```javascript=
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 要增加內容的動作
  },

  down: (queryInterface, Sequelize) => {
    // 要減少內容的動作
  }
};
```

下面來介紹一下，`up()` 和 `down()` 裡面要怎麼寫

## 資料表 & 資料表欄位

[參考 attribute, options 用法](http://docs.sequelizejs.com/class/lib/model.js~Model.html#static-method-init)

### createTable

Create a table with given set of attributes

```javascript=
QueryInterface.createTable(
  tableName: String,
  attributes: Object,
  options: Object,
  model: Model
)
```
回傳: Promise

### addColumn

Add a new column into a table
```javascript=
QueryInterface.addColumn(
  table: String,
  newAttributeName: String,
  attribute: Object,
  options: Object
)
```
回傳: Promise

### changeColumn

Change a column definition

```javascript=
QueryInterface.changeColumn(
  tableName: String,
  attributeName: String,
  dataTypeOrOptions: Object,
  options: Object
)
```
回傳: Promise

### removeColumn

Remove a column from table

```javascript=
QueryInterface.removeColumn(
  tableName: String,
  attributeName: String,
  options: Object
)
```
回傳: Promise

### addIndex

Add index to a column

```javascript=
QueryInterface.addIndex(
  tableName: String,
  options: Object
)
```
回傳: Promise

### removeIndex

Remove an already existing index from a table

```javascript=
QueryInterface.removeIndex(
  tableName: String,
  indexNameOrAttributes: String,
  options: Object
)
```
回傳: Promise

### addConstraint

Add constraints to table

```javascript=
QueryInterface.addConstraint(
  tableName: String,
  attributes: Array,
  options: Object
)
```
回傳: Promise

### removeConstraint

```javascript=
QueryInterface.removeConstraint(
  tableName: String,
  constraintName: String,
  options: Object
)
```
回傳: Promise

## 資料表關聯

在 queryInterface.createTable / addColumn 中，在 attributes 定義欄位的物件中，寫 reference 決定資料庫變動後，關聯是否存在。

```javascript=
return queryInterface.addColumn(
  'tableName',
  'fieldName',
  {
    type: Sequelize.INTEGER.UNSIGNED,
    references: {
      model: 'tableName',
      key: 'fieldName'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
    //...
  })
},
```

### Hook

當呼叫 add/set 函數時，beforeUpdate/afterUpdate 也會執行
唯一可以執行 beforeDestroy/afterDestroy 的方式，就是設定 associations 屬性 onDelete: 'cascade'
參考: http://docs.sequelizejs.com/manual/tutorial/hooks.html


呼叫 association 時，設定 hook 選項 ex: `onUpdate`, `onDelete`。
預設所有的關聯，更新用 `CASCADE` ，刪除用 `SET NULL` ，除了 n:m 關聯，用 `CASCADE` 刪除。

1. `RESTRICT`, 同 `NO ACTION`
1. `CASCADE`, 同步 update/delete 更新子表 foreign key
1. `NO ACTION`, 不允許主表 update/delete
1. `SET DEFAULT`, 子表 foreign key 設為 default (Innodb not use)
1. `SET NULL`, 子表 foreign key 設為 null

### Available constraints:

- UNIQUE
- DEFAULT (MSSQL only)
- CHECK (MySQL - Ignored by the database engine )
- FOREIGN KEY
- PRIMARY KEY

UNIQUE

```javascript=
queryInterface.addConstraint('Users', ['email'], {
  type: 'unique',
  name: 'custom_unique_constraint_name'
});
```

CHECK

```javascript=
queryInterface.addConstraint('Users', ['roles'], {
  type: 'check',
  where: {
     roles: ['user', 'admin', 'moderator', 'guest']
  }
});
```
Default - MSSQL only

```javascript=
queryInterface.addConstraint('Users', ['roles'], {
   type: 'default',
   defaultValue: 'guest'
});
```
Primary Key

```javascript=
queryInterface.addConstraint('Users', ['username'], {
   type: 'primary key',
   name: 'custom_primary_constraint_name'
});
```
Foreign Key

```javascript=
queryInterface.addConstraint('Posts', ['username'], {
  type: 'foreign key',
  name: 'custom_fkey_constraint_name',
  references: { //Required field
    table: 'target_table_name',
    field: 'target_column_name'
  },
  onDelete: 'cascade',
  onUpdate: 'cascade'
});
```
