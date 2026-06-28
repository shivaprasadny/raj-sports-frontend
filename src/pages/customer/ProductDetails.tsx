import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { addToCart } from "../../features/cart";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getProductImageUrl } from "../../utils/image";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => state.product.products.find((item) => item.id === Number(id)));

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Product not found
          </Typography>
          <Typography color="text.secondary">The product may have been removed or is not available.</Typography>
        </Paper>
      </Container>
    );
  }

  const price = product.salePrice ?? product.price;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            src={getProductImageUrl(product.imageUrl)}
            alt={product.name}
            sx={{
              bgcolor: "grey.100",
              borderRadius: 2,
              height: { xs: 320, md: 440 },
              objectFit: "cover",
              width: "100%",
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
            {product.name}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            SKU: {product.sku}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
            ${price.toFixed(2)}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {product.description || product.shortDescription}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCartIcon />}
            disabled={product.stockQuantity <= 0}
            onClick={() => {
              dispatch(addToCart(product));
              toast.success("Added to cart.");
            }}
          >
            Add to Cart
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;
