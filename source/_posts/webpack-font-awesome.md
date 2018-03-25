---
title: 在 Webpack 使用 Font Awesome
date: 2018-03-25 16:03:45
tags: [nodejs, webpack, vuejs, 'fontawesome', js]
categories: [工具使用]
---
# 在 Webpack 使用 Font Awesome

這是一種很常見的網路字型變 icon 的魔法。
有免費版和付費的專業版

可以看 [How to Use > Use with Node.js](https://fontawesome.com/how-to-use/use-with-node-js)

這裡要特別介紹一下 Font Awesome 的 npm 安裝方式。
需要知道的事
1. fontawesome 安裝時會安裝一個 namespace ，另外要安裝的會另外放在此 namespace 下
    ```shell
    npm i --save @fortawesome/fontawesome
    ```
2. npm 安裝檔的子分類分成這幾種: `solid`, `regular`, `light`, `brands`
    原因在於，付費版與免費版的分別哪些可以用。哪些不能用。

## 手刻移植

在此說說，手刻移值進 vue-cli 時，要怎麼使用？
先依 free version[^font-awesome-free] 的方式進行

依照你的需要進行適合的安裝

```shell
npm i --save @fortawesome/fontawesome
npm i --save @fortawesome/fontawesome-free-solid
npm i --save @fortawesome/fontawesome-free-regular
npm i --save @fortawesome/fontawesome-free-brands
```

再依你需要的引用進來

```javascript
import fontawesome from '@fortawesome/fontawesome'
import faUser from '@fortawesome/fontawesome-free-solid/faUser'
import faCircle from '@fortawesome/fontawesome-free-regular/faCircle'
import faFacebook from '@fortawesome/fontawesome-free-brands/faFacebook'

fontawesome.library.add(faUser)
fontawesome.library.add(faCircle)
fontawesome.library.add(faFacebook)
```

如果要在一個子套件中，使用一個套件可以這樣寫，不過想要在單一個的小套件中，使用很多個icon，有另一種寫法

```javascript
import {faFacebook, faGooglePlus, faTwitter} from '@fortawesome/fontawesome-free-brands'
```

這樣才是萬事俱備，使用方式就如同一般在手刻切版一樣使用 `font awesome`

```htmlmixed
<i class="far fa-envelope"></i>
<i class="fab fa-facebook-f"></i>
<i class="fab fa-twitter"></i>
<i class="fab fa-google-plus-g"></i>
```

## 用 Vue 的寫法如果要 font awesome

安裝 看 [JS Component Packages](https://fontawesome.com/how-to-use/js-component-packages#vue-js)

例子 看 [Vue.js example](https://fontawesome.com/how-to-use/use-with-node-js#using-the-library)



[^font-awesome-free]: [Free version](https://fontawesome.com/how-to-use/use-with-node-js#free)
