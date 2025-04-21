import * as React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";


export interface TextareaProps extends Omit<TextFieldProps, "color"> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextField
        inputRef={ref}
        multiline
        minRows={3}
        fullWidth
        variant="outlined"
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
