import { Box, FormControlLabel, Switch } from "@mui/material";
import AppTextField from "../../../components/common/inputs/AppTextField";

export interface BrandFormValues {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export type BrandFormErrors = Partial<Record<keyof BrandFormValues, string>>;

interface BrandFormProps {
  values: BrandFormValues;
  errors?: BrandFormErrors;
  onChange: (values: BrandFormValues) => void;
}

// BrandForm is shared by add and edit dialogs.
const BrandForm = ({ values, errors = {}, onChange }: BrandFormProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <AppTextField
        label="Brand Name"
        value={values.name}
        error={Boolean(errors.name)}
        helperText={errors.name}
        onChange={(event) =>
          onChange({
            ...values,
            name: event.target.value,
            slug: event.target.value.toLowerCase().trim().replaceAll(" ", "-"),
          })
        }
      />
      <AppTextField
        label="Slug"
        value={values.slug}
        error={Boolean(errors.slug)}
        helperText={errors.slug}
        onChange={(event) => onChange({ ...values, slug: event.target.value })}
      />
      <AppTextField
        label="Description"
        multiline
        rows={3}
        value={values.description}
        onChange={(event) => onChange({ ...values, description: event.target.value })}
      />
      <AppTextField
        label="Logo URL"
        value={values.logoUrl}
        onChange={(event) => onChange({ ...values, logoUrl: event.target.value })}
      />
      <AppTextField
        label="Display Order"
        type="number"
        value={values.displayOrder}
        error={Boolean(errors.displayOrder)}
        helperText={errors.displayOrder}
        onChange={(event) => onChange({ ...values, displayOrder: Number(event.target.value) })}
      />
      <FormControlLabel
        control={
          <Switch
            checked={values.isActive}
            onChange={(event) => onChange({ ...values, isActive: event.target.checked })}
          />
        }
        label="Active"
      />
    </Box>
  );
};

export default BrandForm;
