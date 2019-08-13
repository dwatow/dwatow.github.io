---
title: 開發者介紹
date: 2017-06-14 18:01:14
comments: false
---

# 開發者介紹

從 C++ 到 JavaScript, 是我過去慣用的, 也希望未來可以慣用的語言。寫程式的生涯有 7 年以上實戰經驗。

過去接觸過的技術 C++, MFC, OLE, CppUnit, Jenkins, Git, Boost C++, python, Django, C#, Silverlight...等，最熟練的是標準 C++ 的語言本身, 用 Git 版本控制, CppUnit 輔助自動化測試, Jenkins 自動化工作流程, 用 python 寫小工具。

希望未來, 是以「網頁前端技術」, 有機會面對&解決當代有價值的問題, 繼續開發者的路。

目前熟悉的語言 HTML 和 CSS ，可以參考 Blog 選單中的 Novice F2E (前端新手村)，以及 JavaScript，熟悉的前端框架是 Vue.js 是個小巧快速的好工具。

除了「寫程式」之外, 我也很喜歡「設計」, 曾經去成大旁聽一年的工業設計課程，覺得解鎖設計技能樹，有助於在工作上與設計師溝通。

## 作品介紹

<style media="screen">

.labels {
    line-height: 2em;
    padding-left: 0;
    margin: 0;
}

@media screen and (min-width: 576px) {
    .labels {
        margin-left: 40px;
    }
}

.view_style {
    background-color: black;
}

.labels > li {
    background-color: #aaa;
}

.labels > li:hover {
    background-color: #888;
    transition: background-color .3s;
}

.view_style, .labels > li {
    cursor: pointer;
    line-height: 1.5em;
    border-radius: 3px;
    color: white;
    margin: 2px;
    padding: 3px 8px;
}

.labels > li {
    display: inline-block;
}

.works {
    padding-top: 20px;
    min-height: 100vh;
}

.works > div {
    padding: 20px;
    box-sizing: border-box;
    border-radius: 5px;
    background: hsla(0, 0%, 98%, 1);
    border: 5px solid #fff;
    width: 100%;
}

.view_style {
    display: none;
    vertical-align: top;
    width: 12.6px;
}

@media screen and (min-width: 576px) {
    .works > div {
        width: 50%;
    }

    .view_style {
        display: inline;
        float: left;
    }
}

@media screen and (min-width: 770px) {
    .works > div {
        width: 33.33333%;
    }

    .works > .width2x {
        width: 66.66%;
    }

    .view_style {
        display: inline;
        float: left;
    }
}

#view_switch {
    position: absolute;
    width: 0;
    opacity: 0;
}

#view_switch:checked ~ .works > div {
    width: 100%!important;
}

#view_switch ~ div > .view_style{
    transform: rotate(270deg);
    transition: transform .3s;
}
#view_switch:checked ~ div > .view_style{
    transform: rotate(0deg);
}

.works > div.show {
    display: block;
}

.works > div.hidden {
    display: none;
}

#toc {
    visibility: hidden;
    position: absolute;
}

img.desktop {
    width: 75%;
}

img.mobile {
    width: 21%;
}

.view {
  width: 100%;
  overflow: auto;
  position: relative;
  /* background-color: #eef; */
}

.view > .slide {
  display: inline-block;
  font-size: 0;
  width: 100%;
  text-align: center;
}

.view > .slide:nth-child(2) {
  position: absolute;
  top: 0;
  left: 100%;
}

.slide > img {
  vertical-align: middle;
}
</style>

以下是我這幾年來寫過東西、用過的技術或做過的練習。

<script
  src="https://code.jquery.com/jquery-3.2.1.min.js"
  integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
  crossorigin="anonymous"></script>

