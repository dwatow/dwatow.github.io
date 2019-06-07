---
title: 前端的 File API
date: 2019-05-22 10:20:22
tags: ["file api", "JavaScript"]
categories: "技術練習"
---

<style media="screen">
  img {
    width: 200px;
    height: auto;
  }
  button {
    display: block;
  }
</style>

# 前端的 File API

這一次會將一些與檔案讀寫相關的 JavaScript 與 HTML 一起聊一聊。
而這次會用上的 HTML 都有一個共同的特性，那就是「它們本身代表內容」，但 `<textarea>` 除外

**「HTML tag 本身代表內容」的特殊之處**

無法使用偽元素。

因為偽元素是用來修飾容器中的內容的頭尾，若 HTML tag 本身就是內容，就沒有「內容的頭尾」這件事。自然也就不會有偽元素。
所以這些 HTML tag 都會自我結尾。

**前端 File API**

有幾個要先知道的[^w3.org-file-api]

- File & Blob: File 是一個有名字的 Blob
- FileList: 以 File 為元素的 List，但它並不是 Array
- FileReader: 用來讀取 File 的內容
  - 分成同步和非同步，2 種方式
  - 可將檔案轉成四種資料
    1. 文字
    2. 二進制陣列 (建議)
    3. 二進制字串 (不建議)
    4. Data URL (blob url)
- URL: 用來將 File 使用在其它的 Web 環境中 (包含 DOM tree)

## 從 FileList 取得 File

<p>
<form method="post" action="upload" name="myForm" enctype="multipart/form-data">
<input type="file" name="myUploadFile" />
</form>
</p>

宣告一個讓瀏覽器讀取檔案的「通道」而 DOM tree 上的 `<input type="file" />` 其實是一個「檔案列表」的管理控制項

```html
<form method="post" action="upload" name="myForm" enctype="multipart/form-data">
  <input type="file" name="myUploadFile" />
</form>
```

在 `<form>` 使用 `name` 屬性，像是宣告一樣的直接在 `document` 裡產生 property

```javascript
const inputFile = document.myForm.myUploadFile; // <input type="file" name="myUploadFile" />
inputFile.files; // File List
inputFile.files.item(0); // File of File List
```

### 從 File 下載

<p>
<a id="downloadFileAnchor" href="##">download File</a>
<button id="downloadFileButton" type="button" name="button">download File</button>
</p>

利用 `<a href="" />` 將檔案轉成 blob url 放到 `href` 並且點擊，就可以完成下載 blob 檔案的功能。

```html
<button id="downloadFileButton" type="button" name="button">download File</button>
```

```javascript
const downloadFileButton = document.querySelector("#downloadFileButton");
downloadFileButton.addEventListener("click", e => {
  const anchor = document.createElement("a");
  anchor.href = uploadFile.getBlobUrl();
  // anchor.target = '_blank';  // Chrome 測試，非必要
  anchor.download = "new_" + uploadFile.filename();
  anchor.click();
});
```

1. 取得檔案的 blob url
2. 設定 `<a href="" />` 的 `href` 設定成 blob url
3. 觸發 click 事件。 (如果已使用 a 的 click 進行這一連串的動作，就不用再觸發一次 click)

## File to Image

<p>
<button id="showImgButton" type="button" name="button">File to image</button>
<img id="image" src="" alt="" />
</p>

在想要做上傳圖片的預覽時，就需要將 `<input type="file" />` 的內容，放到 `<img src="" />` 裡。
那實際上是怎麼做到的呢？

```html
<img id="image" src="" alt="" />
```

```javascript
const inputFile = document.myForm.myUploadFile; // 要先有 <input type=file />
const img = document.querySelector("#image");

const oneFile = inputFile.files.item(0);
blob_url = URL.createObjectURL(oneFile);
img.src = blob_url;
```

1. 取出 File
2. 產生 Blob url
3. img.src = Blob url

### Image to Canvas

<button id="showCanvasButton" type="button" name="button">img to canvas</button>
<canvas id="canvas" width="200" height="10" />

image 到 canvas 算是 canvas 的特別之處，不算是 File API 的內容。 (不過還是放上來了)
繪製到 canvas 之後，會改變 image 的大小。

```html
<canvas id="canvas" width="200" height="10" />
```

```javascript
const img = document.querySelector("#image"); // 要先有 <image />
const canvas = document.querySelector("#canvas");
(canvas.width = img.width), (canvas.height = img.height);

const ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0, img.width, img.height); // 重新繪製大小
```

1. 取得 image object (也可以用 `new Imgae()`)
2. 將 image object 丟進 canvas 的 `context.drawImage()` 第一個參數，就顯示畫面

### Canvas as Base64

<button id="showBase64Button" type="button" name="button">canvas to base64</button>
<textarea id="base64" name="name" rows="8" cols="80"></textarea>

