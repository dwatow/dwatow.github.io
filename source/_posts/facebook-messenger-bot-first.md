---
title: 初探Facebook Messager 聊天機器人
date: 2017-06-16 18:03:20
tags: ['facebook', 'message bot', 'API']
categories: "技術練習"
---
# 初探Facebook Messager 聊天機器人

基本架構圖

![](https://i.imgur.com/g20l9NE.jpg)


## 事前準備

- {% post_link ngrok 安裝 **ngrok** %}
- 建立facebook粉絲頁
- 建立[facebook開發者帳號](https://developers.facebook.com/?locale=zh_TW)
- 安裝 **node.js** **+** [安裝Express](http://expressjs.com/zh-tw/starter/installing.html)

## 執行ngrok

在任意的位置執行

```shell
$ ngrok http 3000
```

就好了!!
```
ngrok by @inconshreveable                                 (Ctrl+C to quit)

Session Status                online
Version                       2.2.4               
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://db9ba35e.ngrok.io -> localhost:3000        
Forwarding                    https://db9ba35e.ngrok.io -> localhost:3000       

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

> Web Interface[color=blue]                 http://127.0.0.1:4040

可以看見`request`的明細。等一下可以用它看粉絲團小編是不是有收到訊息。

> Forwarding                    http://db9ba35e.ngrok.io -> localhost:3000        
Forwarding[color=red]                    https://db9ba35e.ngrok.io -> localhost:3000     

這兩個就是可以連線的對外網址，等一下要用它。

:::danger
這個東西，從頭到尾都不能關掉。
因為一旦重開對外的網址就改變！！
相關的設定都會改變唷。
:::



## Facebook開發者帳號 *(極重要!!!)*

進入[官網](https://developers.facebook.com/?locale=zh_TW)之後，按右上角的「建立應用程式」
> ![](https://i.imgur.com/HPoGprM.png)
要建立一個應用程式，給Facebook一些必要的資料。

**選Messager**
![](https://i.imgur.com/KIGVk6X.png)
點擊開始使用

進入畫面之後，找到 **Webhook**
![](https://i.imgur.com/l85c5zR.png)

在此要填入兩個東西，下面的就勾`messages`就好，其它隨你
- 回呼網址
- 驗證權杖

回呼網址就是開好的伺服器的對外網址。
在此就是上一節的Forwarding網址
(在此篇文章`http://db9ba35e.ngrok.io`)。

為了讓facebook伺服器知道要把收到的訊息，丟到哪給機器人。

驗證權杖: 隨便打(真的!!!)

>在此，一定會出現下面的錯誤訊息
![](https://i.imgur.com/xkKAlYf.png)

原因在於，facebook伺服器傳給我們一個訊息，
但是要回覆一個相同的值(在此要回`1770261222`)給他，不然就報錯。

### 看看facebook傳什麼過來

從[Web Interface](http://127.0.0.1:4040)可以看到

![](https://i.imgur.com/ZZFJwRM.png)

其中 `1770261222`值藏在`hub.challenge`裡面。



所以，接下來要建立伺服器，並且回傳正確的訊息給facebook伺服器。



## 建立機器人運作的 Server

### Hello World!!

在此使用`node.js`。

1. 建立一個資料夾
2. 進入資料夾
3. 新增一個 ==***.js== 檔案(在此使用 ==app.js==的檔名)

找[nodejs hello world](http://expressjs.com/zh-tw/starter/hello-world.html) 從這裡面貼上接下來要使用的程式碼

```javascript=
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
```

4. 執行伺服器

```shell
$ node app.js
```

接下來[開瀏覽器](http://localhost:3000)，看見 ++hello world++，就算成功讓伺服器運作起來。

### 設定回覆給 facebook的訊息

回到`app.js`改寫`get`的`request`的處理函數，改掉原本的 "++Hello World!++"
```javascript=4
app.get('/', function (req, res) {
  res.send('Hello World!');
});
```

改寫成下面這樣，就可以回覆facebook要的訊息囉

```javascript=4
app.get('/', function (req, res) {
  res.send(req.query['hub.challenge']);
});
```

再回到 facebook的開發者頁面



## Facebook開發者帳號。續

按下驗證之前，要先把伺服器跑起來!!!

```shell
$ node app.js
```

這樣就可以按下「驗證」並且回到 `Messager`的設定畫面。

先取得權杖 ++(真是中二的翻譯)++，它指的就是==token==
![](https://i.imgur.com/CZ9DRL0.png)

在同頁面滑下來一點。
![](https://i.imgur.com/b7hFrNK.png)

按下「選擇粉絲專頁」>「訂閱」



## 確認伺服器有收到訊息

打開[Web Interface](http://127.0.0.1:4040/)可以看見目前收到的 **request** 明細。

用 facebook帳號跟你申請的粉絲頁傳訊息(就是聊天)，
送出訊息後，看看是不是可以在Web Interface看見你送出的訊息？

> *例圖 ↓*
> ![](https://i.imgur.com/31WMgqv.png)

想要看得懂這個結構，可以參考[官方網站的文件](https://developers.facebook.com/docs/messenger-platform/webhook-reference/message)

可以看見送出的訊息「**!!!**」放在資料結構的哪個位置。

> 在此要注意: recipient.id 等一下會用上



## 寫程式，機器人回覆訊息!!

### 在此先安裝
在此，需要讓 **web service** 發送 **request**，必須安裝一個外掛[request](https://github.com/request/request)(在你的專案資料夾)，
讓你的`node.js`可以送request。

```shell
$ npm install request --save
```

> 「發送request」這件事一般來說都是瀏覽器在做的，伺服器是負責接收的，
>  若伺服器要和伺服器溝通，就要讓伺服器「發送request」。

### 寫程式

讓`node.js`可以送出POST的request。

[上網找一下怎麼送出POST的request的寫法](https://stackoverflow.com/questions/27190447/pass-json-to-http-post-request)，找到一個簡單的寫

回到`app.js`，上面加上 ++~(不改寫既有的程式碼)~++
```javascript=
var request = require('request');
```
下面加上接收post的函數 ++~(不改寫既有的程式碼)~++
```javascript=
app.post('/', function (req, res) {
  //...
}
```
在函數裡面加上「發送request」的功能
```javascript=2
request({
    url: url,
    method: "POST",
    json: requestData
}, ...
```
讓機器人收到 facebook傳過來的訊息之後，再發送訊息回去給 facebook伺服器

其中有兩個資料要填入：
- url
- json

#### **URL**

這個網址就是facebook messager伺服器的位址
到 [Messager的開發文件>傳送 API 參考資料>要求](https://developers.facebook.com/docs/messenger-platform/send-api-reference)

這一段

>若要傳送訊息，請使用您的粉絲專頁存取權杖，向 https://graph.facebook.com/v2.6/me/messages?access_token=<PAGE_ACCESS_TOKEN> 發出 POST 要求。承載必須以 JSON 格式提供，如下所述

網址就是
```
https://graph.facebook.com/v2.6/me/messages?access_token=
```

後面的`token`在下圖的位置取得
![](https://i.imgur.com/JJPRQDb.png)

#### **JSON**

找到要回覆的格式...的 JSON
到[Messager的開發文件>傳送 API 參考資料>要求](https://developers.facebook.com/docs/messenger-platform/send-api-reference)
(和剛剛同一份文件的同一段中的範例...)

>![](https://i.imgur.com/g15sRhp.png)
(facebook提供的範例是使用`curl`這隻程式來送出請求，可以把curl想成postman的指令版)


取出來之後

```javascript=
{
  "recipient": {
    "id":
  },
  "message": {
    "text": ""
}
```

填入回覆者的 id 和要給他的訊息就可以囉~
到[這裡](#確認伺服器有收到訊息)找`sender`

### 改寫 request

剩下在`text`寫上你要回傳的訊息。

```javascript=2
request({
    url: https://graph.facebook.com/v2.6/me/messages?access_token=<token>,
    method: "POST",
    json: {
      "recipient": {
        "id":
      },
      "message": {
        "text": ""
    }
});
```

### 最後的最後

為了防止鬼擋牆，查了一下[官方文件](https://developers.facebook.com/docs/messenger-platform/faq#faq_144542125979728)

> 為什麼我持續收到 Webhook 一直未接受更新的開發人員重要通知，或持續不斷收到相同的 Webhook 呼叫？[color=red]
> > 請確定 Webhook 以狀態代碼 200 回應。這樣會告知我們已成功收到 Webhook。如果您未傳回狀態代碼 200，我們會重新嘗試呼叫，直到成功完成為止。此外，如果 Webhook 很長一段時間都未傳回狀態代碼 200，我們就會傳送開發人員重要通知。[color=lightblue]
另請注意，成功狀態代碼必須即時傳回。Webhook 呼叫會在 20 秒後逾時。請務必在設計程式碼架構時，以非同步的方式處理 Webhook，以便可立即傳回成功狀態代碼，然後分別處理 Wehbook。



在你的post函數最後，加入下面程式碼的第3行。
```javascript=
app.post('/', function (req, res) {

  res.sendStatus(200);
});
```



## 完成

*改好之後，重開伺服器，再發訊息給小編就可以囉!!!*
