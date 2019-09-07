## 簡介

Lidemy 學習系統 Back-end 原始碼，

## 建置

### 前置作業

1. 根據 [Firebase](https://firebase.google.com/docs/admin/setup) 官方文件產生 JSON 設定檔，放到 `config/firebase.json`
2. 新增 `config/config.json`，格式為：

``` js
{
  "development": {
    "username": "",
    "password": "",
    "database": "",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "",
    "password": "",
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "",
    "password": "",
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

```

接著還有兩個環境變數需要設置，一個是 FIREBASE_DB_URL，或也可以直接更改 `utils/firebase.js`。另一個是 middwares/auth.js 裡的 `REGISTER_CODE`，預設為 TEST。

最後 `npm install` 即可。

### 開發

1. `npm run dev`
2. `REGISTER_CODE=123 FIREBASE_DB_URL=xxx npm run dev` （如果要設置環境變數的話）