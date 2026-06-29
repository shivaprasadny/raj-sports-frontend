import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants/routes";
import OrderService from "../../services/OrderService";
import type { Order } from "../../services/OrderService";

const statusColor = (s: string): "default" | "warning" | "info" | "success" | "error" => {
  const map: Record<string, "default" | "warning" | "info" | "success" | "error"> = {
    PENDING: "warning",
    CONFIRMED: "info",
    PROCESSING: "info",
    PACKED: "info",
    SHIPPED: "info",
    DELIVERED: "success",
    CANCELLED: "error",
    REFUNDED: "default",
  };
  return map[s] ?? "default";
};

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v);

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const OrderRow = ({ order }: { order: Order }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow hover onClick={() => setOpen((p) => !p)} sx={{ cursor: "pointer" }}>
        <TableCell sx={{ fontWeight: 700 }}>{order.orderNumber}</TableCell>
        <TableCell>{formatDate(order.createdAt)}</TableCell>
        <TableCell>
          <Chip
            label={order.status}
            color={statusColor(order.status)}
            size="small"
            sx={{ fontWeight: 700, fontSize: "0.7rem" }}
          />
        </TableCell>
        <TableCell>
          <Chip
            label={order.paymentStatus}
            color={order.paymentStatus === "PAID" ? "success" : order.paymentStatus === "FAILED" ? "error" : "warning"}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: "0.7rem" }}
          />
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: 700 }}>
          {formatCurrency(order.totalAmount)}
        </TableCell>
        <TableCell align="center">
          {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Items
              </Typography>
              {order.items?.length > 0 ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Variant</TableCell>
                      <TableCell align="center">Qty</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.variantName ?? "—"}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.totalPrice)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No items found.
                </Typography>
              )}
              {order.shippingAddress && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                  <strong>Shipping address:</strong> {order.shippingAddress}
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    OrderService.getMyOrders(page, rowsPerPage)
      .then((res) => {
        setOrders(res.content);
        setTotalElements(res.totalElements);
      })
      .catch(() => setError("Failed to load orders. Please try again."))
      .finally(() => setLoading(false));
  }, [user, page]);

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          You must be logged in to view your orders.
        </Typography>
        <Button component={Link} to={ROUTES.LOGIN} variant="contained" disableElevation>
          Log In
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 900 }}>
          My Orders
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Track and review your past orders. Click any row to see the items.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : orders.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 10 }}>
          <ShoppingBagIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            No orders yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Once you place an order, it will appear here.
          </Typography>
          <Button component={Link} to={ROUTES.PRODUCTS} variant="contained" disableElevation>
            Shop Now
          </Button>
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden" }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Total
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
          />
        </Paper>
      )}
    </Container>
  );
};

export default MyOrders;
