import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import GroupIcon from "@mui/icons-material/Group";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DashboardService, { type DashboardStats } from "../../services/DashboardService";

// ─── Stat card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bg: string;
  sub?: string;
}

const StatCard = ({ label, value, icon, color, bg, sub }: StatCardProps) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2.5,
      display: "flex",
      alignItems: "flex-start",
      gap: 2,
      borderRadius: 2,
      borderColor: "divider",
    }}
  >
    <Box
      sx={{
        bgcolor: bg,
        color,
        borderRadius: 2,
        p: 1.25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" color="text.secondary">
          {sub}
        </Typography>
      )}
    </Box>
  </Paper>
);

// ─── Alert row item ───────────────────────────────────────────────────────────

interface AlertRowItemProps {
  label: string;
  count: number;
  color: "error" | "warning" | "info" | "success" | "default";
}

const AlertRowItem = ({ label, count, color }: AlertRowItemProps) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
    <Typography variant="body2">{label}</Typography>
    <Chip label={count} color={count > 0 ? color : "default"} size="small" sx={{ fontWeight: 700, minWidth: 40 }} />
  </Box>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    DashboardService.getStats()
      .then(setStats)
      .catch(() => setError("Failed to load dashboard stats."))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {today}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : stats ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* ── KPI row ──────────────────────────────────────────────────── */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                label="Total Revenue"
                value={`$${Number(stats.totalRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={<AttachMoneyIcon />}
                color="#15803d"
                bg="#dcfce7"
                sub="from confirmed orders"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                label="Total Orders"
                value={stats.totalOrders}
                icon={<ShoppingCartIcon />}
                color="#1d4ed8"
                bg="#dbeafe"
                sub={`${stats.pendingOrders} pending`}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                label="Customers"
                value={stats.totalCustomers}
                icon={<GroupIcon />}
                color="#7e22ce"
                bg="#f3e8ff"
                sub="registered accounts"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                label="Active Products"
                value={stats.activeProducts}
                icon={<Inventory2Icon />}
                color="#c2410c"
                bg="#ffedd5"
                sub={`${stats.totalProducts} total`}
              />
            </Grid>
          </Grid>

          {/* ── Order overview + Alerts + Inventory ───────────────────── */}
          <Grid container spacing={2}>
            {/* Order status breakdown */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: "100%" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
                  Order Overview
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <AlertRowItem label="Pending Orders" count={stats.pendingOrders} color="warning" />
                  <Divider />
                  <AlertRowItem label="Delivered Orders" count={stats.deliveredOrders} color="success" />
                  <Divider />
                  <AlertRowItem label="Cancelled Orders" count={stats.cancelledOrders} color="error" />
                  <Divider />
                  <AlertRowItem label="Pending Payments" count={stats.pendingPaymentCount} color="info" />
                </Box>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <HourglassEmptyIcon sx={{ fontSize: 14, color: "warning.main" }} />
                    <Typography variant="caption" color="text.secondary">Pending</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CheckCircleOutlinedIcon sx={{ fontSize: 14, color: "success.main" }} />
                    <Typography variant="caption" color="text.secondary">Delivered</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CancelIcon sx={{ fontSize: 14, color: "error.main" }} />
                    <Typography variant="caption" color="text.secondary">Cancelled</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Inventory health */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: "100%" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
                  Inventory Health
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <AlertRowItem label="Total Products" count={stats.totalProducts} color="default" />
                  <Divider />
                  <AlertRowItem label="Active" count={stats.activeProducts} color="success" />
                  <Divider />
                  <AlertRowItem label="Low Stock" count={stats.lowStockProducts} color="warning" />
                  <Divider />
                  <AlertRowItem label="Out of Stock" count={stats.outOfStockProducts} color="error" />
                </Box>
              </Paper>
            </Grid>

            {/* Catalogue */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: "100%" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
                  Catalogue
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <AlertRowItem label="Categories" count={stats.totalCategories} color="default" />
                  <Divider />
                  <AlertRowItem label="Active Categories" count={stats.activeCategories} color="success" />
                  <Divider />
                  <AlertRowItem label="Brands" count={stats.totalBrands} color="default" />
                  <Divider />
                  <AlertRowItem label="Active Brands" count={stats.activeBrands} color="success" />
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* ── Attention items ─────────────────────────────────────────── */}
          {(stats.lowStockProducts > 0 || stats.outOfStockProducts > 0 || stats.pendingOrders > 0 || stats.pendingPaymentCount > 0) && (
            <Paper
              variant="outlined"
              sx={{ p: 2.5, borderRadius: 2, borderColor: "warning.light", bgcolor: "rgba(251,191,36,0.04)" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <WarningAmberIcon sx={{ color: "warning.main", fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Needs Attention
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {stats.outOfStockProducts > 0 && (
                  <Chip
                    icon={<CancelIcon />}
                    label={`${stats.outOfStockProducts} out of stock`}
                    color="error"
                    size="small"
                    variant="outlined"
                  />
                )}
                {stats.lowStockProducts > 0 && (
                  <Chip
                    icon={<WarningAmberIcon />}
                    label={`${stats.lowStockProducts} low stock`}
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                )}
                {stats.pendingOrders > 0 && (
                  <Chip
                    icon={<HourglassEmptyIcon />}
                    label={`${stats.pendingOrders} pending orders`}
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                )}
                {stats.pendingPaymentCount > 0 && (
                  <Chip
                    icon={<AttachMoneyIcon />}
                    label={`${stats.pendingPaymentCount} pending payments`}
                    color="info"
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Paper>
          )}
        </Box>
      ) : null}
    </Box>
  );
};

export default Dashboard;
