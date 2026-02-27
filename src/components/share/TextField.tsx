import { TextField as MuiTextField, type TextFieldProps } from "@mui/material";

export function TextField({
  value,
  onChange,
  ...rest
}: {
  value?: string | number;
  onChange?: (value: string) => void;
} & Omit<TextFieldProps, "value" | "onChange">) {
  return (
    <MuiTextField
      value={value ?? ""}
      variant="standard"
      fullWidth
      autoComplete="off"
      spellCheck="false"
      size="small"
      onChange={(e) => onChange?.(e.currentTarget.value)}
      {...rest}
    />
  );
}
