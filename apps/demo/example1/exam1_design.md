# exam1_design.md - 滑雪預約系統首頁設計規範 (V1.0)

本文件描述了 `exam1.html` (首頁) 的設計美學、交互邏輯與元件構成。

## 🌟 核心設計理念 (Core Concept)

首頁定位為「啟發與探索」。透過高品質的視覺影像與俐落的導覽，吸引使用者進入預約流程。

---

## 🏗 排版架構 (Layout Architecture)

### 1. 全域導覽列 (Navbar)

- **高度**: 固定 `72px`。
- **樣式**: 白色背景、極細陰影 (`shadow-sm`)。
- **佈局**:
  - 左側：Logo 與搜尋圖示 (Primary 色塊)。
  - 中間：主導覽選單 (Hover 時切換 Primary 顏色)。
  - 右側：登入與註冊按鈕 (Secondary 關鍵動作按鈕)。

### 2. 英雄英雄區塊 (Hero Section)

- **背景**: 使用滿版圖片與深色遮罩，確保標題的可讀性。
- **標題**: `text-white`, `font-bold`, `drop-shadow` - 直觀傳遞品牌價值。
- **毛玻璃搜尋列 (Frosted Glass Search Bar)**:
  - **背景**: `bg-white/30`, `backdrop-blur-md`, `border-white/50`。
  - **交互**: 整合地點、日期、程度三位一體的選擇器。
  - **動作**: 點擊「尋找課程」將引導至 `example2/exam2.html`。

### 3. 精選教練區塊 (Coaches Section)

- **佈局**: `Grid (1 col -> 4 cols)`，適應不同螢幕寬度。
- **卡片設計**:
  - **圖片區**: 固定高度 `220px`，Hover 時具備 `scale-105` 的微動效。
  - **收藏功能**: 右上角懸浮式 `Heart` 按鈕，具備紅藍顏色切換邏輯。
  - **資訊層次**: 名稱 (17px Bold) > 課程標題 (14px Gray) > 地點 (12px Label) > 價格 (18px Bold)。

### 4. 頁腳 (Footer)

- **背景**: 深色背景 (`#0f172a`) 與主色調呼應。
- **資訊**: 分為品牌資訊、探索、服務支援、安全認證四大區塊。

---

## 🎨 視覺元件 (UI Components)

### 教練卡片接口 (Card Interface)

- **數據格式**:
  - `instructor`: 教練姓名。
  - `title`: 課程全銜。
  - `rating`: 評分 (顯示黃色星星)。
  - `price`: 以 `NT$ 0,000` 格式呈現，並標註時數 (e.g., / 4小時)。

### 互動 Pattern

- **Hover Effect**: 所有互動元件 (Card, Button, Link) 均有平滑的顏色或位移轉換效果。
- **Image Fallback**: 當本地圖片遺失時，自動切換至高品質的 Unsplash 預設風景照。
