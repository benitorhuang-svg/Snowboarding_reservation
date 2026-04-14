# 08 - 品牌識別系統 (Brand Identity System)

## 1. 品牌核心理念 (Brand Philosophy)
*   **關鍵字：** 極限 (Extreme)、純淨 (Pure)、科技 (Tech)、速度 (Velocity)。
*   **視覺風格：** 採用「暗色系科技風 (Dark Tech Mode)」結合「冰雪質感 (Icy Texture)」，營造高階、專業且具備未來感的預約體驗。

## 2. 色彩規範 (Color Palette)

### 2.1 核心色彩 (Primary Colors)
| 顏色 | 十六進制 (Hex) | 變數名稱 | 用途 |
| :--- | :--- | :--- | :--- |
| **冰晶藍** | `#00D2FF` | `--color-accent-blue` | 品牌主色、行動按鈕 (CTA)、強調文字。 |
| **深淵黑** | `#0A0C10` | `--color-bg-dark` | 系統主背景、深度層次感。 |
| **極光銀** | `#E2E8F0` | `--color-text-main` | 標題文字、重要內容。 |

### 2.2 輔助色彩 (Secondary Colors)
*   **深海藍:** `#003542` (用於卡片背景、邊框漸層)。
*   **警告紅:** `#FF4B5C` (用於錯誤提示、取消預約)。
*   **成功綠:** `#00F5A0` (用於付款成功、預約確認)。

## 3. 字體規範 (Typography)
*   **標題字體 (Headings):** `Outfit` 或 `Montserrat` (Sans-serif)。強調現代感與幾何平衡。
*   **內文字體 (Body):** `Inter` 或 `Noto Sans TC`。確保在多語系環境下的跨平台閱讀一致性。
*   **字重規則：**
    *   Bold (700): 大標題、關鍵數字。
    *   Medium (500): 按鈕文字、導覽列。
    *   Regular (400): 描述內容、表單標籤。

## 4. 視覺元素與紋理 (Visual Assets)
*   **玻璃擬態 (Glassmorphism):** 
    *   卡片應採用 `bg-white/5` 配合 `backdrop-blur-md` 與 `border-white/10`。
*   **漸層規範 (Gradients):**
    *   **線性漸層:** `linear-gradient(to right, #FFFFFF, #00D2FF)`。
    *   **深度漸層:** `linear-gradient(rgba(10, 12, 16, 0.6), rgba(10, 12, 16, 0.8))`。
*   **動畫原則：**
    *   進場使用 `Fade-in Up`。
    *   互動使用 `Active Scale (0.95)`。
    *   轉場時間統一為 `300ms` 或 `500ms`。

## 5. UI 組件規範 (UI Standards)
*   **按鈕 (Buttons):** 
    *   圓角統一使用 `rounded-lg` (8px) 或 `rounded-full`。
    *   主按鈕具備 `0 0 20px rgba(0, 210, 255, 0.4)` 的外發光特效 (Glow)。
*   **輸入框 (Inputs):**
    *   背景色 `#1A1C23`，對焦時邊框變為 `accent-blue`。
*   **圖示 (Icons):**
    *   建議使用 `Lucide React` 或 `Phosphor Icons`，線條寬度統一為 `Regular (2px)`。
