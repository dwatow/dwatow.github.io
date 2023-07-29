---
title: Raspberry Pi 4 的後端修鍊 (4) - 簡單操作資料
date: 2023-07-29 13:23:16
tags:
- Raspberry Pi 4
- database
- mariadb
categories:
- 技術練習
---
# Raspberry Pi 4 的後端修鍊 (4) - 簡單操作資料

在此簡單的演示一下，如何操作資料的 CRUD

## 俗稱 CRUD 的操作[^crud]

[^crud]: [增刪查改 - 維基百科，自由的百科全書](https://zh.wikipedia.org/zh-tw/%E5%A2%9E%E5%88%AA%E6%9F%A5%E6%94%B9)

|名字|英文|SQL|
|----|----|----|
|新增|Create|INSERT|
|讀取|Read|SELECT|
|修改|Update|UPDATE|
|刪除|Delete|DELETE|

## INSERT[^insert]

[^insert]: [INSERT - MariaDB Knowledge Base](https://mariadb.com/kb/en/insert/)

> `INSERT INTO` 的 `INTO` 可以忽略，所以我就不寫了。

```sql
INSERT user 
SET name='chris', 
    password='chris', 
    created_at=NOW(), 
    updated_at=NOW()
```

但是用 `SET` 只能一次新增一筆，就試看看另一種做法

```sql
INSERT INTO user (name, password, created_at, updated_at) 
VALUES
('chris', 'chris', NOW(), NOW()), 
('mary', 'mary', NOW(), NOW());
```

新增了這麼多次，現在資料長怎樣呢？

## SELECT[^select]

[^select]: [SELECT - MariaDB Knowledge Base](https://mariadb.com/kb/en/select/)

想要把資料讀取出來看，可以使用 `SELECT`

```sql
SELECT * FROM user;
```

```shell
+----+-------+----------+---------------------+---------------------+
| id | name  | password | created_at          | updated_at          |
+----+-------+----------+---------------------+---------------------+
| 1  | chris | chris    | 2023-07-29 13:10:13 | 2023-07-29 13:10:13 |
| 2  | chris | chris    | 2023-07-29 13:10:17 | 2023-07-29 13:10:17 |
| 3  | mary  | mary     | 2023-07-29 13:10:17 | 2023-07-29 13:10:17 |
+----+-------+----------+---------------------+---------------------+

3 rows in set
Time: 0.016s
```


目前的資料，出現了 3 筆，兩筆 chris，1 筆 mary 而且 id 計數到 3 了。
接下來想要把資料重新 insert 一次，但是希望從頭開始計數。



## DELETE[^delete]

[^delete]: [DELETE - MariaDB Knowledge Base](https://mariadb.com/kb/en/delete/)

刪除資料與刪除資料表不同，在此不要誤用了 `DROP` 就災難了呀。
要用 `DELETE`


```sql
DELETE FROM user;
```

```shell
You're about to run a destructive command.
Do you want to proceed? (y/n): y
Your call!
Query OK, 3 rows affected
Time: 0.007s
```

這樣就可以刪除 user 資料表裡，所有的資料 (在此沒有加上任何的條件)
之後如果有需要，再加上 `WHERE` 語句，附上條件即可。

## 重新設定計數

```sql
ALTER TABLE TableName AUTO_INCREMENT=設定的數值;
```

example: 

```sql
ALTER TABLE user AUTO_INCREMENT=1;
```

```shell
You're about to run a destructive command.
Do you want to proceed? (y/n): y
Your call!
Query OK, 0 rows affected
Time: 0.013s
```

這樣一來就可以(神不知鬼不覺的？)再重新 `INSERT`  一次囉！

## UPDATE[^update]:

[^update]: [UPDATE - MariaDB Knowledge Base](https://mariadb.com/kb/en/update/)

想把 mary 的 password 改成 'chris' ，該怎麼做呢？
修改資料，可以使用 `UPDATE`

```sql
UPDATE user
SET password='chris'
WHERE name='mary';
```
```shell
Query OK, 1 row affected
Time: 0.005s
```

在此使用了 `WHERE` 語句，設定「目標資料」需要符合哪些條件。
再看一次資料，現在長怎樣。

```sql
SELECT * FROM user;
```

```shell
+----+-------+----------+---------------------+---------------------+
| id | name  | password | created_at          | updated_at          |
+----+-------+----------+---------------------+---------------------+
| 1  | chris | chris    | 2023-07-29 13:12:32 | 2023-07-29 13:12:32 |
| 2  | mary  | chris    | 2023-07-29 13:12:32 | 2023-07-29 13:12:32 |
+----+-------+----------+---------------------+---------------------+

2 rows in set
Time: 0.015s
```
