import axiosClient from "../api/axiosClient";
import type { ProductVariant } from "../features/product/types/product";

export interface ProductVariantRequest {
  name: string;
  value: string;
  sku?: string;
  priceAdjustment: number;
  stockQuantity: number;
  isActive?: boolean;
}

const VariantService = {
  getActiveVariants: async (productId: number): Promise<ProductVariant[]> => {
    const res = await axiosClient.get(`/api/products/${productId}/variants`);
    return res.data.data;
  },

  getAllVariants: async (productId: number): Promise<ProductVariant[]> => {
    const res = await axiosClient.get(`/api/admin/products/${productId}/variants`);
    return res.data.data;
  },

  createVariant: async (
    productId: number,
    request: ProductVariantRequest
  ): Promise<ProductVariant> => {
    const res = await axiosClient.post(
      `/api/admin/products/${productId}/variants`,
      request
    );
    return res.data.data;
  },

  updateVariant: async (
    variantId: number,
    request: ProductVariantRequest
  ): Promise<ProductVariant> => {
    const res = await axiosClient.put(
      `/api/admin/products/variants/${variantId}`,
      request
    );
    return res.data.data;
  },

  deleteVariant: async (variantId: number): Promise<void> => {
    await axiosClient.delete(`/api/admin/products/variants/${variantId}`);
  },
};

export default VariantService;
