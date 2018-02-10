---
title: Facebook 網頁登入
date: 2018-02-09 22:37:58
tags: ['Facebook', 'login']
categories: "技術練習"
---
# Facebook 網頁登入

facebook 登入，真的還滿簡單的。
一切就從[這一篇官網文件](https://developers.facebook.com/docs/facebook-login/web)說起吧。

有人會想，明明官網都寫了這麼清楚的文件了，為什麼 Chris 還要寫一篇來湊熱鬧？
當然，是我自己看了很久，弄半天才弄出來，所以才寫一篇來翻譯翻譯 facebook 官網文件在寫什麼呀。

就當作是這是一篇導讀文吧！

## 先知道我們面對的是什麼

1. 在前端
2. 用 JavaScript

所以，facebook 標題寫「搭配 JavaScript SDK 的網頁版『Facebook 登入』」看到兩個重點

1. JavaScript SDK
2. Facebook 登入

## JavaScript SDK

直接看另一篇[官網文件](https://developers.facebook.com/docs/javascript/quickstart) [^FB SDK]

可以在網站上使用「讚」、「登入」、「分享」...之類的 facebook 功能。

### 基本設定

放在  `<body>` 開頭的後方
`Facebook 應用程式的編號` 來取代 `your-app-id`
```html=
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId            : 'your-app-id',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v2.12'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>
```

以上就是快速入門的 facebook SDK 的初始化過程

再來進入主題了

## Facebook 登入

準備材料
1. 一個 facebook 應用程式
2. 重新導向網址要登記上去。(讓 api 可以在這個 domain 之下 work)

### 檢查登入狀態

流程大概是這樣
1. 頁面載入
2. 初始化 facebook SDK
3. 檢查登入狀態

官網提供的程式碼
在此時官網並沒有提供它的實作。
```javascript=
FB.getLoginStatus(function(response) {
    //statusChangeCallback(response);
    console.log(response)
});
```
建議先註解 `statusChangeCallback` 並且印出 `response` 看看內容是不是像官網說的這樣

```javascript
{
    status: 'connected',
    authResponse: {
        accessToken: '...',
        expiresIn:'...',
        signedRequest:'...',
        userID:'...'
    }
}
```

### 使用者登入

在此，有兩個方式
1. facebook 幫你生成一切的「登入按鈕」
2. facebook 的 api

#### 登入按鈕

這裡有個雷點。

雖然 facebook 貼心的準備了一個程式碼產生器
![](https://i.imgur.com/Nr2KYwb.png)

按下「取得程式碼」，進入三步驟

1. 選你的 facebook 應用程式
2. 複製你要初始 facebook SDK 的程式碼
    ```javascript=
    <div id="fb-root"></div>
    <script>
    (function(d, s, id) {
        var fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        var js = d.createElement(s);
        js.id = id;
        js.src = <一段 url>;       
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    </script>
    ```
3. 貼上 button 的 html
    ```html=
    <div class="fb-login-button" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false"></div>
    ```

> 如果，你貼過上面第一段的 facebook SDK ，可以對照一下。它雖然有給你 facebook SDK ，但是卻沒有初始化。
> 建議不要使用這一段 SDK 要使用[第一段](#基本設定)的。

又或者，不要管程式碼產生器，直接用第一段的初始化，和這一段 code 來產生按鈕

```html=
<fb:login-button scope="public_profile,email" onlogin="checkLginState();"> </fb:login-button>
```

然後 按下它執行這一段

```javascript=
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

```

#### 登入按鈕

只需呼叫 [`FB.login()`](https://developers.facebook.com/docs/reference/javascript/FB.login)

直接在 `console` 貼上這一段 code 等同於按下登入

```javascript=
FB.login(function(response){
    // Handle the response object,
    // like in statusChangeCallback() in our demo
    // code.   
});
```

### 登出

同理可證
```javascript=
FB.logout(function(response) {
    // Person is now logged out
});
```

以上，再配合官網的文件就可以完成了!!

facebook 應用程式開發版只能提供自己登入。
如果你按我的範例沒有成功，並不是我沒寫好，一定是還沒有申請通過!!


## 參考資料

[^FB SDK]: [快速入門：Facebook JavaScript SDK](https://developers.facebook.com/docs/javascript/quickstart)
