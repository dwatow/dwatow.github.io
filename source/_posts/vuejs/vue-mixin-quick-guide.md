---
title: Vue 的 mixin 快速指南
date: 2018-09-21 20:17:15
tags: ["vuejs", "mixin"]
categories: '技術心得'
---

# Vue 的 mixin 快速指南

建立 component 共用程式碼

> 無法共用資料

**mixin.js**

建立要 mixin 的 .js 檔，並且在裡面直接放入 component 的共用 js

```javascript=
export const fruitMixin = {
  data() {
    return {
      fruits: ["Apple", "Banna", "Mango", "Melon"],
      filterText: ""
    };
  },
  computed: {
    filterFruits() {
      return this.fruits.filter(element => {
        return element.match(this.filterText);
      });
    }
  }
};
```

**components/myComponent**

在 component 加入 mixin

```javascript=
import { fruitMixin } from "./mixin.js";

export default {
  mixins: [fruitMixin]
};
```
