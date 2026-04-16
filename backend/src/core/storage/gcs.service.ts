import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Storage, Bucket } from '@google-cloud/storage';

interface ExpressFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

@Injectable()
export class GcsService {
  private readonly logger = new Logger(GcsService.name);
  private readonly bucketName = process.env.GCS_BUCKET_NAME || 'snowboarding-v2-assets';
  private storage: Storage;

  constructor() {
    this.logger.log(`GCS Service Initialized. Target Bucket: ${this.bucketName}`);
    this.storage = new Storage();
  }

  /**
   * Upload a file to Google Cloud Storage.
   * Currently mocked to save locally for development unless production.
   */
  async uploadFile(file: ExpressFile, destinationFolder: string): Promise<string> {
    const isProduction = process.env.NODE_ENV === 'production';
    const hasCredentials = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (!isProduction && !hasCredentials) {
      this.logger.log(`Mock Upload: Saving ${file.originalname} locally`);
      const uploadDir = path.join(process.cwd(), 'uploads', destinationFolder);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const uniqueName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadDir, uniqueName);
      fs.writeFileSync(filePath, file.buffer);

      return `/uploads/${destinationFolder}/${uniqueName}`;
    }

    try {
      this.logger.log(`Uploading ${file.originalname} to GCS bucket ${this.bucketName}`);
      const bucket: Bucket = this.storage.bucket(this.bucketName);
      const uniqueName = `${Date.now()}-${file.originalname}`;
      const blob = bucket.file(`${destinationFolder}/${uniqueName}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });

      return new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
          this.logger.error(`GCS Upload Error: ${err.message}`);
          reject(err);
        });

        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${destinationFolder}/${uniqueName}`;
          resolve(publicUrl);
        });

        blobStream.end(file.buffer);
      });
    } catch (error) {
      this.logger.error(
        `GCS Client Error: ${error instanceof Error ? error.message : error}`,
      );
      throw error;
    }
  }
}
