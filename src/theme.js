import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#9c27b0", // Purple for primary color
      contrastText: "#ffffff", // White text for contrast
    },
    secondary: {
      main: "#ba68c8", // Lighter purple for secondary color
      contrastText: "#ffffff",
    },
    background: {
      default: "#f3e5f5", // Light purple background
      paper: "#ffffff",
    },
    text: {
      primary: "#4a148c", // Darker purple for text
      secondary: "#6a1b9a", // Accent text color
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "20px", // Rounded buttons
          textTransform: "none", // No capitalization in text
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ce93d8", // Softer purple for dark mode primary
      contrastText: "#000000", // Dark text for contrast
    },
    secondary: {
      main: "#ab47bc", // Slightly brighter purple for secondary
      contrastText: "#ffffff",
    },
    background: {
      default: "#2c1338", // Dark purple background
      paper: "#3c1a4d", // Slightly lighter dark purple for paper
    },
    text: {
      primary: "#f3e5f5", // Light text for contrast
      secondary: "#d1c4e9", // Subtle accent for text
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "20px", // Rounded buttons
          textTransform: "none", // No capitalization in text
        },
      },
    },
  },
});
