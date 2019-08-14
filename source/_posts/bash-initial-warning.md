---
title: bash 開啟出現錯誤訊息
date: 2019-04-16 09:42:18
tags: 
- bash
- awk
categories: 
- macOS
---

# bash 開啟出現錯誤訊息

## 問題描述

開啟 bash 時，初始化會出現錯誤訊息

```shell
Last login: Fri Apr 12 19:22:12 on ttys002
dyld: Library not loaded: /usr/local/opt/readline/lib/libreadline.7.dylib
  Referenced from: /usr/local/bin/awk
  Reason: image not found
dyld: Library not loaded: /usr/local/opt/readline/lib/libreadline.7.dylib
  Referenced from: /usr/local/bin/awk
  Reason: image not found
$ ## bash 啟動之後 第一次可以下指令的位置
```

## 解決方式

有些解決方式建議重裝 bash ，但是已試過無用。

重新安裝 gawk[^brewgawk] (GNU awk)

```shell
brew upgrade gawk
```

竟然就好了。
提供給遇到相同的問題的人參考

<!-- prettier-ignore-start -->
[^brewgawk]: [mac Referenced from: /usr/local/bin/awk 問題](https://blog.csdn.net/qq_22833925/article/details/78871364)
<!-- prettier-ignore-end -->
