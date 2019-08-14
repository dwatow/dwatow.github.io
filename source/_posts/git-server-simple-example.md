---
title: 極簡易的 git server
date: 2017-10-24 15:47:57
tags: 
- git
categories: 
- 技術心得
---

# 極簡易的 git server

這是一篇，教你利用簡易的 Web server，開一個臨時的 git server。提供給區網內的人可以`git clone`。

## Server

查看自己的 IP

```shell=
~/code $ ifconfig
```

假設，在此取得的 ip 是`192.168.94.87`

先開一個簡易 Server

```shell=
~/code $ python -m SimpleHTTPServer
# or ~/code $ php -S localhost:8000
```

先新增一個`repo`並且初始化成一個`git bare`。

```shell=
~/code $ mkdir myRepo.git
~/code $ cd myRepo.git
~/myRepo.git $ git init --bare
```

然後再加上這一行[^1]

```shell=
~/myRepo.git $ git update-server-info
```

## Client

現在就可以試著`git clone` 一下看看

```shell=
~ $ git clone http://192.168.94.87:8000/myRepo.git
```

應該就可以成功了，但是經我自己的實驗，目前還無法`git push`。QQ

[^1]:

  [GIT over HTTP (GIT HTTP Transparent)](http://blog.xuite.net/zack_pan/blog/65273998-GIT+over+HTTP+%28GIT+HTTP+Transparent%29)
