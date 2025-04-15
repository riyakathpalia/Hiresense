import React from "react";
import Box from "@mui/material/Box";

interface GlassCardProps {
  className?: string;
  intensity?: "light" | "medium" | "heavy";
  children: React.ReactNode;
  sx?: object;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  className, 
  intensity = "medium", 
  children,
  sx,
  ...props 
}) => {
  const intensityStyles = {
    light: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(4px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    medium: {
      backgroundColor: "rgba(255, 255, 255, 0.4)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    heavy: {
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
    },
  };

  return (
    <Box
      className={className}
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        padding: 2,
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
        },
        ...intensityStyles[intensity],
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default GlassCard;