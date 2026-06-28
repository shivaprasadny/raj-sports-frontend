import { Chip } from "@mui/material";
import type { ChipProps } from "@mui/material";

interface StatusChipProps {
  label: string;
  color?: ChipProps["color"];
}

// StatusChip keeps table/grid state labels visually consistent.
const StatusChip = ({ label, color = "default" }: StatusChipProps) => {
  return <Chip label={label} color={color} size="small" sx={{ fontWeight: 700 }} />;
};

export default StatusChip;
