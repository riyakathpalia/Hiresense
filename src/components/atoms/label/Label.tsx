import * as React from "react";
import { styled } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { Variant } from "@mui/material/styles/createTypography";

interface LabelProps extends TypographyProps {
  disabled?: boolean;
  variant?: Variant | "inherit";
}

const LabelRoot = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "disabled",
})<LabelProps>(({ theme, disabled }) => ({
  display: "inline-block",
  fontWeight: theme.typography.fontWeightMedium,
  lineHeight: "normal",
  ...(disabled && {
    cursor: "not-allowed",
    opacity: 0.7,
  }),
}));

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, disabled = false, variant = "body2", ...props }, ref) => {
    return (
      <LabelRoot
        ref={ref}
        variant={variant}
        disabled={disabled}
        className={className}
        component="label"
        {...props}
      />
    );
  }
);

Label.displayName = "Label";

export { Label };