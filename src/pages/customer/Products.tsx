import { useMemo, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Container,
  Grid,
  Slider,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import AppSelect from "../../components/common/inputs/AppSelect";
import AppTextField from "../../components/common/inputs/AppTextField";
import ProductCard from "../../features/product/components/ProductCard";
import { addToCart } from "../../features/cart";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { Product } from "../../features/product";

// Available sort options.
type SortOption = "newest" | "name-az" | "name-za" | "price-asc" | "price-desc";

// Quick-filter toggle buttons.
const QUICK_FILTERS = [
  { label: "In Stock", key: "inStock" },
  { label: "Featured", key: "featured" },
  { label: "Best Seller", key: "bestSeller" },
  { label: "New Arrival", key: "newArrival" },
] as const;

type QuickFilterKey = (typeof QUICK_FILTERS)[number]["key"];

// Products is the customer shop page with full filtering, sorting, and pagination.
const Products = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) =>
    state.product.products.filter((product) => product.isActive)
  );
  const categories = useAppSelector((state) => state.category.categories);
  const brands = useAppSelector((state) => state.brand.brands);

  // ── Filter state ───────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [brandId, setBrandId] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Price range slider — derive max from the product catalogue.
  const maxPrice = useMemo(
    () => Math.ceil(Math.max(...products.map((p) => p.price), 0) / 50) * 50 || 500,
    [products]
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  // Quick-filter toggles (checkbox-style).
  const [activeFilters, setActiveFilters] = useState<Set<QuickFilterKey>>(new Set());

  const toggleFilter = (key: QuickFilterKey) =>
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  // ── Filtered + sorted product list ─────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Text search on product name.
    if (search.trim()) {
      const needle = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(needle));
    }

    // Dropdown filters.
    if (categoryId !== "all") {
      result = result.filter((p) => p.categoryId === Number(categoryId));
    }
    if (brandId !== "all") {
      result = result.filter((p) => p.brandId === Number(brandId));
    }

    // Price range filter — check against the effective display price.
    result = result.filter((p) => {
      const price = p.salePrice ?? p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Quick-filter toggles.
    if (activeFilters.has("inStock")) result = result.filter((p) => p.stockQuantity > 0);
    if (activeFilters.has("featured")) result = result.filter((p) => p.isFeatured);
    if (activeFilters.has("bestSeller")) result = result.filter((p) => p.isBestSeller);
    if (activeFilters.has("newArrival")) result = result.filter((p) => p.isNewArrival);

    // Sorting.
    switch (sortBy) {
      case "name-az":
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case "name-za":
        return result.sort((a, b) => b.name.localeCompare(a.name));
      case "price-asc":
        return result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
      case "price-desc":
        return result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
      default:
        // newest — highest id first (mirrors insertion order of mock data).
        return result.sort((a, b) => b.id - a.id);
    }
  }, [products, search, categoryId, brandId, priceRange, activeFilters, sortBy]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    toast.success("Added to cart.");
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryId("all");
    setBrandId("all");
    setPriceRange([0, maxPrice]);
    setActiveFilters(new Set());
    setSortBy("newest");
  };

  const hasActiveFilters =
    search !== "" ||
    categoryId !== "all" ||
    brandId !== "all" ||
    activeFilters.size > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== maxPrice;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <Box sx={{ alignItems: "baseline", display: "flex", gap: 2, mb: 3 }}>
        <Typography variant="h3" sx={{ fontWeight: 900 }}>
          Products
        </Typography>
        <Typography color="text.secondary">
          {filteredProducts.length} of {products.length}
        </Typography>
        {hasActiveFilters && (
          <Button size="small" onClick={clearFilters} color="error" sx={{ fontWeight: 700 }}>
            Clear All Filters
          </Button>
        )}
      </Box>

      {/* ── Filter / sort bar ──────────────────────────────────────────────── */}
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr 1fr" }, mb: 2 }}>
        <AppTextField
          label="Search products"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <AppSelect
          label="Category"
          value={categoryId}
          options={[
            { label: "All Categories", value: "all" },
            ...categories.map((c) => ({ label: c.name, value: c.id })),
          ]}
          onChange={(event) => setCategoryId(event.target.value)}
        />
        <AppSelect
          label="Brand"
          value={brandId}
          options={[
            { label: "All Brands", value: "all" },
            ...brands.map((b) => ({ label: b.name, value: b.id })),
          ]}
          onChange={(event) => setBrandId(event.target.value)}
        />
        <AppSelect
          label="Sort by"
          value={sortBy}
          options={[
            { label: "Newest", value: "newest" },
            { label: "Name A → Z", value: "name-az" },
            { label: "Name Z → A", value: "name-za" },
            { label: "Price Low → High", value: "price-asc" },
            { label: "Price High → Low", value: "price-desc" },
          ]}
          onChange={(event) => setSortBy(event.target.value as SortOption)}
        />
      </Box>

      {/* ── Price range slider ────────────────────────────────────────────── */}
      <Box sx={{ mb: 2, maxWidth: 400 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
          Price Range: ${priceRange[0]} — ${priceRange[1]}
        </Typography>
        <Slider
          value={priceRange}
          min={0}
          max={maxPrice}
          step={10}
          onChange={(_, val) => setPriceRange(val as [number, number])}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `$${v}`}
          sx={{ color: "primary.main" }}
        />
      </Box>

      {/* ── Quick-filter toggle chips ─────────────────────────────────────── */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
        {QUICK_FILTERS.map(({ label, key }) => (
          <Chip
            key={key}
            label={label}
            clickable
            variant={activeFilters.has(key) ? "filled" : "outlined"}
            color={activeFilters.has(key) ? "primary" : "default"}
            onClick={() => toggleFilter(key)}
            sx={{ fontWeight: 700 }}
          />
        ))}
      </Box>

      {/* ── Product grid / empty state ────────────────────────────────────── */}
      {filteredProducts.length === 0 ? (
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            py: 10,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            No products found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Try adjusting the search or filters.
          </Typography>
          <ButtonGroup>
            <Button onClick={clearFilters} variant="outlined">
              Clear Filters
            </Button>
          </ButtonGroup>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredProducts.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Products;
