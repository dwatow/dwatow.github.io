---
title: Raspberry Pi 4 的後端修鍊 (0) - 樹莓派入手安裝設定到 express.js Hello world
date: 2023-06-16 18:11:17
tags:
- 後端
- pi
- express
categories:
- 技術練習
---

# Raspberry Pi 4 的後端修鍊 (0) - 樹莓派入手安裝設定到 express.js Hello world

## 樹莓派 作業系統安裝

![](https://hackmd.io/_uploads/SknTpttDn.png =400x)

這次安裝的是 Raspberry Pi OS (64-bit)
是有桌面系統的一個版本。如果是熟練的玩家，可以使用 Lite 的版本。

有了一個 64 bit 的 CPU 不使用 64 bit 的 OS 有點怪。
可以看，到更新日期是上個月而已。非常的新！讚！

## handless 樹莓派設定

1. [設定 wifi 的方法](https://www.raspberrypi.org/documentation/configuration/wireless/headless.md)
    - 注意 `wpa_supplicant.conf` 放置的位置是在記憶卡的根目錄，不是 `/etc/wpa_supplicant/wpa_supplicant.conf`
      ==因為 headless 沒有螢幕，所以檔案放記憶卡==
      這個方法會蓋掉原本的設定檔。
1. 設定 ssh 的方法
    - 先進入樹莓派的系統設定，[開啟「允許 SSH 服務」](https://www.raspberrypi.com/documentation/computers/remote-access.html#setting-up-an-ssh-server)
    - 用 ssh 連線進入 (先使用系統管理員帳號、密碼)
      1. `ssh pi@<host>`
      1. 然後輸入密碼
    - 進入 `~/.ssh `
    - 輸入 `echo ssh-rsa (public key) >> authorized_keys`

這樣一來，就可以連上網路，並且開啟 ssh
使用預設的帳密，即可登入

> 預設帳密: [^default-login]
> uer: `pi`
> pwd: `raspberry` (記得登入之後改密碼)


[^default-login]: [SSH using Linux or Mac OS](https://www.raspberrypi.org/documentation/remote-access/ssh/unix.md)

## 安裝 node 管理器

先確定目前 node 的版本

```shell
node -v
```

先刪除原本的 node

```shell
sudo apt-get remove nodejs
```

### volta

```
$ curl https://get.volta.sh | bash
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 10930  100 10930    0     0   7120      0  0:00:01  0:00:01 --:--:--  7120
Error: Sorry! Volta currently only provides pre-built binaries for x86_64 architectures.
```

### nvm

在此使用 nvm 安裝 node

[安裝 nvm](https://github.com/nvm-sh/nvm#install--update-script)

```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 15916  100 15916    0     0   2997      0  0:00:05  0:00:05 --:--:--  3429
=> Downloading nvm from git to '/home/admin/.nvm'
=> 正複製到 '/home/admin/.nvm'...
remote: Enumerating objects: 360, done.
remote: Counting objects: 100% (360/360), done.
remote: Compressing objects: 100% (306/306), done.
remote: Total 360 (delta 40), reused 170 (delta 28), pack-reused 0
接收物件中: 100% (360/360), 219.83 KiB | 471.00 KiB/s, 完成.
處理 delta 中: 100% (40/40), 完成.
* (HEAD detached at FETCH_HEAD)
  master
=> Compressing and cleaning up git repository

=> Appending nvm source string to /home/admin/.bashrc
=> Appending bash_completion source string to /home/admin/.bashrc
=> Close and reopen your terminal to start using nvm or run the following to use it now:

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```
用 `nvm ls` 找一個適合的 node 版本。

```shell
$ nvm ls
            N/A
iojs -> N/A (default)
node -> stable (-> N/A) (default)
unstable -> N/A (default)
^[[Alts/* -> lts/hydrogen (-> N/A)
lts/argon -> v4.9.1 (-> N/A)
lts/boron -> v6.17.1 (-> N/A)
lts/carbon -> v8.17.0 (-> N/A)
lts/dubnium -> v10.24.1 (-> N/A)
lts/erbium -> v12.22.12 (-> N/A)
lts/fermium -> v14.21.3 (-> N/A)
lts/gallium -> v16.20.0 (-> N/A)
lts/hydrogen -> v18.16.0 (-> N/A)
```

安裝

```shell
$ nvm install --lts
Installing latest LTS version.
Downloading and installing node v18.16.0...
Downloading https://nodejs.org/dist/v18.16.0/node-v18.16.0-linux-arm64.tar.xz...
######################################################################################################## 100.0%
Computing checksum with sha256sum
Checksums matched!
Now using node v18.16.0 (npm v9.5.1)
Creating default alias: default -> lts/* (-> v18.16.0)
```

用 nvm 安裝好 node 之後。

```shell
$ node -v
v18.16.0
```

檢查是不是有多重安裝 node

```shell
$ which -a node
/home/admin/.nvm/versions/node/v18.16.0/bin/node
```

## 安裝 express

開個專案資料來，來安裝吧！
以下指令，一口氣弄到好！

```shell
mkdir code
cd code
mkdir express-demo
cd express-demo
npm init -y
npm install express --save
```

## 寫 hello world

打開文字編輯器

新增一個檔案 `app.js`

並且貼上這些 code

```javascript=
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
```

## 啟動 web service

回到 terminal 輸入

```shell
$ node app.js
Example app listening on port 3000!
```

開瀏覽器
接下來看 http://樹莓派的IP:3000
看見 `Example app listening on port 3000!` 就是成功啦！

![](https://hackmd.io/_uploads/Sk3E43Yw2.png)


看見 hello world 就完成第一步啦！

