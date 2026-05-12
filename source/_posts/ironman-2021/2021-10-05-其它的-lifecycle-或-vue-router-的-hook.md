---
title: 其它的 lifecycle 或 vue router 的 hook
date: 2021-10-05 00:00:00
tags:
  - 13th鐵人賽
  - vue.js
  - javascript
categories:
  - Vue.js 進階心法
source_url: https://ithelp.ithome.com.tw/articles/10277667
---

在 About 刷新一次頁面

還有一些用在我也不太常用的 lifecycle 這次就一起 Demo 一下順序

![](/images/760b4e79-nocJgK8.png)

## 兩個 component 切換

從 About 切到 Home

![](/images/760b4e79-Kn5ATje.png)

## 隱葳的 lifecycle

## keep-alive: activated/deactivated

這是一個原本用在 dynamic component 的 lifecycle，為了在常切換 component 的情境之下，不要重複的銷毀又重新建立 component。

[keep-alive, API — Vue.js](https://vuejs.org/v2/api/#keep-alive)

因為有它保持讓 component 一直存在，所以，不再觸發 created 和 destoryed 那麼在上面的初始與釋放資源的行為怎麼辦？就不會有任何機會再觸發了？

```xml=
<keep-alive>
  <component :is="view"></component>
</keep-alive>

```

在我的例子上，要將 keep-alive 加在 router-view 上面

[router-view, API Reference | Vue Router](https://router.vuejs.org/api/#router-view)

```xml=
<keep-alive>
  <router-view />
</keep-alive>

```

加上兩個 life cycle

```javascript=
{
  // ...
  destroyed() {
    console.warn('[component About] destroyed', this.user)
  },
  activated() {
    console.warn('[component About] activated', this.user)
  },
  deactivated() {
    console.warn('[component About] deactivated', this.user)
  }
}

```

刷新頁面，進入 Home

![](/images/760b4e79-ULa88dQ.png)

切換到 About

![](/images/760b4e79-9VuMb7j.png)

切回 Home

可以發現 About 的 beforeRouteLeave 之後就看不到 Home 的 lifecycle 了。

created、mounted 和 destoryed 都沒有出現了

![](/images/760b4e79-p2YkAjp.png)

切回 About

![](/images/760b4e79-16dK8ku.png)

### 等到渲染完畢，才執行的 $nextTick

[vm.$nextTick( \[callback\] ), API — Vue.js](https://vuejs.org/v2/api/#vm-nextTick)

用「等 DOM 更新好之後，再執行的時候」通常在這個時候如果有一些 jQuery 套件會需要執行 `document.querySelector` 就要在這個時候執行。

通常會在 mounted 時才註冊 nextTick 的 callback

```javascript
export default {
  // ...
  mounted() {
    this.$nextTick(function () {
      // DOM is now updated
      // `this` is bound to the current instance
      this.doSomething()
    }
  }
}

```

![](/images/760b4e79-YxHzhSL.png)

通常會因為簡單的 DOM 結構渲染速度很快，加上非同步的關係，所以很少使用這個 hook。
