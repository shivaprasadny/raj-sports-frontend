import axiosClient from "../api/axiosClient";
import type { Product } from "../features/product";

// Generic wrapper the backend wraps every response body in.
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const ProductService = {
  /**
   * Uploads a product image to the backend.
   *
   * Endpoint : POST /api/images/products/{productId}/upload
   * Auth     : JWT is attached automatically by the axiosClient request interceptor.
   * Encoding : multipart/form-data — the field name must match the backend @RequestParam "file".
   *
   * The backend stores the file under /uploads/products/ and returns the full updated
   * Product object whose imageUrl holds the relative path (e.g. /uploads/products/abc.png).
   * Use getProductImageUrl() from utils/image to convert that path to an absolute browser URL.
   */
  async uploadProductImage(productId: number, file: File): Promise<Product> {
    // Build the multipart form body with the single required field.
    const formData = new FormData();
    formData.append("file", file);

    // axiosClient overrides Content-Type to multipart/form-data so Axios sets the boundary.
    const response = await axiosClient.post<ApiResponse<Product>>(
      `/images/products/${productId}/upload`,
      formData,
      {
        headers: {
          // Explicitly set so Axios generates the correct multipart boundary string.
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Return only the data payload; callers don't need the wrapper envelope.
    return response.data.data;
  },
};
