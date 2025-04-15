import * as React from "react";
import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  DialogContentText as MuiDialogContentText,
  IconButton,
  Slide,
  Fade,
  Box,
  styled,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Close } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogRoot = MuiDialog;

const DialogTrigger = ({ children }: { children: React.ReactElement<{ onClick?: (event: React.MouseEvent) => void }> }) => {
  return React.cloneElement(children, {
    onClick: (event: React.MouseEvent) => {
      if (children.props.onClick) {
        children.props.onClick(event);
      }
    },
  });
};

const DialogOverlay = styled("div")(({ theme }) => ({
  position: "fixed",
  inset: 0,
  zIndex: theme.zIndex.modal,
  backgroundColor: "rgba(0, 0, 0, 0.8)",
}));

const DialogContent = React.forwardRef<
  HTMLDivElement,
  MuiDialogProps & { className?: string }
>(({ className, children, ...props }, ref) => {
  return (
    <DialogRoot
      TransitionComponent={Transition}
      ref={ref}
      {...props}
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "calc(100% - 64px)",
          width: "100%",
          maxHeight: "calc(100% - 64px)",
          margin: 0,
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          p: 3,
        },
      }}
    >
      <Fade in={props.open}>
        <DialogOverlay />
      </Fade>
      <MuiDialogContent>
        {children}
        <IconButton
          aria-label="close"
          onClick={props.onClose as any}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </MuiDialogContent>
    </DialogRoot>
  );
});

DialogContent.displayName = "DialogContent";

const DialogHeader = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  textAlign: "center",
  [theme.breakpoints.up("sm")]: {
    textAlign: "left",
  },
}));

const DialogFooter = styled(MuiDialogActions)(({ theme }) => ({
  display: "flex",
  flexDirection: "column-reverse",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
}));

const DialogTitle = styled(MuiDialogTitle)(({ theme }) => ({
  margin: 0,
  padding: 0,
  fontSize: theme.typography.h6.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  lineHeight: theme.typography.h6.lineHeight,
  letterSpacing: "0.0075em",
}));

const DialogDescription = styled(MuiDialogContentText)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
}));

export {
  DialogRoot as Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogOverlay,
};