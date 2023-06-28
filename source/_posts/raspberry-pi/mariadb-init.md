---
title: Raspberry Pi 4 的後端修鍊 (2): Database Initial
date: 2023-06-28 17:25:50
tags:
- `後端`
- `pi`
- `Database`
categories:
- 技術練習
---
# Raspberry Pi 4 的後端修鍊 (2): Database Initial

> ## 樹莓派換 wifi 遇到的問題
> 
> 如果你像我一樣，樹莓派並不是固定一個地方。
> 會拿來拿去的移動，這樣樹莓派的 wifi 或 IP 就是常態性變動的。
> 也許會在 ssh 登入時遇到這個問題
> 
> ```
> @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
> @    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
> @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
> IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
> Someone could be eavesdropping on you right now (man-in-the-middle attack)!
> ...(中間略)...
> Host key verification failed.
> ```
> 
> 找找 `/Users/<user>/.ssh/known_hosts` 這個檔案。
> 看看有沒有一個 IP 相同的記錄，刪除存檔，再重新登上去就可以了。
> 順便記得看一下樹莓派常用的幾個 IP 是不是相同的 hash code

## 資料庫初始 [^mariadb]

先更新 apt-get

```shell
$ sudo apt-get update
$ sudo apt-get upgrade
```

[^mariadb]: [HOW TO INSTALL MYSQL/MARIADB SERVER ON RASPBERRY PI](https://r00t4bl3.com/post/how-to-install-mysql-mariadb-server-on-raspberry-pi)

安裝 mariadb[^Installing-MariaDB-Server-with-APT]

[^Installing-MariaDB-Server-with-APT]: [Installing MariaDB .deb Files, Installing MariaDB Server with APT - MariaDB Knowledge Base](https://mariadb.com/kb/en/installing-mariadb-deb-files/#installing-mariadb-server-with-apt)

```shell
sudo apt-get install mariadb-server
```

## 安裝 mycli[^mycli-install]

[^mycli-install]: [簡單最重要: MySQL (1) Ubuntu install mycli](http://cooperbear2.blogspot.com/2018/08/mysql-1-ubuntu-install-mycli.html)

提供自動補完的 cli 工具。(在人工輸入時，很友善)

```shell
$ pip3 install mycli
Looking in indexes: https://pypi.org/simple, https://www.piwheels.org/simple
Collecting mycli
  Using cached https://files.pythonhosted.org/packages/e7/bd/e7ceb1856cc552b8912cc76098f5dcbe5e103a78db912980a1a4e6ddbdf3/mycli-1.21.1-py2.py3-none-any.whl
Requirement already satisfied: click>=7.0 in /usr/lib/python3/dist-packages (from mycli) (7.0)
Requirement already satisfied: configobj>=5.0.5 in ./.local/lib/python3.7/site-packages (from mycli) (5.0.6)
Requirement already satisfied: PyMySQL>=0.9.2 in ./.local/lib/python3.7/site-packages (from mycli) (0.9.3)
Requirement already satisfied: cryptography>=1.0.0 in /usr/lib/python3/dist-packages (from mycli) (2.6.1)
Requirement already satisfied: sqlparse<0.4.0,>=0.3.0 in ./.local/lib/python3.7/site-packages (from mycli) (0.3.1)
Requirement already satisfied: cli-helpers[styles]>1.1.0 in ./.local/lib/python3.7/site-packages (from mycli) (2.0.1)
Requirement already satisfied: prompt-toolkit<3.0.0,>=2.0.6 in ./.local/lib/python3.7/site-packages (from mycli) (2.0.10)
Requirement already satisfied: Pygments>=1.6 in /usr/lib/python3/dist-packages (from mycli) (2.3.1)
Requirement already satisfied: six in /usr/lib/python3/dist-packages (from configobj>=5.0.5->mycli) (1.12.0)
Requirement already satisfied: tabulate[widechars]>=0.8.2 in ./.local/lib/python3.7/site-packages (from cli-helpers[styles]>1.1.0->mycli) (0.8.7)
Requirement already satisfied: terminaltables>=3.0.0 in ./.local/lib/python3.7/site-packages (from cli-helpers[styles]>1.1.0->mycli) (3.1.0)
Requirement already satisfied: wcwidth in /usr/lib/python3/dist-packages (from prompt-toolkit<3.0.0,>=2.0.6->mycli) (0.1.7)
Installing collected packages: mycli
Successfully installed mycli-1.21.1

```

設定多行模式[^mycli-multi-line][^mycli-config]

[^mycli-multi-line]: [Multi-line Mode](https://www.mycli.net/multi-line)
[^mycli-config]: [Configuration](https://www.mycli.net/config)

**~/.myclirc**

其中有一段是 multi-line 的設定

```shell
# Multi-line mode (多行模式)允許將 sql 語句分成多行。 
# 如果將其設置為 True，然後語句的末尾必須使用分號。
# 如果將其設置為 False，則無法將sql語句拆分為多行。 End of line (return) 被視為語句的結尾。
multi_line = False
```

使用 mycli

```shell
mycli -u <user> -p <password> <database>
```
進入時再輸入密碼即可開始

## 資料庫初次設定

設定 root 的密碼

```shell
sudo mysql_secure_installation 
```

問一連串的問題

```shell
Enter current password for root (enter for none)
Switch to unix_socket authentication [Y/n]
Change the root password? [Y/n]
Remove anonymous users? [Y/n]
Disallow root login remotely? [Y/n]
Remove test database and access to it? [Y/n]
Reload privilege tables now? [Y/n]

Cleaning up...

All done!  If you've completed all of the above steps, your MariaDB
installation should now be secure.

Thanks for using MariaDB!
```

測試是否安裝成功

```shell
$ sudo mysql
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 131
Server version: 10.3.22-MariaDB-0+deb10u1 Raspbian 10

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]>
```

看見 `MariaDB` 就是成功了


### 新增資料庫[^PRIVILEGES]

第一步，要新增資料庫，來試看看名為 testdb 的資料庫

```sql
MariaDB [(none)]> create database `testdb`;
Query OK, 1 row affected (0.001 sec)
```

看見 `Query OK` 就是成功了

### 顯示所有資料庫

印看看，剛剛成功新增的資料庫

```sql
MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| testdb             |
+--------------------+
4 rows in set (0.001 sec)
```

有看見 testdb，成功！

### 新增使用者[^create-user]

[^create-user]: [HOW TO INSTALL MARIADB 10.4 ON UBUNTU 18.04 (BIONIC BEAVER), Add User](https://r00t4bl3.com/post/how-to-install-mariadb-10-4-on-ubuntu-18-04-bionic-beaver)


```sql
CREATE USER 'rasp'@'localhost' IDENTIFIED BY 'yourpassword';
Query OK, 0 rows affected (0.001 sec)
```

看見 `Query OK` 就是成功了

> - `'rasp'@'localhost'`: 'rasp' 指的是登入資料庫的使用者帳號
> - `yourpassword` 要記得改成你要的密碼

### 查看所有使用者[^users]

[^users]: [mysql 查詢 user 帳號及權限](https://jason0324.pixnet.net/blog/post/42795331-mysql-%E6%9F%A5%E8%A9%A2-user-%E5%B8%B3%E8%99%9F%E5%8F%8A%E6%AC%8A%E9%99%90)

印看看，剛剛成功新增的使用者

```sql
MariaDB [(none)]> SELECT User,Host FROM mysql.user;
+------+-----------+
| User | Host      |
+------+-----------+
| rasp | localhost |
| root | localhost |
+------+-----------+
2 rows in set (0.001 sec)
```

有看見 rasp，成功！

### 賦序帳號權限[^PRIVILEGES]

有了帳號，有了資料庫，還要給予帳號存取資料庫的權限，帳號才算是可以用的哦

[^PRIVILEGES]: [MySQL 新增使用者及建立資料庫權限](https://www.opencli.com/mysql/mysql-add-new-users-databases-privileges/amp)

```sql
MariaDB [(none)]> GRANT ALL PRIVILEGES ON testdb.* TO 'rasp'@'localhost';
Query OK, 0 rows affected (0.001 sec)
```

### 試用看看

> 注意: 
> 不要使用 `sudo` 的權限來下 `mysql` 的指令
> 這樣測試才準

```shell
$ mysql -u rasp -p --host='127.0.0.1' --port=3306 testdb
Enter password: 
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 135
Server version: 10.3.22-MariaDB-0+deb10u1 Raspbian 10

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [testdb]> 
```

看見 `MariaDB [testdb]> ` 就是成功囉，直接連上的資料庫 `testdb` 也會直接顯示出來哦。

成功之後，就可以用本機，使用軟體 ssh 登入 raspberry pi 裡的資料庫囉!!
