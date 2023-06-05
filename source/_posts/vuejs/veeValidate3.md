---
title: VeeValidate@3 (for Vue2) 學習筆記
date: 2023-06-05 16:00:57
tags:
- vue
- vee-validate
categories:
- 技術心得
---

# VeeValidate@3 (for Vue2) 學習筆記

這篇適用於 vue2 的使用者，也算是對自己學習的一種整理。
為什麼是 vue2 呢？是因為我目前正在維護這個專案就是 vue2

## 安裝

要注意不要安裝到 4 版 (適用 Vue3)

```bash
npm install vee-validate@"<3.0.0" --save
```

## 使用

### 引用

在這裡寫的 code，可以直接加在 main.js ，也可以另外寫一支，再加到 main.js 裡。

```javascript
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);
```

## 簡單用法 (針對原生 `<input>`)

在這裡特別要介紹它的幾種用法。
做為學習的起點，因為官網文件編排，直接就進功能介紹了。XDD

所以特別想寫一下，之後的進階功能再進官網文件看，就很順暢了。

### 簡單 input 驗證

> 官網特別有寫的資安小知識 (但我用自己的話詮釋一次)
> 前端的欄位驗證並不是用來取代後端的欄位驗證，而是前後端都要做。
> 這麼做並不是重工，前端做的目的是增加 UX ，增強系統對使用者的回饋反㒣。

```xml
<input v-validate="'required|email'" name="email" type="text">
<br />
<pre>{{ errors }}</pre>
```

辨別 `name` 的屬性當關鍵字判斷是哪個欄位，透過 `v-validate` 執行要判斷的邏輯，再錯誤訊息傳到 `errors` 物件 (目前這樣寫，是全域的一個物件)。

**example:**

初始，沒有錯誤訊息，但是 errors 物件原始長這樣

