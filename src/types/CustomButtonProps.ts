import { SxProps } from "@mui/material";

export interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'small' | 'medium' | 'large' | 'fullwidth';
    fullWidth?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    loading?: boolean;
    asChild?: boolean;
    sx?:SxProps;
  }
  