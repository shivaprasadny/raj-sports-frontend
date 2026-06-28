import { Box, Grid, Typography } from "@mui/material";
import AppCard from "../../components/common/cards/AppCard";
import { useAppSelector } from "../../store/hooks";

// Dashboard shows mock KPI cards derived from current Redux state.
const Dashboard = () => {
  const products = useAppSelector((state) => state.product.products);
  const categories = useAppSelector((state) => state.category.categories);
  const brands = useAppSelector((state) => state.brand.brands);
  const lowStockProducts = products.filter((product) => product.stockQuantity > 0 && product.stockQuantity <= 5).length;

  const cards = [
    { label: "Total Products", value: products.length },
    { label: "Total Categories", value: categories.length },
    { label: "Total Brands", value: brands.length },
    { label: "Pending Orders", value: 6 },
    { label: "Low Stock Products", value: lowStockProducts },
    { label: "Revenue Today", value: "$1,240" },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, md: 4 }}>
            <AppCard>
              <Typography color="text.secondary">{card.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>
                {card.value}
              </Typography>
            </AppCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
