// Product is the frontend catalog shape used by admin, shop, and cart.
export interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  sku: string;
  brandId: number;
  categoryId: number;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
}

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
