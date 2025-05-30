import React from "react";
import { Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

// StyledChip definition with variants
const StyledChip = styled(Chip)<{ customVariant: "default" | "secondary" | "destructive" | "outline" }>(
  ({ theme, customVariant }) => {
    const variants = {
      default: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      },
      secondary: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        "&:hover": {
          backgroundColor: theme.palette.secondary.dark,
        },
      },
      destructive: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        "&:hover": {
          backgroundColor: theme.palette.error.dark,
        },
      },
      outline: {
        backgroundColor: "transparent",
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.text.primary}`,
      },
    };

    return variants[customVariant];
  }
);

// BadgeProps interface definition
export interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  label: string;
}

// Badge component
const Badge: React.FC<BadgeProps> = ({ label, variant = "default", className, ...props }) => {
  return <StyledChip label={label} customVariant={variant} className={className} {...props} />;
};

export { Badge };
