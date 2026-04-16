import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('syncFirebaseUser', () => {
    it('should upsert user', async () => {
      const mockUser = { id: '1', email: 'test@test.com', firebaseUid: 'uid' };
      mockPrismaService.user.upsert.mockResolvedValue(mockUser);

      const result = await service.syncFirebaseUser('uid', 'test@test.com');
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.upsert).toHaveBeenCalled();
    });
  });

  describe('OTP', () => {
    it('should verify correct OTP', async () => {
      mockRedisService.get.mockResolvedValue('123456');
      const result = await service.verifyOtp('0912345678', '123456');
      expect(result.success).toBe(true);
      expect(mockRedisService.del).toHaveBeenCalled();
    });
  });
});
