// Order lifecycle status values — mirrors the backend OrderStatus enum.
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

// Payment status values — mirrors the backend PaymentStatus enum.
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

// One line item inside an order — mirrors backend OrderItemResponse DTO.
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Full admin order — mirrors backend OrderResponse DTO.
export interface AdminOrder {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  grandTotal: number;
  shippingAddress: string | null;
  billingAddress: string | null;
  customerNotes: string | null;
  userId: number;
  // Backend includes the customer email in the order response.
  userEmail: string;
  items: OrderItem[];
  // ISO-8601 timestamp strings from LocalDateTime fields.
  createdAt: string;
  updatedAt: string;
}
