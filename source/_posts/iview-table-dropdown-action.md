---
title: iView Table 裡放 Dropdown
date: 2018-05-20 17:12:07
tags: [vuejs, iview]
categories: [技術心得]
---

# iView Table 裡放 Dropdown

## 前言

聽朋友 1 號介紹 [iView](https://www.iviewui.com/components)

> 切版套 Bootstrap，用 vue 就要套 iView

覺得很潮，所以用了一下。

用起來的感覺，真的是很不錯。
元件的封裝做得很好。

但是，卻有一個地方，讓我覺得很麻煩弄很久才搞定。

**Story**

- 「禮物」可以選擇要給誰，再送出嗎？

先知道，禮物是一個 API 回來的 array
禮物資料，用 iView 的 Table 呈現，這個過程真的很爽，很好搞定

但是...贈予對象是另一個 API 回來的 array
要...要在 Table 裡放 Dropdown

要怎麼做呢？
看看官網文件說了什麼

## Table 裡放 Button

![](https://i.imgur.com/jw4FOcB.png)

最接近這個需求的，我想就是這個範例了，先看看它

> 如果想要知道，要在 Table 放 Dropdown，要先知要[怎麼放 Button](https://www.iviewui.com/components/table#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%88%97%E6%A8%A1%E6%9D%BF) 吧？！

```htmlmixed=
<template>
    <Table border :columns="columns7" :data="data6"></Table>
</template>
```

```javascript=
export default {
  data() {
    return {
      columns7: [
        //...'Name', 'Age', 'Address',
        {
          title: "Action",
          //...
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                },
                "View"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "Delete"
              )
            ]);
          }
        }
      ]
      //...
    };
  }
  //...
};
```

在這，是使用 render function 的方式將 Button 產生出來，而且 code 看起來...

> render 函數傳入兩個參數，`h` (函數) 和 `params` (物件)

看到這，只有兩個念頭。

1. 學 render function 怎麼用
2. 搜尋看看有沒什麼好方法或者人家寫好的 code

## Table 裡放 Dropdown

搜尋到了一段程式碼 (讚嘆 Google!!)

```javascript=
{
  title: '贈予人',
  key: 'give2user'
  //...
  render: (h, params) => {
    return h('Dropdown', {
      props: {
        trigger: 'click'
      },
        on: {
          'on-click': (name) => {
            //選取 event
          }
        }
    }, [
      h('Button', [
        h('span', '顯示文字'),
        h('Icon', {
          props: {
            type: 'arrow-down-b'
          }
        })
      ]),
      h('Dropdown-menu', {
        slot: 'list'
      }, this.status_list.map((item, index) => {
        return h('Dropdown-item', {
          props: {
            name: index  //on-click 的 callback param
          }
        }, item)  //選項的顯示文字
      }))
    ])
  }
},
```

把這一段 code 貼上

:::success
在此要細看一下，可以省掉一些實驗的時間
:::
有幾個收獲

1. 點擊事件寫在第 12 行
2. 點擊後取得的內容是什麼，在第 29 行
3. 顯示文字在第 31 行

這些，基本上就夠了，但是，還會有一些問題

1. 選取前後，都是顯示第 17 行的文字
2. 下拉式選單的內容，由第 26 行的 `status_list` 決定。

修改之前，要先知道

1. `on-click` 觸發時，第 11 行的 name 會是第 29 行的值。
2. `params.row` 指的是該筆資料的 row
3. `status_list` 每個元素要加上 `give2user` 的屬性，並且填上初始值(未選時顯示的文字)。

## 解決延伸問題

**將 code 改成這樣**

1. 可以用 vuex 的 array
2. 加上排序
3. 顯示 id name 的格式
4. 選擇時，在 on-click 吐 id 進 callback

```javascript=26
}, this.$store.getters.vuex_list
  .sort((a, b) => a.id - b.id)
  .map((item) => {
  return h('Dropdown-item', {
    props: {
      name: item.id,  //on-click 的 callback param
    }
  }, `${item.id} ${item.name}`)  //選項的顯示文字
```

**再來改初始狀態**

可以讓選擇之後，顯示文字會改變

```javascript=17
h('span', `${params.row[give2user].id} ${params.row[give2user].name} `),
```

**最後改事件內容**

這樣可以決定選到了哪一個物件。

```javascript=10
on: {
  'on-click': (value) => {
    const item this.$store.getters.vuex_list
      .filter(item.id === value).shift()
    params.row[give2user] = item
  },
},
```

這樣就可以在 Table 裡，看見美美的 dropdown 了。

## 細部調整 dropdown

參考[官網文件](https://www.iviewui.com/components/dropdown)

```javascript=
return h(
  "Dropdown-item",
  {
    props: {
      name: index,
      disabled: true, // 無效選項
      selected: true // 被選擇標示
    }
  },
  item
);
```

## 後續

聽朋友 2 號介紹...

> 你也用 iView 呀？那你知道 [Element](https://element.eleme.io/#/zh-CN) 嗎？
> iView 幾乎是參考它的，Element 比較早出現

所以，還是有很多樣的選擇
