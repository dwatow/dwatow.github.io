---
title: Vue Component 技巧 - 共用 Form
date: 2019-07-03 23:18:37
tags: ['vuejs', 'vuex', 'pure component']
categories: '技術心得'
---

# Vue Component 技巧 - 共用 Form

:::warning
本文會大量使用 Component 一詞，但是它會有兩個意思，在此先進行名詞定義: 
- Vue component，指的是 Vue 框架的一種[寫法](https://vuejs.org/v2/guide/components.html)。
- Component，指的是 pure component，一種輸出永遠只和輸入有關，Component 本身並沒有存任何狀態(資料)，如果設計上需要，要能跨 Page 共用。
:::

在 Vue 中，常見的做法就是將 Component 分層次
在此我們以簡單的層次 Page 和 Component 為例，介紹一下如何做好「表單」這樣的 Component

看此文需具備以下使用經驗

- Webpack
- vue-cli
- vue component

## Page 和 Component

在開始之前，先解釋一下這個層次的分法與原則，雖然很粗略，卻是在學好一個前端框架之後，必須具備的進階觀念

1. Page: 每一頁都是一個 Vue component，負責某些特定資料的載入
2. Component: 每一個 Component 都代表一個處理資料的方式，有些是顯示方式，有些是維護方式，各有不同，也許不會直接處理資料的全部欄位。

## 先說情境，再說說要合併什麼 Component

使用 [Element](https://element.eleme.io/#/en-US) 當 UI Component

這兩個 Vue Component、有三個欄位

1. 角色: `<select ....`
1. 帳號: `<input type="text"`
1. 密碼: 一般的文字顯示

可以看一下這個 vue 大概的樣貌

### 帳號編輯的頁面

```xml=
<template>
  <h1>帳號設定</h1>
  <h2>基本資料</h2>
  <el-form label-position="top" :model="user">
    <el-row :gutter="20">
      <el-col>
        <el-form-item label="角色">
          <el-select disabled 
            v-model="roleName" placeholder="請選擇">
            <el-option v-for="item in rolesOptions"
            :key="item.name" 
            :label="item.name" 
            :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>    
      <el-col :xs="24" :sm="12">
        <el-form-item label="登入帳號">
          <el-input v-model="account" disabled>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="密碼">
          <div>{{ password }}</div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">
        確定送出
      </el-button>
    </el-form-item>
  </el-form>
</template>
```

```javascript=
import ToPathMixin from '@/mixins/ToPath'
export default {
  mixins: [ToPathMixin],
  computed: {
    user() {
      return this.$store.getters.currentUser
    },
    name: {
      get() {
        return this.$store.getters.currentUser.name
      },
      set(value) {
        this.$store.commit('currentUserName', value)
      }
    },
    roleName: {
      get() {
        return this.$store.getters.currentUser.roleName
      },
      set(value) {
        this.$store.commit('currentUserRoleName', value)
      }
    },
    rolesOptions() {
      return this.$store.getters.roles
    },
    account: {
      get() {
        return this.$store.getters.currentUser.account
      },
      set(value) {
        this.$store.commit('currentUserAccount', value)
      }
    }
  },
  methods: {
    async onSubmit() {
      try {
        await this.$store.dispatch('updateUser', {
          userId: this.$route.params.userId
        })
        this.$message({
          message: `成功編輯 ${this.user.name}`,
          type: 'success',
          center: true,
          duration: 1800
        })
        this.toPath('Users')
      } catch (e) {
        this.$message.error(`請重新檢查 ${e.message}`)
      }
    }
  }
}
```

### 新增帳號的頁面

```xml=
<template>
  <h1>帳號設定</h1>
  <h2>基本資料</h2>
  <el-form label-position="top" :model="user">
    <el-row :gutter="20">
      <el-col>
        <el-form-item label="角色">
          <el-select 
            v-model="roleName" placeholder="請選擇">
            <el-option v-for="item in rolesOptions"
              :key="item.name" 
              :label="item.name" 
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="登入帳號">
          <el-input v-model="account">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="密碼">
          <div>{{ password }}</div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">
        確定送出
      </el-button>
    </el-form-item>
  </el-form>
</template>
```

```javascript=
import ToPathMixin from '@/mixins/ToPath'
export default {
  mixins: [ToPathMixin],
  computed: {
    user() {
      return this.$store.getters.currentUser
    },
    name: {
      get() {
        return this.$store.getters.currentUser.name
      },
      set(value) {
        this.$store.commit('currentUserName', value)
      }
    },
    roleName: {
      get() {
        return this.$store.getters.currentUser.roleName
      },
      set(value) {
        this.$store.commit('currentUserRoleName', value)
      }
    },
    rolesOptions() {
      return this.$store.getters.roles
    },
    account: {
      get() {
        return this.$store.getters.currentUser.account
      },
      set(value) {
        this.$store.commit('currentUserAccount', value)
      }
    }
  },
  methods: {
    async onSubmit() {
      try {
        await this.$store.dispatch('createUser', {
          userId: this.$route.params.userId
        })
        this.$message({
          message: `成功編輯 ${this.user.name}`,
          type: 'success',
          center: true,
          duration: 1800
        })
        this.toPath('Users')
      } catch (e) {
        this.$message.error(`請重新檢查 ${e.message}`)
      }
    }
  }
}
```

**template 的差異**

![](https://i.imgur.com/NGoF65N.png)

第 8 行和第 20 行有 `disabled` 的差異。

**script 的差異**

![](https://i.imgur.com/JvEgTd0.png)

只有 39 行，要呼叫的 `action` 有差而已。

## 重新定義問題

這是一個表單，新增與編輯都會用到相同的欄位
差異只有編輯時，有些欄位必須唯讀不可改，送出時所呼叫的程式也不同。

### 目標: 將 Form 合併成 Pure component

Form 很常見，用來

1. 顯示特定 Object
    (太長的表單可能顯示多個 Object 也許就該拆成各別 Object 各別表單，只是剛好顯示在同一個畫面上)
2. 編輯欄位，將資料修改成輸入的樣子
3. 唯讀欄位，不修改資料

在這個例子，要處理的大概就是這樣，而目前的兩份程式碼，複雜又重複，而且也無法直接看出上面三點的目的，要顯示什麼特定的 Object ？要編輯什麼欄位？哪些唯讀？

另外，這次要做到的，並不是增加一個 `isEdit` 的 props 來決定狀態，改變是否欄位唯讀，這個做法只是在增加複雜度而已，最好的做法就是可以將「不修改資料」和「唯讀」綁在一起。

## 開始合併

先建立一個新的 Vue component 在此叫做 `MemberForm.vue` 
先預先把這個 component 放到原本的 Page 上面

**example: 新增帳號的頁面**

`h1` 為頁面標題，所以不移動到 `form` 裡面
`:member` 丟進主要的 Object

```xml
<template>
  <h1>帳號設定</h1>
  <member-form 
    :member="$store.getters.currentUser" />
</template>
```

剩下的我們最後再回來處理

### 新增帳號頁面

**將新增帳號的 `template` 搬進來**

目前唯一的 prop: member

1. 將 `v-model` 拆成 `:value` 和 `@input`
    - `:value` 應該 binding 到 Object property
    - `@input` 用 `$emit` 將值拋出去
2. 唯讀顯示用 Object property

```xml
<template>
  <h1>帳號設定</h1>
  <h2>基本資料</h2>
  <el-form label-position="top" :model="user">
    <el-row :gutter="20">
      <el-col>
        <el-form-item label="角色">
          <el-select 
            :value="member.roleName"
            @input="$emit('onChangeRoleName', $event)"
            placeholder="請選擇">
            <el-option v-for="item in rolesOptions"
              :key="item.name" 
              :label="item.name" 
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="登入帳號">
          <el-input 
            :value="member.account"
            @input="$emit('onChangeAccount', $event)">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="密碼">
          <div>{{ member.password }}</div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item>
      <el-button type="primary" @click="$emit('onSubmit', $event)">
        確定送出
      </el-button>
    </el-form-item>
  </el-form>
</template>
```

**新增帳號的 script 也搬進來**

原本 `v-model` 的 getter 拿掉，而 setter 也變成 event 也可以拿掉了。

- 先設定 prop
  - 將主要的 Object 放進來
  - 下拉式選單的選項也要外部給

```javascript=
export default {
  props: {
    member: Object,
    rolesOptions: Array,
  }
}
```

**回去處理上一層 component**

將原本 `v-model` binding vuex 的 computed 拆開。

- getter 用不到了
- setter 的內容放到自定義的 event 裡，將 `$event` 當參數

```xml
<template>
  <h1>帳號設定</h1>
  <member-form 
    :member="$store.getters.currentUser"
    @onChangeRoleName="$store.commit('currentUserRoleName', $event)"
    @onChangeAccount="$store.commit('currentUserAccount', $event)"
    @onSubmit="onSubmit" />
</template>
```

```javascript=
import ToPathMixin from '@/mixins/ToPath'
import MemberForm from '@/components/MemberForm'
export default {
  mixins: [ToPathMixin],
  components: { MemberForm },
  methods: {
    onSubmit() {
      //...沒變
    }
  }
}
```

這樣應該就可以正常運作原本的頁面。

### 處理編輯帳號的頁面

直接將 template

```xml
<template>
  <div class="userEdit">
    <h1>帳號設定</h1>
    <member-form
      :member="$store.getters.currentUser"
      :rolesOptions="this.$store.getters.roles"
      @onChangeRoleName="$store.commit('currentUserRoleName', $event)"
      @onSubmit="onSubmit" />
  </div>
</template>
```

```javascript=
import ToPathMixin from '@/mixins/ToPath'
import MemberForm from '@/components/MemberForm'
export default {
  name: 'UserEdit',
  mixins: [ToPathMixin],
  components: { MemberForm },
  methods: {
    submit() {
      //...
    }
  }
}
```

### 自動唯讀切換 - 唯讀用 `disabled`

**再回到 Member.vue 加上「編輯帳號」需要的唯讀欄位**

原本的帳號編輯是使用 `disabled` 就先以此為實作目標

怎麼加才好呢？
vue 提供 [`vm.$listeners`](https://vuejs.org/v2/api/#vm-listeners) 讓開發 component 的人可以知道，外部有宣告什麼自訂義的 event ？

在此，將它使用在每一個可以輸入的地方，如果外部呼叫沒有要改變值，就將它 `disabled`

```xml
<el-form-item label="角色">
  <el-select 
    :value="member.roleName"
    @input="$emit('onChangeRoleName', $event)"
    :disabled="!$listeners.onChangeRoleName"
    placeholder="請選擇">
    <el-option v-for="item in rolesOptions"
      :key="item.name" 
      :label="item.name" 
      :value="item.name">
    </el-option>
  </el-select>
</el-form-item>
```

```xml
<el-input 
  :value="member.account"
  @input="$emit('onChangeAccount', $event)"
  :disabled="!$listeners.onChangeAccount"
  >
</el-input>
```

這樣一來，在兩頁的 `<member-from />` 直接比較之下，就可以知道哪些欄位有被 disable 了。

**新增帳號**

會改變 RoleName 和 Account

```xml
<template>
  <h1>帳號設定</h1>
  <member-form 
    :member="$store.getters.currentUser"
    @onChangeRoleName="$store.commit('currentUserRoleName', $event)"
    @onChangeAccount="$store.commit('currentUserAccount', $event)"
    @onSubmit="onSubmit" />
</template>
```

**編輯帳號**

只能修改會改變 RoleName 
Account 唯讀，所以自動成為 `disabled`

```xml
<template>
  <div class="userEdit">
    <h1>帳號設定</h1>
    <member-form
      :member="$store.getters.currentUser"
      :rolesOptions="this.$store.getters.roles"
      @onChangeRoleName="$store.commit('currentUserRoleName', $event)"
      @onSubmit="onSubmit" />
  </div>
</template>
```

### 自動唯讀切換 - 唯讀用 text

**在 MemberForm.vue 唯讀欄位**

利用 [`vm.$listeners`](https://vuejs.org/v2/api/#vm-listeners) 判斷是否要修改，這次改成用 `v-if` 可以切換顯示的形式，改成一般的字串。

```xml
<el-form-item label="角色">
  <el-select v-if="$listeners.onChangeRoleName"
    :value="member.roleName"
    @input="$emit('onChangeRoleName', $event)"
    placeholder="請選擇">
    <el-option v-for="item in rolesOptions"
      :key="item.name" 
      :label="item.name" 
      :value="item.name">
    </el-option>
  </el-select>
  <span v-if="!$listeners.onChangeRoleName">{{member.roleName}}</span>
</el-form-item>
```

```xml
<el-input v-if="$listeners.onChangeAccount"
  :value="member.account"
  @input="$emit('onChangeAccount', $event)"
  >
</el-input>
<span v-if="$listeners.onChangeAccount">{{member.account}}</span>
```

下拉式選單的選項在唯讀時，也可以不用放進 MemberForm 裡了
