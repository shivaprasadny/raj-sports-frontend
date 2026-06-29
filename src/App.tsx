import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAppDispatch } from "./store/hooks";
import { fetchProducts } from "./features/product/store/productSlice";
import { fetchBrands } from "./features/brand/store/brandSlice";
import { fetchCategories } from "./features/category/store/categorySlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(fetchProducts());
    void dispatch(fetchBrands());
    void dispatch(fetchCategories());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
