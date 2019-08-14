---
title: Sequelize 資料讀取
date: 2018-09-24 21:53:14
tags: 
- Sequelize
- CRUD
categories: 
- 技術心得
---

# Sequelize 資料讀取

使用者需求 -> 搜尋的功能
要盡可能的多熟悉

## Module.find()

找一個有兩種方式，使用時要考慮資料表「尋找唯一值」的最小條件。

- `findOne(options: Object)`
- `findById(id: String)`

```javascript
model.findById(id).then(function(object) {
  //找到 model.id = id
})
```

```javascript
model.findOne({
  where: {}, // where 條件
  attribute: []  //指定回傳欄位
}).then(function(object) {
  //找到 model.id = id
})
```

## Module.findOrCreate(options: Object)

找不到就建立一個，使用時要注意 `allowNull:false` 並給予適合的預設值

`.findOrCreate()` = `.findOne()` || `.create()`

```javascript
User.findOrCreate({
  where: {username: 'sdepold'},
  defaults: {job: 'Technical Lead JavaScript'}
})
.spread(function(user, created) {
  console.log(user.get({plain: true})) // true 當作普通物件回傳
  console.log(created)
})
/*{
  username: 'sdepold',
  job: 'Technical Lead JavaScript',
  id: 1,
  createdAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET),
  updatedAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET)
}
created: true */
```

