import { useState } from "react";
import CategoryToolbar from "../components/CategoryToolbar";
import CategoryTable from "../components/CategoryTable";
import CategoryDialog from "../components/CategoryDialog";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import type { Category } from "../types/category";
import type { CategoryFormValues } from "../components/CategoryForm";
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
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

const handleSaveCategory = () => {
  if (editingCategory) {
    dispatch(updateCategory({ id: editingCategory.id, ...formValues }));
  } else {
    dispatch(addCategory({ id: Date.now(), ...formValues }));
  }

  setEditingCategory(null);
  setFormValues(initialFormValues);
  setIsDialogOpen(false);
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
  setIsDialogOpen(true);
};

  return (
    <>
      <CategoryToolbar onAddCategory={() => setIsDialogOpen(true)} />
    <CategoryTable
  categories={categories}
  onEdit={handleEditCategory}
  onDelete={(categoryId) => dispatch(deleteCategory(categoryId))}
/>

      <CategoryDialog
        open={isDialogOpen}
        values={formValues}
        onChange={setFormValues}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveCategory}
      />
    </>
  );
};

export default Categories;