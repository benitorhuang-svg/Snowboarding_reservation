import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InvoiceService } from './invoice.service';

@Injectable()
export class InvoiceListener {
  private readonly logger = new Logger(InvoiceListener.name);

  constructor(private readonly invoiceService: InvoiceService) {}

  @OnEvent('order.paid')
  async handleOrderPaidEvent(payload: { orderId: string }) {
    this.logger.log(
      `Received order.paid event for Order: ${payload.orderId}. Processing invoice...`,
    );

    try {
      const result = await this.invoiceService.issueInvoice(payload.orderId);
      this.logger.log(`Invoice successfully issued: ${result.invoiceNumber}`);
    } catch (error) {
      this.logger.error(
        `Failed to issue invoice for Order: ${payload.orderId}`,
        error,
      );
      // Here you could implement a retry mechanism or save to a dead-letter queue
    }
  }
}
