import type { PaymentStatus } from "./order";

export type PaymentProvider =
  | "MANUAL"
  | "STRIPE"
  | "SQUARE"
  | "APPLE_PAY"
  | "GOOGLE_PAY";

export type PaymentMethod = "CARD" | "CASH" | "MANUAL" | "WALLET";

export interface Payment {
  id: number;
  paymentNumber: string;
  orderId: number;
  orderNumber: string;
  userEmail: string;
  provider: PaymentProvider;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  providerTransactionId?: string;
  failureReason?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInitiateRequest {
  orderNumber: string;
  method?: PaymentMethod;
  currency?: string;
}
