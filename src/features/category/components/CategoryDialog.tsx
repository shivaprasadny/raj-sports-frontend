import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CategoryForm from "./CategoryForm";
import PrimaryButton from "../../../components/common/buttons/PrimaryButton";
import SecondaryButton from "../../../components/common/buttons/SecondaryButton";
import type { CategoryFormErrors, CategoryFormValues } from "./CategoryForm";

interface CategoryDialogProps {
  open: boolean;
  title: string;
  values: CategoryFormValues;
  errors?: CategoryFormErrors;
  onChange: (values: CategoryFormValues) => void;
  onClose: () => void;
  onSave: () => void;
}

// CategoryDialog keeps the page small and delegates field rendering to CategoryForm.
const CategoryDialog = ({
  open,
  title,
  values,
  errors,
  onChange,
  onClose,
  onSave,
}: CategoryDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <CategoryForm values={values} errors={errors} onChange={onChange} />
      </DialogContent>

      <DialogActions>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={onSave}>
          Save Category
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;