`canvas.toDataURL()` 的輸出是一個至少還有 "data:" 的 `DataURL`[^canvas-todataurl-return]

> DataURL 依照 MIME type 判斷輸出方式
> 如果是文字，就會輸出文字，不然就會給 Base64[^data-urls]

<!-- prettier-ignore-start -->
[^data-urls]: [Data URLs - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)

[^canvas-todataurl-return]: [HTMLCanvas​Element​.toDataURL() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL#Return_value)
<!-- prettier-ignore-end -->

```html
<textarea id="base64" name="name" rows="8" cols="80"></textarea>
```

```javascript
const canvas = document.querySelector("#canvas"); // 要先有 <canvas />
// const ctx = canvas.getContext('2d');
// ctx.drawImage(img, 0, 0, img.width, img.height);

const base64 = document.querySelector("#base64");
base64.value = canvas.toDataURL("image/jpeg");
```

## File to Base64

上述得到 Base64 的方式是要透過 File -> Blob URL -> `<img>` -> `<canvas>` -> Base64
可以直接得到 Base64 嗎？

## File to text

<button id="showTextButton" type="button" name="button">File as text</button>
<textarea id="text" name="name" rows="8" cols="80"></textarea>

直接從 File 取得「文字檔案」的內容，要使用 FileReader 物件的 readAsText 方法，並且 binding 事件，在讀取結束時，取得檔案內容 (還可以取得其它的資訊)。

```html
<textarea id="text" name="name" rows="8" cols="80"></textarea>
```

```javascript
const text = document.querySelector("#text");
const reader = new FileReader();
reader.onload = function(e) {
  text.innerText = e.target.result;
};

const inputFile = document.myForm.myUploadFile;
const oneFile = inputFile.files.item(0);
blobUrl = URL.createObjectURL(oneFile);
reader.readAsText(blobUrl, "UTF-8");
```

1. 宣告 FileReader 物件
2. 設定 onload 事件，用 `e.target.result` 取得內容
3. 取得 File 物件的 Blob url
4. 將 Blob url 放進 FileReader 物件的 `readAsText` method

## File to binary

<button id="showBinaryStringButton" type="button" name="button">File as binaryString</button>
<textarea id="binaryString" name="name" rows="8" cols="80"></textarea>

直接從 File 取得「圖形檔案」的內容，要使用 FileReader 物件的 readAsArrayBuffer 方法，並且 binding 事件，在讀取結束時，取得檔案內容。

```html
<textarea id="binaryString" name="name" rows="8" cols="80"></textarea>
```

```javascript
const binaryString = document.querySelector("#binaryString");
const reader = new FileReader();
reader.onload = function(e) {
  binaryString.innerText = JSON.stringify(
    new Uint8Array(e.target.result).join(", ")
  );
};

const inputFile = document.myForm.myUploadFile;
const oneFile = inputFile.files.item(0);
blobUrl = URL.createObjectURL(oneFile);
reader.readAsArrayBuffer(blobUrl);
```

1. 宣告 FileReader 物件
2. 設定 onload 事件，用 `e.target.result` 取得內容
3. 圖形檔案的資料是 0~255 (8 bit 的大小)，所以用 `new Uint8Array` 將內容丟進去建構。[^typed_arrays]
4. 取得 File 物件的 Blob url
5. 將 Blob url 放進 FileReader 物件的 `readAsArrayBuffer` method

## 最後

程式碼會同步在 github 更新[^web-file-api]


<!-- prettier-ignore-start -->
[^typed_arrays]: [Typed_arrays](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Typed_arrays#%E7%B7%A9%E8%A1%9D%E8%88%87%E8%A6%96%E5%9C%96%EF%BC%9A%E5%9E%8B%E5%88%A5%E9%99%A3%E5%88%97%E7%9A%84%E6%9E%B6%E6%A7%8B)
[^w3.org-file-api]: [File API - w3.org](https://www.w3.org/TR/FileAPI/)
[^web-file-api]: [File API Exercise](https://www.github.com/dwatow/web-file-api/)
<!-- prettier-ignore-end -->

<script src="https://dwatow.github.io/web-file-api/public/uploadFile.js" charset="utf-8"></script>
<script src="https://dwatow.github.io/web-file-api/public/text.js" charset="utf-8"></script>
<script src="https://dwatow.github.io/web-file-api/public/image.js" charset="utf-8"></script>
<script src="https://dwatow.github.io/web-file-api/public/canvas.js" charset="utf-8"></script>
<script src="https://dwatow.github.io/web-file-api/public/base64.js" charset="utf-8"></script>
<script src="https://dwatow.github.io/web-file-api/public/binaryString.js" charset="utf-8"></script>
<script src="https://dwatow.github.io/web-file-api/public/blodurl.js" charset="utf-8"></script>
<script src="https://dwatow.github.io/web-file-api/public/main.js" charset="utf-8"></script>
