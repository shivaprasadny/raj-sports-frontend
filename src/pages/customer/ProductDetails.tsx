import { useState, useEffect, useContext } from "react";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Rating,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveIcon from "@mui/icons-material/Remove";
import ShareIcon from "@mui/icons-material/Share";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { addToCart } from "../../features/cart";
import ProductCard from "../../features/product/components/ProductCard";
import { toggleWishlist } from "../../features/wishlist";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { ROUTES } from "../../constants/routes";
import { getProductImageUrl, PRODUCT_IMAGE_PLACEHOLDER } from "../../utils/image";
import ReviewService from "../../services/ReviewService";
import type { Review } from "../../types/review";
import { AuthContext } from "../../context/AuthContext";

// ── Utility ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// ── StarDisplay ───────────────────────────────────────────────────────────────

const StarDisplay = ({ value, count }: { value: number; count: number }) => (
  <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
    <Rating value={value} precision={0.5} readOnly />
    <Typography variant="body2" color="text.secondary">
      {value.toFixed(1)} ({count} {count === 1 ? "review" : "reviews"})
    </Typography>
  </Box>
);

// ── ProductDetails ────────────────────────────────────────────────────────────

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user ?? null;

  const product = useAppSelector((state) =>
    state.product.products.find((item) => item.id === Number(id))
  );
  const allProducts = useAppSelector((state) => state.product.products);
  const brands = useAppSelector((state) => state.brand.brands);
  const categories = useAppSelector((state) => state.category.categories);

  const isWishlisted = useAppSelector((state) =>
    state.wishlist.items.some((item) => item.id === Number(id))
  );

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState<number | null>(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;
    setReviewsLoading(true);
    ReviewService.getApprovedReviews(Number(id), 0, 20)
      .then((page) => setReviews(page.content))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, [id]);

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
          Product not found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          The product may have been removed or is not available.
        </Typography>
        <Button component={Link} to={ROUTES.PRODUCTS} variant="contained" disableElevation>
          Browse All Products
        </Button>
      </Container>
    );
  }

  // ── Derived values ──────────────────────────────────────────────────────────

  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = Boolean(product.salePrice && product.salePrice < product.price);
  const discountPct = hasDiscount
    ? Math.round(((product.price - (product.salePrice ?? 0)) / product.price) * 100)
    : 0;
  const isOutOfStock = product.stockQuantity <= 0;
  const brandName = product.brandName ?? brands.find((b) => b.id === product.brandId)?.name ?? "—";
  const categoryName = product.categoryName ?? categories.find((c) => c.id === product.categoryId)?.name ?? "—";

  const relatedProducts = allProducts
    .filter((p) => p.isActive && p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const featuredProducts = allProducts
    .filter((p) => p.isActive && p.isFeatured && p.id !== product.id)
    .slice(0, 4);

  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : product.imageUrl
      ? [{ id: 0, productId: product.id, imageUrl: product.imageUrl, isPrimary: true, displayOrder: 0, createdAt: "" }]
      : [];
  const currentImage = galleryImages[galleryIdx]?.imageUrl ?? product.imageUrl;

  const variants = product.variants ?? [];
  const variantGroups = variants.reduce<Record<string, { id: number; value: string; priceAdjustment: number; stockQuantity: number }[]>>((acc, v) => {
    if (!acc[v.name]) acc[v.name] = [];
    acc[v.name].push({ id: v.id, value: v.value, priceAdjustment: v.priceAdjustment, stockQuantity: v.stockQuantity });
    return acc;
  }, {});

  const selectedVariantObj = selectedVariant !== null
    ? variants.find((v) => v.id === selectedVariant)
    : null;
  const effectivePrice = displayPrice + (selectedVariantObj?.priceAdjustment ?? 0);

  // ── Cart action ─────────────────────────────────────────────────────────────

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      dispatch(addToCart(product));
    }
    toast.success(`${qty} × ${product.name} added to cart.`);
  };

  const handleAddToCartCard = (p: typeof product) => {
    dispatch(addToCart(p));
    toast.success("Added to cart.");
  };

  // ── Review submit ───────────────────────────────────────────────────────────

  const handleSubmitReview = async () => {
    if (!reviewComment.trim() || !reviewRating) return;
    setSubmittingReview(true);
    try {
      await ReviewService.addReview(product.id, {
        rating: reviewRating,
        title: reviewTitle.trim() || undefined,
        comment: reviewComment.trim(),
      });
      toast.success("Review submitted and pending approval.");
      setReviewRating(5);
      setReviewTitle("");
      setReviewComment("");
    } catch {
      toast.error("Could not submit review. You may have already reviewed this product.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Typography
          component={Link}
          to={ROUTES.HOME}
          color="inherit"
          sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
        >
          Home
        </Typography>
        <Typography
          component={Link}
          to={ROUTES.PRODUCTS}
          color="inherit"
          sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
        >
          Products
        </Typography>
        <Typography color="text.primary" noWrap sx={{ maxWidth: 220 }}>
          {product.name}
        </Typography>
      </Breadcrumbs>

      {/* ── Main product layout ─────────────────────────────────────────────── */}
      <Grid container spacing={5}>
        {/* ── Image gallery ──────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ position: "relative" }}>
            {hasDiscount && (
              <Box
                sx={{
                  bgcolor: "error.main",
                  borderRadius: "8px 0 12px 0",
                  color: "white",
                  fontWeight: 900,
                  fontSize: 14,
                  left: 0,
                  position: "absolute",
                  px: 1.5,
                  py: 0.5,
                  top: 0,
                  zIndex: 1,
                }}
              >
                -{discountPct}% OFF
              </Box>
            )}

            <Box
              component="img"
              src={getProductImageUrl(currentImage)}
              alt={product.name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = PRODUCT_IMAGE_PLACEHOLDER;
              }}
              sx={{
                bgcolor: "grey.100",
                borderRadius: 3,
                height: { xs: 300, md: 460 },
                objectFit: "cover",
                width: "100%",
              }}
            />
          </Box>

          {/* Thumbnail strip */}
          {galleryImages.length > 1 && (
            <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
              {galleryImages.map((img, idx) => (
                <Box
                  key={img.id}
                  component="img"
                  src={getProductImageUrl(img.imageUrl)}
                  alt={`Thumbnail ${idx + 1}`}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = PRODUCT_IMAGE_PLACEHOLDER;
                  }}
                  onClick={() => setGalleryIdx(idx)}
                  sx={{
                    border: idx === galleryIdx ? "2px solid" : "2px solid transparent",
                    borderColor: idx === galleryIdx ? "primary.main" : "transparent",
                    borderRadius: 1,
                    cursor: "pointer",
                    height: 60,
                    objectFit: "cover",
                    width: 60,
                  }}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* ── Product information ─────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
            <Chip label={categoryName} size="small" variant="outlined" color="primary" />
            <Chip label={brandName} size="small" variant="outlined" />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.2, mb: 0.5 }}>
            {product.name}
          </Typography>

          {/* Rating summary */}
          {(product.averageRating ?? 0) > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <StarDisplay value={product.averageRating ?? 0} count={Number(product.reviewCount ?? 0)} />
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            SKU: <strong>{product.sku}</strong>
          </Typography>

          {/* Price */}
          <Box sx={{ alignItems: "baseline", display: "flex", gap: 2, mb: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "primary.main" }}>
              ${effectivePrice.toFixed(2)}
            </Typography>
            {hasDiscount && (
              <Typography
                variant="h5"
                color="text.disabled"
                sx={{ fontWeight: 500, textDecoration: "line-through" }}
              >
                ${product.price.toFixed(2)}
              </Typography>
            )}
            {hasDiscount && (
              <Chip label={`Save $${(product.price - displayPrice).toFixed(2)}`} color="success" size="small" />
            )}
          </Box>

          {/* Stock status */}
          <Box sx={{ mb: 2 }}>
            {isOutOfStock ? (
              <Chip label="Out of Stock" color="error" />
            ) : product.stockQuantity <= 5 ? (
              <Chip label={`Only ${product.stockQuantity} left in stock`} color="warning" />
            ) : (
              <Chip label="In Stock" color="success" />
            )}
          </Box>

          {product.shortDescription && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
              {product.shortDescription}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          {/* ── Variant selectors ────────────────────────────────────────── */}
          {Object.entries(variantGroups).map(([groupName, options]) => (
            <Box key={groupName} sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                {groupName}:
                {selectedVariantObj?.name === groupName && (
                  <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 400 }}>
                    {selectedVariantObj.value}
                  </Typography>
                )}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {options.map((opt) => (
                  <Chip
                    key={opt.id}
                    label={`${opt.value}${opt.priceAdjustment !== 0 ? ` (${opt.priceAdjustment > 0 ? "+" : ""}$${opt.priceAdjustment.toFixed(2)})` : ""}`}
                    onClick={() => setSelectedVariant(selectedVariant === opt.id ? null : opt.id)}
                    color={selectedVariant === opt.id ? "primary" : "default"}
                    variant={selectedVariant === opt.id ? "filled" : "outlined"}
                    disabled={opt.stockQuantity <= 0}
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Box>
            </Box>
          ))}

          {/* Quantity selector */}
          {!isOutOfStock && (
            <Box sx={{ alignItems: "center", display: "flex", gap: 2, mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 60 }}>
                Quantity
              </Typography>
              <Box
                sx={{
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  display: "flex",
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ fontWeight: 700, minWidth: 32, textAlign: "center" }}>
                  {qty}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setQty((q) => Math.min(product.stockQuantity, q + 1))}
                  disabled={qty >= product.stockQuantity}
                  aria-label="Increase quantity"
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {product.stockQuantity} available
              </Typography>
            </Box>
          )}

          {/* Action buttons */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCartIcon />}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              disableElevation
              sx={{ fontWeight: 700, flex: 1, minWidth: 160 }}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ShoppingBagIcon />}
              disabled={isOutOfStock}
              onClick={() => {
                handleAddToCart();
                toast("Go to cart to complete checkout.", { icon: "🛒" });
              }}
              sx={{ fontWeight: 700, flex: 1, minWidth: 140 }}
            >
              Buy Now
            </Button>
          </Box>

          {/* Wishlist + Share */}
          <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
            <Button
              startIcon={isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              color={isWishlisted ? "error" : "inherit"}
              onClick={() => {
                dispatch(toggleWishlist(product));
                toast(isWishlisted ? "Removed from wishlist." : "Added to wishlist.", {
                  icon: isWishlisted ? "💔" : "❤️",
                });
              }}
              sx={{ fontWeight: 700 }}
            >
              {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
            </Button>
            <Tooltip title="Share (coming soon)">
              <IconButton
                color="default"
                onClick={() => toast("Share link copied!", { icon: "🔗" })}
                aria-label="Share product"
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography variant="body2"><strong>Brand:</strong> {brandName}</Typography>
            <Typography variant="body2"><strong>Category:</strong> {categoryName}</Typography>
            {(product.isFeatured || product.isBestSeller || product.isNewArrival) && (
              <Typography variant="body2">
                <strong>Tags:</strong>{" "}
                {[
                  product.isFeatured && "Featured",
                  product.isBestSeller && "Best Seller",
                  product.isNewArrival && "New Arrival",
                ]
                  .filter(Boolean)
                  .join(", ")}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* ── Info tabs ────────────────────────────────────────────────────────── */}
      <Box sx={{ mt: 6 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
        >
          <Tab label="Description" />
          <Tab label="Specifications" />
          <Tab label={`Reviews (${reviews.length})`} />
          <Tab label="Shipping & Returns" />
        </Tabs>

        {/* Description tab */}
        {activeTab === 0 && (
          <Box>
            {product.detailedDescription ? (
              <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {product.detailedDescription}
              </Typography>
            ) : product.description ? (
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {product.description}
              </Typography>
            ) : (
              <Typography color="text.secondary">No detailed description available.</Typography>
            )}
          </Box>
        )}

        {/* Specifications tab */}
        {activeTab === 1 && (
          <Box>
            {product.specifications ? (
              <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                {product.specifications}
              </Typography>
            ) : (
              <Typography color="text.secondary">No specifications available.</Typography>
            )}
          </Box>
        )}

        {/* Reviews tab */}
        {activeTab === 2 && (
          <Box>
            {/* Average rating summary */}
            {reviews.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <StarDisplay value={product.averageRating ?? 0} count={reviews.length} />
              </Box>
            )}

            {reviewsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={32} />
              </Box>
            ) : reviews.length === 0 ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                No reviews yet. Be the first to review this product!
              </Alert>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
                {reviews.map((review) => (
                  <Paper key={review.id} variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {review.userName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(review.createdAt)}
                      </Typography>
                    </Box>
                    <Rating value={review.rating} size="small" readOnly />
                    {review.title && (
                      <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                        {review.title}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {review.comment}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}

            {/* Add review form — only for logged-in users */}
            {user ? (
              <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  Write a Review
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Your Rating *
                  </Typography>
                  <Rating
                    value={reviewRating}
                    onChange={(_, v) => setReviewRating(v)}
                  />
                </Box>
                <TextField
                  label="Title (optional)"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                  slotProps={{ htmlInput: { maxLength: 200 } }}
                />
                <TextField
                  label="Your Review *"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                  slotProps={{ htmlInput: { maxLength: 2000 } }}
                />
                <Button
                  variant="contained"
                  onClick={handleSubmitReview}
                  disabled={submittingReview || !reviewComment.trim() || !reviewRating}
                  disableElevation
                  sx={{ fontWeight: 700 }}
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </Paper>
            ) : (
              <Alert severity="info">
                <Typography variant="body2">
                  <Typography
                    component={Link}
                    to={ROUTES.LOGIN}
                    variant="body2"
                    color="primary"
                    sx={{ textDecoration: "none", fontWeight: 700 }}
                  >
                    Sign in
                  </Typography>{" "}
                  to write a review.
                </Typography>
              </Alert>
            )}
          </Box>
        )}

        {/* Shipping & Returns tab */}
        {activeTab === 3 && (
          <Box>
            {product.careInstructions && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                  Care Instructions
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                  {product.careInstructions}
                </Typography>
              </Box>
            )}
            {product.warrantyInfo && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                  Warranty
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                  {product.warrantyInfo}
                </Typography>
              </Box>
            )}
            {!product.careInstructions && !product.warrantyInfo && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                  Shipping Policy
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Standard shipping within 3–7 business days. Express shipping available at checkout.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                  Returns Policy
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Returns accepted within 30 days of delivery. Items must be unused and in original packaging.
                  Contact our support team to initiate a return.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* ── Related Products ─────────────────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
            Related Products
          </Typography>
          <Grid container spacing={2}>
            {relatedProducts.map((p) => (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <ProductCard product={p} onAddToCart={handleAddToCartCard} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* ── Featured Products ─────────────────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
            Featured Products
          </Typography>
          <Grid container spacing={2}>
            {featuredProducts.map((p) => (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <ProductCard product={p} onAddToCart={handleAddToCartCard} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Paper variant="outlined" sx={{ mt: 8, p: 3, textAlign: "center", bgcolor: "grey.50" }}>
        <Typography variant="body2" color="text.secondary">
          Raj Sports — Quality cricket gear for every player.{" "}
          <Typography
            component={Link}
            to={ROUTES.CONTACT}
            variant="body2"
            color="primary"
            sx={{ textDecoration: "none" }}
          >
            Contact us
          </Typography>{" "}
          for bulk orders or queries.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ProductDetails;
