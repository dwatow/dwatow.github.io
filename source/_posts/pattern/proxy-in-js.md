---
title: Proxy Pattern in JS
date: 2022-11-10 17:26:36
tags:
- proxy
- design pattern
categories:
- 技術心得
---
# Proxy Pattern in JS

## 在 Design Pattern 上的實作 

![](https://i.imgur.com/NTSogsi.png)

## 做相同的事情

在操作屬性的讀取值時，想要做「相同」的事

在此，就先做「印出字串」

```javascript
const target = {
  name: 'target',
  message1: "hello",
  message2: "everyone"
};

const handler = {
  name: 'handler',
  get(target, property, receiver) {
    console.log(`用了 getter 讀取 ${property}`);
    return target[property];
  },
  set(target, property, value) {
    console.log(`用了 setter 將 ${property} 賦值為 ${value}`);
    return target[property] = value;
  },
};

const proxyTarget = new Proxy(target, handler);
```

使用

```javascript
proxyTarget.message1 = 'Hi, Chris';
proxyTarget.message1; // 'Hi, Chris'
```

確實修改了物件 target 

## 想要在代理層實作 Method

原本是這樣用

```javascript
handler.openDoc();
```


但 handler 的 Method 用在 target 身上，像這樣


```javascript
const messaget = handler.openDoc.call(target)
```

> 但是，我想要這樣用
> 
> ```javascript
> proxyTarget.openDoc();
> ```

但是，不想要這樣製造

```javascript
target.openDoc = handler.openDoc // 不想這樣寫
const messaget = target.openDoc();
```

所以，用 proxy 來試看看


```javascript
const target = {
  name: 'target',
};

const handler = {
  name: 'handler',
  openDoc() {
    console.log('打開文件', this); //target
    return 'open doc'
  },
  saveDoc(value) {
    console.log('儲存文件', this, value1, value2); //target
  },
  get(target, property, receiver) {
    console.log(`用了 getter 讀取 ${property}`);
    return this[property].call(target);
  },
  set(target, property, value) {
    console.log(`用了 setter 將 ${property} 賦值為 ${value}`);
    return this[property].call(target, value);
  }
};

const proxy = new Proxy(target, handler);
```

使用的時候，可以成功的呼叫到 handle 的 method
而且指定的 this 也是 target

```javascript
proxy.openDoc;
// 用了 getter 讀取 openDoc
// 打開文件 {name: 'target'}
'open doc'
proxy.saveDoc = 123;
// 用了 getter 讀取 saveDoc
// 儲存文件 {name: 'target'} 123
```

> 但是，我想要這樣用
> 
> ```javascript
> proxyTarget.openDoc();
> proxyTarget.saveDoc(123);
> ```
## 想要在代理層實作 Method!!

~~不要用「代理實作屬性存取」來呼嚨！~~

如果原本的函數是 `.saveDoc(123, 123)` 
多個參數的話，也不想要因為 Proxy 而受到限制。

所以....

先照著用看看？

```javascript
proxy.saveDoc(123, 123);
// 用了 getter 讀取 saveDoc
// 儲存文件 {name: 'target'} undefined undefined
```

:::danger
Uncaught TypeError: proxy.saveDoc is not a function at `<anonymous>`:1:7
:::

所以？你觀察到了嗎？

- 有跑到「儲存文件」
- 噴錯「proxy.saveDoc is not a function」

還有
- 它是執行 Proxy 的 getter ！？

再改一下實作

```javascript
const target = {
  name: 'target',
};

const handler = {
  name: 'handler',
  openDoc() {
    console.log('打開文件', this); //target
    return 'open doc'
  },
  saveDoc(value1, value2) {
    console.log('儲存文件', this, value1, value2); //target
  },
  get(target, property, receiver) {
    console.log(`用了 getter 讀取 ${property}`);
    return (...value) => { 
        this[property].call(target, ...value)
    };
  }
};

const proxy = new Proxy(target, handler);
```

跑起來！成功！

```javascript
proxy.openDoc();  // 打開文件
proxy.saveDoc(123, 5345);  // 儲存文件
```
## 那要屬性又要 Method 呢？

直接在實作中寫判斷！


```javascript
const target = {
  name: 'target',
  isLeader() {
    return true;
  }
};

const handler = {
  name: 'handler',
  openDoc() {
    console.log('打開文件', this); //target
    return 'open doc'
  },
  saveDoc(value1, value2) {
    console.log('儲存文件', this, value1, value2); //target
  },
  get(target, property, receiver) {
    console.log(`用了 getter 讀取 ${property}`);
    if (property in target) {
      if (target[property] instanceof Function) {
        return (...value) => target[property](...value)
      } else {
        return target[property]; 
      }
    } else {
      if (this[property] instanceof Function) {
        return (...value) => this[property].call(target, ...value)
      } else {
        return this[property]
      };
    }
  },
  set(target, property, value) {
    console.log(`用了 setter 將 ${property} 賦值為 ${value}`);
    return target[property] = value;
  },
};

const proxy = new Proxy(target, handler);
```

應該要可以實作出這樣的做法

```javascript
proxy.orignalMethod()
proxy.proxyMethod()
```

使用

```javascript
proxy.openDoc()
// 用了 getter 讀取 openDoc
// 打開文件 {name: 'target', isLeader: ƒ}
'open doc'
proxy.name
// 用了 getter 讀取 name
'target'
proxy.name = 'chris'
// 用了 setter 將 name 賦值為 chris
'chris'
proxy.name
// 用了 getter 讀取 name
'chris'
proxy.isLeader()
// 用了 getter 讀取 isLeader
true
proxy.saveDoc(1,2)
// 用了 getter 讀取 saveDoc
// 儲存文件 {name: 'target', isLeader: ƒ} 1 2
```

## 最後，和技術社群的伙伴們討論完的版本

主要的更動在簡化了 get 的部份。因為不管是不是 function ，都是將 property 取出來回傳，是 method 就自然是 method 的執行，是 property 就自然只是存取值。

並且利用了 `this[property].bind(target); ` 將 handler 與 target 同名 method 的問題也解決了。(以 `saveDoc` 為範例)

1. 首先，同名會優先呼叫 handler 的 method。
1. 如果想要呼叫 target 的 method 可以透過「handler 的 method 呼叫」



```javascript
const target = {
  name: 'target',
  isLeader() {
    return true;
  },
  saveDoc(value1, value2) {
    console.log('xxxx儲存檔案', this, value1, value2); //target
  },
};

const handler = {
  name: 'handler',
  openDoc() {
    console.log('打開檔案', this); //target
    return 'open doc'
  },
  saveDoc(value1, value2) {
    this.saveDoc(value1, value2);
    console.log('儲存檔案', this, value1, value2); //target
  },
  get(target, property, receiver) {
    console.log(`用了 getter 讀取 ${property}`);
    if (property in this) {
      return this[property].bind(target); 
    } else {
      return target[property]
    }
  },
  set(target, property, value) {
    console.log(`用了 setter 將 ${property} 賦值為 ${value}`);
    return target[property] = value;
  },
};

const proxy = new Proxy(target, handler);
```

### 快取代理？

最後也有討論到快取的代理

想要將變數存在 handler 裡，又可以實作快取代理的話，method 裡的 this 都指向 target 的怎辦？

最後想到，只要實作在 handler 的 get/set 裡面就好了。

1. this 是 handler ，屬性的儲存可以放在 handler 身上。
2. 快取代理屬於一種共用的代理，所以放在這也合理。

## 情境

就可以實作出，自動切換取得不同層的 method。
但是又不是繼承！

```javascript
const res = axios.get('domain.com/user')

const proxyUser = new Proxy(res.data, UserHandle)

proxyUser.isLeader() // true ?? false
proxyUser.name;
```
