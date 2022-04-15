---
title: 初探 ngrok 神器
date: 2017-06-16 18:37:29
tags:
- ngork
- 測試工具
categories:
- 工具使用
- macOS
---

# 初探 ngrok 神器

![](https://ngrok.com/static/img/demo.png)

## 安裝

用 hoem brew 安裝，可以將執行檔當作全域指令使用。

```shell
brew install --cask ngrok
```

安裝完成

:::warning
注意
不要到[官網](https://ngrok.com/)下載。
但是要去申請一個帳號。
:::

## 使用

執行 ngrok，用 http 接到 port 3000。

```shell
$ ngrok http 3000
```

## 功能介紹

ngrok 的在做的事情是叫做[`HTTP tunneling`](https://en.wikipedia.org/wiki/HTTP_tunnel)

### 需求之一

在實作 fb 聊天機器人時， facebook 會需要你提供一串網址
來讓 facebook 的伺服器丟聊天室的訊息給你

## 問題點

但是我們在本地端開的伺服器，只能產生本地端的網址(`localhost`)
一般情況，要能建立一個能讓網路上任何人都連的到的網址
你會需要去買一個`網域(像是 www.goodidea.com)`
並且將你的 IP 跟他做綁定

但是因為那樣很麻煩，我們這裡使用 ngrok 的服務

## ngrok 幫我們做了什麼

ngrok 在做的事情是，他們在自己的公司裡有買一個域名(`ngrok.com`)
你使用 ngrok 的服務時，他會自動幫你產生一段臨時的網址給你用
(`xxxx.ngrok.com`)

這時候 facebook 就可以用這個臨時產生的網址來傳送訊息了
一但 ngrok 的伺服器收到 facebook 丟的訊息

他就會把這個訊息原封不動的丟回來給你，就好像是你的伺服器是直接接收到的一樣
(關於 ngrok 的伺服器是怎麼找到你家的電腦的)
(有興趣可以去找 HTTP、IP 的文章來閱讀)

## 開一個簡易的本地 web server

新版的 Macbook pro (就是 M1 pro) 能用的方式舉例如下

```shell
$ python3 -m http.server  
```