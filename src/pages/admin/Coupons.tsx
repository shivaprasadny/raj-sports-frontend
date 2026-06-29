import { useState, useEffect, useCallback } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import toast from "react-hot-toast";
import CouponService from "../../services/CouponService";
import type { Coupon, CouponRequest, DiscountType } from "../../types/coupon";

const emptyForm = (): CouponRequest => ({
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: 10,
  minimumOrderAmount: undefined,
  maxDiscountAmount: undefined,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  usageLimit: undefined,
  isActive: true,
});

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CouponRequest>(emptyForm());
  const [saving, setSaving] = useState(false);

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await CouponService.getAllCoupons(0, 100);
      setCoupons(page.content);
    } catch {
      setError("Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      description: coupon.description ?? "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumOrderAmount: coupon.minimumOrderAmount,
      maxDiscountAmount: coupon.maxDiscountAmount,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      usageLimit: coupon.usageLimit,
      isActive: coupon.isActive,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) return toast.error("Code is required.");
    setSaving(true);
    try {
      if (editingId !== null) {
        await CouponService.updateCoupon(editingId, form);
        toast.success("Coupon updated.");
      } else {
        await CouponService.createCoupon(form);
        toast.success("Coupon created.");
      }
      setDialogOpen(false);
      loadCoupons();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Could not save coupon.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this coupon permanently?")) return;
    try {
      await CouponService.deleteCoupon(id);
      toast.success("Coupon deleted.");
      loadCoupons();
    } catch {
      toast.error("Could not delete coupon.");
    }
  };

  const isExpired = (endDate: string) => new Date(endDate) < new Date();

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Coupon Codes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          disableElevation
          sx={{ fontWeight: 700 }}
        >
          New Coupon
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : coupons.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
          <LocalOfferIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
          <Typography color="text.secondary">No coupons yet. Create your first promo code.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Discount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Min. Order</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Valid Period</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Usage</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: "monospace" }}>
                      {coupon.code}
                    </Typography>
                    {coupon.description && (
                      <Typography variant="caption" color="text.secondary">
                        {coupon.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue.toFixed(2)}`}
                    </Typography>
                    {coupon.maxDiscountAmount && coupon.discountType === "PERCENTAGE" && (
                      <Typography variant="caption" color="text.secondary">
                        Max: ${coupon.maxDiscountAmount.toFixed(2)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {coupon.minimumOrderAmount
                      ? `$${coupon.minimumOrderAmount.toFixed(2)}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{coupon.startDate}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      to {coupon.endDate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {coupon.usedCount}
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {!coupon.isActive ? (
                      <Chip label="Inactive" size="small" />
                    ) : isExpired(coupon.endDate) ? (
                      <Chip label="Expired" size="small" color="error" />
                    ) : (
                      <Chip label="Active" size="small" color="success" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(coupon)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(coupon.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ── Create / Edit Dialog ──────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingId !== null ? "Edit Coupon" : "New Coupon"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Code *"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                fullWidth
                size="small"
                slotProps={{ htmlInput: { maxLength: 50 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Discount Type *</InputLabel>
                <Select
                  value={form.discountType}
                  label="Discount Type *"
                  onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as DiscountType }))}
                >
                  <MenuItem value="PERCENTAGE">Percentage (%)</MenuItem>
                  <MenuItem value="FIXED_AMOUNT">Fixed Amount ($)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={`Discount Value * (${form.discountType === "PERCENTAGE" ? "%" : "$"})`}
                type="number"
                value={form.discountValue}
                onChange={(e) => setForm((f) => ({ ...f, discountValue: Number(e.target.value) }))}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Min. Order Amount ($)"
                type="number"
                value={form.minimumOrderAmount ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, minimumOrderAmount: e.target.value ? Number(e.target.value) : undefined }))}
                fullWidth
                size="small"
              />
            </Grid>
            {form.discountType === "PERCENTAGE" && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Max Discount Amount ($)"
                  type="number"
                  value={form.maxDiscountAmount ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, maxDiscountAmount: e.target.value ? Number(e.target.value) : undefined }))}
                  fullWidth
                  size="small"
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Start Date *"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                fullWidth
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="End Date *"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                fullWidth
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Usage Limit"
                type="number"
                value={form.usageLimit ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value ? Number(e.target.value) : undefined }))}
                fullWidth
                size="small"
                helperText="Leave blank for unlimited"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Description"
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                fullWidth
                size="small"
                slotProps={{ htmlInput: { maxLength: 500 } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isActive ?? true}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            disableElevation
            sx={{ fontWeight: 700 }}
          >
            {saving ? <CircularProgress size={18} /> : editingId !== null ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCoupons;
