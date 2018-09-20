---
title: 讓 Code review 再也不會出現 Coding Style 的問題
date: 2018-09-20 16:50:20
tags: ['prettier', 'husky']
categories: 工具使用
---

# 讓 Code review 再也不會出現 Coding Style 的問題

用 prettier 當作整理程式碼的工具，希望可以在每一次操作 `git commit` 之前，一定可以跑過一次。
用 husky 可以 package.json 加上 hook 。

## 安裝

prettier[^prettier]

```shell
npm install --save-dev --save-exact prettier
```

husky[^husky]

```shell
$ npm install husky@next --save-dev
```

## 設定

在 **package.json** 中
加上 prettier 的指令
加上 husky 的設定

```json=
{
//..."",
  "scripts": {
    //...
    "prettier": "prettier --write *.js && git add -u"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run prettier"
    }
  },
//...
}
```

其中 `prettier --write *.js && git add -u` 指令，是本文的重點呀！

- `prettier --write *.js` 主要是提供 `prettier` 一個放置 .js 檔的路徑

## 執行

```shell
$ git commit -m "some message"
```

就會執行 prettier 並且覆寫回原本的檔案。
讓你的 Coding style 保持一致!!

[^husky]: [husky](https://github.com/typicode/husky)

[^prettier]: [prettier](https://prettier.io/)
