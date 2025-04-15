import { PaletteMode } from "@mui/material";

const createColor = (main: string, light?: string) => ({
  light: light || main,
  main: main,
  dark: main,
  contrastText: "#fff",
});


declare module "@mui/material/styles" {
  interface Palette {
    DodgerBlue: Palette["primary"];
    borderColor: Palette["primary"];
    EcstasyOrange: Palette["primary"];
    BlueMirage: Palette["primary"];
    GullyGray: Palette["primary"];
    BlackPearl: Palette["primary"];
  }
  interface PaletteOptions {
    DodgerBlue: Palette["primary"];
    borderColor: Palette["primary"];
    EcstasyOrange: Palette["primary"];
    BlueMirage: Palette["primary"];
    GullyGray: Palette["primary"];
    BlackPearl: Palette["primary"];
  }
}

const getPalette = (mode: PaletteMode) => ({
  mode,
  primary: createColor(
    mode === "dark" ? "#010101" : "#212121", // Main 
    mode === "dark" ? "#ffffff" : "#212121" // Light
  ),
  DodgerBlue: createColor(
    mode === "dark" ? "#3B82F6" : "#e0e0e0",
  ),
  BlackPearl: createColor(
    mode === "dark" ? "#020817" : "#e0e0e0",
  ),
  EcstasyOrange: createColor(
    mode === "dark" ? "#F87116" : "#F87116", // Main
  ),
  BlueMirage: createColor(
    mode === "dark" ? "#1E293B" : "#F87116", // Main
  ),
  GullyGray: createColor(
    mode === "dark" ? "#94A3B8" : "#F87116", // Main
  ),
  colorDisabled: createColor(
    mode === "dark" ? "#9C9C9C" : "#9C9C9C",
  ),
  borderColor: createColor(
    mode === "dark" ? "#212121" : "#e0e0e0", // Main
    mode === "dark" ? "#0C0C0C" : "#e0e0e0" // Light
  ),

  background: {
    default: mode === "dark" ? "#020817" : "#ffffff",
    paper: mode === "dark" ? "#020817" : "#f5f5f5",
  },
  text: {
    primary: mode === "dark" ? "#ffffff" : "#212121",
    secondary: mode === "dark" ? "#bdbdbd" : "#616161",
  },
});

export default getPalette;
