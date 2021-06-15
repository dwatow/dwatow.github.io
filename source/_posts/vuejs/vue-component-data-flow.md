---
title: 用 vue-loader 的 component 資料傳遞
date: 2018-04-05 22:23:04
tags:
- vue
- JavaScript
- "vue-loader"
categories:
- 技術心得
---

# 用 vue-loader 的 component 資料傳遞

## 加入 component

先將 `.vue` 檔案 `import` 進來，並且宣告在 vue instance 的 component 裡面。

```html
<script>
import componentName from 'path/component.vue';

export default {
  //...
  components: {
    componentName,
  },
  //...
}
</script>
```

再以 `import` 進來後宣告的名字，當作自定義的 HTML tag name ，在想顯示 component 的地方放置。

```html
<template>
    <componentName></componentName>
</template>
```

## Data flow: Parent to Child

靠 component 的 `props`

**parent component**

```html
<template>
    <componentName :child-data=parentData>
    </componentName>
</template>
```

> parentData 也可以放 parentComputed 的函數名稱

**child component**

在 component 要使用 props ，就當作一般的 data 這樣用。

> ex:
> JavaScript: `this.childProp`
> HTML: `{ { childProp } }`

```html
<script>
export default {
  //...
  props: ["childProp"],
  //...
}
</script>
<template>
    <div>{{childProp}}</div>
</template>
```

## Data flow: Child to Parent (like jQuery)

靠 component 的 `$emit`

**parent component**

```html
<template>
    <componentName @childEvent="parentMethod">
    </componentName>
</template>
<script>
export default {
  //...
  method: {
      parentMethod (e) {
          this.parentData = e
      }
  }
  //...
}
</script>
```

**child component**

在 component 要使用 `$emit`

### 先回憶，在 jQuery 的用法

```javascript
$("element").on(eventName, eventCallback);
```

再看看，在 vue 這樣使用
將真實的事件定義成一個 `$emit`。

```html
<template>
    <div @click="$emit(childEvent, childMethod())">
    </div>
</template>
<script>
export default {
  //...
  method: {
      childMethod () {
          return 'e'; // partne method 的參數
      }
  }
  //...
}
</script>
```

:::danger
到此 `$emit` 的用法，和 jQuery 滿像的...
而事實上，卻不是這麼一回事。
:::

## Data flow: Child to Parent (Vue way)

**parent component**

`$event` 就是 callback function 的參數。在 parent 層可以直接引用。

```html
<template>
    <componentName @childEvent="parentData = $event">
    </componentName>
</template>
```

**child component**

`$emit` 回傳的東西，其實是 eventCallback 的參數，如果要在 `$emit` 第二個參數使用 function 一定要 return 值。

```HTML
<template>
    <div @click="$emit(childEvent, 'e')">
       <!-- e => partne method 的參數 -->
    </div>
</template>
```
