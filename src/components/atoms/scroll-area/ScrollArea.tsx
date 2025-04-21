import * as React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";

interface ScrollAreaProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const ScrollAreaContainer = styled(Box)({
  position: "relative",
  overflow: "hidden",
  width: "100%",
  height: "100%",
});

const ScrollViewport = styled(Box)({
  height: "100%",
  width: "100%",
  overflowY: "auto",
  overflowX: "hidden",
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: "4px",
  },
});

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(({ children, ...props }, ref) => (
  <ScrollAreaContainer ref={ref} {...props}>
    <ScrollViewport>{children}</ScrollViewport>
  </ScrollAreaContainer>
));

ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
