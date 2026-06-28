import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import PrimaryButton from "../../../components/common/buttons/PrimaryButton";
import SecondaryButton from "../../../components/common/buttons/SecondaryButton";
import ProductForm from "./ProductForm";
import type { Brand } from "../../brand";
import type { Category } from "../../category/types/category";
import type { ProductFormErrors, ProductFormValues } from "./ProductForm";

interface ProductDialogProps {
  open: boolean;
  title: string;
  values: ProductFormValues;
  errors?: ProductFormErrors;
  brands: Brand[];
  categories: Category[];
  onChange: (values: ProductFormValues) => void;
  onClose: () => void;
  onSave: () => void;
}

// ProductDialog keeps the large product form out of the admin page file.
const ProductDialog = ({
  open,
  title,
  values,
  errors,
  brands,
  categories,
  onChange,
  onClose,
  onSave,
}: ProductDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <ProductForm values={values} errors={errors} brands={brands} categories={categories} onChange={onChange} />
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={onSave}>Save Product</PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialog;
