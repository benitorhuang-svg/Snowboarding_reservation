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
*   **行政人員：** 可在後台即時修正課程標題/描述。
*   **用戶端：** 修正後 1 秒內全球生效，無需重新部署或重啟伺服器。

### 2. High-Concurrency Booking (高並行預約控制)
*   **Optimistic Locking (樂觀鎖)：** 在資料庫層級透過 `version` 欄位防止名額超賣。
*   **Atomic Transactions：** 確保預約、扣額、訂單建立具備 ACID 原子性。

### 3. Mobile-First Experience (手機端優化)
*   使用 React 18 + Tailwind CSS + Framer Motion。
*   針對低延遲觸控互動與離線 i18n 加載進行深度調優。

---

## 🛠 技術棧 (Tech Stack)

| 層級 | 技術方案 | 備註 |
| :--- | :--- | :--- |
| **後端 (API)** | NestJS (Node.js) | 強型別、模組化架構 |
| **資料庫 (DB)** | MySQL 8.0 (Prisma ORM) | 支援 JSONB 欄位 |
| **前端 (Web)** | React 18 (TypeScript) + Vite | 快速熱更新與效能優化 |
| **樣式 (UI)** | Tailwind CSS + Shadcn UI | 響應式手機版設計 |
| **認證 (Auth)** | JWT (Access/Refresh Tokens) | 安全權限管理 |
| **CI/CD** | GitHub Actions + GCP (GCE) | 自動化部署至台灣機房 |

---

## 📁 目錄結構 (Directory Structure)

```text
Snowboarding/
├── .github/          # GitHub Actions CI/CD 工作流
├── .specify/         # Spec-Kit 專家規範與任務清單 (Core Logic)
├── docs/             # 系統詳細規格文件 (v1.0)
├── backend/          # NestJS 後端原始碼
│   ├── prisma/       # 資料庫模型 (schema.prisma)
│   └── src/          # 核心業務邏輯 (Auth, Booking, i18n, etc.)
└── frontend/         # React 前端原始碼
    ├── public/       # 多語系 JSON 靜態資源
    └── src/          # UI 組件與頁面邏輯
```

---

## 🏁 快速啟動 (Getting Started)

### 1. 前置需求
*   Node.js v25+
*   pnpm v10+
*   MySQL 8.0 資料庫實例

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

## 📜 專家規範 (Spec-Kit Workflow)
本專案遵循 **Spec-Kit** 嚴謹工作流，所有開發邏輯均記錄於以下路徑：
*   **核心規範:** `.specify/constitution.md` (架構原則、安全協議)
*   **技術計畫:** `.specify/technical_plan.md` (序列圖、ERD、快取策略)
*   **任務追蹤:** `.specify/tasks.md` (Phase 1-7 執行狀態)

---

## ⚖️ 授權 (License)
本專案僅供內部使用 (UNLICENSED)。

---
*Developed with Expert Mode & YOLO Speed.*
