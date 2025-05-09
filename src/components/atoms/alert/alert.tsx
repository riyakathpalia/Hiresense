import React from "react";
import { styled } from "@mui/material/styles";
import MuiAlert, { AlertProps as MuiAlertProps } from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import clsx from "clsx";

const CustomAlert = styled(MuiAlert)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  position: "relative",
}));

interface AlertProps extends MuiAlertProps {
  className?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, ...props }, ref) => (
  <CustomAlert ref={ref} className={clsx(className)} {...props} />
));

Alert.displayName = "Alert";

const AlertTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
  fontWeight: theme.typography.fontWeightMedium,
  lineHeight: 1.2,
}));

const AlertDescription = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
}));

export { Alert, AlertTitle, AlertDescription };
