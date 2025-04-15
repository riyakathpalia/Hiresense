import * as React from "react";
import {
  Menu,
  MenuItem,
  MenuProps,
  MenuItemProps,
  Divider,
  Checkbox,
  Radio,
  ListItemIcon,
  ListItemText,
  Typography,
  styled,
  alpha,
} from "@mui/material";
import {
  ArrowRight as ChevronRight,
  Check,
  Circle,
} from "@mui/icons-material";

// Styled components for MUI
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={2}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    minWidth: 180,
    color: theme.palette.mode === "light" ? "rgb(55, 65, 81)" : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const StyledMenuItem = styled((props: MenuItemProps) => (
  <MenuItem {...props} />
))(({ theme }) => ({
  fontSize: "0.875rem",
  padding: "6px 12px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:focus": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const DropdownMenu = (props: MenuProps) => {
  return <StyledMenu {...props} />;
};

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, any>((props, ref) => {
  return <button ref={ref} {...props} />;
});

const DropdownMenuContent = React.forwardRef<HTMLDivElement, MenuProps>((props, ref) => {
  return <DropdownMenu ref={ref} {...props} />;
});

const DropdownMenuItem = React.forwardRef<HTMLLIElement, MenuItemProps & { inset?: boolean }>(
  ({ inset, ...props }, ref) => {
    return (
      <StyledMenuItem
        ref={ref}
        sx={{ paddingLeft: inset ? 4 : 2 }}
        {...props}
      />
    );
  }
);

const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLLIElement,
  MenuItemProps & { checked?: boolean }
>(({ checked, children, ...props }, ref) => {
  return (
    <StyledMenuItem ref={ref} {...props}>
      <Checkbox
        size="small"
        checked={checked}
        sx={{ padding: "4px", marginRight: "8px" }}
      />
      {children}
    </StyledMenuItem>
  );
});

const DropdownMenuRadioItem = React.forwardRef<
  HTMLLIElement,
  MenuItemProps & { checked?: boolean }
>(({ checked, children, ...props }, ref) => {
  return (
    <StyledMenuItem ref={ref} {...props}>
      <Radio
        size="small"
        checked={checked}
        icon={<Circle sx={{ fontSize: "0.5rem" }} />}
        checkedIcon={<Circle sx={{ fontSize: "0.5rem" }} />}
        sx={{ padding: "4px", marginRight: "8px" }}
      />
      {children}
    </StyledMenuItem>
  );
});

const DropdownMenuLabel = styled((props: MenuItemProps & { inset?: boolean }) => {
  const { inset, ...rest } = props;
  return <MenuItem {...rest} />;
})(({ theme, inset }) => ({
  fontSize: "0.75rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  paddingLeft: inset ? theme.spacing(4) : theme.spacing(2),
  "&:hover": {
    backgroundColor: "transparent",
    cursor: "default",
  },
}));

const DropdownMenuSeparator = () => {
  return <Divider sx={{ my: 0.5 }} />;
};

const DropdownMenuShortcut = styled(Typography)(({ theme }) => ({
  marginLeft: "auto",
  fontSize: "0.75rem",
  letterSpacing: "0.1em",
  opacity: 0.6,
}));

// Submenu components
const DropdownMenuSubTrigger = React.forwardRef<
  HTMLLIElement,
  MenuItemProps & { inset?: boolean }
>(({ inset, children, ...props }, ref) => {
  return (
    <StyledMenuItem
      ref={ref}
      sx={{ paddingLeft: inset ? 4 : 2 }}
      {...props}
    >
      <ListItemText>{children}</ListItemText>
      <ChevronRight fontSize="small" />
    </StyledMenuItem>
  );
});

const DropdownMenuSubContent = styled((props: MenuProps) => (
  <Menu
    elevation={2}
    anchorOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    minWidth: 180,
    marginLeft: theme.spacing(0.5),
  },
}));

// Group components
const DropdownMenuGroup = (props: { children: React.ReactNode }) => {
  return <div>{props.children}</div>;
};

const DropdownMenuRadioGroup = (props: { children: React.ReactNode }) => {
  return <div>{props.children}</div>;
};

// Portal component (not typically needed in MUI as it handles portals internally)
const DropdownMenuPortal = (props: { children: React.ReactNode }) => {
  return <>{props.children}</>;
};

// Sub component (for managing submenu state)
const DropdownMenuSub = (props: { children: React.ReactNode }) => {
  return <>{props.children}</>;
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};