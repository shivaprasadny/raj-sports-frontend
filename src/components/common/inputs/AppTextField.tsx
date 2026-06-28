import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

// AppTextField centralizes the default form field size and full-width behavior.
const AppTextField = (props: TextFieldProps) => {
  return <TextField fullWidth size="small" {...props} />;
};

export default AppTextField;
