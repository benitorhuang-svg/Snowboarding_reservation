# 06 - GCP 基礎設施與 DevOps 規格書

## 1. 雲端平台基礎 (Infrastructure)
*   **平台：** Google Cloud Platform (GCP)。
*   **地區：** `asia-east1` (台灣)。
*   **核心組件：**
    *   **Compute:** Google Compute Engine (GCE)。
        *   規格：`e2-medium` (開發期) / `e2-highcpu-4` (生產期)。
    *   **Database:** Cloud SQL for MySQL 8.0。
        *   規格：`db-n1-standard-1` (啟用高可用性 HA)。
    *   **Storage:** Cloud Storage (GCS)。
        *   用途：存放教練證照、課程照片、電子發票相關文件。
    *   **Caching:** Cloud Memorystore for Redis。

## 2. 部署流程 (CI/CD Pipeline)
我們將使用 **GitHub Actions** 作為 CI/CD 工具。

### 2.1 建置階段 (Build)
*   推送程式碼至 `main` 分支。
*   觸發 GitHub Actions。
*   **前端：** 執行 `pnpm build` 並將產出 (dist) 上傳至 GCS 或 Nginx。
*   **後端：** 執行 `Docker build` 並將 Image 上傳至 Google Artifact Registry (GAR)。

### 2.2 部署階段 (Deploy)
*   使用 SSH 指令通知 GCE 執行個體執行 `docker-compose pull` 與 `docker-compose up -d`。
*   執行資料庫遷移 (`Prisma Migrate` / `TypeORM Migration`)。

## 3. 備份與安全 (Backup & Security)
*   **資料庫備份：** 每日凌晨自動快照備份，保留 30 天。
*   **存取控制：** 使用 GCP IAM 權限管理，僅允許 CI/CD 服務帳號具備部署權限。
*   **SSL/TLS：** 使用 Let's Encrypt 或 Google Managed Certificates。
*   **日誌管理：** 整合 Cloud Logging，追蹤 API 異常與金流 Webhook 紀錄。
