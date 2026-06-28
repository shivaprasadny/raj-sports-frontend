import { Container, Grid, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import CartItemsTable from "../components/CartItemsTable";
import CartSummary from "../components/CartSummary";
import { decreaseQuantity, increaseQuantity, removeFromCart } from "../store/cartSlice";

// CartPage calculates totals from Redux cart state.
const CartPage = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
        Cart
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <CartItemsTable
            items={items}
            onIncrease={(productId) => dispatch(increaseQuantity(productId))}
            onDecrease={(productId) => dispatch(decreaseQuantity(productId))}
            onRemove={(productId) => dispatch(removeFromCart(productId))}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CartSummary subtotal={subtotal} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
