---
title: Sequelize 資料寫入
date: 2018-09-24 21:56:27
tags: [Sequelize, CRUD]
categories: '技術心得'
---

# Sequelize 資料寫入

## Create

`Module.build(options: Object)`

回傳一個 instance
欄位放預設值 + 產生 instance

```javascript=
// define the model
var Task = sequelize.define('task', {
  title: Sequelize.STRING,
  rating: {
    type: Sequelize.STRING,
  defaultValue: 3
  }
})

// now instantiate an object
var task = Task.build({title: 'very important task'})

task.title  // ==> 'very important task'
task.rating // ==> 3 (default)
```

`Instance.save(options: Object)`

回傳 Promise
儲存至 table

```javascript=
// you can also build, save and access the object with chaining:
Task.build({ title: 'foo', description: 'bar', deadline: new Date() })
.save().then(function(user) {
  console.log(user.get({
    plain: true
  }))
})
```


`Model.create(options: Object)`
回傳 Promise
新增一筆資料至 table

`build` + `save` = `create`

```javascript=
Task.create({ title: 'foo', description: 'bar', deadline: new Date() }).then(function(user) {
  console.log(user.get({
    plain: true
  }))
})
```

## Update

```javascript=
// way 1
task.title = 'a very different title now'
task.save().then(function() {})

// way 2
task.update({
  title: 'a very different title now'
}).then(function() {})
```

## Delete

`Model.destroy(options: Object)`
回傳 `Promise`

```javascript=
Task.create({ title: 'a task' }).then(function(task) {
  return task.destroy();
}).then(function(deleted_object) {
  console.log(deleted_object)  //剛剛刪掉的資料
})
```

在 `Model.define()` 裡設定 `paranoid: true` 時，執行 `instance.destroy()` 則會執行「寫入刪除時間」，執行 `instance.destroy({force: true})` ，就會真的刪掉這筆資料，從資料庫蒸發

# 批次處理
一次多筆 create/update/delete

## 大量新增

create: `Model.bulkCreate([{}])` 回傳值不要使用

```javascript=
models.member.bulkCreate([{ name: 'John Doe', age: 20},
  { name: 'Chris Doe', age: 22},
  { name: 'Mary Doe', age: 24}
]).then(result => {
  console.log(JSON.stringify(result)); // id: null in everyone
  return models.member.findAll();
})
```

## 大量修改，加 WHERE
update: `Model.update(update: Object, where: Object)` 回傳 符合條件被修改的資料總數

```javascript=
models.member.update(
	/* set attributes' value */
    { age: 18 },
	/* condition for find*/
    { where: { name: 'Mary Doe' }}
).spread(function(result) {
  console.log(result);  // result 1
})
```

## 大量刪除(，加 WHERE)
delete: `Model.destory()`

```javascript=
models.project.destroy({
  where: {
    location: 'Tainan'
  },
  truncate: true
}).then(function(result) {
  console.log(result);
  // Notice
  // affectedCount will be 2
})
```

> **options.truncate** (optional)
Type: Boolean
default: false
description: 如果設定 true，支援 `TRUNCATE` 的 SQL 就會使用 `TRUNCATE` (快) 而不是 `DELETE FROM` (慢)
實際使用的狀況: 刪除資料表裡所有資料，忽略 where，再加入的資料 id 重數

## Value of an instance

instance 的樣貌 (類似 JSON 的樣子)
```javascript
john.get({
  plain: true
})
```

`instance.reload()` 值同步: table → model

遞增

`instance.increment('fieldName')`
`instance.increment('fieldName', {by: 2})`
`instance.increment(['fieldName1', 'fieldName2'])`
`instance.increment({
  'fieldName1': 2,
  'fieldName2': 3
})`

遞減

`instance.decrement()` 用法同上
