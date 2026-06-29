import axiosClient from "../api/axiosClient";
import type { Category } from "../features/category/types/category";

interface CategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

// Category controller does NOT use CommonApiResponse — responses are unwrapped.
export const CategoryService = {
  async getAll(): Promise<Category[]> {
    const res = await axiosClient.get<Category[]>("/categories/active");
    return res.data;
  },

  async create(payload: CategoryPayload): Promise<Category> {
    const res = await axiosClient.post<Category>("/categories", payload);
    return res.data;
  },

  async update(id: number, payload: CategoryPayload): Promise<Category> {
    const res = await axiosClient.put<Category>(`/categories/${id}`, payload);
    return res.data;
  },

  async remove(id: number): Promise<void> {
    await axiosClient.delete(`/categories/${id}`);
  },
};
