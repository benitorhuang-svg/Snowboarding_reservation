#!/bin/bash

# Snowboarding V2 GCP Deployment Script
# Requirements: gcloud CLI, Terraform

echo "🚀 Starting Deployment to GCP..."

PROJECT_ID="snowboarding-v2-dev"
REGION="asia-east1"
ZONE="asia-east1-a"

gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION

# 1. Enable APIs
echo "Enabling necessary GCP APIs..."
gcloud services enable compute.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable logging.googleapis.com

# 2. Build and Push Docker Images
echo "Building and Pushing Docker Images to GAR..."
gcloud auth configure-docker $REGION-docker.pkg.dev
REPO_NAME="snowboarding-repo"

gcloud artifacts repositories create $REPO_NAME \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for Snowboarding app" || true

docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/backend:latest ./backend
docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/frontend:latest ./frontend

docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/backend:latest
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/frontend:latest

# 3. Deploy to Cloud Run (or GCE as per original spec)
echo "Deploying Backend to Cloud Run..."
gcloud run deploy backend-service \
    --image=$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/backend:latest \
    --region=$REGION \
    --allow-unauthenticated \
    --port=3000 \
    --set-env-vars DATABASE_URL="mysql://user:password@internal-db-ip:3306/snowboarding_v2"

echo "Deploying Frontend to Cloud Run..."
gcloud run deploy frontend-service \
    --image=$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/frontend:latest \
    --region=$REGION \
    --allow-unauthenticated \
    --port=80

echo "✅ Deployment Complete!"
