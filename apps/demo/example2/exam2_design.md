# exam2_design.md - 滑雪預約系統視覺設計與排版規範 (V2.0)

本文件描述了 `exam2.html` 預約門戶的設計美學、核心排版邏輯以及組件接口定義。

## 🎨 視覺識別 (Visual Identity)

### 核心配色 (Color Palette)

採用高端運動科技感配色，以深邃藍與活力橘作為對比。

- **Primary (品牌藍)**: `#2563eb` - 用於導覽進度、選中狀態、核心按鈕。
- **Secondary (活力橘)**: `#f97316` - 用於「下一步」結帳按鈕，具備極強的視覺驅動力。
- **Background (背景色)**: `#f8fafc` - 淺灰藍底色，營造輕盈且專業的氛圍。
- **Border (邊框色)**: `#f1f5f9` - 極細緻的邊框，區隔塊狀內容而不顯突兀。

### 字體規範 (Typography)

- **字體族**: `Noto Sans TC`, sans-serif。
- **層次結構**:
  - `h1/h2`: `font-bold`, `tracking-tight` - 強化標題的存在感。
  - `Badge/Label`: `font-black`, `uppercase`, `tracking-widest` - 典型的運動品牌設計語彙。

---

## 🏗 排版架構 (Layout Architecture)

系統採用 **Two-Column Sticky Layout** (雙欄吸附式佈局)，確保使用者在長頁面操作時能隨時看到預約進度。

### 1. Header (頂部導覽)

- **佈局**: 左右分佈。左側為品牌 Logo，中間為「簡約式進度指示器」，右側為返回連結。
- **進度指示器 (Stepper)**: 採用「文字 + 底部彩色指示線」設計，非作用中步驟使用透明度處理，減少干擾。

### 2. Main Content (左側操作區 - 65% 寬度)

- **Accordion (風琴圖)**: 用於「教練選取」，選定後自動收合以節省空間。
- **Grid System**:
  - 教練列表：採用 `grid-cols-1 md:grid-cols-2`。
  - 日曆與時段：採用 `flex flex-col lg:flex-row`，在桌面端並列呈現。

### 3. Sidebar Summary (右側預約明細 - 35% 寬度)

- **Sticky Position**: 頂部保留 `top-28` 的安全距離，隨滾動吸附。
- **Card Design**:
  - Header 採用深藍背景 (`#0f172a`)。
  - 內容區使用白色背景與細緻投影 (`shadow-sm`)。

---

## 🧩 組件與接口定義 (Components & Interface)

### 預約卡片 (Reservation Item)

- **結構模板**: `renderSummaryItem(item, isDraft)`
- **數據接口**:
  - `coachName`: 導師姓名。
  - `coachImage`: 導師頭像 (固定 44x44px, `rounded-xl`)。
  - `title`: 課程名稱 (顯示於教練名右側)。
  - `date`: 完整格式 `YYYY / MM / DD`。
  - `time`: 完整時段描述。
  - `location`: 滑雪場地點。

### 動態狀態 (Dynamic State)

- **Confirmed (已確認)**: 白色背景，具備「移除」按鈕。
- **Draft (規劃中)**: 虛線邊框 (`border-dashed`), 背景淺灰, 圖片半透明 (`opacity-40`)。

---

## 🖱 互動 Pattern

- **Auto-Scroll**: 選取教練後，視窗平滑滾動至「日期選擇區」。
- **Implicit Feedback**: 加入清單後，右側明細標題旁會出現 `· N 筆` 的動態徽章。
- **Empty State**: 若無選取任何內容，明細區顯示簡約的「購物車空狀態」插畫。

---

## 📱 響應式策略 (Responsive Design)

- **Mobile (< 1024px)**: 側邊欄改為流式佈局，排在操作區下方。
- **Touch Friendly**: 日曆與日期按鈕保持足夠的點擊熱點。
