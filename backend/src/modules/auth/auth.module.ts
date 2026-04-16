import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { PrismaModule } from '../../core/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AuthService, FirebaseAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, FirebaseAuthGuard],
})
export class AuthModule {}
