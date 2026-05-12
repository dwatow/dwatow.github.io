---
title: "Component 鬼牌(一): 看 props 決定 Component"
date: 2021-09-23 00:00:00
tags:
  - 13th鐵人賽
  - vue.js
  - javascript
categories:
  - Vue.js 進階心法
source_url: https://ithelp.ithome.com.tw/articles/10270412
---

[鬼牌](https://zh.wikipedia.org/wiki/%E9%AC%BC%E7%89%8C)，在此借用的意思是「可以成為任何一張牌」

## Dynamic Components 可以當鬼牌

Dynamic Components 技術使用 `<component :is="">` 讓 component 可以抽換成其它已經規畫好的 component。

## 需求: 長型表單

不管是申請信用卡、成為購物網站會員、基金申購平台帳號，可能就有機會填寫到這麼長的表單，設計師為了讓使用者的體驗較好，所以會把長型表單改成多個短表單，一步一步的引導使用者將表單填寫完畢。

在這個過程，如果需要將資料暫存在 localStorage 中，就變成是一件麻煩的事情，是否要一段一段的將資料儲存在各別的 localStorage 中？還是有其它的辦法呢？

以下圖為例，拿四個欄位的表單當作長型表單。(數量請大家自行指數成長)

通常都是分成第一步、第二步....這樣。

![](/images/01c959ca-lMlQHCH.png)

原本，如果是很長的表單，我們會這樣寫。對工程師來說方便，data 也只有一個要儲存在 localStorage 也只有一個欄位就好。

**App.vue**

```xml
<template>
  <div id="app">
    <form @submit.prevent="onSubmit">
      <div>
        <label for="field1">
          field1
          <input type="text" id="field1"
          	  v-model="data.field1">
        </label>
      </div>
      <div>
        <label for="field2">
          field2
          <input type="text" id="field2"
          	  v-model="data.field2">
        </label>
      </div>
      <div>
        <label for="field3">
          field3
          <input type="text" id="field3"
          	  v-model="data.field3">
        </label>
      </div>
      <div>
        <label for="field4">
          field4
          <input type="text" id="field4"
          	  v-model="data.field4">
        </label>
      </div>
      <input type="submit">
    </form>
  </div>
</template>

```
```javascript=
export default {
  name: 'App',
  methods: {
    onSubmit() {
      console.log('submit', JSON.stringify(this.mock));
    },
  },
  data() {
    return {
      index: 1,
      mock: {
        field1: 'field_data1',
        field2: 'field_data2',
        field3: 'field_data3',
        field4: 'field_data4',
      },
    };
  },
};

```

## 有幾步就拆成幾個 component

直接把表單拆成兩個 component。  
並且將欄位拆進 component 裡面 (因為接下來要抽換它們)

```xml=
<template>
  <div id="app">
    <form @submit.prevent="onSubmit">
      <step1
        :data="mock"
        @update:data="mock=$event"
      ></step1>
      <step2
        :data="mock"
        @update:data="mock=$event"
      ></step2>
      <input type="submit">
    </form>
  </div>
</template>

```

註冊 2 個 component

```javascript=
import step1 from '@/components/LongForm/step1.vue';
import step2 from '@/components/LongForm/step2.vue';

export default {
  name: 'App',
  // ...
  components: {
    step1,
    step2,
  },
  // ...
}

```

**step1.vue**

因為兩步目前長得一樣，所以只看其中一個就好了

```xml=
<template>
  <div>
    <div>
      <label for="field1">
        field1
        <input type="text"
          id="field1"
          :value="data.field1"
          @input="$emit('update:data', {
            ...data,
            field1: $event.target.value
          })">
      </label>
    </div>
    <div>
      <label for="field2">
        field2
        <input type="text"
          id="field2"
          :value="data.field2"
          @input="$emit('update:data', {
            ...data,
            field2: $event.target.value
          })">
      </label>
    </div>
  </div>
</template>

```

在此，我們已經把 v-model 拆開寫，「單純只有欄位 binding 的 code 」只會出現在 html 上面。

在此只是一個簡單的 pure component 如果要加上複雜的邏輯，就有相當乾淨的環境可以加上去。

```javascript=
export default {
  name: 'LongForm1',
  props: {
    data: {
      type: Object,
      requried: true,
    },
  }
};

```

### 換成多個 `<component :is="">`

並且將 `:is` binding 成 step1 和 setp2 的 component 名字。

[is, API — Vue.js](https://vuejs.org/v2/api/#is)

```xml=
<template>
  <div id="app">
    <form @submit.prevent="onSubmit">
      <component
        :is="'step1'"
        :data="mock"
        @update:data="mock=$event"
      ></component>
      <component
        :is="'step2'"
        :data="mock"
        @update:data="mock=$event"
      ></component>
      <input type="submit">
    </form>
  </div>
</template>

```

### 換成一個 `<component :is="">`

換成同一個 `<component :is="">` 時，可以注意兩個 component 的 v-bind 和 v-on 必須要一樣。

```xml=
<template>
  <div id="app">
    <div>現在是第 {{ current_step }} 步</div>
    <form @submit.prevent="onSubmit">
      <component
        :is="`step${index}`"
        :data="mock"
        @update:data="mock=$event"
      ></component>
      <input v-if="current_step === 2" type="submit">
      <input v-else type="button" value="下一步" @click="onNext">
    </form>
  </div>
</template>

```
```javascript=
export default {
  name: 'App',
  // ...
  data() {
    return {
      current_step: 1,
      // ...
    }
  },
  methods: {
    onNext() {
      this.current_step += 1;
      console.log('current_step', this.current_step);
    },
    onSubmit() {
      console.log('submit', JSON.stringify(this.mock));
    },
  },
},

```

## 最後的畫面

一開始是這樣

第一步

![](/images/01c959ca-dvVt9bh.png)

第二步  
寫到第二步，如果重新整理，會回到第一步。

![](/images/01c959ca-4BncVgO.png)

最後提交表單。

## 存到 localStorage

在 onNext 的時候，就可以儲存起來。  
而且，因為是長表單，所以當下到第幾步和資料都給它儲存下來。

修改的程式  
在 created 要把 localStorage 讀取出來恢復資料。  
在 onNext 的地方要在 localStorage 儲存現況。

```javascript=
export default {
  name: 'App',
  // ...
  created() {
    const demoStatus = JSON.parse(localStorage.getItem('DemoMock'));
    if (demoStatus.data) {
      this.mock = demoStatus.data;
    }
  },
  // ...
  methods: {
    onNext() {
      this.current_step += 1;
      console.log('current_step', this.current_step);
      localStorage.setItem('DemoMock', JSON.stringify({
        setp: this.current_step,
        data: this.mock
      }));
    },
  }
}

```
