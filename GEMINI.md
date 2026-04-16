# GEMINI.md - 滑雪預約系統 V2.0 (Snowboarding Reservation System)

本文件定義了滑雪預約平台的開發規範、架構上下文與核心機制。這份文件是 AI 代理（Gemini CLI）在與使用者互動時的最高指導原則。

## 🌐 語言與通訊規範 (Global Context)

- **核心指令：** 本專案的預設語言為**繁體中文 (zh-TW)**。
- **執行準則：**
  - **思考過程：** 所有內部推理與策略規劃必須使用繁體中文。
  - **問答溝通：** 與使用者的所有對話、回饋、解釋必須使用繁體中文。
  - **代碼備註：** 新增或修改的程式碼註解必須使用繁體中文。
  - **Git 提交：** 建議 commit message 優先使用英文，但詳細描述可補充繁體中文。

## 🚀 專案概覽

本系統是一個高可用性的滑雪課程預約平台，採用 **Clean Architecture** 與 **Event-Driven** 架構優化。

### 核心生命週期

- **開發階段 (Local):** 採用本地端 **MySQL 8.0** 與 Redis Docker 容器，確保開發環境快速且輕量。
- **部署階段 (Cloud):** 預計部署於 **GCP (Google Cloud Platform)**，採用 **Cloud SQL** 高可用資料庫、GCE 計算資源與 GCS 檔案存儲。

### 技術棧 (Tech Stack)

- **前端：** React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, TanStack Query v5, Zustand。
- **後端：** NestJS (Node.js 25+), TypeScript, Prisma ORM, MySQL 8.0, Redis。
- **基礎設施：** Docker (Caddy, MySQL, Redis), Firebase Auth, GitHub Actions (CI/CD)。
- **關鍵整合：** TapPay (支付), ECPay (電子發票), Firebase (認證)。

## 🧠 核心技術機制

### 1. 高並行預約保護 (High-Concurrency)

- **分佈式鎖：** Redis `SET NX` 鎖定時段，防止瞬間大量請求衝擊資料庫。
- **原子事務：** Prisma `$transaction` 確保預約、扣額、訂單建立的一致性。
- **樂觀鎖：** 透過 `version` 欄位與 `updateMany` 條件式更新，防止超賣。

### 2. 即時多語系引擎 (i18n Engine)

- **動態存儲：** 翻譯存於 MySQL `translations` 表，支援 JSONB 動態內容。
- **快取策略：** Redis 多層快取確保修正翻譯後 1 秒內全球生效。
- **強型別保護：** 前端 React-i18next 整合 TypeScript 定義，確保 key 的正確性。

### 3. 支付與退款邏輯

- **TapPay：** 支援 Prime 授權與 Webhook HMAC 簽名驗證。
- **退款規則：**
  - 開課前 7 天：100% 退款。
  - 開課前 3-6 天：50% 退款。
  - 開課前 48 小時內：不予退款。
- **發票處理：** 整合 ECPay，支援當日作廢 (Void) 與隔日折讓 (Allowance)。

## 🛠 開發規範 (Development Conventions)

### 後端 (NestJS)

- **驗證：** DTO 必須使用 `class-validator`。全域啟用 `ValidationPipe`。
- **異常：** 統一拋出 `BusinessException` 並回傳 `error_code` (例如：`AUTH_001`, `BOOK_001`)。
- **路徑：** 全域 API 前綴為 `api/v1`。
- **資料庫：** Prisma 為單一事實來源。修改 schema 後需執行 `prisma generate`。

### 前端 (React)

- **組件：** 優先使用 Functional Components 與 Hooks。
- **狀態：** Server State 使用 TanStack Query；Global State 使用 Zustand。
- **動效：** 所有互動回饋（如 Hover, Loading）應整合 Framer Motion 提升質感。
- **PWA：** 確保 Vite 插件配置正確，支援手機端離線加載與安裝。

## 📋 常用指令

### 根目錄 (Root)

- `pnpm install`: 安裝所有相依套件。
- `pnpm dev`: 同時啟動後端與前端 (Concurrent)。
- `pnpm prisma:generate`: 生成 Prisma Client。
- `pnpm prisma:push`: 同步 Schema 至本地資料庫。

### 後端 (Backend)

- `pnpm run start:dev`: 啟動後端開發環境。
- `pnpm run test:e2e`: 執行端對端測試。

### 前端 (Frontend)

- `pnpm run dev`: 啟動前端 Vite 伺服器。
- `pnpm run build`: 構建生產環境靜態檔案。

## 📂 專案結構導覽

- `.specify/`: 核心規範與任務管理 (Spec-Kit)。
- `docs/`: 包含 01-10 的詳細規格說明文件。
- `backend/src/`: 業務邏輯模組化目錄。
- `frontend/src/`: 包含 pages, components, store 等 UI 核心代碼。
