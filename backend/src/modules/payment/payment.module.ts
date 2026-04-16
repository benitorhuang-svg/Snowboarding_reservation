import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { InvoiceModule } from '../invoice/invoice.module';
import { PrismaModule } from '../../core/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule, InvoiceModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