![](https://hackmd.io/_uploads/ByVJF7OI3.png)

**example:**

輸入不符合 email 格式的訊息

![](https://hackmd.io/_uploads/r1JROmuLn.png)

**example:**

編輯過後再刪掉，會出現必填的錯誤訊息

![](https://hackmd.io/_uploads/SJctu7OU2.png)

### 用很多個？

如果我們依此類推，會得到什麼結果呢？

```xml
<h2>簡單用法</h2>
<div>
  <input v-validate="'required|url'" name="url" type="url" />
  <pre>{{ errors }}</pre>
  <input v-validate="'required|email'" name="email" type="email" />
  <pre>{{ errors }}</pre>
</div>
```

![](https://hackmd.io/_uploads/r1iU9muL2.png)

兩個欄位，不同規格。`errors.itms` 會跑兩個錯誤出來。
如果只有一個欄位不符規則，`errors.itms` 就只有一個錯誤在裡面。

## 錯誤訊息 errors

- Displaying Errors

**errors.first(name)**

```xml
<h2>簡單用法</h2>
<div>
  <input v-validate="'required|url'" name="url" type="url" />
  <pre>{{ errors.first("url") }}</pre>
  <input v-validate="'required|email'" name="email" type="email" />
  <pre>{{ errors.first("email") }}</pre>
</div>
```

把官網的例子複雜化一下，可以發現 first 的參數，要放的是 input 的 name 就可以取得指定欄位的第一個錯誤

**errors.collect([name])**

```xml
<h2>簡單用法</h2>
<div>
  <input v-validate="'required|url'" name="url" type="url" />
  <pre>{{ errors.collect("url") }}</pre>
  <ul>
    <li :key="index" v-for="(error, index) in errors.collect('url')">
      {{ error }}
    </li>
  </ul>
  <input v-validate="'required|email'" name="email" type="email" />
  <pre>{{ errors.collect("email") }}</pre>
  <ul>
    <li :key="index" v-for="(error, index) in errors.collect('email')">
      {{ error }}
    </li>
  </ul>
```

![](https://hackmd.io/_uploads/H1fiTmd82.png)


把官網後續的例子也複雜化一下，可以發現 collect 的參數，要放的是 input 的 name 就可以取得指定欄位的所有錯誤

如果在此不指定 name ，錯誤訊息就會這樣呈現

![](https://hackmd.io/_uploads/HyW76mu83.png)

**error.all()**

這裡出現了一個 `error.all()` 我就在想「如果 `error.collect` 的參數要是沒有給，會是什麼？」

做了一個比較

```xml
<pre>{{ errors.all("url") }}</pre>
<pre>{{ errors.collect() }}</pre>
<pre>{{ errors.all() }}</pre>
<ul>
  <li :key="index" v-for="(error, index) in errors.all()">
    {{ error }}
  </li>
</ul>
```

![](https://hackmd.io/_uploads/SyMIC7OI2.png)

- **errors.all("url")**: 指定 name 的 all 是抓不到任何東西的，表示這裡的參數不是 input 的 name
- **errors.collect()**: 不指定 name 的 collect 會出現「各欄的所有錯誤」
- **errors.all()**: 不指定 name 的 all 抓到所有欄位的所有錯誤，並且不分類

這些細部的差異，就是學習的過程必須要做出來的比較唷！^^

## Flags

就是一些.....狀態，因為二進制的關係，所以每一位可以各別定義不同的狀態意義。

> Flag 的翻譯可能會看見來自組合語言的「旗標」，這個意思源自海上溝通用的[旗語](https://zh.wikipedia.org/zh-tw/%E6%97%97%E8%AA%9E)

- touched: 表示該欄位已被 touched 或 focused。
- untouched: 表示該欄位尚未被 touched 或 focused。
- dirty: 表示該欄位已被游標經過。
- pristine: 表示該欄位尚未被游標經過。
- valid: 表示該欄位通過驗證。
- invalid: 表示該欄位未通過驗證。
- pending: 表示該欄位的驗證正在進行中。
- validated: 表示該欄位已經至少通過一次事件驗證或手動使用 validate() 或 validateAll() 驗證過。
- changed: 表示該欄位的值已經被更改（嚴格檢查）。

以上面的簡單例子來說
flags 可以這樣從全域物件中叫出來

```xml
<h2>Flags</h2>
<pre>{{ fields }}</pre>
```

![](https://hackmd.io/_uploads/H1MN44_Ih.png)

## 驗證觸發 Event

預設是 `<input>` ，預設是監聽 `@input` 這個 event。但有時候，它的反應太過敏感，可以改用其它的 event (`change`之類的)

### 自訂要觸發的 Event

**直接改預設**

就是一開始在 **main.js** 裡的設定

```javascript
Vue.use(VeeValidate);
```

改寫成這樣

```javascript
Vue.use(VeeValidate, {
  events: 'change'
});
```

加上第二個參數。

> 關於 Vue.use 的使用方式，以及第二個參數如何使用，請參考 [Plugins - Vue2](https://v2.vuejs.org/v2/guide/plugins.html)

**逐欄設定**

依照每個欄位需要，改變觸發的 Event

```xml
<input 
  name="field" 
  v-validate="'required'"
  data-vv-validate-on="change|custom"
>
```

### 關閉驗證觸發的 Event

**直接改預設**

```javascript
Vue.use(VeeValidate, {
  events: ''  // 不指定 event 預設欄位驗證，全部都會關閉
});
```

**逐欄設定**

```xml
<input name="field"
  v-validate.disable="'required'"
>
```

### 驗證沒過也要做點什麼...

透過 valid 可以判斷驗證的結果是不是通過驗證。
就可以在沒通過驗證時也可以做點什麼了。

```xml
<template>
  <!-- ... -->
  <button @click="onClick">validate</button>
  <!-- ... -->
</template>
```

```javascript
export default {
  // ...
  methods: {
    onClick() {
      this.$validator.validate().then((valid) => {
        if (!valid) {
          // do stuff if not valid.
          console.log("驗證沒過..");
        } else {
          console.log("驗證通過......");
        }
      });
    },
  },
};

```

## 自訂規則

官網後來介紹了規則相關的功能。想要自訂的朋友再去看看

- Syntax
  - Rules Parameters
  - Rules in practice
- Validation Rules
- Custom Rules
- Inferred Rules
- Error Messages (自訂規則之後的自訂錯誤訊息)

## 多國語系

官網後來介紹了多國語系相關的功能。想要自訂的朋友再去看看

- Localization


## 動態顯示的欄位 (與它的驗證)

- [Validating Dynamically Displayed Inputs](https://vee-validate.logaretm.com/v2/guide/conditional-and-looping-inputs.html)
  - Handling v-if
  - Handling v-for

## 測試

- [Testing](https://vee-validate.logaretm.com/v2/guide/testing.html#testing)

## 針對自訂 Vue Component 的用法

- Interaction Modes (要在 `<ValidationProvider>` 才可以用)

自訂 component 的話有兩種情境。

1. 驗證單一欄位
2. 驗證整個表單

### ValidationProvider + input

`ValidationProvider` 是必要的 component 它包裝了你的 input 並從 scoped slot 提供驗證狀態。

由於 `ValidationProvider` 使用的是 slot 傳出來的驗證狀態，所以會有相對限制的 scope 有效範圍。

**example:**

將簡單範例的上下加上 ValidationProvider

增加的

- 要加上使用 `v-model` 來控制 input 裡的值 (就是 component 的用法。)，ValidationProvider 也遵遁這個概念，自己會捕捉元件的 `v-model` 進行驗證。 ==超級重要==
- 在 ValidationProvider 上設定 `rules='required|url'`
- 在 ValidationProvider 上加上 `v-slot="{ errors }"`，這樣的話原本 `<input>` 上的 errors 就變 `slot` 的 errors 了。

減少的

- 不使用 `v-validate="'required|url'"` 
- 不使用全域的 errors。

`<template>`

```xml=2
<ValidationProvider rules="required|url" v-slot="{ errors }">
  <input name="url" type="url" v-model="value" />
  <pre>{{ errors }}</pre>
</ValidationProvider>
```

`<script>`
```javascript=9
import { ValidationProvider } from 'vee-validate';

export default {
  components: {
    ValidationProvider
  },
  data() {
    return {
      value: null
    }
  }
};
```

![](https://hackmd.io/_uploads/SJ2Hq0qUh.png)


通常，它會變成一個 `<span>`

```xml
<span>
  <input name="url" type="url">
    <pre>
      ["The {field} field is not a valid URL"]
    </pre>
</span>
```

**指定 render**

用 `tag` 屬性，可以指定要繪製成什麼 tag

```xml
<ValidationProvider rules="required" tag="div">
</ValidationProvider>
```

**不 render**

```xml
<ValidationProvider rules="required" slim>
</ValidationProvider>
```

> slim 的意思是，只渲染第一個子節點

### Scoped Slot Data

| Name | Type | Description |
| -- | -- | -- |
| errors | `string[]` | 錯誤訊息的列表。 |
| failedRules | `[x: string]: string` | 失敗規則的映射對象，使用 (rule, message) 的形式作為 (key, value)。 |
| valid | `boolean | null` | 目前的驗證狀態。 |
| flags | `flags` | flags 物件的狀態。 |
| aria | `{ [x: string]: string }` | 用於無障礙性的 aria 屬性的映射對象。 |
| classes | `{ [x: string]: boolean }` | 基於驗證狀態設置的類別的映射對象。 |
| validate | `(e: any) => Promise` | 作為事件處理器用於觸發驗證的函式。對於不使用 v-model 的欄位很有用。 |
| reset | `() => void` | 在提供者上重置驗證狀態的函式。 |

### ValidationProvider + 自訂 component

```xml
<ValidationProvider rules="required" v-slot="{ errors }">
  <VTextField v-model="value" :error-messages="errors" />
</ValidationProvider>
```

手動觸發驗證

```xml
<ValidationProvider rules="required" ref="myinput" v-slot="{ errors }">
  <VTextField v-model="value" :error-messages="errors" />
</ValidationProvider>
<v-btn @click="validateField('myinput')" >Submit</v-btn>
```

```javascript
export default {
  // ...
  methods: {
    validateField (field) {
      const provider = this.$refs[field];

      // Validate the field
      return provider.validate();
    }
  },
  // ..
};
```

**不用 refs 的方式**

直接從 slot 取得 validate 放在 event 裡呼叫。

```xml
<ValidationProvider rules="required" v-slot="{ validate, errors }">
  <div>
    <input type="text" @input="handler($event.target.value) || validate($event)" />
    <p id="error">{{ errors[0] }}</p>
  </div>
</ValidationProvider>
```

不用 `v-model` 的 file 也可以用一樣的方式

```xml
<ValidationProvider rules="required" v-slot="{ validate, errors }">
  <div>
    <input type="file" @change="handleFileChange($event) || validate($event)" />
    <p id="error">{{ errors[0] }}</p>
  </div>
</ValidationProvider>
```

### 重構 - Higher Order Component

可以透過 Higher Order Component 的方式「後設」Component 的驗證功能。

生成一個又可以放原本 input 的屬性，也可以放 ValidationProvider 屬性的新元件。

```javascript
import { withValidation } from 'vee-validate';
import { VTextField } from 'vuetify/lib';

const VTextFieldWithValidation = withValidation(VTextField, ({ errors }) => ({
  'error-messages': errors
}));

export default {
  components: {
    VTextFieldWithValidation
  }
};
```

### 重構 - 包成 Component

連同 ValidationProvider 包起來

## Validation Observer

(待續...)

## 特別的問題

如果一個 ValidationProvider 要驗證三個 input ，三者填其中一個，就算滿足必填。那怎麼辦？

解決方式是，將三個 input 包成一個 component 並且，露出一組 `v-model` 驗證是否必填的方式就是驗證它是不是 `== null`[^null] (沒錯是兩個 `=` 唷)。

在點擊任何一個 input 時，除了觸發 `@input` 滿足 `v-model` 的條件之外，還可以透過 `@update:value1` 來傳遞出原本就要給的值。


[^null]: [要判斷 null 才是必填未填](https://stackoverflow.com/questions/59125043/vuejs-using-prop-type-validation-with-null-and-undefined-values)
