import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async upsertUser(
    firebaseUid: string,
    data: Prisma.UserUpdateInput,
    createData: Prisma.UserCreateInput,
  ) {
    return this.prisma.user.upsert({
      where: { firebaseUid },
      update: data,
      create: createData,
    });
  }

  async findUserByUid(firebaseUid: string) {
    return this.prisma.user.findUnique({
      where: { firebaseUid },
    });
  }
}
