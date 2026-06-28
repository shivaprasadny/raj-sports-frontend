// Stock status values — mirrors the backend StockStatus enum.
// Calculated automatically by the backend from stockQuantity vs lowStockThreshold.
export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

// Inventory view of a product — mirrors the backend ProductResponse DTO.
// All fields come from GET /api/products (no extra endpoint needed).
// categoryName and brandName are included in the response for table display.
export interface InventoryProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
  // Threshold below which the backend marks the product as LOW_STOCK.
  lowStockThreshold: number;
  // Calculated by the backend — use this directly for the status chip.
  stockStatus: StockStatus;
  imageUrl: string | null;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  createdAt: string;
  updatedAt: string;
}
