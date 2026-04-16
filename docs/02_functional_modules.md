# 02 - 核心功能模組細節規格書

## 1. 會員系統 (Identity & Access)

- **角色定義：**
  - `STUDENT`: 一般學員，僅能預約。
  - `COACH`: 教練，可設定個人排程、管理學生。
  - `ADMIN`: 平台管理者，管理教練、審核訂單。
- **登入流程：**
  - **統一身分驗證：** 使用 Firebase Authentication 作為唯一的身分驗證入口。
  - **支援登入方式：**
    - Email / Password (Firebase 管理密碼加密)
    - Google OAuth 2.0 (Firebase 內建 Provider)
    - LINE Login (透過後端 Firebase Custom Token)
    - OTP 手機驗證 (後端自研：Redis 儲存隨機 6 位數碼，支援高可用性驗證)
  - **後端驗證：** NestJS 使用 `firebase-admin` 驗證前端傳來的 Firebase ID Token，並自動建立/關聯本地 User 記錄。
- **註冊必填資訊：** 姓名、手機、主要語系、滑雪程度 (SB/SKI/等級)。

## 2. 課程管理 (Course Management)

- **教練排程 (Coach Calendar)：**
  - 教練可於日曆介面設定「開放預約時段」。
  - 支援重複週期設定（例如：每週一、三開放）。
- **課程分類：**
  - **一對一課：** 單一教練對單一學員。
  - **團體課：** 設有最高人數上限（例如：4人滿班）。
  - **營隊課程：** 連續多日的固定行程。

## 3. 預約流程 (Booking Engine)

- **步驟一：** 選擇課程與雪場。
- **步驟二：** 選擇日期與教練。
- **步驟三：** 確認預約。
- **步驟四：** **名額鎖定 (Locking)：**
  - 後端採用 **Redis 分散式鎖** 防止並行衝突。
  - 資料庫使用 **樂觀鎖 (Version Control)** 雙重確保剩餘名額正確。
  - 暫時鎖定 10 分鐘，等待付款。
- **步驟五：** TapPay 金流支付 (Pay-by-Prime)。
- **步驟六：** 支付成功觸發電子發票開立與通知。

## 4. 訂單管理 (Order Lifecycle)

- **訂單號生成規則：** `YYYYMMDD` + `RANDOM_STRING` (例如: `20240414ABC123`)。
- **退改機制：**
  - 7天前取消：100% 退款。
  - 3-6天前取消：50% 退款。
  - 48小時內取消：不予退款。
- **退款邏輯：** 全自動 Tappay 退款 API 串接。
