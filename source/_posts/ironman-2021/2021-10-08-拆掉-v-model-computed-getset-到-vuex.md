---
title: 拆掉 v-model + computed get/set 到 vuex
date: 2021-10-08 00:00:00
tags:
  - 13th鐵人賽
  - vue.js
  - javascript
categories:
  - Vue.js 進階心法
source_url: https://ithelp.ithome.com.tw/articles/10279261
---

為什麼要特別寫 Form 表單攻略呢？  
因為這是使用者可以輸入資料的常見途徑，一種可以「寫入」資料的方式。

為了使用者可以將資料好好的寫入，**單一資料流**安排了一系列的旅程讓資料流動。  
下面來圖解一下上一次的程式碼與官網推薦的寫法差在哪，各有什麼好壞。

## 從畫面到 vuex

### 用官網教的方式

[官方網站的 Two-way Computed Property](https://vuex.vuejs.org/guide/forms.html#two-way-computed-property) 其實也是示範直接用 commit 。過我們還是在第一版遵守「要用 dispatch 觸發 commit」的規則。

> 雖然這個規則有可能是要說「從 dispatch 要怎麼更新 state 的建議」

![](/images/94084258-qofT5i3.png)

每一個區塊，都是一段程式碼，都是一個可能出現 bug 的地方。  
所以，我想要將這一切變緊湊一點，並且讓「不要出現簡單邏輯的贅 code 」

### 不要用 dispatch ，直接用 commit

就連官網教學，都不這麼做了，為什麼不照官網示範呢？  
其實，我不建議這種教條式的學習方式。XDDD

沒有什麼一定要或一定不要，只有優缺點比較。

![](/images/94084258-QJ7KW4I.png)

> 優點:
> 
> -   看見程式碼可以直接區分同步動作與非同步動作。
> -   少了一段 dispatch 直接送給 commit 的贅 code

### 將 v-model + computed(get/set) 的組合寫法拿掉

將 computed 裡 get/set 的內容拆下來，不用寫 `this` 直接寫在 template。  
整個資料流的 code 就變得更理想。

我承認這個做法，只是我個人的偏好，與官網建議並不一樣。  
沒錯！來看看優缺點

![](/images/94084258-KPQP6EE.png)

優點

-   多個欄位綁定時，省掉多組的 computed(get/set) 的贅 code
-   比起用 v-model 的優雅，沒有粗糙很多 (好好好...這很主觀)
-   加強 script 的區段「只存放複雜邏輯」的意義

缺點

-   無法在 template 優雅的使用 v-model
-   複雜邏輯無法使用

### 變化

1.  如果 `:value=$store.getters.user.name` 變得很複雜怎麼辦？

例如要過濾呀，要條件，要整理資料才可以用呀！這些怎麼辦？

-   如果屬於資料邏輯，寫在 getters
-   如果屬於畫面邏輯，寫成 computed (不用 get/set) ，在 template 綁成一個變數  
    ex: `:value="userName"`

2.  如果 `@input="$store.commit('user', { ...data, name: $event })"`

如果，name 出來之後，還要欄位驗證，還檢查是不是 C 開頭？之類的，或者要轉成另一種文字再儲存，如果是數字有可能遇到轉成另一個單位再儲存，這些怎辦？

-   如果屬於資料邏輯，寫在 mutation
-   如果屬於畫面邏輯，寫成 method ，在 template 綁成一個 method name  
    ex: `@input="="updateUserName"`

> 雖然 v-model + computed(get/set) 的做法一樣可以面對這種複雜的程式碼  
> 但是，它卻無法將「簡單邏輯」與「複雜邏輯」區分開來。

## 這樣一來，就完全不會用到 computed + get/set

將寫法緊湊，是讓我對 vue 的一種革命性的體驗。

最重要的一個關鍵就是不怕將欄位儲存到 vuex 並且也不怕一個欄位一個欄位的綁起來

而且，其實仔細看 mutation 並不會依照欄位一個一個開，而 getters 也不會一個一個開。  
多個欄位的綁定對於初學 vue + vuex 的人來說，是一場惡夢，因為官網並沒有任何指引告訴你該怎麼避免增長不必要的複雜度。
