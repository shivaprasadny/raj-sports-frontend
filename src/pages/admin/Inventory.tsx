import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import type { ChipProps } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import DataTable from '../../components/common/tables/DataTable';
import PageLoader from '../../components/common/loaders/PageLoader';
import PrimaryButton from '../../components/common/buttons/PrimaryButton';
import SecondaryButton from '../../components/common/buttons/SecondaryButton';
import StatusChip from '../../components/common/chips/StatusChip';
import { InventoryService } from '../../services/InventoryService';
import type { InventoryProduct, StockStatus } from '../../types/inventory';

// ─── Filter types ─────────────────────────────────────────────────────────────

// Available stock filters — ALL shows all products regardless of stock status.
type StockFilter = 'ALL' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'INACTIVE';

// ─── Stock status helpers ─────────────────────────────────────────────────────

// Human-readable label for each backend StockStatus enum value.
const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
};

// MUI Chip colour for each StockStatus value.
const stockStatusColor = (status: StockStatus): ChipProps['color'] => {
  if (status === 'IN_STOCK') return 'success';
  if (status === 'LOW_STOCK') return 'warning';
  return 'error';
};

// ─── Table column definitions ────────────────────────────────────────────────

const TABLE_COLUMNS = [
  { id: 'product', label: 'Product' },
  { id: 'sku', label: 'SKU' },
  { id: 'category', label: 'Category' },
  { id: 'brand', label: 'Brand' },
  { id: 'stock', label: 'Stock Qty' },
  { id: 'threshold', label: 'Threshold' },
  { id: 'stockStatus', label: 'Stock Status' },
  { id: 'active', label: 'Active' },
  { id: 'actions', label: 'Edit', align: 'right' as const },
];

// Filter button config — label and the filter value it sets.
const FILTER_BUTTONS: { label: string; value: StockFilter }[] = [
  { label: 'All Products', value: 'ALL' },
  { label: 'Low Stock', value: 'LOW_STOCK' },
  { label: 'Out of Stock', value: 'OUT_OF_STOCK' },
  { label: 'Inactive', value: 'INACTIVE' },
];

// ─── Component ───────────────────────────────────────────────────────────────

