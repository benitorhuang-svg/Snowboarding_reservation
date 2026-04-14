# Specification - 滑雪預約系統 核心需求規格

## 1. 業務目標 (Business Goals)
打造一個支援全球化營運 (Global Operations) 的滑雪預約中樞，實現從教練排班、學員預約到自動化發票開立的完整閉環 (Closed Loop)。

## 2. 功能性需求 (Functional Requirements)

### FR-1: 會員權限與 RBAC (Role-Based Access Control)
*   **需求描述:** 系統需支援多角色權限管理，確保敏感資料隔離。
*   **驗收標準:**
    *   `STUDENT` 僅能存取個人課表與訂單。
    *   `COACH` 僅能管理個人開放時段與已分配學員。
    *   `ADMIN` 可管理全域配置與財務報表。

### FR-2: 預約引擎與並行控制 (Booking & Concurrency)
*   **需求描述:** 在高流量期間 (如冬季) 需確保名額不超賣。
*   **驗收標準:**
    *   訂單建立時需鎖定名額 (Temporary Lock) 10 分鐘。
    *   在高並行環境下，透過資料庫 Pessimistic Locking 或 Redis Atomic Decr 確保不超賣。

### FR-3: 金流與發票自動化 (Payment & Invoicing Lifecycle)
*   **需求描述:** 整合 Tappay 與電子發票系統，達成全自動帳務處理。
*   **驗收標準:**
    *   付款完成後 5 秒內觸發發票開立。
    *   退款操作需同時連動 Tappay Refund API 與發票折讓 API。

### FR-4: 多語系校正流程 (i18n Calibration Flow)
*   **需求描述:** 解決過往多語系修正耗時問題，實現免代碼更新 (Code-free Updates)。
*   **驗收標準:**
    *   後台管理系統提供即時編輯介面。
    *   修改後 1 秒內，前端靜態資源 (CDN/Cache) 完成刷新或失效。

---

## 3. 非功能性需求 (Non-Functional Requirements)

### NFR-1: 效能基準 (Performance Benchmarks)
*   **目標:** 頁面首屏載入時間 (LCP) 在 3G 網路環境下需小於 2.5 秒。
*   **目標:** API P95 回應時間需在 300 毫秒以內。

### NFR-2: 高可用性 (Availability)
*   **目標:** 系統年度可用性 (SLA) 需達 99.9%。
*   **備份方案:** Cloud SQL 高可用配置 (Multi-AZ)，每 24 小時異地備份 (Cloud Storage)。

### NFR-3: 擴展性 (Scalability)
*   **架構:** 採用 Container-native 思維，支援在 GCE 上透過 Docker 自動擴展。
