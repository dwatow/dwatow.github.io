---
title: hash 練習
date: 2024-12-05 17:43:05
tags:
- hash
categories:
- 工具使用
---

# hash 練習

```javascript=
const crypto = require('crypto')
// 產生演算法
const hash = crypto.createHash('sha256')
// 將 1 字串進行雜湊
hash.update('1')
// 將雜湊的結果取得 16 進制結果
hash.digest('hex')
```
