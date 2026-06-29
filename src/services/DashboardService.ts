import axiosClient from "../api/axiosClient";

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalCategories: number;
  activeCategories: number;
  totalBrands: number;
  activeBrands: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  pendingPaymentCount: number;
}

const DashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await axiosClient.get<{ data: DashboardStats }>("/admin/dashboard/stats");
    return res.data.data;
  },
};

export default DashboardService;
