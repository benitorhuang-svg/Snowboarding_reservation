terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

variable "project_id" {
  description = "The ID of the GCP project"
  type        = string
  default     = "snowboarding-v2-dev"
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "asia-northeast1"
}

variable "zone" {
  description = "The GCP zone"
  type        = string
  default     = "asia-northeast1-a"
}

# 1. Cloud SQL (PostgreSQL)
resource "google_sql_database_instance" "main" {
  name             = "snow-db-instance"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-f1-micro"
    ip_configuration {
      ipv4_enabled = true
    }
  }
}

resource "google_sql_database" "database" {
  name     = "snowboarding_db"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "users" {
  name     = "snow_user"
  instance = google_sql_database_instance.main.name
  password = "changeme123" # Should be injected securely in production
}

# 2. Google Artifact Registry (GAR)
resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = "snowboarding-repo"
  description   = "Docker repository for snowboarding backend and frontend"
  format        = "DOCKER"
}

# 3. Google Compute Engine (GCE)
resource "google_compute_instance" "app_server" {
  name         = "snowboarding-app-server"
  machine_type = "e2-micro"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
      size  = 20
    }
  }

  network_interface {
    network = "default"
    access_config {
      // Ephemeral public IP
    }
  }

  tags = ["http-server", "https-server"]

  metadata_startup_script = <<-EOT
    #!/bin/bash
    echo "Starting startup script..."
    apt-get update
    apt-get install -y docker.io docker-compose
    systemctl start docker
    systemctl enable docker
  EOT
}

# Firewall rule for HTTP/HTTPS
resource "google_compute_firewall" "default" {
  name    = "allow-http-https"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80", "443", "3000", "5173"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server", "https-server"]
}
