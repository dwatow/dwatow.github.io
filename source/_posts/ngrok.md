---
title: 神器ngrok
date: 2017-06-16 18:37:29
tags: ['ngork', '測試工具']
categories: '工具使用'
---
# 初探ngrok神器

![](https://ngrok.com/static/img/demo.png)

## 安裝

到[官網](https://ngrok.com/)看見左邊是下載，右邊是登入

先登入(用facebook就可以了)

### 下載

下載之後，解壓縮，得到一個執行檔。

### 取得環境變數

```shell
$ echo $PATH
```
## 完成

放到環境變數路徑之下，就算是安裝完成了

## 使用

執行ngrok，用http接到port 3000。
```shell
$ ngrok http 3000
```
