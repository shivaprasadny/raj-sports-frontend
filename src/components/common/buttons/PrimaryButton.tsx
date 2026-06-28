import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

// PrimaryButton keeps the main call-to-action styling consistent across pages.
const PrimaryButton = ({ sx, ...props }: ButtonProps) => {
  return (
    <Button
      variant="contained"
      disableElevation
      sx={{ textTransform: "none", fontWeight: 700, ...sx }}
      {...props}
    />
  );
};

export default PrimaryButton;
