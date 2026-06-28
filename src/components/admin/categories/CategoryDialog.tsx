import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CategoryForm from "./CategoryForm";

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
}

const CategoryDialog = ({ open, onClose }: CategoryDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Category</DialogTitle>

      <DialogContent>
        <CategoryForm />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained">Save Category</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;