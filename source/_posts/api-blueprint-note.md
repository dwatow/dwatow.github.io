---
title: API Blueprint 學習筆記
date: 2017-11-14 10:13:40
tags: ['api', 'API Doc', 'Aglio']
categories: 工具使用
---

# API Blueprint 學習筆記

在開web service api文件時，都希望資訊公開、同步更新。所以會有很多工具幫助撰寫並產生html page。

`Aglio` 是 一種 [Api Buleprint](https://apiblueprint.org/) 的 Render。

Api Buleprint 是一種markdown，主要的用途是撰寫 Api 文件
但是大多數(包含官方網站)的教學，總都沒有把文法和Render結果貼在一起看(至少是預設的佈景)，讓剛入門的我自己無法學得更快速。

所以，特別寫一篇常用文法的整理。


# 後設資料

並不會被render到頁面上。

## 文件版本

```markdown
FORMAT: 1A
```

## 文件的 `HOST`

有設定 `HOST` 的話，下面的 `Resource` 將會添加上網址的 domain

```markdown
HOST: https://dwatow.github.io
```


# API 名稱&描述

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

# Resource 群組
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

# Resource (API 本身)
Resource

官網是用`Resource`這個字，也許是因為[`URI`](https://zh.wikipedia.org/wiki/%E7%BB%9F%E4%B8%80%E8%B5%84%E6%BA%90%E6%A0%87%E5%BF%97%E7%AC%A6)，所以稱為`Resource`，畢竟網址本身可以是各種形式的資源

只要用`##`就代表要API 本身。它會定義一組路徑。
再依不同的`Actions`各別定義要帶資料形式。

**markdown**

```markdown
## Question Collection [/questions]
```

**rendered**

![](https://i.imgur.com/b1TDUJm.png)

## API 動作

Actions

使用`### 名字 [動作]`可以表示 API 的動作段落

**markdown**

```markdown
### List All Questions [GET]
```

**render result**

(藍色的部份)

![](https://i.imgur.com/YOw3rmG.png)


## 很多個 API 動作

每一個`Resource`都會有不同的動作。
直接用`### 名字 [動作]`就可以再加一個了。

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

### Response (JSON)

記錄 `Response` 形式很多種，用`list`形式記錄

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

### 自訂 Response 的 Headers, Body

也可以使用`list`來自訂 Headers、Body 的 JSON

> 要注意，`Body`後面的 JSON 要再多縮一次縮排。

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

# URI Template

要將 API 網址一部份當變數使用，在此可以使用`{變數}`的形式，放在 `Resource`的位址列定義中，稱之為`URI Template`。

定義 `URI Template` 時，若有變數，要設定 `URI Parameters` 區段對變數進行定義。

**markdown**

```markdown
## Question [/questions/{question_id}]
```

**render result**

![](https://i.imgur.com/Su74IhH.png)

## URI Parameters

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


# 同場加映: Advance Tutorial

這一段進階的教學，大概的內容是在講
如果你在 `request` 和 `response` 要放 `JSON`。
而且希望附上 `JSON Schema` ，可以考慮使用 `MSON` (在 `+ Attributes` 下接 `list`)。

使用 `MSON` ，就可以使用 `Data Structures`
另外，還可以使用 `Relaiton Types`

# JSON Schema

`Action` 的 `Request` 和 `Response` ，可以描述它們的 `Body` 結構有相關的 `Schema` 。
通常使用 `JSON Schema` 描述 `JSON bodies`


**markdown**
在 `Response` 的 `Body` 後面加上 `+ Schema` 段落即可。


```markdown
### Create a New Question [POST]
You may create your own question using this action. It takes a JSON object
containing a question and a collection of answers in the form of choices.

+ Request (application/json)

    + Body

            {
              "question": "Favourite language?"
              "choices": [
                "Swift",
                "Objective-C"
              ]
            }

    + Schema

            {
              "$schema": "http://json-schema.org/draft-04/schema#",
              "type": "object",
              "properties": {
                "question": {
                  "type": "string"
                },
                "choices": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "minItems": 2
                }
              }
            }
```

**result**

![](https://i.imgur.com/EK62JtG.png)

# Attributes

表示 `Request` 和 `Response` 的結構還有另一個方法，就是使用 `MSON` 撰寫。

`MSON` 像是 `API Blueprint` 一樣，可讀性很高，不像 `JSON` 或 `YAML` 是給機器讀的

`MSON` 也允許你描述 API 的資料結構。可以加在 `Resource`, `Action` 和  individual requests or responses ， 只要加上 `+ Attributes`

> 注意，自動生成的 `JSON Schema` 和手寫的並不會完全相同。(可比較上一段手寫的)在這個例子中，`minItems` 將不會渲染生成。
> 如果你無法接受，你可以覆寫 `schema` 。

**markdown**

當 `Attribute` 下面那一段成功渲染時，會同時擁有 `JSON body` 和 `JSON Schema` 。


```markdown
### Create a New Question [POST]
You may create your own question using this action. It takes a JSON object
containing a question and a collection of answers in the form of choices.

+ Request (application/json)

    + Attributes

        + question: Favourite Language? (required)
        + choices: Swift, `Objective-C` (array, required)
```

**result**

![](https://i.imgur.com/gBJhD2t.png)

# Data Struct

只要你開始使用 `MSON` 你可以重複使用某些常用或巢狀的資料結構組合。

可以使用 `## Data Structures` 段落。 `Attribute` 可以引用自己或其它的 Resource 所定義的 `data structures` 段落名稱

**markdown**

```markdown
### List All Questions [GET]
+ Response 200 (application/json)

    + Attributes (array[Question])

## Data Structures

### Question
+ question: Favourite programming language? (required)
+ published_at: `2014-11-11T08:40:51.620Z` (required)
+ url: /questions/1 (required)
+ choices (array[Choice], required)

### Choice
+ choice: Javascript (required)
+ url: /questions/1/choices/1 (required)
+ votes: 2048 (number, required)
```

**result**

![](https://i.imgur.com/on9L1uQ.png)

# Relaiton Types

看不懂作用是什麼。
在此就不誤人子弟了
附上看過的參考資料
- [官網 Advance Tutorial](https://apiblueprint.org/documentation/advanced-tutorial.html)
- [官網 Specification](https://apiblueprint.org/documentation/specification.html)

```markdown
## Question [/question/{id}]
### View a Question Detail [GET]
+ Relation: self

### Delete a Question [DELETE]
+ Relation: delete

## Questions Collection [/questions]
### List All Questions [GET]
+ Relation: self
```

# MSON 學習筆記

`MSON` 是一種寫 `Markdown Syntax` 表示 `Object Notation`，一種可讀性更高的資料結構表示方式，這個教學學會 `MSON` 的描述和資料結構表示法

官網提供的 MSON Resource

- [MSON Specification](https://github.com/apiaryio/mson/blob/master/MSON%20Specification.md)
- [Examples](https://github.com/apiaryio/mson#notational-conventions)

# Data structures in MSON

> 實作注意
> 這一段介紹的語法，必須寫在 `Data structures` 段落裡。

下面我們描述了一個 `Object` 稱為 `Person` ，它有一個 `properties` 叫 `name`。

```markdown
# Person

+ name
```

使用`()`宣告 `properties` 的型別。預設型別是字串。
使用`-`接上一段文字，當作 `properties` 的描述。
使用`: `接上一個值，當作 `properties` 的值(舉例的值)。

```markdown
+ name: Chris (string) - The Person's name
```

> 若 `properties` 的值，包含下面符號，就要用 `back-ticks` 包成 `code-block`。

## 型別

MSON 有6種型別可以使用

- 簡單型別: `boolean`, `string`, `number`
- 複雜型別: `array`, `enum`, `object`

## Inheritance

Administrator 繼承 Person

```markdown
# Administrator (Person)

+ role (string) - The administrators role
```

## Nesting

Company裡的founder是一個Person

```markdown
# Company

+ name: Apiary
+ founder (Person)
```

# Example

用 `aglio` 實測結果

```markdown


# Polls API Root [/]

## Retrieve the Entry Point [GET]

+ Response 200 (application/json)

    + Attributes

        + Human (Administrator)
            + workHistory (Company)


# Data Structures

# Person

+ name: `Spencer-Churchill` (string) - The Person's name

# Administrator (Person)

+ role (string) - The administrators role

# Company

+ name: Apiary
+ founder (Person)
+ founded: 2011 (number) - The year in which the company was founded
+ address
    + street: 235 Ninth Street
    + city: San Francisco
    + state: California
```

測試變這樣

![](https://i.imgur.com/SjNNUQ6.png)


# 後記

api blueprint 官網
- [MSON Specification](https://apiblueprint.org/documentation/mson/specification.html)
- [API Blueprint Tutorial](https://apiblueprint.org/documentation/tutorial.html)

其它
- [More advanced Blueprint with MSON](https://grobmeier.solutions/blueprint-and-mson-04022016.html)

練習頁面成果
- [Tutorial](https://dwatow.github.io/apiblueprint-demo/tutorial.html)
- [Advance Tutorial](https://dwatow.github.io/apiblueprint-demo/advance_tutorial.html)
- [MSON Tutorial](https://dwatow.github.io/apiblueprint-demo/mson.html)
- [Example: poll](https://dwatow.github.io/apiblueprint-demo/poll.html)
