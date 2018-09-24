---
title: Sequelize 的 Relations/Associations
date: 2018-09-24 16:15:35
tags: [sequelize, 'sequelize-associations']
categories: 技術心得
---
# Sequelize 的 Relations/Associations

## migrations 關聯 (foreign key 欄位)

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

## define 關聯 類型
```
Model.hasOne(target: Model, options: object): HasOne
```

User model is **source**
Project model is **target**

**命名**
foreign key = (target model + primary key) 的名字
預設 `camelCase`。`underscored: true` 會變 `snake_case`。

### hasOne & belongsTo 一對一

一對一: one source with one target.

`.hasOne()` 在 target model 放上 key
`.belongsTo()` 在 source model 放上 key
```javascript
// Project 有一個 memberId 欄位，放 member 的 id
// target = member
Member.hasOne(Project)  // 擁有

// Member 有一個 projectId 欄位，放 project 的 id
// target = project
Member.belongsTo(Project) // 屬於
```

用 `hasOne` 會贈送 getter/setter

```javascript
Project.hasOne(models.member)

Project.findById(1)
.then(project => project.getMember) // function
Project.findById(1)
.then(project => project.setMember) // function
```

### foreign key & as

- foreignKey 的名字是給 database 用的
- as 的名字是給 getter/setter 用的
- targetKey 的名字是用來指定 foreignKey 儲存哪個欄位
	- 使用 `.belongsTo()` 時指定 foreignKey 只會增加這個欄位, 儲存 targetKey 指定的欄位
	- 使用 `.hasOne()` 時指定 targetKey 無效，增加預設 primary key 之外，還會加上 foreignKey 的欄位名稱

```javascript
options: {as: 'forJs'}
options: {foreignKey: 'forDb'}
```

看例子

```javascript
// Person 關聯自己
const Person = sequelize.define('person', { /* ... */})

Person.hasOne(Person, {as: 'Father', foreignKey: 'DadId'})
// this will add the attribute FatherId to Person
person.getFather()
person.setFather()
```

### `.hasMany()`  一對多

一對多: one source with multiple targets
(one target to one source)

```javascript=
Project.hasMany(User, {as: 'Workers'})
project.getWorkers
```

### `.belongsToMany()` 多對多

使用 `.belongsToMany()` 時，使用 `through` 指定事先定義好的 model-`UserProject` (用來產生 join table 用的)
這個 model 會有 `projectId` 和 `userId`。

- `Project` 會有 `getUsers`, `setUsers`, `addUser`, `addUsers`
- `User` 會有 `getProjects`, `setProjects`, `addPrject`, `addProjects`

```javascript=
UserProject = sequelize.define('user_project', {
  role: Sequelize.STRING
});
User.belongsToMany(Project, { through: UserProject });
Project.belongsToMany(User, { through: UserProject });
// through is required!

user.addProject(project, {
  through: { role: 'manager' }
});
```

## define 修改/刪除 hook

建立關聯，增加 foreign key 到屬性。
所有的關聯，更新用 `CASCADE` ，刪除用 `SET NULL` ，除了 n:m 關聯，用 `CASCADE` 刪除。

介於 users 和 task 的關聯，在 tasks 插入 `user_id` 的 foreign key ，標記參考來自 User 。
預設的情況，刪除 `user_id` 的話 `user_id` 將設定成 `NULL` ；更新 `user_id` 的話 `user_id` 會跟著更新。

可以在呼叫 association 時，設定 `onUpdate`, `onDelete` 選項。

可以設定這些值
主表 (無foreign key)
子表 (有foreign key)
若主表有 update/delete

1. `RESTRICT`, 同 `NO ACTION`
1. `CASCADE`, 同步 update/delete 更新子表 foreign key
1. `NO ACTION`, 不允許主表 update/delete
1. `SET DEFAULT`, 子表 foreign key 設為 default (Innodb not use)
1. `SET NULL`, 子表 foreign key 設為 null

```
Category.hasMany(models.Product, { onDelete: 'cascade' });
```
