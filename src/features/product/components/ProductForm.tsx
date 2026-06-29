import { Box, Checkbox, FormControlLabel, FormGroup, Switch } from "@mui/material";
import AppSelect from "../../../components/common/inputs/AppSelect";
import AppTextField from "../../../components/common/inputs/AppTextField";
import type { Brand } from "../../brand";
import type { Category } from "../../category/types/category";

export interface ProductFormValues {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  detailedDescription: string;
  specifications: string;
  careInstructions: string;
  warrantyInfo: string;
  sku: string;
  brandId: number;
  categoryId: number;
  price: number;
  salePrice: number | "";
  stockQuantity: number;
  imageUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

interface ProductFormProps {
  values: ProductFormValues;
  errors?: ProductFormErrors;
  brands: Brand[];
  categories: Category[];
  onChange: (values: ProductFormValues) => void;
}

// ProductForm stays reusable for both add and edit admin flows.
const ProductForm = ({ values, errors = {}, brands, categories, onChange }: ProductFormProps) => {
  return (
    <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, mt: 1 }}>
      <AppTextField
        label="Product Name"
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
        label="SKU"
        value={values.sku}
        error={Boolean(errors.sku)}
        helperText={errors.sku}
        onChange={(event) => onChange({ ...values, sku: event.target.value })}
      />
      <AppSelect
        label="Brand"
        value={String(values.brandId)}
        options={brands.map((brand) => ({ label: brand.name, value: brand.id }))}
        error={Boolean(errors.brandId)}
        helperText={errors.brandId}
        onChange={(event) => onChange({ ...values, brandId: Number(event.target.value) })}
      />
      <AppSelect
        label="Category"
        value={String(values.categoryId)}
        options={categories.map((category) => ({ label: category.name, value: category.id }))}
        error={Boolean(errors.categoryId)}
        helperText={errors.categoryId}
        onChange={(event) => onChange({ ...values, categoryId: Number(event.target.value) })}
      />
      <AppTextField
        label="Price"
        type="number"
        value={values.price}
        error={Boolean(errors.price)}
        helperText={errors.price}
        onChange={(event) => onChange({ ...values, price: Number(event.target.value) })}
      />
      <AppTextField
        label="Sale Price"
        type="number"
        value={values.salePrice}
        onChange={(event) =>
          onChange({ ...values, salePrice: event.target.value === "" ? "" : Number(event.target.value) })
        }
      />
      <AppTextField
        label="Stock Quantity"
        type="number"
        value={values.stockQuantity}
        error={Boolean(errors.stockQuantity)}
        helperText={errors.stockQuantity}
        onChange={(event) => onChange({ ...values, stockQuantity: Number(event.target.value) })}
      />
      {/* imageUrl is managed via the image upload section in ProductDialog, not entered manually */}
      <AppTextField
        label="Short Description"
        value={values.shortDescription}
        error={Boolean(errors.shortDescription)}
        helperText={errors.shortDescription}
        onChange={(event) => onChange({ ...values, shortDescription: event.target.value })}
      />
      <AppTextField
        label="Description"
        multiline
        rows={3}
        value={values.description}
        sx={{ gridColumn: { md: "1 / -1" } }}
        onChange={(event) => onChange({ ...values, description: event.target.value })}
      />
      <AppTextField
        label="Detailed Description (appears in Description tab)"
        multiline
        rows={4}
        value={values.detailedDescription}
        sx={{ gridColumn: { md: "1 / -1" } }}
        onChange={(event) => onChange({ ...values, detailedDescription: event.target.value })}
      />
      <AppTextField
        label="Specifications (appears in Specifications tab)"
        multiline
        rows={4}
        value={values.specifications}
        sx={{ gridColumn: { md: "1 / -1" } }}
        onChange={(event) => onChange({ ...values, specifications: event.target.value })}
        placeholder={"Weight: 1.2 kg\nBlade: English Willow\nHandle: Cane\nGrip: Rubber"}
      />
      <AppTextField
        label="Care Instructions"
        multiline
        rows={2}
        value={values.careInstructions}
        sx={{ gridColumn: { md: "1 / -1" } }}
        onChange={(event) => onChange({ ...values, careInstructions: event.target.value })}
      />
      <AppTextField
        label="Warranty Information"
        multiline
        rows={2}
        value={values.warrantyInfo}
        sx={{ gridColumn: { md: "1 / -1" } }}
        onChange={(event) => onChange({ ...values, warrantyInfo: event.target.value })}
      />
      <FormGroup row sx={{ gridColumn: { md: "1 / -1" } }}>
        <FormControlLabel
          control={<Switch checked={values.isActive} onChange={(event) => onChange({ ...values, isActive: event.target.checked })} />}
          label="Active"
        />
        <FormControlLabel
          control={<Checkbox checked={values.isFeatured} onChange={(event) => onChange({ ...values, isFeatured: event.target.checked })} />}
          label="Featured"
        />
        <FormControlLabel
          control={<Checkbox checked={values.isBestSeller} onChange={(event) => onChange({ ...values, isBestSeller: event.target.checked })} />}
          label="Best Seller"
        />
        <FormControlLabel
          control={<Checkbox checked={values.isNewArrival} onChange={(event) => onChange({ ...values, isNewArrival: event.target.checked })} />}
          label="New Arrival"
        />
      </FormGroup>
    </Box>
  );
};

export default ProductForm;
