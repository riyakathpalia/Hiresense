import React from "react";
import { LinearProgress, Box } from "@mui/material";

interface ProgressProps {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ value = 0, ...props }, ref) => {
  return (
    <Box
      ref={ref}
      sx={{
        position: "relative",
        width: "100%",
        height: 16,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#e0e0e0", // Secondary color
      }}
      {...props}
    >
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: "100%",
          backgroundColor: "transparent",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#3f51b5", // Primary color
          },
        }}
      />
    </Box>
  );
});

Progress.displayName = "Progress";

export { Progress };
