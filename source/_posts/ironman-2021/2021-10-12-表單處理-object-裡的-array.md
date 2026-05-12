---
title: 表單處理 Object 裡的 Array
date: 2021-10-12 00:00:00
tags:
  - 13th鐵人賽
  - vue.js
  - javascript
categories:
  - Vue.js 進階心法
source_url: https://ithelp.ithome.com.tw/articles/10280795
---

今天來看看一個常見問題。

```json
{
  first_name: 'chris',
  last_name: 'wang',
  email: 'chris@goodideas-studio.com',
  camp: {
    name: 'web camp',
    member_count: 10
  },
  skills: ['javascript', 'html', 'css']
}

```

## 先做已經會的

先依昨天講的 UserForm 的 component 可以這樣寫。

```xml
<form @submit.prevent="$emit('submit')">
  <label>firstName<br/>
    <input type="text"
      :disabled="!$listeners['update:firstName']"
      :value="data.firstName"
      @input="$emit('update:firstName', {
        ...data,
        firstName: $event.target.value
      })">
  </label><br/>
  <label>lastName<br/>
    <input type="text"
      :disabled="!$listeners['update:lastName']"
      :value="data.lastName"
      @input="$emit('update:lastName', {
        ...data,
        lastName: $event.target.value
      })">
  </label><br/>
  <label>email<br/>
    <input type="email"
      :disabled="!$listeners['update:email']"
      :value="data.email"
      @input="$emit('update:email', {
        ...data,
        email: $event.target.value
      })">
  </label><br/>
  <CampForm
    :data="data.camp"
    @update:name="$emit('update:camp', {
      ...data,
      camp: $event
    })"
    @update:member_count="$emit('update:camp', {
      ...data,
      camp: $event
    })"
  ></CampForm>
  <pre>skills: {{data.skills}}</pre>
  <input type="submit" value="送出">
</form>

```

畫面

![](/images/c01923ce-7dBBPtS.png)

還有一個 `skills` 怎麼辦呢？

```json
{
  // ....
  skills: ['javascript', 'html', 'css']
}

```

## 這次是 Array 要怎麼看待呢？

> 除了使用 radio 這樣有 options 的選擇元件之外，如果是 tags 怎辦呢？

其實，「就是 Array 的操作要怎麼做在 component 上面」。  
以這個概念回溯回去。

-   一般型別變 input ，就是將一般型別的操作，做到 (原生的) component 上面
-   Object 變表單，就是將物件的操作，做到 component
-   依此類推，Array 也一樣

也因為需求不同，需要用到的操作自然也不會不同。  
今天，我們來試看看 tags 的做法

目標畫面

![](/images/c01923ce-hEn7V1e.png)

-   可以顯示一個資料列表
-   可以新增一個空白欄位
-   可以編輯任一已存在的欄位
-   可以刪除掉任一筆已存在的欄位

> 分別就是 CRUD (create, read, update, delete)

```xml
<div class="tags">
  <div class="tags">
    skills: <button @click.prevent="$emit('create', [...data, ''])">＋</button><br />
    <ul>
      <li :key="index" v-for="(tag, index) in data">
        <input
          :id="`input-tag-${index}`"
          type="text"
          :value="tag"
          @input="$emit('update', [
            ...data.slice(0, index),
            $event.target.value,
            ...data.slice(index+1),
          ])"
        >
        <button @click.prevent="$emit('delete', [
          ...data.slice(0, index),
          ...data.slice(index+1),
        ])">－</button>
      </li>
    </ul>
  </div>
</div>

```

在 UserForm 這一層，要使用 Tabs 來 CRUD skills

```xml
    <Tags
      :data="data.skills"
      @create="$emit('update:skills', {
        ...data,
        skills: $event
      })"
      @update="$emit('update:skills', {
        ...data,
        skills: $event
      })"
      @delete="$emit('update:skills', {
        ...data,
        skills: $event
      })"
    ></Tags>

```

使用 UserForm  
加一個 `@update:skills="$store.commit('user', $event)"`  
表示可以更新 skills

```xml
  <UserForm
    :data="data"
    @update:first_name="$store.commit('user', $event)"
    @update:last_name="$store.commit('user', $event)"
    @update:email="$store.commit('user', $event)"
    @update:camp="$store.commit('user', $event)"
    @update:skills="$store.commit('user', $event)"
    @submit="onSubmit"
  ></UserForm>

```

