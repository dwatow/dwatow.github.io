---
title: 在 nginx 的 log 顯示請求的 body(json 格式)
date: 2024-06-19 17:30:13
tags:
categories:
---

# 在 nginx 的 log 顯示請求的 body(json 格式)

## ssh 登入

```shell
ssh 帳號@主機位址
```

> 必要的話，要用 `-i` 來指定使用的 key

## 檢查 nginx 版本

```ssh
nginx -V
```

必須注意 `escape=json` 要 Nginx 1.11.5 之後才支援

## 先看一下有沒有設定

```ssh
less /etc/nginx/nginx.conf
```

注意 http 段落中，有一個在設定 log 的地方，內容大約如下

```nginx
http {
        ...
        ##
        # Logging Settings
        ##

        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;
        ...
}
```

## 編輯設定檔

```ssh
sudo vim /etc/nginx/nginx.conf
```

要設定 nginx 的 log format 請求才會出現 JOSN 的內容

```nginx
http {
  ##
  # Logging Settings
  ##

  # log_format compression
  # '[$time_local] $remote_addr - $status '
  # '"$request" $request_body';

  log_format json_log
  # escape=json # Nginx 1.11.5 之後才支援
  '[$time_local] $remote_addr - $status '
  '"$request" $request_body';

  access_log /var/log/nginx/access.log json_log;
  error_log /var/log/nginx/error.log;
}
```

1. `log_format json_log escape=json`

宣告一個 log_format 叫做 json_log 格式，escape=json 指定 json 格式處理特殊字元。

2. `access_log /var/log/nginx/access.log json_log;`

設定 access_log 在 `/var/log/nginx/access.log` 以 json_log 格式儲存。

## 測試 nginx 設定檔正確性

確認無誤之後，再重啟，所以要先測試一下指令是否有錯誤

```shell
sudo nginx -t 
```

## 無縫重啟 nginx

透過 systemctl 重啟 nginx (推薦使用)

```shell
sudo systemctl reload nginx
```

另一種寫法，直接重啟 nginx

```shell
sudo nginx -s reload
```

## 查看 log 看效果

```shell
sudo tail -f /var/log/nginx/access.log
```