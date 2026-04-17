import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceListener } from './listeners/invoice.listener';
import { InvoiceController } from './invoice.controller';
import { PrismaModule } from '../../core/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceListener],
  exports: [InvoiceService],
})
export class InvoiceModule {}
