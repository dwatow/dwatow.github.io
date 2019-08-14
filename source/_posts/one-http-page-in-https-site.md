---
title: 設定 Nginx 在 https 中，留下一頁 http
date: 2019-04-16 11:04:40
tags: 
- nginx
- https
- http
categories: 
- 技術心得
---

# 設定 Nginx 在 https 中，留下一頁 http

:::info
在看之前，想問來看文章的讀者們 (厲害的開發者們) 瀏覽器是否會 catch 某一版本的設定？
設定 Web Server 時，修改並不會即時反映，需要每一次都開新的無痕才可以驗證正確的結果。
:::

這個問題，有兩個地方要注意

1. Web Server
2. 前端 router

:::warning
這個 Web Server 的設定，在有前端 router 時，要注意。
如果沒有重新整理的 route 都算是前端 route 的執行結果，與 web server 無關。
:::

## 最後的解法如下。

```nginx
server {
  listen 80 default_server;
  listen [::]:80 default_server;

  root /front_end/index/path;
  index index.html index.htm index.nginx-debian.html;

  # 特定路徑之下，執行 http
  location ~ ^(/target/path)(.[^/]+)$ {
    try_files /index.html =404;
  }

  # 不符合特定路徑，通通導回 https
  location ~ ^(?!/target/path)(.*)$ {
    rewrite ^(/.*)$ https://$host/$1 permanent;
  }
}

server {
  # SSL configuration
  listen 443 ssl default_server;
  listen [::]:443 ssl default_server;

  # 憑證與金鑰的路徑
  ssl_certificate /nginx_path/ssl.crt;
  ssl_certificate_key /nginx_path/ssl.key;

  # Add index.php to the list if you are using PHP
  root /front_end/index/path;
  index index.html index.htm index.nginx-debian.html;

  server_name _;
  location ~ ^.*$ {
    try_files $uri $uri/ /index.html =404;
  }
}
```

其中最重要的有兩個地方。

- 正規表示式 使用[工具](https://regex101.com/) 驗證寫出來的正規表示式。
- 讀懂 nginx 的設定

## 正規表示式

設定檔幾個 regex

基本

| 語法 | 意思                                             |
| ---- | ------------------------------------------------ |
| `^`  | 開頭處                                           |
| `$`  | 結尾處                                           |
| `.`  | 非斷行的任意字元                                 |
| `/`  | 只是反斜線 (正規表示式為`\/` nginx 無需跳脫字元) |

邏輯

| 語法 | 意思     |
| ---- | -------- |
| `^`  | 邏輯 not |
| `?!` | 負向預查 |

次數

| 語法 | 意思                           |
| ---- | ------------------------------ |
| `+`  | 匹配前面的子運算式一次或多次。 |
| `*`  | 匹配前面的子運算式零次或多次。 |

參考: [正規表示式 Regular Expression](http://ccckmit.wikidot.com/regularexpression)

1. `^(/target/path)(.[^/]+)$`
   開頭是 `/target/path` 且要接「任意字元，任意長度，但不能包含`/`(階層) 」，就成立
1. `^(?!/target/path)(.+)$`
   開頭 條件不符合 `/target/path` 時，且要接「任意字元」，就成立
1. `^.*$`
   「任意字元」，就成立

## 設定檔的關鍵字[^book]

參考: [Module ngx_http_core_module - nginx](http://nginx.org/en/docs/http/ngx_http_core_module.html#location)

- server
  - listen 指定監聽 socket (TCP) port
  - root
  - index
  - location
    - return
    - try_files
    - rewrite

### listen

能用在 server 內

指定 IP:port

```nginx
listen 192.168.1.1:80;
```

指定 port (該主機的任意 IP)

```nginx
listen 80;
```

### location[^book]

能用在 server 或 location 內
所有的 location 都會組成一棵樹

語法:

```nginx
location [ = | ~ | ~* | ^~ ] uri { ... }
```

- `=` URI 當字串匹配
- `^~` URI 當字串，字串字首比對
- `~` URI 當正規表示式匹配，區分大小寫
- `~*` URI 當正規表示式匹配，不區分大小寫

[^book]: 《一手掌握短小精幹的 Nginx》, p.10-3

[nginx 配置 location 總結及 rewrite 規則寫法](http://seanlook.com/2015/05/17/nginx-location-rewrite/)

### try-files

能用在 server 或 location 內

依次判斷檔案是否存在，並且回傳，都不存在則由 fallback 處理

語法:
一種連續 if 判斷的指令

```nginx
try_files file1 [file2 file3 file4 ... fileN] fallback;
```

example

```nginx
try_files $uri $uri/ /error.html =404;
```

> $uri
> The value of $uri may change during request processing, e.g. when doing internal redirects, or when using index files.
