import { useState } from "react";
import toast from "react-hot-toast";
import CategoryToolbar from "../components/CategoryToolbar";
import CategoryTable from "../components/CategoryTable";
import CategoryDialog from "../components/CategoryDialog";
import ConfirmDialog from "../../../components/common/dialogs/ConfirmDialog";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchCategories } from "../store/categorySlice";
import { CategoryService } from "../../../services/CategoryService";
import type { Category } from "../types/category";
import type { CategoryFormErrors, CategoryFormValues } from "../components/CategoryForm";

const initialFormValues: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  displayOrder: 1,
  isActive: true,
};

const Categories = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.category.categories);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState<CategoryFormValues>(initialFormValues);
  const [formErrors, setFormErrors] = useState<CategoryFormErrors>({});
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const validateForm = () => {
    const nextErrors: CategoryFormErrors = {};

    if (!formValues.name.trim()) nextErrors.name = "Name is required";
    if (!formValues.slug.trim()) nextErrors.slug = "Slug is required";
    if (formValues.displayOrder <= 0) nextErrors.displayOrder = "Display order must be positive";

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const closeDialog = () => {
    setEditingCategory(null);
    setFormValues(initialFormValues);
    setFormErrors({});
    setIsDialogOpen(false);
  };

  const handleSaveCategory = async () => {
    if (!validateForm()) {
      toast.error("Please fix the category form errors.");
      return;
    }

    try {
      if (editingCategory) {
        await CategoryService.update(editingCategory.id, formValues);
        toast.success("Category updated.");
      } else {
        await CategoryService.create(formValues);
        toast.success("Category added.");
      }
      await dispatch(fetchCategories());
      closeDialog();
    } catch {
      toast.error("Failed to save category. Please try again.");
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormValues({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      displayOrder: category.displayOrder,
      isActive: category.isActive,
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    try {
      await CategoryService.remove(deletingCategory.id);
      toast.success("Category deleted.");
      await dispatch(fetchCategories());
    } catch {
      toast.error("Failed to delete category.");
    } finally {
      setDeletingCategory(null);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormValues(initialFormValues);
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleRequestDelete = (categoryId: number) => {
    const category = categories.find((item) => item.id === categoryId);
    if (category) setDeletingCategory(category);
  };

  return (
    <>
      <CategoryToolbar onAddCategory={handleAddCategory} />
      <CategoryTable categories={categories} onEdit={handleEditCategory} onDelete={handleRequestDelete} />

      <CategoryDialog
        open={isDialogOpen}
        title={editingCategory ? "Edit Category" : "Add Category"}
        values={formValues}
        errors={formErrors}
        onChange={setFormValues}
        onClose={closeDialog}
        onSave={() => void handleSaveCategory()}
      />

      <ConfirmDialog
        open={Boolean(deletingCategory)}
        title="Delete category?"
        description={`This will permanently delete ${deletingCategory?.name || "this category"}.`}
        confirmLabel="Delete"
        onCancel={() => setDeletingCategory(null)}
        onConfirm={() => void handleDeleteCategory()}
      />
    </>
  );
};

export default Categories;
