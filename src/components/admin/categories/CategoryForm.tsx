import { Box, FormControlLabel, Switch, TextField } from "@mui/material";

export interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

interface CategoryFormProps {
  values: CategoryFormValues;
  onChange: (values: CategoryFormValues) => void;
}

const CategoryForm = ({ values, onChange }: CategoryFormProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <TextField
        label="Category Name"
        fullWidth
        value={values.name}
        onChange={(e) =>
          onChange({
            ...values,
            name: e.target.value,
            slug: e.target.value.toLowerCase().replaceAll(" ", "-"),
          })
        }
      />

      <TextField
        label="Slug"
        fullWidth
        value={values.slug}
        onChange={(e) => onChange({ ...values, slug: e.target.value })}
      />

      <TextField
        label="Description"
        multiline
        rows={3}
        fullWidth
        value={values.description}
        onChange={(e) => onChange({ ...values, description: e.target.value })}
      />

      <TextField
        label="Display Order"
        type="number"
        fullWidth
        value={values.displayOrder}
        onChange={(e) => onChange({ ...values, displayOrder: Number(e.target.value) })}
      />

      <FormControlLabel
        control={
          <Switch
            checked={values.isActive}
            onChange={(e) => onChange({ ...values, isActive: e.target.checked })}
          />
        }
        label="Active"
      />
    </Box>
  );
};

export default CategoryForm;