import { Container } from "@mui/material";
import toast from "react-hot-toast";
import BestSellersSection from "../../features/home/components/BestSellersSection";
import CategorySection from "../../features/home/components/CategorySection";
import FeaturedProductsSection from "../../features/home/components/FeaturedProductsSection";
import HeroSection from "../../features/home/components/HeroSection";
import NewArrivalsSection from "../../features/home/components/NewArrivalsSection";
import { addToCart } from "../../features/cart";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { Product } from "../../features/product";

// Home composes small storefront sections with mock catalog data.
const Home = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.category.categories.filter((category) => category.isActive));
  const products = useAppSelector((state) => state.product.products.filter((product) => product.isActive));

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    toast.success("Added to cart.");
  };

  return (
    <>
      <HeroSection />
      <Container maxWidth="lg">
        <CategorySection categories={categories} />
        <FeaturedProductsSection products={products.filter((product) => product.isFeatured)} onAddToCart={handleAddToCart} />
        <BestSellersSection products={products.filter((product) => product.isBestSeller)} onAddToCart={handleAddToCart} />
        <NewArrivalsSection products={products.filter((product) => product.isNewArrival)} onAddToCart={handleAddToCart} />
      </Container>
    </>
  );
};

export default Home;
