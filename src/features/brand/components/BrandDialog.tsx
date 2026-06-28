import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import PrimaryButton from "../../../components/common/buttons/PrimaryButton";
import SecondaryButton from "../../../components/common/buttons/SecondaryButton";
import BrandForm from "./BrandForm";
import type { BrandFormErrors, BrandFormValues } from "./BrandForm";

interface BrandDialogProps {
  open: boolean;
  title: string;
  values: BrandFormValues;
  errors?: BrandFormErrors;
  onChange: (values: BrandFormValues) => void;
  onClose: () => void;
  onSave: () => void;
}

// BrandDialog wraps the form in reusable admin dialog actions.
const BrandDialog = ({ open, title, values, errors, onChange, onClose, onSave }: BrandDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <BrandForm values={values} errors={errors} onChange={onChange} />
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={onSave}>Save Brand</PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default BrandDialog;
