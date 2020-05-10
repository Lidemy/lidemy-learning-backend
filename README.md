## 簡介

這是 Lidemy 學習系統後端原始碼，採用 Express + Sequelize 開發。

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

接著請複製`.env.example`並改名成`.env`，並且設置裡面的環境變數：

1. FIREBASE_DB_URL
2. REGISTER_CODE
3. SLACK_WEBHOOK_URL

最後 `npm install` 即可。

### 開發

1. `npm run dev`

### 部署

1. `npm run pm2`
