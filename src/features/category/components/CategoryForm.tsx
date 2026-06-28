import { Box, FormControlLabel, Switch } from "@mui/material";
import AppTextField from "../../../components/common/inputs/AppTextField";

export interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

export type CategoryFormErrors = Partial<Record<keyof CategoryFormValues, string>>;

interface CategoryFormProps {
  values: CategoryFormValues;
  errors?: CategoryFormErrors;
  onChange: (values: CategoryFormValues) => void;
}

// CategoryForm owns only category fields; the page decides create vs update.
const CategoryForm = ({ values, errors = {}, onChange }: CategoryFormProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <AppTextField
        label="Category Name"
        value={values.name}
        error={Boolean(errors.name)}
        helperText={errors.name}
        onChange={(e) =>
          onChange({
            ...values,
            name: e.target.value,
            slug: e.target.value.toLowerCase().replaceAll(" ", "-"),
          })
        }
      />

      <AppTextField
        label="Slug"
        value={values.slug}
        error={Boolean(errors.slug)}
        helperText={errors.slug}
        onChange={(e) => onChange({ ...values, slug: e.target.value })}
      />

      <AppTextField
        label="Description"
        multiline
        rows={3}
        value={values.description}
        onChange={(e) => onChange({ ...values, description: e.target.value })}
      />

      <AppTextField
        label="Display Order"
        type="number"
        value={values.displayOrder}
        error={Boolean(errors.displayOrder)}
        helperText={errors.displayOrder}
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
