---
title: 給想學 JS 的前端「JS 生態系及週邊工具整理」導讀
date: 2018-02-17 19:33:25
tags: ['2018鐵人賽', 'JavaScript', 'nodejs', 'vuejs', 'webpack', 'vue-cli']
categories: '讀技術書'
---
# 給想學 JS 的前端「JS 生態系及週邊工具整理」導讀

> 原著的系列名稱是「平時沒注意的 JavaScript - JS 生態系及週邊工具整理」因為名字太長，在此的文章名稱節錄後半段而已。

這一系列，除了 JS 技術，還有整個 JS 生態系脈胳的發展故事，除了以原著的順序閱讀之外，我自己如下的將它們依重點分成幾類。

如果覺得我分得不順的朋友，可以試看看原著的順序。

## Messager Extension

了解 Messager Extension 怎麼起頭，小心的雷點

- [打造 Messenger Extension - Day 1](https://ithelp.ithome.com.tw/articles/10190670)
- [打造 Messenger Extension - Day 2 - 設定 whitelisted\_domains, home\_url, persistent_menu](https://ithelp.ithome.com.tw/articles/10190775)
- [打造 Messenger Extension - Day 3 - CORS, Same-origin policy 和 iFrame](https://ithelp.ithome.com.tw/articles/10190885)

## 介紹 node.js 從伺服器到編譯器

這一段的介紹相當精彩，從 JavaScript 的模組化缺陷，到社群與 ES 先後以不同的方式試著解決此問題，再到 node.js 的崛起(為什麼這麼重要？)
JavaScript 從前端走向後端，再從後端走回前端

- [你所不知道的 JavaScript 模組化歷史，NPM & Module](https://ithelp.ithome.com.tw/articles/10191168)
- [JavaScript 如何越來越像正常的語言 - 前端模組化早期歷史( YUI + scope)](https://ithelp.ithome.com.tw/articles/10191198)
- [小插曲 \- 關於 Ryan Dahl](https://ithelp.ithome.com.tw/articles/10191260)
- [不只是瀏覽器！JavaScript 征服世界的第一步 - Node.js (Day 8)](https://ithelp.ithome.com.tw/articles/10191345)
- [什麼？！我們竟然有 3 個標準？ - 你有聽過 CommonJS 嗎？(Day9)](https://ithelp.ithome.com.tw/articles/10191478)
- [歡迎來到大分叉時代 \- AMD 與 CommonJS 的發展](https://ithelp.ithome.com.tw/articles/10191574)

## npm 從後端到全端的過程

npm 套件管理器的優點與缺點，還有它演進過程的重要更新，從 node.js 套件管理器成為 ~(前後端都用的)~ JavaScript 套件管理器

- [史上最強套件管理 \- NPM ， npm init 與 npm install (Day11)](https://ithelp.ithome.com.tw/articles/10191682)
- [NPM Install 到底做了些什麼？node_modules 檔案結構 + 特性入門](https://ithelp.ithome.com.tw/articles/10191783)
- [package-lock.json 有什麼用，淺談 Yarn, NPM5 與 npm shrinkwrap](https://ithelp.ithome.com.tw/articles/10191888)
- [n, nvm, hyper, 以及如何進入新 project !](https://ithelp.ithome.com.tw/articles/10195515)

## Why Webpack ?

介紹 Webpack 基於什麼樣的條件，為了解決什麼問題而被創造出來。過去曾解決的問題，如今又要怎麼處理。

- [前端也需要編譯？Transpile、Compile、Minify、Uglify 基本介紹](https://ithelp.ithome.com.tw/articles/10191992)
- [什麼是 Browserlist？設定 Autoprefixer、Stylelint 來支援你想要的任何瀏覽器！](https://ithelp.ithome.com.tw/articles/10192300)

## What is Webpack ?

介紹使用 webpack 的基本設定與使用方式

- [Webpack 零設定，入門教學](https://ithelp.ithome.com.tw/articles/10192578)
- [Webpack - module、bundle 和安裝](https://ithelp.ithome.com.tw/articles/10192845)
- [使用 webpack 開始創建第一個專案](https://ithelp.ithome.com.tw/articles/10193115)

## 導讀 webpack.config.js

webpack 最常出現的痛點就是 config 的使用。

- [使用 webpack.config.js 來設定 webpack !](https://ithelp.ithome.com.tw/articles/10193343)
- [webpack.config.js - 設定第二篇 path 和 minify](https://ithelp.ithome.com.tw/articles/10193608)
- [webpack.config.js - 設定 module 來編譯不同類型的檔案](https://ithelp.ithome.com.tw/articles/10193788)
- [設定 webpack.config.js 來編譯 Sass !](https://ithelp.ithome.com.tw/articles/10194056)
- [Babel - 走向 JavaScript 的嶄新未來](https://ithelp.ithome.com.tw/articles/10194314)
- [設定 babel-loader 來編譯 ES6, ES7, ES8, ES-Next 的程式碼！](https://ithelp.ithome.com.tw/articles/10194549)

## 導讀 webpack.dev.conf.js

主要是帶讀著看懂 webpack.dev.conf.js 裡的內容與用意。

- [深入探索 vue-cli，讓我們來看看 build/build.js 與 build/webpack.dev.conf.js 做了些什麼！](https://ithelp.ithome.com.tw/articles/10194884)
- [webpack.dev.conf.js 深入探究 - (2)](https://ithelp.ithome.com.tw/articles/10195130)
- [webpack-vue boilerplate, 介紹 utils, config, baseWebpackConfig](https://ithelp.ithome.com.tw/articles/10195320)
- (似乎算是未完)

## 認識 vue-cli 的 webpack 專案

引導讀者使用 vue.js 和 vue-cli ，介紹 vue-cli 的六種版型與適合的情況，並且導讀一些 vue-cli 在 webpack 裡的設定。

- [打造 Messenger Extension - Day 4 - Vue.js 基本介紹 + 優缺點](https://ithelp.ithome.com.tw/articles/10190976)
- [什麼是 Boilerplate ? 使用 Vue-Cli 來創建你的第一個 Project ! (Messenger Extension 第五天)](https://ithelp.ithome.com.tw/articles/10191055)
- [Vue-Cli 所創建的 package.json + Webpack 設定大解析](https://ithelp.ithome.com.tw/articles/10192120)
- [回歸原點 \- 來看看當初看無的 vue-cli 吧！](https://ithelp.ithome.com.tw/articles/10194770)
