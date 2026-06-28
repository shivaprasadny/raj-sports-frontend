import { useState } from "react";
import toast from "react-hot-toast";
import { Box, Typography } from "@mui/material";
import PrimaryButton from "../../../components/common/buttons/PrimaryButton";
import ConfirmDialog from "../../../components/common/dialogs/ConfirmDialog";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import BrandDialog from "../components/BrandDialog";
import BrandTable from "../components/BrandTable";
import { addBrand, deleteBrand, updateBrand } from "../store/brandSlice";
import type { Brand } from "../types/brand";
import type { BrandFormErrors, BrandFormValues } from "../components/BrandForm";

const initialFormValues: BrandFormValues = {
  name: "",
  slug: "",
  description: "",
  logoUrl: "",
  displayOrder: 1,
  isActive: true,
};

// BrandsPage coordinates mock CRUD while the UI stays split into components.
const BrandsPage = () => {
  const dispatch = useAppDispatch();
  const brands = useAppSelector((state) => state.brand.brands);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);
  const [formValues, setFormValues] = useState<BrandFormValues>(initialFormValues);
  const [formErrors, setFormErrors] = useState<BrandFormErrors>({});

  const validateForm = () => {
    const nextErrors: BrandFormErrors = {};

    if (!formValues.name.trim()) nextErrors.name = "Name is required";
    if (!formValues.slug.trim()) nextErrors.slug = "Slug is required";
    if (formValues.displayOrder <= 0) nextErrors.displayOrder = "Display order must be positive";

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingBrand(null);
    setFormValues(initialFormValues);
    setFormErrors({});
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Please fix the brand form errors.");
      return;
    }

    const logoUrl = formValues.logoUrl.trim() || undefined;

    if (editingBrand) {
      dispatch(updateBrand({ ...formValues, logoUrl, id: editingBrand.id }));
      toast.success("Brand updated.");
    } else {
      dispatch(addBrand({ ...formValues, logoUrl, id: Date.now() }));
      toast.success("Brand added.");
    }

    closeDialog();
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormValues({ ...brand, logoUrl: brand.logoUrl || "" });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (!deletingBrand) return;
    dispatch(deleteBrand(deletingBrand.id));
    toast.success("Brand deleted.");
    setDeletingBrand(null);
  };

  return (
    <Box>
      <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Brands
        </Typography>
        <PrimaryButton onClick={() => setIsDialogOpen(true)}>Add Brand</PrimaryButton>
      </Box>

      <BrandTable brands={brands} onEdit={handleEdit} onDelete={setDeletingBrand} />

      <BrandDialog
        open={isDialogOpen}
        title={editingBrand ? "Edit Brand" : "Add Brand"}
        values={formValues}
        errors={formErrors}
        onChange={setFormValues}
        onClose={closeDialog}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={Boolean(deletingBrand)}
        title="Delete brand?"
        description={`This will remove ${deletingBrand?.name || "this brand"} from the mock admin list.`}
        confirmLabel="Delete"
        onCancel={() => setDeletingBrand(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default BrandsPage;
