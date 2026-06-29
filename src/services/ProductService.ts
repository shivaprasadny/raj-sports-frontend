import axiosClient from "../api/axiosClient";
import type { Product } from "../features/product";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PageData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

interface ProductPayload {
  name: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  detailedDescription?: string;
  specifications?: string;
  careInstructions?: string;
  warrantyInfo?: string;
  sku: string;
  brandId: number;
  categoryId: number;
  price: number;
  salePrice?: number | string;
  stockQuantity: number;
  lowStockThreshold: number;
  imageUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export const ProductService = {
  async getAll(): Promise<Product[]> {
    const res = await axiosClient.get<ApiResponse<PageData<Product>>>(
      "/products?page=0&size=500"
    );
    return res.data.data.content;
  },

  async create(payload: Omit<ProductPayload, "lowStockThreshold"> & { lowStockThreshold?: number }): Promise<Product> {
    const res = await axiosClient.post<ApiResponse<Product>>("/products", {
      ...payload,
      lowStockThreshold: payload.lowStockThreshold ?? 5,
    });
    return res.data.data;
  },

  async update(id: number, payload: Omit<ProductPayload, "lowStockThreshold"> & { lowStockThreshold?: number }): Promise<Product> {
    const res = await axiosClient.put<ApiResponse<Product>>(`/products/${id}`, {
      ...payload,
      lowStockThreshold: payload.lowStockThreshold ?? 5,
    });
    return res.data.data;
  },

  async remove(id: number): Promise<void> {
    await axiosClient.delete(`/products/${id}`);
  },

  async uploadProductImage(productId: number, file: File): Promise<Product> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post<ApiResponse<Product>>(
      `/images/products/${productId}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  },
};
