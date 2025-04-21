import React from "react";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";

interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof Divider> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const StyledDivider = styled(Divider)<SeparatorProps>(({ orientation }) => ({
  backgroundColor: "#ccc", // Customize the color as needed
  ...(orientation === "horizontal"
    ? { width: "100%", height: "1px" }
    : { width: "1px", height: "100%" }),
}));

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = "horizontal", decorative = true, className, ...props }, ref) => {
    return (
      <StyledDivider
        ref={ref as React.Ref<HTMLHRElement>} 
        orientation={orientation}
        role={decorative ? "presentation" : "separator"}
        className={className}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";
