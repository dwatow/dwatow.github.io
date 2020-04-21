---
title: 讀 Jest Doc - 建置測試環境
date: 2020-04-17 11:23:21
tags:
- jest
- "unit testing"
categories:
- 技術練習
---

# 讀 Jest Doc - 建置測試環境

新系列！(感覺很像 Youtuber)
最近，其實從 3 月開始就和神 Q 超人、好想的夥伴們一起讀 Jest 文件。
也歡迎在星期四晚上和我們來聚會哦。

這系列就是在督促自己要補一下進度，並且好好的把 Jest 學好。
也希望可以順著 Jest 的文件，補一下測試觀念到裡面來。

# 在上古世界，都怎麼測試程式行為？[^cppunit]

[^cppunit]: [Simple Test Case - CppUnit 食譜](https://dwatow.gitbook.io/cppunit-cookbook-in-traditional-chinese/simple_test_case)

通常用哪些手法，如何確保程式碼執行呢？

1. 使用 debugger
2. 使用鷹架程式碼 (`console.log` 之類的東西)
3. 單元測試

## 優缺點比較

**使用 debugger**

仔細的一步步透過 debugger 執行是方法，夠仔細。
但它不會主動的告訴你程式碼該注意的地方。
最好是每次修改都得跑一次 debugger 來檢查一次，很花時間。
不需產生不必要的程式碼在產品程式碼中。

**使用鷹架程式碼**

鷹架程式碼也不錯，但是它讓程式碼醜掉了。
也許搭配條件編輯是個不錯的點子，但是在開發版寫久了鷹架，就會在你不需要訊息的時機印出所有的除錯資訊給你。
主動提供程式碼的狀態資訊，確保是否正常。

**單元測試**

用單元測試，會自動回報程式碼狀況。
Jest 的單元測試很容易建立，而且只要你有寫，就會來帶程式碼愈改品質愈高的信心。
缺點，應該就是需要花時間學習，通常單元測試最難的事，就是寫第一個測試！

接下來，就讓我們從建置 Jest 的環境開始吧！

# Getting Started

第一回，我們開始來建立環境。
建立環境也是開發能力的一環呀，萬事起頭難，難在一次只做一次就不再用了。
也就是說，歷經的案子夠多，建置環境的步驟才會夠熟悉。

話不多說，就開始吧

## 建立環境

在根目錄建立 npm project
安裝開發工具 jest

```
npm init -y
npm install --save-dev jest
```

## 寫程式

建立聚會日期的資料夾，進入

建立產品程式的模組

**sum.js**

```javascript
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

產品程式進入點

**app.js**

```javascript
const sum = require('./sum');

console.log(sum(1, 2));
```

執行

```shell
chris$ node ./2020-03-12/app.js 
3
```

## 測試

**sum.test.js**

```javascript
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

執行測試

```shell
chris$ npx jest
 PASS  2020-03-12/sum.test.js
  ✓ adds 1 + 2 to equal 3 (4ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        2.284s
Ran all test suites.
```

# 使用

可以直接用 cli 執行。([看更多](https://jestjs.io/docs/en/cli))

```shell
jest my-test --notify --config=config.json
```

- my-test: 指定自己的檔案
- `--notify`: 給一個推播
- `--config=config.json`: 指定 config 檔 (config.json)

## Jest 的 config

叫出 config

```shell
jest init
```

```shell
chris$ npx jest --init

The following questions will help Jest to create a suitable configuration for your project

✔ Would you like to use Jest when running "test" script in "package.json"? … yes
✔ Choose the test environment that will be used for testing › node
✔ Do you want Jest to add coverage reports? … yes
✔ Automatically clear mock calls and instances between every test? … yes

✏️  Modified /Users/chris/code/UnitTestByJest/package.json

📝  Configuration file created at /Users/chris/code/UnitTestByJest/jest.config.js
```

這樣就產生了 jest.config.js

# Babel

在使用之前，先把程式碼改成 ES6 的語法

**sum.js**

```javascript
const sum = (a, b) => a + b;
module.exports = sum;
```

**sum.test.js**

```javascript
import sum from "./sum";

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

跑測試，試看看是不是會出錯。

```shell
chris$ npx jest
 FAIL  2020-03-12/sum.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    This usually means that you are trying to import a file which Jest cannot parse, e.g. it's not plain JavaScript.

    By default, if Jest sees a Babel config, it will use that to transform your files, ignoring "node_modules".

    Here's what you can do:
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/en/configuration.html

    Details:

    /Users/chris/code/UnitTestByJest/2020-03-12/sum.test.js:1
    ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,global,jest){import sum from "./sum";
                                                                                             ^^^^^^

    SyntaxError: Unexpected token import

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1059:14)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        0.846s, estimated 2s
Ran all test suites.
```

在此，確定需要 Babel ，就可以安裝

```shell
chris$ npm install -D babel-jest @babel/core @babel/preset-env
+ babel-jest@25.1.0
+ @babel/core@7.8.7
+ @babel/preset-env@7.8.7
added 90 packages from 16 contributors, updated 2 packages and audited 1208611 packages in 19.43s

24 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

新增 babel.config.js

```javascript
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};
```

再跑看看

```shell
chris$ npx jest
 PASS  2020-03-12/sum.test.js
  ✓ adds 1 + 2 to equal 3 (8ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.359s
Ran all test suites.
```

成功囉~

## 下回見 (Youtube style 結尾)

喜歡的話歡迎訂閱、按讚、分享。
有任何問題也歡迎在下方留言討論。

如果想參加聚會的話，可以私訊給我哦~
我們下一篇見