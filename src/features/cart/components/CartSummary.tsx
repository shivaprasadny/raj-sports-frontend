import { Divider, Stack, Typography } from "@mui/material";
import AppCard from "../../../components/common/cards/AppCard";

interface CartSummaryProps {
  subtotal: number;
}

// CartSummary shows the calculated frontend-only cart subtotal.
const CartSummary = ({ subtotal }: CartSummaryProps) => {
  return (
    <AppCard>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Order Summary
        </Typography>
        <Divider />
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography>Subtotal</Typography>
          <Typography sx={{ fontWeight: 800 }}>${subtotal.toFixed(2)}</Typography>
        </Stack>
        <Typography color="text.secondary" variant="body2">
          Checkout is not connected yet.
        </Typography>
      </Stack>
    </AppCard>
  );
};

export default CartSummary;
