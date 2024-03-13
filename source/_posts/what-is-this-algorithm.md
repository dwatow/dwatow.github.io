---
title: this 決策演算法 - 什麼是 this
date: 2024-03-12 16:18:27
tags:
- 你所不知道的JS
- JavaScript
categories:
- 讀書心得
---

# this 決策演算法

所有 function 中的 this 都可以透過這個流程圖決定 this 是什麼。

```flow
start=>start: What is "this"?
end=>end: "this" is this

newObj=>operation: 新建構物件
argObj1=>operation: 指定的物件
contextObject=>operation: object
globalObject=>operation: global
undefinedValue=>operation: undefined/null


isNewBind=>condition: new foo()?
isApplyOrCall=>condition: foo.call()?
foo.apply()?
foo.bind()?
isObjectMethod=>condition: object.foo()?
isStrictMode1=>condition: 有沒有
"use strict";
isNullOrUndefined=>condition: 是不是
null/undefined;

start->isNewBind
isNewBind(no)->isApplyOrCall(no)->isObjectMethod(no)->isStrictMode1(no)->globalObject->end

isNewBind(yes, right)->newObj->end
isApplyOrCall(yes, right)->isNullOrUndefined
isStrictMode1(yes, right)->undefinedValue->end
isObjectMethod(yes, right)->contextObject->end

isNullOrUndefined(yes, right)->isStrictMode1
isNullOrUndefined(no)->argObj1->end
contextObject->end
globalObject->end
```

由這個圖

`this` 是一種 runtime 才有的產物。

## 特別的 arrow function

arrow function 用 Function.prototype.bind 理解是最適合不過的了。
arrow function 的 由宣告時 function scope 使用的 this 決定的。

<div>
```javascript
var obj = {
    arrow: () => console.log(this),
    fn: function() { console.log(this) },
    fnObj: new Function('console.log(this)'),
    fnObjBind: new Function('console.log(this)').bind(this),
    fnObjBindNull: new Function('"use strict"; console.log(this)').bind(undefined)
}

console.log('global obj.fn()', obj.fn())
 // {arrow: ƒ, fn: ƒ, fnObj: ƒ, fnObjBind: ƒ}

console.log('global obj.fnObj()', obj.fnObj())
// {arrow: ƒ, fn: ƒ, fnObj: ƒ, fnObjBind: ƒ}

console.log('global obj.arrow()', obj.arrow())
// Window {parent: Window, opener: null, top: Window, length: 0, frames: Window, …}

console.log('global obj.fnObjBind()', obj.fnObjBind())
// Window {parent: Window, opener: null, top: Window, length: 0, frames: Window, …}

function AAA() {
    // 直接執行 this 還是 global，但是如果指定成其它的，就可以改變這裡的 this ≠ global
    var obj = {
        arrow: () => console.log(this),
        fn: function() { console.log(this) },
        fnObj: new Function('console.log(this)'),
        fnObjBind: new Function('console.log(this)').bind(this),
        fnObjBindNull: new Function('"use strict"; console.log(this)').bind(undefined)
    }
    console.log('AAA obj.fn()', obj.fn())
    {arrow: ƒ, fn: ƒ, fnObj: ƒ, fnObjBind: ƒ, fnObjBindNull: ƒ}
    console.log('AAA obj.fnObj()', obj.fnObj())
    #document (https://dwatow.github.io/)
    console.log('AAA obj.arrow()', obj.arrow())
    #document (https://dwatow.github.io/)
    console.log('AAA obj.fnObjBind()', obj.fnObjBind())
    undefined
}

const AAAdocument = AAA.bind(document) // 改變「呼叫 function 的 function scope 的」 this 指定成 document (隨決定的)
AAAdocument();
```
</div>


