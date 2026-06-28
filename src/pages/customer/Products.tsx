import { Box, Container, Grid, Typography } from "@mui/material";
import toast from "react-hot-toast";
import AppSelect from "../../components/common/inputs/AppSelect";
import AppTextField from "../../components/common/inputs/AppTextField";
import ProductCard from "../../features/product/components/ProductCard";
import { addToCart } from "../../features/cart";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { Product } from "../../features/product";
import { useMemo, useState } from "react";

type SortOption = "newest" | "price-asc" | "price-desc";

// Products is the customer shop page with local filters over Redux mock data.
const Products = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.product.products.filter((product) => product.isActive));
  const categories = useAppSelector((state) => state.category.categories);
  const brands = useAppSelector((state) => state.brand.brands);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [brandId, setBrandId] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredProducts = useMemo(() => {
    const nextProducts = products
      .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
      .filter((product) => categoryId === "all" || product.categoryId === Number(categoryId))
      .filter((product) => brandId === "all" || product.brandId === Number(brandId));

    if (sortBy === "price-asc") {
      return [...nextProducts].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    }

    if (sortBy === "price-desc") {
      return [...nextProducts].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    }

    return [...nextProducts].sort((a, b) => b.id - a.id);
  }, [brandId, categoryId, products, search, sortBy]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    toast.success("Added to cart.");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h3" sx={{ fontWeight: 900, mb: 3 }}>
        Products
      </Typography>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr 1fr" }, mb: 3 }}>
        <AppTextField label="Search products" value={search} onChange={(event) => setSearch(event.target.value)} />
        <AppSelect
          label="Category"
          value={categoryId}
          options={[{ label: "All Categories", value: "all" }, ...categories.map((category) => ({ label: category.name, value: category.id }))]}
          onChange={(event) => setCategoryId(event.target.value)}
        />
        <AppSelect
          label="Brand"
          value={brandId}
          options={[{ label: "All Brands", value: "all" }, ...brands.map((brand) => ({ label: brand.name, value: brand.id }))]}
          onChange={(event) => setBrandId(event.target.value)}
        />
        <AppSelect
          label="Sort"
          value={sortBy}
          options={[
            { label: "Newest", value: "newest" },
            { label: "Price Low to High", value: "price-asc" },
            { label: "Price High to Low", value: "price-desc" },
          ]}
          onChange={(event) => setSortBy(event.target.value as SortOption)}
        />
      </Box>
      {filteredProducts.length === 0 ? (
        <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, py: 8, textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            No products found
          </Typography>
          <Typography color="text.secondary">Try a different search or filter.</Typography>
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
