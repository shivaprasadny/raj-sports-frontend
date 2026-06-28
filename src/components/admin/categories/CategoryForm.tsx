import { Box, FormControlLabel, Switch, TextField } from "@mui/material";

const CategoryForm = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <TextField label="Category Name" fullWidth />
      <TextField label="Slug" fullWidth />
      <TextField label="Description" multiline rows={3} fullWidth />
      <TextField label="Display Order" type="number" fullWidth />

      <FormControlLabel control={<Switch defaultChecked />} label="Active" />
    </Box>
  );
};

export default CategoryForm;