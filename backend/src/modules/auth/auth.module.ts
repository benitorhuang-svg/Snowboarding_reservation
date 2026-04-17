import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { AuthRepository } from './repositories/auth.repository';

@Module({
  imports: [],
  providers: [AuthService, FirebaseAuthGuard, AuthRepository],
  controllers: [AuthController],
  exports: [AuthService, FirebaseAuthGuard, AuthRepository],
})
export class AuthModule {}
