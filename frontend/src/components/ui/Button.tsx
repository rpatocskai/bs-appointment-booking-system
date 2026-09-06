import { Button as MuiButton, CircularProgress } from "@mui/material";
import type { ButtonProps as MuiButtonProps } from "@mui/material";

export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
}

const variantStyles = {
  primary: {
    backgroundColor: "#3D2314",
    color: "#FDFBF7",
    "&:hover": { backgroundColor: "#52301C" },
  },
  secondary: {
    backgroundColor: "#C19A6B",
    color: "#3D2314",
    "&:hover": { backgroundColor: "#D4AC7D" },
  },
  outline: {
    border: "2px solid #3D2314",
    color: "#3D2314",
    backgroundColor: "transparent",
    "&:hover": { backgroundColor: "#3D2314", color: "#FDFBF7" },
  },
  ghost: {
    color: "#3D2314",
    backgroundColor: "transparent",
    "&:hover": { backgroundColor: "rgba(232, 211, 185, 0.4)" },
  },
};

export const Button = ({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  startIcon,
  sx,
  ...props
}: ButtonProps) => {
  return (
    <MuiButton
      disabled={disabled || isLoading}
      startIcon={
        isLoading ? <CircularProgress size={18} color="inherit" /> : startIcon
      }
      sx={{
        borderRadius: "12px",
        padding: "10px 20px",
        fontWeight: 600,
        textTransform: "none",
        transition: "all 0.2s ease",
        boxShadow: "none",
        ...variantStyles[variant],
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};
