---
title: Hexo 自訂程式碼區塊的行號 (用起來像 Hackmd)
date: 2019-01-09 07:54:05
tags: ['hackmd', 'hexo']
categories: 'hexo改裝'
---

# Hexo 自訂程式碼區塊的行號 (像 Hackmd)

其實在 [hexo 3.3.9](https://github.com/hexojs/hexo/releases/tag/3.3.9) 之後就支援這個功能。
![](https://i.imgur.com/3II9bYZ.png)

## New Features

- Support sel code block line number ([#2612](https://github.com/hexojs/hexo/pull/2612))

## 啟用功能

在 hexo 的實作上，行號顯示屬於 `highlight` 的一部份。
在 hexo 的 `_config.yml` 檔裡找到 `highlight`。

```yaml
highlight:
  enable: true
  line_number: true
  first_line_number: 'inline' # | 'always1'
  auto_detect: false
  tab_replace:
```

加上 `first_line_number` 表示「自訂第一行的號碼」，設定值有兩個

- `always1`: 使用 1 (預設值)
- `inline`: 要每次自訂是否要行號，如果要可以自訂起始號碼

在 markdown 這樣寫 (在此沒有寫結束符號)

```
  ```javascript   -> js code block without line number
  ```javascript=  -> js code block with line number, start in 1
  ```javascript=3 -> js code block with line number, start in 3
```

依序的結果如下

`javascript` 不要行號

```javascript
console.log('Hi')
```

`javascript=` 要行號，不指定起始行號，預設使用 1

```javascript=
console.log('Hi')
```

`javascript=2` 指定行號 2

```javascript=2
console.log('Hi')
```
