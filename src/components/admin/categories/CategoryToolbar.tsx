import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const CategoryToolbar = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Categories
        </Typography>
        <Typography color="text.secondary">
          Manage product categories for the store.
        </Typography>
      </Box>

      <Button variant="contained" startIcon={<AddIcon />}>
        Add Category
      </Button>
    </Box>
  );
};

export default CategoryToolbar;