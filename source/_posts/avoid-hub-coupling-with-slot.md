---
title: avoid-hub-coupling-with-slot
date: 2026-05-21 10:34:20
tags:
  - vue
  - slot
categories:
  - 技術心得
---

# 用 Slot 分離資料流，避免 Hub 式耦合

## 問題的起點

假設你在開發一個通知設定頁面，使用者可以選擇接收通知的方式：**電子郵件** 或 **簡訊**。不同的通知方式會顯示不同的表單欄位。

第一版實作很自然地長這樣：

```
NotificationSettings（頁面）
  └── NotificationForm（表單殼）
        ├── NotifyByEmail（當選電子郵件時顯示）
        └── NotifyBySms（當選簡訊時顯示）
```

頁面負責取得資料，然後把所有東西往下傳：

```vue
<!-- NotificationSettings.vue -->
<NotificationForm
  :countryOptions="optionsStore.countries"
  @countryChange="optionsStore.fetchDialCodes($event)"
  :dialCodeOptions="optionsStore.dialCodes"
  @submit="onFormSubmit"
/>
```

`NotificationForm` 收到這些 props，再轉手傳給動態元件：

```vue
<!-- NotificationForm.vue -->
<Component
  :is="channelForms[selectedChannel]"
  :countryOptions="props.countryOptions"
  :dialCodeOptions="props.dialCodeOptions"
  @countryChange="emits('countryChange', $event)"
/>
```

乍看之下很合理。但問題藏在細節裡。

---

## 哪裡不對勁？

`countryOptions` 和 `dialCodeOptions` 只有 `NotifyBySms` 需要（選國碼用）。

`NotifyByEmail` 完全不需要這些資料，但 `NotificationForm` 還是得宣告這些 props、接收它們、再傳下去——就算目前選的是 Email 模式，這些 props 根本沒有意義。

這種設計之下，就不小心產生了 NotificationForm 擔任 hub 的功能，只擔任轉手資料，並不參與處理。
這樣的設計一多，就變成機房內的網路線，日子久了沒有人敢去碰它。

可怕之處在於，閱讀這樣耦合的程式碼，大腦裡假設會發散出不存在的使用情境。讓追查程式碼的工作量變大。

```
頁面知道的
  ↓ 傳給
中介元件（NotificationForm）知道的
  ↓ 轉手傳給
真正需要的子元件
```

中介層變成了一個超級元件，無所不知。

**未來的代價很清楚：**

- 新增第三種通知方式（例如：LINE 推播），你需要在 `NotificationForm` 加入新的 props
- `NotificationForm` 的介面會隨著支援的通知方式增加而無限膨脹
- 閱讀 `NotificationForm` 的人無法直覺判斷：「這個 prop 到底是誰在用？」

---

## 解決方式: 在資料流源頭用 Slot 分離

解法是讓 `NotificationForm` 不要知道子元件的存在。把「要顯示哪個表單」的決策權交回給頁面，透過 **slot** 注入。

```
NotificationSettings（頁面）—— 持有所有資料，決定渲染哪個子元件
  └── NotificationForm（表單殼）—— 只管 layout 和提交邏輯
        └── <slot />（由頁面注入具體表單）
```

改寫後，`NotificationForm` 變成純粹的殼：

```vue
<!-- NotificationForm.vue（改寫後） -->
<template>
  <Form @submit="onSubmit">
    <RadioGroup v-model="selectedChannel" :options="channelOptions" />

    <!-- 不再動態渲染子元件，改由外部注入 -->
    <slot :selectedChannel="selectedChannel" />

    <Button type="submit" />
  </Form>
</template>
```

資料流的分叉點被推回到頁面層：

```vue
<!-- NotificationSettings.vue（改寫後） -->
<NotificationForm @submit="onFormSubmit">
  <template #default="{ selectedChannel }">
    <!-- Email 分支：不需要電話相關資料 -->
    <NotifyByEmail v-if="selectedChannel === 'email'" />

    <!-- 簡訊分支：自己取用需要的資料 -->
    <NotifyBySms
      v-else-if="selectedChannel === 'sms'"
      :countryOptions="optionsStore.countries"
      :dialCodeOptions="optionsStore.dialCodes"
      @countryChange="optionsStore.fetchDialCodes($event)"
    />
  </template>
</NotificationForm>
```

現在，`countryOptions` 只出現在真正需要它的地方。`NotificationForm` 的介面完全不需要知道有「國碼」這回事。

---

## 兩種模式的對比

|                    | Hub 式（Props 中繼）   | Slot 分離資料流        |
| ------------------ | ---------------------- | ---------------------- |
| **資料流方向**     | 頁面 → 中介層 → 子元件 | 頁面 → 子元件（直接）  |
| **中介層的職責**   | 知道每個子元件需要什麼 | 只管自己的 layout 邏輯 |
| **新增通知方式**   | 改中介層的 props       | 只改頁面               |
| **閱讀難度**       | 需要追蹤 prop 的流向   | 在頁面就能看出全貌     |
| **子元件間的耦合** | 透過中介層互相感知     | 完全獨立               |

---

## 什麼時候用 Slot？

一個簡單的判斷標準：

> 如果一個元件需要接收 props 只是為了「轉手傳給子元件」，那這個 props 就不應該存在於這個元件——改用 slot。

更廣義地說，當你的元件結構出現下面這個訊號時，就應該考慮 slot：

- 同一個 props 在這一層根本不被使用
- 子元件切換時，這一層的 props 需要跟著變動
- 未來可能有第 N 種子元件，而你不想每次都改中介層

---

## 結語

Slot 不只是「讓父元件插入 HTML」的工具，它的本質是**控制反轉（Inversion of Control）**。

把「要渲染什麼、用什麼資料」的決策權交還給最靠近資料源頭的那一層，讓中介層只專注於自己的職責——這樣不管加多少種通知方式，`NotificationForm` 都不需要動。

這正是元件設計中「開放/封閉原則」（Open/Closed Principle）在 Vue 的體現：對擴充開放，對修改封閉。
