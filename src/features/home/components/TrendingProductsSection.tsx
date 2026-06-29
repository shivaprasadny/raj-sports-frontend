import { Box, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import ProductCard from "../../product/components/ProductCard";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addToCart } from "../../cart";
import { ROUTES } from "../../../constants/routes";
import toast from "react-hot-toast";
import type { Product } from "../../product";

// TrendingProductsSection shows best-seller + new-arrival products, max 8.
const TrendingProductsSection = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) =>
    state.product.products.filter((p) => p.isActive && (p.isBestSeller || p.isNewArrival))
  ).slice(0, 8);

  if (products.length === 0) return null;

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    toast.success("Added to cart.");
  };

  return (
    <Box sx={{ py: 6 }}>
      <Box sx={{ alignItems: "center", display: "flex", gap: 1, mb: 1 }}>
        <WhatshotIcon sx={{ color: "error.main", fontSize: 32 }} />
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Trending Now
        </Typography>
      </Box>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Best sellers and new arrivals flying off the shelves
      </Typography>

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <ProductCard product={product} onAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          component={Link}
          to={ROUTES.PRODUCTS}
          variant="contained"
          size="large"
          disableElevation
          sx={{ fontWeight: 700, px: 5 }}
        >
          View All Products
        </Button>
      </Box>
    </Box>
  );
};

export default TrendingProductsSection;
