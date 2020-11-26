---
title: 翻譯 使用 angularjs-jest 套件做 AngularJS 單元測試
date: 2020-11-26 11:41:00
tags:
- angularjs
- unit test
- jest
categories:
- 翻譯
---
# 翻譯 使用 angularjs-jest 套件做 AngularJS 單元測試

[原文: AngularJS unit testing with `angularjs-jest`](https://blog.softwaremill.com/angularjs-and-jest-three-steps-to-improve-your-legacy-frontend-tests-90674c0017e4)

## 1. Throw away the cluttered test setup boilerplate 甩掉測試初始設定的固定寫法

AngularJS 應用程式的測試，一直都存在著一些問題。甚至 AngularJS 的官網文件提供一個 test setup，也是呼叫了很多次的 beforeEach 指定 mock 的 service/factory 變數。
通常參考一些基礎物件，像是 `$scope` 或 `$compile`。它可以做得更好，相信很多開發者都有自己初始化的方式

大多類似這樣

```javascript
describe('productSummary.component', () => {
  let scope;
  let compile;
  let summaryService;

  beforeEach(() => {
    // 1. 指定要測試的 module 給 angular.mock
    angular.mock.module(ProductModule);

    // 2. 提供 mock 的 ProductService
    angular.mock.module(($provide) => {
      $provide.factory('ProductService', ($q) => ProductServiceInstant($q));
    });

    // 3. 初始化和存取 require 的 service/value
    angular.mock.inject(($rootScope, $compile, ProductSummaryService) => {
      scope = $rootScope.$new();
      compile = $compile;
      summaryService = ProductSummaryService;
    });
  });
```

首先，mock 你要測試的 AngularJS module，來告訴 AngularJS 要測試到應用程式的哪一部份。
再來要 mock 用到的 service, factories, values...，它們各自還需要由 AngularJS 注入的服務，例如此例中的 `$q`。
最後，可能需要 `$scope` 和其它的 services/factories 你需要在 `beforEach()` 以外的地方使用。

用了 `angularjs-jest` 可以簡化這些寫法，看下面這例子

```javascript
import { createTestApp } from 'angularjs-jest';

describe('productSummary.component', () => {
  const getTestApp = () => createTestApp({
    modules: [ProductModule],
    mocks: { ProductService: ($q) => ProductServiceInstant($q) },
    access: ['ProductSummaryService'],
  });
  ...
```

你可以用 `createTestApp()`  建立 test app 取代使用 `beforeEach()` (也取代了你初始化的變數)。呼叫 `createTestApp()` 傳遞 mock module 當作參數，取代多次呼叫 angular.mock.module 並且提供明確的 mock 屬性。只需要提供 services, factories or values 的名稱來取代初始化的全域變數。你不需要用 `$compile` 函數，因為套件有方便的方式來 `render` 一個 component

```javascript
const app = getTestApp();

// 存取 $scope
app.$scope.title = 'Some product';

// 存取 ProductSummaryService
app.ProductSummaryService.createSummary(...);

// Render, 替代 $compile
const element = app.render('<product-summary title="title"></product-summary>');
```

## 2. Test your components asynchronously 非同步的測試你的 components

幾週前，我還在一個圖書館工作時，實現一個很怪的測試。一個 component 它依賴多個 service 回傳的 promise 。這種測試的主要問題，要確定所有的 promise 都 resolve 的時間點，才是 component 準備就緒。為了使它更複雜，可能用了 `setTimeout` ，甚至真的推遲執行的時間。

假設一個 component: `production-name` 呼叫了 service: `ProductService` 用 promise 取得 product 的資料。

1. 首先，畫面初始狀態沒有 product 資料時， component 要在那個 production ID呈現 `Unknown production` 。
2. 回傳 `Promise` 就可以 resolves product 資料的物件，進而可以渲染的 product name。

你可寫個測試，確定這個 component 的初始渲染是 unknow product 並且之後會產生 product name

為了可以寫這樣的測試， 介紹一下 `angularjs-jest` 的  `eventually` 功能。看看它的實際效果

```javascript
it('should render product name after a while', async () => {
  const app = getTestApp();
  app.$scope.productId = product.id;
  const element = app.render(`<product-name product-id="productId" />`);

  expect(element.html()).toContain('Unknown product');
  expect(element.html()).toContain(product.id);

  await app.eventually(() =>
    expect(element.html()).toContain(product.name));
});
```

The `eventually` function returns a `Promise` that resolves when the provided function eventually ends without an exception.
eventually 執行結束，會回傳一個 Promise

However, when this assertion fails, the function with assertions will be called again in the next cycle of the Event Loop, and it will be preceded by `$scope.$digest()` to force AngularJS to apply changes to the component.
若測試沒過，下次的 Event loop 會再被呼叫

預設的情況 eventually 函數會每隔 0 ms 呼叫，最多叫 10 次。你可以提供你自己的間隔和呼叫次數，呈現你 component 的 delay

```javascript
await app.eventually(() =>
  expect(element.html()).toContain(product.name),
  { interval: 200, limit: 10 },
);
```

## 3. Use snapshot tests

我覺得 snapshot testing 是 Jest 的殺手級應用。它能防止你不小心改到了你的 components。典型的 snapshot test 將會渲染 component 並且與別次 snapshot 的結果比較。第一次執行測試時會儲存 snapshot ，或者在執行測試時使用 `--updateSnapshot `參數，可以更新 snapshot 。除此之外，若 snapshot 測試 fail 會顯示在 console 上。

如果要使用 snapshot 測試特定的值。你需要提供特定的 snapshot serializer。基本上，它就是一個有兩個 method 的物件， `test` 確定值是否可以給 serializer 用， `print` 實際執行序列化。

`angularjs-jest` 的 `render()` 的回傳值和 AngularJS 的 `$compile()` 相同。AngularJS 為了 debugging 提供的一種類似 jQuery 中大量的 html 形式的註解。但是，產生 snapshots 應該是要乾淨而簡單的，才能做到快速的視覺它比較測試結果。這就是 `angularjs-jest` 序列化程序，會重整格式成 html 移除 comments 的原因。

Snapshot 測試，可以直接用 angularjs-jest 的 render 結果 (一個物件)，不用其它配置。

```javascript=
const app = getTestApp()
const element = app.render(`<product-quantity product-id="'prod-123'" quantity="20" />`);
expect(element).toMatchSnapshot();
```

但是，請記得 product-quantity component 載入 product 是非同步的，所以前面儲存的 snapshot 會無效。相反的，應該先檢查 component 是否包含要求的訊息。

```javascript=
const app = getTestApp();
const element = app.render(`<product-quantity product-id="'prod-123'" quantity="20" />`);

await app.eventually(() => {
  expect(element.text()).toContain('20.00');
  expect(element.text()).toContain('pcs');
});

expect(element).toMatchSnapshot();
```

此示例將生成以下快照：

```html
<span
  class="value-unit-pair"
>
  <span
    class="value number ng-binding"
  >
    20.00
  </span>
  <product-unit
    class="unit ng-isolate-scope"
    product-id="$ctrl.productId"
  >
    <unit-short-name
      class="ng-binding ng-isolate-scope"
      unit-id="$ctrl.unitId"
    >
      pcs
    </unit-short-name>
  </product-unit>
</span>
```

(後面還有一段結論，就留給讀者自己看囉)

