import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { OtpDto, SyncDto, LineDto } from './dto/auth.dto';

interface SyncUserResponse {
  success: boolean;
  user: unknown;
}

interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
    firebaseUid: string;
  };
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '同步 Firebase 使用者至本地 DB' })
  async syncUser(@Body() syncDto: SyncDto): Promise<SyncUserResponse> {
    const user = (await this.authService.syncFirebaseUser(
      syncDto.uid,
      syncDto.email,
      syncDto.profile,
    )) as unknown;
    return { success: true, user };
  }

  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: '獲取當前登入者資訊' })
  getMe(@Request() req: RequestWithUser) {
    // Already verified by Guard, user info is in req.user
    return { user: req.user };
  }

  @Post('line-login')
  @ApiOperation({ summary: 'LINE 登入 (返還 Firebase Custom Token)' })
  async lineLogin(@Body() lineDto: LineDto) {
    return this.authService.createLineCustomToken(lineDto.token, lineDto.email);
  }

  @Post('otp/send')
  @ApiOperation({ summary: '發送 OTP (僅限教練)' })
  async sendOtp(@Body() otpDto: OtpDto) {
    return this.authService.sendOtp(otpDto.phone);
  }

  @Post('otp/verify')
  @ApiOperation({ summary: '驗證 OTP' })
  async verifyOtp(@Body() otpDto: OtpDto) {
    if (!otpDto.code) throw new BadRequestException('OTP code is required');
    return this.authService.verifyOtp(otpDto.phone, otpDto.code);
  }
}
