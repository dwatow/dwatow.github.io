---
title: 讓 Code review 再也不會出現 Coding Style 的問題
date: 2018-09-20 16:50:20
tags: ["prettier", "husky"]
categories: 工具使用
---

# 讓 Code review 再也不會出現 Coding Style 的問題

用 prettier 當作整理程式碼的工具，希望可以在每一次操作 `git commit` 之前，一定可以跑過一次。
用 husky 可以 package.json 加上 git hook 。

## 原生 JS

### 安裝

prettier[^prettier]

```shell
$ npm install --save-dev --save-exact prettier
```

husky[^husky]

```shell
$ npm install husky@next --save-dev
```

### 設定

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
  }
  //...
}
```

其中 `prettier --write *.js && git add -u` 指令，是本文的重點呀！
`prettier --write *.js` 主要是提供 `prettier` 一個放置 .js 檔的路徑

### 執行

```shell
$ git commit -m "some message"
```

就會執行 prettier 並且覆寫回原本的檔案。
讓你的 Coding style 保持一致!!

## 和 webpack 一起用 prettier

使用 [prettier-loader](https://github.com/iamolegga/prettier-loader)[^prettier-loader]

> 不要使用下列這些舊選擇
>
> - [prettier-webpack-loader](https://github.com/hawkins/prettier-webpack-loader)
> - [prettier-webpack-plugin](https://github.com/hawkins/prettier-webpack-plugin)

### 安裝

```shell
npm install prettier-loader --save-dev
```

### webpack 設定

**webpack.config.js**

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "prettier-loader",
          enforce: "pre",
          exclude: /node_modules/
        }
      }
    ]
  }
};
```

**.prettierrc**

- options (.prettierrc) 的[設定文件](https://prettier.io/docs/en/options.html)
- resolveConfigOptions 的[設定文件](https://prettier.io/docs/en/api.html#prettierresolveconfigfilepath-options)

```javascript
{
  trailingComma: 'es5',
  tabWidth: 4,
  trailingComma: 'all',
}
```

[^husky]: [husky](https://github.com/typicode/husky)
[^prettier]: [prettier](https://prettier.io/)
[^prettier-loader]:

  [prettier-loader](https://github.com/iamolegga/prettier-loader)
