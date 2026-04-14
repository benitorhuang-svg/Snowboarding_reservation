# Tasks - 實作任務拆解清單 (Actionable Task List)

## Phase 1: 基礎工程與資料建模 (Foundation & Data Modeling)
*   [ ] **T1.1: 初始化後端 NestJS 專案**
    *   配置 TypeScript `strict` 模式。
    *   安裝 `Prisma`, `class-validator`, `swagger`。
*   [ ] **T1.2: 資料庫 Schema 實作 (Prisma)**
    *   建立 `User`, `Coach`, `Course`, `Session`, `Order` 表結構。
    *   實作多語系 JSONB 欄位規範。
*   [ ] **T1.3: 初始化前端 React 專案 (Vite)**
    *   配置 Tailwind CSS 與 Shadcn UI。
    *   設定 `react-i18next` 基礎環境。

## Phase 2: 核心認證與權限 (Auth & RBAC)
*   [ ] **T2.1: JWT 雙令牌機制實作 (NestJS Auth)**
    *   實作 Login/Register API。
    *   實作 Access/Refresh Token 邏輯。
*   [ ] **T2.2: RBAC 守衛 (Guards) 實作**
    *   定義 `@Roles()` 裝飾器。
    *   驗證 `STUDENT`, `COACH`, `ADMIN` 存取權限。

## Phase 3: 專家級多語系引擎 (i18n Engine)
*   [ ] **T3.1: 動態翻譯 API 實作**
    *   後端提供讀取/更新 JSONB 翻譯欄位的 CRUD。
*   [ ] **T3.2: Redis 快取刷新機制**
    *   實作 Cache Invalidation 邏輯。
*   [ ] **T3.3: 前端 i18n 整合**
    *   實作多語系切換組件。
    *   串接動態翻譯 API 實現無縫刷新。

## Phase 4: 課程排程與預約邏輯 (Course & Booking)
*   [ ] **T4.1: 教練排班管理 API**
    *   實作時段新增、刪除、重複週期邏輯。
*   [ ] **T4.2: 預約餘位檢查 (含並行控制)**
    *   實作 Redis Mutex Lock 鎖定機制。
    *   實作資料庫樂觀鎖 (Version Control)。

## Phase 5: 金流與發票整合 (Payment & Invoicing)
*   [ ] **T5.1: Tappay Pay-by-Prime 串接**
    *   實作後端支付 API 與 Tappay 驗證。
*   [ ] **T5.2: 事件驅動發票開立 (Pub/Sub)**
    *   配置 Cloud Pub/Sub 或內部 Event Emitter。
    *   實作電子發票開立 Worker。

## Phase 6: 手機端 React 頁面實作 (Mobile Optimization)
*   [ ] **T6.1: 手機版首頁與導航設計**
*   [ ] **T6.2: 課程列表與行事曆預約介面**
    *   使用 Framer Motion 優化觸控體驗。
*   [ ] **T6.3: 訂單支付與發票預覽頁面**

## Phase 7: 自動化部署與驗證 (CI/CD & Testing)
*   [ ] **T7.1: GitHub Actions CI/CD 配置**
    *   自動部署至 GCE。
*   [ ] **T7.2: 核心業務單元測試 (Jest)**
*   [ ] **T7.3: Tappay 金流全流程 E2E 測試 (Playwright)**
