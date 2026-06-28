import { Box, CardMedia, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AppCard from "../../../components/common/cards/AppCard";
import PrimaryButton from "../../../components/common/buttons/PrimaryButton";
import StatusChip from "../../../components/common/chips/StatusChip";
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

// ProductCard is shared by home sections and the shop grid.
const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const price = product.salePrice ?? product.price;

  return (
    <AppCard sx={{ display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="div"
        sx={{
          alignItems: "center",
          bgcolor: "grey.100",
          borderRadius: 1,
          display: "flex",
          height: 160,
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Typography color="text.secondary" variant="body2">
          {product.imageUrl ? "Product Image" : "Cricket Gear"}
        </Typography>
      </CardMedia>
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {product.name}
        </Typography>
        <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
          {product.shortDescription}
        </Typography>
        <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            ${price.toFixed(2)}
          </Typography>
          {product.salePrice ? <StatusChip label="Sale" color="error" /> : null}
        </Box>
        <PrimaryButton startIcon={<ShoppingCartIcon />} disabled={product.stockQuantity <= 0} onClick={() => onAddToCart?.(product)}>
          Add to Cart
        </PrimaryButton>
      </Box>
    </AppCard>
  );
};

export default ProductCard;
