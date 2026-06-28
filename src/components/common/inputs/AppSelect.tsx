import { MenuItem, TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

export interface AppSelectOption {
  label: string;
  value: string | number | boolean;
}

interface AppSelectProps extends Omit<TextFieldProps, "select"> {
  options: AppSelectOption[];
}

// AppSelect wraps MUI select fields so feature forms share the same API shape.
const AppSelect = ({ options, ...props }: AppSelectProps) => {
  return (
    <TextField select fullWidth size="small" {...props}>
      {options.map((option) => (
        <MenuItem key={String(option.value)} value={String(option.value)}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default AppSelect;
