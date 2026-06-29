import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PaymentIcon from '@mui/icons-material/Payment';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReplayIcon from '@mui/icons-material/Replay';
import SearchIcon from '@mui/icons-material/Search';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { ChipProps } from '@mui/material';
import AppSelect from '../../components/common/inputs/AppSelect';
import ConfirmDialog from '../../components/common/dialogs/ConfirmDialog';
import DataTable from '../../components/common/tables/DataTable';
import PageLoader from '../../components/common/loaders/PageLoader';
import PrimaryButton from '../../components/common/buttons/PrimaryButton';
import SecondaryButton from '../../components/common/buttons/SecondaryButton';
import { OrderAdminService } from '../../services/OrderAdminService';
import PaymentService from '../../services/PaymentService';
import type { AdminOrder, OrderStatus, PaymentStatus } from '../../types/order';
import type { Payment } from '../../types/payment';

// ─── Label and color helpers ─────────────────────────────────────────────────

// Human-readable labels for each OrderStatus enum value.
const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
};

// Human-readable labels for each PaymentStatus enum value.
const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
  CANCELLED: 'Cancelled',
};

// Maps each order status to a MUI Chip colour.
const orderStatusColor = (status: OrderStatus): ChipProps['color'] => {
  const map: Record<OrderStatus, ChipProps['color']> = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    PROCESSING: 'info',
    PACKED: 'info',
    SHIPPED: 'primary',
    DELIVERED: 'success',
    CANCELLED: 'error',
    REFUNDED: 'default',
  };
  return map[status];
};

// Maps each payment status to a MUI Chip colour.
const paymentStatusColor = (status: PaymentStatus): ChipProps['color'] => {
  const map: Record<PaymentStatus, ChipProps['color']> = {
    PENDING: 'warning',
    PAID: 'success',
    FAILED: 'error',
    REFUNDED: 'default',
    CANCELLED: 'default',
  };
  return map[status] ?? 'default';
};

// ─── Select option arrays ─────────────────────────────────────────────────────

// All order status values available in the status-update dropdown.
const ORDER_STATUS_OPTIONS = (Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => ({
  label: ORDER_STATUS_LABELS[s],
  value: s,
}));

// All payment status values available in the payment-update dropdown.
const PAYMENT_STATUS_OPTIONS = (Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[]).map((s) => ({
  label: PAYMENT_STATUS_LABELS[s],
  value: s,
}));

// "All" + each order status for the filter dropdown.
const STATUS_FILTER_OPTIONS = [
  { label: 'All Statuses', value: '' },
  ...ORDER_STATUS_OPTIONS,
];

// "All" + each payment status for the filter dropdown.
const PAYMENT_FILTER_OPTIONS = [
  { label: 'All Payments', value: '' },
  ...PAYMENT_STATUS_OPTIONS,
];

// ─── Table column definitions ────────────────────────────────────────────────

const TABLE_COLUMNS = [
  { id: 'order', label: 'Order #' },
  { id: 'customer', label: 'Customer' },
  { id: 'date', label: 'Date' },
  { id: 'status', label: 'Status' },
  { id: 'payment', label: 'Payment' },
  { id: 'total', label: 'Total' },
  { id: 'actions', label: 'Actions', align: 'right' as const },
];

// Formats a ISO-8601 datetime string for display in the table.
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

// Formats a numeric value as USD currency.
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

// ─── Component ───────────────────────────────────────────────────────────────

