---
title: 用 Vue Component Slot 實現自定義 HTML
date: 2018-09-21 14:23:32
tags: 
- vuejs
- "vue-slot"
categories: 
- 技術心得
---

# 用 Vue Component Slot 實現自定義 HTML

之前有{% post_link vue-component-fast-review 快速講一下 component 的各個功能 %}
其中有說到 component 傳值到 content 要靠 slot，是什麼意思呢？在此特別介紹一下。

**parent**

外層 template 這樣使用

在放在 component 的 content, 是用來取代 `slot`
多個 `slot` 時，要指定 `slot`

```html
<template>
  <div>
    <component>
      <p slot="slotName">指定 slot, 要插入 component 的 html</p>
      <p>不指定 slot, 要插入 component 的 html</p>
    </component>
  </div>
</template>
```

**child**

在 component 內，定義 `slot` : 提供外部 html 插入 `template` 的位置

```html
<template>
  <div>
    <slot name="slotName"></slot>
    <slot></slot>
  </div>
</template>
```

## dynamic component

觸發 created, destroyed 的 component，只要 component 不出現在畫面上，就會把 component 消滅掉，並且下次出現時所有的數值歸 0

**hook**

- created
- destroyed

**parents**

```html=
<template>
  <component :is="targetComponent"></component>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      targetComponent: 'componentName'
    }
  },
  created () {
    console.log('created')
  },
  destroyed () {
    console.log('destoryed')
  },
  //...
}
</script>
```

### 不滅的 dynamic component

component 要永生就加 `<keep-alive>`

```html=
<template>
  <keep-alive>
    <component :is="targetComponent"></component>
  </keep-alive>
</template>
```

永生不死，終究有遺憾，不知死為何物。
無法觸發 destory 的 hook

### 可觸發 hook 又永生的 component

**hook**

- deactivated
- activated

```html=
<template>
  <keep-alive>
    <component :is="targetComponent"></component>
  </keep-alive>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      targetComponent: 'componentName'
    }
  },
  deactivated () {
  	console.log('deactivated')
  },
  activated () {
  	console.log('activated')
  }
  //...
}
</script>
```
