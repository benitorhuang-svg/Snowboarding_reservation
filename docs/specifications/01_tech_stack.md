# 01 - 技術棧與開發環境規格書

## 1. 前端架構 (Frontend)

為了最大化代碼共用與手機端效能，我們統一使用 React 生態系。

- **框架：** React 18+ (TypeScript)
- **構建工具：** Vite (快速熱更新)
- **樣式解決方案：**
  - **Desktop:** Tailwind CSS + Ant Design (後台) / Headless UI (前台)
  - **Mobile:** Tailwind CSS + Shadcn UI (提供原生觸感)
- **狀態管理：** TanStack Query (伺服器狀態) + Zustand (全域本地狀態)
- **路由：** React Router v6

## 2. 後端架構 (Backend)

- **框架：** NestJS (Node.js)
- **認證服務：** Firebase Authentication (Email/Password, Google, LINE Custom Token, OTP)
- **後端 Token 驗證：** `firebase-admin` SDK (驗證 Firebase ID Token)
- **資料庫與快取：**
  - **Main DB:** MySQL 8.0 (透過 Prisma ORM)
  - **Cache/Lock:** Redis (使用 `ioredis` 實作分散式鎖與高併發控制)
- **金流整合：** TapPay (Credit Card, Pay-by-Prime)
- **電子發票：** 台灣電子發票整合 (Event-Driven 架構)
- **文件化：** Swagger (自動生成 OpenAPI 規格)

## 3. 開發環境規範

- **套件管理器：** `pnpm` (節省磁碟空間與加速安裝)。
- **Linting/Formatting：** ESLint + Prettier (強制執行統一風格)。
- **Git Flow：**
  - `main`: 生產環境代碼。
  - `develop`: 開發主分支。
  - `feature/*`: 功能開發分支。
  - `fix/*`: 錯誤修復分支。

## 4. 多語系環境

- **工具：** `react-i18next` (前端), `nestjs-i18n` (後端)。
- **IDE 套件：** 建議所有開發人員安裝 `i18n-ally` VS Code 擴充套件。
