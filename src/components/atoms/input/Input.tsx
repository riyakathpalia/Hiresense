'use client';
import { InputBase, InputBaseProps, useTheme } from '@mui/material';
import { CircularProgress } from '@mui/material';
import React from 'react';

type InputVariant = 'primary' | 'outline' | 'ghost';
type InputSize = 'small' | 'medium' | 'large';

interface CustomInputProps extends InputBaseProps {
  variant?: InputVariant;
  //size?: InputSize;
  fullWidth?: boolean;
  loading?: boolean;
  sx?: React.CSSProperties;
}

const getSizeStyles = (size: InputSize) => {
  switch (size) {
    case 'small':
      return { height: '36px', padding: '6px 12px', fontSize: '14px' };
    case 'medium':
      return { height: '40px', padding: '8px 16px', fontSize: '16px' };
    case 'large':
      return { height: '48px', padding: '10px 20px', fontSize: '18px' };
    default:
      return {};
  }
};

const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      fullWidth,
      loading,
      sx = {},
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const sizeStyles = getSizeStyles(size);

    const inputVariants = {
      primary: {
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.text.primary,
        '&:focus': {
          outline: 'none',
          boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
          borderColor: theme.palette.primary.main,
        },
      },
      outline: {
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: 'transparent',
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.text.primary,
        '&:focus': {
          outline: 'none',
          boxShadow: `0 0 0 2px ${theme.palette.secondary.main}`,
          borderColor: theme.palette.secondary.main,
        },
      },
      ghost: {
        border: 'none',
        backgroundColor: 'transparent',
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderRadius: 0,
        color: theme.palette.text.primary,
        '&:focus': {
          outline: 'none',
          borderBottomColor: theme.palette.primary.main,
        },
      },
    };

    return (
      <InputBase
        ref={ref}
        sx={{
          ...inputVariants[variant],
          ...sizeStyles,
          width: fullWidth ? '100%' : 'auto',
          '& .MuiInputBase-input': {
            padding: 0,
            '&::placeholder': {
              color: theme.palette.text.secondary,
              opacity: 1,
            },
          },
          '&.Mui-disabled': {
            cursor: 'not-allowed',
            opacity: 0.5,
          },
          ...sx,
        }}
        endAdornment={loading ? <CircularProgress size={20} /> : props.endAdornment}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };