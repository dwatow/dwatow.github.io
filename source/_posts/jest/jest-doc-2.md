---
title: 讀 Jest Doc - 斷言庫
date: 2020-04-18 23:26:10
tags:
- jest
- assertion
- "unit testing"
categories:
- 技術練習

---
# 讀 Jest Doc - 斷言庫

上週，處理了環境建置，還沒有辦法執行 jest 的朋友們，可以看看上一週的內容哦
這一週，我們要來看看如何判斷測試對錯。

## 測試 3A

在正式介紹之前先說一下測試3A的概念。這並不是什麼評等的 AAA，而是一種測試程式的固定 pattern ，每一個測試，都應該要有的三個部份，而這三個部份都是由英文開頭的所以稱為**測試 3A**[^3A]

如果以煮菜來解釋

1. Arrange: 準備材料
2. Act: 煮東西
3. Assert: 試吃，看看結果如何？

[^3A]: [[Day 3]動手寫Unit Test](https://ithelp.ithome.com.tw/articles/10102643)

```javascript
const {
  sum
 } = require("./Math");

test('測試: 2 + 2 = 4', () => {
  // Arrange
  const addend = 2;
  const augend = 2;
  // Act
  const answer = sum(addend + augend);
  // Assert
  expect(answer).toBe(4);
});
```

> 命名參考[數學名詞中英文對照](https://blog.xuite.net/nikemomonike/twblog/124986223-%E6%95%B8%E5%AD%B8%E5%90%8D%E8%A9%9E%E4%B8%AD%E8%8B%B1%E6%96%87%E5%B0%8D%E7%85%A7)

# Using Matchers

一般來說，這個環節稱為「斷言庫」，也就是 ASSERT 這個術語。
也就是來自測試 3A 的第 3A - assert

大多數的斷言庫，都會出現「BDD style」的選項，在 Jest 這裡是 BDD only 所以不特別描述這件事。

因為 BDD 的宗旨大概是「為產品行為寫測試」[^intro-bdd]所以，測試項目的程式碼理論上就產品驗收標準綁在一起。[^bdd] 

所以，**如果寫得語意化，非工程師人員，應該也可以看得懂了吧？** 就這樣產生了 BDD 的 assertion
在 BDD 出現的時間點，斷言庫也才變成了現在這個「語意化」的樣貌。

想看看有區別斷言庫風格的套件，可以參考 [Chai 的 assertion style 介紹](https://www.chaijs.com/guide/styles/)

[^intro-bdd]: [INTRODUCING BDD](https://dannorth.net/introducing-bdd/)
[^bdd]: [行為驅動開發 - wiki](https://zh.wikipedia.org/wiki/%E8%A1%8C%E4%B8%BA%E9%A9%B1%E5%8A%A8%E5%BC%80%E5%8F%91)

接下來看看 Jest 為了測試判斷正確，準備了哪些基本的入門款給我們吧！

## Common Matchers

### 測試 Number

```javascript
test('測試: 2 + 2 = 4', () => {
  // 2 + 2 === 4
  expect(2 + 2).toBe(4);
});
```

### 測試 Object

```javascript
test('object assignment', () => {
  const data = {one: 1};
  data['two'] = 2;
  expect(data).toEqual({one: 1, two: 2});
});
```

### 反邏輯

```javascript
test('測試: 1~9 任意相加 不是 0', () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      expect(a + b).not.toBe(0);
    }
  }
});
```

## Truthiness

### null 轉成 Boolean

```javascript
// null === null
expect(null).toBeNull();
// null !== undefined
expect(null).toBeDefined();
expect(null).not.toBeUndefined();
// !!null !== true
expect(null).not.toBeTruthy();
// !!null === false
expect(null).toBeFalsy();
```

### 0 轉成 Boolean

```javascript
// 0 !== null
expect(0).not.toBeNull();
// 0 !== undefined
expect(0).toBeDefined();
expect(0).not.toBeUndefined();
// !!0 !== true
expect(0).not.toBeTruthy();
// !!0 === true
expect(0).toBeFalsy();
```

## Numbers

```javascript
const value = 2 + 2;
// 4 > 3
expect(value).toBeGreaterThan(3);
// 4 >= 3.5
expect(value).toBeGreaterThanOrEqual(3.5);
// 4 < 5
expect(value).toBeLessThan(5);
// 4 <= 4.5
expect(value).toBeLessThanOrEqual(4.5);

// toBe and toEqual are equivalent for numbers
// 4 === 4
expect(value).toBe(4);
// 物件比對用的 toEqual
expect(value).toEqual(4);
```

### 浮點數

因為浮點誤差，所以要用夾擊的，但你可以指定夾擊終點。

```javascript
const value = 0.1 + 0.2;
//expect(value).toBe(0.3);           This won't work because of rounding error
// 0.1 + 0.2 要落在 0.3 左右
expect(value).toBeCloseTo(0.3); // This works.
```

## Strings

用正規表達式 + `toMatch`

```javascript
expect('team').not.toMatch(/I/);
expect('Christoph').toMatch(/stop/);
// String 也可以用包含
expect('Christoph').toContain("Chris");
```

## Arrays and iterables

在 Array 可以查「包含某元素」

```javascript
const shoppingList = [
  'diapers',
  'kleenex',
  'trash bags',
  'paper towels',
  'beer',
];

test('the shopping list has beer on it', () => {
  expect(new Set(shoppingList)).toContain('beer');
  expect(shoppingList).toContain('beer');
  // 可以測試 Array 是否相同
  expect(shoppingList).toEqual([
    'diapers',
    'kleenex',
    'trash bags',
    'paper towels',
    'beer',
  ]);

});
```

## Exceptions

拋出例外，也可以測試。超好用。
在這要注意，放在 `expect` 裡的，是一個 callback，由 `expect` 代替你執行。

```javascript
function compileAndroidCode() {
  throw new Error('you are using the wrong JDK');
}

test('compiling android goes as expected', () => {
  expect(compileAndroidCode).toThrow();
  expect(compileAndroidCode).toThrow(Error);

  // You can also use the exact error message or a regexp
  expect(compileAndroidCode).toThrow('you are using the wrong JDK');
  expect(compileAndroidCode).toThrow(/JDK/);
});
```

如果你需要參數，可以建立 arrow function 當作 callback 等待被 `expect` 呼叫。
並且在執行 callback 時，會執行待測 function 就可以順利的拋出 exception 囉

```javascript
function compileAndroidCode(param) {
  throw new Error('you are using the wrong JDK');
}

test('compiling android goes as expected', () => {
  expect(() => compileAndroidCode(param)).toThrow();
  expect(() => compileAndroidCode(param)).toThrow(Error);

  // You can also use the exact error message or a regexp
  expect(() => compileAndroidCode(param)).toThrow('you are using the wrong JDK');
  expect(() => compileAndroidCode(param)).toThrow(/JDK/);
});
```
:::dangur
我自己測試時，非同步的 function 若要拋出 exception 不適合這樣做。
我自己的做法，還是老老實實的寫一個 try-catch 將待測物寫在 `try` 裡，而 `expect` 則寫在 `catch` 裡。
:::

## JSON Schema

另外，如果只是要確定欄位的結構是否正確，可以試看看 JSON Schema 哦

```shell
npm install --save-dev jest-json-schema
```

## 再學一個 Jest 指令參數

在測試程式剛寫幾個時， Jest 會幫你印出你的測試項目，並且寫上是否正確，這份文件非常適合提交給客戶。 ~~(並且再多收一筆可靠度的費用)~~ 
但是，卻在寫了更多的測試之後，這個報告卻自動的不見了！怎辦？
這時要知道 Jest 有準備一個參數 `--verbose` 讓它印出來。

[Is there an option to show all test descriptions when I run jest tests?](https://stackoverflow.com/questions/50497630/is-there-an-option-to-show-all-test-descriptions-when-i-run-jest-tests)

```shell
jest --verbose
```

喜歡的話歡迎訂閱、按讚、分享。
有任何問題也歡迎在下方留言討論。

如果想參加聚會的話，可以私訊給我哦~
我們下一篇見