---
title: 在 Mac OS X 用 Bash 安裝 git auto complete
date: 2018-09-21 20:45:38
tags:
- git
categories:
- macOS
---

# 在 Mac OS X 用 Bash 安裝 git auto complete

在 terminal 下，我們都會想要按 tab 就出現指令的自動補完

```shell
$ git com
```

在這時按鍵盤的 tab

```shell
$ git commit
```

會自動補完已知的指令，心中有一種「 terminal 你懂我」的暖心

最近有朋友安裝失敗，調查了之後發現因為最近 git 改版較快的關係。
有了一些不相容的調整。

所以安裝失敗的朋友，可以參考看看^[[.git-completion.bash producing error on macOS Sierra 10.12.6](https://apple.stackexchange.com/questions/327817/git-completion-bash-producing-error-on-macos-sierra-10-12-6/327905)]

## 問題描述

若是按照目前 google 到的安裝方式，一步一步安裝好，卻出現下列問題的，也適用於這篇文章。

```shell
$ git com
```

按下 tab 之後變成

```shell
$ git comUnknown option: --list-cmds=list-mainporcelain,others,nohelpers,alias,list-complete,config
usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]
  [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
  [-p | --paginate | --no-pager] [--no-replace-objects] [--bare]
  [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
  <command> [<args>]
```

這也太嚇人了！怎辦？！
:::danger
不用擔心，電腦還沒有弄壞!!
:::

## 正片開始

### 運用 homebrew 安裝 bash-complete

一開始還是先用 brew 安裝

```shell
$ brew install bash-completion
```

然後我們來看看已安裝好的 `bash-completion` 的資訊

```shell
$ brew info bash-completion
bash-completion: stable 1.3 (bottled)
Programmable completion for Bash 3.2
https://salsa.debian.org/debian/bash-completion
Conflicts with:
  bash-completion@2 (because Differing version of same formula)
/usr/local/Cellar/bash-completion/1.3_3 (189 files, 608.6KB) *
  Poured from bottle on 2017-09-22 at 16:40:34
From: https://github.com/Homebrew/homebrew-core/blob/master/Formula/bash-completion.rb
==> Caveats
Add the following line to your ~/.bash_profile:
  [ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion

Bash completion has been installed to:
  /usr/local/etc/bash_completion.d
```

它提醒 要在 `~/.bash_profile` 檔裡面添加這一行

```
[ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion
```

要注意版本的匹配

```
bash 3.x -> bash-complete 1.3
```

### 手動增加 complete 腳本檔

### 確認 Git 版本

首先，先確定你的 Mac 安裝的是哪個版本的 git

```shell
$ git --version
git version 2.17.0
```

> 版本要注意
> 目前安全的 Git 版本為 2.17.1、2.16.4、2.15.2、2.14.4 以及 2.13.7 等等，請大家盡速更新！^[[Git 再次出現嚴重漏洞](https://www.facebook.com/will.fans/posts/2110406082321858)]

**提外話，用 brew 安裝 git**
安裝完 bash 會自動指向 brew 安裝的路徑。

:::warning
在此，要小心!!!
:::

確定版本之後，要去 github 找 [git-completion.bash](https://github.com/git/git/blob/master/contrib/completion/git-completion.bash)

並且，找到與你的 git 匹配的 版本。

![](https://i.imgur.com/Y8mGl4A.png)

找到之後，網址會改變。

就把 git 更新到最新版，就可以

```shell
$ cd /usr/local/opt/bash-completion/etc/bash_completion.d
$ curl -L -O https://raw.github.com/git/git/master/contrib/completion/git-completion.bash
$ brew unlink bash-completion
$ brew link bash-completion
```

到此，就安裝完囉
