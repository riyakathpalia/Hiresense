```
import * as React from "react";
import { 
  Tabs as MuiTabs,
  Tab as MuiTab,
  Box,
  TabsProps as MuiTabsProps,
  TabProps as MuiTabProps,
  styled
} from "@mui/material";

const Tabs = styled(MuiTabs)({
  // Root styles if needed
});

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof Box> {
  orientation?: "horizontal" | "vertical";
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <Box
      ref={ref}
      className={className}
      sx={{
        display: "inline-flex",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        
        borderRadius: 1,
        backgroundColor: "background.default",
        color: "text.secondary",
        p: 0.5,
        ...(orientation === "vertical" && {
          flexDirection: "column",
          height: "auto",
          alignItems: "flex-start"
        })
      }}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

const TabsTrigger = styled(MuiTab)(({ theme }) => ({
  "&.MuiTab-root": {
    minWidth: "auto",
    minHeight: "auto",
    padding: theme.spacing(1, 3),
    borderRadius: theme.shape.borderRadius / 2, // rounded-sm equivalent
    textTransform: "none",
    fontSize: "0.875rem",
    fontWeight: theme.typography.fontWeightMedium,
    color: "text.secondary",
    transition: theme.transitions.create(["background-color", "color", "box-shadow"], {
      duration: theme.transitions.duration.short,
    }),
    "&:focus-visible": {
      outline: "none",
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    },
    "&.Mui-disabled": {
      pointerEvents: "none",
      opacity: 0.5,
    },
    "&.Mui-selected": {
      backgroundColor: "background.paper",
      color: "text.primary",
      boxShadow: theme.shadows[1],
    },
  }
}));
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof Box> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => (
    <Box
      ref={ref}
      className={className}
      role="tabpanel"
      sx={{
        mt: 2,
        "&:focus-visible": {
          outline: "none",
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
        }
      }}
      {...props}
    />
  )
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
```