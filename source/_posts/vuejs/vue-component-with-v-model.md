---
title: Vue Component 也可以用 v-model
date: 2018-09-21 16:37:51
tags: [vuejs, "v-model"]
categories: 技術心得
---

# Vue Component 也可以用 v-model

前端框架的演進中，雙向綁定的設計是方便而不良的設計，像是 angular2 和 vue2 都已經拿掉了雙向綁定的設定。
而在 vue2 裡有 `v-model` 其實是一種用單向綁定與事件而實現的雙向綁定語法。

又要如何實作，才可以讓 `v-model` 作用在自己設計的 component 呢？

## 解析 `v-model`

先知道

```html
<input v-model="parentData">
```

其實是

```html
<input :value="parentData"
       @input="parentData = $event.target.value">
```

所以，也是有可能可以設計一個可化用 `v-model` 的 component

**parents**

```html=
<template>
    <my-component v-model="parentData">
    </my-component>
</template>
<script>
    import myComponent from './myComponent.vue'
    export default {
      data () {
          parentData: ''
      },
</script>
```

**child**

對照 parent 的真實面貌

```html
<input :value="parentData"
       @input="parentData = $event.target.value">
```

component 的實作

- `:value` 在 component 裡要 `props`
- `@input` 在 component 裡要 `$emit`

```html=
<template>
    <div @click="$emit('input', retuanValue)"></div>
</template>
<script>
    import myComponent from './myComponent.vue'
    export default {
        props: ['value'],
    }
</script>
```
