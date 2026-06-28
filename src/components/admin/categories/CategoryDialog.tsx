import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CategoryForm from "./CategoryForm";
import type { CategoryFormValues } from "./CategoryForm";

interface CategoryDialogProps {
  open: boolean;
  values: CategoryFormValues;
  onChange: (values: CategoryFormValues) => void;
  onClose: () => void;
  onSave: () => void;
}

const CategoryDialog = ({ open, values, onChange, onClose, onSave }: CategoryDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Category</DialogTitle>

      <DialogContent>
        <CategoryForm values={values} onChange={onChange} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>
          Save Category
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;