---
title: Docker 指令們
date: 2017-10-26 12:11:42
tags: 
- docker
categories: 
- 工具使用
---

# Docker 指令們

## docker 指令

- `version`
  Show the Docker version information
  顯示 Docker 版本信息

### 還沒搞懂

- `events`
  Get real time events from the server
  取得伺服器中的真實時間事件
- `info`
  Display system-wide information
  顯示系統範圍的信息
- `inspect`
  Return low-level information on Docker objects
  印出 Docker 物件的底層資訊

## docker to image

## Image 指令

### 建立

- `build`
  Build an image from a Dockerfile
  從一個 Dockerfile 建置一個 image
- `commit`
  Create a new image from a container's changes
  從一個 container(的變動)建立一個新的 image
- `search`
  Search the Docker Hub for images
  Hub 獲取 image

### 操作

- `import`
  Import the contents from a tarball to create a filesystem image
  導入 tar 壓縮檔的內容，建立檔案系統映 image
- `load`
  Load an image from a tar archive or STDIN
  從 tar 存檔或`STDIN`加載 image
- `save`
  Save one or more images to a tar archive (streamed to STDOUT by default)
  將一個或多個 image 保存到 tar 存檔（默認情況下流式傳輸到 STDOUT）

### 查詢

- `history`
  Show the history of an image
  顯示 image 的歷程
- `images`
  List images
  列出 images

### 刪除

- `rmi`
  Remove one or more images
  刪除一個或多個 image

## docker to contanter

### 建立

- `create`
  Create a new container
  建立一個新的 container

### 查詢

- `ps`
  List containers
  列出 container
- `rename`
  Rename a container
  重命名 container

### 修改

- `update`
  Update configuration of one or more containers
  更新一個或多個 container 的 config
- `export`
  Export a container's filesystem as a tar archive
  將 container 的檔案系統另存成 tar 檔

### 刪除

- `rm`
  Remove one or more containers
  移除一個或多個 containers

## running Container 指令

### 開啟

- `start`
  Start one or more stopped containers
  啟動一個或多個停止的 containers
- `restart`
  Restart one or more containers
  重新啟動一個或多個 containers

### 操作

- `attach`
  Attach local standard input, output, and error streams to a running cotainer
  連結本機的 standard input, output, and error streams 到正在運行的 container
- `exec`
  Run a command in a running container
  在執行中的 container 中執行指令
- `cp`
  Copy files/folders between a container and the local filesystem
  在 container 和本機系統之間複製檔案或資料夾
- `pause`
  Pause all processes within one or more containers
  暫停一個或多個 container 內的所有進程
- `port`
  List port mappings or a specific mapping for the container
  列出端口映射或 container 的特定映射

### 檢視

- `diff`
  Inspect changes to files or directories on a container's filesystem
  檢查 container 內的系統中，檔案或目錄的變更
- `logs`
  Fetch the logs of a container
  獲取 container 的 log

### 關閉&停止

- `kill`
  Kill one or more running containers
  關閉一個或多個運行 container
- `stop`
  Stop one or more running containers
  停止一個或多個運行 container
- `unpause`
  Unpause all processes within one or more containers
  取消暫停一個或多個 container 內的所有工作(process)

### 顯示

- `stats`
  Display a live stream of container(s) resource usage statistics
  顯示 container 的即時資源使用統計資訊
- `top`
  Display the running processes of a container
  顯示 container 的工作(process)管理員

### 還沒搞懂 好像和 container 有關

- `wait`
  Block until one or more containers stop, then print their exit codes
  阻止一個或多個 container 停止，然後打印出口代碼
- `update`
  Update configuration of one or more containers
  更新一個或多個 container 的 config- `deploy`
  Deploy a new stack or update an existing stack
  部署新的堆疊或更新現有堆疊

## 登錄

- `login`
  Log in to a Docker registry
  登錄 Docker 註冊表
- `logout`
  Log out from a Docker registry
  從 Docker 註冊表中註銷
- `pull`
  Pull an image or a repository from a registry
  從註冊表中拉出圖像或存儲庫
- `push`
  Push an image or a repository to a registry
  將圖像或存儲庫推送到註冊表

## Tag

- `tag`
  Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
  建立一個 tag TARGET_IMAGE 參考到 SOURCE_IMAGE
