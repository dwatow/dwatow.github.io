---
title: Webpack Loader 初探
date: 2018-03-17 11:04:05
tags:
- nodejs
- webpack
- vue
- webpack loader
- JavaScript
categories:
- 工具使用
---

# Webpack Loader 初探

> 為了 vue-cli 而看 webpack ，由於 webpack 看了 webpack loader。

## 快速上手

以 [webpack 官網的測試程式](https://webpack.js.org/contribute/writing-a-loader/#testing)為例，先來快速上手一波吧!!!

### 安裝

```shell
npm install --save-dev webpack memory-fs jest babel-jest babel-preset-env
```

### 檔案

```
testloader
├ src
│ └ loader.js
├ test
│ ├ example.txt
│ ├ compiler.js
│ └ loader.test.js
├ .babelrc
└ package.json
```

:::danger
為了方便在 node.js 上執行，我們將模組化改寫成 CommonJS
:::

**.babelrc**

```javascript=
{
  "presets": [[
    "env",
    {
      "targets": {
        "node": "4"
      }
    }
  ]]
}
```

**src/loader.js**

```javascript=
const getOptions = require("loader-utils").getOptions;

module.exports = function loader(source) {
  const options = getOptions(this);

  source = source.replace(/\[name\]/g, options.name);

  return `module.exports = ${JSON.stringify(source)}`;
};
```

**test/example.txt**

```
Hey [name]!
```

**test/compiler.js**

```javascript=
const path = require("path");
const webpack = require("webpack");
const memoryfs = require("memory-fs");

module.exports = (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.txt$/,
          use: {
            loader: path.resolve(__dirname, "../src/loader.js"),
            options: {
              name: "Alice"
            }
          }
        }
      ]
    }
  });

  compiler.outputFileSystem = new memoryfs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);

      resolve(stats);
    });
  });
};
```

**test/loader.test.js**

```javascript=
const compiler = require("./compiler.js");

test("Inserts name and outputs JavaScript", async () => {
  const stats = await compiler("example.txt");
  const output = stats.toJson().modules[0].source;

  expect(output).toBe(`module.exports = "Hey Alice!\\n"`);
});
```

**package.json**

```javascript=
"scripts": {
  "test": "jest"
}
```

### 執行

```shell=
$ npm run test

> chris-loader@1.0.0 test /Users/chris/code/chris-loader
> jest

 PASS  test/loader.test.js
  ✓ Inserts name and outputs JavaScript (438ms)


Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.837s, estimated 2s
Ran all test suites.
```

## 解析

在此的順序從最外面看到裡面。

### 單元測試框架 Jest

官網網址: https://facebook.github.io/jest/

在此特別將網址露出來的原因，是請注意網址開頭是 `facebook` ，從 `https://facebook.github.io` 進入的話，會重新轉址到 `https://code.facebook.com/` ，一個 facebook 的 open source 平台。

看來 jest 是一個 facebook 釋出的 unit test 框架。

來看看它的教學文件裡，給的一段範例程式碼[^jest-getting-started]

```javascript=
const sum = require("./sum");
test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
```

與上面的這一段比較

**test/loader.test.js**

```javascript=
const compiler = require("./compiler.js");

test("Inserts name and outputs JavaScript", async () => {
  const stats = await compiler("example.txt");
  const output = stats.toJson().modules[0].source;

  expect(output).toBe(`module.exports = "Hey Alice!\\n"`);
});
```

發現屬於 jest 的部份是這樣[^unit-test-structor]

```javascript=
test("test topic", function callback() {
  // Arrange
  // Act
  // Assert
  expect(result).toBe(answer);
});
```

所以，我們將 callback 獨立取出來執行。
仔細看會發現，這是一個 `async, await` 的函數

### Async Function

從 **test/compiler.js** 觀察，發現 `complier` 最後回傳的是 Promise，所以可以使用 `async function` 執行[^async-await-bible]

可以將程式改寫成這樣，即可印出 loader 的結果。

```javascript=
const compiler = module.require("./compiler.js");

async function go() {
  const stats = await compiler("example.txt");
  console.log(stats.toJson().modules.shift().source);
}

go();
```

### 看看 Loader 的 code

在 webpack 的官網文件中，直接給一個具體而微的 loader 來看看它做了什麼事吧！(在此有再改寫一下，比較接近其它 loader 的寫法。)

**src/loader.js**

```javascript=
var loaderUtils = require("loader-utils");

module.exports = function loader(source) {
    const options = .getOptions(this).getOptions;

    //取代字串中的 "[name]" 成為 config 裡設定的名字
    source = source.replace(/\[name\]/g, options.name);

    return `module.exports = ${ JSON.stringify(source) }`;
};
```

觀察它與 `webpack.config.js` 之間的關聯，並且反覆把玩一下這段程式碼可以了解

1. 輸入的 source 是「文件」，在設定檔的 entry 裡
1. 輸入的 option 是「loader 參數」，在設定檔的 module 裡
1. 輸出的字串，必須是 JavaScript 的模組。

## 所以我說 Loader 是一個什麼？

loader 在 webpack 的用途，在官網寫得很清楚。

> 在 webpack 裡想要編寫 JS 其它語言，就要用 loader 系列的套件。它們將其它語言變成 JS 。這麼一來才可以讓 webpack 看得懂

用過渡簡化的模型來解釋，是一個字串轉換器。
再精確一點，就是「將非 JS 的文字資料，透過 options 的設定，轉換成 JavaScript Module」

如果畫個圖，可以這樣畫。

```
              |
              | options
              v
        +------------+  JavaScript
 entry  |            |      Module
------> |   loader   | ----------->
        |            |
        +------------+
```

# 參考資料

<!-- prettier-ignore-start -->
[^jest-getting-started]: [Getting Started · Jest](https://facebook.github.io/jest/docs/en/getting-started.htmlGetting)
[^unit-test-structor]: [\[Day 3\]動手寫 Unit Test, 3A 原則](https://ithelp.ithome.com.tw/articles/10102643)
[^async-await-bible]: [\[JavaScript\] ES7 Async Await  聖經, 3- Constructing Async function](https://medium.com/@peterchang_82818/javascript-es7-async-await-%E6%95%99%E5%AD%B8-703473854f29-tutorial-example-703473854f29)
<!-- prettier-ignore-end -->
