---
title: iView 安裝與配置
date: 2018-05-09 10:03:42
tags: [vuejs, ivuew]
categories: "技術心得"
---

# iView 安裝與配置

這一篇是因為官網文件讓我實在是太挫折了！所以特別寫一篇來指正

用 vue-cli 的專案，初始化一個 webpack

## 安裝

https://www.iviewui.com/docs/guide/install#NPM_%E5%AE%89%E8%A3%85

```shell
npm install iview --save
```

## 官網配置

https://www.iviewui.com/docs/guide/start#%E5%BC%95%E5%85%A5_iView

> 官網文件有誤，要小心

```javascript=
import Vue from "vue";
import VueRouter from "vue-router";
import App from "components/app.vue";
import Routers from "./router.js";
import iView from "iview";
import "iview/dist/styles/iview.css";

Vue.use(VueRouter);
Vue.use(iView);
```

會出現 `iView is unidefined`

## 正確的配置

src/iview/index.js

> `import iview from 'iview'`
> 前面的 `iview` 要用小寫

```javascript=
import Vue from "vue";
import iview from "iview";
import "iview/dist/styles/iview.css";

Vue.use(iview);
```

src/main.js

加入這一行即可

```javascript
import "./iview";
```

## 測試

https://www.iviewui.com/docs/guide/introduce#%E7%A4%BA%E4%BE%8B

將專案中的

component/HelloWorld.vue

改寫成下面這樣

```htmlmixed=
<template>
    <Slider v-model="value" range></Slider>
</template>
<script>

export default {
  data () {
    return {
      value: [20, 50]
    }
  }
}
</script>
```

畫面

![](https://i.imgur.com/fnrw5KI.png)
