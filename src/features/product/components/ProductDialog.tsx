import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ImageIcon from "@mui/icons-material/Image";
import PrimaryButton from "../../../components/common/buttons/PrimaryButton";
import SecondaryButton from "../../../components/common/buttons/SecondaryButton";
import ProductForm from "./ProductForm";
import { getProductImageUrl, PRODUCT_IMAGE_PLACEHOLDER } from "../../../utils/image";
import type { Brand } from "../../brand";
import type { Category } from "../../category/types/category";
import type { ProductFormErrors, ProductFormValues } from "./ProductForm";

interface ProductDialogProps {
  open: boolean;
  title: string;
  values: ProductFormValues;
  errors?: ProductFormErrors;
  brands: Brand[];
  categories: Category[];
  onChange: (values: ProductFormValues) => void;
  onClose: () => void;
  onSave: () => void;
  /** Called with the chosen File when the admin clicks "Upload Image". */
  onImageUpload?: (file: File) => void;
  /** True only when editing an existing product — upload requires a backend product id. */
  canUploadImage?: boolean;
  /** Controlled by the parent while the upload HTTP request is in-flight. */
  isUploadingImage?: boolean;
}

// ProductDialog keeps the large product form and image upload UI out of the admin page.
const ProductDialog = ({
  open,
  title,
  values,
  errors,
  brands,
  categories,
  onChange,
  onClose,
  onSave,
  onImageUpload,
  canUploadImage = false,
  isUploadingImage = false,
}: ProductDialogProps) => {
  // pendingFile holds the file the admin selected but has not yet uploaded.
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Ref so we can detect when isUploadingImage transitions true → false.
  const prevUploadingRef = useRef(false);

  // Clear the pending file selection when the dialog closes.
  useEffect(() => {
    if (!open) {
      setPendingFile(null);
    }
  }, [open]);

  // Clear pending file once an upload finishes (success or error).
  useEffect(() => {
    if (prevUploadingRef.current && !isUploadingImage) {
      setPendingFile(null);
    }
    prevUploadingRef.current = isUploadingImage;
  }, [isUploadingImage]);

  // Preview URL: use the uploaded backend image or fall back to the placeholder SVG.
  const previewUrl = getProductImageUrl(values.imageUrl);
  const hasImage = Boolean(values.imageUrl);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        {/* Core product fields (name, price, stock, etc.) */}
        <ProductForm
          values={values}
          errors={errors}
          brands={brands}
          categories={categories}
          onChange={onChange}
        />

        <Divider sx={{ mt: 3, mb: 3 }} />

        {/* ── Product Image Section ─────────────────────────────────────── */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
            Product Image
          </Typography>

          {canUploadImage ? (
            <>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                Choose a JPG, PNG, or WebP file then click <strong>Upload Image</strong> to save it.
              </Typography>

              {/* Current image preview ─ shown whenever the product has an imageUrl */}
              <Box
                sx={{
                  alignItems: "center",
                  bgcolor: "grey.50",
                  border: "1px solid",
                  borderColor: hasImage ? "primary.light" : "divider",
                  borderRadius: 2,
                  display: "flex",
                  gap: 2,
                  mb: 2,
                  overflow: "hidden",
                  p: 1.5,
                }}
              >
                {/* Thumbnail — 100×80 box, fills with the backend image or placeholder */}
                <Box
                  component="img"
                  src={previewUrl}
                  alt={hasImage ? "Current product image" : "No image uploaded"}
                  sx={{
                    borderRadius: 1,
                    flexShrink: 0,
                    height: 80,
                    objectFit: "cover",
                    width: 100,
                  }}
                  // Fall back to the SVG placeholder if the src URL 404s.
                  onError={(event) => {
                    (event.currentTarget as HTMLImageElement).src = PRODUCT_IMAGE_PLACEHOLDER;
                  }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {hasImage ? "Current image" : "No image uploaded"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                    {hasImage ? values.imageUrl : "Upload an image to display it on the product page."}
                  </Typography>
                </Box>
              </Box>

              {/* Step 1 – Choose a file from the local computer */}
              <Box sx={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1.5 }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<FolderOpenIcon />}
                  disabled={isUploadingImage}
                >
                  Choose Image
                  {/* Hidden native file input; only image types are allowed */}
                  <input
                    hidden
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      // Reset the input value so re-selecting the same file fires onChange again.
                      event.target.value = "";
                      setPendingFile(file);
                    }}
                  />
                </Button>

                {/* Selected filename feedback — only visible after a file is chosen */}
                {pendingFile ? (
                  <Box sx={{ alignItems: "center", display: "flex", gap: 0.75 }}>
                    <ImageIcon fontSize="small" color="primary" />
                    <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: "break-all" }}>
                      {pendingFile.name}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No file selected
                  </Typography>
                )}
              </Box>

              {/* Step 2 – Send the chosen file to the backend */}
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                disabled={!pendingFile || isUploadingImage}
                onClick={() => {
                  // Guard: pendingFile must exist (button is disabled otherwise).
                  if (pendingFile && onImageUpload) {
                    onImageUpload(pendingFile);
                  }
                }}
              >
                {isUploadingImage ? "Uploading…" : "Upload Image"}
              </Button>
            </>
          ) : (
            // Add-product mode: product has no backend id yet, so upload requires saving first.
            <Alert severity="info">
              Click <strong>Save Product</strong> — the image upload section will appear automatically so you can add an image right away.
            </Alert>
          )}
        </Box>
        {/* ── End Product Image Section ─────────────────────────────────── */}
      </DialogContent>

      <DialogActions>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={onSave}>Save Product</PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialog;
