# API 介面契約 (API Integration Contract)

定義前後端通訊的標準格式，確保會員系統與預約系統的強型別對接。

## 1. 統一回應格式 (Response Structure)

所有 API 回應均需包含狀態與數據結構:

```json
{
  "status": "success | error",
  "data": { ... },
  "error_code": "AUTH_001 | BOOK_001 | PAY_001",
  "message": "繁體中文錯誤訊息"
}
```

## 2. 會員系統接口

- `GET /api/v1/member/profile`: 獲取聚合後的身分與能力數據。
- `PATCH /api/v1/member/profile`: 更新會員設定。

## 3. 預約系統接口

- `POST /api/v1/booking/lock`: 佔位時段鎖定。
- `POST /api/v1/booking/confirm`: 最終支付與預約確認。
