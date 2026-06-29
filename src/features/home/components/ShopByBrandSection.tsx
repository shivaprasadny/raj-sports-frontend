import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { ROUTES } from "../../../constants/routes";

// Brand colours for the visual card backgrounds.
const BRAND_COLORS = [
  "linear-gradient(135deg, #1565C0, #1976D2)",
  "linear-gradient(135deg, #2E7D32, #388E3C)",
  "linear-gradient(135deg, #E65100, #F57C00)",
  "linear-gradient(135deg, #4A148C, #7B1FA2)",
];

const ShopByBrandSection = () => {
  const brands = useAppSelector((state) =>
    state.brand.brands.filter((b) => b.isActive)
  );

  if (brands.length === 0) return null;

  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
        Shop by Brand
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Trusted names trusted by professional cricketers
      </Typography>

      <Grid container spacing={2}>
        {brands.map((brand, index) => (
          <Grid key={brand.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <Paper
              component={Link}
              to={`${ROUTES.PRODUCTS}?brand=${brand.id}`}
              elevation={0}
              sx={{
                alignItems: "center",
                background: BRAND_COLORS[index % BRAND_COLORS.length],
                borderRadius: 3,
                color: "white",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                justifyContent: "center",
                minHeight: 120,
                p: 3,
                textDecoration: "none",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": { transform: "translateY(-3px)", boxShadow: 6 },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 900, textAlign: "center" }}>
                {brand.name}
              </Typography>
              {brand.description && (
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.85, textAlign: "center", lineHeight: 1.3 }}
                >
                  {brand.description}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button
          component={Link}
          to={ROUTES.PRODUCTS}
          variant="outlined"
          sx={{ fontWeight: 700 }}
        >
          Browse All Products
        </Button>
      </Box>
    </Box>
  );
};

export default ShopByBrandSection;
