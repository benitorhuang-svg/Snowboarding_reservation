import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Invoices & Reports')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get('coach-payout')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '?�出?�練?�潤?�表 (?��? Admin)' })
  async exportCoachPayout(
    @Query('year') year: string,
    @Query('month') month: string,
    @Res() res: Response,
  ) {
    const csv = await this.invoiceService.generateCoachPayoutReport(
      parseInt(year),
      parseInt(month),
    );
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=coach_payout_${year}_${month}.csv`,
    );
    res.send(csv);
  }
}
