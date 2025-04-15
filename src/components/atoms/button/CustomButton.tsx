'use client';
import { ButtonBase, CircularProgress } from '@mui/material';
import { CustomButtonProps } from '../../../types/CustomButtonProps';
import { useTheme } from '@mui/material/styles';
import { fontWeight } from '@mui/system';


const getSizeStyles = (size: string) => {
  switch (size) {
    case 'small':
      return { height: '36px', padding: '6px 12px', fontSize: '14px' };
    case 'medium':
      return { height: '40px', padding: '8px 16px', fontSize: '16px' };
    case 'large':
      return { height: '48px', padding: '10px 20px', fontSize: '18px' };
    case 'fullwidth':
      return { width: '100%', height: '48px', padding: '10px 20px', fontSize: '18px' };
    default:
      return {};
  }
};

const CustomButton = ({
  variant = 'primary',
  size = 'medium',
  fullWidth,
  startIcon,
  endIcon,
  loading,
  sx = {},
  ...props
}: CustomButtonProps) => {
  const sizeStyles = getSizeStyles(size);
  const theme = useTheme();

  const buttonVariants = {
    primary: {
      backgroundColor: theme.palette.DodgerBlue.main,
      borderColor: theme.palette.divider,
      borderRadius:1,
      color: theme.palette.primary.main ,
      //'&:hover': { backgroundColor: 'var(--mui-primary-hover)' },
    },
    destructive: {
      backgroundColor: 'var(--mui-destructive)',
      color: 'var(--mui-destructive-foreground)',
      '&:hover': { backgroundColor: 'var(--mui-destructive-hover)' },
    },
    outline: {
      border: '1px solid ',
      backgroundColor: 'BlackPearl.main',
      borderColor: theme.palette.divider,
      borderRadius:1,
      '&:hover': {
        backgroundColor: theme.palette.EcstasyOrange.main,
        color: theme.palette.common.black,
      }
    },
    secondary: {
      backgroundColor: 'var(--mui-secondary)',
      color: 'var(--mui-secondary-foreground)',
      '&:hover': { backgroundColor: 'var(--mui-secondary-hover)' },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--mui-foreground)',
      '&:hover': { backgroundColor: 'var(--mui-accent)' },
    },
    link: {
      backgroundColor: 'transparent',
      color: 'var(--mui-primary)',
      textDecoration: 'underline',
      '&:hover': { textDecoration: 'none' },
    },
  };
  

  return (
    <ButtonBase
      className="custom-button"
      sx={{ 
        ...buttonVariants[variant], 
        ...sizeStyles, 
        ...sx
      }}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <CircularProgress size={15} />
      ) : (
        <>
          {startIcon && <span className="button-icon">{startIcon}</span>}
          {props.children}
          {endIcon && <span className="button-icon">{endIcon}</span>}
        </>
      )}
    </ButtonBase>
  );
};

export default CustomButton;
