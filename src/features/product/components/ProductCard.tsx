import { Box, CardMedia, IconButton, Rating, Tooltip, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import AppCard from "../../../components/common/cards/AppCard";
import PrimaryButton from "../../../components/common/buttons/PrimaryButton";
import StatusChip from "../../../components/common/chips/StatusChip";
import { getProductImageUrl } from "../../../utils/image";
import { toggleWishlist } from "../../wishlist";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

// ProductCard is shared by home sections, the shop grid, and related-products rails.
// It handles wishlist toggle internally so every card stays in sync with Redux state.
const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  // Check if this product is in the wishlist to show the filled/outline heart.
  const isWishlisted = useAppSelector((state) =>
    state.wishlist.items.some((item) => item.id === product.id)
  );

  // Displayed price — sale price takes priority when present.
  const displayPrice = product.salePrice ?? product.price;

  // Discount percentage shown as a badge when a sale price is set.
  const discountPct =
    product.salePrice && product.salePrice < product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : null;

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <AppCard
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* ── Discount badge ──────────────────────────────────────────────── */}
      {discountPct && (
        <Box
          sx={{
            bgcolor: "error.main",
            borderRadius: "4px 0 8px 0",
            color: "white",
            fontSize: 11,
            fontWeight: 800,
            left: 0,
            position: "absolute",
            px: 1,
            py: 0.25,
            top: 0,
            zIndex: 1,
          }}
        >
          -{discountPct}%
        </Box>
      )}

      {/* ── Wishlist heart button ────────────────────────────────────────── */}
      <Tooltip title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
        <IconButton
          size="small"
          onClick={(e) => {
            // Prevent the Link wrapper from navigating when heart is clicked.
            e.preventDefault();
            dispatch(toggleWishlist(product));
          }}
          sx={{
            color: isWishlisted ? "error.main" : "grey.400",
            position: "absolute",
            right: 6,
            top: 6,
            zIndex: 1,
            bgcolor: "rgba(255,255,255,0.85)",
            "&:hover": { bgcolor: "white" },
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      {/* ── Product image — links to details page ───────────────────────── */}
      <Box
        component={Link}
        to={`/products/${product.id}`}
        sx={{ display: "block", textDecoration: "none" }}
      >
        <CardMedia
          component="img"
          image={getProductImageUrl(product.imageUrl)}
          alt={product.name}
          sx={{
            bgcolor: "grey.100",
            borderRadius: 1,
            height: 180,
            mb: 1.5,
            objectFit: "cover",
            width: "100%",
          }}
        />
      </Box>

      {/* ── Product info ────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: 0.75, px: 0.5 }}>
        {/* Product name — navigates to details */}
        <Typography
          component={Link}
          to={`/products/${product.id}`}
          variant="subtitle1"
          sx={{
            color: "text.primary",
            fontWeight: 800,
            lineHeight: 1.3,
            textDecoration: "none",
            "&:hover": { color: "primary.main" },
          }}
        >
          {product.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, lineHeight: 1.4 }}>
          {product.shortDescription}
        </Typography>

        {/* Star rating */}
        {(product.averageRating ?? 0) > 0 && (
          <Box sx={{ alignItems: "center", display: "flex", gap: 0.5 }}>
            <Rating value={product.averageRating ?? 0} precision={0.5} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">
              ({product.reviewCount ?? 0})
            </Typography>
          </Box>
        )}

        {/* Price row */}
        <Box sx={{ alignItems: "center", display: "flex", gap: 1, mt: 0.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: "primary.main" }}>
            ${displayPrice.toFixed(2)}
          </Typography>
          {product.salePrice && (
            <Typography
              variant="body2"
              color="text.disabled"
              sx={{ fontWeight: 500, textDecoration: "line-through" }}
            >
              ${product.price.toFixed(2)}
            </Typography>
          )}
        </Box>

        {/* Stock / sale status chips */}
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {isOutOfStock ? (
            <StatusChip label="Out of Stock" color="error" />
          ) : product.stockQuantity <= 5 ? (
            <StatusChip label="Low Stock" color="warning" />
          ) : null}
          {product.isNewArrival && <StatusChip label="New" color="info" />}
        </Box>

        {/* Add to Cart button */}
        <PrimaryButton
          startIcon={<ShoppingCartIcon />}
          disabled={isOutOfStock}
          onClick={() => onAddToCart?.(product)}
          sx={{ mt: 0.5 }}
          size="small"
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </PrimaryButton>
      </Box>
    </AppCard>
  );
};

export default ProductCard;
