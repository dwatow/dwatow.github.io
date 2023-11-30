---
title: 用 Vue 包一個 List Component
date: 2023-11-29 14:28:39
tags:
- vue
- component
categories:
- 技術心得
---
# 用 Vue 包一個 List Component

這一篇包 Component 的前置知識，要先看一下鐵人賽的 [Vue.js 進階心法](https://ithelp.ithome.com.tw/users/20107637/ironman/4510)
看完之後，在前端框架自訂 Component 的問題上，會類似「自定義型別」或「抽象資料型」的這種思考上。[^code-complete2-ADT]

先了解到前端在處理資料時，在 Vue 官網教學上，其實學到了處理簡單型別的資料處理方式，將簡單型別透過 `v-model` 綁在畫面上的位置，就可以同時顯示資料，也編輯資料。

簡真實案例，可以說就是在處理 Object 與 Array 的問題，並不只是簡單型別而已。雖然可能可以將 Object 拆解成很多簡單型別進行各別欄位綁定來解決問題，上一篇試圖著保有物件型別的概念來處理問題。而這一篇，針對 Array 這個型別來處理。一樣希望可以保有「型別」這個概念來處理畫面。

[^code-complete2-ADT]: [《CODE COMPLETE：軟體開發實務指南, 2/e (中文版) 》, 6.1 類別的基礎：抽象資料類型（ADTs）](https://www.tenlong.com.tw/products/9789864341313)

## List = 編輯 Array 的界面

第一個想法，就是處理 Array 的編輯問題，但是前端在處理 Array 的方式其實並沒有特定的做法，反而常見的做法是用 Table 來處理。
但是 Table 並不支援 RWD (要也只是讓它可以左右滑動)，通常也不支援可以編輯的情況 (要也可以，但是就是定義在各自的欄位，綁上複雜的編輯函數)。

如何設計一個好的 List Component 就成為了這一篇文章的重點。
在讀 code 上會有更多的資訊可以讀，也希望在界面上有更多的隱喻可以了解實作。

以上一篇的物件為元素組成的陣列為例，這是一個「書籍」的陣列，裡頭的元素是物件。這依然是一個「抽象資料型別」，現在拿出紙筆畫一下，如果要將它變成列表，該怎麼做呢？。

```json=
[{
  "name": "從自學到成功轉職軟體工程師",
  "isbn": "6263330120",
  "publish_date": "2022-01-24",s
  "publish_house": "博碩文化",
  "pages": 264,
  "set_price": 520,
  "author": "Chris"
}, {
  ...
}]
```

我想讓它成為重複出現的表單，這樣既可以編輯，也可以顯示，符合更多的可能性。
也符合真實案例的複雜程度，畫面就如同這樣。

![](https://i.imgur.com/PUgAmkf.png)

那如果我們要用 vue 來寫要怎麼做呢？

## 承前一篇，v-for BookForm

List 需要的編輯行為: 新增元素、編輯元素、移除元素，顯示所有內容。在之後的設計上，會讓這些 method 跟著 List 這個 component。
在此就不管 v-model 的做法。直接使用「把 v-model 拆開」的 BookForm 接續下一步。

**/src/views/Document.vue**

```xml
<div class="book_list">
  <div class="books" v-for="(form, index) in list" :key="form.isbn">
    <BookForm
      :data="form"
      @update:name="onUpdateOneOfList($event, index)"
      @update:isbn="onUpdateOneOfList($event, index)"
      @update:publish_date="onUpdateOneOfList($event, index)"
      @update:publish_house="onUpdateOneOfList($event, index)"
      @update:pages="onUpdateOneOfList($event, index)"
      @update:set_price="onUpdateOneOfList($event, index)"
      @update:author="onUpdateOneOfList($event, index)"
    >
    </BookForm>
    <div style="margin-left: 3.5em;">
      <button class="delete" @click="onRemoveOneOfList(index)">X</button>
    </div>
  </div>
  <div style="margin-top: .5em;">
    <button class="create" @click="onAddOneToList">＋</button>
  </div>
</div>
```

```javascript
import { ref } from 'vue';
import BookForm from '@/components/BookForm.vue';

const list = ref([{
  "name": "從自學到成功轉職軟體工程師",
  "isbn": "6263330120",
  "publish_date": "2022-01-24",
  "publish_house": "博碩文化",
  "pages": 264,
  "set_price": 520,
  "author": "Chris"
}, {
  "name": "金魚都能懂的 CSS 必學屬性",
  "isbn": "9864348825",
  "publish_date": "2022-05-03",
  "publish_house": "博碩文化",
  "pages": 480,
  "set_price": 720,
  "author": "李建杭（Amos Li）"
}, {
  "name": "約耳再談軟體",
  "isbn": "6263246103",
  "publish_date": "2023-09-14",
  "publish_house": "碁峰資訊",
  "pages": 336,
  "set_price": 580,
  "author": "約耳"
  }])

function onAddOneToList() {
  list.value = [
    ...list.value,
    {
      "name": "",
      "isbn": "",
      "publish_date": "",
      "publish_house": "",
      "pages": 0,
      "set_price": 0,
      "author": ""
    },
  ]
}

function onUpdateOneOfList(one, index) {
  list.value = [
    ...list.value.slice(0, index),
    one,
    ...list.value.slice(index + 1),
  ]
}

function onRemoveOneOfList(index) {
  list.value = [
    ...list.value.slice(0, index),
    ...list.value.slice(index + 1),
  ]
}
```

## 設計 List 元件

包成 Component 之後。

**/src/views/Document.vue**

為了讓 List 成為 component 而且元素型別是可以抽換的，並且這個 component 本身就可以新增、刪除、修改元素。
在刪除與修改元素時，還可以把 index 給換掉。

**template**

```xml
<List v-slot="{ form, update }" 
  @add="onUpdateList"
  @del="onUpdateList"
>
  <BookForm
    :data="form"
    @update:name="onUpdateList(update($event))"
    @update:isbn="onUpdateList(update($event))"
    @update:publish_date="onUpdateList(update($event))"
    @update:publish_house="onUpdateList(update($event))"
    @update:pages="onUpdateList(update($event))"
    @update:set_price="onUpdateList(update($event))"
    @update:author="onUpdateList(update($event))"
  ></BookForm>
</List>
```

**script**

維持資料在 view 決定的角度來設計 component，讓 BookForm 成為 pure component

```javascript
import { ref } from 'vue';
import BookForm from '@/components/BookForm.vue';

const list = ref([{
  "name": "從自學到成功轉職軟體工程師",
  "isbn": "6263330120",
  "publish_date": "2022-01-24",
  "publish_house": "博碩文化",
  "pages": 264,
  "set_price": 520,
  "author": "Chris"
}, {
  "name": "金魚都能懂的 CSS 必學屬性",
  "isbn": "9864348825",
  "publish_date": "2022-05-03",
  "publish_house": "博碩文化",
  "pages": 480,
  "set_price": 720,
  "author": "李建杭（Amos Li）"
}, {
  "name": "約耳再談軟體",
  "isbn": "6263246103",
  "publish_date": "2023-09-14",
  "publish_house": "碁峰資訊",
  "pages": 336,
  "set_price": 580,
  "author": "約耳"
  }])

function onUpdateList(new_list) {
  list.value = new_list
}
```

**/src/component/BookForm.vue**

把原本 BookForm 的位置換成 slot。
從 slot 傳出 form 與 修改 form 的 onUpdateOneOfList

**template**

```xml=
<div class="book_list">
  <div class="books" v-for="(form, index) in list" :key="form.isbn">
    <slot :data="form" :update="onUpdateOneOfList(index)"></slot>
    <div style="margin-left: 3.5em;">
      <button class="delete" @click="onRemoveOneOfList(index)">X</button>
    </div>
  </div>
  <div style="margin-top: .5em;">
    <button class="create" @click="onAddOneToList">＋</button>
  </div>
</div>
```

**script**

把原本 method 裡改值的部份，改成吐出與 `props.list` 相同型別 (Array) 的事件。
將 onUpdateOneOfList 改成閉包，將 index 封裝在 List 裡面。

```javascript=
const props = defineProps({
  list: {
    type: Array,
    required: true
  }
})

const emits = defineEmits([
  'add', 'del', 'update'
])

function onAddOneToList() {
  emits('add', [
    ...props.list.value,
    {
      "name": "",
      "isbn": "",
      "publish_date": "",
      "publish_house": "",
      "pages": 0,
      "set_price": 0,
      "author": ""
    }
  ])
}

function onUpdateOneOfList(index) {
  return function (one) {
    emits('update', [
      ...props.list.value.slice(0, index),
      one,
      ...props.list.value.slice(index + 1),
    ])
  }
}
function onRemoveOneOfList(index) {
  emits('del', [
    ...props.list.value.slice(0, index),
    ...props.list.value.slice(index + 1),
  ])
}
```

**優點:**

- 可以將 List 的行為，跟著 List 的 component，編輯與 Form 的編輯相容。
- 符合相同型別進出(props/emits) component 。
- 外部使用可以直接撰寫，不用由實作決定 `$event` 是什麼，直接在設計上決定它是相同型別物件 (Array)。

**缺點:**

- 沒有使用的 `v-model` 處理雙向綁定，將 v-model 拆開寫，需要注意怎麼拆。

## 最後

對於畫面的修改邏輯、與排版方式都可以封裝在 component 是基本的要求。
而在這個範例中，兩個版本對於物件的修改行為，都做到 component 上面了。
只是核心概念不太一樣，最後實作的方式也就不太一樣。

希望可以找到屬於你自己面對前端時，最佳解決處理資料與畫面的方案。