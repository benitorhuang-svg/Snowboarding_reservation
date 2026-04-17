import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { Role } from '@prisma/client';
import { firebaseAuth } from './config/firebase.config';
import { BusinessException } from '../../common/filters/business-exception.filter';
import { RedisService } from '../../core/redis/redis.service';
import { RecaptchaResponse } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  /**
   * Sync a Firebase user to the local database.
   * Called after Firebase Auth login on the frontend.
   * Creates a new user if not found, or updates existing user.
   */
  async syncFirebaseUser(
    firebaseUid: string,
    email: string,
    profile?: {
      name?: string;
      mobilePhone?: string;
      language?: string;
      skillLevel?: string;
    },
  ) {
    this.logger.log(`Syncing user: ${email} (${firebaseUid})`);

    return this.prisma.user.upsert({
      where: { firebaseUid },
      update: {
        email,
        name: profile?.name,
        mobilePhone: profile?.mobilePhone,
        language: profile?.language,
        skillLevel: profile?.skillLevel,
      },
      create: {
        firebaseUid,
        email,
        role: Role.STUDENT, // Default role
        name: profile?.name,
        mobilePhone: profile?.mobilePhone,
        language: profile?.language || 'zh-TW',
        skillLevel: profile?.skillLevel || 'Beginner',
      },
    });
  }

  /**
   * Create a Firebase Custom Token for LINE Login users.
   */
  async createLineCustomToken(lineUserId: string, email: string) {
    try {
      const customToken = await firebaseAuth.createCustomToken(lineUserId, {
        provider: 'LINE',
        email,
      });
      return { customToken };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown';
      this.logger.error(`Failed to create Custom Token: ${message}`);
      throw new BusinessException(
        'LINE Auth failed',
        'AUTH_002',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendOtp(phone: string) {
    this.logger.log(`Simulating AWS SNS Publish API to send OTP to ${phone}`);
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Redis with 5 minutes expiration
    const key = `otp:${phone}`;
    await this.redis.set(key, code, 'EX', 300);

    // Simulate API delay and response
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, messageId: `sns-${Date.now()}` };
  }

  async verifyOtp(phone: string, code: string) {
    this.logger.log(`Verifying OTP for ${phone}`);
    const key = `otp:${phone}`;
    const storedCode = await this.redis.get(key);

    if (!storedCode) {
      throw new BusinessException(
        'OTP expired or not found',
        'AUTH_003',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (storedCode !== code) {
      throw new BusinessException('Invalid OTP code', 'AUTH_005', HttpStatus.BAD_REQUEST);
    }

    await this.redis.del(key);
    return { success: true };
  }

  async verifyRecaptcha(token: string): Promise<boolean> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    try {
      const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
      );
      const data = (await response.json()) as RecaptchaResponse;
      return data.success;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown';
      this.logger.error(`reCAPTCHA verification failed: ${message}`);
      return false;
    }
  }
}
