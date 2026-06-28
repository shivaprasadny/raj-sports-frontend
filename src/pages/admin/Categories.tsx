import { useState } from "react";
import CategoryToolbar from "../../components/admin/categories/CategoryToolbar";
import CategoryTable from "../../components/admin/categories/CategoryTable";
import CategoryDialog from "../../components/admin/categories/CategoryDialog";
import { addCategory } from "../../features/category/categorySlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { Category } from "../../types/category";
import type { CategoryFormValues } from "../../components/admin/categories/CategoryForm";

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

  const handleSaveCategory = () => {
    const newCategory: Category = {
      id: Date.now(),
      ...formValues,
    };

    dispatch(addCategory(newCategory));
    setFormValues(initialFormValues);
    setIsDialogOpen(false);
  };

  return (
    <>
      <CategoryToolbar onAddCategory={() => setIsDialogOpen(true)} />
      <CategoryTable categories={categories} />

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