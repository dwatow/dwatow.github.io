---
title: 給非工程人員的 Messager 引導手冊
date: 2018-01-27 14:53:10
tags: 
- chatbot
- facebook
categories: 
- 工具使用
---
# 給非工程人員的 Messager Chatbot 引導手冊

## 源起

受邀到 HPX Talk 24 分享一場關於 Chatbot 如何標清楚規格的分享。
答應提供給參加的朋友一個非工程師的開發手冊指引
其實就只是將官網開發手冊上的東西，過濾掉程式碼的部份，節錄下來而已。

[![](https://i.imgur.com/43N6mAK.png)](https://hpx.tw/archives/24251)

## 目的

本文件目的不是工程技術指南。
在於引導非工程人員(企劃與設計師)對於 Messager Bot 的設計與企劃建議，如何在 Facebook Developer Document 找到的初步指南

更多內容無法由此文件提供，但是對於初嚐 Messager Bot 的非工程人員，可以做為友善的入門管道。

> 如果有興趣合作的朋友可以找我們([好想工作室](http://goodideas-studio.com/))聊聊唷

# Messager 平台

[首頁](https://developers.facebook.com/docs/messenger-platform)

如果有工程師想初學，可以看這一份[新手指南](https://developers.facebook.com/docs/messenger-platform/getting-started/)
也可以看我之前寫的新手實戰文章。

# Sketch 素材

適用: 設計師

[![](https://facebook.design/public/images/messenger_header.png)](https://developers.facebook.com/docs/messenger-platform/design-resources/design-kit)
^(點擊圖到下載頁面)^

# 傳送訊息

訊息概述[介紹頁](https://developers.facebook.com/docs/messenger-platform/send-messages)

以下各個 UI 元件，點擊圖片即可到官網看原版介紹。

> 確保你找到的「最佳作法」是最新版的。
在該文件的最下面可以找到。(沒有就沒有了)


## 快速回覆

提供一組最多 11 個對話內按鈕，其中包含標題並可加入圖像。
還可以用來請求用戶提供地點。

[![](https://scontent.ftpe4-2.fna.fbcdn.net/v/t39.2365-6/14175277_1582251242076612_248078259_n.png?oh=c1ffedde3e73365e7294d14d0a7da91f&oe=5ADFB3D6)](https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies)

### 最佳作法

- [x]使用快速回覆來提示特定的後續步驟。
- [x]力求簡潔，過長的快速回覆會遭到截斷。
- [ ]請勿用於永久可用的動作：快速回覆在下一則訊息出現後就會消失。

## 傳送者動作

控制對話中的輸入指示器和讀取回條指示器。
讓訊息收件人知道您已讀取其訊息，且訊息正在處理中。

[![](https://scontent.ftpe4-2.fna.fbcdn.net/v/t39.2365-6/13480169_570751053131489_689799179_n.png?oh=6f1b3e7ae5314a9f59ed99a584ea8909&oe=5AE5341C =225x)](https://developers.facebook.com/docs/messenger-platform/send-messages/sender-actions)

## 一般型範本

[![](https://scontent.ftpe4-2.fna.fbcdn.net/v/t39.2365-6/22880422_1740199342956641_1916832982102966272_n.png?oh=740b1a44f5b82b31c81477b3a23403e5&oe=5AEFD83C =225x)](https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic)

簡單的結構化訊息，可包含標題、副標題、圖像及最多三個按鈕。
可以設定點擊範本範圍時，用 WebView 開啟網址。

[![https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic](https://scontent.ftpe4-2.fna.fbcdn.net/v/t39.2178-6/13178095_790767981060697_1148772092_n.png?oh=fc97f4fea0014ed35b92d8481aaf6574&oe=5ADBE0F6)]()

水平捲動式輪播，最多 10 個

### 最佳作法

- [x] 用於有一致資訊階層的訊息（例如，產品或文章預覽、天氣預報）。
- [x] 針對圖像使用正確的長寬比。一般型範本中的相片，如果長寬比不是 1.91:1，就會遭到縮放或裁切。
- [ ] 除非您的訊息具備結構化資訊或需要階層，否則請勿使用一般型範本。
- [ ] 除非要讓用戶能夠將圖像放大為全螢幕，否則請勿使用一般型範本。

#### 輪播

- [x] 當內容有優先順序時（也就是說，第一個項目可能是讓人最感興趣的），請使用輪播。
- [x] 力求一致。如果其中一個泡泡有相片，請在所有的泡泡都包含相片。
- [x] 盡量減少輪播中一般型範本的數量。太多泡泡會讓人記不住所有選項。
- [ ] 請勿混合不同類型的內容。如果您在產品清單旁加入一篇文章，用戶可能會感到困惑。
- [ ] 如果用戶應該查看清單上所有項目，請勿使用輪播。用戶可能不會捲動到清單尾端。請考慮改用清單範本。

## 清單範本

[![](https://scontent.ftpe4-2.fna.fbcdn.net/v/t39.2365-6/21201919_1215144078631552_6152307842817720320_n.png?oh=1b258e3f01677766a7de466f55cd07c7&oe=5B20176A =225x)](https://developers.facebook.com/docs/messenger-platform/send-messages/template/list)   [![](https://scontent.ftpe4-2.fna.fbcdn.net/v/t39.2365-6/21274842_1998857677000635_328116182651502592_n.png?oh=899049757e3dd684706ed41bb42a22bf&oe=5ADC7E05 =225x)](https://developers.facebook.com/docs/messenger-platform/send-messages/template/list)

 2 至 4 個結構化項目的清單，並可選擇在底部顯示全域按鈕。每個項目可包含縮圖圖像、標題、副標題和一個按鈕。
可以設定點擊範本範圍時，用 WebView 開啟網址。

### 最佳作法

- [x] 清單和內容力求簡潔，因為捲動的方向和對話串相同。
- [x] 如果有可能所有項目皆不符用戶需求，請提供清單層級的動作。
- [ ] 如果不需要或不想要用戶看到這個清單（例如，如果清單經過排序，很可能第一個項目就可達到目的），請勿使用此範本。請考慮改用輪

## 開放社交關係圖範本

(目前只能用來傳歌曲)

[![](https://scontent.ftpe4-2.fna.fbcdn.net/v/t39.2365-6/23423203_163011880970306_7772330384011821056_n.png?oh=7bb80c50deb34b9edb08456cbdc090dc&oe=5B1DDCFE =225x)](https://developers.facebook.com/docs/messenger-platform/send-messages/template/open-graph)

開放社交關係圖範本可讓您傳送含開放社交關係圖網址的結構化訊息，並可選擇是否附加按鈕。目前僅支援分享歌曲。歌曲會顯示在泡泡中，供訊息收件人查看專輯封面及試聽歌曲。

## 媒體範本

(可傳送 Facebook 粉絲頁的內容)

[![](https://scontent.ftpe4-2.fna.fbcdn.net/v/t39.2365-6/23666967_188506161716866_2869776016224550912_n.png?oh=401b91170534a4df63a61c2348de18e9&oe=5AE29CE5 =225x)](https://developers.facebook.com/docs/messenger-platform/send-messages/template/media) [![](https://scontent.ftpe4-2.fna.fbcdn.net/v/t39.2365-6/23065701_1942345712696886_5686788878908784640_n.png?oh=8ad8c68098a1ba2c82e8b028ae352695&oe=5AD8A2A1 =225x)](https://developers.facebook.com/docs/messenger-platform/send-messages/template/media)

可傳送圖像、GIF 和影片在對話中播放。
可選擇是否附加按鈕。

## 收據範本

[![](https://scontent.ftpe4-2.fna.fbcdn.net/v/t39.2365-6/23208289_889588377870772_7170760265053503488_n.png?oh=07099c061e10012ecabf400db7bd7e74&oe=5AF1638C =225x)](https://developers.facebook.com/docs/messenger-platform/send-messages/template/receipt)

收據範本可讓您以結構化訊息的方式傳送訂單確認。這類範本可包含訂單摘要、付款詳細資料及送貨資訊。

### 最佳作法
- [x] 讓用戶持續掌握最新資訊。發送收據之後，即時傳送有關出貨及運送確認的更新資訊。
- [ ] 請勿使用收據範本來傳達與購買無關的資訊。這應該僅用於確認先前的交易。

## 航空公司範本

登機證範本可同時向多個航班的多位旅客傳送登機證。
範本中含有「查看登機證」按鈕，旅客只要點按這個按鈕就能看到完整的登機證。

[![](https://scontent.ftpe4-2.fna.fbcdn.net/v/t39.2365-6/21152793_706937132834208_8949044113357930496_n.png?oh=248e39696bbafe8b0e17a0eba5648d71&oe=5B261B81)](https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline)
播。

## 按鈕範本

[![](https://scontent.ftpe4-2.fna.fbcdn.net/v/t39.2365-6/23204276_131607050888932_1057585862134464512_n.png?oh=137225225113c68256fa83e651dd7bfa&oe=5AF2670A =225x)](https://developers.facebook.com/docs/messenger-platform/send-messages/template/button)

傳送最多三個文字訊息的按鈕。

適用於向訊息收件人提供選項以供選擇，例如：預先定義的問題回應，或可採取的動作。

用起來，有點像快速回覆

# 按鈕類型

大部分的訊息範本都支援可叫用各種動作的按鈕。

這些按鈕可讓您輕鬆地向訊息收件人提供在回應範本時可採取的動作，例如：開啟 Messenger WebView、開始付款流程、將回傳訊息傳送至 Webhook 等。

按鈕類型[頁面](https://developers.facebook.com/docs/messenger-platform/send-messages/buttons)

- 網址按鈕
- 回傳按鈕
- 分享按鈕
- 購買按鈕
- 通話按鈕
- 登入按鈕
- 登出按鈕
- 玩遊戲按鈕

### 最佳作法

- [x] 使用按鈕，透過特定訊息來提示後續行動或進一步的互動。
- [x] 以動詞開頭，這有助於用戶瞭解正在採取什麼行動。
- [x] 將網址按鈕用於您想要在網站上完成的工作（例如：購買、帳號連結等）。請清楚說明會將用戶導向 Messenger 以外的地方。
- [x] 在用戶點按回呼按鈕之後傳送回應。這樣會確認您已處理或完成用戶的動作（例如：取消預約、回答問題）。
- [ ] 當按鈕的動作取決於 Bot 目前的狀態時，請勿使用按鈕，因為按鈕在對話串中永遠都可使用。
- [ ] 請勿使用超過 1-3 個字，或加入標點符號。請嘗試將文字保持在 20 個字元以下， 包括空格在內。
- [ ] 請勿每個按鈕都使用網址按鈕。您越能在 Messenger 內打造更多的互動，您的體驗就越顯得一氣呵成。
- [ ] 請勿使用單一回呼按鈕。在只有一個按鈕可選擇的情況下，用戶通常會認為這是訊息文字的延續，而不會瞭解是您想要用戶採取的動作。

# WebView

(用 Chatbot 開網頁)

Messenger 平台可讓您開啟標準 WebView，以供在 Messenger 內載入網頁。您可透過這種方式來提供訊息泡泡難以呈現的體驗和功能，例如：挑選要購買的商品、要預訂的座位，或要預約的日期。

[![](https://scontent.ftpe4-2.fna.fbcdn.net/v/t39.2365-6/17626044_283918708702158_8986183537380032512_n.png?oh=5c13edb9505f6e48f0982ece7941e84a&oe=5AE8A75F)](https://developers.facebook.com/docs/messenger-platform/webview)

三種高度
- compact
- tall
- full

### 最佳作法

- [x] 用於較長時間的互動中（超過三個步驟），其中用戶可能會想要編輯所輸入的資訊，或者以非直線型的方式進行操作。
- [x] 用於著重視覺的內容中。
- [x] 用於用戶偏好設定，或用於允許對先前的選擇進行隨選變更。
- [x] 用於搭配對話式的互動。
- [x] 設定 WebView 的高度來配合所含內容，同時保留底下對話串的內容。
- [x] 保持簡短的 WebView 互動：這仍是 Bot，用戶並未集中注意力。
- [x] 充分利用 Messenger 的 WebView 擴充功能，將對話串的內容帶入 WebView。
- [ ] 不要覺得受到侷限，以為必須一次收集所有的表單資訊。您可透過對話方式逐漸收集資訊，然後稍後在 WebView 中利用表單進行編輯。
- [ ] 請勿在對話串內打造應用程式，而是應該打造 Bot。混合對話式互動和 WebView 互動，並且力求所有互動簡明扼要。結合對話串和 WebView 互動，打造「Messenger 原生」般的使用體驗。

### 使用範例

- 門票搜尋 Bot 可顯示互動式體育場座位圖以選擇座位。
- 旅遊 Bot 可在常設功能表提供旅遊偏好設定（靠走道或靠窗、- 旅館或飯店、飲食需求）。
- 牙科預約 Bot 可顯示互動式行事曆以選擇預約時段。
- 新聞時事 Bot 可提供主題複選清單以供訂閱。
- 商務或品牌 Bot 可提供個人偏好設定以自訂優惠和贈品。

### 建議的設計流程

1. 用戶會透過兩種方式使用您的 WebView 體驗：透過主要對話流程中的按鈕，或透過常設功能表項目（例如：偏好設定），或兩者並行。
1. 視內容和使用案例而定，您的體驗會重疊顯示在對話串上（全螢幕、高度的 75%、高度的 50%）。
1. 建議您在 WebView 互動期間或結束後，將內容傳送到對話串中。
1. 完成後，用戶可關閉 WebView 並返回對話串，或者您也可根據用戶採取的行動（例如：儲存按鈕）而自行關閉 WebView。

# 初始設定系列

在此羅列的 UI 樣式，不隨每次傳送訊息而改變。

## 常設功能表

[![](https://scontent.ftpe4-2.fna.fbcdn.net/v/t39.2365-6/16686128_804279846389859_443648268883197952_n.png?oh=df21bc2067e595d55ededc62067108aa&oe=5AE9DED6)](https://developers.facebook.com/docs/messenger-platform/send-messages/persistent-menu)

常設功能表可讓您在 Messenger 對話中永遠顯示此用戶介面元素。這使得您能在對話的任何階段，都可輕鬆協助用戶探索與使用 Messenger Bot 的核心功能。

### 必備要求

若要顯示常設功能表，以下條件必須成立：

- 用戶必須在 iOS 或 Android 上執行 Messenger 106 版或以上版本。
- Messenger Bot 必須訂閱已發佈的 Facebook 粉絲專頁。
- Messenger Bot 必須在應用程式設定中設定為「公開」。
- Messenger Bot 必須具備 pages_messaging 權限。
- Messenger Bot 必須設定「開始使用」按鈕。(重要!!)

### 強制更新 常設功能表

系統會將常設功能表快取在本機上，但會定時擷取更新。如果您在測試時更新功能表，可透過刪除對話，然後再開始新的對話，以強制發生這個擷取動作。

### 最佳作法

- [x] 就像按鈕一樣，功能表項目可產生 WebView 或回傳。功能表項目還可向下導覽至第二層功能表。對 Bot 的所有用戶而言，功能表都是一樣的：您無法針對不同用戶做出變更，也無法即時變更功能表。
- [x] 將功能表用於 Bot 功能的進入點。
- [x] 力求清楚描述：功能表可讓用戶瞭解 Bot 的功能。功能表可讓用戶立即知道以後在 Bot 中隨手可及的功能。
- [x] 使用子功能表和階層時，符合用戶對您功能的認知。
- [ ] 請勿期望功能表可包含用戶特定資料：對 Bot 的所有用戶而言，功能表都是一樣的，但可本地化。
- [ ] 請勿在功能表中放入「功能表」按鈕，以便向用戶傳送內含功能表的訊息。只需將內容直接放入功能表即可，這就是功能表的目的！
- [ ] 請勿將「重新開啟」等一般動作放入功能表。
- [ ] 請勿將功能表的主要版面用於如「關於」、「服務條款」、「隱私政策」或「技術提供」等次要、「版權頁」般的資訊，而忽略公開 Bot 的主要功能。如果想要包含這些項目，建議您放在子功能表中。

## 歡迎畫面

歡迎畫面是用戶進入 Messenger Bot 時第一眼看到的畫面，其中包含 Bot 的介紹及其提供的服務，另外還會顯示 Bot 的名稱和回覆情況、Facebook 粉絲專頁的大頭貼照和封面相片、視情況選用的問候語，以及「開始使用」按鈕。

[![](https://scontent.ftpe4-2.fna.fbcdn.net/v/t39.2365-6/14302685_243106819419381_1314180151_n.png?oh=275963ef85fb0f1d0941a9a642af99b0&oe=5AE4665C)](https://developers.facebook.com/docs/messenger-platform/discovery/welcome-screen#set_postback)

點按歡迎畫面中的「開始使用」按鈕，即可與您的 Messenger Bot 展開對話。當用戶點按「開始使用」按鈕，對話框就會顯示「開始使用」這則訊息，系統也會隨之授予您的 Bot 傳送訊息的權限。

### 最佳作法
- [x] 請務必在歡迎訊息中清楚傳達後續步驟，以鼓勵用戶回應。您可以使用按鈕來添加訊息的結構，並點出用戶能夠採取的特定動作。
- [x] 請務必在歡迎訊息中分享基本指令。向用戶清楚傳達可以使用哪些關鍵字或關鍵詞來尋求協助、取得更新等，以便用戶更快找到所需資訊。
- [x] Bot 的互動使用有所異動時，請務必變更新手教學。功能如有更新，請返回檢查您的問候語和歡迎訊息，以確認資訊仍如實反映相關功能。
- [ ] 請勿忘記畫面上的一切可互相配合。您在「Messenger 問候語」中提供的背景資訊應該輔助「開始使用」按鈕。
- [ ] 請勿太過一般化。嘗試直呼用戶姓名，讓訊息顯得更個人化，並利用這個機會教導用戶如何使用與控制體驗。

## 設定問候語

歡迎畫面上顯示的問候語，是您提供誘因吸引用戶與您的 Messenger Bot 展開對話的第一個機會。您可以在問候語中加入 Bot 提供的服務簡介（例如主要功能）或是相關標語。此外，從問候語就開始展現 Bot 的風格和調性，也是個相當聰明的作法。

### 個人化
(Chatbot 可知道使用者名字)
您可以加上用戶姓名，將問候語個人化。您可以使用下列範本字串：

```
{{user_first_name}}
{{user_last_name}}
{{user_full_name}}
```

### 最佳作法

- [x] 請務必將您的問候語視為體驗的簡介和摘要。問候語的字元數上限為 160，所以務必簡單扼要。
- [x] 請務必清楚傳達您的主要功能。背景資訊有助於用戶瞭解如何與您互動，以及對您的功能設下期望。
- [ ] 請勿將您的問候語當做說明書來撰寫。因為問候語會消失，所以請使用實際訊息來介紹特定功能和指令。
- [ ] 請勿在問候語中使用過多的文字格式（例如：間距、標點符號、換行），以便在字元數限制下充分表達。

# Facebook 分析工具

適用: 行銷人員、工程師

首頁 > [Messager bot 的部份](https://developers.facebook.com/docs/app-events/bots-for-messenger)


# 參考資料

[Messenger 平台 - facebook developers document](https://developers.facebook.com/docs/messenger-platform/introduction)
[Facebook 分析工具 - facebook developers document](https://developers.facebook.com/docs/analytics)
