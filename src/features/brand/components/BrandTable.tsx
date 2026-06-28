import { IconButton, TableCell, TableRow } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DataTable from "../../../components/common/tables/DataTable";
import StatusChip from "../../../components/common/chips/StatusChip";
import type { Brand } from "../types/brand";

interface BrandTableProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

const columns = [
  { id: "name", label: "Name" },
  { id: "slug", label: "Slug" },
  { id: "description", label: "Description" },
  { id: "status", label: "Status" },
  { id: "order", label: "Order" },
  { id: "actions", label: "Actions", align: "right" as const },
];

// BrandTable renders brand rows with reusable empty-state behavior.
const BrandTable = ({ brands, onEdit, onDelete }: BrandTableProps) => {
  return (
    <DataTable
      columns={columns}
      isEmpty={brands.length === 0}
      emptyTitle="No brands yet"
      emptyDescription="Add brands so products can be filtered and managed."
    >
      {brands.map((brand) => (
        <TableRow key={brand.id} hover>
          <TableCell>{brand.name}</TableCell>
          <TableCell>{brand.slug}</TableCell>
          <TableCell>{brand.description || "No description"}</TableCell>
          <TableCell>
            <StatusChip label={brand.isActive ? "Active" : "Inactive"} color={brand.isActive ? "success" : "default"} />
          </TableCell>
          <TableCell>{brand.displayOrder}</TableCell>
          <TableCell align="right">
            <IconButton color="primary" aria-label={`Edit ${brand.name}`} onClick={() => onEdit(brand)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" aria-label={`Delete ${brand.name}`} onClick={() => onDelete(brand)}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </DataTable>
  );
};

export default BrandTable;
