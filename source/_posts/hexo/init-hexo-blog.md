---
title: Hexo 從無到發佈第一篇文章
date: 2017-06-11 14:55:36
tags: 
- hexo
categories: 
- hexo改裝
---
# Hexo 從無到發佈第一篇文章

內容包含:
- 安裝程式
- 更換主題
- 佈署
- 新增文章
## 初衷

這是第一篇新部落格的建置困難排除文章。
希望可以提供給想使用hexo的朋友們，提供一些降低阻力的力量。

> 撰文環境: Ubuntu 16.04 LTS
> 佈署環境: Github

**已安裝的必要套件**
- git
- nvm -> node.js

## 安裝程式

基本上照著官方文件^[[官網的安裝方式](https://hexo.io/zh-tw/docs/setup.html)]上的步驟，就可以安裝了。在此節錄重點

### 要先安裝
先安裝好git, node.js(官網建議透過[nvm](https://github.com/creationix/nvm)安裝)

這次的主角
安裝 `hexo`[^指令]

```shell
$ npm install -g hexo-cli
```
## 初始 hexo blog

由於要把blog蓋在page.github的功能，所以下面的路徑有固定格式，其中`<github id>`是自己在github的id。

下指令初始化blog[^指令]
```shell
$ hexo init <github id>.github.io
```

ex: 像我的整串`dwatow.github.io`

```shell
$ hexo init dwatow.github.io
```

好了之後，進入這個目錄。
之後的系列文章會以 `$hexo` 來稱呼這個目錄。


## 更換主題

### 官網教學

Hexo的主題更換，理論上確實是非常簡單的。
[官網的教學](https://hexo.io/zh-tw/docs/themes.html)說明如下

>「打造 Hexo 主題非常容易，您只要在 themes 資料夾內，新增一個資料夾，並修改 \_config.yml 內的 theme 設定，即可切換主題。一個主題可能會有以下的結構：」

簡要的說，就是四個步驟:
1. 在 themes 資料夾內，新增一個資料夾
2. `git clone` 一份主題
3. 修改 `_config.yml` 內的 `theme` 設定
4. 完成

### 實戰一次

但是，實際上，隨著主題複雜度或設定，有著不同的難度呢

1. 到[官網](https://hexo.io/themes/)選主題
2. 在 `$hexo/theme` [^$hexoPath] 目錄下，下指令` $ git clone 主題路徑 <指定的目錄名稱>`就會安裝到你指定的目錄名稱[^註2]
   ex:
   `$ git clone https://github.com/nameoverflow/hexo-theme-icalm.git icalm`
2. 安裝該主題下的子模組
   icalm 主題有使用套件，而設定成git 的子模組。
   進入icalm 目錄，下指令初始化子模組
   `$ git submodule update --init --recursive`
3. 清除先前已生成的檔案[^指令][^clean] (已有主題渲染內容的檔案)
   `$ hexo clean`
3. 生成渲染檔案[^指令]
   `$ hexo generate`
4. 在瀏覽器看結果[^指令]，預設 `http://localhost:4000`
   `$ hexo server`

## 新增文章

未來最常重複的就是從這一步開始。

新增文章，要下指令，生成一個檔案。
```shell
$ hexo new init_hexo_blog
INFO  Created: $hexo/source/_posts/init-hexo-blog.md
```

再該檔案，貼上`markdown`的source code

就是這麼容易。

不過渲染出來的文章，不是這麼理想，也許未來研究怎麼換渲染器之後，再來寫一篇。

> 在此就先不管，如果你覺得這一篇醜醜，一定是還沒有換渲染器!![color=red]

## 佈署

以[官網](https://hexo.io/zh-tw/docs/deployment.html)的介紹，佈署確實簡單。


無痛的步驟如下[^佈署遇到問題][^hexo-deployer-git]
1. 安裝[hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git) [^佈署遇到問題]
   `$ npm install hexo-deployer-git --save`
2. 設定`_config.yml`，`type`要用`git`，不是`github`
```javascript
deploy:
  type: git
  repo: <repository url>
  branch: [branch]
  message: [message]
```
3. 下指令「生成檔案並上傳頁面」，hexo設計的指令，很靈活。在此有三種指令可以使用
```shell
#只有佈署
$ hexo deploy

#產生靜態檔之後佈署
$ hexo generate -d
$ hexo generate --deploy

#佈署前先產生靜態檔
$ hexo deploy -g
$ hexo deploy --generate
```

接下來就是到github看結果囉。




也就是因為有上面的經驗，你才看得到這一頁呢！^^



[^佈署遇到問題]: 錯誤訊息: `ERROR Deployer not found: git`
解決方式:
`$ npm install hexo-deployer-git --save`

[^hexo-deployer-git]: [升级到hexo 3.0后deploy type: github选项无效 #1013](https://github.com/hexojs/hexo/issues/1013)
檢查是否已安裝

[^指令]: [Hexo指令說明](https://hexo.io/zh-tw/docs/commands.html)


[^clean]: `$ hexo generate` 之後，套不上 CSS，console 裡無報錯。
要先下 `$ hexo clean`

[^$hexoPath]: 「你的hexo部落格目錄」
[^註2]: 通常在github上的主題，會命名成`hexo-theme-主題名稱`。
