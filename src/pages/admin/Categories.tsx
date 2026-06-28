import CategoryToolbar from "../../components/admin/categories/CategoryToolbar";
import CategoryTable from "../../components/admin/categories/CategoryTable";
import { mockCategories } from "../../mocks/categories";

const Categories = () => {
  return (
    <>
      <CategoryToolbar />
      <CategoryTable categories={mockCategories} />
    </>
  );
};

export default Categories;