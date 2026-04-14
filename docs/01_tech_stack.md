# 01 - 技術棧與開發環境規格書

## 1. 前端架構 (Frontend)
為了最大化代碼共用與手機端效能，我們統一使用 React 生態系。

*   **框架：** React 18+ (TypeScript)
*   **構建工具：** Vite (快速熱更新)
*   **樣式解決方案：**
    *   **Desktop:** Tailwind CSS + Ant Design (後台) / Headless UI (前台)
    *   **Mobile:** Tailwind CSS + Shadcn UI (提供原生觸感)
*   **狀態管理：** TanStack Query (伺服器狀態) + Zustand (全域本地狀態)
*   **路由：** React Router v6

## 2. 後端架構 (Backend)
*   **框架：** NestJS (Node.js)
    *   **理由：** 模組化架構、強型別支持、成熟的依賴注入 (DI) 機制。
*   **ORM：** Prisma 或 TypeORM (建議 Prisma，型別安全且易於遷移資料庫)。
*   **文件化：** Swagger (自動生成 OpenAPI 規格)。

## 3. 開發環境規範
*   **套件管理器：** `pnpm` (節省磁碟空間與加速安裝)。
*   **Linting/Formatting：** ESLint + Prettier (強制執行統一風格)。
*   **Git Flow：** 
    *   `main`: 生產環境代碼。
    *   `develop`: 開發主分支。
    *   `feature/*`: 功能開發分支。
    *   `fix/*`: 錯誤修復分支。

## 4. 多語系環境
*   **工具：** `react-i18next` (前端), `nestjs-i18n` (後端)。
*   **IDE 套件：** 建議所有開發人員安裝 `i18n-ally` VS Code 擴充套件。
