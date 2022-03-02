---
title: 瀏覽器下載 ZIP 檔案
date: 2022-03-02 15:07:21
tags: 
- zip
- 前端
- 下載
categories:
- 技術練習
---

# 瀏覽器下載 ZIP 檔案

後端發送 API，只提供資料的情況，是否可以由前端實作檔案轉換與下載。
可以避免後端因為請求而生成太多「免洗筷檔案」造成空間不足。

該怎麼做呢？

## 選用套件

**zip.js**

一開始選用 [zip.js](https://gildas-lormeau.github.io/zip.js/) 因為看起來功能強大，網頁上的 Demo 也正常運作，應該沒問題吧！
但是因為它本身看起來對 webpack 4 的支援度不高，可惜我用的 vue-cli 正是 webpack 4 所以卡在 import.mata 的問題過不去。
所以就放棄使用。

加上它檔案大小太大，測試時光載入網頁就滿花時間的，所以就更加不考慮使用了。

**zip-downloader**

因為 [zip-downloader](https://www.npmjs.com/package/zip-downloader) 體積小 (相對前一個套件)，網頁載入速度快。
但是安裝之後無法順利使用，我有遇到套件相依性的[問題](https://github.com/ghostCoder/zip-download/issues/1)。可以參考它的第一個 bug 由於我的英文寫作造詣有限，所以我把我的步驟寫在上面，包含其中一個步驟遇到的錯誤訊息。

**jszip**

最後選用 [jszip](https://stuk.github.io/jszip/)
簡單明瞭，因為 zip-downloader 是相依性問題，就看一下它本身是用什麼套件處理 zip 檔案。
最後在它的 sample code 改寫之下，順利執行。所以就選用這一個。

## 使用

看[這一篇文件](https://stuk.github.io/jszip/documentation/examples.html)就足以上手了。

安裝

```
$ npm install jszip
```

在 vue 專案

**/utility/downloadZip.js**

由於，使用 ZIP 我只需要兩個功能
所以在 utility 需要重新我在這個專案中的包裝用法，提供專案中的程式碼使用。
避免曝露設定套件與使用時大量重複的程式碼。

1. 加入檔案，在這裡它原本的 API 就提供了包含目錄的檔案路徑，非常貼心，所以就延用它原本的 API 參數重新包裝。
2. 下載檔案，將前述準備好的檔案與目錄，打包成 zip 檔案。
    - 其中 `for browser` 那一段是因為瀏覽器的 FileAPI 而實作的，若執行的宿主環境改變，這一段可以改寫成其它適合的程式碼


```javascript
import JSZip from 'jszip';
// usage document
// https://stuk.github.io/jszip/documentation/examples.html

// create an instance of JSZip
const zip = new JSZip();

function addFile(pathFilename, content) {
  // create a file
  console.log('add file', pathFilename, content);
  zip.file(pathFilename, content);
  // const img = zip.folder('images');
  // img.file('smile.gif', imgData, { base64: true });
}

async function download(filename = 'downloadFile.zip') {
  // generate a zip file
  const blob = await zip.generateAsync({ type: 'blob' });
  if (blob.size < 25) throw new Error('nothing in zip file');
  
  // for browser
  const blobURL = URL.createObjectURL(blob);
  if (blobURL) {
    const anchor = document.createElement('a');
    const clickEvent = new MouseEvent('click');
    anchor.href = blobURL;
    anchor.download = filename;
    anchor.dispatchEvent(clickEvent);
  }
  return {
    message: 'generate zip file is success',
    url: blobURL
  };
}

export default {
  addFile,
  download
};
```

在某個 component 裡使用時...

```javascript
import zip from '@/utility/downloadZip';

zip.addFile('file_name', 'file_content');
zip.download('zip_file_name');
```

這樣就可以簡單的實現 zip 下載檔案啦！