// Inventory connects to GET /api/products and PUT /api/products/{id}
// to let admins view and update stock quantities and low-stock thresholds.
const Inventory = () => {
  // ── Data state ────────────────────────────────────────────────────────────
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Active stock filter ───────────────────────────────────────────────────
  const [stockFilter, setStockFilter] = useState<StockFilter>('ALL');

  // ── Quick-edit dialog state ───────────────────────────────────────────────
  // Product whose stock fields are being edited.
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);
  // Controlled values for the two editable fields inside the dialog.
  const [editQty, setEditQty] = useState<string>('');
  const [editThreshold, setEditThreshold] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // ── Data loading ──────────────────────────────────────────────────────────

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await InventoryService.getAllProducts();
      setProducts(data);
    } catch {
      setError('Failed to load inventory. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  // ── Client-side filtering ─────────────────────────────────────────────────

  const filteredProducts = products.filter((p) => {
    if (stockFilter === 'LOW_STOCK') return p.stockStatus === 'LOW_STOCK';
    if (stockFilter === 'OUT_OF_STOCK') return p.stockStatus === 'OUT_OF_STOCK';
    if (stockFilter === 'INACTIVE') return !p.isActive;
    return true; // ALL
  });

  // ── Quick-edit handlers ───────────────────────────────────────────────────

  // Opens the edit dialog and seeds the input fields from the current product values.
  const openEdit = (product: InventoryProduct) => {
    setEditingProduct(product);
    setEditQty(String(product.stockQuantity));
    setEditThreshold(String(product.lowStockThreshold));
  };

  const closeEdit = () => {
    setEditingProduct(null);
    setEditQty('');
    setEditThreshold('');
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    const qty = parseInt(editQty, 10);
    const threshold = parseInt(editThreshold, 10);

    // Validate before sending to the backend.
    if (isNaN(qty) || qty < 0) {
      toast.error('Stock quantity must be 0 or greater.');
      return;
    }
    if (isNaN(threshold) || threshold < 0) {
      toast.error('Low stock threshold must be 0 or greater.');
      return;
    }

    setSaving(true);
    try {
      // InventoryService sends the full ProductRequest with all existing fields
      // unchanged except stockQuantity and lowStockThreshold.
      const updated = await InventoryService.updateStock(editingProduct, qty, threshold);

      // Replace the updated product in local state — no full reload needed.
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.success(`Stock updated for ${updated.name}.`);
      closeEdit();
    } catch {
      toast.error('Failed to update stock. Check the console for details.');
    } finally {
      setSaving(false);
    }
  };

  // ── Derived summary counts for the filter button badges ──────────────────

  const lowStockCount = products.filter((p) => p.stockStatus === 'LOW_STOCK').length;
  const outOfStockCount = products.filter((p) => p.stockStatus === 'OUT_OF_STOCK').length;
  const inactiveCount = products.filter((p) => !p.isActive).length;

  const badgeCount = (filter: StockFilter): number | null => {
    if (filter === 'LOW_STOCK') return lowStockCount;
    if (filter === 'OUT_OF_STOCK') return outOfStockCount;
    if (filter === 'INACTIVE') return inactiveCount;
    return null;
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box>
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Inventory
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {products.length} product{products.length !== 1 ? 's' : ''}
            {filteredProducts.length !== products.length &&
              ` · ${filteredProducts.length} shown`}
          </Typography>
        </Box>
        <PrimaryButton startIcon={<RefreshIcon />} onClick={() => void loadProducts()}>
          Refresh
        </PrimaryButton>
      </Box>

      {/* ── Stock filter buttons ───────────────────────────────────────────── */}
      <ButtonGroup variant="outlined" sx={{ mb: 3 }}>
        {FILTER_BUTTONS.map((btn) => {
          const count = badgeCount(btn.value);
          return (
            <Button
              key={btn.value}
              variant={stockFilter === btn.value ? 'contained' : 'outlined'}
              onClick={() => setStockFilter(btn.value)}
              disableElevation
              // Highlight buttons for actionable stock states.
              color={
                btn.value === 'OUT_OF_STOCK'
                  ? 'error'
                  : btn.value === 'LOW_STOCK'
                  ? 'warning'
                  : 'primary'
              }
            >
              {btn.label}
              {count !== null && count > 0 && (
                <Chip
                  label={count}
                  size="small"
                  sx={{ ml: 1, height: 18, fontSize: 11, fontWeight: 800 }}
                />
              )}
            </Button>
          );
        })}
      </ButtonGroup>

      {/* ── Error state ───────────────────────────────────────────────────── */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* ── Loading / table ───────────────────────────────────────────────── */}
      {loading ? (
        <PageLoader />
      ) : (
        <DataTable
          columns={TABLE_COLUMNS}
          isEmpty={filteredProducts.length === 0}
          emptyTitle="No products match this filter"
          emptyDescription="Try switching to 'All Products'."
        >
          {filteredProducts.map((product) => (
            <TableRow
              key={product.id}
              hover
              // Highlight out-of-stock rows subtly for quick visual scanning.
              sx={product.stockStatus === 'OUT_OF_STOCK' ? { bgcolor: 'error.50' } : undefined}
            >
              {/* Product name — bold for quick scanning */}
              <TableCell sx={{ fontWeight: 700, maxWidth: 200 }}>
                {product.name}
              </TableCell>

              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.categoryName}</TableCell>
              <TableCell>{product.brandName}</TableCell>

              {/* Current stock quantity — highlighted red when zero */}
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: product.stockQuantity === 0 ? 'error.main' : 'text.primary',
                  }}
                >
                  {product.stockQuantity}
                </Typography>
              </TableCell>

              {/* Low-stock threshold — the value below which backend marks LOW_STOCK */}
              <TableCell>{product.lowStockThreshold}</TableCell>

              {/* Stock status chip — value comes directly from the backend enum */}
              <TableCell>
                <Chip
                  label={STOCK_STATUS_LABELS[product.stockStatus]}
                  color={stockStatusColor(product.stockStatus)}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </TableCell>

              {/* Active status chip */}
              <TableCell>
                <StatusChip
                  label={product.isActive ? 'Active' : 'Inactive'}
                  color={product.isActive ? 'success' : 'default'}
                />
              </TableCell>

              {/* Quick-edit button — opens the stock-edit dialog */}
              <TableCell align="right">
                <IconButton
                  size="small"
                  color="primary"
                  title="Edit stock"
                  onClick={() => openEdit(product)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      )}

      {/* ── Quick Edit Stock dialog ───────────────────────────────────────── */}
      <Dialog
        open={Boolean(editingProduct)}
        onClose={closeEdit}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Edit Stock — {editingProduct?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Change stock quantity or the threshold used to calculate LOW_STOCK status.
          </Typography>

          {/* Stock quantity field */}
          <TextField
            label="Stock Quantity"
            type="number"
            fullWidth
            size="small"
            value={editQty}
            onChange={(e) => setEditQty(e.target.value)}
            slotProps={{ htmlInput: { min: 0 } }}
            sx={{ mb: 2 }}
          />

          {/* Low-stock threshold field */}
          <TextField
            label="Low Stock Threshold"
            type="number"
            fullWidth
            size="small"
            value={editThreshold}
            onChange={(e) => setEditThreshold(e.target.value)}
            slotProps={{ htmlInput: { min: 0 } }}
            helperText="When stock falls to or below this number, the product is marked LOW_STOCK."
          />
        </DialogContent>

        <DialogActions>
          <SecondaryButton onClick={closeEdit}>Cancel</SecondaryButton>
          <PrimaryButton onClick={() => void handleSave()} disabled={saving}>
            {saving ? 'Saving…' : 'Save Stock'}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
