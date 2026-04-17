# 06 - 基礎設施與 DevOps 實施計畫 (GCP & Local Dev)

## 1. 系統生命週期概覽 (System Lifecycle)

### 1.1 階段一：本地開發與調測 (Development Phase)

- **環境：** 個人開發主機 (Windows/macOS)。
- **資料庫：** **本地端 MySQL 8.0** (透過 Docker Compose 或原生安裝)。
- **快取：** 本地端 Redis (Docker)。
- **認證：** Firebase Auth (使用開發專案) + LINE Login Sandbox。
- **檔案存儲：** 本地檔案系統 (`/uploads` 目錄)。
- **目標：** 快速迭代 UI/UX 與核心業務邏輯，完善 API 規格。

### 1.2 階段二：雲端生產與部屬 (Production Phase)

- **平台：** Google Cloud Platform (GCP) `asia-east1` (台灣)。
- **計算資源：** Google Compute Engine (GCE) `e2-medium`。
- **受管資料庫：** **Cloud SQL for MySQL 8.0** (高可用性 HA 模式)。
- **分散式快取：** Cloud Memorystore for Redis。
- **檔案存儲：** Google Cloud Storage (GCS) 儲存桶。
- **認證：** Firebase Auth (生產專案) + LINE Login Production。
- **目標：** 確保系統具備 99.9% 可用性，支撐冬季滑雪旺季高併發預約。

---

## 2. 雲端平台基礎 (Cloud Infrastructure)

- **平台：** Google Cloud Platform (GCP)。
- **地區：** `asia-east1` (台灣)。
- **核心組件：**
  - **Compute:** Google Compute Engine (GCE)。
    - 規格：`e2-medium` (開發期) / `e2-highcpu-4` (生產期)。
  - **Database:** Cloud SQL for MySQL 8.0。
    - 規格：`db-n1-standard-1` (啟用高可用性 HA)。
  - **Storage:** Cloud Storage (GCS)。
    - 用途：存放教練證照、課程照片、電子發票相關文件。
  - **Caching:** Cloud Memorystore for Redis。

## 3. 部署流程 (CI/CD Pipeline)

我們將使用 **GitHub Actions** 作為 CI/CD 工具。

### 3.1 建置階段 (Build)

- 推送程式碼至 `main` 分支。
- 觸發 GitHub Actions。
- **前端：** 執行 `pnpm build` 並將產出 (dist) 上傳至 Firebase Hosting 或 GCE Caddy。
- **後端：** 執行 `Docker build` 並將 Image 上傳至 Google Artifact Registry (GAR)。

### 3.2 部署階段 (Deploy)

- 使用 SSH 指令通知 GCE 執行個體執行 `docker-compose pull` 與 `docker-compose up -d`。
- 執行資料庫遷移 (`npx prisma migrate deploy`)。

## 4. 備份與安全 (Backup & Security)

- **資料庫備份：** 每日凌晨自動快照備份，保留 30 天。
- **存取控制：** 使用 GCP IAM 權限管理，僅允許 CI/CD 服務帳號具備部署權限。
- **SSL/TLS：** 使用 Caddy 自動取得 Let's Encrypt 憑證。
- **日誌管理：** 整合 Cloud Logging，追蹤 API 異常與金流 Webhook 紀錄。

---

## 5. 本地開發環境 (Local Development)

為了確保開發環境與生產環境一致性，我們在專案根目錄提供 `docker-compose.yml`，包含以下服務：

- `db` (MySQL 8.0): 映射至本機 `3306` 埠，供本地端後端直接連線。
- `redis` (Redis 7): 用於分布式鎖、Session 快取與預約佔位。
- `phpmyadmin`: 提供視覺化管理介面於 `http://localhost:8080`。

### 快速啟動

```bash
# 於專案根目錄啟動本地基礎服務
docker compose up -d

# 進入 backend 目錄執行初始化
cd backend
npx prisma db push
npx prisma db seed
```

### 資料庫 URL 配置 (.env)

- **本地開發：** `DATABASE_URL="mysql://root:root@localhost:3306/snowboarding_v2"`
- **GCP 生產：** `DATABASE_URL="mysql://user:password@35.185.x.x:3306/snowboarding_v2"` (透過 Cloud SQL Auth Proxy 連線)

---

## 6. Firebase Authentication 設定

- **專案 ID：** 需於 [Firebase Console](https://console.firebase.google.com/) 建立專案。
- **啟用認證方式：** Email/Password, Google, Phone (OTP)。
- **LINE Login：** 透過後端 `firebase-admin.createCustomToken()` 實作 Custom Token 機制。
- **Service Account：** 下載 `serviceAccountKey.json` 放置於後端 `config/` 目錄（勿提交至 Git）。
