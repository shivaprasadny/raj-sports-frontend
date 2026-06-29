import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ReportService from "../../services/ReportService";
import type {
  CustomerReport,
  InventoryReport,
  InventoryProduct,
  OrdersReport,
  SalesReport,
} from "../../services/ReportService";

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

const today = new Date().toISOString().split("T")[0];
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
}
const StatCard = ({ title, value, sub }: StatCardProps) => (
  <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
    <CardContent>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5 }}>
        {value}
      </Typography>
      {sub && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {sub}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const SalesTab = () => {
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [data, setData] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    ReportService.getSalesReport(startDate, endDate)
      .then(setData)
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Start date"
          type="date"
          size="small"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="End date"
          type="date"
          size="small"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>
      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}><CircularProgress /></Box>
      ) : data ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard title="Total Revenue" value={formatCurrency(data.totalRevenue)} sub="From paid orders" />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard title="Total Orders" value={data.totalOrders.toLocaleString()} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              title="Avg Order Value"
              value={formatCurrency(data.averageOrderValue)}
              sub="Revenue ÷ Orders"
            />
          </Grid>
        </Grid>
      ) : null}
    </Box>
  );
};

const OrdersTab = () => {
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [data, setData] = useState<OrdersReport | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    ReportService.getOrdersReport(startDate, endDate)
      .then(setData)
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  useEffect(() => { fetch(); }, [fetch]);

  const statusColor = (s: string): "default" | "warning" | "info" | "success" | "error" => {
    const map: Record<string, "default" | "warning" | "info" | "success" | "error"> = {
      PENDING: "warning", CONFIRMED: "info", PROCESSING: "info", PACKED: "info",
      SHIPPED: "info", DELIVERED: "success", CANCELLED: "error", REFUNDED: "default",
    };
    return map[s] ?? "default";
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Start date"
          type="date"
          size="small"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="End date"
          type="date"
          size="small"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>
      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}><CircularProgress /></Box>
      ) : data ? (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard title="Total Orders" value={data.totalOrders.toLocaleString()} />
            </Grid>
          </Grid>
          {data.statusBreakdown?.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                Order Status Breakdown
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                {data.statusBreakdown.map((s) => (
                  <Box
                    key={s.status}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      px: 2,
                      py: 1.5,
                      minWidth: 120,
                      textAlign: "center",
                    }}
                  >
                    <Chip label={s.status} color={statusColor(s.status)} size="small" sx={{ mb: 1, fontWeight: 700 }} />
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>
                      {s.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </>
      ) : null}
    </Box>
  );
};

const InventoryTab = () => {
  const [data, setData] = useState<InventoryReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ReportService.getInventoryReport().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ py: 6, textAlign: "center" }}><CircularProgress /></Box>;
  if (!data) return null;

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <StatCard title="Total Products" value={data.totalProducts} />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <StatCard title="Active Products" value={data.activeProducts} />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <StatCard title="Low Stock" value={data.lowStockProducts} sub="Under threshold" />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <StatCard title="Out of Stock" value={data.outOfStockProducts} />
        </Grid>
      </Grid>

      {data.lowStockProductDetails?.length > 0 && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <WarningAmberOutlinedIcon color="warning" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Low Stock Products
            </Typography>
          </Box>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {data.lowStockProductDetails.map((p: InventoryProduct, i: number) => (
              <Box key={p.productId}>
                {i > 0 && <Divider />}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, py: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {p.productName}
                  </Typography>
                  <Chip
                    label={`${p.stock} left`}
                    color={p.stock === 0 ? "error" : "warning"}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

const CustomersTab = () => {
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [data, setData] = useState<CustomerReport | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    ReportService.getCustomerReport(startDate, endDate)
      .then(setData)
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Start date"
          type="date"
          size="small"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="End date"
          type="date"
          size="small"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>
      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}><CircularProgress /></Box>
      ) : data ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard title="Total Customers" value={data.totalCustomers.toLocaleString()} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard title="Active Customers" value={data.activeCustomers.toLocaleString()} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              title="New Customers"
              value={data.newCustomers.toLocaleString()}
              sub="In selected date range"
            />
          </Grid>
        </Grid>
      ) : null}
    </Box>
  );
};

const TABS = [
  { label: "Sales", icon: <TrendingUpIcon />, component: <SalesTab /> },
  { label: "Orders", icon: <ShoppingCartOutlinedIcon />, component: <OrdersTab /> },
  { label: "Inventory", icon: <InventoryOutlinedIcon />, component: <InventoryTab /> },
  { label: "Customers", icon: <PeopleOutlinedIcon />, component: <CustomersTab /> },
];

const Reports = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Reports
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Business insights for sales, orders, inventory and customers.
        </Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3, borderBottom: "1px solid", borderColor: "divider" }}
      >
        {TABS.map((t, i) => (
          <Tab key={i} label={t.label} icon={t.icon} iconPosition="start" />
        ))}
      </Tabs>

      {TABS[tab].component}
    </Box>
  );
};

export default Reports;
