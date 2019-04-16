---
title: 幫你的網址加上 https (設定 SSL)
date: 2019-04-16 10:05:49
tags: ["nginx", "ssl", "https"]
categories: 工具使用
---

# 幫你的網址加上 https (設定 SSL)

1. 開啟 web server 的 443 port，用來傳送 https 的 port
2. 申請憑證

## nginx 開 443

設定檔路徑 `/etc/nginx/sites-available`

```nginx
server {
  listen 80 default_server;
  listen [::]:80 default_server;

  # SSL configuration

  listen 443 ssl default_server;
  listen [::]:443 ssl default_server;
  # ...
}
```

重開 web server

```shell
sudo service nginx restart
```

### 檢查是否正確

查看佔用 port

```shell=
$ sudo lsof -i -P -n | grep :443
nginx     11361             web    8u  IPv4 4260616      0t0  TCP *:443 (LISTEN)
nginx     11361             web    9u  IPv6 4260617      0t0  TCP *:443 (LISTEN)
nginx     11366        www-data    8u  IPv4 4260616      0t0  TCP *:443 (LISTEN)
nginx     11366        www-data    9u  IPv6 4260617      0t0  TCP *:443 (LISTEN)
```

重開伺服器，確認 443 port 有被佔用，就是開啟成功。

## 申請憑證

在此選用 [freeSSL.cn/freeSSL.org](https://freessl.cn/) 進行練習。

:::danger
建議用於非商業網站。
:::

### 操作步驟

- 登入 FreeSSL。沒有登入不會給你證書。
- 給定需要設定的 Domain （點擊 創建免費的 SSL 證書）
  ![](https://i.imgur.com/5OHMzKc.png)

### 驗證 Domain 的擁有權

#### 選擇驗證方式

在此選用的是檔案驗證 (fileauth)

1. `登入`時會幫你打好信箱
2. `驗證類型`選擇`文件驗證` (fileauth)，點擊 `點擊創建`
   ![](https://i.imgur.com/znUKmcr.png)

#### 取得驗證內容

SSL 服務網站會提供給你一個檔案、內容
以及它希望你放置的網站路徑

意思是: 如果你可以讓這個網址底下放置這個檔案，而且要指定內容，就相信你有這個網站的所有權。

![](https://i.imgur.com/tEO5oZ1.png)

- `文件路徑`   從你的 domain 進入讀取檔案的路徑。
- `記錄值` 從你的 domain 進入讀取檔案的內容。

依照要求，已經將檔案放置完之後 (一連串 bash 的操作)

#### 執行驗證前的檢測

:::danger
先確認`配置完成，檢測一下`。
`點擊驗證` 之前要登入! `未登入`是不會通過的。
:::

進行檢測`配置完成檢測一下` 檢測時間大約 10 秒。
完成檢測，會出現三個伺服器的驗證結果: `匹配`。

#### 執行驗證

完成檢測之後，就可以`點擊驗證` domain 的擁有權。

### 驗證失敗可能的原因

:::info
若網站已存在，需注意 route 是否會干擾驗證
:::

:::danger
因為憑證服務要透過 domain 來看看是否真的放上了 fileauth 會來訪問網站。
![](https://i.imgur.com/3kOV8Vm.png)
（可能的檢測結果）
:::

## 取得 CRT 和 Private key

一定要登入，才可以驗證。

訂單列表下，注意`狀態`的部分，顯示`完成`（綠燈）的項目

![](https://i.imgur.com/c49cb1Z.png)

找到`待驗證` (藍燈) > 按 `驗證` 後

傳給你一份完整的證書和私鑰。

![](https://i.imgur.com/ugHvD30.png)

請用文字編輯器打開

1. 證書內容 會有 BEGIN CERTIFICATE
2. 公鑰內容 會有 BEGIN PRIVATE KEY
   ![](https://i.imgur.com/47EHlUH.png)
   (certificate 範例)

## 設定 CRT 和 Private key[^nginx-config-crt]

[^nginx-config-crt]:

  [Nginx 如何配置證書？](https://blog.freessl.cn/how-to-install-cert-in-nginx/)

```
example.com.crt
example.com.key
```

設定檔路徑 `/etc/nginx/sites-available`

設定放置目錄

```nginx
server {
  ssl_certificate /path/to/example.com.crt;
  ssl_certificate_key /path/to/example.com.key;
}
```

就完成了。
使用 `https://` 協定進入你的首頁吧！
