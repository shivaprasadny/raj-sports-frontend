import StatusChip from "../../../components/common/chips/StatusChip";
import type { StockStatus } from "../types/product";

export const getStockStatus = (stockQuantity: number): StockStatus => {
  if (stockQuantity <= 0) return "Out of Stock";
  if (stockQuantity <= 5) return "Low Stock";
  return "In Stock";
};

// StockStatusChip translates inventory counts into customer-friendly status labels.
export const StockStatusChip = ({ stockQuantity }: { stockQuantity: number }) => {
  const status = getStockStatus(stockQuantity);
  const color = status === "In Stock" ? "success" : status === "Low Stock" ? "warning" : "error";

  return <StatusChip label={status} color={color} />;
};
