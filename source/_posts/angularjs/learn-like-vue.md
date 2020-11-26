---
title: 用 Vue 理解 AngularJS 的 components
date: 2020-11-26 11:33:31
tags:
- angularjs
categories:
- 技術心得
---

# 用 Vue 理解 AngularJS 的 components

## Angular Component 邏輯

```javascript=
appName = ''
appParameters = []
config = {}
componentName = ''

angular.module(appName, appParameters)
.component(componentName, config);
```

## data

在 constructor 裡，寫 `this.data` 就可以定義自己的 data 變數名稱

```javascript=
class className {
  constructor () {
    this.dataValue1 = ""
  }
}

config = {
// constoller 其實就是接 constructor
  controller: className,
}

angular.module(appName, appParameters)
.component(componentName, config);
```

controller |--> template 單向綁定
在 `template` 可以直接透過 `controllerAs` (預設用 `$ctrl`) 使用

```htmlmixed
<span>{{$ctrl.dataValue1}}</span>
```

controller <--> template 雙向綁定
可以使用

```htmlmixed
<input type="text" ng-model="$ctrl.dataValue1"></input>
<span>Name: {{$ctrl.dataValue1}}</span>
```


可以這樣理解 AngularJS 的行為

```javascript
var $ctrl = new className();
$ctrl.dataValue1; // = this.dataValue1
```

## watch

視為 private method
用在 setter 裡連動更動 相關變數的 method

使用 `$onChange` 的 lifecycle hook

## computed

同於 public method
用在 getter, setter

```javascript=
class className {
  constructor () {
    this.dataValue1 = ""
  }

  fullName () {
    return this.name + ' fullName'
  }
}
```



```htmlmixed
<span>Name: {{$ctrl.fullName()}}</span>
```

## methods

就是一般的 methods


# Angular Component 傳值

## tag name: component 名稱

```javascript=
appName = ''
appParameters = []
config = {}
componentName = ''

angular.module(appName, appParameters)
.component(componentName, config);
```

## attribute

```htmlmixed=
<appName attributeName="attributeValue"></appName>
```

```javascript=
bindingWay = '='
config = {
  binding: {
    attributeName: bindingWay
  }
}
```

bindingWay 的設定可以使用

- `<` 單向資料流，attributeValue 當變數傳入
- `=` 雙向資料流，同上
- `&` 單向資料流，attributeValue 不會變動，當 callback function (像是自訂 event)
- `@` 單向資料流，attributeValue 不會變動，當 string

## event

各種 `ng-` 的 event

mouse

- `ng-mouseover` `ng-mouseenter` `ng-mouseleave` `ng-mousemove`
- `ng-mousedown` `ng-mouseup`
- `ng-click` `ng-dblclick`

keyboard

- `ng-keyup` `ng-keydown`
- `ng-keypress`

其它

- `ng-blur`
- `ng-change`
- `ng-focus`
- `ng-copy`
- `ng-cut`
- `ng-paste`

自定義事件

```javascript=
config = {
  bindings: {
    onUpdate: '&' //使用 <tag on-update=fu>
  },
  controller: ComponentCtrl
}

class ComponentCtrl {
  constructor () {
    this.onUpdate({
	  $event: {
	    //...
	  }
    });
  }
}
```

## content

要改變 component 的內容
1. 在 component 的 config object 上的 `template` 加入包含有 `ng-transclude` 的 `<div ng-transclude="slot1"></div>`，決定
1. 在 component 的 config object 上加入 `transclude` ，決定傳遞的 key-value 對應，其中 key: 對內變數，value: 對外變數
1. 在使用 component 的地方，將 `transclude` 的 value 用出來。

index.html

在引用的 component 中，要加入

```htmlmixed=
<body ng-app="heroApp">
  <hero-detail>
    <slot-body><h2>
      hi I am head two
    </h2></slot-body>
  </hero-detail>
</body>
```

component 設定成這樣

```javascript=
angular.module('heroApp', []).component('heroDetail', {
  controller: myComponent,
  transclude: {
    'slot1': 'slotBody',
  },
  template: `<h1>I am a component</h1>
               <span>Name: {{$ctrl.name}}</span>
               <div ng-transclude="slot1"></div>
             </div>`
});
```