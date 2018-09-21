---
title: 在 Vue 中 加入 filter 的 method
date: 2018-09-21 16:47:45
tags: [vuejs, filter]
categories: 技術心得
---

# 在 Vue 中 加入 filter 的 method

## 第一種

加在 component 裡

**src/App.vue**

```htmlmixed=
<template>
    <p>{{ text | toUppercase | to-lowercase}}</p>
</template>

<script>
    export default {
      data () {
        return {
          text: 'hello text'
        }
      },
      filters: {
        toUppercase (value) {
          return value.toUpperCase();
        }
      }
    }
</script>
```

## 第二種

加在全域

**main.js**

```javascript=
import Vue from "vue";
import App from "./App.vue";

Vue.filter("to-lowercase", function(value) {
  return value.toLowerCase();
});

new Vue({
  el: "#app",
  render: h => h(App)
});
```
