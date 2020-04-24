---
title: 讀 Jest Doc - 測試替身
date: 2020-04-24 08:33:07
tags:
- jest
- mock
- stub
- spy
- "test double"
categories:
- 技術練習
---
# 測試替身

戲劇演員的替身, 在英文裡叫 body double 或 stunt double[^double]
[^double]: ["替身", "分身" 的英文怎麼說?](http://blogs.teachersammy.com/Blogs/entry/how-to-describe-doubles-clones-twins-in-English)

**待測物與相依元件**[^sut-doc]

- **SUT**：System Under Test 或 Software Under Test 的簡寫，代表**待測程式**。
- **DOC**：Depended-on Component (相依元件)，又稱為 Collaborator (合作者)。DOC 是 SUT 執行的時候會使用到的元件。

[^sut-doc]: [Test Double（1）：什麼是測試替身？ - 搞笑談軟工](http://teddy-chen-tw.blogspot.com/2014/09/test-double1.html)

在實案例中，模組之間是會相依在一起的，執行單元測試時，要視情況將「與外部溝通」的相依元件進行替換，這是一種不修改產品 code 的替換手法，例如有些情況，是不確定相依元件的穩定性，而進行 test double 的替換。[^when-to-use-it]

[^when-to-use-it]: [When To Use It - Test Double at XUnitPatterns.com](http://xunitpatterns.com/Test%20Double.html)

1. 一來保持測試速度都是在記憶體內完成，不會到讀寫檔案、Web API...等，與外部資源互動而拖長測試時間。
2. 針對問題的範圍進行測試，可以視情況的縮小 specical case，也就是說，可以讓 SUT 不依賴原本的 DOC 也可以測試。

在 [xunitpatterns](http://xunitpatterns.com/Test%20Double.html) 裡特別分成五種 Test Double
分別是 Dummy Object、Test Stub、Test Spy、Fake Object 與 Mock Object。

其實，就是假的，到超級假的等級區分。

```
No Implement > Dummies > Stubs > Spies > Facke > Real Implement
```

常見的術語，只要知道 Stub、Spy、Mock

- Stub: 回傳 hack-code 內容。
- Spy: 跟著真實本體，告訴你他發生了什麼。
- Mock: 假的本體替身，看他身上的痕跡，了解他發生了什麼。

> 如果說 jest.fn 能夠作為一個 Function 的替身，那麼 jest.mock 就是能模擬整個模組的 Mock！
> -- 神Ｑ超人

**jest.spyOn()**

> SUT 一直享受著假資料帶來的美好，當過程中動用到 DOC 邏輯等或修改回傳值時。上線時卻會有「什麼！這傢伙怎麼會回傳這種東西？測試明明就沒有錯！」之類的慘劇發生。
> 
> 但是 jest.spyOn() 不同，它會去重現 DOC 的邏輯，即使在任何時候修改了它的任何內容都一樣，SUT 在測試時便會發現 DOC 已經和之前測試時有所不同，不論是邏輯、回傳值等等，這時候捕獲了真實資料的測試結果才會有效。
> 
> 那 jest.mock() 整個那麼假，可以用在哪裡？用在模擬無法重現邏輯、或者根本不會去變動的第三方套件時。
> -- 神Q超人

## 那 Mock 要怎麼用？

**Q: 是不是一次只測一個 function 其它都 mock 掉呢？**
**Q: 模組相依一起測算是整合測試嗎？**

這些問題，也許可以用[探討單元測試和整合測試的涵蓋範圍](https://ithelp.ithome.com.tw/articles/10229734)來解答

重點: 

1. 單元測試有兩派: 孤立型（Solitary）or 社交型（Sociable）
2. 如果你是 BDD 或 TDD 的實踐者，那麼你的單元測試就可能是跨多個類別的 社交型單元測試，因為測試的對象是 一個行為，而非一個類別。
3. 2017 年，[Uncle Bob 在 Twitter 有對網友說明](https://twitter.com/unclebobmartin/status/943552605950750721) TDD 單元測試的對象是一個"行為"，而非一個"方法"

# Mock Functions

Mock 函數有這些作用

- 取代真正的函式程式碼 (建立替身函數)
- 替代函式被呼叫與接收參數 (呼叫替身函數)
- 當 new 一個物件實例時，替代物件實例的建構式，指定函式回傳值 (指定替身函數回傳值)

有兩種方式可以擁有 mock functions

1. 建立在測試用的 mock 函數
2. 手動 mock 覆蓋相依模組

## Using a mock function

Let's imagine we're testing an implementation of a function forEach, which invokes a callback for each item in a supplied array.

假設我們寫了一個 `forEach` 想要測試它，而執行它，需要 Array 和 callback 當作參數。

```javascript
function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}
```

為了要測試 forEach，可以使用一個 mock function ，並且檢查它被呼叫的情況。

```javascript
const mockCallback = jest.fn(x => 42 + x);
forEach([0, 1], mockCallback);

// The mock function is called twice
expect(mockCallback.mock.calls.length).toBe(2);

// The first argument of the first call to the function was 0
expect(mockCallback.mock.calls[0][0]).toBe(0);

// The first argument of the second call to the function was 1
expect(mockCallback.mock.calls[1][0]).toBe(1);

// The return value of the first call to the function was 42
expect(mockCallback.mock.results[0].value).toBe(42);
```

## `.mock` property

每個 mock function，都有一個叫 `.mock` 的屬性，裡面會記載著 function 如何被呼叫、丟了什麼參數，回傳什麼回傳值。隨著 JavaScript 的持性， mock function 也會記得每次被呼叫時的 `this` 是誰。

```javascriptconst myMock = jest.fn();

const a = new myMock(); // 第一次呼叫
 const b = {
    name: "b"
  };
const bound = myMock.bind(b);
bound(); // 第二次呼叫

console.log(myMock.mock.instances);
// > [ <a>, <b> ]

// 實際測出來，這樣印較清楚
console.log(myMock.mock.instances.constructor.name, "\n", JSON.stringify(myMock.mock.instances));
```

實測印出

```shell
  console.log 2020-04-16/mock.test.js:11
    Array 
     [{},{"name":"b"}]
```
mock 物件的內容，用在斷言下面幾種情況

1. mock function 吃什麼參數
1. mock function 在測試中的回傳值
1. mock function new 了幾個實例

下面的實際執行程式碼，也可以直接翻譯。

```javascript
test('mock object of mock function as call mockFunction', () => {
  const someMockFunction = jest.fn(() => 'return value');
  someMockFunction('first arg', 'second arg');

  // someMockFunction.假物件屬性.呼叫.次數
  expect(someMockFunction.mock.calls.length).toBe(1);
  
  // someMockFunction.假物件屬性.呼叫[第幾次][第幾個參數]
  expect(someMockFunction.mock.calls[0][0]).toBe('first arg');
  expect(someMockFunction.mock.calls[0][1]).toBe('second arg');
  
  // someMockFunction.假物件屬性.回傳值[第幾次]
  expect(someMockFunction.mock.results[0].value).toBe('return value');
});
  
test('mock object of mock function as new mockFunction', () => {
  const someMockFunction = jest.fn();
  const a = new someMockFunction();
  a.name = 'test';
  const b = new someMockFunction();  

  // someMockFunction.假物件屬性.用 new 呼叫.次數
  expect(someMockFunction.mock.instances.length).toBe(2);

  // someMockFunction.假物件屬性.用 new 呼叫[第幾次]的物件.name
  expect(someMockFunction.mock.instances[0].name).toEqual('test');
});
```

## Mock Return Values

**執行假物件的回傳值**，可以在呼叫前 `mockReturnValueOnce` 快速設定。
不用寫任何邏輯的方式，直接設定回傳值。

```javascript
test('return Value of mock function', () => {
  const myMock = jest.fn();
  
  // console.log(myMock());
  // > undefined
  expect(myMock()).toBeUndefined();

  myMock.mockReturnValueOnce(10)
        .mockReturnValueOnce('x')
        .mockReturnValue(true);

  // console.log(myMock(), myMock(), myMock(), myMock());
  // > 10, 'x', true, true
  expect(myMock()).toBe(10);
  expect(myMock()).toBe('x');
  expect(myMock()).toBe(true);
  expect(myMock()).toBe(true);

  console.log(JSON.stringify(myMock.mock.results));
});
```

```shell
  console.log 2020-04-16/returnValue.test.js:19
    [{
      "type":"return"
    }, {
      "type":"return","value":10
    }, {
      "type":"return","value":"x"
    }, {
      "type":"return","value":true
    }, {
      "type":"return","value":true
    }]
```

在呼叫之前，直接塞回傳值。取代真實行為時，避免需要複雜的 stub

```javascript

test('mock to stub', () => {
  const filterTestFn = jest.fn();

  filterTestFn
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(false);

  const result = [11, 12].filter(num => filterTestFn(num));

  console.log(result);
  // > [11]
  console.log(filterTestFn.mock.calls);
  // > [ [11], [12] ]
});
```

實際上，該 mock 掉的都是一些相依套件的情況。
但是技術上是相同的，避免在假物件內實作測不到的邏輯

## Mocking Modules

來看看更接近真實案例的 code，對 axios 進行 mock！

```javascript
// users.js
import axios from 'axios';

class Users {
  static all() {
    return axios.get('/users.json').then(resp => resp.data);
  }
}

export default Users;
```

為了不要真的發送 API 又不修改 axios，又要執行測試，就是要把 axios 模組給 mock 起來。

mock 好了之後，`axios.get()` 就變成 mock function ，可以用 `.mockResolvedValue` 設定它回傳 prmise 時，裡面要帶什麼值。

```javascript
// users.test.js
import axios from 'axios';
import Users from './users';

jest.mock('axios');

test('should fetch users', () => {
  const users = [{name: 'Bob'}];
  axios.get.mockResolvedValue({
    data: users
  });

  return Users.all().then(data => expect(data).toEqual(users));
  
});
```

或者用 `axios.get.mockImplementation(() => Promise.resolve(resp))` 也可以

> 這幾個差在哪？
mockResolvedValue: 直接定回傳 promise
mockImplementation: 實作 function 內容
jest.fn(): 實作 function 內容
> 
> 注意: `jest.fn(implementation)` 是 `jest.fn().mockImplementation(implementation)` 的縮寫.[^mockImplementation]

[^mockImplementation]: [mockFn.mockImplementation(fn)](https://jestjs.io/docs/en/mock-function-api#mockfnmockimplementationfn)

## Mock Implementations

假實作 fake 比起假回傳的 Stub 來得更強大。強大到幾乎可以取代假回傳 (stub)，但是就是自己要寫很多 code。

```javascript
test('mock function', () => {
  const myMockFn = jest.fn(callback => callback(null, true));

  myMockFn((err, val) => console.log(val));
  // 印出 true

  expect(myMockFn.mock.calls[0][0]).toBeInstanceOf(Function);
});
```

`mockImplementation` 可以定義一個 mock function 的**預設的假行為**。
瘋狂的完全取代原本的模組，就算它還沒有實作。(危險)

**emptyImplement.js**

```javascript
module.exports = function () {
  // some implementation;
};
```

**emptyImplement.test.js**

```javascript
jest.mock('./emptyImplement'); // this happens automatically with automocking
const emptyImplement = require('./emptyImplement');

test('mock empty module', () => {
  // emptyImplement is a mock function
  emptyImplement.mockImplementation(() => 42);

  expect(emptyImplement()).toBe(42);
});
```

覆蓋率是 0

```shell
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |      0 |     100 |                   
 emptyImplement.js |     100 |      100 |       0 |     100 |                   
 ------------------|---------|----------|---------|---------|-------------------
```

當你需要「假物件實作免洗筷」時，可以使用 `mockImplementationOnce` 

```javascript
const myMockFn = jest
  .fn()
  .mockImplementationOnce(cb => cb(null, true))
  .mockImplementationOnce(cb => cb(null, false));

myMockFn((err, val) => console.log(val));
// > true

myMockFn((err, val) => console.log(val));
// > false
```

免洗筷用完時，再呼叫會跑**預設假行為**

```javascript
test('mock mockImplementationOnce call lots of times', () => {
  const myMockFn = jest
  .fn(() => 'default')
  .mockImplementationOnce(() => 'first call')
  .mockImplementationOnce(() => 'second call');

  expect(myMockFn()).toMatch('first call');
  expect(myMockFn()).toMatch('second call');
  expect(myMockFn()).toMatch('default');
  expect(myMockFn()).toMatch('default');

  expect(myMockFn.mock.calls[0][0]).toBeUndefined();
  expect(myMockFn.mock.calls[1][0]).toBeUndefined();
  expect(myMockFn.mock.calls[2][0]).toBeUndefined();
  expect(myMockFn.mock.calls[3][0]).toBeUndefined();
  expect(myMockFn.mock.calls.length).toBe(4);
});
```

通常這種 **免洗筷** 都是用來應付鍊狀呼叫
而鍊狀呼叫的假物件，就是回傳 this ，可以使用 `mockReturnThis()` 來實作。

> 疑問: `axios.create()` 就可以這樣做？

```javascript
const otherObj = {
  myMethod: jest.fn(function () {
    return this;
  }),
};
```

可以寫成

```javascript
const myObj = {
  myMethod: jest.fn().mockReturnThis(),
};
```

## Mock Names

一個 function 都會有一個 name，就算是 `jest.fn()` 也是。

- 可以用 `.mockName()` 給一個 mockName。
- 可以用 `.getMockName()` 要取得 function name。

```javascript
test('mock name', () => {
  const myMockFn = jest
    .fn()
    .mockReturnValue('default')
    .mockImplementation(scalar => 42 + scalar);
  
  expect(myMockFn.getMockName()).toMatch("jest.fn()");
  
  myMockFn.mockName('add42');
  expect(myMockFn.getMockName()).toMatch("add42");
});
```

## Custom Matchers

為了 mock function 而生的 Matcher

```javascript
test('test mock function matcher', () => {
  const mockFunc = jest.fn();

  const arg1 = 'chris'
  const arg2 = 'mary'
  mockFunc(arg1, arg2);
  expect(mockFunc).toHaveBeenCalled();

  // The mock function was called at least once with the specified args
  expect(mockFunc).toHaveBeenCalledWith(arg1, arg2);

  // The last call to the mock function was called with the specified args
  expect(mockFunc).toHaveBeenLastCalledWith(arg1, arg2);

  // All calls and the name of the mock is written as a snapshot
  expect(mockFunc).toMatchSnapshot();
});
```

其中的 Snapshot 第一次執行，會儲存執行結果。
第二次執行，會拿上次執行的結果與這次比對。

```
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`test mock function matcher 1`] = `
[MockFunction] {
  "calls": Array [
    Array [
      42,
      43,
    ],
  ],
  "results": Array [
    Object {
      "type": "return",
      "value": undefined,
    },
  ],
}
`;
```

以上這些都是語法糖。

```javascript
// The mock function was called at least once
expect(mockFunc.mock.calls.length).toBeGreaterThan(0);

// The mock function was called at least once with the specified args
expect(mockFunc.mock.calls).toContainEqual([arg1, arg2]);

// The last call to the mock function was called with the specified args
expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1]).toEqual([
  arg1,
  arg2,
]);

// The first arg of the last call to the mock function was `42`
// (note that there is no sugar helper for this specific of an assertion)
expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1][0]).toBe(42);

// A snapshot will check that a mock was invoked the same number of times,
// in the same order, with the same arguments. It will also assert on the name.
expect(mockFunc.mock.calls).toEqual([[arg1, arg2]]);
expect(mockFunc.getMockName()).toBe('a mock name');
```

## 先告一段落

對於 Jest 系列，其實讀書會還在進行中，預計再過一個月左右。
會針對幾個議題做深入的討論。

不過那個與測試入門就比較不相關，就再看是不是需要寫文章跟大家介紹了。
感謝支持，如果有想看的文章類型也歡迎在底下留言哦~

我們下次見
