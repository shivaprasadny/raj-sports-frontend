import { Box, Button, Container, Grid, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { addToCart } from "../../features/cart";
import { removeFromWishlist } from "../../features/wishlist";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getProductImageUrl } from "../../utils/image";
import { ROUTES } from "../../constants/routes";
import type { Product } from "../../features/product";

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.wishlist.items);

  const handleMoveToCart = (product: Product) => {
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(product.id));
    toast.success(`${product.name} moved to cart.`);
  };

  const handleRemove = (product: Product) => {
    dispatch(removeFromWishlist(product.id));
    toast(`${product.name} removed from wishlist.`, { icon: "💔" });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Box sx={{ alignItems: "center", display: "flex", gap: 2, mb: 4 }}>
        <FavoriteIcon sx={{ color: "error.main", fontSize: 32 }} />
        <Typography variant="h3" sx={{ fontWeight: 900 }}>
          Wishlist
        </Typography>
        <Typography color="text.secondary">({items.length} items)</Typography>
      </Box>

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {items.length === 0 && (
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            py: 10,
            textAlign: "center",
          }}
        >
          <FavoriteIcon sx={{ color: "grey.300", fontSize: 64, mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Your wishlist is empty
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Save items you love by clicking the heart icon on any product.
          </Typography>
          <Button component={Link} to={ROUTES.PRODUCTS} variant="contained" disableElevation>
            Browse Products
          </Button>
        </Box>
      )}

      {/* ── Wishlist items ───────────────────────────────────────────────── */}
      {items.length > 0 && (
        <>
          <Grid container spacing={2}>
            {items.map((product) => {
              const displayPrice = product.salePrice ?? product.price;
              const isOutOfStock = product.stockQuantity <= 0;

              return (
                <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 3,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      overflow: "hidden",
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: 4 },
                    }}
                  >
                    {/* Product image */}
                    <Box
                      component={Link}
                      to={`/products/${product.id}`}
                      sx={{ display: "block", textDecoration: "none" }}
                    >
                      <Box
                        component="img"
                        src={getProductImageUrl(product.imageUrl)}
                        alt={product.name}
                        sx={{
                          bgcolor: "grey.100",
                          height: 160,
                          objectFit: "cover",
                          width: "100%",
                        }}
                      />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: 1, p: 2 }}>
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

                      <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 900 }}>
                        ${displayPrice.toFixed(2)}
                      </Typography>

                      {isOutOfStock && (
                        <Typography variant="caption" color="error.main" sx={{ fontWeight: 700 }}>
                          Out of Stock
                        </Typography>
                      )}

                      {/* Action buttons */}
                      <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ShoppingCartIcon />}
                          disabled={isOutOfStock}
                          onClick={() => handleMoveToCart(product)}
                          disableElevation
                          sx={{ flex: 1, fontWeight: 700 }}
                        >
                          Move to Cart
                        </Button>

                        <Tooltip title="Remove from wishlist">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemove(product)}
                            aria-label="Remove from wishlist"
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          {/* Move all to cart */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                items.forEach((p) => dispatch(removeFromWishlist(p.id)));
                toast("Wishlist cleared.", { icon: "🗑️" });
              }}
            >
              Clear Wishlist
            </Button>
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              disableElevation
              onClick={() => {
                const available = items.filter((p) => p.stockQuantity > 0);
                available.forEach((p) => {
                  dispatch(addToCart(p));
                  dispatch(removeFromWishlist(p.id));
                });
                toast.success(`${available.length} item(s) moved to cart.`);
              }}
              sx={{ fontWeight: 700 }}
            >
              Move All to Cart
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Wishlist;
