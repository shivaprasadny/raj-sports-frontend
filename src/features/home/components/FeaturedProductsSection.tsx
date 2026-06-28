import ProductSection from "./ProductSection";
import type { Product } from "../../product";

// FeaturedProductsSection keeps home page composition readable.
const FeaturedProductsSection = ({ products, onAddToCart }: { products: Product[]; onAddToCart: (product: Product) => void }) => {
  return <ProductSection title="Featured Products" products={products} onAddToCart={onAddToCart} />;
};

export default FeaturedProductsSection;
