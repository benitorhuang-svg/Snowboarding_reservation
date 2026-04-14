# 07 - API 規範與錯誤代碼規格書

## 1. RESTful 基礎 (RESTful API Standards)
*   **基礎 URL：** `https://api.snowboarding.app/v1`
*   **認證：** 使用 `Bearer Token` (JWT)。
    *   `AccessToken`: 1 小時效期。
    *   `RefreshToken`: 30 天效期。

## 2. 標準回應格式 (Response Format)
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功",
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

## 3. 錯誤處理 (Error Handling)
當 API 失敗時，應回傳對應的 HTTP Status Code 與詳細錯誤訊息。

*   **400 Bad Request:** 請求參數錯誤。
*   **401 Unauthorized:** 未登入或 Token 過期。
*   **403 Forbidden:** 權限不足（例如：學員試圖存取管理介面）。
*   **404 Not Found:** 資源不存在。
*   **422 Unprocessable Entity:** 業務邏輯錯誤（例如：課程已額滿）。
*   **500 Internal Server Error:** 伺服器內部錯誤。

## 4. 錯誤代碼規範 (Business Error Codes)
除了 HTTP 狀態碼，應在 `error_code` 欄位提供細分代碼，方便前端根據代碼顯示對應的多語系提示。

| 代碼 | 說明 | 多語系 Key |
| :--- | :--- | :--- |
| `AUTH_001` | 登入失敗 (密碼錯誤) | `error.auth.invalid_credentials` |
| `BOOK_001` | 課程已額滿 | `error.booking.session_full` |
| `PAY_001` | 付款失敗 | `error.payment.failed` |
| `SYS_001` | 系統維護中 | `error.system.maintenance` |

## 5. 分頁與過濾 (Pagination & Filtering)
*   **分頁：** 使用 `?page=1&limit=20`。
*   **排序：** 使用 `?sort_by=created_at&order=desc`。
*   **搜尋：** 使用 `?q=滑雪課` (需支援多語系模糊搜尋)。
