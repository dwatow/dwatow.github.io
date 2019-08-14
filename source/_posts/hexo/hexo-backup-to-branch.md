---
title: Hexo 備份 md 檔
date: 2019-01-03 19:27:41
tags: 
- hexo
- git
- npm
categories: 
- 技術心得
---
# Hexo 備份 md 檔到另一個分支

## 源由

因為 `hexo g -d` 只會幫你上傳 `public` 。對於 `.md` 檔的備份，hexo 似乎沒有提供什麼解決方案。

## 步驟


先將 repo 加上 `git`

```shell
git init
```

再加上 remote

```shell
git remote add origin git@...
```

第一次先將檔案加進 git

```shell
git add . # git add 要少用
git commit -m "first commit"
```

最後，要把檔案上傳，但是不能上傳 `master`
在此使用 `source` 當分支名稱

所以，我們要將 local 的 master 上傳到 remote 的 source

```shell
git push origin master:source
```

最後，就只要將這個指令，加到 `npm` 裡面

```json
{
  script: {
    backup: 'git push origin master:source'
  }
}
```

最後只要這樣，就可以上傳備份囉

```shell
npm run backup
```
