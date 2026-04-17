# SkiFun 菁英預約系統 V2.0 - 旗艦展示規範 (Demo Specification)

本文件定義了 SkiFun 品牌旗艦級 Demo 的技術架構、設計原則與 **18 項關鍵路徑演示 (The Golden 18 Pillars)**。本系統旨在展示一個結合 **B2C 菁英用戶體驗** 與 **B2B 專業營運調度** 的全能滑雪預約平台。

---

## 🎨 第一章：設計語言系統 (Design System)

- **核心配色 (Color Palettes)**:
  - **SkiFun Blue (#2563eb)**: 象徵專業、雪場速度感與核心功能。
  - **SkiFun Orange (#f97316)**: 象徵熱情、高價值服務與警示提醒。
- **介面語魂 (Visual Soul)**: 
  - 廣泛應用 **Glassmorphism (磨砂玻璃鏡面)** 效果。
  - 零件均採用 32px-48px 的超大圓角與 `.premium-shadow` 深度陰影。
- **字體規範 (Typography)**:
  - 英文與數值：`Outfit` (展現科技精確度)。
  - 繁體中文：`Noto Sans TC` (兼顧層次感與易讀性)。

---

## 👥 第二章：四大角色演示門戶 (The Personas Path)

### 1. 學員門戶 (Student Path - [S])
- **路徑**: [S01] 品牌門面 -> [S02] 認證中心 -> [S03] 入門引導 -> [S04] 快捷預約 -> [S05] 營隊行程 -> [S06] 退款巫師 -> [S07] 學員主板。
- **核心價值**: 極致簡化的操作流，帶動消費者的「尊榮感」與「滑雪熱情」。

### 2. 教練門戶 (Coach Path - [C])
- **路徑**: [C01] 專業排程 -> [C02] 證照中心 -> [C03] 行動視窗。
- **核心價值**: 支援週重複排班的桌機管理與寒冷環境友善的行動簽到系統。

### 3. 管理營運門戶 (Admin Path - [A])
- **路徑**: [A01] 營運大腦 -> [A02] 商業智能 -> [A03] 教練派遣 -> [A04] 內容管理 -> [A05] 人力管理 -> [A06] 財務結算。
- **核心價值**: 數據決策 (Data-Driven) 的極致體現，確保資源效率最大化。

### 4. 技術底層 (Technical Path - [T])
- **路徑**: [T01] 系統配置 -> [T02] 異常維護。

---

## 🚀 第三章：18 項核心路徑展示 (The Golden 18 Pillars)

### [S01] 品牌旗艦落地頁 (Landing Page)
- **檔案**: `portal-student/landing.html`

### [S02] 統一身份認証中心 (Unified Auth)
- **檔案**: `portal-student/auth.html`

### [S03] 用戶註冊啟動精靈 (Onboarding Wizard)
- **檔案**: `portal-student/onboarding.html`

### [S04] 實時預約引擎 (Booking Engine)
- **檔案**: `portal-student/booking.html`

### [S05] 營隊行程安排 (Camp Itinerary)
- **亮點**: **多日梯次安排** 視覺化，展現跨日行程套裝。
- **檔案**: `portal-student/camps.html`

### [S06] 財稅與退款試算 (Finance Wizard)
- **亮點**: 模擬 **7天/3-6天/48H** 退款自動計算與 B2B 統編輸入。
- **檔案**: `portal-student/refund-wizard.html`

### [S07] 學員個人主控台 (Student Hub)
- **檔案**: `portal-student/hub.html`

### [C01] 教練專業排程系統 (Pro Scheduler)
- **檔案**: `portal-coach/scheduler.html`

### [C02] 教練證照與資歷中心 (Identity Hub)
- **亮點**: 教練證照 (CASI/SAJ) 上傳與專業技能標註。
- **檔案**: `portal-coach/profile.html`

### [C03] 行動端教練工作台 (Coach Mobile Portal)
- **亮點**: **Red Alert 緊急救援通報** 模擬與 QR 快速簽到。
- **檔案**: `portal-coach/mobile.html`

### [A01] 管理員全域大腦 (Admin Dashboard)
- **檔案**: `portal-admin/dashboard.html`

### [A02] 實時商業智能 (BI Insights)
- **檔案**: `portal-admin/insights.html`

### [A03] 教練資源調度中心 (Resource Manager)
- **檔案**: `portal-admin/resources.html`

### [A04] 多語系課程編輯器 (i18n Content Manager)
- **亮點**: 展示 **JSONB 多語系內容** 實時編輯，展現 CMS 管理優勢。
- **檔案**: `portal-admin/content.html`

### [A05] 人力資源審核中心 (Personnel Audit)
- **檔案**: `portal-admin/audit.html`

### [A06] 財務與支付流水中心 (Finance Ledger)
- **檔案**: `portal-admin/finance.html`

### [T01] 全域系統配置與快取控制 (Master Config)
- **檔案**: `portal-technical/config.html`

### [T02] Cyberpunk 維護模式 (Cyber Maintenance)
- **亮點**: **Red Glass Notification** 與極致賽博視覺化的錯誤/維護狀態演繹。
- **檔案**: `portal-technical/maintenance.html`

---

## 🏗️ 第四章：技術亮點 (Technical Synergies)

1.  **跨頁面數據橋接 (localStorage State Bridge)**: 透過 `shared-state.js` 實作。
2.  **高並行預約保護 (Inventory Lock)**: 模擬 10 分鐘名額鎖定。
3.  **金融合規模擬 (Financial Compliance)**: 模擬 ECPay 電子發票與折讓單 (Allowance) 流程。
4.  **PWA 離線支援**: 支援手機端安裝與關鍵資源緩存。

---

## 📈 演示檔案清單
- `portal-student/landing.html` -> [S01]
- `portal-student/auth.html` -> [S02]
- `portal-student/onboarding.html` -> [S03]
- `portal-student/booking.html` -> [S04]
- `portal-student/camps.html` -> [S05]
- `portal-student/refund-wizard.html` -> [S06]
- `portal-student/hub.html` -> [S07]
- `portal-coach/scheduler.html` -> [C01]
- `portal-coach/profile.html` -> [C02]
- `portal-coach/mobile.html` -> [C03]
- `portal-admin/dashboard.html` -> [A01]
- `portal-admin/insights.html` -> [A02]
- `portal-admin/resources.html` -> [A03]
- `portal-admin/content.html` -> [A04]
- `portal-admin/audit.html` -> [A05]
- `portal-admin/finance.html` -> [A06]
- `portal-technical/config.html` -> [T01]
- `portal-technical/maintenance.html` -> [T02]
- `index.html`: **旗艦展示導覽總入口**
