import { Components, Theme } from "@mui/material/styles";

const components: Components<Omit<Theme, "components">> = {
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none',
            },
        },
    },
   
};

export default components;
