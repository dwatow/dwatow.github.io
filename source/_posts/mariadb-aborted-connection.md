---
title: Mariadb 的 Docker 會 Aborted connection
date: 2019-04-16 09:57:48
tags: 
- pm2
- nodejs
- docker
- sequelize
- express
categories: 
- 工具使用
---

# Mariadb 的 Docker 在每次寫入會 Aborted connection

## 執行環境

node.js + express
pm2
docker

## 出錯描述

送出寫入資料庫，就出現錯誤

```bash
web_1    | backend-system-API-0  | Executing (743fe5ec-04ba-4c3b-8f8f-6d945bba7681): INSERT INTO (資料庫寫入指令);
web_1    | backend-system-API-0  | Executing (743fe5ec-04ba-4c3b-8f8f-6d945bba7681): INSERT INTO (資料庫寫入指令);
web_1    | backend-system-API-0  | POST /api/v2/daily-report/ 200 1421.081 ms - -
web_1    | backend-system-API-0  | Executing (743fe5ec-04ba-4c3b-8f8f-6d945bba7681): COMMIT;
maria_1  | 2019-04-02  3:09:32 139959498872576 [Warning] Aborted connection 12 to db: 'backend-system' user: (帳號) host: (IP) (Got an error reading communication packets)
maria_1  | 2019-04-02  3:09:32 139959499175680 [Warning] Aborted connection 11 to db: 'backend-system' user: (帳號) host: (IP) (Got an error reading communication packets)
maria_1  | 2019-04-02  3:09:32 139959595984640 [Warning] Aborted connection 9 to db: 'backend-system' user: (帳號) host: (IP) (Got an error reading communication packets)
```

### 錯誤訊息:

```bash
Aborted connection 12 to db
```

## 解決方案

在 **ecosystem.config.js** 加這行

```javascript
 ignore_watch: ['node_modules', 'db'],
```

整個檔案

```javascript=
module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: "backend-system-API",
      script: "bin/www",
      max_restarts: 1,
      autorestart: false,
      watch: true,
      ignore_watch: ["node_modules", "db"],
      env: {
        NODE_PATH: "."
      }
    }
  ]
};
```

## 根本原因

db 資料夾，在 `INSERT` 時會自動更新
所以 pm2 就自動啟動了，造成出錯。

設定 pm2 忽略 watch 資料夾

- node_modules,
- db
