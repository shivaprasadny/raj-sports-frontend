import { useState } from "react";
import CategoryToolbar from "../../components/admin/categories/CategoryToolbar";
import CategoryTable from "../../components/admin/categories/CategoryTable";
import CategoryDialog from "../../components/admin/categories/CategoryDialog";
import { mockCategories } from "../../mocks/categories";

const Categories = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <CategoryToolbar onAddCategory={() => setIsDialogOpen(true)} />
      <CategoryTable categories={mockCategories} />

      <CategoryDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
};

export default Categories;