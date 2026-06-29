export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  value: string;
  sku?: string;
  priceAdjustment: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

// Product is the frontend catalog shape used by admin, shop, and cart.
export interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  detailedDescription?: string;
  specifications?: string;
  careInstructions?: string;
  warrantyInfo?: string;
  sku: string;
  brandId: number;
  brandName?: string;
  categoryId: number;
  categoryName?: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  stockStatus?: StockStatus | BackendStockStatus;
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  averageRating?: number;
  reviewCount?: number;
  variants?: ProductVariant[];
  images?: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
export type BackendStockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
