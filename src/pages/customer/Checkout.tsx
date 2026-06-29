import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { removeFromCart, decreaseQuantity, increaseQuantity } from "../../features/cart/store/cartSlice";
import axiosClient from "../../api/axiosClient";
import PaymentService from "../../services/PaymentService";
import type { AdminOrder } from "../../types/order";
import type { Payment } from "../../types/payment";
import { ROUTES } from "../../constants/routes";

interface ApiResponse<T> {
  data: T;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: "Payment Pending",
  PAID: "Paid",
  FAILED: "Payment Failed",
  REFUNDED: "Refunded",
  CANCELLED: "Cancelled",
};

const PAYMENT_STATUS_COLOR: Record<string, "warning" | "success" | "error" | "default"> = {
  PENDING: "warning",
  PAID: "success",
  FAILED: "error",
  REFUNDED: "default",
  CANCELLED: "default",
};

// ─── Success state ────────────────────────────────────────────────────────────

interface SuccessViewProps {
  order: AdminOrder;
  payment: Payment;
}

const SuccessView = ({ order, payment }: SuccessViewProps) => (
  <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
    <CheckCircleOutlineIcon sx={{ fontSize: 72, color: "success.main", mb: 2 }} />

    <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
      Order Placed!
    </Typography>
    <Typography color="text.secondary" sx={{ mb: 4 }}>
      Thank you for your order. We will confirm it once payment is received.
    </Typography>

    <Paper elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3, p: 3, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          ORDER NUMBER
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {order.orderNumber}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          PAYMENT REF
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {payment.paymentNumber}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          AMOUNT DUE
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {fmt(payment.amount)}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          PAYMENT STATUS
        </Typography>
        <Chip
          label={PAYMENT_STATUS_LABEL[payment.status] ?? payment.status}
          color={PAYMENT_STATUS_COLOR[payment.status] ?? "default"}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      </Box>
    </Paper>

    <Alert severity="info" sx={{ textAlign: "left", mb: 3 }}>
      Your payment is <strong>pending</strong>. Our team will review and confirm your order
      shortly. You will receive a confirmation email once the payment is approved.
    </Alert>

    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
      <Button component={RouterLink} to={ROUTES.PRODUCTS} variant="contained" size="large">
        Continue Shopping
      </Button>
      <Button component={RouterLink} to={ROUTES.MY_ORDERS} variant="outlined" size="large">
        View My Orders
      </Button>
    </Box>
  </Container>
);

// ─── Main Checkout page ───────────────────────────────────────────────────────

const Checkout = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [completedOrder, setCompletedOrder] = useState<AdminOrder | null>(null);
  const [completedPayment, setCompletedPayment] = useState<Payment | null>(null);

  // ── Cart empty guard ────────────────────────────────────────────────────────

  if (!completedOrder && cartItems.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <ShoppingCartIcon sx={{ fontSize: 72, color: "text.disabled", mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Add some products before checking out.
        </Typography>
        <Button component={RouterLink} to={ROUTES.PRODUCTS} variant="contained">
          Shop Products
        </Button>
      </Container>
    );
  }

  // ── Success state ───────────────────────────────────────────────────────────

  if (completedOrder && completedPayment) {
    return <SuccessView order={completedOrder} payment={completedPayment} />;
  }

  // ── Place order ─────────────────────────────────────────────────────────────

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      setError("Shipping address is required.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // Step 1: Create the order from the cart.
      const orderRes = await axiosClient.post<ApiResponse<AdminOrder>>("/orders/checkout", {
        shippingAddress: shippingAddress.trim(),
        billingAddress: billingAddress.trim() || undefined,
        customerNotes: customerNotes.trim() || undefined,
        couponCode: couponCode.trim() || undefined,
      });
      const order = orderRes.data.data;

      // Step 2: Initiate a MANUAL payment for the order.
      const payment = await PaymentService.initiate({
        orderNumber: order.orderNumber,
        method: "MANUAL",
        currency: "USD",
      });

      // Clear cart from Redux after successful checkout.
      cartItems.forEach((item) => dispatch(removeFromCart(item.productId)));

      setCompletedOrder(order);
      setCompletedPayment(payment);
      toast.success("Order placed successfully!");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to place order. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 4 }}>
        Checkout
      </Typography>

      <Grid container spacing={4}>
        {/* ── Left: Shipping form ────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Shipping Information
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Shipping Address"
                multiline
                rows={3}
                fullWidth
                required
                placeholder="Enter your full delivery address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
              <TextField
                label="Billing Address"
                multiline
                rows={2}
                fullWidth
                placeholder="Leave blank to use shipping address"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
              />
              <TextField
                label="Order Notes"
                multiline
                rows={2}
                fullWidth
                placeholder="Any special instructions for your order?"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
              />
              <TextField
                label="Coupon Code"
                fullWidth
                placeholder="Enter coupon code (optional)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* ── Right: Order summary ───────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Order Summary
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
              {cartItems.map((item) => (
                <Box
                  key={item.productId}
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                      <Button
                        size="small"
                        sx={{ minWidth: 24, p: 0, lineHeight: 1 }}
                        onClick={() => dispatch(decreaseQuantity(item.productId))}
                      >
                        −
                      </Button>
                      <Typography variant="caption">{item.quantity}</Typography>
                      <Button
                        size="small"
                        sx={{ minWidth: 24, p: 0, lineHeight: 1 }}
                        onClick={() => dispatch(increaseQuantity(item.productId))}
                      >
                        +
                      </Button>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {fmt(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="body2">Subtotal</Typography>
              <Typography variant="body2">{fmt(subtotal)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="body2">Shipping</Typography>
              <Typography variant="body2">Free</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Total
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                {fmt(subtotal)}
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 2, fontSize: 12 }}>
              Payment will be processed manually by our team after the order is placed.
            </Alert>

            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={loading || cartItems.length === 0}
              onClick={() => void handlePlaceOrder()}
              sx={{ fontWeight: 700, py: 1.5 }}
            >
              {loading ? "Placing Order…" : "Place Order"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
