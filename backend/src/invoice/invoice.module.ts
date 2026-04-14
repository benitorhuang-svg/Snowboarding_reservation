import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceListener } from './invoice.listener';

@Module({
  providers: [InvoiceService, InvoiceListener],
  exports: [InvoiceService],
})
export class InvoiceModule {}
