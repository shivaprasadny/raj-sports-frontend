import ProductSection from "./ProductSection";
import type { Product } from "../../product";

// BestSellersSection lists products marked as best sellers in mock state.
const BestSellersSection = ({ products, onAddToCart }: { products: Product[]; onAddToCart: (product: Product) => void }) => {
  return <ProductSection title="Best Sellers" products={products} onAddToCart={onAddToCart} />;
};

export default BestSellersSection;
