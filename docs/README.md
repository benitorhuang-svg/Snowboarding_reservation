# Snowboarding Booking System Documentation

歡迎來到滑雪課程預約系統的文件中心。本目錄包含了系統的詳細規格、架構設計、技術決策及運維規範。

## 📑 文件索引 (Documentation Index)

| 編號   | 文件名稱                                               | 核心內容摘要                                             |
| :----- | :----------------------------------------------------- | :------------------------------------------------------- |
| **01** | [技術棧與開發環境](./01_tech_stack.md)                 | 前後端架構 (React/NestJS)、開發工具與 Git 規範。         |
| **02** | [核心功能模組](./02_functional_modules.md)             | 會員、預約引擎、課程管理與權限 (RBAC) 邏輯。             |
| **03** | [多語系優化策略](./03_i18n_strategy.md)                | 動靜分離 i18n 引擎、Redis 快取與免部署更新機制。         |
| **04** | [金流與發票整合](./04_payment_invoicing.md)            | TapPay 串接、電子發票開立流程與退款邏輯。                |
| **05** | [資料庫設計規格](./05_database_design.md)              | Schema 設計 (Prisma)、高併發控制與樂觀鎖規範。           |
| **06** | [基礎設施與 DevOps](./06_infrastructure_devops.md)     | GCP 雲端部署 (GCE/GCS)、CI/CD 流與備份策略。             |
| **07** | [API 規範與錯誤碼](./07_api_specification.md)          | RESTful 標準、端點定義與業務錯誤代碼 (Business Errors)。 |
| **08** | [品牌識別系統 (VIS)](./08_brand_identity_system.md)    | 視覺語彙、色彩規範與品牌核心價值。                       |
| **09** | [內容審計與 i18n 校正](./09_i18n_and_content_audit.md) | 多語系同步現況、預約巫師 (Wizard) 流程優化紀錄。         |
| **10** | [UI/UX 設計規範](./10_ui_ux_design.md)                 | Cyberpunk Snow 視覺風格、元件規範與行動端優化。          |
| **11** | [認證與預約重構](./11_auth_booking_revamp.md)          | 靜默同步、Redis 佔位鎖與高併發保護深研。                 |

---

## 🏗 系統架構圖 (Architecture)

- **[整體架構圖 (Mermaid)](./overall_architecture.md)**: 系統組件與資料流轉圖。
- **[整體架構解析 (V2.0)](./architecture_overview.md)**: 深度解析 Monorepo、技術棧與模組職責。

---

## 📘 核心規格 (Master Specs)

- **[系統全方位規格書](./system_specification.md)**: 整合性的系統需求與驗收標準。
- **[使用者故事 (User Story)](./user_story.md)**: 專案背景、目標用戶與核心業務需求。

---

## 🛠 開發相關 (For Developers)

所有的執行任務與詳細技術實作計畫請參考專案根目錄下的 `.specify/` 資料夾：

- `.specify/tasks.md`: 實作進度追蹤 (Phase 1 - 7)。
- `.specify/technical_plan.md`: 詳細技術實作路徑。
- `.specify/constitution.md`: 專案憲章與開發原則。