## 剛剛那個 `...data.slice()` 是什麼巫術？

對於更新資料，堅持使用 immutable 的方式更新。  
並且在觸發的位置就決定如何組資料，這是最適合的。

對於 Array 的 immutable ，要靠 `Array#slice` 取得新的 sub array。  
並且將新的值 (`''`)，更新的值 (`$event.target.value`)，甚至是刪除值都可以做到

下面我們把「組 Array」和「往外傳」分成兩個步驟寫出來。

**create**

```javascript
var new_data = [
  ...data,
  ''
]

```
```javascript
$emit('create', new_data)"

```

**update**

```javascript
var new_data = [
  ...data.slice(0, index),
  new_item, // data[index] 的位置，要修改
  ...data.slice(index+1),
]

```
```javascript
$emit('update', new_data)"

```

**delete**

```javascript
var new_data = [
  ...data.slice(0, index),
  // data[index] 的位置，要刪掉
  ...data.slice(index+1),
]

```
```javascript
$emit('delete', new_data)

```

## 為型別操作而生！才是 web component 設計的思維

將型別的的操作，延伸到 component

輸入

-   簡單型別，使用了 `:value` 將值輸入 component
-   複雜型別，使用了 `:data` 將物件輸入 component

> **要這樣分也是可以唷**  
> 物件型別，使用了 `:data` 將物件輸入 component  
> 陣列型別，使用了 `:list` 將物件輸入 component

輸出

-   簡單型別，使用了 `@input` 表示更新這個值，並將值輸出 component
-   物件型別，使用了 `@update:property` 表示物件更新某個屬性，並將物件輸入 component
-   陣列型別，使用了 `@create`, `@update`, `@delete` 表示陣列更新某個元素，並將陣列輸入 component

所以

在 input 的輸入中，`:value="data.firstName"` 輸出就是取得 firstName 的新值。  
在 camp-form 的輸入中 `:data="data.camp"` 輸出就是取得 user.camp 的新值。  
在 tags 的輸入中 `:data="data.skills"` 輸出就是取得 user.skills 的新值。

物件裡的簡單型別、物件裡的物件型別、物件裡的陣列型別，三件事情的更新層次一致之後，按照這樣的觀念實作，任何巢狀式的物件，就真的不用害怕它的表單有多複雜了。

> 對應方式也許不是一對一，但是可以限縮在一個合理的有限範圍之內，像是表單控制項與資料型別之間的關係，也有著一定的合理範圍之內。

## 複習昨天的重點

有了昨天的學習心得。今天做出這樣的結果是不是就快速許多了呢？

-   當作是 input 的 v-model 的概念一樣，要有進有出，做成 pure component。
-   什麼型別進，就什麼型別出，不要有懸念，除非遇到更新照片這種特別的情況。
-   有多少欄位，就做多少的 event 不要多也不要少，除兩個欄位指的是同一件事，才可以共用 event
-   盡可能的不要加入多餘的 props，只需要傳入物件。

之後是不是遇到什麼 JSON 都可以順利的建立出它相對應的表單了呢？

## 回到 v-model 的寫與不寫

連續三天的 component 的介紹，到今天如果都了解的話，我想說說這一切的開始「捨棄 v-model」這件事，認真說起來我不寫 v-model 很久了，讓我保持讀寫分離的寫法，也讓我可以思考設計 component 的寫法有更多的靈活與彈性。

v-model 本身代表的是 Vue.js 的 directives 厲害之處的一種表現，這是不用懷疑的，只是讓我發現這樣寫讓我覺得問題可以拆成一致的視角，在 Vue.js 裡進行管理複雜度，不會因為資料複雜而讓畫面處理更複雜，感到非常的開心，為了可以交待這一切的思想源頭，特別強調了不要寫 v-model 這件事，但並不代表它不好，只是它不處在這些寫法演進的脈胳之中。

到目前，希望有讓你對 Vue.js 的全新視野與感受，寫起來可以嘗試更多的可能性。  
也希望也可以透過回饋，了解其它的人在 Vue.js 上面的造脂與領悟。

> 咦？30 天還沒到！明天要寫什麼？！
