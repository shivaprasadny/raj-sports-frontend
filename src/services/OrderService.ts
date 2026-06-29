import axiosClient from "../api/axiosClient";

export interface OrderItem {
  productId: number;
  productName: string;
  variantId?: number;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const OrderService = {
  getMyOrders: async (page = 0, size = 10): Promise<PageResponse<Order>> => {
    const res = await axiosClient.get<{ data: PageResponse<Order> }>("/orders/my-orders", {
      params: { page, size, sortBy: "createdAt", sortDir: "desc" },
    });
    return res.data.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const res = await axiosClient.get<{ data: Order }>(`/orders/${id}`);
    return res.data.data;
  },
};

export default OrderService;
