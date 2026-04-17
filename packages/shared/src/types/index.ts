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

export enum Language {
  ZH_TW = 'zh-TW',
  EN = 'en',
  JA = 'ja',
  ZH_HK = 'zh-HK',
}

export enum ErrorCode {
  AUTH_INVALID_CREDENTIALS = 'AUTH_001',
  AUTH_TOKEN_EXPIRED = 'AUTH_002',
  AUTH_UNAUTHORIZED = 'AUTH_003',
  AUTH_USER_EXISTS = 'AUTH_004',
  BOOK_SESSION_FULL = 'BOOK_001',
  BOOK_CONFLICT = 'BOOK_002',
  BOOK_NOT_FOUND = 'BOOK_003',
  PAY_FAILED = 'PAY_001',
  PAY_INVALID_PRIME = 'PAY_002',
}

// --- Domain Models ---

export interface User {
  id: string;
  email: string;
  role: Role | 'STUDENT' | 'COACH' | 'ADMIN';
  language: Language | string;
  name?: string;
  mobilePhone?: string;
  skillLevel?: string;
}

export interface Course {
  id: string;
  title: Record<string, string> | any;
  description: Record<string, string> | any;
  basePrice: number;
  type?: CourseType;
}

export interface Session {
  id: string;
  startTime: string | Date;
  endTime: string | Date;
  capacity: number;
  bookedCount: number;
  course: Course;
  coach: {
    user: {
      name: string;
      email: string;
    };
  };
}

export interface Booking {
  id: string;
  status: OrderStatus | string;
  totalAmount: number;
  createdAt?: string | Date;
  items: Array<{
    id: string;
    session: Session;
  }>;
}
