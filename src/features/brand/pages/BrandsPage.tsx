import { useState } from "react";
import toast from "react-hot-toast";
import { Box, Typography } from "@mui/material";
import PrimaryButton from "../../../components/common/buttons/PrimaryButton";
import ConfirmDialog from "../../../components/common/dialogs/ConfirmDialog";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import BrandDialog from "../components/BrandDialog";
import BrandTable from "../components/BrandTable";
import { fetchBrands } from "../store/brandSlice";
import { BrandService } from "../../../services/BrandService";
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

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the brand form errors.");
      return;
    }

    const payload = { ...formValues, logoUrl: formValues.logoUrl.trim() || undefined };

    try {
      if (editingBrand) {
        await BrandService.update(editingBrand.id, payload);
        toast.success("Brand updated.");
      } else {
        await BrandService.create(payload);
        toast.success("Brand added.");
      }
      await dispatch(fetchBrands());
      closeDialog();
    } catch {
      toast.error("Failed to save brand. Please try again.");
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormValues({ ...brand, logoUrl: brand.logoUrl || "" });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingBrand) return;
    try {
      await BrandService.remove(deletingBrand.id);
      toast.success("Brand deleted.");
      await dispatch(fetchBrands());
    } catch {
      toast.error("Failed to delete brand.");
    } finally {
      setDeletingBrand(null);
    }
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
        onSave={() => void handleSave()}
      />
      <ConfirmDialog
        open={Boolean(deletingBrand)}
        title="Delete brand?"
        description={`This will permanently delete ${deletingBrand?.name || "this brand"}.`}
        confirmLabel="Delete"
        onCancel={() => setDeletingBrand(null)}
        onConfirm={() => void handleDelete()}
      />
    </Box>
  );
};

export default BrandsPage;
