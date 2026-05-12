---
title: 用 event 來準備傳給後端的 data
date: 2021-10-07 00:00:00
tags:
  - 13th鐵人賽
  - vue.js
  - javascript
categories:
  - Vue.js 進階心法
source_url: https://ithelp.ithome.com.tw/articles/10278814
---

今天來將畫面做好，我們面對的資料長這樣。

需求: 通常一個使用者的 form 表單是用在新增/編輯資料上面。

我們用一個小小的例子，一步一步的完整帶你看看，除了做出功能之外，又要怎麼樣優雅的滿足這個表單的需求。

```json=
{
  "createdAt": "2021-09-28T13:56:56.181Z",
  "name": "Elizabeth Mitchell",
  "avatar": "https://cdn.fakercloud.com/avatars/sebashton_128.jpg",
  "id": "1"
}

```

## 先做一個表單

通常 id, createdAt 並不會編輯或顯示，所以就不用管它。  
所以只要顯示 name 和 avatar 兩個欄位。

如圖

![](/images/968c4165-aQ12Eqg.png)

程式碼如下

**src/views/User.vue**

在原本的 `<pre>{{ $store.getters.user }}</pre>` 下面加上 name 欄位

-   value: 就將 `object.name` 的做法將值放進 `<input />` 顯示
-   @input: 把 `<input />` 吐出來的值，用 immutable 的方式更新到 data (而不是 `data.name`)
    -   因為是用原生寫法，所以值在 `event.target.value`

```xml=
<div>
  <pre>{{ $store.getters.user }}</pre>
  <form @submit.prevent="onSubmit">
    <p><label>name: <br />
      <input type="text"
        :value="data.name"
        @input="$store.commit('user', {
          ...data,
          name: $event.target.value
        })"></label>
    </p>
    <input type="submit" value="送出">
  </form>
</div>

```

這一步是讓上述的 immutable 看起來不會這麼複雜用的 (暫時是這樣)

> 之後搬進 component 它就變 props 了

```javascript=
export default {
  name: 'User',
  computed: {
    data() {
      return this.$store.getters.user;
    }
  }
};

```

大多數的文字與數字欄位都是這樣處理的，在每一次觸發 `@input` 的過程中，就應該整理好要送到 POST 的物件模樣。

### 圖片

程式碼加一段

```xml=
  <p>
    <img :src="avatarSrc" alt=""><br />
    <input
      type="file"
      @input="updateFile">
  </p>
  <!--   原本的 name 上面加一段 -->
  <p><label>name: <br />
    <input type="text"
      :value="data.name"
      @input="$store.commit('user', {
        ...data,
        name: $event.target.value
      })"></label>
  </p>
  <input type="submit" value="送出">

```

使用 `<input type="file" >` 用來替換新的圖片。

```javascript=
export default {
  name: 'User',
  data(){
    return {
      new_avatar: null,
    }
  },
  computed: {
    data() {
      return this.$store.getters.user;
    },
    avatarSrc() {
      return this.new_avatar || this.data.avatar;
    }
  },
  methods: {
    updateFile(event){
      const file = event.target.files.item(0)
      this.new_avatar = URL.createObjectURL(file);
      this.$store.commit('file', file);
    },
    onSubmit() {
      this.$store.dispatch('createUser', this.$store.getters.user);
    }
  }
};

```

avatarSrc: 用來更新預覽圖片的連結

updateFile: 用來儲存目前上傳到瀏覽器的二進制資料(圖檔)，並且將它轉成可預覽的路徑。

onSubmit: 在此送出 createUser 的 API。若需要把錯誤顯示成 modal 則需要在這 (畫面) 進行錯誤處理。

## 用 event 來準備 POST 的資料

**`POST` `/user`**

request body

```json=
{
  "name": "chris",
  "avatar": "https://fakeimg.pl/300/"
}

```

我們可以看見資料長這樣。

在此我們直接送的資料如果有多餘的欄位，有時候也是可以的。  
所以，要直接把 `$store.getters.user` 送出去。

一般欄位需要的文字、數字資料，都可以像是這個 name 的例子，直接修改 vuex 的時候，同時整理成要傳給後端的資料。

在 dispatch 的時候將 `$store.getters.user` 轉成需要的欄位，不會傳送多餘的欄位。

千千萬萬不要在 submit 的時候跑複雜邏輯整理資料。  
因為這樣會造成 debug 的邏輯變多而已。
