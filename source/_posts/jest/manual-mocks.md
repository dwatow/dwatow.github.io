---
title: 翻譯 Manual Mocks
date: 2021-08-12 16:36:10
tags:
- jest
categories:
- 翻譯
---

# 翻譯 Manual Mocks

manual mock 被用在會吐出 mock data 的 stub。例如，取代存取一個遠端資源，像是網站或資料庫，你可能要建立一個允許你使用 fake data 的 manual mock。確保你的測試快速又不出錯

## Mocking user modules

> 在此舉例 user 模組要 mock 時，怎麼做

Manual mocks 只要建立子資料夾 `__mocks__/` 在裡面建立模組(`moduleName.js`)，即可定義好 mock 模組。例如: 在 `models` 資料夾中，要 mock 叫做 `user` 的模組。建立一個檔案叫 `user.js` 並放入 `module/__mocks__` 資料夾中。注意這個 `__mocks__` 資料夾的是 case-sensitive (大小寫視為不同名字) 所以命名成 `__MOCKS__` 會失效。

> 當我們要在測試中引入模組時, 直接寫呼叫 `jest.mock('./moduleName')` 是**必要的**

## Mocking Node modules

如果，你要模擬的是 node 模組 (例如: `lodash`)，mock 的 `__mocks__` 應該放在 `node_modules` 旁邊 (除非有設定 [roots](https://jestjs.io/docs/en/configuration#roots-arraystring) 定位到其它，不是這個專案 root 的資料夾) 並將被**自動** mock

:::info
**`roots [array<string>]`**

Default: `["<rootDir>"]`

A list of paths to directories that Jest should use to search for files in.

There are times where you only want Jest to search in a single sub-directory (such as cases where you have a `src/` directory in your repo), but prevent it from accessing the rest of the repo.

Note: While `rootDir` is mostly used as a token to be re-used in other configuration options, `roots` is used by the internals of Jest to locate **test files and source files**. This applies also when searching for manual mocks for modules from `node_modules` (`__mocks__` will need to live in one of the `roots`).

Note: By default, roots has a single entry `<rootDir>` but there are cases where you may want to have multiple roots within one project, for example `roots: ["<rootDir>/src/", "<rootDir>/tests/"]`.
:::
>

scoped module (含作用域的模組)可以籍由建立檔案在目錄結構來 mock，只要 scoped module 名稱相同。例如要 mock 一個叫 `@scope/project-name` 的 scoped module，就在 `@scope/` 底下新增檔案 `__mocks__/@scope/project-name.js`

> 警告: 若要模擬 node 的核心模組 (例如: fs 或 path)，請直接寫呼叫，像 `jest.mock('path')` 是**必要的**
> 因為 node 核心模組預設不被 mock

## Examples

```bash
.
├── config
├── __mocks__
│    └── fs.js
├── models
│    ├── __mocks__
│    │    └── user.js
│    └── user.js
├── node_modules
└── views
```

當存在一個 manual mock，Jest 的模組系統會使用 `jest.mock('moduleName')` 呼叫這個模組。

然而，當 `automock` 設為 `true`，即使未呼叫 `jest.mock('moduleName')`， manual mock 實作將被用來取代自動產生的 mock。取消 mock ，你將需要在你的測試直接呼叫 `jest.unmock('moduleName')`

> 為了正確的 mock ，Jest 需要 `jest.mock('moduleName')` 和 require/import 語句，在同一個作用域中

下面是一個瞎造的例子，提供特定資料夾中所有檔案摘要模組。在這個模組裡有使用(內建的) fs 模組。

```javascript
// FileSummarizer.js
'use strict';

const fs = require('fs');

function summarizeFilesInDirectorySync(directory) {
  return fs.readdirSync(directory).map(fileName => ({
    directory,
    fileName,
  }));
}

exports.summarizeFilesInDirectorySync = summarizeFilesInDirectorySync;
```

由於我們希望測試避免真實的磁碟存取 (因為它很慢又脆弱)，因此我們透過自動 mock 建立一個 fs 的 manual mock。我們的 manual mock 將實現一個可以建立我們的測試的特製版 API 。

```javascript=
// __mocks__/fs.js
'use strict';

const path = require('path');

const fs = jest.genMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath) {
  return mockFiles[directoryPath] || [];
}

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;

module.exports = fs;
```

現在，我們要寫測試。但注意，我們需要對我們要模擬的 node 核心模組直接呼叫 `jest.mock()`

```javascript=
// __tests__/FileSummarizer-test.js
'use strict';

jest.mock('fs');

describe('listFilesInDirectorySync', () => {
  const MOCK_FILE_INFO = {
    '/path/to/file1.js': 'console.log("file1 contents");',
    '/path/to/file2.txt': 'file2 contents',
  };

  beforeEach(() => {
    // Set up some mocked out file info before each test
    require('fs').__setMockFiles(MOCK_FILE_INFO);
  });

  test('includes all files in the directory in the summary', () => {
    const FileSummarizer = require('../FileSummarizer');
    const fileSummary = FileSummarizer.summarizeFilesInDirectorySync(
      '/path/to',
    );

    expect(fileSummary.length).toBe(2);
  });
});
```

在這的 mock 使用 [`jest.genMockFromModule`](https://jestjs.io/docs/en/jest-object#jestgenmockfrommodulemodulename) 來自動產生 mock，覆寫預設的行為。推薦使用這種做法，但是不強迫。若你根本不想自動 mock 模組的全部功能，你可以從你的 mock file 中匯出你寫的函數。一個不利於全面 manual mocks 的原因是它是手動的，意思是你已手動更新它們在它們改版時。因此，最好在滿足需求之餘，使用自動 mock。

為了確保同步 manual mock 和真正的實作，在 manual mock 中使用 [`jest.requireActual(moduleName)`](https://jestjs.io/docs/en/jest-object#jestrequireactualmodulename) 在你的 manual mock 中，並修正 mock 掉的功能。

此例的程式碼，可在 [`examples/manual-mocks`](https://github.com/facebook/jest/tree/master/examples/manual-mocks) 中找到。

## Using with ES module imports

若你使用 ES 的語法模組引用，通常會把 import 寫在測試文件的最上面。但是通常你要叫 Jest 使用 mock 前使用它。因此 Jest 將自動的宣告 (hoist) `jest.mock` 在模組的最上面 (導入之前)。

欲知詳情，參考這個 [repo](https://github.com/kentcdodds/how-jest-mocking-works)

## Mocking methods which are not implemented in JSDOM

js-dom 中未實現的方法

> 要在 jest.config.js 改 testEnvironment: "jsdom" (它是 default)
> https://www.npmjs.com/package/jsdom

如果某些代碼使用尚未實現JSDOM（Jest使用的DOM實現）的方法，則測試起來並不容易。 這是例如 window.matchMedia（）的情況。 Jest 返回TypeError：window.matchMedia不是一個函數，不能正確執行測試。

在這種情況下，在測試文件中模擬matchMedia應該可以解決此問題：

```javascript=
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

若 `window.matchMedia()` 被用在一個 function (或 method) 它能在測試中正常運作。
若 `window.matchMedia()` 被直接執行在這個測試檔案，Jest 會回報一樣的錯誤。
在這個案例，解決方式是移動 manual mock 到獨立檔案中，並且在測試檔案引用。

```javascript=
import './matchMedia.mock'; // Must be imported before the tested file
import {myMethod} from './file-to-test';

describe('myMethod()', () => {
  // Test the method here...
});
```