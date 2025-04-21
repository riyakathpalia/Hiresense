import * as React from "react";
import { Card as MuiCard, CardContent as MuiCardContent, CardActions, Typography } from "@mui/material";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <MuiCard
    ref={ref}
    elevation={1}
    style={{
      borderRadius: "8px",
      border: "1px solid #ddd",
      backgroundColor: "#fff",
      color: "inherit",
    }}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "6px" }} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <Typography ref={ref} variant="h5" component="h3" style={{ fontWeight: "600", letterSpacing: "-0.5px" }} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <Typography ref={ref} variant="body2" color="textSecondary" {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <MuiCardContent ref={ref} style={{ padding: "24px", paddingTop: "0" }} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <CardActions ref={ref} style={{ padding: "24px", paddingTop: "0", display: "flex", alignItems: "center" }} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };