import { HttpStatus } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { BusinessException } from '../filters/business-exception.filter';

export class OrderStatusValidator {
  private static readonly transitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.CREATED]: [OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED],
    [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PAID, OrderStatus.CANCELLED],
    [OrderStatus.PAID]: [
      OrderStatus.COMPLETED,
      OrderStatus.REFUND_REQUESTED,
      OrderStatus.REFUNDED,
    ],
    [OrderStatus.COMPLETED]: [OrderStatus.REFUND_REQUESTED, OrderStatus.REFUNDED],
    [OrderStatus.REFUND_REQUESTED]: [
      OrderStatus.REFUNDED,
      OrderStatus.PAID,
      OrderStatus.COMPLETED,
    ],
    [OrderStatus.REFUNDED]: [],
    [OrderStatus.CANCELLED]: [],
  };

  /**
   * Validates if the order can transition from currentStatus to targetStatus.
   * Throws a BusinessException if the transition is invalid.
   */
  static validate(currentStatus: OrderStatus, targetStatus: OrderStatus): void {
    if (currentStatus === targetStatus) {
      return; // Idempotent transition is allowed
    }

    const allowedNextStatuses = this.transitions[currentStatus];
    if (!allowedNextStatuses || !allowedNextStatuses.includes(targetStatus)) {
      throw new BusinessException(
        `Invalid order status transition from ${currentStatus} to ${targetStatus}`,
        'PAY_003',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
