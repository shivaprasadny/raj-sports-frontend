import axiosClient from "../api/axiosClient";
import type { Payment, PaymentInitiateRequest } from "../types/payment";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const PaymentService = {
  // Customer
  initiate: async (request: PaymentInitiateRequest): Promise<Payment> => {
    const res = await axiosClient.post<ApiResponse<Payment>>("/payments/initiate", request);
    return res.data.data;
  },

  getByPaymentNumber: async (paymentNumber: string): Promise<Payment> => {
    const res = await axiosClient.get<ApiResponse<Payment>>(`/payments/${paymentNumber}`);
    return res.data.data;
  },

  // Admin
  getPaymentsForOrder: async (orderNumber: string): Promise<Payment[]> => {
    const res = await axiosClient.get<ApiResponse<Payment[]>>(
      `/admin/payments/order/${orderNumber}`
    );
    return res.data.data;
  },

  markPaid: async (paymentNumber: string, providerTransactionId?: string): Promise<Payment> => {
    const res = await axiosClient.post<ApiResponse<Payment>>(
      `/admin/payments/${paymentNumber}/mark-paid`,
      providerTransactionId ? { providerTransactionId } : {}
    );
    return res.data.data;
  },

  markFailed: async (paymentNumber: string, failureReason?: string): Promise<Payment> => {
    const res = await axiosClient.post<ApiResponse<Payment>>(
      `/admin/payments/${paymentNumber}/mark-failed`,
      failureReason ? { failureReason } : {}
    );
    return res.data.data;
  },

  refund: async (paymentNumber: string): Promise<Payment> => {
    const res = await axiosClient.post<ApiResponse<Payment>>(
      `/admin/payments/${paymentNumber}/refund`
    );
    return res.data.data;
  },
};

export default PaymentService;
