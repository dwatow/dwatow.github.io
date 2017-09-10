---
title: 用vue修改dom
date: 2017-09-02 20:11:15
tags: vuejs
categories: 技術心得
---

# 用vue修改dom

目前看[vue2官網教學](https://cn.vuejs.org/v2/guide/)也看了有十天了，這一篇就來總結一下這十天來的學習心得吧！
有一些加不進去的就列到遺珠之憾了。哈哈

vue，是一種類MVVM的設計方式。
也就是說，最主要的目的在於「修改view(HTML)」

在此，簡單的介紹一下vue的各種用法

首先，我們有一個html tag
```htmlmixed
<tagName attrProperty="attrValue">content</tagName>
```

下面就以「修改各部份」為文章結構，一一介紹vue的功能吧!!

## 修改tagName

用`component`，比較複雜
另外寫一篇再講。XDDD


## 修改attr

### 簡寫

用`v-bind:attrProperty`,簡寫成`:attrProperty`

### 加一個
在`attrValue`直接加一個`vue.data`的屬性

將一些cssClass一起加入

條件判斷方式
className是否出現，取決於vue.data是否擁有該屬性。

```htmlmixed
v-bind:attr="data1"
```
```javascript
data: {
    data1: 'cssClass1 cssClass2',
}
```
### 加很多
在`attrValue`加「classNames陣列」，加多個vue.data屬性

```htmlmixed
v-bind:attr="[arrayElem, ...]"
```
```javascript
data: {
    arrayElem: 'cssClass1 cssClass2',
}
```

### 條件控制加不加

在`attrValue`加「classNames物件」
判斷物件內容`true` or `false`

1. attr=匿名物件
```htmlmixed
v-bind:attr="{cssClass: isActive}"
```
```javascript
data: {
    isActive: true
}
```
2. attr=物件名稱
```htmlmixed
v-bind:attr="objectName"
```
```javascript
data: {
    objectName: {
        cssClass: true | false
    }
}
```

### 用在`component`
    - 另外加和`component`上的attr內容，取聯集。


## 修改content
先把example的js寫好，所有的內容都以它為主
```javascript=
var app = new Vue({
  el: '#app' ,
  data: {
    msg: '<b>這是被{{msg}}取代的結果</b>',
    seen: true,
    url: 'https://dwatow.github.io/',
    items: [
      {text: a, number: '1'},
      {text: b, number: '2'},
      {text: c, number: '3'},
      {text: d, number: '4'},
    ]
  },
  filter: {
    upperCase: function (value) {
      if (!value) return  ''
      value = value.toString()
      return value.toUpperCase()
    }
  }
})
```
### 只是加內文

msg是js變數，內容當作字串，不會渲染
```
{{msg}}
```
`<b>這是被{{msg}}取代的結果</b>`

### 內文後製

承上，`upperCase`是`filter`裡的function

```
{{msg | upperCase}}
```
`<B>這是被{{MSG}}取代的結果</B>`

### 加一個 HTML+內文

msg是js變數，內容當作含有HTML的字串，會渲染

```
<p v-html="msg"></p>
```

`<b>這是被{{msg}}取代的結果</b>`


### 重複很多相同的HTML+內文

- `v-for` 所在的HTML tag會複製
- items內容item由`v-for`命名指定
- 一個一個加到指定位置，(可以也用v-bind加到屬性)

```
<p v-for="item in items">{{item.text}}</p>
```

### 重複很多不同(群組)的HTML+內文

- 承上，`v-for`寫在template將要複製的HTML tag括起來

```
<template v-for="item in items">
    <p>{{item.text}}</p>
    <p>{{item.number}}</p>
</template>
```

## 遺珠之憾(十日整理之外)

- `v-bind` array要加判斷式(用object)的混合技法
- `v-bind:style` 的使用，很像css的使用方式
- 自動補上 vendor prefix
- `v-if` in `template`
- `v-else`
- `v-else-if`
- `v-show`
- `key, value` in `v-for`
- `v-for`的詳細用法(在object, array, 不會觸發view更新的地方，後製函數)
