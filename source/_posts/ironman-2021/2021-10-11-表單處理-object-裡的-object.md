---
title: 表單處理 Object 裡的 Object
date: 2021-10-11 00:00:00
tags:
  - 13th鐵人賽
  - vue.js
  - javascript
categories:
  - Vue.js 進階心法
source_url: https://ithelp.ithome.com.tw/articles/10280343
---

今天來看看一個常見問題。

```json=
{
  first_name: 'chris',
  last_name: 'wang',
  email: 'chris@goodideas-studio.com'
  camp: {
    name: 'web camp',
    member_count: 10
  }
}

```

## 先做已經會的

先依昨天講的 UserForm 的 component 可以這樣寫。

```xml=
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
    <pre>camp: {{data.camp}}</pre>
    <input type="submit" value="送出">
</form>

```

畫面

![](/images/255c40c2-0zmjK2a.png)

還有一個 `camp` 怎麼辦呢？

```json=
{
  // ....
  camp: {
    name: 'web camp',
    member_count: 10
  }
}

```

## 先為這個物件做一個 component

也就是以這樣的視角看待它

```json=
{
  name: 'web camp',
  member_count: 10
}

```

有一個 camp 的視角時，依昨天教的，是不是就可以這樣做

```xml=
<div class="camp-fields">
  <div class="camp-fields">
    <label>
      name<br />
      <input
        type="text"
        :disabled="!$listeners['update:name']"
        :value="data.name"
        @input="
          $emit('update:name', {
            ...data,
            name: $event.target.value,
          })
        "
      />
    </label><br />
    <label>
      member_count<br />
      <input
        type="number"
        :disabled="!$listeners['update:member_count']"
        :value="data.member_count.toString()"
        @input="
          $emit('update:member_count', {
            ...data,
            member_count: Number($event.target.value),
          })
        "
      />
    </label><br />
  </div>
</div>

```

在此，還對 `type="number"` 的欄位做了轉態，將資料保持在數字型別。但是顯示時要轉型別，從數字變成字串。

```xml=
<form @submit.prevent="$emit('submit')">
    <input type="text"
      :disabled="!$listeners['update:firstName']"
      :value="data.firstName"
      @input="$emit('update:firstName', {
        ...data,
        firstName: $event.target.value
      })">
    <input type="text"
      :disabled="!$listeners['update:lastName']"
      :value="data.lastName"
      @input="$emit('update:lastName', {
        ...data,
        lastName: $event.target.value
      })">
    <input type="email"
      :disabled="!$listeners['update:email']"
      :value="data.email"
      @input="$emit('update:email', {
        ...data,
        email: $event.target.value
      })">
    <camp-form
      :data="data.camp"
      @update:name="$emit('update:camp', {
        ...data,
        camp: $event
      })"
      @update:member_count="$emit('update:camp', {
        ...data,
        camp: $event
      })"
    ></camp-form>
  <input type="submit" value="送出">
</form>

```

![](/images/255c40c2-Xc6wH5M.png)

並且在 UserForm 上面加上新的 event `@update:camp="$store.commit('user', $event)"` 表示在此會修改 camp 這個屬性。

```xml
  <UserForm
    :data="data"
    @update:firstName="$store.commit('user', $event)"
    @update:lastName="$store.commit('user', $event)"
    @update:email="$store.commit('user', $event)"
    @update:camp="$store.commit('user', $event)"
    @submit="onSubmit"
  ></UserForm>

```

## 在此有一個有趣的比較

為方便抓到重點，我把不必要的 `type="text"` 先拿掉，因為它是預設值，也把 `disabled` 拿掉因為要不要這個屬性，是看需求，不是設計的重點。(只是符合需求時，這樣做很符合語意)

```xml=
<input
  :value="data.firstName"
  @input="$emit('update:firstName', {
    ...data,
    firstName: $event.target.value
  })"
>

```

跟下面的 `form` 做一個對比。

```xml=
<camp-form
  :data="data.camp"
  @update:name="$emit('update:camp', {
    ...data,
    camp: $event
  })"
  @update:member_count="$emit('update:camp', {
    ...data,
    camp: $event
  })"
></camp-form>

```

## 為型別而生！才是 web component 設計的思維

兩個都是為了處理 user 的屬性，而使用的 component。

輸入

-   簡單型別，使用了 `:value` 將值輸入 component
-   複雜型別，使用了 `:data` 將物件輸入 component

輸出

-   簡單型別，使用了 `@input` 表示更新這個值，並將值輸出 component
-   複雜型別，使用了 `@update:property` 表示物件更新某個屬性，並將物件輸入 component

所以

在 input 的輸入中，`:value="data.firstName"` 輸出就是取得 firstName 的新值。  
在 camp-form 的輸入中 `:data="data.camp"` 輸出就是取得 user.camp 的新值。

兩件事情的更新層次一致之後，按照這樣的觀念實作，任何巢狀式的物件，就不用害怕它的表單有多複雜了。

> 對應方式也許不是一對一，但是可以限縮在一個合理的有限範圍之內，像是表單控制項與資料型別之間的關係，也有著一定的合理範圍之內。

## 複習昨天的重點

有了昨天的學習心得。今天做出這樣的結果是不是就快速許多了呢？

-   當作是 input 的 v-model 的概念一樣，要有進有出，做成 pure component。
-   什麼型別進，就什麼型別出，不要有懸念，除非遇到更新照片這種特別的情況。
-   有多少欄位，就做多少的 event 不要多也不要少，除兩個欄位指的是同一件事，才可以共用 event
-   盡可能的不要加入多餘的 props，只需要傳入物件。
