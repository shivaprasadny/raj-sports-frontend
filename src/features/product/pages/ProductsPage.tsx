import { useState } from "react";
import toast from "react-hot-toast";
import { Box, Typography } from "@mui/material";
import ConfirmDialog from "../../../components/common/dialogs/ConfirmDialog";
import PrimaryButton from "../../../components/common/buttons/PrimaryButton";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import ProductDialog from "../components/ProductDialog";
import ProductTable from "../components/ProductTable";
import { ProductService } from "../../../services/ProductService";
import { addProduct, deleteProduct, updateProduct } from "../store/productSlice";
import type { Product } from "../types/product";
import type { ProductFormErrors, ProductFormValues } from "../components/ProductForm";

// Blank form state used whenever "Add Product" is opened.
const initialProductForm: ProductFormValues = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  sku: "",
  brandId: 1,
  categoryId: 1,
  price: 0,
  salePrice: "",
  stockQuantity: 0,
  imageUrl: "",
  isActive: true,
  isFeatured: false,
  isBestSeller: false,
  isNewArrival: false,
};

// ProductsPage coordinates product CRUD while form/table stay componentized.
const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.product.products);
  const brands = useAppSelector((state) => state.brand.brands);
  const categories = useAppSelector((state) => state.category.categories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [formValues, setFormValues] = useState<ProductFormValues>(initialProductForm);
  const [formErrors, setFormErrors] = useState<ProductFormErrors>({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const validateForm = () => {
    const nextErrors: ProductFormErrors = {};

    if (!formValues.name.trim()) nextErrors.name = "Name is required";
    if (!formValues.slug.trim()) nextErrors.slug = "Slug is required";
    if (!formValues.sku.trim()) nextErrors.sku = "SKU is required";
    if (!formValues.shortDescription.trim()) nextErrors.shortDescription = "Short description is required";
    if (formValues.price <= 0) nextErrors.price = "Price must be positive";
    if (formValues.stockQuantity < 0) nextErrors.stockQuantity = "Stock cannot be negative";
    if (!formValues.brandId) nextErrors.brandId = "Brand is required";
    if (!formValues.categoryId) nextErrors.categoryId = "Category is required";

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormValues({ ...initialProductForm, brandId: brands[0]?.id ?? 1, categoryId: categories[0]?.id ?? 1 });
    setFormErrors({});
    setIsUploadingImage(false);
  };

  const toProductPayload = (id: number): Product => ({
    ...formValues,
    id,
    salePrice: formValues.salePrice === "" ? undefined : formValues.salePrice,
    imageUrl: formValues.imageUrl.trim() || undefined,
  });

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Please fix the product form errors.");
      return;
    }

    if (editingProduct) {
      dispatch(updateProduct(toProductPayload(editingProduct.id)));
      toast.success("Product updated.");
    } else {
      dispatch(addProduct(toProductPayload(Date.now())));
      toast.success("Product added.");
    }

    closeDialog();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormValues({ ...product, salePrice: product.salePrice ?? "", imageUrl: product.imageUrl || "" });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (!deletingProduct) return;
    dispatch(deleteProduct(deletingProduct.id));
    toast.success("Product deleted.");
    setDeletingProduct(null);
  };

  // handleImageUpload sends the chosen file to the backend, then syncs the returned
  // product (with the new imageUrl) into Redux and local dialog form state so the
  // preview in ProductDialog updates immediately without a page refresh.
  const handleImageUpload = async (file: File) => {
    if (!editingProduct) {
      toast.error("Save the product before uploading an image.");
      return;
    }

    setIsUploadingImage(true);

    try {
      // Backend returns the full product with the updated imageUrl path.
      const updatedProduct = await ProductService.uploadProductImage(editingProduct.id, file);

      // Merge the returned product over the current editing snapshot.
      const nextProduct = { ...editingProduct, ...updatedProduct };

      // Sync into Redux store so the products table thumbnail also updates.
      dispatch(updateProduct(nextProduct));

      // Keep the dialog's local state in sync so the image preview refreshes.
      setEditingProduct(nextProduct);
      setFormValues({
        ...nextProduct,
        salePrice: nextProduct.salePrice ?? "",
        imageUrl: nextProduct.imageUrl || "",
      });

      toast.success("Product image uploaded.");
    } catch {
      toast.error("Unable to upload image. Confirm this product exists in the backend.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAdd = () => {
    setFormValues({ ...initialProductForm, brandId: brands[0]?.id ?? 1, categoryId: categories[0]?.id ?? 1 });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  return (
    <Box>
      <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Products
        </Typography>
        <PrimaryButton onClick={handleAdd}>Add Product</PrimaryButton>
      </Box>

      <ProductTable products={products} brands={brands} categories={categories} onEdit={handleEdit} onDelete={setDeletingProduct} />
      <ProductDialog
        open={isDialogOpen}
        title={editingProduct ? "Edit Product" : "Add Product"}
        values={formValues}
        errors={formErrors}
        brands={brands}
        categories={categories}
        onChange={setFormValues}
        onClose={closeDialog}
        onSave={handleSave}
        canUploadImage={Boolean(editingProduct)}
        isUploadingImage={isUploadingImage}
        onImageUpload={(file) => void handleImageUpload(file)}
      />
      <ConfirmDialog
        open={Boolean(deletingProduct)}
        title="Delete product?"
        description={`This will remove ${deletingProduct?.name || "this product"} from the mock catalog.`}
        confirmLabel="Delete"
        onCancel={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default ProductsPage;
