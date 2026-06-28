import { Avatar, Box, IconButton, Stack, TableCell, TableRow, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import DataTable from "../../../components/common/tables/DataTable";
import { getProductImageUrl } from "../../../utils/image";
import type { CartItem } from "../types/cart";

interface CartItemsTableProps {
  items: CartItem[];
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
}

const columns = [
  { id: "product", label: "Product" },
  { id: "price", label: "Price" },
  { id: "quantity", label: "Quantity" },
  { id: "total", label: "Total" },
  { id: "actions", label: "Actions", align: "right" as const },
];

// CartItemsTable handles quantity controls and empty cart messaging.
const CartItemsTable = ({ items, onIncrease, onDecrease, onRemove }: CartItemsTableProps) => {
  return (
    <DataTable
      columns={columns}
      isEmpty={items.length === 0}
      emptyTitle="Your cart is empty"
      emptyDescription="Add cricket gear from the products page to see it here."
    >
      {items.map((item) => (
        <TableRow key={item.productId} hover>
          <TableCell>
            <Box sx={{ alignItems: "center", display: "flex", gap: 1.5 }}>
              <Avatar
                src={getProductImageUrl(item.imageUrl)}
                alt={item.name}
                variant="rounded"
                sx={{ height: 44, width: 44 }}
              />
              <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
            </Box>
          </TableCell>
          <TableCell>${item.price.toFixed(2)}</TableCell>
          <TableCell>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <IconButton size="small" onClick={() => onDecrease(item.productId)} aria-label={`Decrease ${item.name}`}>
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Box sx={{ minWidth: 28, textAlign: "center" }}>
                <Typography sx={{ fontWeight: 800 }}>{item.quantity}</Typography>
              </Box>
              <IconButton size="small" onClick={() => onIncrease(item.productId)} aria-label={`Increase ${item.name}`}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Stack>
          </TableCell>
          <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
          <TableCell align="right">
            <IconButton color="error" onClick={() => onRemove(item.productId)} aria-label={`Remove ${item.name}`}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </DataTable>
  );
};

export default CartItemsTable;