[`public get(key: String, options: Object): Object | any` => `user.get({plain: true})`](http://docs.sequelizejs.com/class/lib/model.js~Model.html) key = (虛擬)欄位名稱

## Module.findAll(options: Object)

找一堆，使用時要注意條件太少時，資料是否海量 (影響效能)

`.findAll()` 縮寫 `.all()`

```javascript=
Project.findAll().then(function(projects) {
  // typeof projects = []
})
Project.findAll({
  where: { name: 'A Project' } // name = '...'
}).then(function(projects) {/*...*/})

Project.findAll({
  where: { id: [1,2,3] } //id = 1, 2 or 3
}).then(function(projects) {})
```

### where 物件的條件

```javascript
options: {
  where: {/*寫在這*/}
}
```

[v3 寫法 - findAll - Search for multiple elements in the database](http://sequelize.readthedocs.io/en/v3/docs/models-usage/)
[v4 寫法 - findAll - Search for multiple elements in the database](http://docs.sequelizejs.com/manual/tutorial/models-usage.html)

邏輯包含下面這些

- attribute
	- id != 20
	- AND (a = 5), OR (a = 5 || a = 6)
	- id > 6, id >= 6
	- id < 10, id <= 10
	- BETWEEN 6 AND 10, NOT BETWEEN 11 AND 15
	- IN [1, 2], NOT IN [1, 2]
	- LIKE '%hat', NOT LIKE '%hat'
- attribute (PG only)
	- && [1, 2] (PG array overlap operator)
	- @> [1, 2] (PG array contains operator)
	- <@ [1, 2] (PG array contained by operator)
	- ILIKE '%hat' (case insensitive)  (PG only)
	- NOT ILIKE '%hat'  (PG only)
	- ANY ARRAY[2, 3]::INTEGER (PG only)
- status
	- status NOT FALSE

### 用關聯過濾

找尋 3 個有 `Profile` 的 `User`

```javascript=
//在 define 後加上
User.hasMany(Profile, {foreignKey: 'owner'})

//搜尋時，才可以透過搜尋
User.findAndCountAll({
  include: [
     { model: Profile, where: { active: true }}
  ],
  limit: 3
}).then(result => {
  result.rows.forEach(item => {
    console.log(item.name)
  })
});
```

### 分頁 limit, offset, 排序 order, 群組 group

四個參數都要放在 options 裡使用

- `limit` 每頁數
- `offset` 略過多少筆 (limit * index)
- `group` 群組
- `order` 排序
	- ASC 小至大 (正序)
	- DESC 大至小 (反序)

```javascript
options: {
  where: {/*...*/},
  limit: n,
  offset: n,
  order: 'title DESC',
  group: 'field'
}
```

## Module.max({}), .min({}), .sum({}), .count({})

四個 SQL 運算 methods 參數都是 `options: Object`

假設，資料表資料如下

|id|age|
|-|-|
|1|10|
|2|5|
|3|40|

### max

```javascript=
Project.max('age', {
  where: {
    age: {lt: 20} //age < 20
  }
}).then(function(max) {/*will be 10*/})
```

### min

```javascript=
Project.min('age', {
  where: {
    age: { $gt: 5 } //age > 5
  }
}).then(function(min) {/*will be 10*/})
```

### sum

```javascript=
Project.sum('age', {
  where: {
    age: { $gt: 5 }
  }
}).then(function(sum) {/*will be 50*/})
```

### count

```javascript=
Project.count({
  where: {}
}).then(function(count) {/*0*/})
```

## Module.findAndCountAll(options: Object)
一堆與總數 = 分頁

`findAndCountAll` = `findAll` + `count`

options 加上這兩個 property

- `limit` (每頁數)
- `offset` (略過多少筆 limit * index)

成功時會回傳

- `count` 匹配條件的總數
- `raw` 一個 Array 裝著符合條件的物件

```javascript=
var result = await Code.findAndCountAll({
  where: {
    title: {
	  $like: 'foo%'
    }
  },
  limit: 2,  //每頁幾個
  offset: 10 //跳過幾個 = limit * index
}).then(function(result) {
  console.log(result);
});
/* {
  "count": 13,
  "rows": [{
    "id": 11,
    "name": "",
  }, {
    "id": 12,
    "name": "
  }]
} */
```

## Eager loading 資料的關聯一起查出來

關聯一起查 = Eager loading
`Model.`(`find()` or `findAll()`) + `include`

假設資料庫 關聯長這樣

Tool n--1 User 1--n Task

```javascript=
var User = sequelize.define('user', { name: Sequelize.STRING })
  , Task = sequelize.define('task', { name: Sequelize.STRING })
  , Tool = sequelize.define('tool', { name: Sequelize.STRING })

Task.belongsTo(User)
User.hasMany(Task)
User.hasMany(Tool, { as: 'Instruments' })

sequelize.sync().then(function() {
  // this is where we continue ...
})
```

這樣查詢可以找出關聯內容

```javascript=
Task.findAll({
  include: [ User ]
}).then(function(tasks) {
  console.log(JSON.stringify(tasks))
  // like tasks.get({plain: true}
})
/*
[{
  "name": "A Task",
  "id": 1,
  "createdAt": "2013-03-20T20:31:40.000Z",
  "updatedAt": "2013-03-20T20:31:40.000Z",
  "userId": 1,
  "user": {
    "name": "John Doe",
    "id": 1,
    "createdAt": "2013-03-20T20:31:45.000Z",
    "updatedAt": "2013-03-20T20:31:45.000Z"
  }
}]
*/
```

使用別名，別名要指定在 `include` 裡，而且回傳的結構會使用別名當欄位名稱

```javascript=
options: {
  include: [{
    model: User,
	as: 'Instruments',
	/*...*/
  }]
}
```

包含所有關聯

```javascript=
options: {
  include: [{
    all: true
  }]
}
```

包含所有關聯 + 包含有刪除記錄(已刪除)

```javascript=
options: {
  include: [{
    all: true,
	paranoid: true // query and loads the soft deleted records
  }]
}
```

### 多層關聯

```javascript=
options: {
  include: [{  //第一層
    model: Tool, as: 'Instruments',
    include: [{  //第二層
      model: Teacher,
      include: [ /* etc */]  //第三層
    }]
  }]
}
```

## `attributes` 指定回傳欄位

在 options 陣列，給欄位字串，可指定回傳資料欄位

```javascript=
options: {
  attribute: [strField, ...]
}
```

### 欄位使用別名

Query 的結果欄位，想要用 SQL 運算 (一定要再取個別名)

```sql
SELECT ..., COUNT(strField2) AS renameField, ...
```
```sql
SELECT ..., strField2 AS renameField, ...
```

1. 用巢狀 Array 結構取別名
	- attribute Array 的元素，也要用 Array
2. 使用 aggregation function 呼叫 SQL 運算
	- **aggregation function**:  `sequelize.fn('COUNT', sequelize.col('strField2'))`

3. 不使用 SQL 運算，直接用 `strField2` 字串，也可以取別名

```javascript
strField = sequelize.fn('COUNT', sequelize.col('strField2'))
//...
attribute: [..., [strField, renameField], ...]
```

```javascript
strField = strField2
//...
attribute: [..., [strField2, renameField], ...]
```

使用要用 `instance.get(renameField).`
~~`instance.renameField`~~
~~`item[renameField]`~~

```javascript=
Model.findAll({
  attributes: [[sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']]
}).then(Models => Models.forEach({ instance =>
  const count_hats = instance.get('no_hats')
}));
```

原本的欄位 + **隔外欄位**

```javascript=
const field = [addField, renameField]
//...
attribute: { include: [field] }
```

原本的欄位 - **原本欄位**

```javascript=
const field = originalField
//...

attributes: { exclude: [field] }
```

## Ordering 排序

```javascript=
order: [

  attribute, // 小排到大 (正序)
  [attribute, 'DESC'] // 大排到小 (反序)

  // 關聯
  // asModel = associated Model
  [asModel, attribute, 'DESC']
  // 關聯用別名
  [{model: asModel, as: renameModel}, asModelAttribute, 'DESC']
]
```

```javascript=
operations: {
  order: [
    ['name', 'DESC'],  //ORDER BY name DESC
    sequelize.fn('max', sequelize.col('age')),   //ORDER BY max(`age`)
    [models.sequelize.fn('max', models.sequelize.col('age')), 'DESC'],   //ORDER BY max(`age`) DESC
  ]
}
```
