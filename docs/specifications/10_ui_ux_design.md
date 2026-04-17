# UI/UX Design System: Cyberpunk Snow 2.0

本文件定義 Snowboarding 預約系統的視覺與互動規範，確保會員系統與預約流程具備高度的一致性與科技感。

## 1. 視覺基礎 (Visual Foundation)

- **配色方案 (Palette):**
  - `Primary Black`: #050505
  - `Neon Blue (Accent)`: #00F0FF
  - `Red Alert (Error)`: #FF003C
  - `Glass Background`: rgba(255, 255, 255, 0.05)
- **玻璃質感 (Glassmorphism):**
  - `backdrop-filter`: blur(12px)
  - `border`: 1px solid rgba(255, 255, 255, 0.1)
  - `shadow`: 0 8px 32px 0 rgba(0, 0, 0, 0.37)

## 2. 核心互動元件 (Core Components)

- **GlassCard:** 所有會員卡片、課程資訊均須統一使用此樣式。
- **Red Glass Notification:** 取代瀏覽器原生 `alert()`。
  - 邊框: 2px solid #FF003C
  - 動畫: 使用 `Framer Motion` 的 `AnimatePresence` 實現滑入。
- **SmartCalendar:** 採用 2D 時間軸網格 (Week View)，支援時段拖拽效果。

## 3. 全局體驗原則

- **無縫過場:** 頁面跳轉需使用 `Framer Motion` 的 `layout` 動畫。
- **狀態視覺化:** 操作成功與失敗必須有明顯的色彩回饋 (Neon Blue vs Red Alert)。
