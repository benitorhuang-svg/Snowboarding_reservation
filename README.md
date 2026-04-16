# 滑雪課程預約系統 V2 (Professional Snowboarding System)

[![CI/CD](https://github.com/benitorhuang-svg/Snowboarding_reservation/actions/workflows/deploy.yml/badge.svg)](https://github.com/benitorhuang-svg/Snowboarding_reservation/actions)
![License](https://img.shields.io/badge/license-UNLICENSED-red)
![Node](https://img.shields.io/badge/node-%3E%3D25.0.0-blue)

本專案是一個從零打造的企業級滑雪預約平台，採用 **Clean Architecture** 與 **Event-Driven** 思維，特別針對「多國語系校正」與「高並行預約」進行了專家級優化。

---

## 🚀 PWA 訪問位址

**[Snowboarding Coaching PWA](https://benitorhuang-svg.github.io/Snowboarding_reservation/)**

---

## 🚀 核心優勢 (Core Highlights)

### 1. Zero-Downtime i18n Engine (免部署多語系引擎)

為解決過往多語系修正耗時問題，本系統採用 **JSONB 動態存儲** 結合 **Redis 多層快取**。

- **行政人員：** 可在後台即時修正課程標題/描述。
- **用戶端：** 修正後 1 秒內全球生效，無需重新部署或重啟伺服器。

### 2. High-Concurrency Booking (高並行預約控制)

- **Optimistic Locking (樂觀鎖)：** 在資料庫層級透過 `version` 欄位防止名額超賣。
- **Atomic Transactions：** 確保預約、扣額、訂單建立具備 ACID 原子性。

### 3. Mobile-First Experience (手機端優化)

- 使用 React 18 + Tailwind CSS + Framer Motion。
- 針對低延遲觸控互動與離線 i18n 加載進行深度調優。

---

## 🛠 技術棧 (Tech Stack)

| 層級            | 技術方案                     | 備註                 |
| :-------------- | :--------------------------- | :------------------- |
| **後端 (API)**  | NestJS (Node.js)             | 強型別、模組化架構   |
| **資料庫 (DB)** | MySQL 8.0 (Prisma ORM)       | 支援 JSONB 欄位      |
| **前端 (Web)**  | React 18 (TypeScript) + Vite | 快速熱更新與效能優化 |
| **樣式 (UI)**   | Tailwind CSS + Shadcn UI     | 響應式手機版設計     |
| **認證 (Auth)** | JWT (Access/Refresh Tokens)  | 安全權限管理         |
| **CI/CD**       | GitHub Actions + GCP (GCE)   | 自動化部署至台灣機房 |

---

## 📁 目錄結構 (Directory Structure)

```text
Snowboarding/
├── apps/               # 應用程式目錄
│   └── demo/           # 靜態 Demo 展示與樣式演練
├── backend/            # NestJS 後端核心 (工業級模組化架構)
│   ├── src/modules/    # 領域驅動模組 (Auth, Booking, Course, Payment, etc.)
│   └── src/database/   # Prisma ORM 與資料庫抽象層
├── frontend/           # React 19 前端核心 (功能導向架構)
│   ├── src/features/   # 核心業務功能組件
│   ├── src/layout/     # 面板與全域佈局
│   └── src/services/   # API 與外部服務串接
├── packages/           # 共享套件目錄
│   ├── shared/         # 跨端共享型別 (Shared Types) 與常數
│   └── eslint-config/  # 統一的代碼規範配置 (Shared ESLint)
├── infrastructure/     # 基礎設施與部署配置 (Terraform, Caddy)
├── tooling/            # 開發工具輔助配置
├── docs/               # 完整的系統規格與開發文檔
└── scripts/            # 自動化維運與輔助腳本
```

---

## 🏁 快速啟動 (Getting Started)

### 1. 前置需求

- Node.js v25+
- pnpm v10+
- MySQL 8.0 資料庫實例

### 2. 後端設定 (Backend)

```bash
cd backend
pnpm install

# 建立 .env 檔案並設定以下變數：
# DATABASE_URL="mysql://user:password@localhost:3306/snowboarding_db"
# JWT_SECRET="your_super_secret_key"

# 同步資料庫與生成 Client
npx prisma db push
npx prisma generate

# 啟動開發環境
pnpm run start:dev
# API 文件 (Swagger): http://localhost:3000/api
```

### 3. 前端設定 (Frontend)

```bash
cd frontend
pnpm install

# 啟動開發環境
pnpm run dev
# 訪問位址: http://localhost:5173
```

---

## 🧪 測試帳號 (Test Accounts)

為方便快速體驗系統功能，開發環境提供了以下旁路測試帳號（**密碼均為 `test`**）：

| 角色                   | 帳號 (Identifier/Email) | 權限內容                                         |
| :--------------------- | :---------------------- | :----------------------------------------------- |
| **管理員 (Admin)**     | `admin`                 | 可訪問管理後台、執行即時多語系校正               |
| **一般學員 (Student)** | `user1`                 | 可完整執行預約流程、檢視個人進化終端 (Dashboard) |

---

## 📜 專家規範 (Spec-Kit Workflow)

本專案遵循 **Spec-Kit** 嚴謹工作流，所有開發邏輯均記錄於以下路徑：

- **核心規範:** `.specify/constitution.md` (架構原則、安全協議)
- **技術計畫:** `.specify/technical_plan.md` (序列圖、ERD、快取策略)
- **任務追蹤:** `.specify/tasks.md` (Phase 1-7 執行狀態)

---

## ⚖️ 授權 (License)

本專案僅供內部使用 (UNLICENSED)。

---

_Developed with Expert Mode & YOLO Speed._
