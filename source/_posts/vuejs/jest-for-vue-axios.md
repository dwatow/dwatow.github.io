---
title: Jest for Vue 發送 API 用 axios
date: 2019-07-22 14:10:38
tags: ['jest', 'vuejs', 'axios']
categories: '技術心得'
---
# Jest for Vue 發送 API 用 axios

承 [Jest for Vue with Vuex 實戰](https://dwatow.github.io/2019/07-03-vuejs/jest-for-vue-x/) 的進度。

這次，希望可以測試 axios 得到的 JSON 是不是可以跑到畫面來。

這次的練習，會利用無跨域 API 來練習[^api]

[^api]: [容許任何來源存取的Web服務列表- wiki](https://zh.wikipedia.org/zh-tw/%E5%AE%B9%E8%A8%B1%E4%BB%BB%E4%BD%95%E4%BE%86%E6%BA%90%E5%AD%98%E5%8F%96%E7%9A%84Web%E6%9C%8D%E5%8B%99%E5%88%97%E8%A1%A8)

## 測試 GET

本質上，是要測試 `axios.get('url').then(res => res.data)` 這一段裡的 `res` 值回傳內容，是不是和 API 文件裡的一致，並且是不是會到畫面正確的位置上。 

### Components

**Actions.vue**

增加了一個 button 讓最後得到的 JSON 放在 Vuex 裡。
再透過 getters 放在 `<pre>` 裡。

```jsx=
<template>
  <div class="text-align-center">
    ...
    <button id="getJson" @click="$store.dispatch('fetchCoscup')">Get COSCUP</button>
    <pre>{{ $store.getters.json }}</pre>
    ...
  </div>
</template>
```

畫面呈現 (下面畫面包含已回傳的 JSON)

![](https://i.imgur.com/J4fbKqu.png)

### Json Schema

利用 Json Schema[^json-schema] 比對 JSON 結果

記得安裝

```shell
$ npm install --save-dev jest-json-schema
```

**json-schema.js**

`jest-json-schema` 套件要先初始化。

[^json-schema]: [jest-json-schema - Github](https://github.com/americanexpress/jest-json-schema)

```javascript=
import { matchers } from 'jest-json-schema';
expect.extend(matchers);
```

測試就可以這樣寫

```javascript
expect(json).toMatchSchema(schema);
```

### unit test

**axios-test.spec.js**

```javascript=
import { shallowMount, createLocalVue } from "@vue/test-utils";
import store from "@/store";
import Actions from "@/views/Actions.vue";
import "../json-schema";

import axios from "axios";
jest.mock('axios');


describe('API get json', () => {
  const localVue = createLocalVue();
  const wrapper = shallowMount(Actions, { store, localVue });


  it('should get coscup data', done => {
    // 這次要假裝回來的 JSON
    axios.get.mockResolvedValue({
      data: {
        "en": "<ul><li><a href=\"http://registrano.com/events/coscup2011-regist\">Register</a></li>\n<li><a href=\"/2011/en/about/\">About Us</a></li>\n<li><a href=\"/2011/en/program/\">Program</a></li>\n<li><a href=\"/2011/en/venue/\">Venue</a></li>\n<li><a href=\"http://blog.coscup.org/\">Blog</a></li>\n<li><a href=\"/2011/en/sponsors/\">Sponsors</a></li>\n</ul>",
        "zh-tw": "<ul><li><a href=\"http://registrano.com/events/coscup2011-regist\">報名</a></li>\n<li><a href=\"/2011/zh-tw/about/\">活動簡介</a></li>\n<li><a href=\"/2011/zh-tw/program/\">議程</a></li>\n<li><a href=\"/2011/zh-tw/venue/\">地點</a></li>\n<li><a href=\"http://blog.coscup.org/\">部落格</a></li>\n<li><a href=\"/2011/zh-tw/sponsors/\">贊助單位</a></li>\n</ul>",
        "zh-cn": "<ul><li><a href=\"http://registrano.com/events/coscup2011-regist\">报名</a></li>\n<li><a href=\"/2011/zh-cn/about/\">活动</a></li>\n<li><a href=\"/2011/zh-cn/program/\">议程</a></li>\n<li><a href=\"/2011/zh-cn/venue/\">地点</a></li>\n<li><a href=\"http://blog.coscup.org/\">博客</a></li>\n<li><a href=\"/2011/zh-cn/sponsors/\">赞助单位</a></li>\n</ul>"
      }
    });

    // 操作畫面
    wrapper.find("#getJson").trigger("click");
    wrapper.vm.$nextTick(async () => {
      const html = wrapper.find("pre");
      const json = JSON.parse(html.text());

      // 測試
      const schema = {
        properties: {
          "en": { type: 'string' },
          "zh-tw": { type: 'string' },
          "zh-cn": { type: 'string' }
        },
        required: ['en', 'zh-tw'],
      }
      expect(json).toMatchSchema(schema);
      await expect(Object.keys(json).length).toBe(3);
      done()
    })
  });
});
```

因為畫面需要再等一次渲染結束，才可以抓畫面的值。
所以要把測試寫在 `$nextTick` 裡面。
並且用非同步的方式 `async-await` + `done()`

## 測試 POST

本質上，是要測試 `axios.post('url', data)` 這一段裡的 `data` 是不是和 API 文件裡的一致

### Components

**Actions.vue**

增加了一個 button 讓最後得到的 JSON 放在 Vuex 裡。
再透過 getters 放在 `<pre>` 裡。

```jsx=
<template>
  <div class="text-align-center">
    ...
    <button id="postJson" @click="$store.dispatch('createData', { hello: 'world' })">Create Data</button>
  </div>
</template>
```

其中，直接從畫面觸發 Vuex 的 Actions ， payload 用 `{ hello: 'world' }` 。
而這個 payload 會直接放進 `axios.post` 的 data 中

### unit test

在這要測試的目標，是函數的參數。
先 mock `axios` 套件，並且測它的 method 參數。

`axios.post.mockResolvedValue` 就是要定義 `post` 的成為「回傳 `Promise.resolve()` 的函數」。[^mockResolvedValue]。在此 `axios.post.mockResolvedValue({ name: 'chris'});` 有定義 Promise 的回傳值，這個在這個例子沒有很重要，如果你的 post 有特定的 response 訊息，可以使用這個地方測試出產品程式的其它邏輯。

> `mockImplementation` 可自訂函數內容。

[^mockResolvedValue]: [mockFn.mockResolvedValue(value) - Jest](https://jestjs.io/docs/en/mock-function-api#mockfnmockresolvedvaluevalue)

**axios-test.spec.js**

```javascript=
describe('API post json', () => {
  const localVue = createLocalVue();
  const wrapper = shallowMount(Actions, { store, localVue });
  const mockAxios = axios.post.mockResolvedValue({ name: 'chris' });
  // const mockAxios = axios.post.mockImplementation((url, payload) => Promise.resolve(payload));
  it('should post data', () => {
    wrapper.find("#postJson").trigger("click");

    const uri = mockAxios.mock.calls[0][0];
    expect(uri).toBe('https://www.w3schools.com/js/demo_post2.asp');

    const json = mockAxios.mock.calls[0][1];
    const schema = {
      properties: {
        "hello": { type: 'string' },
      },
      required: ['hello'],
    }
    expect(json).toMatchSchema(schema);
  });
});
```
