---
title: 實戰 Webpack 的 file-loader 和 url-loader
date: 2018-12-29 23:06:43
tags: [webpack]
categories: '技術心得'
---
# 實戰 Webpack 的 file-loader 和 url-loader

## 用途

Webpack 在處理檔案時，可以使用 file-loader^[[file-loader](https://github.com/webpack-contrib/file-loader)] 進行處理。
後來發現一些小的 icon 檔圖 image 檔，會為了幾 KB 的大小而進行 Web API 的請求來來回回幾次很浪費時間，所以，出現了 url-loader^[[url-loader](https://github.com/webpack-contrib/url-loader)] 將這些小檔案變成 base64 的格式放在前端。

## url-loader & file-loader 的關係

套件 url-loader 有和 file-loader 有相依性
url-loader 預設超過 limit 參數大小的檔案，會傳給 file-loader 處理。

## 安裝

url-loader 和 file-loader 都要安裝。

```shell
npm install url-loader file-loader --save-dev
```

## 使用

在 Webpack 設定，只需要設定 url-loader 即可，因為 url-loader 有一個 `fallback`[^url-loader.fallback] 參數，預設值是 `file-loader` ，所以在預設的情況下，會呼叫 file-loader，不用另外設定。

在 url-loader 的 options 中，其實和 file-loader 是共用的，可以將 file-loader 的參數也設定在其中。

**example**

[^url-loader.fallback]: [fallback - url-loader](https://github.com/webpack-contrib/url-loader#fallback)

```javascript=
module.exports = {
  //...
  module: {
    rules: [{
      test: /\.(woff|woff2|eot|ttf|otf|png|svg|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 1000, //bytes
          name: '[hash:7].[ext]',
          outputPath: 'assets'
        }
      }
    }]
  }
};
```

> file-loader 的輸入是依照程式碼裡的檔案路徑，找到相對應的檔案之後，輸出成 webpack config 指定的位置與檔名格式。
>
> url-loader 不會變檔案，所以沒有指定檔名格式的參數。
