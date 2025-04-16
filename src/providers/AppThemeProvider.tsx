"use client"
import { useEffect, useState } from "react";
import { PaletteMode, createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import React from "react";

import components from "@/theme/components";
import getPalette from "@/theme/palettes";
import { breakpoints } from "@/theme/breakpoints";


export const ColorModeContext = React.createContext({ toggleColorMode: () => { } });


export default function AppThemeProvider({ children }: any) {
  const [mode, setMode] = useState<PaletteMode>('dark');

  // Initial theme configuration
  const initialTheme = createTheme({
    breakpoints,
    palette: getPalette(mode),
    components,
  });


  // Declare the 'theme' variable and apply the custom button styles
  const [theme, setTheme] = useState(initialTheme);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    // Check for dark mode preference on the client side
    setTheme((prevTheme) =>
      createTheme({
        ...prevTheme,
        palette: {
          ...prevTheme.palette,
          mode: mode,
        },
        //components,
      }),
    );
  }, [mode]);

  return (
    <ThemeProvider theme={theme} key={theme.palette.mode}>
      <CssBaseline />
      <ColorModeContext.Provider value={{ toggleColorMode: toggleTheme }}>{children}</ColorModeContext.Provider>
    </ThemeProvider>
  );
}
