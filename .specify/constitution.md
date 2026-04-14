# Constitution - 企業級開發規範 (Corporate Engineering Standard)

## 1. 工程原則 (Engineering Principles)
*   **Clean Architecture:** 後端邏輯需嚴格遵守領域驅動設計 (DDD) 思維，確保領域層 (Domain) 獨立於外部框架。
*   **SOLID Principles:** 所有模組化開發需符合單一職責與開閉原則。
*   **Strict Typing:** 強制執行 TypeScript `strict` 模式，禁止使用 `any`，所有外部輸入 (DTO) 必須經過 `class-validator` 驗證。
*   **Atomic Transactions:** 涉及訂單與金流之資料庫操作，必須確保其原子性 (ACID)，防止數據不一致。

## 2. 安全性協議 (Security Protocols)
*   **OWASP Top 10:** 系統架構需針對 SQL Injection, XSS, CSRF 進行原生防護。
*   **Sensitive Data:** 密碼必須使用 `argon2` 或 `bcrypt` 加密存儲。
*   **Authentication:** 採用 JWT (RS256 演算法)，實作雙令牌機制 (Access & Refresh Token) 以兼顧安全性與體驗。

## 3. 多語系架構規範 (i18n Architecture)
*   **Normalization:** 靜態字串統一由 `i18next` 管理，禁止硬編碼 (Hard-coding)。
*   **Data Integrity:** 資料庫中的多語系欄位必須具備 JSON Schema 驗證，確保所有支援語系 (zh-TW, en-US, ja-JP, yue-HK) 的 Key 均存在且不為空。

## 4. 自動化與品質監控 (Quality Assurance)
*   **Testing:** 核心業務邏輯 (如退款公式、預約餘位檢查) 必須具備 90% 以上的 Unit Test 覆蓋率。
*   **Documentation:** 所有 API 必須隨程式碼同步更新 Swagger/OpenAPI 文件。
*   **Linting:** 嚴格遵守 ESLint `airbnb-typescript` 規範。
