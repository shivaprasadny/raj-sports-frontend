import axiosClient from '../api/axiosClient';
import type { InventoryProduct } from '../types/inventory';

// Generic wrapper the backend uses for every response body.
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination envelope returned by Spring Page-based endpoints.
interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Inventory API client.
 *
 * Inventory management reuses the existing product endpoints — no separate
 * inventory controller is needed on the backend.
 *
 * Backend base path: /api/products
 * Auth: GET routes are public; PUT requires SUPER_ADMIN / ADMIN / MANAGER JWT.
 */
export const InventoryService = {
  /**
   * Loads up to 200 products sorted alphabetically.
   * Client-side filtering is used for stock status and active flags.
   * Increase `size` if the catalog grows beyond 200 products.
   */
  async getAllProducts(): Promise<InventoryProduct[]> {
    const response = await axiosClient.get<ApiResponse<PageResponse<InventoryProduct>>>(
      '/products',
      { params: { page: 0, size: 200, sortBy: 'name', sortDir: 'asc' } }
    );
    return response.data.data.content;
  },

  /**
   * Updates only the stock quantity and low-stock threshold for one product.
   *
   * The backend PUT /api/products/{id} expects the full ProductRequest payload,
   * so all existing product fields are passed through unchanged; only
   * stockQuantity and lowStockThreshold are replaced with the new values.
   */
  async updateStock(
    product: InventoryProduct,
    stockQuantity: number,
    lowStockThreshold: number
  ): Promise<InventoryProduct> {
    // Build the full ProductRequest payload that the backend requires.
    const payload = {
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      salePrice: product.salePrice ?? undefined,
      // These are the two fields we actually want to change.
      stockQuantity,
      lowStockThreshold,
      imageUrl: product.imageUrl ?? undefined,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival,
      isActive: product.isActive,
      categoryId: product.categoryId,
      brandId: product.brandId,
    };

    const response = await axiosClient.put<ApiResponse<InventoryProduct>>(
      `/products/${product.id}`,
      payload
    );
    return response.data.data;
  },
};
