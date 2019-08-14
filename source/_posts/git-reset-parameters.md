---
title: git reset <參數>
date: 2017-08-04 10:22:10
tags: 
- git
- "git reset"
categories: 
- 技術心得
---

# git reset <參數>

```
git reset <參數>
```

1. `--hard`
   跳到指定的 commit, 檔案狀態: 取消所有變更
2. `--soft`
   跳到指定的 commit, 檔案狀態: 保留所有變更, 變更會幫你 add 好了
3. `--mixed`
   跳到指定的 commit, 檔案狀態: 保留所有變更, 變更不會幫你 add 好
