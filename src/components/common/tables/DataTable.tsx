import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

interface DataTableColumn {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps {
  columns: DataTableColumn[];
  children: ReactNode;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription?: string;
}

// DataTable provides a shared MUI table frame and friendly empty state.
const DataTable = ({
  columns,
  children,
  isEmpty,
  emptyTitle,
  emptyDescription,
}: DataTableProps) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} align={column.align}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {column.label}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {emptyTitle}
                  </Typography>
                  {emptyDescription ? (
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      {emptyDescription}
                    </Typography>
                  ) : null}
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            children
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
