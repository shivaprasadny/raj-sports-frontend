import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AppCard from "../../../components/common/cards/AppCard";
import CouponService from "../../../services/CouponService";
import type { CouponValidationResponse } from "../../../types/coupon";

interface CartSummaryProps {
  subtotal: number;
}

const CartSummary = ({ subtotal }: CartSummaryProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [couponResult, setCouponResult] = useState<CouponValidationResponse | null>(null);

  const discountAmount = couponResult?.valid ? (couponResult.discountAmount ?? 0) : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setApplying(true);
    try {
      const result = await CouponService.applyCoupon(code, subtotal);
      setCouponResult(result);
      if (!result.valid) {
        setCouponCode("");
      }
    } catch {
      setCouponResult({ valid: false, message: "Could not validate coupon. Please try again." });
      setCouponCode("");
    } finally {
      setApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponResult(null);
    setCouponCode("");
  };

  return (
    <AppCard>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Order Summary
        </Typography>
        <Divider />

        {/* Subtotal */}
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography>Subtotal</Typography>
          <Typography sx={{ fontWeight: 700 }}>${subtotal.toFixed(2)}</Typography>
        </Stack>

        {/* Coupon input — only when no valid coupon applied */}
        {!couponResult?.valid && (
          <Box>
            <TextField
              label="Promo Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              size="small"
              fullWidth
              placeholder="Enter coupon code"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApplyCoupon();
              }}
              disabled={applying}
            />
            <Button
              variant="outlined"
              fullWidth
              onClick={handleApplyCoupon}
              disabled={applying || !couponCode.trim()}
              sx={{ mt: 1, fontWeight: 700 }}
              size="small"
            >
              {applying ? <CircularProgress size={16} /> : "Apply"}
            </Button>
            {couponResult && !couponResult.valid && (
              <Alert severity="error" sx={{ mt: 1 }} variant="outlined">
                {couponResult.message}
              </Alert>
            )}
          </Box>
        )}

        {/* Applied coupon */}
        {couponResult?.valid && (
          <Box>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={couponResult.coupon?.code}
                  color="success"
                  size="small"
                  icon={<LocalOfferIcon />}
                />
                <Typography variant="body2" color="text.secondary">
                  {couponResult.coupon?.discountType === "PERCENTAGE"
                    ? `${couponResult.coupon.discountValue}% off`
                    : `$${couponResult.coupon?.discountValue?.toFixed(2)} off`}
                </Typography>
              </Box>
              <IconButton size="small" onClick={handleRemoveCoupon} aria-label="Remove coupon">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: "space-between", mt: 1 }}>
              <Typography color="success.main" sx={{ fontWeight: 600 }}>
                Discount
              </Typography>
              <Typography color="success.main" sx={{ fontWeight: 700 }}>
                -${discountAmount.toFixed(2)}
              </Typography>
            </Stack>
          </Box>
        )}

        <Divider />

        {/* Total */}
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Total
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900, color: "primary.main" }}>
            ${total.toFixed(2)}
          </Typography>
        </Stack>

        <Typography color="text.secondary" variant="caption">
          Taxes and shipping calculated at checkout.
        </Typography>
      </Stack>
    </AppCard>
  );
};

export default CartSummary;
