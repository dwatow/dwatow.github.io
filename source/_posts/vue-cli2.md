---
title: 使用 Vue-cli 2
date: 2018-09-21 09:56:29
tags: ["vue-cli", "vuejs", "webpack"]
categories: 工具使用
---

# 使用 Vue-cli 2

雖然 vue-cli 出了 3 版，在此先聊聊 2 版怎麼開始，也許新手對 vue-cli 3 接受度會大增。
vue.js 有了自己初始專案的 cli (Command Line Interface) 工具，稱為 vue-cli，用途在於初始專案。
就像你使用了 visual studio 選擇不同的專案類型，它會生成相對不同類型的初始程式碼與設定給你。

## 安裝

找到 [`vue-cli`](https://github.com/vuejs/vue-cli) (現在已是 VUE CLI 3)

```shell
$ npm install -g vue-cli
```

## 初始化專案

下面來一一介紹一下這幾種有什麼差異與用途。

### [webpack](https://github.com/vuejs-templates/webpack)

A full-featured Webpack + vue-loader setup with hot reload, linting, testing & css extraction

主要是用在 vue 的大型、正式專案，提供一個可以選擇是否要加上以下列的工具

使用 webpack 並且附帶各種工具

- 整合前端 router (vue-router)
- 對於 CSS、JavaScript 新舊版與跨瀏覽器問題 (像是 PostCSS 或 Babel)
- 附帶 Coding Style (ESLint) 與 測試工具 (unit test, E2E test)。

**使用方式**

```shell
$ vue init webpack vue-webpack-demo

?   Project name   (vue-webpack-demo)
?   Project description   (A Vue.js project)
?   Author   (chris <dwatow@gmail.com>)
?   Vue build   (Use arrow keys)
❯ Runtime + Compiler: recommended for most users
  Runtime-only: about 6KB lighter min+gzip,
  but templates (or any Vue-specific HTML) are
  ONLY allowed in .vue files - render functions are
  required elsewhere

?   Install vue-router?   (Y/n)
?   Use ESLint to lint your code?   (Y/n)
?   Pick an ESLint preset   (Use arrow keys)
❯ Standard (https://github.com/standard/standard)
  Airbnb (https://github.com/airbnb/javascript)
  none (configure it yourself)

?   Set up unit tests   (Y/n)
❯ Jest
  Karma and Mocha
  none (configure it yourself)

?   Setup e2e tests with Nightwatch?   (Y/n)
?   Should we run \`npm install\` for you after the project has been created? (recommended)   (Use arrow keys)
❯ Yes, use NPM
  Yes, use Yarn
  No, I will handle that myself
## 到此就是所有的問題了

vue-cli   · Generated "vue-webpack-demo".


\# Installing project dependencies ...
\# ========================

⸨   ░░░░░░░░░░░░░░░░░⸩ ⠴ fetchMetadata: sill   pacote range manifest for glob-base@^0.3.0 fetched in
```

初始化完成後，輸入下列指令，可看見初始化好的成果

```shell
$ cd my-project
$ npm install
$ npm run dev
```

### Vue build 的問題

這些問題中， vue build 的問題讓我不太了解它要問什麼，所以拿來比較了一下。

**Vue Build 選 1**: Runtime + Compiler: recommended for most users
就是一般的選擇

**build/webpack.base.conf.js**

參考[What’s the difference between vue.esm.js and other vue dist files?](https://forum.vuejs.org/t/whats-the-difference-between-vue-esm-js-and-other-vue-dist-files/7259/9)

以下是 使用 `git diff` 看差異的結果。 `+` 的是 vue build 選 1 的 code

```javascript=
module.exports = {
   //...
   resolve: {
     extensions: ['.js', '.vue', '.json'],
     alias: {
+      'vue$': 'vue/dist/vue.esm.js',
       '@': resolve('src'),
     }
   },
}
```

**src/main.js**

```javascript=
+ // The Vue build version to load with the `import` command
+ // (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//...

 new Vue({
   el: '#app',
   router,
-  render: h => h(App)
+  components: { App },
+  template: '<App/>'
 })
```

**Vue build 選 2**: Runtime-only: about 6KB lighter min+gzip,
but templates (or any Vue-specific HTML) are
ONLY allowed in .vue files - render functions are
required elsewhere

意思是使用更接近編譯器的模版替代方案: 使用自訂的渲染函數來初始 vue 的 root

```javascript=
render: function (createElement) {
 return createElement(
   'h' \+ this.level,   // tag name: h1~h6
   this.$slots.default // array of children
 )
},
```

關於渲染函數可以看 [Render Functions & JSX](https://vuejs.org/v2/guide/render-function.html)

### [webpack-simple](https://github.com/vuejs-templates/webpack-simple)

A simple Webpack + vue-loader setup for quick prototyping.

主要是用在 vue 的與 webpack 整合在一起時，因為使用 vue-loader 可以使用 `.vue` 檔。

個人覺得是學習 vue + webpack 的過渡環境。

```shell
$ vue init webpack-simple my-project
$ cd my-project
$ npm install
$ npm run dev
```

### [browserify](https://github.com/vuejs-templates/browserify)

A full-featured Browserify + vueify setup with hot-reload, linting & unit testing.

- A full-featured Browserify
- vueify setup with hot-reload
- linting
- unit testing.

使用 browserify 的選項

```shell
$ vue init browserify vue-browserify-demo

  A newer version of vue-cli is available.

  latest:    2.9.3
  installed: 2.9.2

? Project name vue-browserify-demo
? The version of the package 0.1.0
? Project description A Vue.js project
? Author chris <dwatow@gmail.com>
? Vue build standalone
? Use ESLint to lint your code? Yes
? Setup unit tests with Karma + Jasmine? Yes

   vue-cli · Generated "vue-browserify-demo".

   To get started:

     cd vue-browserify-demo
     npm install
     npm run dev
```

初始化完成後，輸入下列指令，可看見初始化好的成果

```shell
$ cd vue-browserify-demo
$ npm install
$ npm run dev
```

### [browserify-simple](https://github.com/vuejs-templates/browserify-simple)

A simple Browserify + vueify setup for quick prototyping.

使用 browserify 簡化環境 的選項

```shell
$ vue init browserify-simple vue-browserify-simple-demo
A newer version of vue-cli is available.

latest:    2.9.3
installed: 2.9.2

? Project name vue-browserify-simple-demo
? Project description A Vue.js project
? Author chris <dwatow@gmail.com>

 vue-cli · Generated "vue-browserify-simple-demo".

 To get started:

   cd vue-browserify-simple-demo
   npm install
   npm run dev
```

初始化完成後，輸入下列指令，可看見初始化好的成果

```shell
$ cd vue-browserify-simple-demo
$ npm install
$ npm run dev
```

### [PWA](https://github.com/vuejs-templates/pwa)

PWA template for vue-cli based on the webpack template

用 Vue 寫 PWA。

```shell
$ vue init pwa my-project

A newer version of vue-cli is available.

latest:    2.9.3
installed: 2.9.2

? Project name vue-pwa-demo
? Project short name: fewer than 12 characters to not be truncated on homescreens (default: same as name)
? Project description A Vue.js project
? Author chris <dwatow@gmail.com>
? Vue build standalone
? Install vue-router? Yes
? Use ESLint to lint your code? Yes
? Pick an ESLint preset Standard
? Setup unit tests with Karma + Mocha? Yes
? Setup e2e tests with Nightwatch? Yes

 vue-cli · Generated "vue-pwa-demo".

 To get started:

   cd vue-pwa-demo
   npm install
   npm run dev

 Documentation can be found at https://vuejs-templates.github.io/webpack
```

初始化完成後，輸入下列指令，可看見初始化好的成果

```shell
$ cd my-project
$ npm install
$ npm run dev
```

### [simple](https://github.com/vuejs-templates/simple)

The simplest possible Vue setup in a single HTML file

```shell
$ vue init simple my-project  # Create a new project based on this template

A newer version of vue-cli is available.

latest:    2.9.3
installed: 2.9.2

? name vue-simple-demo
? author chris <dwatow@gmail.com>

 vue-cli · Generated "vue-simple-demo".
```

初始化完成後，輸入下列指令，可看見初始化好的成果

```shell
$ cd my-project               # Navigate into your new project folder

$ npm install -g live-server  # Install live-server if you haven't already
$ live-server                 # Run live-server and open it in your browser`
```

- 開發編譯使用 `npm run dev` 。
- 佈署編譯使用 `npm run build` 。
