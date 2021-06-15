---
title: Jest for Vue with Vue Router 演練
date: 2019-11-26 14:27:36
tags:
- jest
- vue
- vuex
categories:
- 技術心得
---
# Jest for Vue with Vue Router 演練

這次測試，要測試的是模仿使用者操作。
隨著網址的變化，畫面也要變化到指定的 Component

這次的練習，是由 vue-cli 的 Hello world 程式碼修改而來。很好入手哦~~

自從認識神Q超人之後，發現有一個人默默的在 React 往一個和我覺得相同的方向前進，讓我在測試這條路感到有伙伴，不寂寞，也在和他交流的過程，看見了 React 的測試觀念與我的不謀而合，更堅定我自己的方向是正確無誤的。

接下來，就讓我們繼續以 BDD 的方式來看看這次的測試吧。

:::danger
小心使用
:::

## 官網文件，依然沒什麼用

vue 官網文件爛，vue 測試套件的官網文件也爛，但是卻依然要先看看他說了什麼。

:::info
因為爛，不是讓我們不看它，而是讓我們寫文章補充它。
:::

由這個章節[^TestWithVueRouter]，我們可以先看看官網說了什麼

[^TestWithVueRouter]: [Using with Vue Router](https://vue-test-utils.vuejs.org/guides/#using-with-vue-router)

### `new VueRouter()` 物件，要長在 `LocalVue` 上面

```javascript=
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter()

shallowMount(Component, {
  localVue,
  router
})
```

`$route` 和 `$router` 兩個會在 localVue 上成為唯讀的 property (屬性)，不可以用 mock 來覆寫。

### 避免安裝全域的 Vue Router

最好是每次測試，每次都安裝足夠用的 router 就可以了。

## 練習專案建置方式

1. 安裝 vue-cli (vue-cli 3)[^installVuecli]
2. 執行專案初始化[^vuecliCreate]

[^installVuecli]: [Installation - Vue CLI](https://cli.vuejs.org/guide/installation.html)

[^vuecliCreate]: [Creating a Project - Vue CLI](https://cli.vuejs.org/guide/creating-a-project.html#vue-create)

做到看見 Hello World 的畫面即可。
可以先點擊最上面的導覽列， Home 和 About 試試看，可以切換畫面

**Home**

`http://localhost:8080/`
![](https://i.imgur.com/qPhm8tp.png)

**About**

`http://localhost:8080/about`
![](https://i.imgur.com/nJLY0BH.png)

## 寫 Testing

一開始，照官網寫。要慢慢的把畫面印出來，確定畫面 是照我們設想的這樣，再透過測試的手法判斷正確性

依官網的 code

```javascript=
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(VueRouter)

shallowMount(Component, {
  localVue
})
```

自己依樣改寫成這樣，利用 `wrapper.html()` 印出目前的 HTML 並且調整成和真正渲染一樣的結果。

```javascript=
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import App from '@/App.vue';
import About from '@/views/About.vue';
import Home from '@/views/Home.vue';
import routes from '@/router/routes';

//參考 main.js
const localVue = createLocalVue();
localVue.use(VueRouter);

describe('Actions.vue', () => {
  //參考 router/index.js
  const router = new VueRouter({
    mode: 'history',
    routes,
  });

  //測試渲染
  const wrapper = mount(App, { localVue, router });

  it('test', async () => {
    console.log(wrapper.html())  // print html
    expect(true).toBe(true); //alwarys true
  });
  });
});
```

有幾點要注意。

1. 要利用 `mount` 深層的渲染 Component
1. 參考真正的 router 決定 `mode: 'history'` 的設定。

```javascript=
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
```

### Router 切換 Component 要考慮比我想的更多....

這樣可以寫出以下成功的測試

```javascript=
it('test', async () => {
  router.push('/');
  expect(wrapper.find(Home).exists()).toBe(true);
});
```

一切換 router 就測試失敗!!

```javascript=
it('test', async () => {
  router.push('/');
  console.log(wrapper.html())
  expect(wrapper.find(Home).exists()).toBe(true);
  router.push('/about');
  console.log(wrapper.html())
  expect(wrapper.find(About).exists()).toBe(true);
});
```

但是列印出來的 `console.log(wrapper.html())` 結果會是我們想像的這樣，換了 HTML，但是測試就是不對。

### 接下來，並不是步驟的問題，而是 wrapper 會不會用的問題。

除了翻找官網文件的 API 之外，在網路上找了一下[^VueTestingHandbook] 發現了一段程式碼

```javascript=
describe("App", () => {
  it("renders a child component via routing", async () => {
    const router = new VueRouter({ routes })
    const wrapper = mount(App, {
      localVue,
      router
    })

    router.push("/nested-route")
    await wrapper.vm.$nextTick()

    expect(wrapper.find(NestedRoute).exists()).toBe(true)
  })
})
```

[^VueTestingHandbook]: [Writing the Test - Vue Testing Handbook](https://lmiller1990.github.io/vue-testing-handbook/vue-router.html#writing-the-test)

其中，它在切換 router 與檢查 Component 存不存在中間加了一行

```javascript
await wrapper.vm.$nextTick()
```

等待渲染結束。
這就是我要的!!

### 測試程式完成

測試了指定 router 的網址，顯示什麼 Component
接下來，就可以加入 `param` 的延伸測試更多的內容囉!!!

```javascript=
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import App from '@/App.vue';
import About from '@/views/About.vue';
import Home from '@/views/Home.vue';
import routes from '@/router/routes';

const localVue = createLocalVue();
localVue.use(VueRouter);

describe('Actions.vue', () => {
  const router = new VueRouter({
    mode: 'history',
    routes,
  });
  const wrapper = mount(App, { localVue, router });

  it('route path: /, component: Home', async () => {
    router.push('/');
    await wrapper.vm.$nextTick();
    expect(wrapper.find(Home).exists()).toBe(true);
  });
  it('route path: /about, component: About', async () => {
    router.push('/about');
    await wrapper.vm.$nextTick();
    expect(wrapper.find(About).exists()).toBe(true);
  });
});
```

下載完整的[練習專案](https://github.com/dwatow/vue-router-jest-demo)