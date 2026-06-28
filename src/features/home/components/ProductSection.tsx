import { Box, Grid, Typography } from "@mui/material";
import ProductCard from "../../product/components/ProductCard";
import type { Product } from "../../product";

interface ProductSectionProps {
  title: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

// ProductSection renders one reusable product rail for featured groups.
const ProductSection = ({ title, products, onAddToCart }: ProductSectionProps) => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
        {title}
      </Typography>
      {products.length === 0 ? (
        <Typography color="text.secondary">No products to show yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProductSection;
