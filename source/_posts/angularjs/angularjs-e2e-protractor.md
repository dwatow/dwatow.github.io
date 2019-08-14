---
title: Protractor 快速指南
date: 2019-01-26 12:49:28
tags: 
- angularjs
- protractor
categories: 
- 工具使用
---

# Protractor 快速指南

## E2E 測試的觀念

E2E 測試，主要是測試使用者操作與想要的結果是否符合規格。

所以，需要連上一個可測試的使用者介面的環境
抓到畫面上的資訊，再判斷是否正確

## 安裝

要把它當作是一個主程式，而不是開發工具。
它有自己的程式進入點。

```shell
npm install protractor
```

測試是否安裝成功

```shell
npx protractor --version
```

要將 Selenium Server 跑起來，所以要先更新它
還要另外安裝 JDK

```shell
npx webdriver-manager update
```

## 使用前置步驟

### 先準備的第一個測試

依照官網的教學^[[Step 0: write a test, Tutorial - Protractor](https://www.protractortest.org/#/tutorial#step-0-write-a-test)]，要拿 http://juliemr.github.io/protractor-demo/ 來測試

先寫 `conf.js` 再寫 `spec.js`

**conf.js**

Protractor 執行時，要使用的設定

```javascript=
// conf.js
exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['spec.js']
}
```

**spec.js**

對於測試內容的操作腳本。使用 JavaScript 撰寫

```javascript=
// spec.js
describe('Protractor Demo App', function() {
  it('should have a title', function() {
    browser.get('http://juliemr.github.io/protractor-demo/');

    expect(browser.getTitle()).toEqual('Super Calculator');
  });
});
```

### 執行測試環境

```shell
npx webdriver-manager start
```

測試環境 http://localhost:4444/wd/hub

## 執行

```shell
npx protractor conf.js
```

## Page Object Pattern 架構

參考 [Using Page Objects to Organize Tests](https://github.com/SeleniumHQ/selenium/wiki/PageObjects)

這是個 e2e 測試常見的 pattern

**原本沒有 page object**

```javascript=
describe('angularjs homepage', function() {
  it('should greet the named user', function() {
    browser.get('http://www.angularjs.org');
    element(by.model('yourName')).sendKeys('Julie');
    var greeting = element(by.binding('yourName'));
    expect(greeting.getText()).toEqual('Hello Julie!');
  });
});
```

**改成有 page object**

有 `async/await` 的 code

```javascript=
var angularHomepage = require('./AngularHomepage');

describe('angularjs homepage', function() {
  it('should greet the named user', async function() {
    await angularHomepage.get();
    await angularHomepage.setName('Julie');
    expect(await angularHomepage.getGreetingText()).toEqual('Hello Julie!');
  });
});
```

**conf.js**

可以把測試 腳本 (spec) 和頁面 (page) 分離。
並且可以一套一套的執行腳本。不用每一次都跑全部

```javascript=
exports.config = {
  //...

  // Spec patterns are relative to the location of the spec file. They may
  // include glob patterns.
  suites: {
    homepage: 'tests/e2e/homepage/**/*Spec.js',
    search: [
      'tests/e2e/contact_search/**/*Spec.js',
      'tests/e2e/venue_search/**/*Spec.js'
    ]
  },
  //...
};
```

## 各種語法查詢

參考: https://www.protractortest.org/#/api

### `element` Dom 元素

[豪華範例](https://github.com/angular/protractor/blob/5.4.1/spec/basic/elements_spec.js)

主要是代表抓到的 Dom 元素

抓單一個用 `element()`
抓列表用 `element.all()`

參數要丟 `locator` 物件

> `$('.parent')` = `element(by.css('.abc'))`
> `$$('.abc')` = `element.all(by.css('.abc'))`

**element() methods**

|methods|descripts| return |
|-|-|-|
|`.getText()`| 類似 `innerText` | 回傳 promise |
|`.getAttribute()`|
|`.isPresent()`|是否存在
|`.element()`|繼續往下找
|`.sendKeys()`|keyin
|`.click()`| mouse click

**element.all() methods**

|methods|descripts|
|-|-|
|`.first()` | 最後放進 list 裡的|
|`.last()`| 最早放進 list 裡的|
|`.filter(callback)`|
|`.map(callback)`|
|`.count()`| 總數
|`.get(n)`| 取得第幾個 正數正數，負數倒數 |
|`.then(callback)`|抓到之後要做什麼


### locator

更多看這個 [Using Locators](https://www.protractortest.org/#/locators)

用 `by` 的 methods 產生各種 locator，放進 element 可以取得元素。

```javascript=
element(by.css('')) // like querySelector()
element.all(by.css('')) // like querySelectorAll()
```
