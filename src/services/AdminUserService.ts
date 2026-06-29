import axiosClient from "../api/axiosClient";

export type UserRole = "CUSTOMER" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const AdminUserService = {
  listUsers: async (params: {
    page?: number;
    size?: number;
    search?: string;
    role?: UserRole | "";
    isActive?: boolean | "";
  }): Promise<PageResponse<AdminUser>> => {
    const query: Record<string, unknown> = { page: params.page ?? 0, size: params.size ?? 20 };
    if (params.search) query.search = params.search;
    if (params.role) query.role = params.role;
    if (params.isActive !== "" && params.isActive !== undefined) query.isActive = params.isActive;
    const res = await axiosClient.get<{ data: PageResponse<AdminUser> }>("/admin/users", {
      params: query,
    });
    return res.data.data;
  },

  changeRole: async (userId: number, role: UserRole): Promise<AdminUser> => {
    const res = await axiosClient.put<{ data: AdminUser }>(`/admin/users/${userId}/role`, { role });
    return res.data.data;
  },

  toggleStatus: async (userId: number): Promise<AdminUser> => {
    const res = await axiosClient.put<{ data: AdminUser }>(`/admin/users/${userId}/status`);
    return res.data.data;
  },
};

export default AdminUserService;
