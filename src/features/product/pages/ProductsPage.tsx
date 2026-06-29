import { useState } from "react";
import toast from "react-hot-toast";
import { Box, Typography } from "@mui/material";
import ConfirmDialog from "../../../components/common/dialogs/ConfirmDialog";
import PrimaryButton from "../../../components/common/buttons/PrimaryButton";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import ProductDialog from "../components/ProductDialog";
import ProductTable from "../components/ProductTable";
import { ProductService } from "../../../services/ProductService";
import { fetchProducts } from "../store/productSlice";
import type { Product } from "../types/product";
import type { ProductFormErrors, ProductFormValues } from "../components/ProductForm";

const initialProductForm: ProductFormValues = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  detailedDescription: "",
  specifications: "",
  careInstructions: "",
  warrantyInfo: "",
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

  const toPayload = () => ({
    ...formValues,
    salePrice: formValues.salePrice === "" ? undefined : Number(formValues.salePrice),
    imageUrl: formValues.imageUrl.trim() || undefined,
    lowStockThreshold: 5,
  });

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the product form errors.");
      return;
    }

    try {
      if (editingProduct) {
        await ProductService.update(editingProduct.id, toPayload());
        toast.success("Product updated.");
      } else {
        await ProductService.create(toPayload());
        toast.success("Product added.");
      }
      await dispatch(fetchProducts());
      closeDialog();
    } catch {
      toast.error("Failed to save product. Please try again.");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormValues({
      ...initialProductForm,
      ...product,
      detailedDescription: product.detailedDescription ?? "",
      specifications: product.specifications ?? "",
      careInstructions: product.careInstructions ?? "",
      warrantyInfo: product.warrantyInfo ?? "",
      salePrice: product.salePrice ?? "",
      imageUrl: product.imageUrl || "",
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      await ProductService.remove(deletingProduct.id);
      toast.success("Product deleted.");
      await dispatch(fetchProducts());
    } catch {
      toast.error("Failed to delete product.");
    } finally {
      setDeletingProduct(null);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!editingProduct) {
      toast.error("Save the product before uploading an image.");
      return;
    }

    setIsUploadingImage(true);

    try {
      const updatedProduct = await ProductService.uploadProductImage(editingProduct.id, file);
      const nextProduct = { ...editingProduct, ...updatedProduct };
      setEditingProduct(nextProduct);
      setFormValues((prev) => ({
        ...prev,
        imageUrl: nextProduct.imageUrl || "",
        salePrice: nextProduct.salePrice ?? "",
      }));
      await dispatch(fetchProducts());
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
        onSave={() => void handleSave()}
        canUploadImage={Boolean(editingProduct)}
        isUploadingImage={isUploadingImage}
        onImageUpload={(file) => void handleImageUpload(file)}
      />
      <ConfirmDialog
        open={Boolean(deletingProduct)}
        title="Delete product?"
        description={`This will permanently delete ${deletingProduct?.name || "this product"}.`}
        confirmLabel="Delete"
        onCancel={() => setDeletingProduct(null)}
        onConfirm={() => void handleDelete()}
      />
    </Box>
  );
};

export default ProductsPage;
