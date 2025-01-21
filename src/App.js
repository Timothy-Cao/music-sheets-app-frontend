import React, { useState } from "react";
import InputForm from "./InputForm";
import DisplayEntries from "./DisplayEntries";
import { Box, Grid, Typography, Switch, FormControlLabel } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : darkTheme}>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <Grid container>
          <Grid
            item
            xs={3}
            sx={{ backgroundColor: "background.paper", borderRight: "1px solid", borderColor: "divider" }}
          >
            <Box sx={{ padding: 2 }}>
              <Typography variant="h2">Music Sheets</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={isDarkMode}
                    onChange={handleThemeToggle}
                    name="themeSwitch"
                    color="primary"
                  />
                }
                label={isDarkMode ? "Dark Mode" : "Light Mode"}
              />
              <InputForm />
            </Box>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h6" sx={{ padding: 2 }}>
              Music Sheets Collection
            </Typography>
            <DisplayEntries />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
