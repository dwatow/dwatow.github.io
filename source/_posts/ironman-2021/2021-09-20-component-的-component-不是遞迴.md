---
title: Component 的 Component (不是遞迴)
date: 2021-09-20 00:00:00
tags:
  - 13th鐵人賽
  - vue.js
  - javascript
categories:
  - Vue.js 進階心法
source_url: https://ithelp.ithome.com.tw/articles/10268174
---

> 這一篇單純的介紹幾個，重要又常被忽略的 Vue API

在 component 裡又再包一個 component 最麻煩的就是將外部的 props 接到內部 component 的 props。

-   user-form
    -   user-profile
    -   account

假設有一個 `<user-form>` 裡面，包了兩個 component。

-   `<user-profile>` 基本資料
-   `<account>` 帳號密碼

```xml
<user-form
  class="float-right"
  enctype="multipart/form-data"
  data-any="lorem_string"
  :name="user.name"
  :account="user.account"
  @submit="onSubmit"
></user-form>

```

## 一對一接線 (手動欄位對接)

一開始，就依照基本的語法接線，除了辛苦一點之外，沒有其它要考慮的問題

```xml
<template>
  <form id="user-form" @submit.prevent="$emit('submit')">
    <user-profile
      :name="name"
    ></user-profile>
    <account
      :account="account"
    ></account>
  </form>
</template>

```
```javascript
export default {
 name: 'UserForm',
 prop: {
   name: {
     type: 'String',
     required: true
   },
   account: {
     type: 'String',
     required: true
   }
 }
}

```

這個方法，在欄位很多的情況之下，就要另外想辦去了

## 整束的接線 (自動欄位對接)

其實觀察一下 `user-form` 上面有三個東西。

attribute

-   `class="float-right"`
-   `enctype="multipart/form-data"`
-   `data-any="lorem_string"`

v-binding

> 縮寫: v-bind:name 等同於 :name

-   `:name="user.name"`
-   `:account="user.account"`

v-on

> 縮寫: v-on:submit 等同於 @submit

-   `@submit="onSubmit"`

## 要怎麼接線到內部 component

三種做法，三個 API 在 component `mounted` 的時候，可以把它們印出來？

> 利用三個 API，可以在文件中查到  
> [https://vuejs.org/v2/api/#vm-attrs](https://vuejs.org/v2/api/#vm-attrs)  
> [https://vuejs.org/v2/api/#vm-props](https://vuejs.org/v2/api/#vm-props)  
> [https://vuejs.org/v2/api/#vm-listeners](https://vuejs.org/v2/api/#vm-listeners)

```javascript
  mounted() {
    console.log('$attrs', Object.keys(this.$attrs));
    console.log('$props', Object.keys(this.$props));
    console.log('$listeners', Object.keys(this.$listeners));
  },

```

印出來的結果如下

```javascript
this.$attrs // ["enctype", "data-any"]
this.$props // ["name", "account"]
this.$listeners // ["submit"]

```

可以透過它們知道，目前 (這個 component) 自己身上有沒有 attribite 字串(用 `$attrs`)，有沒有 bind 變數(`$props`)，有沒有 on 行為 (`$listeners`)

而且，這三個物件都將外部提供的資訊都放好了。  
如果不想要像上面的麻煩接線方式，一個欄位一個欄位的接上去。就要知道怎麼樣一整束的將東西綁上去。

```xml
<component
  v-bind="$attrs"
  v-on="$listeners"
></component>

```

用在這個例子，會像下面這樣。

```xml
<template>
  <form id="user-form" @submit.prevent="$emit('submit')">
    <user-profile
      v-bind="$attrs"
      v-on="$listeners"
    ></user-profile>
    <account
      v-bind="$attrs"
      v-on="$listeners"
    ></account>
  </form>
</template>

```

出錯了

![](/images/703560be-kBCgdIP.png)

檢查一下，因為 name 和 account 並不是 `UserForm` 這個 component 會用到的 props ，所以不需要在它的 component 設定成 props。

> 因為一但設定了 props ，它就會從 attrs 移到 props

## 拒絕不必要的接線到內部 component

這樣一來，還有一個問題，整束的 $attrs 連接到子 component 時，會出現不必要的屬性 在 html 上面，雖然不會有什麼運作上的問題，但是對於團隊運作，會產生不必要的溝通成本 (因為不知道哪些有用，還要看 source code)

`enctype="multipart/form-data"` 還有 `data-any="lorem_string"` 都從 UserForm 跑到它擁有的所有子 component 了。

```xml
<div data-v-2268f1e9="" enctype="multipart/form-data" data-any="lorem_string" name="chris" account="chris@goodideas-studio.com" class="float-right">
  <form data-v-2268f1e9="" id="user-form">
    <div data-v-6ef6ca5e="" data-v-2268f1e9="" enctype="multipart/form-data" data-any="lorem_string" account="chris@goodideas-studio.com">
      <pre data-v-6ef6ca5e="">
        chris
      </pre>
    </div>
    <div data-v-6d0444a6="" data-v-2268f1e9="" enctype="multipart/form-data" data-any="lorem_string" name="chris">
      <pre data-v-6d0444a6="">
        chris@goodideas-studio.com
      </pre>
    </div>
  </form>
</div>

```

只要在子 component 中使用 `inheritAttrs: false` 就可以避免不必要的 attrs 跑過去囉。

> 這招是 [titangene](https://ithelp.ithome.com.tw/users/20117586/ironman) 教我的！

```javascript
export default {
  name: 'UserProfile',
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true,
    },
  },
};

```
```javascript
export default {
  name: 'Account',
  inheritAttrs: false,
  props: {
    account: {
      type: String,
      required: true,
    },
  },
};

```

設定好之後，再執行一次

```xml
<div data-v-2268f1e9="" enctype="multipart/form-data" data-any="lorem_string" name="chris" account="chris@goodideas-studio.com" class="float-right">
  <form data-v-2268f1e9="" id="user-form">
    <div data-v-6ef6ca5e="" data-v-2268f1e9="">
      <pre data-v-6ef6ca5e="">
        chris
      </pre>
    </div>
    <div data-v-6d0444a6="" data-v-2268f1e9="">
      <pre data-v-6d0444a6="">
        chris@goodideas-studio.com
      </pre>
    </div>
  </form>
</div>

```

這樣有比較認識這三個 API 了嗎？  
一定要先認識哦！超級重要！
