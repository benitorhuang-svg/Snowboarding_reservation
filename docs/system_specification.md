# 滑雪課程預約系統 - 全方位技術與功能規格書 (v2.0)

## 1. 專案概述 (Project Overview)

本系統旨在提供一個高效、可擴展且具備高度用戶體驗的滑雪課程預約平台。系統需支援多國語系（中、英、日、粵），整合金流與電子發票，並在手機端提供極致的 React 網頁體驗。

---

## 2. 技術棧定義 (Technology Stack)

為了確保從零打造的系統具備長期維護性，我們定義以下技術棧：

| 層級                  | 技術 / 工具                       | 備註                                  |
| :-------------------- | :-------------------------------- | :------------------------------------ |
| **前端 (Desktop)**    | React (TypeScript) + Tailwind CSS | 建議統一使用 React 以利手機版代碼共用 |
| **前端 (Mobile Web)** | React (TypeScript) + Shadcn UI    | 針對手機版進行高度組件優化與動效處理  |
| **後端 (API)**        | Node.js (NestJS)                  | 提供強型別、可測試的 API 架構         |
| **資料庫 (Database)** | MySQL 8.0 (透過 Prisma ORM)       | 穩定且支援 JSON 格式欄位              |
| **基礎設施 (Cloud)**  | GCP (GCE + GCS)                   | 台灣機房 (asia-east1)                 |
| **快取 (Cache)**      | Redis (ioredis)                   | 用於分散式鎖、Session 管理與餘位鎖定  |

---

## 3. 核心功能模組 (Core Functional Modules)

### 3.1 會員系統 (User Identity)

- **多身份切換：** 學員 (Learner) 與 教練 (Coach) 在同一套系統下不同權限。
- **多通路登入：** Email/Password, Google Login, LINE Login (台灣主流)。
- **偏好語言：** 系統根據會員設定自動切換語系與時區。

### 3.2 教練與課程管理 (Coach & Course Engine)

- **教練排程：** 教練可自定義可預約時段 (Calendar Interface)，具備時段碰撞偵測。
- **課程定義：** 單堂課、團體課、套票 (Package) 邏輯。
- **多語系描述：** 所有課程名稱、描述、注意事項皆需對應多國語系內容。

### 3.3 預約與訂單流程 (Booking & Order Lifecycle)

- **預約引擎：** 支援即時餘位檢查，結合 Redis 分散式鎖與資料庫樂觀鎖雙重防止超賣。
- **訂單狀態機：** `CREATED` (建立) -> `PENDING_PAYMENT` (待支付) -> `PAID` (已支付) -> `COMPLETED` (已完成) / `REFUND_REQUESTED` (申請退款) -> `REFUNDED` (已退款) / `CANCELLED` (已取消)。

### 3.4 多語系校正引擎 (i18n Engine - 重點優化)

針對原有系統多語系校正耗時的問題，新版採取以下規範：

1.  **資料庫層：** 採用 JSON 欄位儲存動態翻譯內容。
2.  **前端層：** 使用 `react-i18next` (搭配 `lowerCaseLng: true`)。
3.  **自動化工具：** 提供統一的 `translation.json` 管理流程。

---

## 4. 金流與發票規範 (Payment & Invoicing)

### 4.1 Tappay 金流串接

- **付款方式：** 信用卡 (Direct Pay / Pay-by-Prime)、Apple Pay、Google Pay、LINE Pay。
- **退款邏輯：** 整合 Tappay 退款 API，實現後台一鍵部分或全額退款。

### 4.2 電子發票

- **類型：** B2C (個人載具)、B2B (統編)。
- **時機：** 支付成功 (`order.paid` 事件) 後自動呼叫 API 開立。
- **報廢與折讓：** 支援線上作廢與折讓邏輯。

---

## 5. 資料庫建模原則 (Database Schema Principles)

- **命名規範：** 採用 `snake_case` (如 `user_orders`)。
- **高併發處理：** 使用樂觀鎖 `version` 欄位與資料庫交易。
- **多語系欄位：** 動態內容統一使用 `json` 格式存放翻譯物件。

---

## 6. 基礎設施與部署 (Infrastructure & DevOps)

- **雲端平台：** Google Cloud Platform (GCP)。
- **開發環境：** Docker Compose (MySQL + Redis)。
- **CI/CD：** 使用 GitHub Actions 自動部署至生產環境。

---

## 7. API 設計規範 (API Standards)

- **RESTful API：** 使用標準 HTTP Method，URL 前綴為 `/api/v1`。
- **認證：** JWT Bearer Token。
