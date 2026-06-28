import { IconButton, TableCell, TableRow } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DataTable from "../../../components/common/tables/DataTable";
import StatusChip from "../../../components/common/chips/StatusChip";
import { StockStatusChip } from "./ProductStatus";
import type { Brand } from "../../brand";
import type { Category } from "../../category/types/category";
import type { Product } from "../types/product";

interface ProductTableProps {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const columns = [
  { id: "name", label: "Name" },
  { id: "sku", label: "SKU" },
  { id: "brand", label: "Brand" },
  { id: "category", label: "Category" },
  { id: "price", label: "Price" },
  { id: "status", label: "Status" },
  { id: "stock", label: "Stock" },
  { id: "actions", label: "Actions", align: "right" as const },
];

// ProductTable renders admin product rows with related brand/category names.
const ProductTable = ({ products, brands, categories, onEdit, onDelete }: ProductTableProps) => {
  const brandName = (brandId: number) => brands.find((brand) => brand.id === brandId)?.name || "Unknown";
  const categoryName = (categoryId: number) => categories.find((category) => category.id === categoryId)?.name || "Unknown";

  return (
    <DataTable
      columns={columns}
      isEmpty={products.length === 0}
      emptyTitle="No products yet"
      emptyDescription="Add cricket equipment to start building the catalog."
    >
      {products.map((product) => (
        <TableRow key={product.id} hover>
          <TableCell>{product.name}</TableCell>
          <TableCell>{product.sku}</TableCell>
          <TableCell>{brandName(product.brandId)}</TableCell>
          <TableCell>{categoryName(product.categoryId)}</TableCell>
          <TableCell>${(product.salePrice ?? product.price).toFixed(2)}</TableCell>
          <TableCell>
            <StatusChip label={product.isActive ? "Active" : "Inactive"} color={product.isActive ? "success" : "default"} />
          </TableCell>
          <TableCell>
            <StockStatusChip stockQuantity={product.stockQuantity} />
          </TableCell>
          <TableCell align="right">
            <IconButton color="primary" aria-label={`Edit ${product.name}`} onClick={() => onEdit(product)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" aria-label={`Delete ${product.name}`} onClick={() => onDelete(product)}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </DataTable>
  );
};

export default ProductTable;
