---
title: Raspberry Pi 4 的後端修鍊 (3) - foreign key
date: 2023-07-28 17:27:09
tags:
- Raspberry Pi 4
- database
- mariadb
categories:
- 技術練習
---
# Raspberry Pi 4 的後端修鍊 (3) - foreign key

## 增加一個有 foreign key 的資料表[^foreign-keys]

[^foreign-keys]: [Foreign Keys](https://mariadb.com/kb/en/foreign-keys/)

關聯式資料庫，的「關聯」之處，在於 foreign key 的關係。
有些開發者不喜歡 foreign key ，直接鍵一個欄位記錄別的 TABLE 的 key 值，但只有他自己知道，其它的人不知道，看資料庫也看不出來。

我自己比較喜歡用 foreign key 所以在此特別介紹一下如何用 foreign key 。

以[圖書館資料庫](https://dwatow.github.io/2023/07-27-raspberry-pi/create-table/#%E8%B3%87%E6%96%99%E5%BA%AB%E8%A8%AD%E8%A8%88)為例。

除了 user 之外的表，照理來說都會有 foreign key



## 「讀者」資料表

使用者與讀者之間的關係是「一對一」

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

- `id` 想要記錄讀者的身份證字號，可以用身份證就可以借書了。
- `password` 和 user 一樣,
- `creator_id` 是 `FOREIGN KEY` 參考 `user.id`

```sql
DESCRIBE reader;
```

```shell
+------------+--------------+------+-----+---------+----------------+
| Field      | Type         | Null | Key | Default | Extra          |
+------------+--------------+------+-----+---------+----------------+
| id         | char(10)      | NO   | PRI | <null>  | auto_increment |
| password   | varchar(128) | YES  |     | <null>  |                |
| slack_id   | varchar(50)  | YES  |     | <null>  |                |
| line_id    | varchar(50)  | YES  |     | <null>  |                |
| phone      | char(10)     | YES  |     | <null>  |                |
| email      | varchar(50)  | YES  |     | <null>  |                |
| creator_id | int(11)      | NO   | MUL | <null>  |                |
+------------+--------------+------+-----+---------+----------------+

8 rows in set
Time: 0.046s
```

透過最簡單的語法 `FOREIGN KEY (creator_id) REFERENCES user (id)` 定義了一個 FOREIGN KEY。

在此有兩個預設值需要注意

```sql
ON DELETE
ON UPDATE
```

這兩個的預設值各別是如何？

### 經過實測

先刪除 reader 沒問題
但如先刪除 user，會出現錯誤訊息

```
Query 1 ERROR: 
Cannot delete or update a parent row: 
  a foreign key constraint fails (
    `good_ideas_lib`.`reader`, 
    CONSTRAINT `reader_ibfk_1` FOREIGN KEY (`creator_id`)
      REFERENCES `user` (`id`)
  )
```

修改 reader 的 creator_id 不會出現問題
但修改的 key 沒有存在的話，就會出錯誤訊息。

```
Query 1 ERROR: 
Cannot add or update a child row: 
  a foreign key constraint fails (
    `good_ideas_lib`.`reader`, 
    CONSTRAINT `reader_ibfk_1` FOREIGN KEY (`creator_id`) 
      REFERENCES `user` (`id`)
  )
```

修改 user 的 id，會出現錯誤訊息

```
Query 1 ERROR: 
Cannot delete or update a parent row: 
  a foreign key constraint fails (
    `good_ideas_lib`.`reader`, 
    CONSTRAINT `reader_ibfk_1` FOREIGN KEY (`creator_id`) 
      REFERENCES `user` (`id`)
  )
```

## ON DELECT 和 ON UPDATE 的四種模式[^actions][^berry]

[^actions]: [actions - constraints](https://mariadb.com/kb/en/foreign-keys/#constraints)

[^berry]: [以 MySQL 為例解釋外鍵（Foreign Key） - 一顆藍莓](https://b-l-u-e-b-e-r-r-y.github.io/post/ForeignKey/)

- **RESTRICT**（約束）：預設模式。當在父表刪除資料時，會比對子表是否有對應的資料，如果有則不允許刪除。
- **CASCADE**（級聯）：當在父表刪除資料時，會對比子表是否有對應的資料，如果有則會一起刪除。
- **SET NULL**：當在父表刪除資料時，會對比子表是否有對應的資料，如果有則設置子表的外鍵欄位為 NULL，子表資料不會被刪除。（欄位需允許 NULL）
- **NO ACTION**：與 RESTRICT 相同。

> 看來預設都是 RESTRICT

如果想要正確的更新與刪除，在設定 foreign key 的同時，需要好好的思考資料關聯間的基本關係。

以此為例，只需要思考「因為 user 刪除，reader 資料的建立者不能留空白，也不能無法參考，所以要限制無法刪除；如果 user 更新了 id ，那麼 reader 的 creator_id 也需要一起更新」

而且不用考慮刪除/更新 reader 的 creator_id 的情況，因為這種情況應該是自由的，想怎麼做都行，不受約束。

設定如下，再試一次

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
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB;
```

```sql
DESC reader;
```

```shell
+------------+--------------+------+-----+---------+-------+
| Field      | Type         | Null | Key | Default | Extra |
+------------+--------------+------+-----+---------+-------+
| id         | char(10)     | NO   | PRI | <null>  |       |
| password   | varchar(128) | YES  |     | <null>  |       |
| slack_id   | varchar(50)  | YES  |     | <null>  |       |
| line_id    | varchar(50)  | YES  |     | <null>  |       |
| phone      | char(10)     | YES  |     | <null>  |       |
| email      | varchar(50)  | YES  |     | <null>  |       |
| created_at | datetime     | YES  |     | <null>  |       |
| updated_at | datetime     | YES  |     | <null>  |       |
| creator_id | int(11)      | NO   | MUL | <null>  |       |
+------------+--------------+------+-----+---------+-------+

9 rows in set
Time: 0.039s

```

### 經過實測

確實修改 user 的 id 之後，reader 的 creator_id 會自動修改。

## 「出版社」資料表

```sql
CREATE TABLE publisher (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  created_at DATETIME,
  updated_at DATETIME,
  creator_id INT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES user (id)
    ON UPDATE CASCADE
) ENGINE = InnoDB;
```

這段 SQL，新增了一個 publisher 的資料表
此資料表有 5 個欄位

1. id: 出版社的 id
    - 只要流水號，自動生成，必填(不可是 NULL)，唯一碼 PRIMARY KEY
1. name: 出版社名字，字串可變長度 50
    - 變動字元 (50)，必填
1. creator_id: 使用者 id
    - 使用者修改，建立者隨使用者變動而變動
    - 使用者刪除，不可在有出版社資料時，使用者被刪除。
1. created_at: 新增日期時間
1. updated_at: 更新日期時間


增加了兩個與資料表同名的檔案 `publisher.frm`, `publisher.ibd`

```shell
:/var/lib/mysql/good_ideas_lib# ls
db.opt	publisher.frm  publisher.ibd  user.frm	user.ibd
```

## 「作者」資料表

```sql
CREATE TABLE author (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  created_at DATETIME,
  updated_at DATETIME,
  creator_id INT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES user (id)
    ON UPDATE CASCADE
) ENGINE = InnoDB;
```

## 「書籍」資料表

```sql
CREATE TABLE book (
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(50),
  isbn VARCHAR(13),
  author_id INT NOT NULL,
  FOREIGN KEY (author_id) REFERENCES author (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  publisher_id INT NOT NULL,
  FOREIGN KEY (publisher_id) REFERENCES publisher (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  year_public YEAR NOT NULL,
  description TEXT,
  PRIMARY KEY (id),
  created_at DATETIME,
  updated_at DATETIME,
  creator_id INT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES user (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB;
```

## 「實體書」資料表

```sql
CREATE TABLE abook (
  id INT AUTO_INCREMENT NOT NULL,
  PRIMARY KEY (id),
  book_id INT NOT NULL,
  FOREIGN KEY (book_id) REFERENCES book (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  storage VARCHAR(50),
  owner_id CHAR(10),
  FOREIGN KEY (owner_id) REFERENCES reader (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  created_at DATETIME,
  updated_at DATETIME,
  creator_id INT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES user (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB;
```

## 「書評」資料表

```sql
CREATE TABLE thought (
  id INT AUTO_INCREMENT NOT NULL,
  PRIMARY KEY (id),
  book_id INT NOT NULL,
  FOREIGN KEY (book_id) REFERENCES book (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  note TEXT,
  created_at DATETIME,
  updated_at DATETIME,
  creator_id INT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES user (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB;
```

## 「借書單」資料表

```sql
CREATE TABLE borrowing (
  id INT AUTO_INCREMENT NOT NULL,
  PRIMARY KEY (id),
  reader_id CHAR(10) NOT NULL,
  FOREIGN KEY (reader_id) REFERENCES reader (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  abook_id INT NOT NULL,
  FOREIGN KEY (abook_id) REFERENCES abook (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  start_at DATETIME,
  end_at DATETIME,
  created_at DATETIME,
  updated_at DATETIME,
  creator_id INT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES user (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB;
```

以上！
照著貼，就可以建立出一個資料庫囉！

```sql
SHOW TABLES;
```

```shell
+--------------------------+
| Tables_in_good_ideas_lib |
+--------------------------+
| abook                    |
| author                   |
| book                     |
| borrowing                |
| publisher                |
| reader                   |
| thought                  |
| user                     |
+--------------------------+

8 rows in set
Time: 0.026s
```

實際跑一下 TablePlus 的外掛，畫出來是這樣

[![image](https://github.com/goodideas-studio-training-camp/web-camp-in-node/assets/1825852/c10efb8a-8d9e-4b57-9635-61db14c9d4c5)](https://github.com/goodideas-studio-training-camp/web-camp-in-node/assets/1825852/c10efb8a-8d9e-4b57-9635-61db14c9d4c5)




## 建立 migration

手動的將所有的資料表都建立好了。
但如果想要重新再建一個，好像又要重新做一次語法。
所以就想到如果可以像 node 一樣執行 .js 檔，那不就好了嗎？

還真讓我找到[^source]語法執行，真的就好了。

[^source]: [command line - How to run SQL script in MySQL? - Stack Overflow](https://stackoverflow.com/questions/8940230/how-to-run-sql-script-in-mysql)

再分檔案與日期 即可建立了一個有 migration 概念的機制。
