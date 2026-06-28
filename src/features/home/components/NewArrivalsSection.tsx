import ProductSection from "./ProductSection";
import type { Product } from "../../product";

// NewArrivalsSection lists recently highlighted mock products.
const NewArrivalsSection = ({ products, onAddToCart }: { products: Product[]; onAddToCart: (product: Product) => void }) => {
  return <ProductSection title="New Arrivals" products={products} onAddToCart={onAddToCart} />;
};

export default NewArrivalsSection;
