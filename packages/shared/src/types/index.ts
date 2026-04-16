export enum Role {
  STUDENT = 'STUDENT',
  COACH = 'COACH',
  ADMIN = 'ADMIN',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  LINE = 'LINE',
}

export enum CourseType {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
  PACKAGE = 'PACKAGE',
  CAMP = 'CAMP',
}

export enum OrderStatus {
  CREATED = 'CREATED',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  REFUND_REQUESTED = 'REFUND_REQUESTED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export enum InvoiceType {
  TWO_ROLL = 'TWO_ROLL',
  THREE_ROLL = 'THREE_ROLL',
  CARRIER = 'CARRIER',
  DONATE = 'DONATE',
}

export interface User {
  id: string;
  email: string;
  role: Role | 'STUDENT' | 'COACH' | 'ADMIN';
  language: string;
  name?: string;
  mobilePhone?: string;
  skillLevel?: string;
}
