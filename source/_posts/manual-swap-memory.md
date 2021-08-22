---
title: Ubuntu 手動加上 swap
date: 2021-08-22 12:44:49
tags:
- linux
- swap
- webpack
categories:
- 技術心得
---

# Ubuntu 手動加上 swap

在雲端主機要加上 swap，webpack 執行編譯才不會當機

## 動機

前端佈署在伺服器上，要在伺服器上編譯

雲端主機沒有 swap 會在 webpack 編譯時，出現記憶體不足，造成當機的問題。
所以要設定一下虛擬記憶體 (swap) 的大小。通常雲端主機並不會幫你設定，要自己來。

## 查看記憶體

通常 Swap 會設置為實體記憶體的兩倍[^swap-size]，所以要先看一下目前記憶體有多大。[^free]

[^swap-size]: [系統的分頁檔（Page File）或交換空間（Swap Partition）應該設定為多大比較好？](https://blog.gtwang.org/tips/how-big-should-your-page-file-or-swap/)
[^free]: [查看 Linux 的記憶體多大](https://blog.longwin.com.tw/2013/05/linux-ram-memory-info-2013/)

```bash
$ free
              total        used        free      shared  buff/cache   available
Mem:        3999756      328648     3139664       43328      531444     3502496
Swap:        102396           0      102396
```

total 3999756 就是總共使用幾 K。

```bash
$ free -m
              total        used        free      shared  buff/cache   available
Mem:           3906         310        3076          42         519        3430
Swap:            99           0          99
```

可以改用 mega 為單位，

## 設定

設定 swap[^swap]

[^swap]: [Ubuntu如何手動新增虛擬記憶體(swap)](https://www.astralweb.com.tw/how-to-manually-add-swap-to-ubuntu/)

```bash
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 開機啟用

開機掛載 swap

```bashscript
sudo vim /etc/fstab
```

開啟檔案，到最後加入此行
```shell
...
# 開機掛載 swap
/swapfile   none swap    sw 0 0
```
