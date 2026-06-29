import axiosClient from "../api/axiosClient";
import type { ProductImage } from "../features/product/types/product";

const ProductImageService = {
  getImages: async (productId: number): Promise<ProductImage[]> => {
    const res = await axiosClient.get(`/api/products/${productId}/images`);
    return res.data.data;
  },

  uploadImage: async (
    productId: number,
    file: File,
    options?: { altText?: string; displayOrder?: number; isPrimary?: boolean }
  ): Promise<ProductImage> => {
    const formData = new FormData();
    formData.append("file", file);
    if (options?.altText) formData.append("altText", options.altText);
    if (options?.displayOrder !== undefined)
      formData.append("displayOrder", String(options.displayOrder));
    if (options?.isPrimary !== undefined)
      formData.append("isPrimary", String(options.isPrimary));

    const res = await axiosClient.post(
      `/api/admin/products/${productId}/images`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.data;
  },

  setPrimary: async (imageId: number): Promise<ProductImage> => {
    const res = await axiosClient.put(`/api/admin/products/images/${imageId}/primary`);
    return res.data.data;
  },

  deleteImage: async (imageId: number): Promise<void> => {
    await axiosClient.delete(`/api/admin/products/images/${imageId}`);
  },
};

export default ProductImageService;
