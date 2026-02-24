import { Typography } from "@mui/material";

export function Header({ title }: { title: string }) {
  return (
    <Typography
      variant="body1"
      sx={{
        textAlign: "right",
        whiteSpace: "nowrap",
      }}
    >
      {title}
    </Typography>
  );
}
