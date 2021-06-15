---
title: Google 的第三方登入 (web 前端實作)
date: 2021-06-15 15:55:36
tags:
- google
- sign-in
- OAuth
- vue
categories:
- 技術心得
---
# Google 的第三方登入 (web 前端實作)

## 概念介紹

要實現第三方登入，有兩種方式

1. 做在前端 ← 這一篇要講的是這個
1. 做在後端

### 前端的第三方登入

<style>
  #sequence-0 {
    width: 100%;
    overflow: scroll;
  }
</style>

```sequence
participant Web App\nClient as client
participant Web App\nServer as server
participant Google 授權畫面 as page
participant Google API Server as google

Note over client: Google SDK 載入、初始完成
Note over client: Google SDK 畫出 Google 登入 按鈕
Note over client: 使用者點擊「Google 登入」

client->google: 呼叫 Google Server 使用第三方登入服務
Note over google: -
google->page: 呼叫登入頁面
Note over page: -
page->client: 提供登入頁面給使用者授權

Note over client: 看見新開的頁面
Note over client: 未授權=>同意授權\n已授權=>頁面在轉動

Note over client,google: 完成前端授權

client->server: 提供 id_token 給後端
Note over server: -
server->google: 使用 id_token 再做一次身份認證
Note over google: 確認授權
Note over client,google: 完成後端授權
google->server: 確認身份是否正確
Note over server: -
server->client: 跟前端說「正確哦」並提供 server 的 token 使用

Note over client: 登入成功
```

兩者之間的差別在於，前端實作，不需要 redirect url 後端實作的話，需要。(慎選套件)
這一篇，介紹的是做在前端。

這次是要介紹如何妥善安排程式碼在 Vue 裡面。

## 設定

**先到 Google 設定第三方登入的憑證**

到[這個頁面](https://console.cloud.google.com/apis/credentials)

1. 如果畫面和我不一樣的話，請先開一個專案
1. 我們要的功能在「憑證」裡面
1. 在憑證裡面，建立一個「OAuth 用戶端 ID」允許第三方登入

![](https://i.imgur.com/oOLBbsi.png)

**點擊 OAuth 用戶端 ID 之後**

1. 因為要要做的是 web 所以選「網頁應用程式」
1. 設定 URI 可以用 ngrok 先用一個臨時的來測試。(在此就用 `http://127.0.0.1:8080` 做代表)
1. 好了就按下「建立」

![](https://i.imgur.com/csG56Px.png)

1. 成功的時候，Google 就會提供用戶端 ID (clientId) 和用戶端密碼，我們只要 clientId
1. 按下確定，就可以來實作程式囉

![](https://i.imgur.com/HsSEvXa.png)


## 實作

[官方網站](https://developers.google.com/identity/sign-in/web/sign-in)

**public/index.html**

需要載入 Google 的 SDK[^fetchGoogle]

```htmlembedded
<script src="https://apis.google.com/js/platform.js" async defer></script>
```

[^fetchGoogle]: [加載 Google 平台庫 - 將 Google Sign-In 集成到您的網絡應用程序中](https://developers.google.com/identity/sign-in/web/sign-in))

### Google initial

在頁面初始的過程，需要在 gapi.load 時初始化或自動登入[^initGAPI]

[^initGAPI]: [使用自定義圖形構建按鈕 - 構建自定義 Google 登錄按鈕 | 網站的 Google 登錄](https://developers.google.com/identity/sign-in/web/build-button#building_a_button_with_a_custom_graphic)

**example code**

```javascript
var startApp = function() {
  gapi.load('auth2', function(){
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    auth2 = gapi.auth2.init({
      client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      // Request scopes in addition to 'profile' and 'email'
      //scope: 'additional_scope'
    });
    attachSignin(document.getElementById('customBtn'));
  });
};
```

在 vue 上實作，必須將這一段放在 main.js 確保不管已登入，還是未登入，在每一次開啟頁面，都會正確初始化

```jsx=
import Vue from 'vue';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  created() {
    // Google Sign-in initial
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
      });
    });
  },
  router,
  render: h => h(App)
}).$mount('#app');
```

### 繪製 Button

可以使用 `gapi.signin2.render` 自訂義繪製時機點

**example code**

```javascript
gapi.signin2.render('my-signin2', {
  'scope': 'profile email',
  'width': 240,
  'height': 50,
  'longtitle': true,
  'theme': 'dark',
  'onsuccess': onSuccess,
  'onfailure': onFailure
});
```

**src/components/googleSigninButton.vue**

直接將 google sign-in button 做成一個按鈕。
並且在 mounted 時繪制

:::warning
**Note**
用 `<div class="g-signin2" data-onsuccess="onSignIn"></div>`
這種內建的方式繪製，它只會在網頁初始時繪製按鈕。

但是登出時會出問題:
按下登出後，會跳轉到登入頁，照理需要繪製登入按鈕
因為這並不是在初始過程，所以不會繪製。
:::

登入 method 的綁定方式，要配合 Google API 的做法
在此，目的是為了傳給後端 `id_token` 所以輸出只 emit 出 id_token 而已。
這部份可以依需求修改。

```jsx=
<template>
  <div>
    <div id="google-sign-in-button"></div>
  </div>
</template>

<script>
export default {
  name: 'GoogleSignInButton',
  props: {
    width: {
      type: String,
      default: null
    },
    height: {
      type: String,
      default: null
    }
  },
  mounted() {
    window.gapi.signin2.render('google-sign-in-button', {
      scope: 'profile email',
      width: this.width,
      height: this.height,
      longtitle: true,
      theme: 'light',
      onsuccess: this.signIn,
      onfailure: () => {}
    });
  },
  methods: {
    signIn(googleUser) {
      const id_token = googleUser.getAuthResponse().id_token;
      this.$emit('sign-in', id_token);
    }
  }
};
</script>
```

使用 GoogleSignInButton component

```jsx=
<template>
  <div>
    <GoogleSignInButton @sign-in="oAuthSignIn('google', $event)"></GoogleSignInButton>
  </div>
</template>

<script>
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default {
  name: 'AuthSignin',
  components: {
    GoogleSignInButton
  },
  methods: {
    async oAuthSignIn(provider, id_token) {
      try {
        await this.$store.dispatch('oAuthLogin', {
          provider,
          id_token
        });
        this.$emit('submit');
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
```

### 登出

若你想要在登出時，同時斷開使用者給予的授權，就可以增加這一段。[^sign-out]

[^sign-out]: [註銷用戶 - 將 Google Sign-In 集成到您的網絡應用程序中](https://developers.google.com/identity/sign-in/web/sign-in)

**example code**

```jsx
<a href="#" onclick="signOut();">Sign out</a>
<script>
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
</script>
```

**src/views/navigation.vue**

```jsx=
<template>
  <div class="shadow">
    <botton @click="Logout">登出</botton>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  methods: {
    async Logout() {
      try {
        const isLogout = window.confirm('確定要登出');
        if (isLogout) {
          const auth2 = window.gapi.auth2.getAuthInstance();
          auth2.signOut().then(() => {
            console.log('Google User signed out.');
          });
          // 可以在這個時候移除 cookie
          window.alert('已登出');
          this.$router.push({ name: 'Signin' }); // 回到登入頁
        }
      } catch (error) {
        if (error instanceof Error) {
          window.alert(error.messages);
        } else {
          window.alert(error.detail);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
```
