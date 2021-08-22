---
title: 繁中字體 Demo
date: 2018-01-16 22:28:20
tags:
- cloud fonts
- google
categories:
- 工具使用
---

# 繁中字體 Demo

## Google font

### 正式版

<style media="screen">
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TCdisplay=swap');
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC&display=swap');
    .font-demo {
        font-size: 50px;
        line-height: 1.2em;
    }
    .NotoSan {
        font-family: 'Noto Sans TC', sans-serif;
    }

    .NotoSerif {
        font-family: 'Noto Serif TC', serif;
    }
</style>


<div class="font-demo NotoSan">黑體</div>
<div class="font-demo NotoSerif">明體</div>

### Early Access 版
https://fonts.google.com/earlyaccess

<link href="https://fonts.googleapis.com/earlyaccess/cwtexkai.css" rel="stylesheet" />
<link href="https://fonts.googleapis.com/earlyaccess/cwtexyen.css" rel="stylesheet" />
<link href="https://fonts.googleapis.com/earlyaccess/cwtexfangsong.css" rel="stylesheet" />
<link href="https://fonts.googleapis.com/earlyaccess/notosanstc.css" rel="stylesheet" />
<link href="https://fonts.googleapis.com/earlyaccess/cwtexming.css" rel="stylesheet" />

<style media="screen">
    .cwtexkai {
        font-family: 'cwTeXKai', serif;
    }

    .cwTeXYen {
        font-family: 'cwTeXYen', sans-serif;
    }

    .cwTeXFangSong {
        font-family: 'cwTeXFangSong', serif;
    }

    .cwTeXMing {
        font-family: 'cwTeXMing', serif;
    }
</style>

<div class="font-demo cwtexkai">楷體</div>
<div class="font-demo cwTeXYen">圓體</div>
<div class="font-demo cwTeXFangSong">仿宋體</div>
<div class="font-demo cwTeXMing">明體</div>

### Google Fonts 預先發表的中文字體
預先發表字體: https://github.com/googlefonts/chinese/tree/gh-pages

<!-- <link href="https://googlefonts.github.io/chinese/styles.css" rel="stylesheet" /> -->

<style media="screen">

/* Seto Font */
@font-face {
  font-family: 'Seto Font';
  src: url('https://googlefonts.github.io/chinese/fonts/seto/Seto-Regular.woff2') format('woff2'); /* IE9 Compat Modes */
  font-weight: 400;
  font-style: normal;
}

/* GenJyuuGothic */
@font-face {
  font-family: 'GenJyuuGothic';
  src: url('https://googlefonts.github.io/chinese/fonts/genjyuugothic/GenJyuuGothic-Regular.woff2') format('woff2'); /* IE9 Compat Modes */
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Hana Min';
  src: url('fonts/hanamin/HanaMin-Regular.woff2') format('woff2'); /* IE9 Compat Modes */
  font-weight: normal;
  font-style: normal;
}
    .font-setofont {
        font-family: 'Seto Font', sans-serif;
    }
    .font-genjyuugothic {
        font-family: 'GenJyuuGothic';
    }
    .font-hanamin {
        font-family: 'Hana Min';
    }
</style>

<div class="font-demo font-setofont">瀨戶字型 Seto Font</div>
<div class="font-demo font-genjyuugothic">思源柔黑體 Gen Jyuu Gothic </div>
<!-- <div class="font-demo font-hanamin">花園明朝體 Hana Min</div> -->

## github 開源專案

<style media="screen">
    .TaiwanPearl {
        font-family: 'TaiwanPearl-Regular', serif;
    }
    @font-face {
        font-family: TaiwanPearl-Regular;
        src: url(https://cdn.jsdelivr.net/gh/max32002/TaiwanPearl@2.125/webfont/TaiwanPearl-Regular.woff2) format("woff2"),
            url(https://cdn.jsdelivr.net/gh/max32002/TaiwanPearl@2.125/webfont/TaiwanPearl-Regular.woff) format("woff");
    }
</style>

https://github.com/max32002/TaiwanPearl
<div class="font-demo TaiwanPearl">台灣圓體 TaiwanPearl</div>



## 其它

- https://github.com/ButTaiwan
- https://dorawei.xyz/free-chinese-web-font/
    - https://typesquare.com/zh_tw/
    - https://fonts.adobe.com/?ref=tk.com