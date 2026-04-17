import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { firebaseAuth } from '../config/firebase.config';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { Role } from '@prisma/client';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: {
    sub: string;
    email: string;
    role: string;
    firebaseUid: string;
  };
}

/**
 * FirebaseAuthGuard ??Replaces the old Passport JWT guard.
 *
 * This guard:
 * 1. Extracts the Firebase ID Token from the Authorization header
 * 2. Verifies it with Firebase Admin SDK
 * 3. Finds or creates the corresponding local User record
 * 4. Attaches the full User object (with role) to request.user
 */
@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
      // 1. Verify Firebase ID Token
      const decodedToken = await firebaseAuth.verifyIdToken(idToken);

      // 2. Find or create local User
      let user = await this.prisma.user.findUnique({
        where: { firebaseUid: decodedToken.uid },
      });

      if (!user) {
        // Also try matching by email for existing accounts
        user = await this.prisma.user.findUnique({
          where: { email: decodedToken.email || '' },
        });

        if (user) {
          // Link existing email-based account to Firebase UID
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: { firebaseUid: decodedToken.uid },
          });
          this.logger.log(
            `Linked existing user ${user.email} to Firebase UID ${decodedToken.uid}`,
          );
        } else {
          // Auto-create new user on first Firebase login
          user = await this.prisma.user.create({
            data: {
              email: decodedToken.email || `firebase_${decodedToken.uid}@noemail.local`,
              firebaseUid: decodedToken.uid,
              name: (decodedToken.name as string) || null,
              role: Role.STUDENT,
              language: 'zh-TW',
            },
          });
          this.logger.log(`Auto-created user for Firebase UID ${decodedToken.uid}`);
        }
      }

      // 3. Attach user to request (compatible with RolesGuard)
      request.user = {
        sub: user.id,
        email: user.email,
        role: user.role,
        firebaseUid: decodedToken.uid,
      };

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Firebase token verification failed: ${message}`);
      throw new UnauthorizedException('Invalid or expired Firebase token');
    }
  }
}
