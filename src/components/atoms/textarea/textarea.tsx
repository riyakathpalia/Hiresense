import * as React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";

const Textarea = React.forwardRef<HTMLTextAreaElement, Omit<TextFieldProps, "color">>(
  ({ className, ...props }, ref) => {
    return (
      <TextField
        inputRef={ref}
        multiline
        minRows={3}
        fullWidth
        className={className}
        variant="outlined"
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
export type { TextFieldProps as TextareaProps };