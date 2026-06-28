import { useState } from "react";
import toast from "react-hot-toast";
import CategoryToolbar from "../components/CategoryToolbar";
import CategoryTable from "../components/CategoryTable";
import CategoryDialog from "../components/CategoryDialog";
import ConfirmDialog from "../../../components/common/dialogs/ConfirmDialog";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import type { Category } from "../types/category";
import type { CategoryFormErrors, CategoryFormValues } from "../components/CategoryForm";
import { addCategory, updateCategory, deleteCategory } from "../store/categorySlice";

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

  // Validation stays local until a real backend contract exists.
  const validateForm = () => {
    const nextErrors: CategoryFormErrors = {};

    if (!formValues.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!formValues.slug.trim()) {
      nextErrors.slug = "Slug is required";
    }

    if (formValues.displayOrder <= 0) {
      nextErrors.displayOrder = "Display order must be positive";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const closeDialog = () => {
    setEditingCategory(null);
    setFormValues(initialFormValues);
    setFormErrors({});
    setIsDialogOpen(false);
  };

  const handleSaveCategory = () => {
    if (!validateForm()) {
      toast.error("Please fix the category form errors.");
      return;
    }

    if (editingCategory) {
      dispatch(updateCategory({ id: editingCategory.id, ...formValues }));
      toast.success("Category updated.");
    } else {
      dispatch(addCategory({ id: Date.now(), ...formValues }));
      toast.success("Category added.");
    }

    closeDialog();
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

  const handleDeleteCategory = () => {
    if (!deletingCategory) {
      return;
    }

    dispatch(deleteCategory(deletingCategory.id));
    toast.success("Category deleted.");
    setDeletingCategory(null);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormValues(initialFormValues);
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleRequestDelete = (categoryId: number) => {
    const category = categories.find((item) => item.id === categoryId);

    if (category) {
      setDeletingCategory(category);
    }
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
        onSave={handleSaveCategory}
      />

      <ConfirmDialog
        open={Boolean(deletingCategory)}
        title="Delete category?"
        description={`This will remove ${deletingCategory?.name || "this category"} from the mock admin list.`}
        confirmLabel="Delete"
        onCancel={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
      />
    </>
  );
};

export default Categories;
