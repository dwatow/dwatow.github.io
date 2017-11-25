---
title: API Blueprint Tutorial 學習筆記
date: 2017-11-14 10:13:40
tags: ['API', 'API Doc', 'Aglio']
categories: 工具使用
---

# API Blueprint Tutorial 學習筆記

在開web service api文件時，都希望資訊公開、同步更新。所以會有很多工具幫助撰寫並產生html page。

`Aglio` 是 一種 [Api Buleprint](https://apiblueprint.org/) 的 Render。

Api Buleprint 是一種markdown，主要的用途是撰寫 Api 文件
但是大多數(包含官方網站)的教學，總都沒有把文法和Render結果貼在一起看(至少是預設的佈景)，讓剛入門的我自己無法學得更快速。

所以，特別寫一篇常用文法的整理。

## 後設資料

並不會被render到頁面上。
可以用來代表文件版本。

```markdown
FORMAT: 1A
```

## API 名稱&描述
API Name & Description

整份文件第一個`h1`，寫成`# API名稱`，用來當作 **API 文件的名稱**

緊接在**API文件名稱**下面的文字，用來當作 API 文件的最初描述

**markdown**

```markdown
# Polls

Polls is a simple API allowing consumers to view polls and vote in them.
```

**render result**

![](https://i.imgur.com/IUZ5m7i.png)

## API 群組
Resource Groups

一種有接著`Group`關鍵字的`h1`，寫成`# Group API 群組名稱`，用來當 **API 群組**名稱

緊接在**API 群組**下面的文字，用來當作 API 群組 的描述

**markdown**

```markdown
# Group Questions

Resources related to questions in the API.
```

**render result**

![](https://i.imgur.com/1829jBY.png)

## API (本身)
Resource

官網是用`Resource`這個字，也許是因為[`URI`](https://zh.wikipedia.org/wiki/%E7%BB%9F%E4%B8%80%E8%B5%84%E6%BA%90%E6%A0%87%E5%BF%97%E7%AC%A6)的關係，所以稱為`Resource`，畢竟網址本身可以是各種形式的資源

只要用`##`就代表要API 本身。它會定義一組路徑。
再依不同的`Actions`各別定義要帶資料形式。

**markdown**

```markdown
## Question Collection [/questions]
```

**rendered**

![](https://i.imgur.com/b1TDUJm.png)

### API 動作

Actions

**markdown**

```markdown
### List All Questions [GET]
```

**render result**

(藍色的部份)

![](https://i.imgur.com/YOw3rmG.png)


### 很多個 API 動作

每一個API都會有不同的動作。
直接用`###`就可以再加一個了。

而且，下面可以直接使用`markdown`的`list`語法。
會render出條列式的內容

**markdown**

```markdown
### Create a New Question [POST]

You may create your own question using this action. It takes a JSON object
containing a question and a collection of answers in the form of choices.

+ question (string) - The question
+ choices (array[string]) - A collection of choices.
```

**render result**

![](https://i.imgur.com/uJNG4sQ.png)

### Response(JSON)

記錄 Response 形式很多種，用`list`形式記錄

傳回200，資料以JSON形式呈現。

`+ Response 200 (application/json)`

`Header` 的內容是自然render生成的

**markdown**

```javascript
+ Response 200 (application/json)

        [
            {
                "question": "Favourite programming language?",
                "published_at": "2014-11-11T08:40:51.620Z",
                "url": "/questions/1",
                "choices": [
                    {
                        "choice": "Swift",
                        "url": "/questions/1/choices/1",
                        "votes": 2048
                    }, {
                        "choice": "Python",
                        "url": "/questions/1/choices/2",
                        "votes": 1024
                    }, {
                        "choice": "Objective-C",
                        "url": "/questions/1/choices/3",
                        "votes": 512
                    }, {
                        "choice": "Ruby",
                        "url": "/questions/1/choices/4",
                        "votes": 256
                    }
                ]
            }
        ]
```

**render result**

縮起來是這樣
![](https://i.imgur.com/9KAyV9R.png)

展開是這樣
![](https://i.imgur.com/LA3NwH2.png)

##### 自訂 Headers, Body

也可以使用`list`來自訂 Headers、Body的JSON

**markdown**

```markdown
+ Response 201 (application/json)

    + Headers

            Location: /questions/1

    + Body

                {
                    "question": "Favourite programming language?",
                    "published_at": "2014-11-11T08:40:51.620Z",
                    "url": "/questions/1",
                    "choices": [
                        {
```
**render result**

![](https://i.imgur.com/t9KuU9V.png)

## URI Template

要將 API 網址一部份當變數使用，在此可以使用`{變數}`的形式，放在 `Resource`的位址列定義中，稱之為`URI Template`。

**markdown**

```markdown
## Question [/questions/{question_id}]
```

**render result**

![](https://i.imgur.com/Su74IhH.png)

### URI Parameters

用在URI的參數描述，使用`+ Parameters`做`list`的第一層
通常是用來描述URL上的變數。[看完整定義](https://github.com/apiaryio/api-blueprint/blob/master/API%20Blueprint%20Specification.md#def-uriparameters-section)

**markdown**
```markdown
+ Parameters
    + question_id (number) - ID of the Question in the form of an integer
    + question_type(string) - Type of the Question in the form of an String
```

**render result**

![](https://i.imgur.com/jrDcyEZ.png)

### Actions

(和上面的描述一樣，沒有什麼差別)

**markdown**

```markdown
### View a Questions Detail [GET]

+ Response 200 (application/json)

            {
                "question": "Favourite programming language?",
                "published_at": "2014-11-11T08:40:51.620Z",
                "url": "/questions/1",
                "choices": [
                    {
                        "choice": "Swift",
                        "url": "/questions/1/choices/1",
                        "votes": 2048
                    }, {
                        "choice": "Python",
                        "url": "/questions/1/choices/2",
                        "votes": 1024
                    }, {
                        "choice": "Objective-C",
                        "url": "/questions/1/choices/3",
                        "votes": 512
                    }, {
                        "choice": "Ruby",
                        "url": "/questions/1/choices/4",
                        "votes": 256
                    }
                ]
            }
```

**render result**

![](https://i.imgur.com/mURlxBK.png)


# 後記

這就是[API Blueprint Tutorial](https://apiblueprint.org/documentation/tutorial.html)的過程。

[練習頁面成果](https://dwatow.github.io/apidoc-demo/apiBlueprintTutorial.html)
