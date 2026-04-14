import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async issueInvoice(orderId: string) {
    // Mocking Electronic Invoice API (e.g., Ecpay/Whalefee)
    const invoiceNumber =
      'BK-' +
      Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, '0');

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        invoiceStatus: 'ISSUED',
        invoiceNumber: invoiceNumber,
      },
    });

    return { invoiceNumber };
  }
}
