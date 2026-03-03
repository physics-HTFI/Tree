import { TextField as MuiTextField, type TextFieldProps } from "@mui/material";

export function TextField({
  value,
  readonly,
  onChange,
  ...rest
}: {
  value?: string | number;
  readonly?: boolean;
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
      slotProps={{ input: { readOnly: readonly } }}
      {...rest}
    />
  );
}
