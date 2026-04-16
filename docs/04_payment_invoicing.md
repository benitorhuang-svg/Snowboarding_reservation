# 04 - 金流與電子發票串接規格書

## 1. TapPay 金流串接 (Payment)

- **模式：** Pay by Prime (透過 `TPDirect.card.getPrime` 獲取 Prime)。
- **後端驗證：**
  - 後端 `PaymentService` 呼叫 TapPay `pay-by-prime` 接口。
  - **等冪性 (Idempotency)：** 針對 Webhook 實作 HMAC 簽名驗證與等冪性檢查，防止重複更新訂單狀態。

## 2. 電子發票串接 (E-Invoice)

- **串接對象：** 已整合 **綠界 (ECPay) Sandbox API**。
- **開立時機：** 收到金流付款成功 (Status: PAID) 訊息後，透過 `EventEmitter2` 異步觸發發票開立。
- **真實解析：** 後端自動解析 ECPay 回傳的 URL-encoded 內容，若成功則存入真實發票號碼 (`InvoiceNumber`)。
- **支援種類：**
  - **個人 (B2C)：** 支援共通性載具 (手機載具、自然人憑證)、捐贈、會員載具。
  - **公司 (B2B)：** 需輸入 8 位數統一編號。
- **發票通知：** 透過系統自動發送 Email，並在學員前台「我的訂單」提供發票預覽。

## 3. 退款與折讓 (Refund & Credit Note)

- **部分退款：** 若課程取消一堂，系統需支援 Tappay 部分金額退款。
- **發票作廢/折讓：**
  - 開立當天：執行作廢。
  - 開立隔天後：執行折讓 (Credit Note)。
- **流程：** 管理員在後台點擊「退款」後，系統需同時觸發金流退款與發票折讓 API。
