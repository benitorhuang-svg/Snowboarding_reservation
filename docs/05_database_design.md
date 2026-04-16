# 05 - 資料庫設計原則與 Schema 規格書 (V2.0)

## 1. 基礎原則 (Database Principles)

- **資料庫引擎：** InnoDB，確保支援資料庫交易 (Transaction) 完整性。
- **字符集：** `utf8mb4` (完整支援 Emoji 與多國語系字元)。
- **時區規範：** 資料庫內部統一使用 `UTC` 儲存，應用程式層根據 User 語系/地區進行動態轉換。
- **命名規範：** 小寫蛇形命名法 (`snake_case`)。

---

## 2. 核心模組設計邏輯 (Core Module Logic)

### 1. 教練開課 (動態庫存管理)

在預約系統中，庫存即為**「教練的時間」**。

- **邏輯設計：** 教練可設定「可預約時段」(`coach_schedules`)，包含每週重複週期、特定日期、課程類型（1對1、團體班）及地點（不同雪場）。
- **工程挑戰：**
  - **防呆機制：** 系統必須在資料庫層面（或 Service 層）確保教練無法在同一時間段於不同地點開設課程（Overlapping Check）。
  - **時區處理：** 學生預約時顯示當地時區，後端儲存統一為 UTC，避免跨國預約（如台灣學生預約日本教練）時產生誤差。

### 2. 學員預約 (高併發與防衝突)

- **邏輯設計：** 學生選擇時段後，系統需暫時「鎖定」名額（如 10 分鐘），等待結帳。
- **工程挑戰：**
  - **防止超賣 (Double Booking)：** 採用**悲觀鎖 (Pessimistic Locking)** 或 **Redis 分散式鎖** 處理高併發下的名額扣減。確保在同一秒鐘多個請求進入時，只有先送出的請求能成功 `UPDATE` 剩餘名額。
  - **過期自動釋放：** 利用 Redis 過期事件或定時任務 (Cron Job) 釋放逾時未付款的鎖定名額。

### 3. 會員系統 (身分與權限控管)

- **邏輯設計：** 實作 **RBAC (Role-Based Access Control)**，包含 `ADMIN` (平台方)、`COACH` (教練)、`STUDENT` (學生) 三種角色。
- **工程挑戰：**
  - **安全性：** 密碼需經過 `Argon2` 或 `bcrypt` 加密儲存。
  - **第三方登入：** 需處理 Google/LINE OAuth2 流程，並將 OpenID 與本地 User 關聯。
  - **防機器人：** 登入/註冊接口需整合 Google reCAPTCHA 或速率限制 (Rate Limiting)。

### 4. 金流串接 - TapPay (支付與非同步驗證)

- **邏輯設計：** 使用 TapPay Cross-site 代碼化技術 (Tokenization)，前端獲取 `prime` 後傳給後端扣款，平台不接觸明文卡號。
- **工程挑戰：**
  - **Webhook 狀態同步：** 必須實作 Webhook 接收端處理 TapPay 發送的非同步通知。
  - **等冪性 (Idempotency)：** 確保同一個 Webhook 通知多次發送時，後端不會重複處理訂單狀態變更。

### 5. 電子發票串接 (台灣合規邏輯)

- **邏輯設計：** 結帳時需包含發票欄位：二聯式（個人）、三聯式（公司統編）、載具（手機/自然人憑證）、捐贈碼。
- **工程挑戰：**
  - **自動化開立：** 付款成功後自動呼叫發票平台 API (如 綠界、鯨躍)。
  - **退費連動：** 取消訂單時需處理「作廢發票」或「折讓單」邏輯，特別是跨月退費的折讓簽回流程。

### 6. 訂單管理 (狀態機與帳務核心)

- **邏輯設計：** 訂單狀態機 (`order_status`) 流程：`CREATED` -> `PENDING_PAYMENT` -> `PAID` -> `COMPLETED` / `REFUND_REQUESTED` -> `REFUNDED` / `CANCELLED`。
- **工程挑戰：**
  - **不可逆狀態流轉：** 嚴格限制狀態只能依照預定規則移動。
  - **財務報表：** 需設計優化的查詢結構，以便生成教練分潤報表與月度對帳單 (Export Excel/CSV)。

---

## 3. 核心實體關聯 (Schema Overview)

### Users (使用者)

| 欄位            | 類型    | 說明                       |
| :-------------- | :------ | :------------------------- |
| `id`            | UUID    | PK                         |
| `email`         | String  | Unique                     |
| `firebase_uid`  | String  | Firebase Auth UID (Unique) |
| `password_hash` | String? | 已棄用 (Firebase 管理密碼) |
| `role`          | Enum    | ADMIN, COACH, STUDENT      |
| `provider`      | String  | LOCAL, GOOGLE, LINE        |
| `language`      | String  | zh-TW, en, ja              |

### Coaches (教練資料)

| 欄位             | 類型   | 說明                       |
| :--------------- | :----- | :------------------------- |
| `id`             | UUID   | PK                         |
| `user_id`        | UUID   | FK -> Users                |
| `certifications` | JSON   | 證照清單 (SAJ, CASI, etc.) |
| `base_location`  | String | 主要駐點雪場               |

### CourseSessions (課表/庫存)

| 欄位           | 類型     | 說明                 |
| :------------- | :------- | :------------------- |
| `id`           | UUID     | PK                   |
| `coach_id`     | UUID     | FK -> Coaches        |
| `start_time`   | DateTime | 課程開始 (UTC)       |
| `end_time`     | DateTime | 課程結束 (UTC)       |
| `max_capacity` | Integer  | 最大人數 (1為個人課) |
| `booked_count` | Integer  | 已預約人數           |
| `location_id`  | String   | 雪場 ID              |

### Orders (訂單)

| 欄位                  | 類型    | 說明                            |
| :-------------------- | :------ | :------------------------------ |
| `id`                  | String  | 訂單編號 (YYYYMMDD+Random)      |
| `user_id`             | UUID    | FK -> Users                     |
| `total_amount`        | Decimal | 總金額                          |
| `status`              | Enum    | 狀態機狀態                      |
| `tappay_rec_trade_id` | String  | TapPay 交易序號                 |
| `invoice_number`      | String  | 發票號碼                        |
| `invoice_type`        | Enum    | 2-roll, 3-roll, Carrier, Donate |

---

## 4. 索引與效能優化 (Optimization)

- **時段查詢：** 為 `(coach_id, start_time, end_time)` 建立複合索引，優化行事曆讀取速度。
- **訂單追蹤：** 為 `(status, created_at)` 建立索引，加速管理後台的未付款追蹤。
- **高併發與並行控制：**
  - 使用 **Redis 分散式鎖 (Mutex)** 進行第一層流量攔截，防止大規模請求同時湧入。
  - 資料庫層採用 **樂觀鎖 (Optimistic Locking)** 搭配 `version` 欄位進行最終名額更新校驗，確保不超賣。