<script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"></script>
<script src="https://unpkg.com/imagesloaded@4/imagesloaded.pkgd.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<input type="checkbox" id="view_switch" checked>
<div>
    <label for="view_switch" class="view_style">
        <i class="fas fa-pause"></i>
    </label>
    <ul class="labels">
        <li id="all">All</li>
        <li id="webFrontEnd">網頁前端</li>
        <li id="webBackEnd">網頁後端</li>
        <li id="desktopApp">桌面應用程式</li>
        <li id="htmlcss">HTML + CSS</li>
        <li id="bootstrap">Bootstrap</li>
        <li id="pullRequest">pull request</li>
        <li id="javascript">JavaScript</li>
        <li id="node">node.js</li>
        <li id="vue">Vue.js</li>
        <li id="exercise">Exercise</li>
        <li id="casdk">CA-SDK</li>
        <li id="cpp">C++</li>
        <li id="mfc">MFC</li>
        <li id="designPattern">Design Pattern</li>
        <li id="csharp">C#</li>
        <li id="bspline">BSpline 實作</li>
        <li id="msOfficeTypeLib">串接 MS Office 功能</li>
        <li id="package">Package</li>
        <li id="python">Python</li>
        <li id="django">Django</li>
        <li id="canvas">Canvas</li>
        <li id="devops">DevOps</li>
    </ul>
