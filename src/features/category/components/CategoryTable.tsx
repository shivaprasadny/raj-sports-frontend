import { IconButton, TableCell, TableRow } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StatusChip from "../../../components/common/chips/StatusChip";
import DataTable from "../../../components/common/tables/DataTable";
import type { Category } from "../types/category";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => void;
}

const columns = [
  { id: "name", label: "Name" },
  { id: "slug", label: "Slug" },
  { id: "description", label: "Description" },
  { id: "status", label: "Status" },
  { id: "order", label: "Order" },
  { id: "actions", label: "Actions", align: "right" as const },
];

// CategoryTable renders the admin list and keeps action callbacks page-owned.
const CategoryTable = ({ categories, onEdit, onDelete }: CategoryTableProps) => {
  return (
    <DataTable
      columns={columns}
      isEmpty={categories.length === 0}
      emptyTitle="No categories yet"
      emptyDescription="Add your first category to organize the shop."
    >
      {categories.map((category) => (
        <TableRow key={category.id} hover>
          <TableCell>{category.name}</TableCell>
          <TableCell>{category.slug}</TableCell>
          <TableCell>{category.description || "No description"}</TableCell>
          <TableCell>
            <StatusChip
              label={category.isActive ? "Active" : "Inactive"}
              color={category.isActive ? "success" : "default"}
            />
          </TableCell>
          <TableCell>{category.displayOrder}</TableCell>
          <TableCell align="right">
            <IconButton color="primary" aria-label={`Edit ${category.name}`} onClick={() => onEdit(category)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" aria-label={`Delete ${category.name}`} onClick={() => onDelete(category.id)}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </DataTable>
  );
};

export default CategoryTable;
