import axiosClient from "../api/axiosClient";
import type { Brand } from "../features/brand/types/brand";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface BrandPayload {
  name: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export const BrandService = {
  async getAll(): Promise<Brand[]> {
    const res = await axiosClient.get<ApiResponse<Brand[]>>("/brands/active");
    return res.data.data;
  },

  async create(payload: BrandPayload): Promise<Brand> {
    const res = await axiosClient.post<ApiResponse<Brand>>("/brands", payload);
    return res.data.data;
  },

  async update(id: number, payload: BrandPayload): Promise<Brand> {
    const res = await axiosClient.put<ApiResponse<Brand>>(`/brands/${id}`, payload);
    return res.data.data;
  },

  async remove(id: number): Promise<void> {
    await axiosClient.delete(`/brands/${id}`);
  },
};