// Orders manages admin order listing, filtering, status/payment updates, and cancellation.
const Orders = () => {
  // ── Data state ────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Filter state (client-side) ────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  // ── Dialog state ──────────────────────────────────────────────────────────
  // Order shown in the read-only detail dialog.
  const [viewOrder, setViewOrder] = useState<AdminOrder | null>(null);
  // Order whose lifecycle status is being edited.
  const [statusOrder, setStatusOrder] = useState<AdminOrder | null>(null);
  // Order whose payment status is being edited.
  const [paymentOrder, setPaymentOrder] = useState<AdminOrder | null>(null);
  // Order selected for cancellation — fed into ConfirmDialog.
  const [cancelOrder, setCancelOrder] = useState<AdminOrder | null>(null);

  // ── Pending select values inside dialogs ──────────────────────────────────
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | ''>('');
  const [pendingPayment, setPendingPayment] = useState<PaymentStatus | ''>('');

  // True while an update/cancel API call is in-flight.
  const [updating, setUpdating] = useState(false);

  // Payment panel — loaded when admin opens view dialog.
  const [orderPayment, setOrderPayment] = useState<Payment | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // ── Data loading ──────────────────────────────────────────────────────────

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await OrderAdminService.getOrders();
      setOrders(page.content);
    } catch {
      setError('Failed to load orders. Make sure the backend is running and you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  // Load orders when the page mounts.
  useEffect(() => {
    void loadOrders();
  }, []);

  // ── Client-side filtering ─────────────────────────────────────────────────

  // Filters by order number / customer email (case-insensitive), plus enum dropdowns.
  const filteredOrders = orders.filter((order) => {
    const needle = search.toLowerCase();
    const matchesSearch =
      !needle ||
      order.orderNumber.toLowerCase().includes(needle) ||
      order.userEmail.toLowerCase().includes(needle);
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesPayment = !paymentFilter || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // ── Action handlers ───────────────────────────────────────────────────────

  // Opens the view dialog and fetches the payment for the order.
  const openViewDialog = (order: AdminOrder) => {
    setViewOrder(order);
    setOrderPayment(null);
    setPaymentLoading(true);
    PaymentService.getPaymentsForOrder(order.orderNumber)
      .then((payments) => setOrderPayment(payments[0] ?? null))
      .catch(() => setOrderPayment(null))
      .finally(() => setPaymentLoading(false));
  };

  const handlePaymentAction = async (
    action: 'paid' | 'failed' | 'refund',
    paymentNumber: string,
  ) => {
    setUpdating(true);
    try {
      let updated: Payment;
      if (action === 'paid') {
        updated = await PaymentService.markPaid(paymentNumber);
        toast.success('Payment marked as PAID. Order confirmed.');
      } else if (action === 'failed') {
        updated = await PaymentService.markFailed(paymentNumber, 'Manually marked failed by admin');
        toast.success('Payment marked as FAILED.');
      } else {
        updated = await PaymentService.refund(paymentNumber);
        toast.success('Payment refunded. Order set to REFUNDED.');
      }
      setOrderPayment(updated);
      // Reload orders to reflect new statuses.
      void loadOrders();
    } catch {
      toast.error('Payment action failed.');
    } finally {
      setUpdating(false);
    }
  };

  // Opens the status update dialog and pre-fills the current status.
  const openStatusDialog = (order: AdminOrder) => {
    setStatusOrder(order);
    setPendingStatus(order.status);
  };

  // Opens the payment update dialog and pre-fills the current payment status.
  const openPaymentDialog = (order: AdminOrder) => {
    setPaymentOrder(order);
    setPendingPayment(order.paymentStatus);
  };

  // Replaces the matching order in local state without a full reload.
  const patchOrder = (updated: AdminOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  const handleStatusUpdate = async () => {
    if (!statusOrder || !pendingStatus) return;
    setUpdating(true);
    try {
      const updated = await OrderAdminService.updateOrderStatus(statusOrder.id, pendingStatus as OrderStatus);
      patchOrder(updated);
      toast.success('Order status updated.');
      setStatusOrder(null);
    } catch {
      toast.error('Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentUpdate = async () => {
    if (!paymentOrder || !pendingPayment) return;
    setUpdating(true);
    try {
      const updated = await OrderAdminService.updatePaymentStatus(paymentOrder.id, pendingPayment as PaymentStatus);
      patchOrder(updated);
      toast.success('Payment status updated.');
      setPaymentOrder(null);
    } catch {
      toast.error('Failed to update payment status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelOrder) return;
    setUpdating(true);
    try {
      const updated = await OrderAdminService.cancelOrder(cancelOrder.id);
      patchOrder(updated);
      toast.success('Order cancelled.');
      setCancelOrder(null);
    } catch {
      toast.error('Failed to cancel order.');
    } finally {
      setUpdating(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box>
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Orders
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {orders.length} order{orders.length !== 1 ? 's' : ''} total
            {filteredOrders.length !== orders.length && ` · ${filteredOrders.length} shown`}
          </Typography>
        </Box>
        <PrimaryButton startIcon={<RefreshIcon />} onClick={() => void loadOrders()}>
          Refresh
        </PrimaryButton>
      </Box>

      {/* ── Filter bar ────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        {/* Free-text search — matches order number or customer email */}
        <TextField
          size="small"
          placeholder="Search order # or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 240 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Order lifecycle status filter */}
        <AppSelect
          label="Status"
          value={statusFilter}
          options={STATUS_FILTER_OPTIONS}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 170 }}
        />

        {/* Payment status filter */}
        <AppSelect
          label="Payment"
          value={paymentFilter}
          options={PAYMENT_FILTER_OPTIONS}
          onChange={(e) => setPaymentFilter(e.target.value)}
          sx={{ minWidth: 170 }}
        />
      </Box>

      {/* ── Error state ───────────────────────────────────────────────────── */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* ── Loading state ─────────────────────────────────────────────────── */}
      {loading ? (
        <PageLoader />
      ) : (
        <DataTable
          columns={TABLE_COLUMNS}
          isEmpty={filteredOrders.length === 0}
          emptyTitle="No orders found"
          emptyDescription={
            search || statusFilter || paymentFilter
              ? 'Try clearing the filters.'
              : 'No orders have been placed yet.'
          }
        >
          {filteredOrders.map((order) => (
            <TableRow key={order.id} hover>
              {/* Order number — bold for quick scanning */}
              <TableCell sx={{ fontWeight: 700 }}>{order.orderNumber}</TableCell>

              {/* Customer email — only field available without a separate user lookup */}
              <TableCell>
                <Typography variant="body2">{order.userEmail}</Typography>
                <Typography variant="caption" color="text.secondary">
                  ID #{order.userId}
                </Typography>
              </TableCell>

              {/* Order creation date */}
              <TableCell>{formatDate(order.createdAt)}</TableCell>

              {/* Order lifecycle status chip */}
              <TableCell>
                <Chip
                  label={ORDER_STATUS_LABELS[order.status]}
                  color={orderStatusColor(order.status)}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </TableCell>

              {/* Payment status chip */}
              <TableCell>
                <Chip
                  label={PAYMENT_STATUS_LABELS[order.paymentStatus]}
                  color={paymentStatusColor(order.paymentStatus)}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </TableCell>

              {/* Grand total in USD */}
              <TableCell sx={{ fontWeight: 700 }}>{formatCurrency(order.grandTotal)}</TableCell>

              {/* Row action buttons */}
              <TableCell align="right">
                {/* View full order details */}
                <IconButton
                  size="small"
                  color="primary"
                  title="View details"
                  onClick={() => openViewDialog(order)}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>

                {/* Update order lifecycle status */}
                <IconButton
                  size="small"
                  color="info"
                  title="Update status"
                  onClick={() => openStatusDialog(order)}
                  disabled={order.status === 'CANCELLED' || order.status === 'REFUNDED'}
                >
                  <SwapVertIcon fontSize="small" />
                </IconButton>

                {/* Update payment status */}
                <IconButton
                  size="small"
                  color="secondary"
                  title="Update payment status"
                  onClick={() => openPaymentDialog(order)}
                  disabled={order.status === 'CANCELLED'}
                >
                  <PaymentIcon fontSize="small" />
                </IconButton>

                {/* Cancel order — only available for non-final statuses */}
                <IconButton
                  size="small"
                  color="error"
                  title="Cancel order"
                  onClick={() => setCancelOrder(order)}
                  disabled={
                    order.status === 'CANCELLED' ||
                    order.status === 'DELIVERED' ||
                    order.status === 'REFUNDED'
                  }
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      )}

      {/* ── View Details dialog ───────────────────────────────────────────── */}
      <Dialog
        open={Boolean(viewOrder)}
        onClose={() => setViewOrder(null)}
        fullWidth
        maxWidth="md"
      >
        {viewOrder && (
          <>
            <DialogTitle>
              Order {viewOrder.orderNumber}
              <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                — {formatDate(viewOrder.createdAt)}
              </Typography>
            </DialogTitle>

            <DialogContent>
              {/* Customer and status summary */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    CUSTOMER
                  </Typography>
                  <Typography variant="body2">{viewOrder.userEmail}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    User ID #{viewOrder.userId}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    ORDER STATUS
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={ORDER_STATUS_LABELS[viewOrder.status]}
                      color={orderStatusColor(viewOrder.status)}
                      size="small"
                      sx={{ fontWeight: 700, mr: 1 }}
                    />
                    <Chip
                      label={PAYMENT_STATUS_LABELS[viewOrder.paymentStatus]}
                      color={paymentStatusColor(viewOrder.paymentStatus)}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Shipping address */}
              {viewOrder.shippingAddress && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    SHIPPING ADDRESS
                  </Typography>
                  <Typography variant="body2">{viewOrder.shippingAddress}</Typography>
                </Box>
              )}

              {/* Customer notes */}
              {viewOrder.customerNotes && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    CUSTOMER NOTES
                  </Typography>
                  <Typography variant="body2">{viewOrder.customerNotes}</Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Order items table */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                Items
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewOrder.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.productSku}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.totalPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Divider sx={{ my: 2 }} />

              {/* Order totals summary */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                <Typography variant="body2">Subtotal: {formatCurrency(viewOrder.subtotal)}</Typography>
                <Typography variant="body2">Tax: {formatCurrency(viewOrder.tax)}</Typography>
                <Typography variant="body2">Shipping: {formatCurrency(viewOrder.shippingCost)}</Typography>
                {viewOrder.discount > 0 && (
                  <Typography variant="body2" color="success.main">
                    Discount: −{formatCurrency(viewOrder.discount)}
                  </Typography>
                )}
                <Divider sx={{ width: 200 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Grand Total: {formatCurrency(viewOrder.grandTotal)}
                </Typography>
              </Box>

              {/* ── Payment panel ─────────────────────────────────────── */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                Payment
              </Typography>

              {paymentLoading && (
                <Typography variant="body2" color="text.secondary">
                  Loading payment…
                </Typography>
              )}

              {!paymentLoading && !orderPayment && (
                <Alert severity="warning" sx={{ mb: 1 }}>
                  No payment record found for this order.
                </Alert>
              )}

              {!paymentLoading && orderPayment && (
                <Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        PAYMENT #
                      </Typography>
                      <Typography variant="body2">{orderPayment.paymentNumber}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        STATUS
                      </Typography>
                      <Box>
                        <Chip
                          label={PAYMENT_STATUS_LABELS[orderPayment.status] ?? orderPayment.status}
                          color={paymentStatusColor(orderPayment.status)}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        AMOUNT
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(orderPayment.amount)} {orderPayment.currency}
                      </Typography>
                    </Box>
                    {orderPayment.failureReason && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                          FAILURE REASON
                        </Typography>
                        <Typography variant="body2" color="error.main">
                          {orderPayment.failureReason}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Action buttons — only shown for applicable statuses */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {orderPayment.status === 'PENDING' && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          disabled={updating}
                          onClick={() => void handlePaymentAction('paid', orderPayment.paymentNumber)}
                        >
                          Mark Paid
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<ErrorIcon />}
                          disabled={updating}
                          onClick={() => void handlePaymentAction('failed', orderPayment.paymentNumber)}
                        >
                          Mark Failed
                        </Button>
                      </>
                    )}
                    {orderPayment.status === 'PAID' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        startIcon={<ReplayIcon />}
                        disabled={updating}
                        onClick={() => void handlePaymentAction('refund', orderPayment.paymentNumber)}
                      >
                        Refund
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </DialogContent>

            <DialogActions>
              <SecondaryButton onClick={() => setViewOrder(null)}>Close</SecondaryButton>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── Update Order Status dialog ────────────────────────────────────── */}
      <Dialog
        open={Boolean(statusOrder)}
        onClose={() => setStatusOrder(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Order <strong>{statusOrder?.orderNumber}</strong>
          </Typography>
          <AppSelect
            label="New Status"
            value={pendingStatus}
            options={ORDER_STATUS_OPTIONS}
            onChange={(e) => setPendingStatus(e.target.value as OrderStatus)}
          />
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setStatusOrder(null)}>Cancel</SecondaryButton>
          <PrimaryButton
            onClick={() => void handleStatusUpdate()}
            disabled={!pendingStatus || pendingStatus === statusOrder?.status || updating}
          >
            {updating ? 'Updating…' : 'Update Status'}
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      {/* ── Update Payment Status dialog ──────────────────────────────────── */}
      <Dialog
        open={Boolean(paymentOrder)}
        onClose={() => setPaymentOrder(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Update Payment Status</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Order <strong>{paymentOrder?.orderNumber}</strong>
          </Typography>
          <AppSelect
            label="Payment Status"
            value={pendingPayment}
            options={PAYMENT_STATUS_OPTIONS}
            onChange={(e) => setPendingPayment(e.target.value as PaymentStatus)}
          />
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setPaymentOrder(null)}>Cancel</SecondaryButton>
          <PrimaryButton
            onClick={() => void handlePaymentUpdate()}
            disabled={!pendingPayment || pendingPayment === paymentOrder?.paymentStatus || updating}
          >
            {updating ? 'Updating…' : 'Update Payment'}
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      {/* ── Cancel Order confirm dialog ───────────────────────────────────── */}
      <ConfirmDialog
        open={Boolean(cancelOrder)}
        title="Cancel this order?"
        description={`Order ${cancelOrder?.orderNumber ?? ''} will be set to CANCELLED. This cannot be undone.`}
        confirmLabel={updating ? 'Cancelling…' : 'Yes, Cancel Order'}
        confirmColor="error"
        onCancel={() => setCancelOrder(null)}
        onConfirm={() => void handleCancel()}
      />
    </Box>
  );
};

export default Orders;
