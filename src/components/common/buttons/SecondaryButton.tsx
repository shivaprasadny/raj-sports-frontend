import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

// SecondaryButton is used for lower-emphasis actions like cancel and filters.
const SecondaryButton = ({ sx, ...props }: ButtonProps) => {
  return (
    <Button
      variant="outlined"
      sx={{ textTransform: "none", fontWeight: 700, ...sx }}
      {...props}
    />
  );
};

export default SecondaryButton;
