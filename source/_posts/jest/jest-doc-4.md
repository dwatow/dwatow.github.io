---
title: 讀 Jest Doc - 單元測試的結構、執行順序與名詞解釋
date: 2020-04-21 12:10:12
tags:
- jest
- async
- promise
- callback
categories:
- 技術練習
---
# 讀 Jest Doc - 單元測試的結構、執行順序與名詞解釋

上一篇，聊了關於非同步問題。
這一篇，我們要更了解 Jest 的生命週期 (其實就是執行順序)。

廣義的來說，也可以說是測試 3A[^3A] 的 Arrange

> 如果以煮菜來解釋
>
> 1. Arrange: 準備材料
> 1. Act: 煮東西
> 1. Assert: 試吃，看看結果如何？

[^3A]: [[Day 3]動手寫Unit Test](https://ithelp.ithome.com.tw/articles/10102643)

## 單元測試的血脈

單元測試框架，最早是由 Smalltalk 的 SUnit[^sunit] 的單元測試框架結構，而成名之作是由 Kent Beck 用 Java 寫的 JUnit，在[《重構─改善既有程式的設計, 2/e》](https://www.tenlong.com.tw/products/9789861547534)一書中有介紹其架構與設計。並且於 2018 再重新出版，[《重構｜改善既有程式的設計, 2/e》](https://www.tenlong.com.tw/products/9789865021832?list_name=c-refactoring)一書中的例子，全面改寫成 JavaScript 而介紹單元測試的章節。

之後許許多多的單元測試框架，也由不同的語言重新實作，並且命名也有一個慣例[^xunit-list]，而這種重新實作 JUnit 的框架，統稱為 xUnit[^xunit]，不過**不代表這麼命名的框架為該語言的主流測試框架**。

ex:

- Bash: ShUnit, shUnit2
- C語言: CUnit
- C++: CppUnit
- Objective-C: OCUnit, XCTest
- Swift: XCTest
- SystemVerilog: VUnit
- Java: JUnit
- JavaScript: JSUnit(Jasmine)
- jQuery: QUnit
- PHP: PHPUnit, Codeception

由於 JUnit 是由物件導向語言而撰寫而成，所以一些非純物件導向語言或可以透過自身語言特性簡化其 xUnit 的類別結構。

**Jest 並不是 xUnit 系列的測試框架**

在此就一邊引用 [Jasmine](https://jasmine.github.io/tutorials/your_first_suite.html) 一邊對照 CppUnit 來看看，在 JavaScript 中的術語如何對到 JUnit 上術語。

[^sunit]: [SUnit - Wikipedia](https://en.wikipedia.org/wiki/SUnit)
[^xunit]: [xUnit - Wikipedia](https://en.wikipedia.org/wiki/XUnit)
[^xunit-list]: [List of unit testing frameworks - Wikipedia](https://en.wikipedia.org/wiki/List_of_unit_testing_frameworks)

{% iframe //www.slideshare.net/slideshow/embed_code/key/jOBeduguvKcWzU?startSlide=38 100% 590px %}
[Cppunit下載、編譯、使用與困難排除, p38](https://www.slideshare.net/dwatow/cppunit-56845277#38)

|xUnit|Jasmine|備註
|-|-|-|
|TestCase| it |
|Fixture| describe | 有 beforeEach，裡面可以加入 TestCase|
|Assertion|expect + matcher(BDD) |
|Suite|檔案的頂層 describe|

測試不多，可以只用 Fixture (Object) + TestCase (method)
測試變多 xUnit 會使用 Suite (會用 Caller) 將 `Fixture::suite()` 集結起來，再整包執行。

主要就先了解到這。
CppUnit 的**測試主程式**，一般來說是固定寫法，有需要修改的地方，是輸出的 report 是要印在 terminal 還是寫成 xml 檔案。
也許 Jasmine 也都寫死了，不用改寫，呼叫時用參數再決定就可以了。

接下來就來看看 ~~`Fixture` 的~~ `beforeEach`/`afterEach` 要怎麼在 Jest 寫囉。

# Setup and Teardown

哪些是先執行，哪些是後執行的？

在成套的的測試中，往往只差一點點。
這些測試會有「一致的準備過程」，有時還需要有「一致的收尾」。

## Repeating Setup For Many Tests

例如: 資料庫的初始與釋放

```javascript
beforeEach(() => {
  initializeCityDatabase();
});

afterEach(() => {
  clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});
```

如果遇到非同步的準備/釋放過程，可以在 `beforeEah`/`afterEach` 中使用 `return`

```javascript
beforeEach(() => {
  return initializeCityDatabase("beforeEach");
});
```

## One-Time Setup

只想要用一次的初始/釋放。
也可以說只想在第一次的 `beforeEach` 才有的初始，可以放在 `beforeAll`
只想在最後一次的 `afterEach` 才有的釋放，可以放在 `afterAll`

## Scoping

一般而言，`before`/`after` 會為每一個測試(`test` 區塊)進行前置與後置作業。
但是，如果你想要將測試分類，並且每一類會執行各別的 before/after 區塊的話，可以用 `describe`

```javascript
beforeEach(() => {
  return asyncInitializeCityDatabase("beforeEach VVVVVVV asyncInitializeCityDatabase");
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});

describe('matching cities to foods', () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return asyncInitializeFoodDatabase("describe beforeEach VVVVVVV asyncInitializeFoodDatabase");
  });

  test('Vienna <3 sausage', () => {
    expect(isValidCityFoodPair('Vienna', 'Wiener Schnitzel')).toBe(true);
  });

  test('San Juan <3 plantains', () => {
    expect(isValidCityFoodPair('San Juan', 'Mofongo')).toBe(true);
  });
});
```

執行順序 (拿掉不必要的資訊)

```shell
# 全域
beforeEach VVVVVVV asyncInitializeCityDatabase
> run test Vienna
beforeEach VVVVVVV asyncInitializeCityDatabase
> run test San Juan
beforeEach VVVVVVV asyncInitializeCityDatabase
# describe 區塊
describe beforeEach VVVVVVV asyncInitializeFoodDatabase
> run test Vienna
beforeEach VVVVVVV asyncInitializeCityDatabase
describe beforeEach VVVVVVV asyncInitializeFoodDatabase
> run test San Juan
```

如果有多層的 `describe` 。
每一層 `describe` 外面如果有 `beforeEach` 的話也會先執行 `beforeEach`，再執行 `describe`

```javascript
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));
test('', () => console.log('1 - test'));
describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));
  test('', () => console.log('2 - test'));
});

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll
```

## Order of execution of describe and test blocks

執行順序！這一段就厲害了，完全超乎你想像的執行順序。
Jest 在執行 `test` 區段之前，會先把 `describe` 執行完。

一個 `describe` 執行完，就先把目前搜集的所有 `test` 跑完。
這些 `test` 執行完，再執行接下來會遇到的 `describe`

```javascript
describe('outer', () => {
  console.log('describe outer-a');

  describe('describe inner 1', () => {
    console.log('describe inner 1');
    test('test 1', () => {
      console.log('test for describe inner 1');
      expect(true).toEqual(true);
    });
  });

  console.log('describe outer-b');

  test('test 1', () => {
    console.log('test for describe outer');
    expect(true).toEqual(true);
  });

  describe('describe inner 2', () => {
    console.log('describe inner 2');
    test('test for describe inner 2', () => {
      console.log('test for describe inner 2');
      expect(false).toEqual(false);
    });
  });

  console.log('describe outer-c');
});

// describe outer-a
// describe inner 1
// describe outer-b
// describe inner 2
// describe outer-c
// test for describe inner 1
// test for describe outer
// test for describe inner 2
```

## General Advice

建議你，如果遇到測試失敗時，就先使用 `test.only()` 讓其它的測試先不跑，只跑出錯的，看看是不是還是失敗。

```javascript
test.only('this will be the only test that runs', () => {
  expect(true).toBe(false);
});

test('this test will not run', () => {
  expect('A').toBe('A');
});
```

通常在測試大型專案的一小部份時出錯，而單獨執行不會失敗，最好檢查一下是不是被其它的測試干擾到了。

通常檢查需不需要在 beforeEach 加上清除共享資料就可以解決。如果不確定，就先在 beforeEach 記錄這些共享資料。

## 下回見

喜歡的話歡迎訂閱、按讚、分享。
有任何問題也歡迎在下方留言討論。

如果想參加聚會的話，可以私訊給我哦~
我們下一篇見