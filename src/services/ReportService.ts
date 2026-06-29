import axiosClient from "../api/axiosClient";

export interface SalesReport {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface OrdersReport {
  startDate: string;
  endDate: string;
  totalOrders: number;
  statusBreakdown: StatusCount[];
}

export interface InventoryProduct {
  productId: number;
  productName: string;
  stock: number;
}

export interface InventoryReport {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  lowStockProductDetails: InventoryProduct[];
}

export interface CustomerReport {
  startDate: string;
  endDate: string;
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
}

const ReportService = {
  getSalesReport: async (startDate?: string, endDate?: string): Promise<SalesReport> => {
    const res = await axiosClient.get<{ data: SalesReport }>("/admin/reports/sales", {
      params: { startDate, endDate },
    });
    return res.data.data;
  },

  getOrdersReport: async (startDate?: string, endDate?: string): Promise<OrdersReport> => {
    const res = await axiosClient.get<{ data: OrdersReport }>("/admin/reports/orders", {
      params: { startDate, endDate },
    });
    return res.data.data;
  },

  getInventoryReport: async (): Promise<InventoryReport> => {
    const res = await axiosClient.get<{ data: InventoryReport }>("/admin/reports/inventory");
    return res.data.data;
  },

  getCustomerReport: async (startDate?: string, endDate?: string): Promise<CustomerReport> => {
    const res = await axiosClient.get<{ data: CustomerReport }>("/admin/reports/customers", {
      params: { startDate, endDate },
    });
    return res.data.data;
  },
};

export default ReportService;
