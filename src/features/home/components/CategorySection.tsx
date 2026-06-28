import { Box, Grid, Typography } from "@mui/material";
import AppCard from "../../../components/common/cards/AppCard";
import type { Category } from "../../category/types/category";

interface CategorySectionProps {
  categories: Category[];
}

// CategorySection highlights active departments from category mock state.
const CategorySection = ({ categories }: CategorySectionProps) => {
  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
        Shop by Category
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <AppCard>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {category.name}
              </Typography>
              <Typography color="text.secondary">{category.description}</Typography>
            </AppCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategorySection;
