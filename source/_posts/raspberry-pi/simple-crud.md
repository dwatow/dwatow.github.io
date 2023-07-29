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

## 制作假資料

```shell
vim fake_data.sql
```

```sql

INSERT INTO book (title, isbn, author_id, publisher_id, date_public, description, created_at, updated_at, creator_id) 
VALUES(
  '哎呀！早知道就不會破版的 CSS 設計技巧：前端工程師防止佈局意外的必學密技', 
  '9786263335172', 
  1, 
  1, 
  '2023-07-10', 
  '【內容簡介】<br />
  本書內容改編自第14屆iThome鐵人賽Modern Web組的冠軍系列文章《防禦性CSS-建立「防患未然」的匠人心態》。本書用淺顯易懂的程式碼及貼近生活的實際情境，來探討如何培養「防患未然」的思維。由於有些畫面佈局過於單純和簡單，因此會容易忽略其潛在的破版危險，這些令人容易忽略的潛在性危險，很有可能在你最不希望它出現的時候意外出現了，小則影響畫面上的美觀，大則影響產品在客戶眼中的專業形象，進而造成商業上的損失。<br />
  <br />
  本書將這些常見的案例分成八個主題，逐一探討每一個問題會發生的情境，以及提供解決這些問題的具體方法和技巧，希望在這些案例分析的過程當中，以容易上手的程式碼，帶領讀者慢慢培養「防患未然」的思考習慣，即使是一行簡單的CSS，也能夠充分展現專業的程式設計態度。', 
  NOW(), 
  NOW(), 1),(
  '約耳趣談軟體', 
  '9786263245297', 
  2, 
  2, 
  '2004-08-16', 
  '軟體開發者、設計者、管理者，以及常與這些人打交道的其他人等(不知是有幸還是不幸)，大家三不五時總會遇到的各種有趣問題。<br />
<br />
榮獲2005 JOLT生產力獎<br />
<br />
「Spolsky真的很懂呀！」<br />
—Thomas Duff<br />
<br />
失敗的軟體專案，實在太多了！有些團隊花了太長時間去製作產品；有些團隊製作的產品根本沒人要；有些團隊甚至連產品都做不出來！軟體開發者似乎太常花力氣去重新包裝一些失敗的舊想法，或是太常提出一些沒有用的新想法。結果我們一次又一次看到的是，新浪不斷推舊浪，舊浪死在沙灘上。<br />
<br />
大家只聽到各種重複的口號：「我們有架構！哦不，我們有物件導向！哦不，我們既統一又敏捷！」遺憾的是，結局都一樣，寫程式的人依然很不快樂，甚至怨恨自己寫程式的每一分鐘；開發團隊依然不懂得如何打造成功的軟體。這實在太扯了！你能想像嗎？這就好像一群木匠想製作家具，卻連螺絲都沒聽過，只知道用釘子，卻又不會用鐵錘，最後只好拿著踢踏舞鞋，硬是把釘子敲進木頭中。我們真的很需要有個人，來撥開層層迷霧，讓大家看個明白。<br />
<br />
有人曾說過，作家的任務就是「把大家熟悉的東西變成新的東西；把新的東西變成大家熟悉的東西」。多年來，Joel Spolsky一直在www.joelonsoftware.com做的就是這件事。他不斷教育我們、娛樂我們，有時還會故意激怒我們，但他總是會讓我們去思考，我們整天坐在電腦前究竟是在幹嘛？這就是Joel on Software這個網站之所以成為全世界最受歡迎的開發網站其中的一個理由。現在，你終於可以擁有他網站裡最重要的精選文章，好好收藏這些來自Joel的獨家評論與最新洞見了。', 
  NOW(), 
  NOW(), 1),(
  '從自學到成功轉職軟體工程師：自主學習讓我重拾人生的發球權', 
  '9786263330122', 
  3, 
  1, 
  '2022-01-24', 
  '本書內容改編自第12屆iT邦幫忙鐵人賽 Modern Web 組佳作系列文章——《完美 Camp 進化論》，以自學程式設計所需要準備的心態，及後續如何尋找教材持續進行學習和練習的內容為主，作者自身的學習經驗為輔，期望能更貼近讀者的需求與感受。', 
  NOW(), 
  NOW(), 1);
```