</div>
<div class="works">
  <div style="height: 0; border: 0 none transparent; padding: 0; background-color: transparent;"></div>
  <div class="webFrontEnd htmlcss width2x">
      <h2>
          <a href="##"></a>
          hausenncamp 官方網站
      </h2>
      <h4>婚紗公司形象網站</h4>
      <div class="slider">
        <div class="view">
          <div class="slide">
            <img src="https://i.imgur.com/4IYIXAP.gif" alt="" class="mobile">  <img src="https://i.imgur.com/or8wkRd.gif" alt="" class="desktop">
          </div>
          <div class="slide">
            <img src="https://i.imgur.com/g03oVRv.gif" alt="" class="mobile">  <img src="https://i.imgur.com/cK5gYhV.gif" alt="" class="desktop">
          </div>
        </div>
      </div>
      <p>
          負責工作: 切版、視覺特效、需求管理<br />
          使用工具&套件: Component SCSS, jQuery, Bootstrap4 + Masonry, Animate.css<br />
          手工特效: Pure CSS Parallax + RWD<br />
          Transition: 跳接、移動<br />
          Animations: Loading page, Navigation bar items<br />
          工作概述: <br />
          初期: 直接與案主(設計師)溝通與co-work, 建立合作的溝通模式,、溝通使用者情境，協助製作 baclog 以價值決定工作順序<br />
          中期: 協助幫 JavaScript 工程師處理套件的 bug , 確保每個人的工作順利進行。<br />
          收尾: 利用 issue tracker 工具,收斂案子的 scop，順利結案。
      </p>
  </div>
  <div class="webFrontEnd htmlcss bootstrap width2x">
      <h2>
          <a href="##"></a>
          <a href="http://streetobserver.org/" target="_blank">台南路上觀察團 官方網站</a>
      </h2>
      <h4>社群形象網站</h4>
      <img src="https://i.imgur.com/SlG5So2.gif" alt="" class="">
      <p>
          負責工作: 切版、視覺特效<br />
          使用工具&套件: Bootstrap, SASS<br />
          手工特效: Navigation bar fix in top<br />
          工作概述: 案主(技術麻瓜)溝通需求, 並且以對方出設計稿的方式進行實作設計稿。<br />
          密切溝通的讓案主學會 git , 不改程式碼的小幅度的修改, 案主可自行操作 git 更新維護。
      </p>
  </div>
  <div class="exercise javascript vue">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/vue-a-bit/" target="_blank">vue a bit 聚會</a>
      </h2>
      <h4>圍繞著 Vue-cli 的學習讀書會</h4>
      <img src="https://vuejs.org/images/logo.png" alt="">
      <p>
          主題包含 Webpack, loader, plgin, vue, npm, node, commonjs<br />
          從 vue-cli 的 webpack-simple 每個套件的研究，到 webpack 模版的練習
      </p>
  </div>
  <div class="exercise javascript vue">
      <h2>
          <a href="##"></a>
          <a href="https://dwatow.github.io/vueExercise/" target="_blank">練習筆記 Vue.js 2</a>
      </h2>
      <h4>初學 vue.js 的學習記錄 & 習作</h4>
      <p>
          透過官方網站的文件, 每一個練習都記錄在內, 自行寫成一個 html 檔。<br />
          初期以 CDN 的方式使用 vue。<br />
          vue-cli 對 vue.js 的了解又更進一步。<br />
          vue-resource: 用來接 API<br />
          vue-router: 用來做前端 router<br />
          Vuex: 用來管理資料(狀態)更新途徑
      </p>
  </div>
  <div class="exercise javascript vue width2x">
      <h2>Atom theme 修改</h2>
      <h4>Atom theme</h4>
      <img src="https://i.imgur.com/j7YNeRn.gif" alt="" class="">
      <p>
          加上行 heightline 的光劍。<br />
          加上 indent 的 heightline 的光劍。<br />
          加上括號的 heightline 的底部畫螢光筆。<br />
          畫面傾斜，像 star wars (平常沒有這樣使用)
      </p>
  </div>
  <div class="node javascript">
      <h2>
          <a href="##"></a>
          <a href="##" target="_blank">Messenger 聊天機器人</a>
      </h2>
      <h4>Facebook Messenger Chatbot</h4>
      <p>
          擔任 PM，技術上是使用 php 的 Laravel 為框架的後端 web service。<br />
          主要負責與業業主溝通、整理 API Doc 草稿 、 Wireframe 、 Sequence diagram<br />
          用前端的 JavaScript 做發送 API 的 API 自動化測試<br />
          另外，還有使用 node.js + Messenger webhook 實作練習。
      </p>
  </div>
  <div class="pullRequest javascript">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/lukehaas/Scrollify/pull/268" target="_blank">Scrollify - Fix overflow scroll #268</a>
      </h2>
      <h4>修改 Open Source Project</h4>
      <p>
          網站 hausenncamp.com 有用的捲軸特效套件。<br />
          問題: 容器在 overflow: hidden , 容器的捲軸特效定位, 預期的行為不同。<br />
          過程概述: 使用 Chrome 的 debugger 追縱 js 出錯的地方, 修改完成並提交給原作者。
      </p>
  </div>
  <div class="exercise javascript width2x">
      <h2>
          <a href="##"></a>
          <a href="https://dwatow.github.io/JavaScript30/" target="_blank">練習筆記 JavaScript30</a>
      </h2>
      <h4>線上課程的學習記錄 & 習作</h4>
      <img src="https://camo.githubusercontent.com/13a16597bc17b350b043e30ab701082fc276d3c4/68747470733a2f2f6a61766173637269707433302e636f6d2f696d616765732f4a53332d736f6369616c2d73686172652e706e67" alt="">
      <p>
          線上課程 JavaScript30 三十天的課程。<br />
          每一天都記錄在 github 上, 大約三週結束整個課程。<br />
          收獲: 對學習 JavaScript 和 ES6 之間的差異與 ES6 語法的掌握有非常大的幫助。<br />
          練習使用 Web 技術呼叫手機的senso做練習。<br />
          ex: 指南針、語音輸入、語音輸出...等有趣的互動內容。
      </p>
  </div>
  <div class="exercise htmlcss javascript webFrontEnd">
      <h2>
          <a href="##"></a>
          <a href="https://dwatow.github.io/Web-Front-End-Prototype/" target="_blank">習作 網頁前端</a>
      </h2>
      <h4>進行案子中, 製作的 Propertype </h4>
      <p>對於不熟的技術, 或者沒有組合過的套件, 會先以 Property 的方式進行研究, 一來進行技術評估, 二來可以學到有趣的組合經驗。在設計思考的流程中, 說 Property 是一種找到解答就要丟掉的垃圾, 但是我覺得留下來展示也是不錯的選擇。</p>
  </div>
  <div class="pullRequest javascript">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/hexojs/hexo/pull/2612" target="_blank">Hexo - sel code block line number #2612</a>
      </h2>
      <h4>修改 Open Source Project</h4>
      <p>
          Github flow, Js unit test, CI<br />
          將 hackmd 的這個功能移植到 hexo 上。<br />
          因為是 hackmd 的愛用者, hexo 剛好也使用 markdown 撰寫, 所以就想把 hackmd 當作 hexo 的編輯環境。<br />
          在 hexo 設定「文章裡的程式碼行號」的方式, 以往只能在 config 檔設定<br />
          而 hackmd 可以每個區塊使用語法設定。<br />
          <br />
          過程看了 hexo 的 source code, 也看了 hackmd 的 source code。<br />
          也問了 hackmd 的作者, 感謝他的細心引導讓我可以順利的找到我想參考的程式碼。
      </p>
  </div>
  <div class="javascript canvas webFrontEnd">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/ImageBinarization" target="_blank">病理切片 影像處理 二值化演算法</a>
      </h2>
      <h4>前端技術處理影像處理</h4>
      <p>
          使用 Canvas 可以在 JavaScript 控制二進制資料。就可以寫影像處理演算法。<br />
          業主是一名博班生, 做了醫學方面的研究。希望有程式工具可以幫助快速獲得研究數據。
      </p>
  </div>
  <div class="devops cpp mfc csharp">
      <h2>團隊導入敏捷開發工具</h2>
      <h4>DevOps</h4>
      <img src="https://i.imgur.com/hC0ZA9P.png" alt="">
      <p>
        導入 git ，工作流程使用 git flow <br />
        導入 wiki, bug tracker(上面那個扳手)、gitweb。<br />
        導入 C++ 單元測試，使用 Cppunit<br />
        用 Jenkins 建立持續整合，建立一個「只要提交程式碼就可以看見結果」的循環，並且可以產生報表或回饋錯誤。
      </p>
  </div>
  <div class="python">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/MockKgsDataObjectGenerator" target="_blank">ORM generator for unit test mock</a>
      </h2>
      <h4>XML to C++ Code with python</h4>
      <p>
          使用 python 讀取 XML 檔案, 產生 C++ 的 Mock ORM。提供後端程式 (以 C++ 實作) 的 CppUnit 編譯。
      </p>
  </div>
  <div class="csharp msOfficeTypeLib package">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/xlsf_with_C_sharp" target="_blank">套件實作 xlsf with C#</a>
      </h2>
      <h4>呼叫原生的 Excel Type library 使用 C#</h4>
      <p>
          學習 C# 的物件封裝練習, 過去曾經寫過相同的題目, 用 MFC (C++) 的技術實作。
      </p>
  </div>
  <div class="django python exercise webBackEnd">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/LaidBackHabitat" target="_blank">習作 網站後端 訂房系統 </a>
      </h2>
      <h4>python 的後端 framework 的專題實作</h4>
      <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/Django_logo.svg" alt="">
      <p>
          挑了一個主流的弱型別語言, 挑了它的後端框架, 挑了一個題目「訂房系統」做練習。<br />
          練習撰寫敏捷開發的 End-to-End 的 Story
      </p>
  </div>
  <div class="csharp webFrontEnd">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/MsgDemoSilverlight" target="_blank">網站後端 XML傳輸 API測試工具</a>
      </h2>
      <h4>C++ 後端程式的週邊工具系列 - 傳送 XML 給後端程式 (C++) 的小工具。</h4>
      <img src="https://i.imgur.com/5h5Qh6E.jpg" alt="" class="">
      <p>
          用 Silverlight (C#) 寫一個像是 Postman 的工具
          Story: <br />
          1. 工程師可以傳送訊息給後端觸發 API 的程式。<br />
          2. 工程師可以比對兩次 Response 的 XML
      </p>
  </div>
  <div class="python desktopApp">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/logAnalysis" target="_blank">網站後端 XML傳輸 效能分析</a>
      </h2>
      <h4>C++ 後端程式的週邊工具系列 - Log 的 Parser</h4>
      <p>
          依 Log 的格式分析每次 Request 到 Response 的時間。
      </p>
  </div>
  <div class="csharp bspline desktopApp">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/BSpline" target="_blank">習作 內插曲線演算法 BSpline</a>
      </h2>
      <h4>NURBUS 演用法</h4>
      <img src="https://raw.githubusercontent.com/dwatow/BSpline/master/main_dialog.png" alt="Alt text" style="max-width:100%;">
      <p>
          NURBUS、BSpline 都是一種平滑曲線的內插演算法。<br />
          透過 C# 實現 Windows 繪製曲線。
      </p>
  </div>
  <div class="django python exercise webBackEnd">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/mysite" target="_blank">習作 Django </a>
      </h2>
      <h4>python 的後端 framework 的習作</h4>
      <p>
          照著《It's Django》的實作
      </p>
  </div>
  <div class="python cpp exercise desktopApp">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/python_call_cpp_code" target="_blank">習作 python 呼叫 C++ API</a>
      </h2>
      <h4>python 呼叫 C++ 編譯的 dll檔</h4>
      <p>
          使用 python 3 呼叫。
      </p>
  </div>
  <div class="cpp">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/PluginDll" target="_blank">習作 C++寫dll檔</a>
      </h2>
      <h4>Boost C++ Libraries 的 Python 支援功能</h4>
      <p>
          用 Boost C++ Libraries 編譯成的 dll 檔。閱讀官網文件, 並且用 Visual Studio 2005 環境編譯。
      </p>
  </div>
  <div class="cpp mfc desktopApp">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/lottery" target="_blank">樂透模擬器 - 大樂透、威力彩</a>
      </h2>
      <h4>MFC (C++) 的亂數產生練習</h4>
      <img src="https://raw.githubusercontent.com/dwatow/lottery/master/main_dialog.png" alt="">
      <p>
          Windows 桌面的程式, 程式放上樂透彩 & 大樂透的 logo 以及演算法。<br />
          取亂數並且數字不重複。
      </p>
  </div>
  <div class="cpp mfc desktopApp">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/finder" target="_blank">假裝刪除硬碟檔案的惡作劇程式</a>
      </h2>
      <h4>MFC (C++) 的 Windows API 使用練習</h4>
      <img src="https://raw.githubusercontent.com/dwatow/finder/master/main_dialog.png" alt="">
      <img src="https://raw.githubusercontent.com/dwatow/finder/master/close_dialog_message.png" alt="">
      <p>
          取得磁碟檔案、資料夾的 API<br />實作遞迴函數<br />UI執行緒和運算執行緒分開。
      </p>
  </div>
  <div class="cpp desktopApp">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/fbSignIn" target="_blank">facebook 點名程式 (離線)</a>
      </h2>
      <h4>C++ 的讀檔、字串比對程式</h4>
      <p>
          對於自己生活上的需求而寫的程式。這也是後來跑去學 JS 的動機之一。JS 對於撰寫網路程式較為方便、快速開發、API支援度高。
      </p>
  </div>
  <div class="cpp designPattern exercise">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/DesignPatternExercise" target="_blank">習作 Design Pattern</a>
      </h2>
      <h4>大話設計模式的 C++ 版實作練習</h4>
      <p>
          與朋友一同進行讀書會, 並且依書中的練習所做的習作
      </p>
  </div>
  <div class="casdk cpp mfc desktopApp">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/Ca210Sample" target="_blank">Ca210Sample</a>
      </h2>
      <h4>CA-SDK 習作</h4>
      <p>
          依照 CA-SDK 的官方說明文件做的練習程式。
      </p>
  </div>
  <div class="casdk cpp mfc desktopApp">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/ColorEyeI" target="_blank">ColorEyeI</a>
      </h2>
      <h4>CA-SDK 應用開發</h4>
      <img src="https://1.bp.blogspot.com/-GjPVRjTVuIM/UbbYjjkEyNI/AAAAAAAAFFw/dnD7uqB0XZ4/s640/msring.jpg" alt="">
      <img src="https://2.bp.blogspot.com/-dVUraxXFa-Y/UbqETSjZAXI/AAAAAAAAFHM/2Szw5b9C1NU/s640/msr_RB9.jpg" alt="">
      <p>
          第一個接近產品程式的作品，詳細介紹，可以至<a href="https://casdkapp.blogspot.tw/">專用介紹 Blog</a><br />
          第二次開發 CA-210 的應用程式。人月神話說的「 第二系統效應」沒有發生；學習軟體產品開發流程的專案<br />
          運用三角函數可以量測各種模組尺寸。<br />
          最快量測演算法，量測時間大幅降低<br />
          UI設計改版, 教育訓練成本大幅降低。
      </p>
  </div>
  <div class="cpp mfc msOfficeTypeLib">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/xls2oul" target="_blank">from Excel to Outlook 寄信</a>
      </h2>
      <h4>呼叫原生的 Outlook & Excel Type library 使用 MFC (C++)</h4>
      <p>
          一個方便同事將 Excel 裡的 email url 用 Outlooko 寄送通知的程式。
      </p>
  </div>
  <div class="cpp mfc msOfficeTypeLib package">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/xlsf_with_MFC" target="_blank">套件實作 xlsf with MFC</a>
      </h2>
      <h4>呼叫原生的 Excel Type library 使用 MFC (C++)</h4>
      <p>
          用於 Sword & ColorEyeI 的儀器量測後, 將量測資料輸出成 Excel(不是csv) 檔案<br />
          並且將表格的格線、顏色, 用 C++ 控制 Excel 繪製出來。
      </p>
  </div>
  <div class="casdk cpp mfc desktopApp">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/CASDK-Z" target="_blank">CASDK-Z</a>
      </h2>
      <h4>CA-SDK 應用開發</h4>
      <p>
          CA-SDK 所有的功能展示, 做得像是 CPU-Z 。將儀器的參數抓出來顯示的 Demo 程式。
      </p>
  </div>
  <div class="casdk cpp mfc desktopApp">
      <h2>
          <a href="##"></a>
          <a href="https://github.com/dwatow/Sword" target="_blank">Sword</a>
      </h2>
      <h4>CA-SDK 應用開發</h4>
      <p>
          第一次開發 CA-210 的應用程式。應用於液晶顯示器出貨時的彩色分析儀的程式。<br />
          軟體產品開發流程、量測規則的核心演算法、運用三角函數
      </p>
  </div>
</div>

<script>
  $(document).ready(function () {
      filter('all');
  })
  $('.labels').on('click', 'li', function (e) {
    filter(this.id)
  })

  function filter(label_id) {
    if (label_id != "all") {
      $('.works > div').removeClass('show');
      $('.works > div').addClass('hidden');

      $(`.${label_id}`).removeClass('hidden');
      $(`.${label_id}`).addClass('show');
    }
    else {
        // show all
      $('.works > div').removeClass('hidden');
      $('.works > div').addClass('show');
    }
    $('.works').masonry('layout');
  }
</script>

<script type="text/javascript">
    var masonry = $('.works').masonry({
        // options
        itemSelector: '.works > div',
        columnWidth: '.works > .show'
    });

    $('#view_switch').on('click', function () {
        $('.works').masonry('layout');
    })
</script>
