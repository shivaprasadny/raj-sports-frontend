import { Box, CardMedia, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AppCard from "../../../components/common/cards/AppCard";
import PrimaryButton from "../../../components/common/buttons/PrimaryButton";
import StatusChip from "../../../components/common/chips/StatusChip";
import { getProductImageUrl } from "../../../utils/image";
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
        component="img"
        image={getProductImageUrl(product.imageUrl)}
        alt={product.name}
        sx={{
          bgcolor: "grey.100",
          borderRadius: 1,
          height: 160,
          mb: 2,
          objectFit: "cover",
          width: "100%",
        }}
      />
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
