// CartItem stores the product snapshot needed for frontend-only cart totals.
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartState {
  items: CartItem[];
}
