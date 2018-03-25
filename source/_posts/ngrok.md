---
title: 神器ngrok
date: 2017-06-16 18:37:29
tags: ['ngork', '測試工具']
categories: '工具使用'
---
# 初探ngrok神器

![](https://ngrok.com/static/img/demo.png)

## 安裝

用 hoem brew 安裝，可以將執行檔當作全域指令使用。

```shell
brew cask install ngrok
```

安裝完成

:::warning
注意
不要到[官網](https://ngrok.com/)下載。
但是要去申請一個帳號。
:::

## 使用

執行ngrok，用http接到port 3000。
```shell
$ ngrok http 3000
```
