# 會員系統與預約邏輯整合 (User Lifecycle & Booking Flow)

本文件將會員與預約業務邏輯聚合，確保系統的領域統一性。

## 1. 會員領域聚合 (Member Profile Domain)

- **聚合結構:** 將 `Auth` 與 `Profile` 整合為 `MemberModule`。
- **權限控制:** 預約邏輯需與 `SkillLevel` 掛鉤。
  - `初學者`: 僅能預約 `Basic Course`。
  - `進階者`: 開放所有課程預約。
- **課程追蹤:** 會員 Profile 需包含 `CourseHistory` 列表，與 `Booking` 模組關聯。

## 2. 高並行預約業務流 (Booking Flow)

- **Step 1 (授權):** 檢查會員是否登入及能力等級。
- **Step 2 (檢視):** 顯示週檢視日曆 (SmartCalendar)。
- **Step 3 (鎖定):** 使用 Redis `SET NX` 鎖定 10 分鐘，開啟倒數計時。
- **Step 4 (支付):** 呼叫 TapPay 進行 prime 授權，成功後建立訂單 (Prisma Transaction)。

## 3. 異常處理 (Exception Handling)

- 統一拋出 `BusinessException`。
- 支付/衝突失敗時觸發 `Red Glass Notification`。
