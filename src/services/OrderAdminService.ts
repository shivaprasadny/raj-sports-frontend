import axiosClient from '../api/axiosClient';
import type { AdminOrder, OrderStatus, PaymentStatus } from '../types/order';

// Generic wrapper the backend uses for every response body.
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination envelope returned by Spring Page-based endpoints.
interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * Admin order API client.
 *
 * All endpoints are secured with @PreAuthorize SUPER_ADMIN / ADMIN / MANAGER.
 * The JWT token is attached automatically by the axiosClient request interceptor.
 *
 * Backend base path: /api/admin/orders
 */
export const OrderAdminService = {
  /**
   * Fetches a page of all orders sorted newest-first.
   * Filtering by status or email is done client-side because the backend
   * GET /api/admin/orders endpoint does not yet support query params for those.
   */
  async getOrders(page = 0, size = 100): Promise<PageResponse<AdminOrder>> {
    const response = await axiosClient.get<ApiResponse<PageResponse<AdminOrder>>>(
      '/admin/orders',
      { params: { page, size, sortBy: 'createdAt', sortDir: 'desc' } }
    );
    return response.data.data;
  },

  /**
   * Updates the lifecycle status of one order.
   * Body: { status: OrderStatus }
   * Endpoint: PUT /api/admin/orders/{id}/status
   */
  async updateOrderStatus(id: number, status: OrderStatus): Promise<AdminOrder> {
    const response = await axiosClient.put<ApiResponse<AdminOrder>>(
      `/admin/orders/${id}/status`,
      { status }
    );
    return response.data.data;
  },

  /**
   * Updates the payment status of one order.
   * Body: { paymentStatus: PaymentStatus }
   * Endpoint: PUT /api/admin/orders/{id}/payment-status
   */
  async updatePaymentStatus(id: number, paymentStatus: PaymentStatus): Promise<AdminOrder> {
    const response = await axiosClient.put<ApiResponse<AdminOrder>>(
      `/admin/orders/${id}/payment-status`,
      { paymentStatus }
    );
    return response.data.data;
  },

  /**
   * Cancels one order by setting its status to CANCELLED.
   * Endpoint: DELETE /api/admin/orders/{id}/cancel
   */
  async cancelOrder(id: number): Promise<AdminOrder> {
    const response = await axiosClient.delete<ApiResponse<AdminOrder>>(
      `/admin/orders/${id}/cancel`
    );
    return response.data.data;
  },
};
