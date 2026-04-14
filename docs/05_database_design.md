# 05 - 資料庫設計原則與 Schema 規格書

## 1. 基礎原則 (Database Principles)
*   **引擎：** InnoDB。
*   **字符集：** `utf8mb4` (完整支援 Emoji 與多國語系字元)。
*   **時區：** 資料庫內部統一使用 `UTC` 儲存，應用程式層根據 User 語系/地區進行轉換。
*   **命名：** 小寫蛇形命名法 (`snake_case`)，如 `course_sessions`。

## 2. 核心實體關聯 (Core Entities)
*   **Users (使用者):** `id`, `email`, `password_hash`, `role`, `language`, `mobile_phone`, `last_login_at`.
*   **Coaches (教練):** `id`, `user_id`, `bio` (JSON), `rating`, `certifications` (JSON).
*   **Courses (課程):** `id`, `title` (JSON), `description` (JSON), `type` (GROUP/PRIVATE), `base_price`, `currency`.
*   **CourseSessions (課表時段):** `id`, `course_id`, `coach_id`, `start_time`, `end_time`, `max_capacity`, `current_bookings`, `status`.
*   **Orders (訂單):** `id`, `user_id`, `total_amount`, `payment_status`, `payment_method`, `invoice_status`, `invoice_number`, `created_at`.
*   **BookingItems (預約細項):** `id`, `order_id`, `session_id`, `attendee_name`, `price_at_booking`.

## 3. 多語系欄位設計 (i18n Implementation)
*   **JSON 欄位：** 凡是需要在前端顯示給用戶的文字內容 (標題、描述、通知內容)，統一使用 `JSON` 類型儲存。
*   **結構：** `{"zh_TW": "...", "en_US": "...", "ja_JP": "..."}`。

## 4. 索引策略 (Indexing)
*   **外鍵索引：** 所有 `user_id`, `course_id`, `coach_id` 必須建立索引。
*   **時間索引：** `start_time`, `end_time`, `created_at` 必須建立索引，以加速行事曆查詢與報表產出。
*   **複合索引：** 考慮 `(coach_id, start_time)` 複合索引，優化教練個人排程查詢。
