---
title: Object 的 Subtype 的原生建構式使用
date: 2024-03-12 16:15:51
tags:
- 你所不知道的JS
- JavaScript
categories:
- 讀書心得
---

# Object 的 Subtype 的原生建構式使用

|          | 字面形式                 | 不用 `new`                    | 用 `new`             | 參數                     | 注意事項          |
| -------- | ------------------------ | ----------------------------- | -------------------- | ------------------------ | ----------------- |
| Array    | `[]`                     | 沒差                          | 沒差                 | 1.Array.legnth 2.元素    |
| Object   | `{}`                     | 封裝成 `Object`               | 幾乎用不到           | 要封裝的資料             |
| Function | `function(){}`, `()=>{}` | 要執行的程式碼                | 別用                 | 要執行的 code            | 別用來當作 eval() |
| RegExp   | /(?:)/                   | 沒差                          | 沒差                 | 正規表達式               |
| Date     | x                        | 別用，不同的 browser 不同結果 | 常用                 | 指定日期 空參數:回傳現在 | ES5: `Date.now()` |
| Error    | x                        | 沒差                          | 沒差                 | 變成 error.message       |
| Symbol   | x                        | 正常使用                      | `Uncaught TypeError` | 要變 Symbol 的值         |
* 沒差指的是「有用 `new` 和不用 `new`」的差別



參考: [You Don't Know JS: Types & Grammar](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20&%20grammar/README.md)
