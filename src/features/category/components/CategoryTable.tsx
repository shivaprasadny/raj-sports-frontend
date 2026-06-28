import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import type { Category } from "../types/category";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => void;
}

const CategoryTable = ({ categories, onEdit, onDelete }: CategoryTableProps) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Order</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} hover>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                <Chip
                  label={category.isActive ? "Active" : "Inactive"}
                  color={category.isActive ? "success" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell>{category.displayOrder}</TableCell>
              <TableCell align="right">
  <IconButton
    color="primary"
    onClick={() => onEdit(category)}
  >
    <EditIcon />
  </IconButton>

  <IconButton
    color="error"
    onClick={() => onDelete(category.id)}
  >
    <DeleteIcon />
  </IconButton>
</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategoryTable;